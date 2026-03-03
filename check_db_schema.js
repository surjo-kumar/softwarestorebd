const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Simple .env parser
const env = {};
try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    envFile.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            env[match[1].trim()] = match[2].trim();
        }
    });
} catch (e) {
    console.error('Could not read .env.local', e);
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkSchema() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error);
    } else {
        if (data && data.length > 0) {
            console.log('Keys:', Object.keys(data[0]));
            console.log('Sample:', JSON.stringify(data[0], null, 2));
        } else {
            console.log('No products found');
        }
    }
}

checkSchema();
