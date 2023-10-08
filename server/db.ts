const mongoose = require('mongoose');
import { config, MONGO_LOCAL } from './src/configs/config';
const { MONGO_URI } = config;

mongoose.connection
  .on('open', () => console.log('Conneced with database'))
  .on('error', (error: Error) => {
    console.log(error);
  });

export async function connectToDatabase() {

  const _url_ = process.env.APP_ENV === 'dev' ? MONGO_LOCAL.url2 : MONGO_URI;

  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export async function disconnectFromDatabase() {
  await mongoose.disconnect();
}