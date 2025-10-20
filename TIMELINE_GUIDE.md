# Timeline Feature Guide

This site now supports inline timelines using the **Obsidian Timeline plugin** syntax!

## How It Works

Timelines are fully compatible with Obsidian. When you use the timeline code block in your markdown files:
- In **Obsidian** (with the Timeline plugin installed): Renders as an interactive timeline
- On the **website**: Renders as a beautiful, styled vertical timeline

## Syntax

Use a ````timeline` code block with the standard Obsidian Timeline format:

````markdown
```timeline
+ Date or Time
+ Event Title
+ Event Description
```
````

Each event consists of **three lines**, each starting with a `+`:
1. **Date/Time** - The date or timestamp for the event
2. **Title** - The name/title of the event
3. **Description** - A brief description of what happened

## Example

````markdown
```timeline
+ 1492
+ Columbus's Voyages
+ Columbus reaches the Americas, but European attention remains focused on continental conflicts

+ 1495-1525
+ The Great Continental War
+ Europe descends into a massive continental war, delaying colonization efforts

+ 1500-1600
+ Period of Adaptation
+ Indigenous civilizations observe European technology and begin reverse-engineering innovations

+ 1600
+ Indigenous Modernization
+ Aztec and Inkan civilizations complete internal modernization while maintaining sovereignty
```
````

## Features

✅ **Alternating Layout** - Events alternate left and right for visual clarity  
✅ **Dark Mode Support** - Beautiful appearance in both light and dark themes  
✅ **Mobile Responsive** - Automatically adjusts to vertical layout on small screens  
✅ **Obsidian Compatible** - Works seamlessly with the Obsidian Timeline plugin  
✅ **Zero Dependencies** - Pure CSS implementation, no JavaScript libraries needed

## Styling

The timeline features:
- Central vertical line connecting all events
- Circular markers for each event
- Event cards with date, title, and description
- Professional Wikipedia-style appearance
- Hover effects and smooth transitions

## Tips

- Keep descriptions concise for better readability
- Use consistent date formats throughout your timeline
- Dates can be any format (years, full dates, "BC/AD", etc.)
- Works great for historical events, project milestones, story chronologies

## Adding to Your Pages

Simply add a timeline code block anywhere in your markdown files within the `app/content/posts/` directory. The timeline will be automatically processed and rendered when you build or view your site.

