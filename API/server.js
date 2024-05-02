import fs 					  from 'fs';
import cors 				  from 'cors'
import https 				  from 'https';
import express          	  from 'express';
import sequelize        	  from './db/db.js';
import { config } 			  from 'dotenv';
import { defineAssociations } from './db/associations.js'

import authRouter from './routers/authRouter.js'
import userRouter from './routers/userRouter.js'
import companyRouter from './routers/companyRouter.js'
import eventFormatRouter from './routers/eventFormatRouter.js'
import eventRouter from './routers/eventRouter.js'
import ticketRouter from './routers/ticketTouter.js'

config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
// app.use(cors());
app.use(cors({ origin: 'https://localhost:5173' }));

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/events', eventRouter);
app.use('/api/tickets', ticketRouter);
app.use('/api/companies', companyRouter);
app.use('/api/eventFormats', eventFormatRouter);

const options = {
	key: fs.readFileSync('./certificate/localhost-key.pem'),
	cert: fs.readFileSync('./certificate/localhost.pem'),
};

import User from './db/schemes/User.js';
// import bcrypt from 'bcrypt';
// const saltRounds = 10;
// const hashedPassword = await bcrypt.hash("admin", saltRounds);
// await User.create({
// 	login: "admin",
// 	email: "test@gmail.com",
// 	password: hashedPassword,
// 	role: "Admin"
// });

import authManager from './services/SessionService.js';
app.get('/api/users1', async (req, res) => {
	try {
		const users = await User.findAll();
		const simplifiedUsers = users.map(user => ({ id: user.id, login: user.login, role: user.role }));
		return res.status(200).json([simplifiedUsers, authManager.getTempUsers(), authManager.getAuthUsers()]);
	} catch (error) {
		console.error('Ошибка при получении списка пользователей:', error);
		return res.status(500).json({ error: 'Ошибка сервера' });
	}
});

defineAssociations();

sequelize.sync().then(() => {
	const server = https.createServer(options, app);
	
	server.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});


// { force: true }