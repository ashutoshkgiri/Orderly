import { DataTypes } from 'sequelize';

const Product = (sequelize) => sequelize.define('Products', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tenant_id: { type: DataTypes.INTEGER },
  external_id: { type: DataTypes.STRING },
  title: { type: DataTypes.STRING },
  price: { type: DataTypes.DECIMAL(10,2) }
}, {
  freezeTableName: true
});

export default Product;