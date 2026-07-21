const nodemailer = require('nodemailer');

// Create Nodemailer Transporter
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return null;
};

// Generic Email Sender
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    const from = process.env.EMAIL_FROM || '"HackPulse Platform" <noreply@hackpulse.com>';

    if (transporter) {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text: text || subject,
        html
      });
      console.log(`Email sent successfully to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log(`[Email Simulation] To: ${to} | Subject: ${subject}`);
      return { success: true, simulated: true };
    }
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Preset Notification Templates
const sendNotification = {
  registrationApproved: async (userEmail, userName, hackathonTitle) => {
    return sendEmail({
      to: userEmail,
      subject: `Registration Approved - ${hackathonTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4f46e5;">Registration Approved!</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Great news! Your registration for <strong>${hackathonTitle}</strong> has been officially <strong>APPROVED</strong> by the organizer.</p>
          <p>Log in to your dashboard to create or join a team and start building!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">HackPulse Platform - Hackathon Management System</p>
        </div>
      `
    });
  },

  submissionSuccessful: async (userEmail, userName, projectName, hackathonTitle) => {
    return sendEmail({
      to: userEmail,
      subject: `Project Submitted - ${projectName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #10b981;">Project Submission Received!</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Your team project <strong>${projectName}</strong> for <strong>${hackathonTitle}</strong> has been successfully received.</p>
          <p>Good luck during the judge evaluation phase!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">HackPulse Platform</p>
        </div>
      `
    });
  },

  resultsPublished: async (userEmail, userName, hackathonTitle) => {
    return sendEmail({
      to: userEmail,
      subject: `Results Published - ${hackathonTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #8b5cf6;">Results & Winners Announced!</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>The official results and leaderboard for <strong>${hackathonTitle}</strong> are now live!</p>
          <p>Log in now to view the podium winners, leaderboard rankings, and judge evaluations.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">HackPulse Platform</p>
        </div>
      `
    });
  }
};

module.exports = {
  sendEmail,
  sendNotification
};
