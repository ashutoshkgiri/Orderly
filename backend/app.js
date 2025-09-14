import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { sequelize } from './models/index.js';

import authRoutes from './routes/auth.js';
import tenantRoutes from './routes/tenants.js';
import ingestRoutes from './routes/ingest.js';
import insightsRoutes from './routes/insights.js';
import shopifyRoutes from "./routes/shopify.js";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/ingest', ingestRoutes);
app.use('/api/insights', insightsRoutes);
app.use("/api/shopify", shopifyRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
  await sequelize.sync({ alter: true });
  app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
}

start();