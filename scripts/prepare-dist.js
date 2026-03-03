const fs = require('fs-extra');
const path = require('path');

async function prepareDist() {
    console.log('📦 Preparing dist folder for deployment...\n');

    const distDir = path.join(process.cwd(), 'dist');
    const nextDir = path.join(process.cwd(), '.next');
    const publicDir = path.join(process.cwd(), 'public');

    // Clean dist directory
    if (fs.existsSync(distDir)) {
        console.log('🧹 Cleaning existing dist folder...');
        await fs.remove(distDir);
    }

    // Create dist directory structure
    console.log('📁 Creating dist folder structure...');
    await fs.ensureDir(distDir);

    // Copy .next folder
    console.log('📋 Copying .next build folder...');
    await fs.copy(nextDir, path.join(distDir, '.next'));

    // Copy public folder if exists
    if (fs.existsSync(publicDir)) {
        console.log('📋 Copying public assets...');
        await fs.copy(publicDir, path.join(distDir, 'public'));
    }

    // Copy necessary files
    console.log('📋 Copying configuration files...');
    const filesToCopy = [
        'package.json',
        'package-lock.json',
        'next.config.js',
        '.env.local.example'
    ];

    for (const file of filesToCopy) {
        const srcPath = path.join(process.cwd(), file);
        if (fs.existsSync(srcPath)) {
            await fs.copy(srcPath, path.join(distDir, file));
        }
    }

    // Create a production package.json
    const packageJson = await fs.readJson(path.join(distDir, 'package.json'));
    const prodPackageJson = {
        name: packageJson.name,
        version: packageJson.version,
        private: packageJson.private,
        scripts: {
            start: "next start"
        },
        dependencies: packageJson.dependencies
    };

    await fs.writeJson(path.join(distDir, 'package.json'), prodPackageJson, { spaces: 2 });

    // Create README for deployment
    const readme = `# ${packageJson.name} - Production Build

## Deployment Instructions

This folder contains the production build of your Next.js application.

### Prerequisites
- Node.js 18+ installed on your server
- Environment variables configured

### Setup Steps

1. **Upload this entire \`dist\` folder to your server**

2. **Install dependencies:**
   \`\`\`bash
   npm install --production
   \`\`\`

3. **Configure environment variables:**
   - Copy \`.env.local.example\` to \`.env.local\`
   - Fill in your Supabase credentials and other environment variables

4. **Start the application:**
   \`\`\`bash
   npm start
   \`\`\`

   The app will run on port 3000 by default.

5. **For production with PM2 (recommended):**
   \`\`\`bash
   npm install -g pm2
   pm2 start npm --name "${packageJson.name}" -- start
   pm2 save
   pm2 startup
   \`\`\`

### Deployment Platforms

This build works with:
- ✅ Vercel (recommended)
- ✅ Netlify
- ✅ Railway
- ✅ Render
- ✅ DigitalOcean App Platform
- ✅ Any VPS with Node.js (Ubuntu, CentOS, etc.)
- ✅ AWS EC2, Google Cloud, Azure

### Environment Variables Required

Make sure to set these in your hosting platform or \`.env.local\`:
- \`NEXT_PUBLIC_SUPABASE_URL\`
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
- \`SUPABASE_SERVICE_ROLE_KEY\`

Built on: ${new Date().toISOString()}
`;

    await fs.writeFile(path.join(distDir, 'DEPLOYMENT.md'), readme);

    console.log('\n✅ Dist folder prepared successfully!');
    console.log(`📍 Location: ${distDir}`);
    console.log('\n📖 See DEPLOYMENT.md inside dist folder for deployment instructions.');
}

prepareDist().catch(console.error);
