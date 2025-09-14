import { DataTypes } from 'sequelize';

const Customer = (sequelize) => sequelize.define('Customer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  external_id: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  first_name: { type: DataTypes.STRING },
  last_name: { type: DataTypes.STRING },
  total_spent: { type: DataTypes.DECIMAL(12,2), defaultValue: 0.00 }
});

export default Customer;