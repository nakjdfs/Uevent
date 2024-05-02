import User from "./schemes/User.js";
import Event from "./schemes/Event.js";
import Ticket from "./schemes/Ticket.js";
import Company from "./schemes/Company.js";
import EventFormat from "./schemes/EventFormat.js";

export function defineAssociations() {
  // for User
  User.belongsTo(Company, { foreignKey: 'companyId', allowNull: true });

  // for Company
  Company.hasMany(User, { foreignKey: 'companyId' });

  // for Event
  Event.belongsTo(Company, { foreignKey: 'companyId' });
  Event.belongsTo(EventFormat, { foreignKey: 'formatId' });
  Event.hasMany(Ticket, { foreignKey: 'eventId' });

  // for Event_Format
  EventFormat.hasMany(Event, { foreignKey: 'formatId' });

  // for Ticket
  Ticket.belongsTo(User, { foreignKey: 'userId' });
  Ticket.belongsTo(Event, { foreignKey: 'eventId' });

  Event.sync({ alter: true }).then(() => {
    console.log('Таблицю оновлено');
  }).catch(err => {
    console.error('Не вдалося оновити таблицю:', err);
  });
}