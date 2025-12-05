const mongoose = require('mongoose');

async function connectMongo(mongoUri) {
  try {
    if (!mongoUri) throw new Error('MONGO_URI missing!');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

module.exports = connectMongo;
