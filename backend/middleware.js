

// export async function authenticate(request, reply) {
//     try {
//         const authHeader = request.headers.authorization;
//         if (!authHeader) throw new Error("No token provided");
//
//         const token = authHeader.split(" ")[1];
//         request.user = await request.jwtVerify();
//     } catch (error) {
//         return reply.status(401).send({ message: "Unauthorized" });
//     }
// }

export async function authenticateAdmin(request, reply) {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error("No token provided");

        const token = authHeader.split(" ")[1];
        const decoded = await request.jwtVerify();

        request.user = decoded;
        if (decoded.role !== "admin") throw new Error("Unauthorized");

    } catch (error) {
        return reply.status(401).send({ message: "Unauthorized" });
    }
}