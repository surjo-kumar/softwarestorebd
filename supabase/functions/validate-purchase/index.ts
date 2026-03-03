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
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
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
        } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))

        if (userError || !user) {
            throw new Error('Unauthorized')
        }

        // Get purchase data from request
        const { productId, paymentId, paymentMethod, couponCode, affiliateCode } = await req.json()

        if (!productId || !paymentId) {
            throw new Error('Product ID and Payment ID are required')
        }

        // Get product details
        const { data: product, error: productError } = await supabaseClient
            .from('products')
            .select('*')
            .eq('id', productId)
            .eq('is_active', true)
            .single()

        if (productError || !product) {
            throw new Error('Product not found or inactive')
        }

        let finalAmount = product.price
        let discountAmount = 0

        // Apply coupon if provided
        if (couponCode) {
            const { data: coupon, error: couponError } = await supabaseClient
                .from('coupons')
                .select('*')
                .eq('code', couponCode)
                .eq('is_active', true)
                .single()

            if (!couponError && coupon) {
                // Check if coupon is valid
                const now = new Date()
                const validFrom = new Date(coupon.valid_from)
                const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null

                if (now >= validFrom && (!validUntil || now <= validUntil)) {
                    // Check usage limits
                    if (!coupon.max_uses || coupon.current_uses < coupon.max_uses) {
                        // Check minimum purchase amount
                        if (product.price >= coupon.min_purchase_amount) {
                            // Calculate discount
                            if (coupon.discount_type === 'percentage') {
                                discountAmount = (product.price * coupon.discount_value) / 100
                            } else {
                                discountAmount = coupon.discount_value
                            }
                            finalAmount = Math.max(0, product.price - discountAmount)

                            // Update coupon usage
                            await supabaseClient
                                .from('coupons')
                                .update({ current_uses: coupon.current_uses + 1 })
                                .eq('id', coupon.id)
                        }
                    }
                }
            }
        }

        // Create order
        const { data: order, error: orderError } = await supabaseClient
            .from('orders')
            .insert({
                user_id: user.id,
                product_id: productId,
                status: 'completed',
                amount: finalAmount,
                payment_id: paymentId,
                payment_method: paymentMethod,
                coupon_code: couponCode || null,
                discount_amount: discountAmount,
                affiliate_code: affiliateCode || null,
            })
            .select()
            .single()

        if (orderError) {
            throw new Error('Failed to create order')
        }

        // If it's a subscription, create subscription record
        if (product.is_subscription && product.subscription_duration_days) {
            const expiryDate = new Date()
            expiryDate.setDate(expiryDate.getDate() + product.subscription_duration_days)

            await supabaseClient.from('subscriptions').insert({
                user_id: user.id,
                product_id: productId,
                order_id: order.id,
                status: 'active',
                expiry_date: expiryDate.toISOString(),
            })
        }

        // If it's a license product, assign a license
        if (product.is_license) {
            // Get an available license
            const { data: license, error: licenseError } = await supabaseClient
                .from('licenses')
                .select('*')
                .eq('product_id', productId)
                .is('user_id', null)
                .eq('status', 'active')
                .limit(1)
                .single()

            if (!licenseError && license) {
                // Assign license to user
                await supabaseClient
                    .from('licenses')
                    .update({
                        user_id: user.id,
                        order_id: order.id,
                        status: 'used',
                    })
                    .eq('id', license.id)
            }
        }

        // Handle affiliate commission
        if (affiliateCode) {
            const { data: affiliate, error: affiliateError } = await supabaseClient
                .from('affiliates')
                .select('*')
                .eq('affiliate_code', affiliateCode)
                .eq('status', 'approved')
                .single()

            if (!affiliateError && affiliate) {
                const commissionAmount = (finalAmount * affiliate.commission_rate) / 100

                // Create earning record
                await supabaseClient.from('affiliate_earnings').insert({
                    affiliate_id: affiliate.id,
                    order_id: order.id,
                    commission_amount: commissionAmount,
                    status: 'pending',
                })

                // Update affiliate totals
                await supabaseClient
                    .from('affiliates')
                    .update({
                        total_earnings: affiliate.total_earnings + commissionAmount,
                        total_referrals: affiliate.total_referrals + 1,
                    })
                    .eq('id', affiliate.id)
            }
        }

        // Log analytics event
        await supabaseClient.from('analytics_events').insert({
            user_id: user.id,
            event_type: 'purchase',
            event_data: {
                product_id: productId,
                order_id: order.id,
                amount: finalAmount,
                discount_amount: discountAmount,
            },
        })

        return new Response(
            JSON.stringify({
                success: true,
                order: order,
                message: 'Purchase completed successfully',
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
