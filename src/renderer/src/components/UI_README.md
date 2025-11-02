# UI Component Library Documentation

## Overview

This document outlines the UI component system built for the Backup Manager application, featuring a Catppuccin Macchiato dark theme with purple/lavender accents, emphasizing accessibility, responsiveness, and polished user experience.

## Theme System

### Gaming Theme (Catppuccin Macchiato)

The application uses a custom **gaming** theme based on the Catppuccin Macchiato color palette:

- **Base Colors**: Catppuccin dark backgrounds (#181926, #1e2030, #24273a)
- **Primary**: Mauve (#c6a0f6) for main interactive elements
- **Secondary**: Lavender (#b7bdf8) for complementary accents
- **Accent**: Sapphire (#7dc4e4) for tertiary highlights
- **Status Colors**: 
  - Success: #a6da95 (green)
  - Warning: #eed49f (yellow)
  - Error: #ed8796 (red)
  - Info: #8aadf4 (blue)

### Theme Configuration

The theme is configured in `tailwind.config.js` with a custom DaisyUI theme named "gaming". It automatically applies on dark mode preference detection and persists user choice in localStorage.

**Usage:**
```tsx
import { useAppStore } from '@/stores'

const { theme, setTheme } = useAppStore()
setTheme('gaming') // 'gaming' | 'light' | 'dark'
```

## Layout Components

### AppShell

Main application container that provides the base structure with sidebar, header, footer, and content area.

**Features:**
- Responsive sidebar with collapse functionality
- Global loading overlay integration
- Suspense boundaries for async content
- Fixed positioning for optimal performance

**Usage:**
```tsx
<AppShell>
  <YourContent />
</AppShell>
```

### SidebarNav

Collapsible navigation sidebar with icon-based menu items.

**Features:**
- Animated hover effects
- Active state highlighting with gradient
- Badge support for notifications
- Keyboard accessible (focus outlines)
- Smooth collapse/expand transitions

**Props:**
- `collapsed: boolean` - Controls sidebar state

### TopBar

Application header with window controls, search, and theme toggle.

**Features:**
- Window management buttons (minimize, maximize, close)
- Global search input
- Theme switcher
- Version badge
- Electron titlebar replacement

### StatusFooter

Bottom status bar showing system information and real-time updates.

**Features:**
- Real-time clock
- Storage usage display
- Connection status indicator
- Compact 32px height

### ContentArea

Main content wrapper with configurable padding.

**Props:**
- `padding?: 'none' | 'sm' | 'md' | 'lg'` - Controls content padding
- `className?: string` - Additional styling

## UI Primitives

### AnimatedCard

Versatile card component with hover animations and optional glow effect.

**Features:**
- Smooth hover animations (lift and shadow)
- Optional border glow animation
- Composed with sub-components (Header, Title, Content, Footer)
- Dark gaming aesthetic

**Usage:**
```tsx
<AnimatedCard hoverable glowing>
  <AnimatedCardHeader>
    <AnimatedCardTitle>Title</AnimatedCardTitle>
    <button>Action</button>
  </AnimatedCardHeader>
  <AnimatedCardContent>
    <p>Content here</p>
  </AnimatedCardContent>
  <AnimatedCardFooter>
    Footer content
  </AnimatedCardFooter>
</AnimatedCard>
```

### StatusIndicator

Visual status indicator with animated pulse effect.

**Props:**
- `status: 'success' | 'warning' | 'error' | 'info' | 'idle'`
- `size?: 'xs' | 'sm' | 'md' | 'lg'`
- `label?: string`
- `animated?: boolean`

**Usage:**
```tsx
<StatusIndicator status="success" size="md" label="Online" animated />
```

### Badge

Compact badge component for tags and status labels.

**Props:**
- `variant?: 'default' | 'success' | 'warning' | 'error' | 'info'`
- `size?: 'xs' | 'sm' | 'md' | 'lg'`
- `dot?: boolean` - Shows a colored dot before text

**Usage:**
```tsx
<Badge variant="success" size="sm" dot>
  Completed
</Badge>
```

### ProgressBar

Linear and circular progress indicators.

**Features:**
- Linear progress bar with optional striping and animation
- Circular progress variant
- Label and percentage display
- Color-coded based on status

**Usage:**
```tsx
<ProgressBar
  value={65}
  max={100}
  color="primary"
  label="Storage Usage"
  showValue
  animated
  striped
/>

<CircularProgress
  value={75}
  max={100}
  size={80}
  strokeWidth={8}
  color="success"
  showValue
/>
```

### SkeletonLoader

Loading state placeholders with shimmer animation.

**Variants:**
- `text` - Single or multi-line text placeholder
- `rect` - Rectangular block
- `circle` - Circular avatar placeholder
- `card` - Full card skeleton with avatar and text lines

**Usage:**
```tsx
<SkeletonLoader variant="card" />
<SkeletonLoader variant="text" lines={3} />
<SkeletonLoader variant="circle" width="3rem" />
```

### Modal

Accessible modal dialog with backdrop and keyboard support.

**Features:**
- ESC key to close
- Click backdrop to close (configurable)
- Focus trap
- Smooth animations (scale-in)
- Multiple sizes

**Props:**
- `open: boolean`
- `onClose: () => void`
- `title?: string`
- `size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'`
- `closeOnBackdrop?: boolean`
- `showCloseButton?: boolean`

**Usage:**
```tsx
<Modal open={isOpen} onClose={handleClose} title="Settings" size="lg">
  <div>Modal content</div>
  <ModalFooter>
    <button className="btn btn-ghost" onClick={handleClose}>Cancel</button>
    <button className="btn btn-primary">Save</button>
  </ModalFooter>
</Modal>
```

### Toast

Non-intrusive notification system with automatic dismiss.

**Features:**
- Type-based styling (success, error, warning, info)
- Auto-dismiss with configurable duration
- Manual close button
- Stacking multiple toasts
- Positioned (top/bottom, left/right/center)

**Usage:**
```tsx
import { useToastStore } from '@/stores'

const { addToast } = useToastStore()

addToast('success', 'Backup completed successfully!', 3000)
addToast('error', 'Failed to save file')
```

**Component:**
```tsx
<ToastContainer 
  toasts={toasts} 
  onClose={removeToast} 
  position="top-right" 
/>
```

### SearchInput

Search input with debouncing and clear button.

**Features:**
- Debounced search (configurable delay)
- Clear button when value present
- ESC key to clear
- Auto-focus option
- Magnifying glass icon

**Props:**
- `placeholder?: string`
- `value?: string`
- `onChange?: (value: string) => void`
- `onSearch?: (value: string) => void`
- `debounceMs?: number`
- `autoFocus?: boolean`

**Usage:**
```tsx
<SearchInput
  placeholder="Search games..."
  value={searchQuery}
  onChange={setSearchQuery}
  debounceMs={300}
/>
```

### TabGroup

Accessible tab navigation with multiple variants.

**Features:**
- Three visual styles: default, pills, underline
- Badge support on tabs
- Disabled state support
- Icon support
- Keyboard navigation

**Props:**
- `tabs: Tab[]`
- `activeTab?: string`
- `onChange?: (tabId: string) => void`
- `variant?: 'default' | 'pills' | 'underline'`

**Usage:**
```tsx
const tabs = [
  { id: 'all', label: 'All', badge: 12 },
  { id: 'active', label: 'Active', icon: <CheckIcon /> }
]

<TabGroup tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />

<TabPanel activeTab={activeTab} tabId="all">
  Content for all tab
</TabPanel>
```

### SectionHeader

Page section header with icon, title, subtitle, and actions.

**Features:**
- Icon with gradient background
- Optional subtitle
- Action button area
- Consistent spacing

**Usage:**
```tsx
<SectionHeader
  title="Dashboard"
  subtitle="Manage your game saves"
  icon={<HomeIcon className="size-6 text-white" />}
  actions={
    <button className="btn btn-primary">Add Game</button>
  }
/>
```

### GlobalLoadingOverlay

Full-screen loading overlay with spinner and message.

**Features:**
- Backdrop blur effect
- Centered spinner with dual animation
- Custom loading message
- Controlled by global app state

**Usage:**
```tsx
import { useAppStore } from '@/stores'

const { setLoading } = useAppStore()
setLoading(true, 'Processing backup...')
```

## Accessibility Features

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus outlines with primary color
- Tab navigation through components
- ESC key support in modals and search

### Screen Readers
- ARIA labels on icon-only buttons
- Semantic HTML structure
- Proper heading hierarchy

### Reduced Motion
Media query support that disables animations when user prefers reduced motion:
```css
@media (prefers-reduced-motion: reduce) {
  /* Minimal animation durations */
}
```

### High Contrast
- Status colors meet WCAG AAA contrast ratios
- Focus indicators clearly visible
- Text maintains readability on dark backgrounds

## Animation Guidelines

### Timing
- Quick interactions: 200ms (buttons, toggles)
- Content transitions: 300ms (cards, panels)
- Loading states: 2s loop (shimmer, pulse)

### Easing
- Ease-out for entrances (slide-in, fade-in)
- Ease-in for exits (slide-out, fade-out)
- Ease-in-out for continuous (pulse-subtle)

### Motion Types
- **Fade**: Opacity transitions (fade-in, fade-out)
- **Slide**: Position transitions (slide-up, slide-down, slide-in)
- **Scale**: Size transitions (scale-in, hover lift)
- **Pulse**: Subtle opacity loop (status indicators)
- **Shimmer**: Horizontal gradient sweep (skeletons)
- **Glow**: Box-shadow pulse (highlighted cards)

## Responsive Design

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Sidebar Behavior
- Collapsed sidebar: 4rem (64px)
- Expanded sidebar: 16rem (256px)
- Auto-collapse on small screens (<768px)

### Grid Layouts
Dashboard uses responsive grid:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 4 columns (stats cards)

## Best Practices

### Component Composition
```tsx
// Good: Compose primitives
<AnimatedCard>
  <AnimatedCardHeader>
    <AnimatedCardTitle>Title</AnimatedCardTitle>
  </AnimatedCardHeader>
</AnimatedCard>

// Avoid: Creating one-off card variants
```

### State Management
```tsx
// Use global app store for theme and UI state
const { theme, setTheme, sidebarOpen, toggleSidebar } = useAppStore()

// Use toast store for notifications
const { addToast } = useToastStore()
```

### Styling
```tsx
// Use cn() utility for conditional classes
import { cn } from '@/utils'

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className
)} />
```

## Examples

### Dashboard Card with Data
```tsx
<AnimatedCard hoverable>
  <AnimatedCardContent>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-base-content/60">Total Backups</p>
        <p className="text-3xl font-bold mt-1">24</p>
      </div>
      <CloudArrowUpIcon className="size-12 text-primary" />
    </div>
  </AnimatedCardContent>
</AnimatedCard>
```

### Loading State
```tsx
{isLoading ? (
  <SkeletonCard />
) : (
  <GameCard game={game} />
)}
```

### Form with Validation
```tsx
<SearchInput
  placeholder="Search..."
  value={query}
  onChange={setQuery}
  className="mb-4"
/>

{filteredResults.length === 0 && (
  <div className="text-center py-12">
    <p className="text-base-content/60">No results found</p>
  </div>
)}
```

## Future Enhancements

- Command palette (Cmd+K) for quick navigation
- Drag-and-drop file upload zones
- Virtual scrolling for large lists
- Chart components for analytics
- Data table with sorting and filtering
- Form validation primitives
- Date/time pickers
- Image gallery/lightbox

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)
- [Heroicons](https://heroicons.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
