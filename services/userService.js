import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
import { sendResetPasswordEmail } from "./mailService.js";

const createUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    throw new Error("E-mail já cadastrado.");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  return await User.create({
    ...userData,
    password: hashedPassword,
  });
};

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Usuário ou senha inválidos.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Usuário ou senha inválidos.");
  }

  const loginDate = new Date();

  user.lastLogin = loginDate;
  user.loginHistory.push(loginDate);

  await user.save();

  return user;
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  // Mensagem neutra (segurança)
  if (!user) {
    return { message: "Se o e-mail existir, enviaremos instruções." };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = expiresAt;
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

  await sendResetPasswordEmail({
    to: user.email,
    firstName: user.firstName,
    resetLink,
  });

  return { message: "Se o e-mail existir, enviaremos instruções." };
};

const resetPassword = async (token, newPassword) => {
  if (!token || !newPassword) {
    throw new Error("Token e nova senha são obrigatórios.");
  }

  if (newPassword.length < 6) {
    throw new Error("A nova senha deve ter no mínimo 6 caracteres.");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("Token inválido ou expirado.");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  return { message: "Senha atualizada com sucesso." };
};

export default {
  createUser,
  login,
  forgotPassword,
  resetPassword,
};
