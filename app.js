import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'winston';
import path from 'path';
import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import dotenv from 'dotenv';
import mongoose from './mongoose';
import services from './services';
import workers from './workers';
import GrpcClient from './rpc';

const app = express(feathers());

dotenv.config();
app.set('PORT', process.env.PORT);
app.set('MONGO_URL', process.env.MONGO_URL);
app.set('RPC_HOST', process.env.RPC_HOST);
app.set('RPC_PORT', process.env.RPC_PORT);

// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up Plugins and providers
app.configure(express.rest());

// Configure tron RPC client
const grpcClient = new GrpcClient({
  hostname: app.get('RPC_HOST'),
  port: app.get('RPC_PORT')
});
app.set('grpcClient', grpcClient);

// Setup mognoose
app.configure(mongoose);

// Set up our services (see `services/index.js`)
app.configure(services);

// Set up worker
app.configure(workers);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

export default app;
