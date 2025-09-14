import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';
import { sequelize, Tenant, User, Customer, Product, Order } from './models/index.js';

async function seed() { 
  await sequelize.sync({ alter:true});
  const t = await Tenant.create({ store_name: 'v-mart'});
  const password_hash = await bcrypt.hash('12345678', 10);
  const user = await User.create({ email: 'ankit@gmail.com', password_hash, tenant_id: t.id });
  

  const p1 = await Product.create({ tenant_id: t.id, external_id: 'prod_1', title: 'Blue T-Shirt', price: 200 });
  const p2 = await Product.create({ tenant_id: t.id, external_id: 'prod_2', title: 'Red Hoodie', price: 300});

 
  const c1 = await Customer.create({ tenant_id: t.id, external_id: 'cust_1', email: 'mohit@example.com', first_name: 'Mohit', last_name: '', total_spent: 0 });
  const c2 = await Customer.create({ tenant_id: t.id, external_id: 'cust_2', email: 'aakash@example.com', first_name: 'Aakash', last_name: '', total_spent: 0 });


  const o1 = await Order.create({
    tenant_id: t.id,
    external_id: 'order_1',
    total_price: 300,
    currency: 'INR',
    created_at: new Date(),
    customer_id: c1.id,
    product_id: p1.id,
    line_items: [{ product_external_id: p1.external_id, qty: 2, price: p1.price }]
  });
  c1.total_spent = Number(c1.total_spent) + Number(o1.total_price);
  await c1.save();

  const o2 = await Order.create({
    tenant_id: t.id,
    external_id: 'order_2',
    total_price: 500,
    currency: 'INR',
    created_at: new Date(Date.now() - 86400000 * 2), 
    customer_id: c2.id,
    product_id: p2.id,
    line_items: [{ product_external_id: p2.external_id, qty: 1, price: p2.price }]
  });
  c2.total_spent = Number(c2.total_spent) + Number(o2.total_price);
  await c2.save();

  console.log('Seed done. Tenant id:', t.id, 'Login email: demo@xeno.test / password: password123');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); }); 