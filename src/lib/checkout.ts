
import { supabase } from "@/lib/supabase/client";

export async function processCheckout(formData: FormData) {
    const productId = formData.get("productId") as string; // Optional if cartItems is provided
    const cartItemsRaw = formData.get("cartItems") as string;
    
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const paymentMethod = formData.get("payment_method") as string;
    const transactionId = formData.get("transaction_id") as string;
    const mobileNumber = formData.get("mobile_number") as string;
    
    // For single item
    const price = parseFloat(formData.get("price") as string || "0");
    const duration = formData.get("duration") as string;

    // Default status is 'pending' for manual verification methods
    const initialStatus = (paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket')
        ? 'pending'
        : 'completed';

    let itemsToProcess = [];
    
    if (cartItemsRaw) {
        try {
            itemsToProcess = JSON.parse(cartItemsRaw);
        } catch (e) {
            console.error("Failed to parse cart items");
        }
    } else if (productId) {
        itemsToProcess = [{
            id: productId,
            price: price,
            duration: duration || null,
            quantity: 1
        }];
    }

    if (itemsToProcess.length === 0) {
        return { error: "No items to checkout." };
    }

    const orderIds = [];

    for (const item of itemsToProcess) {
        // Create an order for each item/quantity (or aggregate)
        // Here we just create one order row per cart item and multiply the quantity
        // The products table might not have quantity, but amount will reflect total for that line item
        const lineTotal = item.price * (item.quantity || 1);
        
        const { data: order, error } = await supabase
            .from('orders')
            .insert({
                product_id: item.id,
                amount: lineTotal,
                customer_email: email,
                customer_name: name,
                status: initialStatus,
                payment_provider: paymentMethod,
                transaction_id: transactionId || null,
                mobile_number: mobileNumber || null,
                duration: item.duration || null
            })
            .select()
            .single();

        if (error) {
            console.error("Order creation failed for item:", item.id, error);
            // We return error but some items might have been created. Ideal would be a transaction.
            return { error: "Failed to process some items. Please contact support." };
        }
        
        orderIds.push(order.id);

        if (initialStatus === 'completed') {
            try {
                await supabase.from('purchases').insert({
                    order_id: order.id,
                    product_id: item.id,
                    user_email: email,
                });
            } catch (err) {
                console.error("Purchase record failed", err);
            }
        }
    }

    // Return the first order ID for the success page (success page can handle just showing success)
    return { success: true, orderId: orderIds[0], multiple: orderIds.length > 1 };
}
