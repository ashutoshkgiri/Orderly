import Sequelize from 'sequelize';
import CustomerModel from './customer.js';
import UserModel from './user.js';
import TenantModel from './tenant.js';
import ProductModel from './product.js';
import OrderModel from './order.js';
import dotenv from 'dotenv';
dotenv.config();
const sequelize = new Sequelize(
  process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
  }
);
 

const Tenant = TenantModel(sequelize);
const User = UserModel(sequelize);
const Customer = CustomerModel(sequelize);
const Product = ProductModel(sequelize);
const Order = OrderModel(sequelize);

Tenant.hasMany(User, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
User.belongsTo(Tenant, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
Tenant.hasMany(Customer, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
Customer.belongsTo(Tenant, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
Tenant.hasMany(Product, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
Product.belongsTo(Tenant, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
Tenant.hasMany(Order, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
Order.belongsTo(Tenant, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });

Customer.hasMany(Order, { foreignKey: 'customer_id', onDelete: 'CASCADE' });
Order.belongsTo(Customer, { foreignKey: 'customer_id', onDelete: 'CASCADE' });
Product.hasMany(Order, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Order.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });

export { sequelize, Tenant, User, Customer, Product, Order };