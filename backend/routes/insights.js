import express from 'express';
import { Customer, Order, Product } from '../models/index.js';
import { authMiddleware } from '../utils/auth.js';
import { Op } from 'sequelize';

const router = express.Router();

router.use(authMiddleware);


router.get('/totals', async (req, res) => {
  const tenant_id = req.user.tenant_id;
  const totalCustomers = await Customer.count({ where: { tenant_id } });
  const totalOrders = await Order.count({ where: { tenant_id } });
  const revenueRow = await Order.findAll({
    where: { tenant_id },
    attributes: [[Order.sequelize.fn('SUM', Order.sequelize.col('total_price')), 'revenue']]
  });
  const revenue = revenueRow[0].get('revenue') || 0;
  res.json({ totalCustomers, totalOrders, revenue: Number(revenue) });
});


router.get('/orders-by-date', async (req, res) => {
  const tenant_id = req.user.tenant_id;
  const from = req.query.from ? new Date(req.query.from) : new Date(0);
  const to = req.query.to ? new Date(req.query.to) : new Date();

  const orders = await Order.findAll({
    where: {
      tenant_id,
      created_at: { [Op.between]: [from, to] }
    },
    order: [['created_at', 'ASC']]
  });

  const byDate = {};
  for (const o of orders) {
    const d = o.created_at.toISOString().slice(0,10);
    byDate[d] = (byDate[d] || 0) + Number(o.total_price);
  }
  const series = Object.keys(byDate).map(k => ({ date: k, revenue: byDate[k] }));
  res.json({ series });
});


router.get('/top-customers', async (req, res) => {
  const tenant_id = req.user.tenant_id;
  const top = await Customer.findAll({
    where: { tenant_id },
    order: [['total_spent', 'DESC']],
    limit: 5
  });
  res.json({ top });
});

export default router;
