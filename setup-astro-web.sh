#!/bin/bash

# Setup Astro Web Project
# Run this from the monorepo root directory (appejv/)

set -e

echo "🌟 Setting up appejv-web (Astro)..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "appejv-app" ]; then
    echo "❌ Error: Please run this script from the monorepo root (appejv/)"
    exit 1
fi

# Create Astro project
echo "📦 Step 1: Creating Astro project..."
npm create astro@latest appejv-web -- --template minimal --install --no-git --typescript strict

# Navigate to appejv-web
cd appejv-web

# Install Tailwind CSS
echo "🎨 Step 2: Installing Tailwind CSS..."
npm install @astrojs/tailwind tailwindcss

# Create Astro config
echo "⚙️  Step 3: Configuring Astro..."
cat > astro.config.mjs << 'EOF'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  site: 'https://appejv.app',
})
EOF

# Create Tailwind config
cat > tailwind.config.mjs << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#175ead',
        secondary: '#2575be',
      },
    },
  },
  plugins: [],
}
EOF

# Create layout
echo "📄 Step 4: Creating layout..."
mkdir -p src/layouts
cat > src/layouts/Layout.astro << 'EOF'
---
interface Props {
  title: string
}

const { title } = Astro.props
---

<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content="APPE JV - Hệ thống quản lý bán hàng" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
EOF

# Create homepage
echo "🏠 Step 5: Creating homepage..."
cat > src/pages/index.astro << 'EOF'
---
import Layout from '../layouts/Layout.astro'
---

<Layout title="APPE JV - Trang chủ">
  <main class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <div class="text-2xl font-bold text-primary">APPE JV</div>
          <div class="space-x-6">
            <a href="/" class="text-gray-700 hover:text-primary">Trang chủ</a>
            <a href="/san-pham" class="text-gray-700 hover:text-primary">Sản phẩm</a>
            <a href="/gioi-thieu" class="text-gray-700 hover:text-primary">Giới thiệu</a>
            <a href="/lien-he" class="text-gray-700 hover:text-primary">Liên hệ</a>
          </div>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-20">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-primary mb-6">
          Chào mừng đến APPE JV
        </h1>
        <p class="text-2xl text-gray-700 mb-8">
          Hệ thống quản lý bán hàng chuyên nghiệp
        </p>
        <div class="space-x-4">
          <a 
            href="/san-pham" 
            class="inline-block bg-primary text-white px-8 py-4 rounded-lg hover:bg-secondary transition text-lg font-semibold"
          >
            Xem sản phẩm
          </a>
          <a 
            href="/lien-he" 
            class="inline-block bg-white text-primary px-8 py-4 rounded-lg hover:bg-gray-50 transition text-lg font-semibold border-2 border-primary"
          >
            Liên hệ ngay
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container mx-auto px-4 py-16">
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h3 class="text-2xl font-bold text-primary mb-4">Quản lý đơn hàng</h3>
          <p class="text-gray-600">
            Theo dõi và quản lý đơn hàng từ draft đến hoàn thành
          </p>
        </div>
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h3 class="text-2xl font-bold text-primary mb-4">Quản lý khách hàng</h3>
          <p class="text-gray-600">
            Lưu trữ thông tin khách hàng và lịch sử mua hàng
          </p>
        </div>
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h3 class="text-2xl font-bold text-primary mb-4">Báo cáo chi tiết</h3>
          <p class="text-gray-600">
            Thống kê doanh thu và hiệu suất bán hàng
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white mt-20">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center text-gray-600">
          <p>&copy; 2026 APPE JV Vietnam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </main>
</Layout>
EOF

# Create products page
echo "📦 Step 6: Creating products page..."
mkdir -p src/pages/san-pham
cat > src/pages/san-pham/index.astro << 'EOF'
---
import Layout from '../../layouts/Layout.astro'
---

