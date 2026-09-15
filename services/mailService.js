import nodemailer from "nodemailer";

const isProd = process.env.NODE_ENV === "production";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT || 587),
  secure: String(process.env.MAIL_SECURE) === "true", // false para 587
  requireTLS: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  // Só para ambiente local quando há proxy/antivírus interceptando TLS
  tls: isProd ? undefined : { rejectUnauthorized: false },
});

export async function sendResetPasswordEmail({ to, firstName, resetLink }) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to,
    subject: "Recuperação de senha",
    html: `
      <p>Olá, ${firstName || "usuário"}.</p>
      <p>Clique no link para redefinir sua senha (15 min):</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  });
}
