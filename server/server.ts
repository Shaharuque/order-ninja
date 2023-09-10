// require('dotenv').config();
console.clear();
console.log(`[${new Date().toLocaleTimeString()}]`);
// import * as dotenv from "dotenv";
import 'dotenv/config';
import expressApp from "./express.app";
import http from 'http';
import { connectToDatabase } from './db';
import { scheduleDiscountUpdate } from './src/models/products.model';
const __port__ = process.env.PORT;


const server = http.createServer(expressApp);

scheduleDiscountUpdate();

async function startServer() {
  await connectToDatabase();
  server.listen(__port__, () =>{
    console.log(`Listening on http://localhost:${__port__}`);
  });
}

startServer();
