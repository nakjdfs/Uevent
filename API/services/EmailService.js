import nodemailer from "nodemailer";
import { config } from 'dotenv';

config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'smtp.ukr.net',
            host: 'smtp.ukr.net',
            port: 2525,
            secure: true,
            auth: {
              user: `${process.env.EMAIL_LOGIN}`,
              pass: `${process.env.EMAIL_PASS}`
            }
        });
    }

    async sendTicketMail(email, ticketMailData) {
        const eventStartDate = new Date(ticketMailData.eventStartTime);
        const minutes = eventStartDate.getMinutes();
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        await this.transporter.sendMail({
            from: `${process.env.EMAIL_LOGIN}`,
            to: `${email}`,
            subject: `Your ticket for ${ticketMailData.eventName} event`,
            text: "",
            html: `
                        <div>
                            <h1>Ticket №${ticketMailData.ticketN}</h1>
                            <h2>Event: ${ticketMailData.eventName}</h2>
                            <h2>Owner: ${ticketMailData.userBio}</h2>
                            <h2>Code: ${ticketMailData.ticketCode}</h2>
                            <h2>Start Time: ${eventStartDate.getDate()}.${eventStartDate.getMonth() + 1}.${eventStartDate.getFullYear()}, ${eventStartDate.getHours()}:${formattedMinutes}</h2>
                        </div>
                    `,
        });
    }

    async sendMail(email, code) {
        const link = `http://${"localhost"}:${process.env.PORT}/api/auth/confirm/${code}`;
        await this.transporter.sendMail({
            from: `${process.env.EMAIL_LOGIN}`,
            to: `${email}`,
            subject: "Activation account UEVENT",
            text: "",
            html: `
                        <div>
                            <h1>Activation link</h1>
                            <h2>link </h2>
                            <a href="${link}">click to verify</a>
                        </div>
                    `,
        });
    }
}

const emailService = new EmailService();

export default emailService;
