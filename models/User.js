import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Primeiro nome é obrigatório."],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Sobrenome é obrigatório."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "E-mail é obrigatório."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Senha é obrigatória."],
      minlength: 6,
    },

    // Campos para reset de senha
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },

    loginHistory: [
      {
        type: Date,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
