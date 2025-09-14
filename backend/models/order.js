// filepath: d:\server\backend\models\order.js
import { DataTypes } from 'sequelize';

const Order = (sequelize) => sequelize.define('Orders', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tenant_id: { type: DataTypes.INTEGER },
  external_id: { type: DataTypes.STRING },
  total_price: { type: DataTypes.DECIMAL(12,2) },
  currency: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE },
  customer_id: { type: DataTypes.INTEGER },
  product_id: { type: DataTypes.INTEGER },
  line_items: { type: DataTypes.JSON }
}, {
  freezeTableName: true
});

export default Order;