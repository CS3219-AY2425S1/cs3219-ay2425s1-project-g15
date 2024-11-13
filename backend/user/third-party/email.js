import nodemailer from 'nodemailer';

// Create a transporter object using the SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail', 'yahoo', or use SMTP settings for a custom service
  auth: {
    user: 'peerprepg15@gmail.com', // replace with your email
    pass: process.env.EMAIL_PASSWORD    // replace with your email password or app-specific password
  }
});

// Function to send an email
export const sendVerificationEmail = async (email, username, code) => {
  try {
    const link = `${process.env.FRONTEND_URL}/verify?code=${code}`;
    const info = await transporter.sendMail({
      from: '"Mai from PeerPrep" <peerprepg15@gmail.com>', // sender address
      to: email,                 // recipient address(es)
      subject: 'Verify Your Email for PeerPrep',               // subject line
      html: `
        Hi, ${username}!<br><br>
        Welcome to PeerPrep! We’re excited to have you on board.<br><br>
        To complete your registration, please confirm your email address by clicking the link below:
        <a href="${link}">${link}</a><br><br>
        If you did not create an account with PeerPrep, please disregard this email.<br><br>
        Thanks for joining our community! We’re here to help you every step of the way.<br><br>
        Best regards,<br>
        Mai from PeerPrep
      ` // HTML body (optional)
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendPasswordResetEmail = async (email, username, code) => {
  try {
    const link = `${process.env.FRONTEND_URL}/reset-password?code=${code}`;
    const info = await transporter.sendMail({
      from: '"Mai from PeerPrep" <peerprepg15@gmail.com>', // sender address
      to: email,                 // recipient address(es)
      subject: 'Reset Your Password for PeerPrep',               // subject line
      html: `
        Hi, ${username}!<br><br>
        We received a request to reset your password for your PeerPrep account.<br><br>
        To reset your password, please click the link below:
        <a href="${link}">${link}</a><br><br>
        If you did not request a password reset, please disregard this email.<br><br>
        Thanks for using PeerPrep! We’re here to help you every step of the way.<br><br>
        Best regards,<br>
        Mai from PeerPrep
      ` // HTML body (optional)
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
