import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Event = sequelize.define('Event', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.GEOMETRY,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("planning", "upcoming", "completed", "cancelled"),
    defaultValue: "planning"
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  occupiedCapacity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  logo: {
    type: DataTypes.STRING,
    defaultValue: "default.jpg"
  },
  cover: {
    type: DataTypes.STRING,
    defaultValue: ""
  }
},
{
  strict: true
});

export default Event;