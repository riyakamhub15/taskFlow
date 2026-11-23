const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendDeadlineEmail = async (email, task) => {
  await transporter.sendMail({
    from: `"TaskFlow" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Deadline Reminder: ${task.title}`,
    html: `
      <h2>TaskFlow Deadline Reminder</h2>
      <p>Hello!</p>
      <p>Your task <strong>${task.title}</strong> is approaching its deadline.</p>
      <p><strong>Deadline:</strong> ${new Date(task.deadline).toLocaleString()}</p>
      <p>Please complete your task on time.</p>
      <p>— Team TaskFlow</p>
    `,
  });
};

module.exports = { sendDeadlineEmail };