import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    navegationScore: { type: Number, default: 0, min: 0, max: 5 },
    appearanceScore: { type: Number, default: 0, min: 0, max: 5 },
  },
  { versionKey: false }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
