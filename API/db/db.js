import { Sequelize } from 'sequelize';
// import { defineAssociations } from './associations.js';

const sequelize = new Sequelize('uevent', 'scheban', 'securepass', {
  host: 'localhost',
  dialect: 'mysql'
});

// const sequelize = new Sequelize('uevent', 'root', 'root', {
//   host: 'localhost',
//   dialect: 'mysql'
// });

// defineAssociations();

sequelize
  .authenticate()
  .then(() => {
    console.log('The connection to the database has been established successfully!');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

export default sequelize;