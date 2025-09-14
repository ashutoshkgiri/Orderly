import { DataTypes } from 'sequelize';

const Tenant = (sequelize) => sequelize.define('Tenants', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  store_name: { type: DataTypes.STRING }
}, {
  freezeTableName: true
});

export default Tenant;