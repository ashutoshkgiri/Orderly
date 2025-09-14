import express from 'express';
import { Customer, Product, Order } from '../models/index.js';
import { authMiddleware } from '../utils/auth.js';

const router = express.Router();




router.post('/webhook', async (req, res) => {
  try {
    const { tenant_id, type, data } = req.body;

    if (!tenant_id || !type || !data) return res.status(400).json({
       error: 'Missing fields'
       });
    
    if (type.startsWith('customers')) {
      const c = await Customer.create({
        tenant_id,
        external_id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        total_spent: data.total_spent || 0
      });
      return res.json({ ok: true, customer: c });
    }
    if (type.startsWith('products')) {
      const p = await Product.create({
        tenant_id,
        external_id: data.id,
        title: data.title,
        price: data.price || 0
      });
      return res.json({ ok: true, product: p });
    }
if (type.startsWith('orders')) {
  const o = await Order.create({
    tenant_id,
    external_id: data.id,
    total_price: Number(data.total_price) || 0,
    currency: data.currency || 'INR',
    created_at: data.created_at ? new Date(data.created_at) : new Date(),
    customer_id: data.customer_id,
    line_items: data.line_items || []
  }); 

  if (data.customer_id) {
    const cust = await Customer.findOne({ where: { tenant_id, id: data.customer_id } });
    if (cust) {
      cust.total_spent = Number(cust.total_spent || 0) + Number(data.total_price || 0);
      await cust.save();
    } else {
      console.warn(`Customer with id ${data.customer_id} not found for tenant ${tenant_id}`);
    }
  }

  return res.json({ ok: true, order: o });
}

    return res.status(400).json({ error: 'Unknown type' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



export default router;
