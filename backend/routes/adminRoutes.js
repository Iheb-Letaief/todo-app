import User from "../models/User.js";
import {authenticateAdmin} from "../middleware.js";

async function adminRoutes(fastify, options) {
    // List all users (Admin only)
    fastify.get('/users', { preHandler: [authenticateAdmin] }, async (request, reply) => {
        try {
            const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 }); // exclude passwords
            reply.send({ users });
        } catch (err) {
            request.log.error(err);
            reply.code(500).send({ message: 'Error fetching users' });
        }
    });

    // Delete user (Admin only)
    fastify.delete('/users/:id', { preHandler: [authenticateAdmin] }, async (request, reply) => {
        const { id } = request.params;

        try {
            const user = await User.findById(id);
            if (!user) {
                return reply.code(404).send({ message: 'User not found' });
            }

            if (user.role === 'admin') {
                return reply.code(403).send({ message: 'Cannot delete admin user' });
            }

            await User.findByIdAndDelete(id);
            reply.send({ message: 'User deleted successfully' });
        } catch (err) {
            request.log.error(err);
            reply.code(500).send({ message: 'Error deleting user' });
        }
    });
}

export default adminRoutes;
