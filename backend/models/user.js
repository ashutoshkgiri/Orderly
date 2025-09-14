import { DataTypes } from 'sequelize';

const User = (sequelize) => sequelize.define('Users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING },
  password_hash: { type: DataTypes.STRING },
  tenant_id: { type: DataTypes.INTEGER }
}, {
  freezeTableName: true
});

export default User;