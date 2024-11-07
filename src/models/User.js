import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthday: { type: Date, default: Date.now() },
    password: { type: String, required: true },
    emailsEnviados: [
      {
        to: { type: String },
        subject: { type: String },
        message: { type: String },
        dateSent: { type: Date, default: Date.now },
      },
    ],
  },
  { versionKey: false }
);

const user = mongoose.model("user", userSchema);

export default user;
