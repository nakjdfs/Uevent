import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const EventFormat = sequelize.define('Event_Format', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  }
},
{
  strict: true
});

export default EventFormat;