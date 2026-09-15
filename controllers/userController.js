import jwt from "jsonwebtoken";
import userService from "../services/userService.js";

const register = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso.",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.login(email, password);

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      message: "Login realizado com sucesso.",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

const logout = async (_req, res) => {
  return res.status(200).json({ message: "Logout realizado com sucesso." });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await userService.forgotPassword(email);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Erro ao solicitar recuperação de senha.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const result = await userService.resetPassword(token, password);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Erro ao redefinir senha.",
    });
  }
};

export default {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
