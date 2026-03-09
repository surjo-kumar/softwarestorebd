"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
    {
        name: "Mashfique Ahmed",
        review: "Very fast and top-notch service. Got my ChatGPT Plus account instantly. Highly recommended! 🔥",
        rating: 5,
        product: "ChatGPT Plus",
    },
    {
        name: "Sakil Munna",
        review: "I got excellent service 👌 The delivery was instant and the subscription is working perfectly.",
        rating: 5,
        product: "Canva Pro",
    },
    {
        name: "Fyad Irfan",
        review: "Fast delivery, Recommended. Best prices in Bangladesh for premium software subscriptions.",
        rating: 5,
        product: "Grammarly Premium",
    },
    {
        name: "Jahid Al Hassan",
        review: "I would recommend them, they are reliable. Have been using their services for months now.",
        rating: 5,
        product: "Netflix Premium",
    },
];

export default function Reviews() {
    return (
        <section className="px-4 py-8 bg-gray-50/50">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-5"
            >
                <h2 className="section-heading text-lg font-bold text-gray-900">Customer Reviews</h2>
            </motion.div>

            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-1 px-1">
                {reviews.map((review, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="min-w-[260px] max-w-[280px] flex-shrink-0"
                    >
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-full hover:shadow-md transition-shadow">
                            {/* Quote icon */}
                            <Quote className="h-5 w-5 text-primary/30 mb-2" />

                            {/* Review text */}
                            <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-3">
                                {review.review}
                            </p>

                            {/* Stars */}
                            <div className="flex items-center gap-0.5 mb-3">
                                {[...Array(review.rating)].map((_, j) => (
                                    <Star key={j} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* User info */}
                            <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900">{review.name}</p>
                                    <p className="text-[10px] text-gray-400">Purchased: {review.product}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
