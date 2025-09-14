import express from 'express';
import bcrypt from 'bcryptjs';

import { User, Tenant } from '../models/index.js';
import { signToken } from '../utils/auth.js';

const router = express.Router();


router.post('/signup', async (req, res) => {
  try {
    const { email, password, store_name } = req.body;
    if (!email || !password || !store_name) return res.status(400).json({ error: 'Please pass all the detials' });
    const t = await Tenant.create({ store_name });
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password_hash, tenant_id: t.id });
    const token = signToken({ id: user.id, tenant_id: t.id, email: user.email });
    res.json({
       token,
        tenant: { id: t.id, store_name },
        message:"signup successfully"
       });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: 'Server error' 
    });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ 
      error: 'Invalid credentials' 
    });

    const isCorrect = await bcrypt.compare(password, user.password_hash);
    if (!isCorrect) return res.status(400).json({
       error: 'Invalid credentials' 
      });
    const token = signToken({ id: user.id, tenant_id: user.tenant_id, email: user.email });
    res.json({ token, tenant_id: user.tenant_id ,
      success:true,
      message:"Login successfuly"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
 