<Layout title="Sản phẩm - APPE JV">
  <main class="min-h-screen bg-white">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <div class="text-2xl font-bold text-primary">APPE JV</div>
          <div class="space-x-6">
            <a href="/" class="text-gray-700 hover:text-primary">Trang chủ</a>
            <a href="/san-pham" class="text-primary font-semibold">Sản phẩm</a>
            <a href="/gioi-thieu" class="text-gray-700 hover:text-primary">Giới thiệu</a>
            <a href="/lien-he" class="text-gray-700 hover:text-primary">Liên hệ</a>
          </div>
        </nav>
      </div>
    </header>

    <!-- Products Section -->
    <section class="container mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold text-primary mb-8">
        Sản phẩm
      </h1>
      <p class="text-gray-600 mb-8">
        Danh sách sản phẩm sẽ được tích hợp từ API
      </p>
      
      <!-- Placeholder for products -->
      <div class="grid md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div class="bg-gray-100 p-6 rounded-lg">
            <div class="bg-gray-200 h-48 rounded mb-4"></div>
            <h3 class="text-xl font-semibold mb-2">Sản phẩm {i}</h3>
            <p class="text-gray-600 mb-4">Mô tả sản phẩm</p>
            <p class="text-primary font-bold text-lg">1.000.000 ₫</p>
          </div>
        ))}
      </div>
    </section>
  </main>
</Layout>
EOF

# Create about page
echo "ℹ️  Step 7: Creating about page..."
mkdir -p src/pages/gioi-thieu
cat > src/pages/gioi-thieu/index.astro << 'EOF'
---
import Layout from '../../layouts/Layout.astro'
---

<Layout title="Giới thiệu - APPE JV">
  <main class="min-h-screen bg-white">
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <div class="text-2xl font-bold text-primary">APPE JV</div>
          <div class="space-x-6">
            <a href="/" class="text-gray-700 hover:text-primary">Trang chủ</a>
            <a href="/san-pham" class="text-gray-700 hover:text-primary">Sản phẩm</a>
            <a href="/gioi-thieu" class="text-primary font-semibold">Giới thiệu</a>
            <a href="/lien-he" class="text-gray-700 hover:text-primary">Liên hệ</a>
          </div>
        </nav>
      </div>
    </header>

    <section class="container mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold text-primary mb-8">Giới thiệu</h1>
      <div class="prose max-w-none">
        <p class="text-lg text-gray-700 mb-4">
          APPE JV là hệ thống quản lý bán hàng chuyên nghiệp, giúp doanh nghiệp 
          quản lý đơn hàng, khách hàng và sản phẩm một cách hiệu quả.
        </p>
      </div>
    </section>
  </main>
</Layout>
EOF

# Create contact page
echo "📧 Step 8: Creating contact page..."
mkdir -p src/pages/lien-he
cat > src/pages/lien-he/index.astro << 'EOF'
---
import Layout from '../../layouts/Layout.astro'
---

<Layout title="Liên hệ - APPE JV">
  <main class="min-h-screen bg-white">
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <div class="text-2xl font-bold text-primary">APPE JV</div>
          <div class="space-x-6">
            <a href="/" class="text-gray-700 hover:text-primary">Trang chủ</a>
            <a href="/san-pham" class="text-gray-700 hover:text-primary">Sản phẩm</a>
            <a href="/gioi-thieu" class="text-gray-700 hover:text-primary">Giới thiệu</a>
            <a href="/lien-he" class="text-primary font-semibold">Liên hệ</a>
          </div>
        </nav>
      </div>
    </header>

    <section class="container mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold text-primary mb-8">Liên hệ</h1>
      <div class="max-w-2xl">
        <p class="text-lg text-gray-700 mb-8">
          Liên hệ với chúng tôi để biết thêm thông tin
        </p>
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold text-lg mb-2">Email</h3>
            <p class="text-gray-600">contact@appejv.app</p>
          </div>
          <div>
            <h3 class="font-semibold text-lg mb-2">Website</h3>
            <p class="text-gray-600">https://appejv.app</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</Layout>
EOF

# Create README
echo "📝 Step 9: Creating README..."
cat > README.md << 'EOF'
# APPE JV Web

Public website built with Astro and Tailwind CSS.

## Development

```bash
npm run dev
```

Visit http://localhost:4321

## Build

```bash
npm run build
```

## Pages

- `/` - Homepage
- `/san-pham` - Products catalog
- `/gioi-thieu` - About us
- `/lien-he` - Contact

## Tech Stack

- Astro
- Tailwind CSS
- TypeScript
EOF

cd ..

echo ""
echo "✅ appejv-web setup completed!"
echo ""
echo "🚀 To start development:"
echo "   cd appejv-web"
echo "   npm run dev"
echo ""
echo "📚 Visit: http://localhost:4321"
