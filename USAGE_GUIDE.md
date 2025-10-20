# Blog Customization Guide

This guide explains how to customize every element of your blog without needing coding knowledge.

## 📁 File Structure Overview

```
app/
├── layout.tsx          # Main site layout & metadata
├── page.tsx            # Homepage content
├── global.css          # All styling & colors
├── components/         # Reusable components
│   ├── nav.tsx         # Top navigation links
│   ├── footer.tsx      # Footer links & copyright
│   ├── posts.tsx       # Blog post listing
│   └── mdx.tsx         # Blog post rendering
├── blog/               # Blog functionality
│   ├── page.tsx        # Blog listing page
│   ├── [slug]/page.tsx # Individual blog posts
│   ├── utils.ts        # Blog post processing
│   └── posts/          # Your blog posts (.md files)
└── og/route.tsx        # Social media preview images
```

---

## 🏠 Homepage Customization

**File:** `app/page.tsx`

### What You Can Change:
- **Page Title:** Line 7 - "My Portfolio"
- **Description:** Lines 10-14 - The paragraph about yourself
- **Blog Posts:** Line 17 - Controls if blog posts show on homepage

### Example Changes:
```javascript
// Change the title
<h1 className="mb-8 text-2xl font-semibold tracking-tighter">
  Your Name's Blog
</h1>

// Change the description
<p className="mb-4">
  I'm a writer who loves sharing thoughts about technology, 
  productivity, and life. This blog is where I explore ideas 
  and connect with readers.
</p>
```

---

## 🧭 Navigation Links (Top of Page)

**File:** `app/components/nav.tsx`

### Current Links:
- `home` → `/` (homepage)
- `blog` → `/blog` (blog page)
- `deploy` → Vercel template link

### How to Customize:
```javascript
const navItems = {
  '/': {
    name: 'home',
  },
  '/blog': {
    name: 'blog',
  },
  '/about': {           // Add new page
    name: 'about',
  },
  'https://yourwebsite.com': {  // External link
    name: 'portfolio',
  },
}
```

### To Remove a Link:
Delete the entire line from the `navItems` object.

---

## 🔗 Footer Links (Bottom of Page)

**File:** `app/components/footer.tsx`

### Current Links:
- `rss` → `/rss` (RSS feed)
- `github` → GitHub link
- `view source` → Vercel template

### How to Customize:
```javascript
// Change GitHub link
<a href="https://your-github.com">
  <p className="ml-2 h-7">github</p>
</a>

// Change RSS text
<a href="/rss">
  <p className="ml-2 h-7">subscribe</p>
</a>

// Add new link
<li>
  <a href="https://twitter.com/yourusername">
    <ArrowIcon />
    <p className="ml-2 h-7">twitter</p>
  </a>
</li>
```

### To Remove a Link:
Delete the entire `<li>` block (lines 22-32, 33-43, or 44-54).

---

## 🎨 Colors & Styling

**File:** `app/global.css`

### Main Color Variables:
- **Selection Color:** Line 4 - `#47a3f3` (blue highlight)
- **Dark Mode Colors:** Lines 20-30
- **Code Syntax Colors:** Lines 8-18

### To Change Colors:
```css
/* Change selection color */
::selection {
  background-color: #your-color;
  color: #your-text-color;
}

/* Change dark mode colors */
@media (prefers-color-scheme: dark) {
  :root {
    --sh-class: #your-color;
    --sh-identifier: #your-color;
  }
}
```

---

## 📝 Blog Posts

**Directory:** `app/blog/posts/`

### Adding New Posts:
1. Create a new `.md` file in the `posts` folder
2. Add frontmatter at the top:
```markdown
---
title: 'Your Post Title'
publishedAt: '2024-01-15'
summary: 'Brief description of your post'
---
Your post content goes here...
```

### Required Frontmatter:
- `title` - Post title
- `publishedAt` - Date (YYYY-MM-DD format)
- `summary` - Brief description (optional)

### Post Features:
- **Headings:** Use `#`, `##`, `###` for different sizes
- **Links:** `[text](url)`
- **Images:** `![alt text](image-url)`
- **Code:** Use backticks for inline code
- **Code Blocks:** Use triple backticks

---

## 🔍 SEO & Metadata

**File:** `app/layout.tsx`

### Site Information:
- **Site Title:** Line 14 - "Next.js Portfolio Starter"
- **Description:** Line 17 - "This is my portfolio."
- **Site Name:** Line 22 - "My Portfolio"

### To Customize:
```javascript
export const metadata: Metadata = {
  title: {
    default: 'Your Blog Name',
    template: '%s | Your Blog Name',
  },
  description: 'Your blog description for search engines.',
  openGraph: {
    title: 'Your Blog Name',
    description: 'Your blog description.',
    siteName: 'Your Blog Name',
  },
}
```

---

## 🌐 Domain & URLs

**File:** `app/sitemap.ts`

### Base URL:
- **Line 3:** `https://portfolio-blog-starter.vercel.app`

### To Change:
```javascript
export const baseUrl = 'https://yourdomain.com'
```

---

## 📱 Social Media Previews

**File:** `app/og/route.tsx`

### Preview Image:
- **Line 5:** Default title for preview images
- **Lines 9-15:** Preview image layout

### To Customize:
```javascript
let title = url.searchParams.get('title') || 'Your Blog Name'
```

---

## 📰 RSS Feed

**File:** `app/rss/route.ts`

### RSS Information:
- **Line 30:** Feed title
- **Line 32:** Feed description

### To Customize:
```javascript
<title>Your Blog Name</title>
<description>Your blog RSS feed description</description>
```

---

## 🚫 404 Page

**File:** `app/not-found.tsx`

### Customize:
- **Line 5:** 404 page title
- **Line 7:** 404 page message

---

## 🛠️ Quick Customization Checklist

### Essential Changes:
1. **Site Name:** `app/layout.tsx` (lines 14, 17, 22)
2. **Homepage Content:** `app/page.tsx` (lines 7, 10-14)
3. **Navigation:** `app/components/nav.tsx` (lines 3-13)
4. **Footer:** `app/components/footer.tsx` (lines 22-54)
5. **Domain:** `app/sitemap.ts` (line 3)

### Optional Changes:
- **Colors:** `app/global.css`
- **404 Page:** `app/not-found.tsx`
- **RSS Feed:** `app/rss/route.ts`
- **Social Previews:** `app/og/route.tsx`

---

## 📋 Adding New Pages

### To Add a New Page:
1. Create a new file: `app/your-page/page.tsx`
2. Add the page to navigation in `app/components/nav.tsx`
3. Add the page to sitemap in `app/sitemap.ts`

### Example New Page:
```javascript
// app/about/page.tsx
export default function About() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        About Me
      </h1>
      <p className="mb-4">
        Your about page content here...
      </p>
    </section>
  )
}
```

---

## 🎯 Pro Tips

1. **Always backup** your files before making changes
2. **Test changes** by running `npm run dev` and visiting `http://localhost:3000`
3. **Use simple text** - avoid special characters in file names
4. **Keep descriptions short** - under 160 characters for SEO
5. **Use consistent formatting** in your blog posts

---

## 🆘 Troubleshooting

### Common Issues:
- **Changes not showing:** Restart the dev server (`Ctrl+C` then `npm run dev`)
- **Broken links:** Check that URLs start with `/` for internal links
- **Styling issues:** Check that you're editing the right file
- **Blog posts not appearing:** Make sure they have proper frontmatter

### Getting Help:
- Check the terminal for error messages
- Make sure all files are saved
- Verify that your changes are in the correct files
