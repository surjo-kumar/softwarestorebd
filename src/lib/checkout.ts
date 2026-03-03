
import { supabase } from "@/lib/supabase/client";

export async function processCheckout(formData: FormData) {
    const productId = formData.get("productId") as string;
    const price = parseFloat(formData.get("price") as string);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const paymentMethod = formData.get("payment_method") as string;
    const transactionId = formData.get("transaction_id") as string;
    const mobileNumber = formData.get("mobile_number") as string;
    const duration = formData.get("duration") as string;

    // Default status is 'pending' for manual verification methods
    const initialStatus = (paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket')
        ? 'pending'
        : 'completed';

    const { data: order, error } = await supabase
        .from('orders')
        .insert({
            product_id: productId,
            amount: price,
            customer_email: email,
            customer_name: name,
            status: initialStatus,
            payment_provider: paymentMethod,
            transaction_id: transactionId || null,
            mobile_number: mobileNumber || null,
            duration: duration || null
        })
        .select()
        .single();

    if (error) {
        console.error("Order creation failed:", error);
        return { error: "Failed to process order. Please try again." };
    }

    // Only record 'purchases' if auto-completed (which is none now per rules, but good for future)
    if (initialStatus === 'completed') {
        try {
            await supabase.from('purchases').insert({
                order_id: order.id,
                product_id: productId,
                user_email: email,
            });
        } catch (err) {
            console.error("Purchase record failed", err);
        }
    }

    return { success: true, orderId: order.id };
}
