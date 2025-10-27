# UMBC Campus Navigator

A comprehensive full-stack web application for navigating the University of Maryland, Baltimore County (UMBC) campus. The system provides intelligent navigation solutions with walking and biking routes, location management, and real-time obstacle tracking.

## Features

### Core Navigation
- **Interactive Campus Map**: Google Maps integration showing all campus locations and obstacles
- **Walking & Biking Routes**: Toggle between walking and biking directions with distance and time estimates
- **Turn-by-Turn Directions**: Step-by-step navigation instructions with maneuver icons
- **Location Search**: Quick search with autocomplete for buildings, departments, and amenities

### Location Management
- **Campus Locations**: Pre-loaded with major UMBC buildings including:
  - The Commons (Student Center)
  - Albin O. Kuhn Library
  - Engineering Building
  - RAC (Retriever Activities Center)
  - Sherman Hall
  - Performing Arts & Humanities Building
- **Location Cards**: Display building codes, addresses, and accessibility information
- **Quick Directions**: One-click access to navigation for any location

### Obstacle Tracking
- **Report Obstacles**: Users can report construction, closures, or accessibility issues
- **Severity Levels**: Low, Medium, High classification system
- **Obstacle Types**: Construction, Path Closure, Weather Related, Accessibility Issue
- **Active Indicators**: Visual markers on map showing current obstacles
- **Real-time Updates**: Obstacle reports update map markers immediately

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **UMBC Branding**: Official gold (#FFC20E) and gray color scheme
- **Material Design 3**: Clean, modern interface with intuitive interactions
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Feedback System**: In-app feedback collection with star ratings

## Technical Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **TanStack Query** for data fetching and caching
- **Shadcn UI** components with Radix UI primitives
- **Tailwind CSS** for styling
- **Google Maps JavaScript API** for mapping
- **React Hook Form** with Zod validation

### Backend
- **Express.js** server
- **In-memory storage** for rapid development
- **Zod** schema validation
- **RESTful API** design

### APIs
- `GET /api/locations` - Fetch all campus locations
- `GET /api/locations/:id` - Get specific location
- `POST /api/locations` - Create new location
- `GET /api/obstacles` - Fetch all obstacles
- `GET /api/obstacles/:id` - Get specific obstacle
- `POST /api/obstacles` - Report new obstacle
- `PATCH /api/obstacles/:id` - Update obstacle status
- `POST /api/routes` - Calculate route between two points

## Data Models

### Location
- **id**: Unique identifier
- **name**: Location name (e.g., "The Commons")
- **type**: building | department | amenity | parking
- **address**: Full campus address
- **latitude/longitude**: GPS coordinates
- **buildingCode**: Optional short code (e.g., "COM")
- **description**: Additional information
- **isAccessible**: Accessibility status

### Obstacle
- **id**: Unique identifier
- **locationId**: Reference to associated location
- **title**: Brief description
- **description**: Detailed information
- **severity**: low | medium | high
- **type**: construction | closure | weather | accessibility
- **latitude/longitude**: GPS coordinates
- **reportedAt**: Timestamp
- **isActive**: Current status

## Environment Variables

- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API key for map functionality
- `SESSION_SECRET`: Session encryption key

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx - Top navigation bar
│   │   │   ├── HeroSection.tsx - Landing page hero with search
│   │   │   ├── FeatureShowcase.tsx - Feature highlights
│   │   │   ├── MapContainer.tsx - Google Maps integration
│   │   │   ├── LocationCard.tsx - Location display cards
│   │   │   ├── RoutePanel.tsx - Turn-by-turn directions panel
│   │   │   ├── ObstacleReportDialog.tsx - Obstacle reporting form
│   │   │   ├── FeedbackDialog.tsx - User feedback form
│   │   │   └── SearchDialog.tsx - Location search with autocomplete
│   │   ├── pages/
│   │   │   ├── Home.tsx - Main application page
│   │   │   └── not-found.tsx - 404 page
│   │   ├── lib/
│   │   │   ├── queryClient.ts - TanStack Query configuration
│   │   │   └── googleMaps.ts - Google Maps loader
│   │   ├── App.tsx - Application root
│   │   └── index.css - Global styles
│   └── index.html - HTML entry point
├── server/
│   ├── storage.ts - In-memory data storage
│   ├── routes.ts - API endpoints
│   └── index.ts - Express server
├── shared/
│   └── schema.ts - Shared TypeScript types and Zod schemas
├── attached_assets/
│   └── generated_images/
│       └── UMBC_campus_aerial_view_*.png - Hero section background
└── design_guidelines.md - UI/UX design specifications

```

## Development

The application runs on port 5000 with both frontend and backend served together.

### Running the Application
```bash
npm run dev
```

### Key Features Implementation

1. **Map Integration**: Google Maps loads dynamically with custom markers for locations (blue) and obstacles (red)

2. **Route Calculation**: Currently uses mock data; can be enhanced with Google Directions API integration

3. **Real-time Updates**: TanStack Query provides automatic cache invalidation and optimistic updates

4. **Form Validation**: All forms use React Hook Form with Zod schemas for type-safe validation

5. **Responsive Layout**: Mobile-first design with collapsible navigation and touch-optimized controls

## Future Enhancements

- Google Directions API integration for real route calculation
- User accounts and favorite locations
- Indoor navigation for multi-floor buildings
- Live campus shuttle tracking
- Admin dashboard for managing locations and verifying obstacle reports
- Accessibility route options highlighting wheelchair paths
- Multi-language support
- Progressive Web App (PWA) capabilities for offline use

## Design Philosophy

The application follows Material Design 3 principles with:
- **Clarity over decoration** - Every element serves a purpose
- **UMBC branding** - Official gold color for primary actions
- **Accessibility first** - WCAG 2.1 AA compliant
- **Mobile optimized** - Touch-friendly controls and responsive layouts
- **Performance focused** - Optimized bundle size and lazy loading

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## License

Copyright © 2024 UMBC Campus Navigator. All rights reserved.
