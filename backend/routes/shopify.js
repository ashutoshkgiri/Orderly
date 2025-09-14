import express from "express";
import axios from "axios";
import { Customer } from "../models/index.js"; 

const router = express.Router();

const API_VERSION = "2024-07";

async function storeShopifyCustomers(shopifyCustomers, tenantId) {
  for (const c of shopifyCustomers) {
    await Customer.upsert({
      tenant_id: tenantId,
      external_id: String(c.id),
      email: c.email || null,
      first_name: c.first_name || null,
      last_name: c.last_name || null,
      total_spent: parseFloat(c.total_spent || 0)
    });
  }
}

// POST /api/shopify/import-customers
router.post("/import-customers", async (req, res) => {
  try {
    const { shopName, accessToken, tenantId } = req.body;

    if (!shopName || !accessToken || !tenantId) {
      return res.status(400).json({ error: "shopName, accessToken, tenantId are required" });
    }

    const response = await axios.get(
      `https://${shopName}.myshopify.com/admin/api/${API_VERSION}/customers.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json"
        }
      }
    );

    const customers = response.data.customers;
    await storeShopifyCustomers(customers, tenantId);

    res.json({ message: "✅ Customers imported successfully", count: customers.length });
  } catch (err) {
    console.error("❌ Error importing customers:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to import customers" });
  }
});
 
export default router;
