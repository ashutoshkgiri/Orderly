import express from 'express';
import { Tenant } from '../models/index.js';
import { authMiddleware } from '../utils/auth.js';

const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
  const tenant = await Tenant.findByPk(req.user.tenant_id);
  res.json(tenant);
});
  
export default router;
 