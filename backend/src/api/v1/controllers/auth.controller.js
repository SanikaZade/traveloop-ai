import jwt from 'jsonwebtoken';
import db from '../../../utils/jsonDb.js';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Please provide all fields' });

  const users = await db.read();
  if (users.users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await db.create('users', { name, email, password: hashedPassword });

  res.status(201).json({
    success: true,
    data: { _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) }
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await db.findOne('users', { email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      success: true,
      data: { _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

export const getMe = async (req, res) => {
  const user = await db.findOne('users', { _id: req.user.id });
  const { password, ...userWithoutPassword } = user;
  res.status(200).json({ success: true, data: userWithoutPassword });
};
