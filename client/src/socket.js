import { load, drawMap, updatePlayer, updateMap } from "./map-rendering.js";

export const sendMessage = (socket, message) => {
    // Web Socket is connected, send data using send()
    socket.send(JSON.stringify(message));
};

export const closeSocket = (c, socket) => {
    socket.onclose = function () {
        alert("Socket connection is closed...");
    };
};

export const interpretMessage = (c, socket, message, id) => {
    console.log(message);
    //console.log(message.data.type)

    const event = JSON.parse(message);

    switch (event.type) {
        case "init":
            console.log(`[${event.player} , ${event.id}]`);
            return { type: "id", id: event.id };

        case "update":
            console.log(`[${event.player} , ${event.map_state}]`);
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

        default:
            throw new Error(`Unsupported event type: ${event.type}.`);
    }
};
