import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  contact_name: { type: String, required: true },
  company_name: { type: String, required: true },
  register_as: { type: String, required: true },
  SEAI_number: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // evita doppie registrazioni
  password: { type: String, required: true }, // sarà hashata prima del salvataggio
  permission_contact: { type: Boolean, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  otp: { type: String },
  otpExpires: { type: Date },
  isFirstLogin: { type: Boolean, default: true }

});

const User = mongoose.model("User", UserSchema);

export default User;
