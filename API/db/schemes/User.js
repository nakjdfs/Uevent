import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const User = sequelize.define('User', {
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // rating: {
  //   type: DataTypes.INTEGER,
  //   defaultValue: 0
  // },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: "default.jpg"
  },
  role: {
    type: DataTypes.ENUM('Admin', 'User'),
    defaultValue: 'User'
  }
},
{
  strict: true
});

export default User;


//
// router -> (middleware) -> routerHandler -> ModelControler -> Model -> Scheme
//                                       \      /
//                                        \    /
//                                       services
//                  
//  Users -> Companies
//  Events
//  Tickets
//
//  Promocodes
//  Comments
//  
//  Notifications
//  Subscriptions
//  
//  Event_Formats
//  Event_Themes
// 
// 
//  
//
//
// 
// 
// 
//  
