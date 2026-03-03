
"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, ThumbsUp, MoreHorizontal, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const reviews = [
    {
        name: "Mashfique Ahmed",
        username: "recommends Digitalproductsbd.com",
        time: "2 d",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        review: "Very fast and top-notch service",
        reaction: "Love",
        likes: "You and others",
    },
    {
        name: "Sakil Munna",
        username: "recommends Digitalproductsbd.com",
        time: "1 d",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        review: "I got excellent service 👌",
        reaction: "Like",
        likes: "1 Like",
        comments: "1 comment"
    },
    {
        name: "Fyad Irfan",
        username: "recommends Digital Products BD",
        time: "13 h",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b",
        review: "Fast delivery ,Recommended",
        reaction: "Love",
        likes: "You",
        comments: "1 comment"
    },
    {
        name: "Jahid Al Hassan",
        username: "recommends Digital Products BD",
        time: "3 d",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        review: "I would recommend them they are reliable",
        reaction: "Like",
        likes: "You and 1 other",
        comments: "1 comment"
    }
];

export default function Reviews() {
    return (
        <section className="py-12 md:py-24 bg-background relative overflow-hidden">
            <div className="container px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-16"
                >
                    <h2 className="text-sm md:text-base font-bold uppercase tracking-widest text-primary mb-2">REVIEWS</h2>
                    <h3 className="text-2xl md:text-4xl font-bold">What Our Clients Say About Us?</h3>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full border-border/40 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-start space-x-4 p-4 pb-2">
                                    <Avatar className="h-10 w-10 border">
                                        <AvatarImage src={review.avatar} alt={review.name} />
                                        <AvatarFallback>{review.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex flex-wrap items-center gap-1 leading-none">
                                            <h4 className="text-sm font-semibold hover:underline cursor-pointer">{review.name}</h4>
                                            <span className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
                                                <span className={`inline-block w-2 h-2 rounded-full ${review.reaction === 'Love' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                                {review.username}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            {review.time} • <Share2 className="h-3 w-3" />
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 space-y-4">
                                    <p className="text-sm md:text-base text-card-foreground">
                                        {review.review}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                                        <div className="flex items-center gap-1">
                                            {review.reaction === 'Love' ? (
                                                <div className="bg-red-500 rounded-full p-0.5"><Heart className="w-2 h-2 text-white fill-white" /></div>
                                            ) : (
                                                <div className="bg-blue-500 rounded-full p-0.5"><ThumbsUp className="w-2 h-2 text-white fill-white" /></div>
                                            )}
                                            <span>{review.likes}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            {review.comments && <span>{review.comments}</span>}
                                        </div>
                                    </div>

                                    <div className="flex justify-between md:justify-start gap-1 md:gap-8 pt-1">
                                        <Button variant="ghost" size="sm" className={`h-8 gap-2 text-xs md:text-sm ${review.reaction === 'Love' ? 'text-red-500' : review.reaction === 'Like' ? 'text-blue-500' : 'text-muted-foreground'}`}>
                                            {review.reaction === 'Love' ? <Heart className="w-4 h-4 fill-current" /> : <ThumbsUp className="w-4 h-4" />}
                                            {review.reaction}
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs md:text-sm text-muted-foreground">
                                            <MessageCircle className="w-4 h-4" />
                                            Comment
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs md:text-sm text-muted-foreground">
                                            <Share2 className="w-4 h-4" />
                                            Share
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
