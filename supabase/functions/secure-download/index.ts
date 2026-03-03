import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

        // Get the JWT from the Authorization header
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('No authorization header')
        }

        // Verify the user
        const {
            data: { user },
            error: userError,
        } = await supabaseClient.auth.getUser()

        if (userError || !user) {
            throw new Error('Unauthorized')
        }

        // Get product ID from request
        const { productId } = await req.json()

        if (!productId) {
            throw new Error('Product ID is required')
        }

        // Check if user has purchased this product
        const { data: order, error: orderError } = await supabaseClient
            .from('orders')
            .select('*, products(*)')
            .eq('user_id', user.id)
            .eq('product_id', productId)
            .eq('status', 'completed')
            .single()

        if (orderError || !order) {
            throw new Error('Product not purchased or order not found')
        }

        // Check if it's a subscription and if it's still active
        if (order.products.is_subscription) {
            const { data: subscription, error: subError } = await supabaseClient
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .eq('product_id', productId)
                .eq('status', 'active')
                .single()

            if (subError || !subscription) {
                throw new Error('Subscription expired or not found')
            }

            // Check if subscription has expired
            const expiryDate = new Date(subscription.expiry_date)
            if (expiryDate < new Date()) {
                throw new Error('Subscription has expired')
            }
        }

        // Get the file path from the product
        const filePath = order.products.file_path

        if (!filePath) {
            throw new Error('No file associated with this product')
        }

        // Generate a signed URL for the download (valid for 1 hour)
        const { data: signedUrlData, error: signedUrlError } = await supabaseClient
            .storage
            .from('product-files')
            .createSignedUrl(filePath, 3600)

        if (signedUrlError) {
            throw new Error('Failed to generate download URL')
        }

        // Log the download
        await supabaseClient.from('downloads').insert({
            user_id: user.id,
            product_id: productId,
            order_id: order.id,
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown',
        })

        return new Response(
            JSON.stringify({
                success: true,
                downloadUrl: signedUrlData.signedUrl,
                expiresIn: 3600,
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message,
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
