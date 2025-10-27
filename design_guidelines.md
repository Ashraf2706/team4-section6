# UMBC Campus Navigator - Design Guidelines

## Design Approach

**Selected Framework**: Material Design 3 principles adapted for navigation-focused utility application

**Rationale**: Campus navigation apps prioritize efficiency, clear information hierarchy, and intuitive interactions. Material Design's elevation system, strong visual feedback, and structured layouts align perfectly with map-based interfaces and Google Maps integration.

**Key Design Principles**:
- Clarity over decoration - every element serves a functional purpose
- Instant recognition of interactive elements
- Clear visual hierarchy for navigation information
- Seamless integration with Google Maps interface
- Accessibility-first approach for campus diversity

---

## Typography

**Font Family**: 
- Primary: Inter (via Google Fonts CDN) - excellent readability for UI labels and navigation instructions
- Monospace: JetBrains Mono - for distance/time displays and coordinates

**Type Scale**:
- Hero/Page Titles: 3xl (36px), font-bold
- Section Headers: 2xl (24px), font-semibold
- Card Titles/Location Names: xl (20px), font-semibold
- Body Text/Instructions: base (16px), font-normal
- Helper Text/Metadata: sm (14px), font-normal
- Micro Labels: xs (12px), font-medium

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 1, 2, 4, 6, 8, 12, 16

**Core Patterns**:
- Component padding: p-4 for cards, p-6 for sections, p-8 for containers
- Vertical spacing: space-y-6 for sections, space-y-4 for card content
- Grid gaps: gap-4 for standard grids, gap-6 for feature layouts

**Container Widths**:
- Full app container: max-w-7xl mx-auto
- Content sections: max-w-6xl
- Form elements: max-w-2xl

---

## Component Library

### Navigation & Header
**Top Navigation Bar**:
- Fixed positioning with shadow elevation
- UMBC branding (logo + "Campus Navigator" text) on left
- Quick action buttons: "Find Location", "Report Obstacle", "Feedback" centered/right
- Mobile: Hamburger menu with slide-out drawer
- Height: h-16 desktop, h-14 mobile
- Include subtle bottom border for definition

### Hero Section
**Implementation**:
- Height: 60vh on desktop, 50vh on mobile
- Image: Wide-angle campus aerial photograph showing key buildings and pathways
- Overlay: Dark gradient (top to bottom, opacity 60%)
- Content: Centered search bar with location autocomplete, tagline above ("Navigate UMBC Campus with Confidence")
- Search bar: Large (h-14), rounded-lg, with search icon and voice input option
- Background buttons: Backdrop blur (backdrop-blur-md) with semi-transparent white (bg-white/20)
- No hover states on hero buttons

### Map Interface
**Primary Map Container**:
- Full-width section taking 65% viewport height on desktop
- Rounded corners (rounded-xl) with elevation shadow
- Integrated Google Maps with custom marker styles
- Floating controls overlay: Route type toggle (Walking/Biking), accessibility filter, zoom controls positioned top-right
- Bottom sheet slides up with route details when destination selected

### Location Cards
**Design Pattern**:
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Card structure: Rounded-lg, subtle shadow, p-6
- Icon (24x24) from Material Icons at top
- Location name (xl, semibold)
- Department/Building info (sm, medium)
- Quick stats row: Distance badge, Accessibility indicator
- "Get Directions" button (full width, rounded-lg)

### Route Display Panel
**Side Panel Structure**:
- Fixed width: w-96 on desktop, full-width drawer on mobile
- Route summary at top: Total distance, estimated time, route type indicator
- Scrollable step-by-step instructions (space-y-4)
- Each step: Icon (turn arrows, walk symbol) + Instruction text + Distance
- Accessibility warnings highlighted with warning badge
- "Start Navigation" primary button at bottom

### Obstacle Tracking Interface
**Report Form**:
- Modal overlay (backdrop-blur-sm)
- Form container: max-w-2xl, rounded-2xl, p-8
- Fields: Location dropdown, Obstacle type (checkboxes), Severity (radio), Description textarea, Photo upload
- Map preview showing selected location
- Submit button with loading state

### Search & Autocomplete
**Search Experience**:
- Prominent search bar: h-12, rounded-full
- Dropdown results: Categorized (Buildings, Departments, Amenities)
- Each result: Icon + Primary name + Secondary info (building code)
- Recent searches section at bottom
- Empty state with popular locations

### Feature Showcase Section
**Three-Column Grid** (below hero):
- Walking Routes: Icon + title + description
- Biking Paths: Icon + title + description  
- Obstacle Reports: Icon + title + description
- Each column: p-8, hover elevation increase

### Feedback Widget
**Floating Action Button**:
- Fixed bottom-right position (bottom-8, right-8)
- Circular, elevated shadow
- Opens modal form for campus navigation feedback
- Includes star rating, comment field, location relevance toggle

---

## Animations

**Minimal, Purposeful Motion**:
- Map marker drop: Simple scale from 0 to 1 when location selected
- Route line drawing: Smooth path animation (1s duration)
- Panel transitions: Slide in/out with ease-in-out
- Card hovers: Subtle elevation increase (no transform)
- Loading states: Spinner or skeleton screens for map data

---

## Images

**Hero Section Image**:
- Required: Wide-angle aerial photograph of UMBC campus
- Shows: Main campus quad, key buildings, pathways visible
- Treatment: High-quality, vibrant colors, taken during golden hour or bright day
- Dimensions: Minimum 1920x1080px
- Placement: Background of hero section with dark gradient overlay

**Location Card Thumbnails**:
- Building exterior photos (optional per card)
- Square crop, 400x400px minimum
- Consistent photography style across all locations

**Empty States**:
- Illustration showing map with magnifying glass for "no results"
- Simple, line-art style

---

## Icon Strategy

**Icon Library**: Material Icons (via Google Fonts CDN)

**Usage**:
- Navigation: directions_walk, directions_bike, navigation, place
- Actions: search, my_location, report, feedback, menu
- Markers: location_on, school, local_cafe, stairs, elevator
- Status: warning, check_circle, info, accessible

---

## Accessibility Implementation

- ARIA labels for all map controls and interactive elements
- Keyboard navigation support for entire map interface
- High contrast mode toggle in settings
- Screen reader announcements for route changes
- Focus indicators visible on all interactive elements (ring-2 ring-offset-2)
- Minimum touch targets: 44x44px for all buttons
- Color never sole indicator - use icons + text together

---

## Form Elements

**Text Inputs**:
- Height: h-12, rounded-lg
- Border: 2px solid border color
- Focus state: Ring with accent color
- Label: Always above input, font-medium, text-sm
- Helper text below when needed

**Buttons**:
- Primary: Full background, rounded-lg, h-12, font-semibold
- Secondary: Outlined, rounded-lg, h-12
- Icon buttons: Square (w-10 h-10), rounded-full
- All buttons implement hover/active states automatically

**Dropdowns/Selects**:
- Match text input styling
- Chevron icon on right
- Dropdown panel: shadow-lg, rounded-lg, max height with scroll