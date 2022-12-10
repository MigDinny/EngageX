import * as constants from "./constants.js";

export const sendMessage = (socket, message) => {
    // Web Socket is connected, send data using send()
    socket.send(JSON.stringify(message));
};

export const closeSocket = (c, socket) => {
    socket.onclose = function () {
        alert("Socket connection is closed...");
    };
};

export const interpretMessage = (c, gameState, socket, message) => {
    console.log(message);

    const event = JSON.parse(message);

    switch (event.type) {
        case "init":
            gameState.playerID = event.id;
            break;

        case "start":
            // initialize all players
            var arr = event.players;
            for (let i = 0; i < arr.length; i++) {
                gameState.players[arr[i].id] = {
                    id: arr[i].id,
                    position: [arr[i].x, arr[i].y],
                    model: arr[i].model,
                    hp: arr[i].hp,
                    xp: arr[i].xp,
                    foodArr: arr[i].food,
                    gameObjectIndex: gameState.gameObjectIndexCounter++,
                };
            }

            gameState.started = true;
            break;

        case "update":
            var arr = event.players;
            for (let i = 0; i < arr.length; i++) {
                gameState.players[arr[i].id].position = [arr[i].x, arr[i].y];
                gameState.players[arr[i].id].hp = arr[i].hp;
                gameState.players[arr[i].id].xp = arr[i].xp;
                gameState.players[arr[i].id].foodArr = arr[i].food;
            }
            break;

        case "fight":
            break;

        case "info":
            console.log(`[${event.player} , ${event.x} , ${event.y}]`);
            break;

        case "ignore":
            return;

        case "ready":
            return event.id;
            break;
        
        case "endGame":
            var arr = event.players;
            for (let i = 0; i < arr.length; i++) {
                gameState.players[arr[i].id].hp = arr[i].hp;
                gameState.players[arr[i].id].xp = arr[i].xp;
            }
            gameState.ended = true;
            break;
        default:
            throw new Error(`Unsupported event type: ${event.type}.`);
    }
};
