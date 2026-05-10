import db from '../../../utils/jsonDb.js';

const DEFAULT_CATEGORIES = [
  { category: 'Essentials', items: [] },
  { category: 'Clothing', items: [] },
  { category: 'Toiletries', items: [] },
  { category: 'Electronics', items: [] }
];

export const getPackingList = async (req, res) => {
  const { tripId } = req.params;
  let list = await db.findOne('packingLists', { tripId });

  if (!list) {
    list = await db.create('packingLists', { tripId, categories: DEFAULT_CATEGORIES });
  }

  res.status(200).json({ success: true, data: list });
};

export const updatePackingList = async (req, res) => {
  const { tripId } = req.params;
  const { categories } = req.body;

  let list = await db.findOne('packingLists', { tripId });

  if (!list) {
    list = await db.create('packingLists', { tripId, categories });
  } else {
    list = await db.findByIdAndUpdate('packingLists', tripId, { categories });
  }

  res.status(200).json({ success: true, data: list });
};
