import db from '../utils/jsonDb.js';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  try {
    console.log('Seeding JSON Database...');

    // 1. Create a Demo User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const demoUser = await db.create('users', {
      name: 'Odoo Reviewer',
      email: 'demo@travelloop.com',
      password: hashedPassword
    });
    console.log('✅ Demo user created: demo@travelloop.com / password123');

    // 2. Create a Rich Demo Trip
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 30);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 10);

    const trip = await db.create('trips', {
      owner: demoUser._id,
      title: 'Grand Europe Tour 2026',
      destination: 'Europe',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
      isPublic: true,
      totalBudget: 5000
    });

    // 3. Create Itinerary
    await db.create('itineraries', {
      tripId: trip._id,
      stops: [
        {
          id: 'stop-1',
          city: 'Paris',
          country: 'France',
          activities: [
            { id: 'a1', title: 'Eiffel Tower Summit', cost: 30, duration: '2h', type: 'Sightseeing' },
            { id: 'a2', title: 'Louvre Museum', cost: 25, duration: '3h', type: 'Culture' }
          ]
        },
        {
          id: 'stop-2',
          city: 'Rome',
          country: 'Italy',
          activities: [
            { id: 'a3', title: 'Colosseum Tour', cost: 20, duration: '3h', type: 'History' }
          ]
        }
      ]
    });

    console.log('✅ Demo trip and itinerary seeded to backend/database.json!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
