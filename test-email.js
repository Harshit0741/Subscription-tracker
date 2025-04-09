import  trans, { accountEmail } from './config/nodemailer.js';

trans.sendMail({
  from: accountEmail,
  to: 'gouravnag122@gmail.com',
  subject: '✅ Nodemailer Test',
  html: '<h1>Hello Harshit!</h1><p>This is a test email from Nodemailer.</p>',
}, (error, info) => {
  if (error) {
    console.error('❌ Failed to send email:', error);
  } else {
    console.log('✅ Email sent successfully:', info.response);
  }
});
