import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Company = sequelize.define('Company', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // rating: {
  //   type: DataTypes.INTEGER,
  //   defaultValue: 0
  // },
  logo: {
    type: DataTypes.STRING,
    defaultValue: "default.jpg"
  }
},
{
  strict: true
});

export default Company;