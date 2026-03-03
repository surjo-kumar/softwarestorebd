
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-project-url';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const demoProducts = [
    // AI Tools
    {
        title: "ChatGPT Plus (Shared)",
        description: "Get access to GPT-4 with shared account access. Instant delivery.",
        long_description: "Experience the power of GPT-4 at a fraction of the cost. This is a shared account that gives you full access to ChatGPT Plus features including faster response times, priority access, and the latest model improvements.",
        price: 4.99,
        category: "chatgpt",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
        is_subscription: true,
        subscription_duration_days: 30,
        is_active: true,
        featured: true,
        tags: ["ai", "gpt4", "productivity"]
    },
    {
        title: "Gemini Advanced 1 Month",
        description: "Unlock Google's most capable AI model, Ultra 1.0.",
        long_description: "Gemini Advanced gives you access to Google's most capable AI model, Ultra 1.0. It's designed for highly complex tasks like coding, logical reasoning, following nuanced instructions, and creative collaboration.",
        price: 9.99,
        category: "gemini",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg",
        is_subscription: true,
        subscription_duration_days: 30,
        is_active: true,
        featured: true,
        tags: ["ai", "google", "gemini"]
    },
    {
        title: "Midjourney Pro Shared",
        description: "Create stunning AI art with Midjourney v6.",
        price: 14.99,
        category: "other",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Midjourney_Emblem.png",
        is_subscription: true,
        subscription_duration_days: 30,
        is_active: true,
        tags: ["ai", "art", "design"]
    },
    {
        title: "Claude 3 Opus Access",
        description: "Access to Anthropic's most powerful AI model.",
        price: 19.99,
        category: "other",
        is_subscription: true,
        subscription_duration_days: 30,
        is_active: true,
        featured: true,
        tags: ["ai", "coding", "writing"]
    },

    // Streaming Services
    {
        title: "Netflix Premium 4K",
        description: "Watch in 4K UHD. 1 Profile. 30 Days Warranty.",
        price: 3.99,
        category: "netflix",
        thumbnail_url: "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png",
        is_subscription: true,
        subscription_duration_days: 30,
        is_active: true,
        featured: true,
        tags: ["entertainment", "movie", "4k"]
    },
    {
        title: "Spotify Premium Individual",
        description: "Ad-free music listening. Download songs. Unlimited skips.",
        price: 2.99,
        category: "other",
        is_subscription: true,
        subscription_duration_days: 30,
        is_active: true,
        tags: ["music", "streaming"]
    },
    {
        title: "YouTube Premium",
        description: "Ad-free YouTube and YouTube Music. Background play.",
        price: 3.49,
        category: "other",
        is_subscription: true,
        subscription_duration_days: 30,
        is_active: true,
        tags: ["video", "music", "streaming"]
    },
    {
        title: "Disney+ Premium",
        description: "Stream Disney, Pixar, Marvel, Star Wars, and National Geographic.",
        price: 2.99,
        category: "other",
        is_subscription: true,
        subscription_duration_days: 30,
        is_active: true,
        tags: ["entertainment", "movie", "kids"]
    },
    {
        title: "Prime Video 1 Month",
        description: "Amazon Prime Video streaming with exclusive originals.",
        price: 2.49,
        category: "other",
        is_subscription: true,
        subscription_duration_days: 30,
        is_active: true,
        tags: ["entertainment", "movie", "amazon"]
    },

    // Software Licenses
    {
        title: "Windows 11 Pro Key",
        description: "Genuine retail key for Windows 11 Pro. Lifetime activation.",
        price: 12.99,
        category: "software",
        is_license: true,
        is_active: true,
        featured: true,
        tags: ["software", "windows", "os"]
    },
    {
        title: "Office 2021 Professional Plus",
        description: "Full version of Microsoft Office 2021. Lifetime license.",
        price: 19.99,
        category: "software",
        is_license: true,
        is_active: true,
        tags: ["software", "office", "productivity"]
    },
    {
        title: "Internet Download Manager (IDM)",
        description: "Lifetime license for the world's fastest download manager.",
        price: 14.99,
        category: "software",
        is_license: true,
        is_active: true,
        tags: ["software", "tool", "utility"]
    },
    {
        title: "NordVPN 1 Year Account",
        description: "Secure internet access with world's leading VPN.",
        price: 19.99,
        category: "software",
        is_subscription: true,
        subscription_duration_days: 365,
        is_active: true,
        tags: ["vpn", "security", "privacy"]
    },
    {
        title: "Adobe Creative Cloud All Apps",
        description: "Access to all Adobe apps including Photoshop, Illustrator, etc.",
        price: 29.99,
        category: "software",
        is_subscription: true,
        subscription_duration_days: 30,
        is_active: true,
        featured: true,
        tags: ["design", "creative", "adobe"]
    },
    {
        title: "Canva Pro Invite",
        description: "Join a Canva Pro team and get all premium features.",
        price: 4.99,
        category: "software",
        is_subscription: true,
        subscription_duration_days: 365,
        is_active: true,
        tags: ["design", "graphics", "canva"]
    },

    // Ebooks & Courses
    {
        title: "The Python Masterclass",
        description: "Complete guide to Python programming. From zero to hero.",
        price: 9.99,
        category: "ebooks",
        is_active: true,
        tags: ["learning", "programming", "python"]
    },
    {
        title: "100+ Instagram Reels Templates",
        description: "Viral templates for your Instagram reels. Edit in Canva.",
        price: 5.99,
        category: "other",
        is_active: true,
        tags: ["social media", "templates", "marketing"]
    },
    {
        title: "SEO Mastery Guide 2024",
        description: "Up-to-date SEO strategies to rank #1 on Google.",
        price: 14.99,
        category: "ebooks",
        is_active: true,
        tags: ["seo", "marketing", "business"]
    },
    {
        title: "Digital Marketing Blueprint",
        description: "Step-by-step framework for building a digital business.",
        price: 19.99,
        category: "ebooks",
        is_active: true,
        tags: ["marketing", "business", "guide"]
    },
    {
        title: "Freelancing Secrets",
        description: "How to get your first client and scale to $10k/month.",
        price: 12.99,
        category: "ebooks",
        is_active: true,
        tags: ["freelancing", "business", "money"]
    }
];

async function seedProducts() {
    console.log('🌱 Seeding products...');

    const { data, error } = await supabase
        .from('products')
        .upsert(demoProducts, { onConflict: 'title' })
        .select();

    if (error) {
        console.error('❌ Error seeding products:', error);
    } else {
        console.log(`✅ Successfully seeded ${data.length} products!`);
    }
}

seedProducts();
