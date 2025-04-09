import nodemailer from 'nodemailer';
import { EMAIL_PASS } from './env.js';

export const accountEmail = 'gouravnag122@gmail.com'

const trans = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: accountEmail,
        pass: EMAIL_PASS,
    },
})

export default trans;
