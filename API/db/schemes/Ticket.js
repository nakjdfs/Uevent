import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Ticket = sequelize.define('Ticket', {
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
{
    strict: true
});

export default Ticket;