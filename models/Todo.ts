import mongoose, { Schema, models } from 'mongoose';

const TodoSchema = new Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

export default models.Todo || mongoose.model('Todo', TodoSchema);
