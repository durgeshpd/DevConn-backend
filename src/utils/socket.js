
const socket = require("socket.io");
const crypto = require("crypto");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto
        .createHash("sha256")
        .update([userId, targetUserId].sort().join("_"))
        .digest("hex");
}

const initializeSocket = (server) => {

    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.on("connection", (socket) => {

        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            console.log(firstName + " joined Room " + roomId)

            socket.join(roomId);

        });

        socket.on("sendMessage", ({
            firstName,
            userId,
            targetUserId,
            text,
            avatar,

        })  => {
            const roomId = getSecretRoomId(userId, targetUserId);
           io.to(roomId).emit("messageReceived", {firstName, text, avatar})
        });

        socket.on("disconnect", () => {

        });

    });
};

module.exports = initializeSocket;