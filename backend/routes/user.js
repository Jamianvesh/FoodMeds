import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/first', async (req, res) => {
  try {
    const firstUser = await User.findOne({});
    res.json(firstUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
