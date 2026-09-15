import nodemailer from "nodemailer";

export async function verifyMailConnection() {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: String(process.env.MAIL_SECURE) === "true",
    requireTLS: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls:
      process.env.NODE_ENV === "production"
        ? undefined
        : { rejectUnauthorized: false },
  });

  await transporter.verify();
  console.log("SMTP OK");
}
