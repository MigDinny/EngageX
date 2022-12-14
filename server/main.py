import asyncio
import json
import threading
import time
import websockets
import socket
from lobby import Lobby

clients = {}
client_id = 0

# called by lib
async def handler(websocket):
    global client_id
    global clients

    local_client_id = client_id

    # store user connection in an array 
    clients[client_id] = websocket
    
    # add player to lobby and send response to client
    response = lobbyObj.add_player(client_id)
    client_id += 1
    await websocket.send(json.dumps(response))
    
    # for each subsquent message received, process it
    async for message in websocket:
        response = await lobbyObj.process_message(message, local_client_id)
        if (response != None and len(response) > 0): await websocket.send(json.dumps(response))


# ids -> array of ids (can be single)
# message -> msg to be sent
async def send_to_users(ids, message, all=False):
    global clients

    if (all == True):
        broadcast_connections = []
        for k,v in clients.items():
            broadcast_connections.append(v)

        websockets.broadcast(broadcast_connections, message)
        return

    users_connections = []
    for id in ids:
        users_connections.append(clients[id])
    
    websockets.broadcast(users_connections, message)

async def main():
    ip = socket.gethostbyname(socket.gethostname())
    print("Serving websocket server at " + ip + ":8080")
    async with websockets.serve(handler, ip, 8080):
        await asyncio.Future()  # run forever


lobbyObj = Lobby(send_to_users)


asyncio.run(main())