import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../database.json');

// Initial schema
const INITIAL_DATA = {
  users: [],
  trips: [],
  itineraries: [],
  budgets: [],
  packingLists: [],
  notes: []
};

class JSONDB {
  async read() {
    try {
      const data = await fs.readFile(DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      await this.write(INITIAL_DATA);
      return INITIAL_DATA;
    }
  }

  async write(data) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  }

  // Generic helpers
  async findOne(collection, query) {
    const data = await this.read();
    return data[collection].find(item => 
      Object.keys(query).every(key => item[key] === query[key])
    );
  }

  async findMany(collection, query = {}) {
    const data = await this.read();
    return data[collection].filter(item => 
      Object.keys(query).every(key => item[key] === query[key])
    );
  }

  async create(collection, item) {
    const data = await this.read();
    const newItem = { 
      _id: Math.random().toString(36).substr(2, 9), 
      createdAt: new Date().toISOString(),
      ...item 
    };
    data[collection].push(newItem);
    await this.write(data);
    return newItem;
  }

  async findByIdAndUpdate(collection, id, updates) {
    const data = await this.read();
    const index = data[collection].findIndex(item => item._id === id || item.tripId === id);
    if (index === -1) return null;
    
    data[collection][index] = { ...data[collection][index], ...updates, updatedAt: new Date().toISOString() };
    await this.write(data);
    return data[collection][index];
  }

  async findByIdAndDelete(collection, id) {
    const data = await this.read();
    data[collection] = data[collection].filter(item => item._id !== id);
    await this.write(data);
  }
}

export default new JSONDB();
