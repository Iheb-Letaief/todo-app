// import { FastifyInstance } from "fastify";
import Todo from "../models/Todo.js";
import User from "../models/User.js";
import {authenticate} from "../auth/authRoutes.js";
import { generateDescription } from "../services/aiService.js";
import {renderShareTodoEmail, renderTodoUnsharedEmail, sendEmail} from "../auth/services/emailService.js";


export default async function todoRoutes(fastify) {
    // Create a new Todo List
    fastify.post("/todos", { preHandler: authenticate }, async (req, reply) => {
        try {
            const { title } = req.body;
            const userId = req.user.id;

            if (!title) {
                return reply.status(400).send({ error: "Title is required" });
            }

            const newTodo = new Todo({ title, userId });
            await newTodo.save();

            return reply.status(201).send(newTodo);
        } catch (error) {
            console.error("Error creating todo:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    // Get all Todo Lists for the logged-in user
    fastify.get("/todos", { preHandler: authenticate }, async (req, reply) => {
        try {
            const userId = req.user.id;

            // fetch owned todos
            const ownedTodos = await Todo.find({ userId }).sort({ createdAt: -1 });

            // fetch shared todos
            const sharedTodos = await Todo.find({ "sharedWith.userId": userId }).sort({ createdAt: -1 });

            const todos = {
                owned: ownedTodos,
                shared: sharedTodos,
            }

            return reply.status(200).send(todos);
        } catch (error) {
            console.error("Error fetching todos:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    // Get a Todo List by ID
    fastify.get("/todos/:id", { preHandler: authenticate }, async (req, reply) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // Check if the user is the owner or a shared user
            const todo = await Todo.findOne({
                _id: id,
                $or: [
                    { userId },
                    { "sharedWith.userId": userId }
                ]
            });

            if (!todo) {
                return reply.status(404).send({ error: "Todo list not found" });
            }

            return reply.status(200).send(todo);
        } catch (error) {
            console.error("Error fetching todo:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    // Update a Todo List
    fastify.put("/todos/:id", { preHandler: authenticate }, async (req, reply) => {
        try {
            const { id } = req.params;
            const { title } = req.body;
            const userId = req.user.id;

            const todo = await Todo.findById(id);
            if (!todo) {
                return reply.status(404).send({ error: "Todo list not found" });
            }

            // Check if the user is either the owner or a shared user with edit permissions
            if (todo.userId.toString() !== userId && !todo.sharedWith.some(u => u.userId.toString() === userId && u.canEdit)) {
                return reply.status(403).send({ error: "You do not have permission to edit this todo list" });
            }

            todo.title = title;
            await todo.save();

            return reply.status(200).send(todo);
        } catch (error) {
            console.error("Error updating todo:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });



    // Delete a Todo List
    fastify.delete("/todos/:id", { preHandler: authenticate }, async (req, reply) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const todo = await Todo.findById(id);
            if (!todo) {
                return reply.status(404).send({ error: "Todo list not found" });
            }

            // Only the owner can delete the list (shared users cannot)
            if (todo.userId.toString() !== userId) {
                return reply.status(403).send({ error: "Only the owner can delete this todo list" });
            }

            await Todo.findByIdAndDelete(id);
            return reply.status(200).send({ message: "Todo list deleted successfully" });
        } catch (error) {
            console.error("Error deleting todo list:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    // Get the logged-in user's data
    fastify.get("/user", { preHandler: authenticate }, async (req, reply) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId).select("name email");

            if (!user) {
                return reply.status(404).send({ error: "User not found" });
            }

            return reply.status(200).send(user);
        } catch (error) {
            console.error("Error fetching user data:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
    // Generate description without creating a todo
    fastify.post("/generate-description", { preHandler: authenticate }, async (req, reply) => {
        try {
            const { title } = req.body;

            if (!title) {
                return reply.status(400).send({ error: "Title is required" });
            }

            const description = await generateDescription(title);
            return reply.status(200).send({ description });
        } catch (error) {
            console.error("Error generating description:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    // Generate a description for a Todo List
    fastify.post("/todos/:id/generate-description", { preHandler: authenticate }, async (req, reply) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const todo = await Todo.findOne({
                _id: id,
                $or: [
                    { userId },
                    { "sharedWith.userId": userId }
                ]
            });

            if (!todo) {
                return reply.status(404).send({ error: "Todo list not found" });
            }

            const description = await generateDescription(todo.title);

            todo.description = description;
            await todo.save();

            return reply.status(200).send({ description });
        } catch (error) {
            console.error("Error generating description:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    // ****** Task Routes ******

    // Create a new Task
    fastify.post("/todos/:id/tasks", { preHandler: authenticate }, async (req, reply) => {
        try {
            const { id } = req.params;
            const { title } = req.body;
            const userId = req.user.id;

            const todo = await Todo.findById(id);
            if (!todo) {
                return reply.status(404).send({ error: "Todo list not found" });
            }

            // Check if user is owner or has edit permissions
            if (todo.userId.toString() !== userId && !todo.sharedWith.some(u => u.userId.toString() === userId && u.canEdit)) {
                return reply.status(403).send({ error: "You do not have permission to add tasks" });
            }

            todo.tasks.push({ title });
            await todo.save();

            return reply.status(201).send(todo);
        } catch (error) {
            console.error("Error adding task:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });


    // get all Tasks for a Todo List
    fastify.get("/todos/:id/tasks", { preHandler: authenticate }, async (req, reply) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const todo = await Todo.findOne({ _id: id, userId });

            if (!todo) {
                return reply.status(404).send({ error: "Todo list not found" });
            }

            return reply.status(200).send(todo.tasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    // Update a Task
    fastify.put("/todos/:id/tasks/:taskId", { preHandler: authenticate }, async (req, reply) => {
        try {
            const { id, taskId } = req.params;
            const userId = req.user.id;
            const { title, completed } = req.body;

            const todo = await Todo.findById(id);

            if (!todo) {
                return reply.status(404).send({ error: "Todo list not found" });
            }

            // Check if user is owner or has edit permissions
            if (todo.userId.toString() !== userId && !todo.sharedWith.some(u => u.userId.toString() === userId && u.canEdit)) {
                return reply.status(403).send({ error: "You do not have permission to edit tasks" });
            }

            const task = todo.tasks.id(taskId);
            if (!task) {
                return reply.status(404).send({ error: "Task not found" });
            }

            if (title) task.title = title;
            if (typeof completed === "boolean") task.completed = completed;

            await todo.save();
            return reply.status(200).send({ message: "Task updated successfully", task });
        } catch (error) {
            console.error("Error updating task:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    // Delete a Task
    fastify.delete("/todos/:id/tasks/:taskId", { preHandler: authenticate }, async (req, reply) => {
        try {
            const { id, taskId } = req.params;
            const userId = req.user.id;

            const todo = await Todo.findById(id);

            if (!todo) {
                return reply.status(404).send({ error: "Todo list not found" });
            }

            const taskIndex = todo.tasks.findIndex((task) => task._id.toString() === taskId);
            if (taskIndex === -1) {
                return reply.status(404).send({ error: "Task not found" });
            }

            // Check if user is owner or has edit permissions
            if (todo.userId.toString() !== userId && !todo.sharedWith.some(u => u.userId.toString() === userId && u.canEdit)) {
                return reply.status(403).send({ error: "You do not have permission to edit tasks" });
            }

            todo.tasks.splice(taskIndex, 1);
            await todo.save();

            return reply.status(200).send({ message: "Task deleted successfully" });
        } catch (error) {
            console.error("Error deleting task:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    // ***** Shared User Routes *****

    // Share a Todo List with another
    fastify.post("/todos/:id/share", { preHandler: authenticate }, async (req, reply) => {
        try {
            const { id } = req.params;
            const { email, canEdit } = req.body;
            const ownerId = req.user.id;

            const todo = await Todo.findOne({ _id: id, userId: ownerId });
            if (!todo) {
                return reply.status(404).send({ error: "Todo list not found" });
            }

            const userToShareWith = await User.findOne({ email });
            if (!userToShareWith) {
                return reply.status(404).send({ error: "User not found" });
            }

            if (userToShareWith._id.toString() === ownerId) {
                return reply.status(400).send({ error: "You cannot share with yourself" });
            }

            const alreadyShared = todo.sharedWith.find((share) => share.userId.toString() === userToShareWith._id.toString());
            if (alreadyShared) {
                return reply.status(400).send({ error: "Todo list already shared with this user" });
            }

            todo.sharedWith.push({ userId: userToShareWith._id, email: userToShareWith.email, canEdit });
            await todo.save();

            const owner = await User.findById(ownerId).select("name");
            const todoLink = `${process.env.FRONTEND_URL}/dashboard/todos/${id}`;
            const permission = canEdit ? "Edit" : "View";
            const htmlContent = renderShareTodoEmail({
                ownerName: owner.name || "A user",
                todoTitle: todo.title,
                permission,
                todoLink,
            });


            // Send the email
            await sendEmail(
                userToShareWith.email,
                `Todo List Shared: ${todo.title}`,
                htmlContent
            );

            return reply.status(200).send({ message: "Todo list shared successfully" });
        } catch (error) {
            console.error("Error sharing todo list:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    // Get all shared Todo Lists
    fastify.get("/todos/shared", { preHandler: authenticate }, async (req, reply) => {
        try {
            const userId = req.user.id;

            const sharedTodos = await Todo.find({ "sharedWith.userId": userId }).populate("userId", "email");

            return reply.status(200).send(sharedTodos);
        } catch (error) {
            console.error("Error fetching shared todos:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    // Unshare a Todo List with another user
    fastify.delete("/todos/:id/unshare", { preHandler: authenticate }, async (req, reply) => {
        try {
            const { id } = req.params;
            const { email } = req.body;
            const ownerId = req.user.id;

            const todo = await Todo.findOne({ _id: id, userId: ownerId });
            if (!todo) {
                return reply.status(404).send({ error: "Todo list not found" });
            }

            const userToUnshare = await User.findOne({ email });
            if (!userToUnshare) {
                return reply.status(404).send({ error: "User not found" });
            }

            const sharedUser = todo.sharedWith.find(
                (share) => share.userId.toString() === userToUnshare._id.toString()
            );
            if (!sharedUser) {
                return reply.status(400).send({ error: "User not shared with this todo list" });
            }

            todo.sharedWith = todo.sharedWith.filter(
                (share) => share.userId.toString() !== userToUnshare._id.toString()
            );
            await todo.save();

            // Send unshare notification email
            const owner = await User.findById(ownerId).select("name");
            const htmlContent = renderTodoUnsharedEmail({
                ownerName: owner?.name || "A user",
                todoTitle: todo.title,
            });

            await sendEmail(
                userToUnshare.email,
                `Access Removed: ${todo.title}`,
                htmlContent
            );

            return reply.status(200).send({ message: "Todo list unshared successfully" });
        } catch (error) {
            console.error("Error unsharing todo list:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    // Update share permissions
    fastify.put("/todos/:id/share", { preHandler: authenticate }, async (req, reply) => {
        try {
            const { id } = req.params;
            const { email, canEdit } = req.body;
            const ownerId = req.user.id;

            const todo = await Todo.findOne({ _id: id, userId: ownerId });
            if (!todo) {
                return reply.status(404).send({ error: "Todo list not found" });
            }

            const userToUpdate = await User.findOne({ email });
            if (!userToUpdate) {
                return reply.status(404).send({ error: "User not found" });
            }

            const sharedUser = todo.sharedWith.find((share) => share.userId.toString() === userToUpdate._id.toString());
            if (!sharedUser) {
                return reply.status(404).send({ error: "User not shared with this todo list" });
            }

            sharedUser.canEdit = canEdit;
            await todo.save();

            return reply.status(200).send({ message: "Permissions updated successfully" });
        } catch (error) {
            console.error("Error updating share permissions:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });



}
