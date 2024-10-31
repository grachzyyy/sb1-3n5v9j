import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { validateInitData } from '@telegram-apps/init-data-node';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware to validate Telegram init data
const validateTelegramData = (req, res, next) => {
  try {
    const initData = req.headers['x-telegram-init-data'];
    if (!initData) {
      return res.status(401).json({ error: 'No Telegram init data provided' });
    }

    const isValid = validateInitData(initData, process.env.BOT_TOKEN);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid Telegram init data' });
    }

    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(401).json({ error: 'Invalid Telegram init data' });
  }
};

// Protected route example
app.post('/api/save-clicks', validateTelegramData, (req, res) => {
  const { mainButtonClicks, secondaryButtonClicks } = req.body;
  
  // Here you would typically save to a database
  console.log('Saving clicks:', { mainButtonClicks, secondaryButtonClicks });
  
  res.json({ 
    success: true, 
    message: 'Clicks saved successfully',
    data: { mainButtonClicks, secondaryButtonClicks }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});