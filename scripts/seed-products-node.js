
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const demoProducts = [
    {
        title: "ChatGPT Plus (Shared)",
        description: "Get access to GPT-4 with shared account access. Instant delivery.",
        price: 4.99,
        category: "chatgpt",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
        is_subscription: true,
        featured: true,
    },
    {
        title: "Gemini Advanced 1 Month",
        description: "Unlock Google's most capable AI model, Ultra 1.0.",
        price: 9.99,
        category: "gemini",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg",
        is_subscription: true,
        featured: true,
    },
    {
        title: "Midjourney Pro Shared",
        description: "Create stunning AI art with Midjourney v6.",
        price: 14.99,
        category: "other",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Midjourney_Emblem.png",
        is_subscription: true,
        featured: false,
    },
    {
        title: "Claude 3 Opus Access",
        description: "Access to Anthropic's most powerful AI model.",
        price: 19.99,
        category: "other",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/7/77/Anthropic_logo.svg",
        is_subscription: true,
        featured: true,
    },
    {
        title: "Netflix Premium 4K",
        description: "Watch in 4K UHD. 1 Profile. 30 Days Warranty.",
        price: 3.99,
        category: "netflix",
        thumbnail_url: "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png",
        is_subscription: true,
        featured: true,
    },
    {
        title: "Spotify Premium Individual",
        description: "Ad-free music listening. Download songs. Unlimited skips.",
        price: 2.99,
        category: "other",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
        is_subscription: true,
        featured: false,
    },
    {
        title: "YouTube Premium",
        description: "Ad-free YouTube and YouTube Music. Background play.",
        price: 3.49,
        category: "other",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
        is_subscription: true,
        featured: false,
    },
    {
        title: "Disney+ Premium",
        description: "Stream Disney, Pixar, Marvel, Star Wars, and National Geographic.",
        price: 2.99,
        category: "other",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
        is_subscription: true,
        featured: false,
    },
    {
        title: "Windows 11 Pro Key",
        description: "Genuine retail key for Windows 11 Pro. Lifetime activation.",
        price: 12.99,
        category: "software",
        is_license: true,
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Windows_11_logo.svg",
        featured: true,
    },
    {
        title: "Office 2021 Professional Plus",
        description: "Full version of Microsoft Office 2021. Lifetime license.",
        price: 19.99,
        category: "software",
        is_license: true,
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Microsoft_Office_logo_%282013%E2%80%932019%29.svg",
        featured: false,
    },
    {
        title: "Internet Download Manager (IDM)",
        description: "Lifetime license for the world's fastest download manager.",
        price: 14.99,
        category: "software",
        is_license: true,
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Internet_Download_Manager_logo.png/600px-Internet_Download_Manager_logo.png",
        featured: false,
    },
    {
        title: "NordVPN 1 Year Account",
        description: "Secure internet access with world's leading VPN.",
        price: 19.99,
        category: "software",
        is_subscription: true,
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/a/ae/NordVPN_2020_logo.svg",
        featured: false,
    },
    {
        title: "Adobe Creative Cloud All Apps",
        description: "Access to all Adobe apps including Photoshop, Illustrator, etc.",
        price: 29.99,
        category: "software",
        is_subscription: true,
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/4/42/Adobe_Creative_Cloud_2020_logo.svg",
        featured: true,
    },
    {
        title: "Canva Pro Invite",
        description: "Join a Canva Pro team and get all premium features.",
        price: 4.99,
        category: "software",
        is_subscription: true,
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
        featured: false,
    }
];

async function seed() {
    console.log('Seeding products...');

    const { error } = await supabase
        .from('products')
        .insert(demoProducts);

    if (error) {
        console.error('Error seeding products:', error);
    } else {
        console.log('Successfully seeded products!');
    }
}

seed();
