import getRandomStory from "../models/story.js";
const rooms = {};
let roomCount = 0;

/*
Given a roomId it will create an object with 2 parameters. a player variable ~ array and text variable ~ story
*/

async function createRoom(roomId) {
  rooms[roomId] = {
    players: [],
    playerData: {}, // Each player will get their own { progress, wpm }
    text: (await getRandomStory({ multiplayer: true })).content,
    time: 0,
    countDown: 0,
    gameStarted: false,
    gameEnded: false,
    finishedOrder: [],
  };
}

/*
Loops through rooms if a room has less than 4 players than the player will get added to it
else it'll create a new room with a unique roomId
*/

async function getAvailableRoomId() {
  for (const roomId in rooms) {
    const room = rooms[roomId];
    if (!room.gameEnded && !room.gameStarted && room.players.length < 4) {
      return roomId;
    }
  }

  const newRoomId = `room_${++roomCount}`;
  await createRoom(newRoomId);
  return newRoomId;
}

/*
gets an available room adds the player to that room, sends request to all the players within that room that a player has joined and the players
a list of players in that room. if the room has 4 players the game will start
*/

export async function joinQueue(io, socket) {
  for (const roomId in rooms) {
    const room = rooms[roomId];
    if (room.players.includes(socket.id)) {
      leaveRoom(io, socket);
    }
  }
  const roomId = await getAvailableRoomId();

  if (!rooms[roomId].players.includes(socket.id)) {
    rooms[roomId].players.push(socket.id);
    rooms[roomId].playerData[socket.id] = { progress: 0, wpm: 0 };
  }

  socket.join(roomId);

  io.to(roomId).emit("gameInfo", {
    roomId,
    text: rooms[roomId].text,
    players: rooms[roomId].players,
    inGame: true,
  });

  socket.emit("playerId", socket.id);

  if (rooms[roomId].players.length === 4) {
    let countdown = 2;
    rooms[roomId].gameStarted = true;
    const countdownInterval = setInterval(() => {
      io.to(roomId).emit("countdown", countdown);

      if (countdown === 0) {
        io.to(roomId).emit("gameStarted", true);
        clearInterval(countdownInterval);

        let countdownTime = 180; // 5 seconds for demo; change to 180 for 3 min

        const gameTimer = setInterval(() => {
          rooms[roomId].time = countdownTime;
          io.to(roomId).emit("timer", countdownTime);
          if (rooms[roomId].gameEnded || countdownTime <= 0) {
            clearInterval(gameTimer);
            rooms[roomId].gameEnded = true;
            io.to(roomId).emit("gameEnd", {
              status: true,
              finalPlayerData: rooms[roomId].playerData,
            });
            return;
          }

          countdownTime--;
        }, 1000);
      }

      countdown--;
    }, 1000);
  }
}

export function updateProgress(io, socket, { roomId, progress, wpm }) {
  const room = rooms[roomId];
  if (!room) {
    console.warn(`Room with ID ${roomId} not found`);
    return;
  }

  if (progress === 100 && !room.finishedOrder.includes(socket.id)) {
    room.finishedOrder.push(socket.id);
  }

  room.playerData[socket.id] = { progress, wpm };

  io.to(roomId).emit("progressUpdate", {
    finishedOrder: room.finishedOrder,
    playerId: socket.id,
    progress,
    wpm,
  });
}

export function leaveRoom(io, socket) {
  for (const roomId in rooms) {
    const room = rooms[roomId];

    if (!room.players.includes(socket.id)) continue;

    socket.leave(roomId);
    // Remove player from the room's internal list
    if (!room.gameStarted) {
      room.players = room.players.filter((id) => id !== socket.id);
      delete room.playerData[socket.id];
      io.to(roomId).emit("gameInfo", {
        roomId,
        text: room.text,
        players: room.players,
        inGame: room.players.length > 0,
      });
    }

    // If room is now empty, stop timers and clean up
    if (room.players.length === 0) {
      if (room.countdownInterval) clearInterval(room.countdownInterval);
      if (room.gameTimer) clearInterval(room.gameTimer);
      room.countdownInterval = null;
      room.gameTimer = null;
      room.gameStarted = false;
      room.gameEnded = false;
    }
  }
}
