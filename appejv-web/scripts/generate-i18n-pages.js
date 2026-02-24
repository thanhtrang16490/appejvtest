#!/usr/bin/env node

/**
 * Script to generate English pages from Vietnamese pages
 * Usage: node scripts/generate-i18n-pages.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.join(__dirname, '..')
const pagesDir = path.join(rootDir, 'src', 'pages')

// Get language from command line argument (default: 'en')
const targetLang = process.argv[2] || 'en'
const targetDir = path.join(pagesDir, targetLang)

// Pages to generate (Vietnamese path -> Localized path)
const pagesToGenerate = {
  'index.astro': 'index.astro',
  'gioi-thieu.astro': 'about.astro',
  'lien-he.astro': 'contact.astro',
  'cau-hoi-thuong-gap.astro': 'faq.astro',
  'tai-lieu.astro': 'downloads.astro',
  'chinh-sach-bao-mat.astro': 'privacy-policy.astro',
  'dieu-khoan-su-dung.astro': 'terms-of-service.astro',
  'chinh-sach-cookie.astro': 'cookie-policy.astro',
  '404.astro': '404.astro',
  'san-pham/index.astro': 'products/index.astro',
  'san-pham/[slug].astro': 'products/[slug].astro',
  'tin-tuc/index.astro': 'news/index.astro',
  'tin-tuc/[slug].astro': 'news/[slug].astro'
}

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

const langNames = {
  'en': 'English',
  'cn': 'Chinese'
}

console.log(`🚀 Generating ${langNames[targetLang] || targetLang} pages...\n`)

Object.entries(pagesToGenerate).forEach(([viPath, localizedPath]) => {
  const sourcePath = path.join(pagesDir, viPath)
  const targetPath = path.join(targetDir, localizedPath)
  
  // Create subdirectories if needed
  const targetDirPath = path.dirname(targetPath)
  if (!fs.existsSync(targetDirPath)) {
    fs.mkdirSync(targetDirPath, { recursive: true })
  }
  
  if (fs.existsSync(sourcePath)) {
    // Read source file
    let content = fs.readFileSync(sourcePath, 'utf-8')
    
    // Calculate correct relative path depth
    const depth = localizedPath.split('/').length - 1
    const relativePrefix = depth > 0 ? '../'.repeat(depth) : ''
    
    // Add lang prop to frontmatter and fix import paths
    content = content.replace(
      /^---\n/,
      `---\nconst lang = '${targetLang}'\n`
    )
    
    // Fix import paths for layouts and components
    content = content.replace(
      /from ['"]\.\.\/layouts\//g,
      `from '${relativePrefix}../layouts/`
    )
    content = content.replace(
      /from ['"]\.\.\/components\//g,
      `from '${relativePrefix}../components/`
    )
    content = content.replace(
      /from ['"]\.\.\/lib\//g,
      `from '${relativePrefix}../lib/`
    )
    content = content.replace(
      /from ['"]\.\.\/data\//g,
      `from '${relativePrefix}../data/`
    )
    
    // Update canonical URLs
    content = content.replace(
      /canonical="\/([^"]+)"/g,
      `canonical="/${targetLang}/$1"`
    )
    
    // Update internal links
    content = content.replace(
      /href="\/(gioi-thieu|san-pham|tin-tuc|lien-he|cau-hoi-thuong-gap|tai-lieu)"/g,
      (match, p1) => {
        const mapping = {
          'gioi-thieu': 'about',
          'san-pham': 'products',
          'tin-tuc': 'news',
          'lien-he': 'contact',
          'cau-hoi-thuong-gap': 'faq',
          'tai-lieu': 'downloads'
        }
        return `href="/${targetLang}/${mapping[p1] || p1}"`
      }
    )
    
    // Write to target
    fs.writeFileSync(targetPath, content)
    console.log(`✅ Generated: /${targetLang}/${localizedPath}`)
  } else {
    console.log(`⚠️  Source not found: ${viPath}`)
  }
})

console.log(`\n✨ Done! ${langNames[targetLang] || targetLang} pages generated in src/pages/${targetLang}/`)
console.log('\n📝 Next steps:')
console.log('1. Review generated files')
console.log(`2. Update content with ${langNames[targetLang] || targetLang} translations`)
console.log('3. Test all pages')
console.log('4. Update sitemap.xml')
