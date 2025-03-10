import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const SharedUserSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    canEdit: { type: Boolean, default: false },
});

const TodoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tasks: [TaskSchema],

        sharedWith: [SharedUserSchema],
    },
    { timestamps: true }
);

const Todo = mongoose.model("Todo", TodoSchema);
export default Todo;
