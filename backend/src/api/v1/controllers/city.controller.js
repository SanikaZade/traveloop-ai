import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const citiesDataPath = path.join(__dirname, '../../data/cities.json');
const activitiesDataPath = path.join(__dirname, '../../data/activities.json');

const getMockData = (filePath) => {
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
};

export const searchCities = (req, res) => {
  const { q } = req.query;
  let cities = getMockData(citiesDataPath);
  
  if (q) {
    const keyword = q.toLowerCase();
    cities = cities.filter(c => 
      c.name.toLowerCase().includes(keyword) || 
      c.country.toLowerCase().includes(keyword)
    );
  }
  
  res.status(200).json({ success: true, count: cities.length, data: cities });
};

export const getActivitiesForCity = (req, res) => {
  const { cityId } = req.params;
  const activities = getMockData(activitiesDataPath);
  
  const filtered = activities.filter(a => a.cityId === cityId);
  res.status(200).json({ success: true, count: filtered.length, data: filtered });
};
