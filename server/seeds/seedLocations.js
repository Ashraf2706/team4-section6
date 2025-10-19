const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Location = require('../models/Location');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const locations = [
  {
    locationID: "ENG_101",
    name: "Engineering Building",
    shortName: "ENG",
    type: "Academic",
    coordinates: { lat: 39.2554, lng: -76.7114 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: ["Computer Science", "Mechanical Engineering"],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 20,
    }
  },
  {
    locationID: "ITE_101",
    name: "Information Technology Engineering Building",
    shortName: "ITE",
    type: "Academic",
    coordinates: { lat: 39.2547, lng: -76.7109 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: ["Information Systems", "Computer Engineering"],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 15,
    }
  },
  {
    locationID: "UC_101",
    name: "University Center",
    shortName: "UC",
    type: "Dining",
    coordinates: { lat: 39.2543, lng: -76.7128 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: ["Student Life", "Dining Services"],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 30,
    }
  },
  {
    locationID: "LIB_101",
    name: "Albin O. Kuhn Library",
    shortName: "AOK",
    type: "Academic",
    coordinates: { lat: 39.2546, lng: -76.7123 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: ["Library Services"],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 25,
    }
  },
  {
    locationID: "RAC_101",
    name: "Retriever Activities Center",
    shortName: "RAC",
    type: "Recreation",
    coordinates: { lat: 39.2538, lng: -76.7118 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: ["Athletics", "Recreation"],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 40,
    }
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Location.deleteMany();
    await User.deleteMany();

    // Insert locations
    await Location.insertMany(locations);
    console.log('Locations seeded successfully');

    // Create admin user
    await User.create({
      name: 'UMBC Administrator',
      email: 'admin@umbc.edu',
      password: 'umbc123'
    });
    console.log('Admin user created:');
    console.log('  Email: admin@umbc.edu');
    console.log('  Password: umbc123');
    console.log('  (Change password after first login!)');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();