---
inclusion: always
---

# Design System Rules for Figma Integration

This document provides comprehensive rules for integrating Figma designs with this Next.js + React + Tailwind CSS codebase.

## Design System Structure

### 1. Token Definitions

**Location**: `src/app/globals.css`
**Format**: CSS Custom Properties with HSL color values

```css
:root {
  --background: hsl(210 20% 98%); 
  --foreground: hsl(222 47% 11%); 
  --primary: hsl(226 70% 55%); 
  --radius: 1.25rem;
  /* ... more tokens */
}
```

**Key Design Tokens**:
- **Colors**: Semantic color system with light/dark mode support
- **Typography**: Space Grotesk (sans) and Geist Mono (mono) fonts
- **Spacing**: Standard Tailwind spacing scale
- **Border Radius**: Custom radius system (sm, md, lg, xl variants)
- **Shadows**: Custom shadow utilities (shadow-xs, glass effects)

### 2. Component Library

**Location**: `src/components/ui/`
**Architecture**: Radix UI primitives + shadcn/ui patterns
**Documentation**: Uses shadcn/ui component system

**Key Patterns**:
- All components use `data-slot` attributes for styling hooks
- Variant-based styling with `class-variance-authority` (CVA)
- Compound components pattern (Card, CardHeader, CardContent, etc.)
- Consistent prop forwarding with `React.ComponentProps`

```typescript
// Example component pattern
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### 3. Frameworks & Libraries

**UI Framework**: React 19 + Next.js 15
**Styling**: Tailwind CSS v4 with CSS Variables
**Component Primitives**: Radix UI
**Build System**: Next.js with Turbopack
**Animation**: Framer Motion + tailwindcss-animate

**Key Dependencies**:
- `@radix-ui/*` - Accessible component primitives
- `class-variance-authority` - Variant-based component styling
- `tailwind-merge` + `clsx` - Conditional class merging
- `lucide-react` - Primary icon library
- `@tabler/icons-react` - Secondary icon library

### 4. Asset Management

**Images**: Next.js Image component with remote pattern support
**Icons**: Lucide React (primary), Tabler Icons (secondary)
**Public Assets**: Stored in `/public/` directory
**Optimization**: Next.js built-in image optimization

### 5. Icon System

**Primary**: Lucide React icons
**Secondary**: Tabler Icons, Heroicons
**Usage Pattern**:
```typescript
import { ChevronRight } from "lucide-react"
// Icons automatically sized with [&_svg]:size-4 in button variants
```

### 6. Styling Approach

**Methodology**: Utility-first with Tailwind CSS
**Custom Utilities**:
```css
.glass-card {
  @apply bg-card/60 backdrop-blur-2xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)];
}

.neon-glow {
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
}
```

**Responsive Design**: Mobile-first with Tailwind breakpoints
**Dark Mode**: CSS variables with `.dark` class toggle

### 7. Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # Global styles & design tokens
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   └── ErrorReporter.tsx
├── hooks/              # Custom React hooks
├── lib/
│   ├── utils.ts        # Utility functions (cn helper)
│   └── hooks/          # Additional hook utilities
└── visual-edits/       # Visual editing components
```

## Figma Integration Guidelines

### Code Generation Rules

1. **Component Mapping**: Map Figma components to existing UI components in `src/components/ui/`
2. **Token Translation**: Convert Figma design tokens to CSS custom properties
3. **Styling Approach**: Use Tailwind utilities, fallback to custom CSS for complex designs
4. **Responsive Design**: Implement mobile-first responsive patterns

### Design Token Mapping

| Figma Token | CSS Variable | Tailwind Class |
|-------------|--------------|----------------|
| Primary Color | `--primary` | `bg-primary` |
| Background | `--background` | `bg-background` |
| Text Color | `--foreground` | `text-foreground` |
| Border Radius | `--radius` | `rounded-lg` |

### Component Reuse Priority

1. **First**: Use existing `src/components/ui/` components
2. **Second**: Extend existing components with new variants
3. **Last**: Create new components following established patterns

### Code Connect Mapping

- Map Figma components to `src/components/ui/[component].tsx`
- Use React framework label for Code Connect
- Follow naming convention: PascalCase component names

### Quality Assurance

- Ensure 1:1 visual parity with Figma designs
- Validate responsive behavior across breakpoints
- Test dark mode compatibility
- Verify accessibility standards (ARIA attributes, keyboard navigation)
- Use semantic HTML elements where appropriate

### File Naming Conventions

- Components: PascalCase (e.g., `Button.tsx`)
- Utilities: kebab-case (e.g., `use-mobile.ts`)
- Pages: lowercase (e.g., `page.tsx`)
- Styles: kebab-case (e.g., `globals.css`)