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
    coordinates: { lat: 39.25447, lng: -76.71391 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: ["Computer Science", "Mechanical Engineering"],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 20, // need to change
    }
  },
  {
    locationID: "ITE_101",
    name: "Information Technology Engineering Building",
    shortName: "ITE",
    type: "Academic",
    coordinates: { lat: 39.25389, lng: -76.71428 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: ["Information Systems", "Computer Engineering"],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 15, // change
    }
  },
  {
    locationID: "UC_101",
    name: "University Center",
    shortName: "UC",
    type: "Dining",
    coordinates: { lat: 39.25441, lng: -76.7133 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: ["Student Life", "Dining Services"],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 30, // change
    }
  },
  {
    locationID: "LIB_101",
    name: "Albin O. Kuhn Library",
    shortName: "AOK",
    type: "Academic",
    coordinates: { lat: 39.25638, lng: -76.71152 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: ["Library Services"],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 25, // change
    }
  },
  {
    locationID: "RAC_101",
    name: "Retriever Activities Center",
    shortName: "RAC",
    type: "Recreation",
    coordinates: { lat: 39.25300, lng: -76.71257 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: ["Athletics", "Recreation"],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 40, //change
    }
  },
  {
    locationID: "COM_101",
    name: "The Commons",
    shortName: "COM",
    type: "Dining",
    coordinates: { lat: 39.25506, lng: -76.71082 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: ["Student Life", "Academic", "Dining"],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 40, //change
    }
  },
  {
    locationID: "ILSB_101",
    name: "UMBC Interdisciplinary Life Sciences Building",
    shortName: "ILSB",
    type: "Academic",
    coordinates: { lat: 39.25396, lng: -76.71101 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: ["College of Natural and Mathematical Scienes (CNMS)"],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 40, //change
    }
  },
  {
    locationID: "ACC_101",
    name: "Apartment Community Center",
    shortName: "ACC",
    type: "Residential",
    coordinates: { lat: 39.25817, lng: -76.71198 },
    address: "1000 Hilltop Circle, Baltimore, MD 21250",
    departments: ["Apartment Housing"],
    bikeFeatures: {
      bikeRackAvailable: true,
      bikeRackCapacity: 40, //change
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