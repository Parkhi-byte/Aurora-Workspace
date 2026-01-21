
import Message from '../models/Message.js';

export const setupSocket = (io) => {
    io.on('connection', (socket) => {
        socket.emit("me", socket.id);

        socket.on("disconnect", () => {
            socket.broadcast.emit("callEnded");
        });

        // Room functionality for scheduled links
        socket.on("joinRoom", ({ roomId, name }) => {
            socket.join(roomId);
            // Notify existing users in the room that a new user has joined
            socket.to(roomId).emit("userJoined", { id: socket.id, name });
        });

        socket.on("callUser", (data) => {
            io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name });
        });

        socket.on("answerCall", (data) => {
            io.to(data.to).emit("callAccepted", data.signal);
        });

        // Chat functionality
        socket.on("typing", (room) => socket.in(room).emit("typing", room));
        socket.on("stopTyping", (room) => socket.in(room).emit("stopTyping", room));

        socket.on("sendMessage", async ({ room, text, senderId, type }) => {
            try {
                const newMessage = await Message.create({
                    room,
                    text,
                    sender: senderId,
                    type: type || 'text'
                });

                const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'name email');

                io.to(room).emit("receiveMessage", populatedMessage);
            } catch (error) {
                console.error("Socket Send Message Error:", error);
            }
        });
    });
};
