'use server';

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const checkoutSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    productId: z.string().uuid(),
    price: z.number().min(0),
});

export async function processCheckout(formData: FormData) {
    const rawData = {
        email: formData.get("email"),
        name: formData.get("name"),
        productId: formData.get("productId"),
        price: parseFloat(formData.get("price") as string),
    };

    const paymentMethod = formData.get("payment_method") as string || 'card';

    const validatedFields = checkoutSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: "Invalid form data. Please check your inputs." };
    }

    const { email, name, productId, price } = validatedFields.data;
    const supabase = createClient();

    // 1. Create Order in Supabase
    // We assume an 'orders' table exists. If not, this will fail, but it's the right logic.
    const { data: order, error } = await supabase
        .from('orders')
        .insert({
            product_id: productId,
            amount: price,
            customer_email: email,
            customer_name: name,
            status: 'completed', // Auto-complete for simulation
            payment_provider: paymentMethod, // 'card', 'bkash', 'nagad'
        })
        .select()
        .single();

    if (error) {
        console.error("Order creation failed:", error);
        return { error: "Failed to process order. Please try again." };
    }

    // 2. (Optional) Create a 'purchase' record for file access
    // This connects the specific user/email to the product for downloads
    await supabase.from('purchases').insert({
        order_id: order.id,
        product_id: productId,
        user_email: email,
    });

    // 3. Redirect to success page
    redirect(`/checkout/success?orderId=${order.id}`);
}
