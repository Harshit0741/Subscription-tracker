import dayjs from "dayjs";
import { emailTemplates } from "./email-template.js";
import trans, { accountEmail } from "../config/nodemailer.js";

export const sendReminderEmail = async ({ to, type, subscription }) => {
    if (!to || !type || !subscription) throw new Error("Missing required parameters");

    console.log("Sending reminder to:", to);
    console.log("Email type:", type);
    console.log("Subscription:", subscription);

    const template = emailTemplates.find(t => t.label === type);
    if (!template) throw new Error("Invalid email template type");

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.title || subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format("YYYY-MM-DD"),
        planName: subscription.planName || subscription.name,
        price: `${subscription.currency} ${subscription.price} ${subscription.frequency}`,
        paymentMethod: subscription.paymentMethod,
    };

    const subject = template.generateSubject(mailInfo);
    const message = template.generateBody(mailInfo);

    const mailOptions = {
        from: accountEmail,
        to,
        subject,
        html: message,
    };

    try {
        const info = await trans.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
