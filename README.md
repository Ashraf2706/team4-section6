# UMBC Campus Navigator - Team 4 Section 6

A comprehensive campus navigation system designed to help students, faculty, and visitors navigate the University of Maryland, Baltimore County (UMBC) campus efficiently. This project provides both walking and biking route calculations, location management, and department search.

## 👥 Team Members

- **Victor Olalemi**
- **Ashraf Kawooya** 
- **Bryan Ukwandu**

## 🚀 Project Overview

The UMBC Campus Navigator is a full-stack web application that provides intelligent navigation solutions for campus users. The system includes location management, route calculation, obstacle tracking, and user feedback collection to ensure accurate and up-to-date navigation information.

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Google Maps API** - Route calculation
- **Axios** - HTTP client


## 📁 Project Structure

```
server/
├── config/
│   └── db.js                 # Database connection
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── errorHandler.js      # Global error handling
├── models/
│   ├── Location.js          # Campus location schema
│   ├── User.js              # Admin user schema
│   ├── Feedback.js          # User feedback schema
│   └── Obstacle.js          # Campus obstacle schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── locations.js         # Location management
│   ├── routes.js            # Route calculation
│   ├── admin.js             # Admin operations
│   └── feedback.js          # Feedback system
├── services/
│   └── googleMapsService.js # Google Maps integration
├── seeds/
│   └── seedLocations.js     # Database seeding
└── server.js                # Main server file
```

## 🎯 Key Features

### 1. **Location Management**
- Comprehensive campus location database
- Support for multiple location types (Academic, Dining, Recreation, Residential, Administrative, Parking)
- Geospatial indexing for proximity searches
- Text search functionality
- Bike-friendly location features

### 2. **Route Calculation**
- Walking and biking route options
- Google Maps API integration
- Step-by-step navigation instructions
- Distance and duration calculations
- Accessibility considerations

### 3. **Obstacle Tracking**
- Real-time obstacle reporting
- Construction, closed paths, and event tracking
- Geospatial obstacle mapping
- Time-based obstacle management

### 4. **User Feedback System**
- Issue reporting (Wrong Location, Missing Building, Route Error, Accessibility Issue)
- Feedback status tracking
- Admin review system

### 5. **Admin Panel**
- Secure admin authentication
- Location CRUD operations
- Obstacle management
- Feedback review system

## 🗄️ Database Schema

### Location Model
```javascript
{
  locationID: String (unique),
  name: String,
  shortName: String,
  type: ['Academic', 'Dining', 'Recreation', 'Residential', 'Administrative', 'Parking'],
  coordinates: {
    lat: Number,
    lng: Number
  },
  address: String,
  departments: [String],
  bikeFeatures: {
    bikeRackAvailable: Boolean,
    bikeRackCapacity: Number
  }
}
```

### User Model (Admin)
```javascript
{
  email: String (unique),
  password: String (hashed),
  role: String (default: 'admin'),
  name: String
}
```

### Feedback Model
```javascript
{
  issueType: ['Wrong Location', 'Missing Building', 'Route Error', 'Accessibility Issue', 'Other'],
  locationID: String,
  description: String,
  status: ['New', 'Reviewed', 'Resolved']
}
```

### Obstacle Model
```javascript
{
  obstacleID: String (unique),
  type: ['Construction', 'Closed Path', 'Event'],
  description: String,
  affectedArea: {
    type: ['Point', 'LineString', 'Polygon'],
    coordinates: []
  },
  startDate: Date,
  endDate: Date,
  isActive: Boolean
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin info

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/search?query=` - Search locations
- `GET /api/locations/:id` - Get specific location

### Routes
- `POST /api/routes/calculate` - Calculate route between points
  ```json
  {
    "startLat": 39.2554,
    "startLng": -76.7114,
    "endLat": 39.2547,
    "endLng": -76.7109,
    "bikeMode": false
  }
  ```

### Admin (Protected Routes)
- `POST /api/admin/locations` - Add new location
- `PUT /api/admin/locations/:id` - Update location
- `DELETE /api/admin/locations/:id` - Delete location
- `POST /api/admin/obstacles` - Add obstacle
- `GET /api/admin/obstacles` - Get all obstacles

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd umbc-campus-navigator/team4-section6/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/umbc-navigator
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   CLIENT_URL=http://localhost:3000
   PORT=5000
   ```

4. **Start the server**
   ```bash
   npm run dev
   # or
   npm start
   ```

5. **Seed the database** (optional)
   ```bash
   node seeds/seedLocations.js
   ```

### Development
```bash
# Install nodemon for development
npm install -g nodemon

# Run in development mode
npm run dev
```

## 🔧 Configuration

### Database Indexes
The application creates several indexes for optimal performance:
- **Geospatial Index**: `coordinates: '2dsphere'` for proximity searches
- **Text Index**: `name: 'text', shortName: 'text'` for search functionality

### Security Features
- Password hashing with bcryptjs
- JWT token authentication
- CORS configuration
- Input validation
- Error handling middleware

## 📊 Sample Data

The application includes seeded data for UMBC campus locations including:
- Engineering Building (ENG)
- Information Technology Engineering Building (ITE)
- Library
- Student Center
- Dining Halls
- Recreation Centers
- Residential Buildings
- Parking Areas

## 🚧 Future Enhancements

- [ ] Real-time obstacle updates
- [ ] Mobile application
- [ ] Push notifications for route changes
- [ ] Integration with UMBC shuttle system
- [ ] Accessibility route optimization
- [ ] Multi-language support
- [ ] Offline mode capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Note**: This project is part of a university course and is intended for educational purposes. The Google Maps API integration requires a valid API key for production use.