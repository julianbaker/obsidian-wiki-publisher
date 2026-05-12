# Changelog

All notable changes to Obsidian Wiki Publisher.

## [1.0.0] - 2024-10-17

### Added - Obsidian Integration
- ✅ **WikiLink Support** - Full `[[Page Name]]` and `[[Page|Display]]` syntax
- ✅ **Image Embeds** - `![[image.png]]` support with alt text
- ✅ **Backlinks** - Automatic "Linked References" section on each page
- ✅ **Stub Links** - Non-existent pages display in red (Wikipedia-style)
- ✅ **Folder Notes** - Clickable folders with overview pages
- ✅ **Dataview Queries** - Basic LIST and TABLE query support
- ✅ **Vault Sync Script** - `npm run sync` to copy from Obsidian vault

### Added - Wiki Features
- ✅ **Hierarchical Sidebar** - Folder-based navigation with collapsible folders
- ✅ **Mobile Support** - Responsive design with hamburger menu
- ✅ **Wiki-style Typography** - Clean layout with blue links and section dividers
- ✅ **Table Support** - Markdown tables with proper styling
- ✅ **Optional Frontmatter** - Metadata extracted from content if not provided
- ✅ **Folder Structure Display** - Mirrors Obsidian vault organization

### Added - UI Components
- ✅ **Shadcn/ui Integration** - Modern, accessible component library
- ✅ **Sidebar Component** - Custom wiki sidebar with scroll area
- ✅ **Mobile Sheet** - Slide-out navigation for mobile
- ✅ **Button Component** - Consistent interactive elements
- ✅ **Separator Component** - Visual dividers

### Changed
- 🔄 **Removed Blog Categories** - Replaced with folder-based organization
- 🔄 **Removed Navbar** - Replaced with wiki sidebar
- 🔄 **Updated Layout** - Sidebar + main content area
- 🔄 **Renamed Project** - From "Portfolio Blog" starter to "Obsidian Wiki Publisher"
- 🔄 **Updated Styling** - Wiki-like aesthetic with improved typography
- 🔄 **Homepage** - Now displays `Welcome.md` from vault

### Technical Improvements
- ✅ **Link Graph Building** - For backlink detection
- ✅ **Recursive File Scanning** - Process nested folders
- ✅ **Slug Generation** - Consistent URL handling
- ✅ **Metadata Extraction** - Auto-generate from H1 and content
- ✅ **WikiLink Conversion** - Transform to standard markdown links
- ✅ **Dataview Processing** - Parse and render queries
- ✅ **CSS Variables** - Shadcn theme tokens for consistency
- ✅ **Mobile Optimizations** - Touch-friendly interface

### Fixed
- 🐛 **Sidebar Scrolling** - Now sticky and stays in viewport
- 🐛 **Mobile Menu** - Added shadow for visibility
- 🐛 **Table Rendering** - Fixed with remark-gfm v3
- 🐛 **WikiLink Routing** - Correct slug generation from paths
- 🐛 **Next.js 15 Compatibility** - Updated async params handling

### Documentation
- 📖 **Updated README** - Comprehensive wiki documentation
- 📖 **Quick Start Guide** - 5-minute setup guide
- 📖 **WikiLink Guide** - Detailed implementation notes
- 📖 **Sync Guide** - Vault syncing workflow
- 📖 **Changelog** - Project history tracking

## [0.1.0] - Initial State

Original blog starter template from Vercel:
- Next.js 14 blog
- MDX support
- Basic styling
- SEO optimization
- Category-based organization

---

**Legend:**
- ✅ Added
- 🔄 Changed
- 🐛 Fixed
- 📖 Documentation
- ⚠️ Deprecated
- 🗑️ Removed
