// sockets/socketHandler.js
import { joinQueue, updateProgress, leaveRoom } from "./rooms.js";

export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinQueue", async () => {
      try {
        await joinQueue(io, socket);
      } catch (err) {
        console.error("Error joining queue:", err);
      }
    });

    socket.on("progressUpdate", (data) => updateProgress(io, socket, data));
    socket.on("exitRace", () => leaveRoom(io, socket));

    // Handle disconnection
    socket.on("disconnect", () => {
      leaveRoom(io, socket); // This ensures the player is removed from the room properly
    });
  });
};
