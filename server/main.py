import asyncio
import websockets
from lobby import Lobby

clients = {}
client_id = 0

# called by lib
async def handler(websocket):
    global client_id
    global clients

    # store user connection in an array
    clients[client_id] = websocket
    
    # call asynchronously a function that will wait for the connection to be closed and delete the connection from the array
    # this currently doesnt work, figure out another way because this blocks the current thread (maybe threads?)
    """try:
        await websocket.wait_closed()
    finally:
        del clients[client_id]"""
    
    print("1")
    # send user ID before incrementing
    #await websocket.send("HELLO-" + str(client_id))
    print("2")
    client_id += 1

    # for each subsquent message received, process it
    async for message in websocket:
        response = lobby.process_message(message)
        print("3")
        if (response != None and len(response) > 0): await websocket.send(message)

# ids -> array of ids (can be single)
# message -> msg to be sent
async def send_to_users(ids, message):
    global clients

    users_connections = []
    for id in ids:
        users_connections.append(clients[id])
    
    websockets.broadcast(users_connections, message)

async def main():
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()  # run forever


lobby = Lobby(send_to_users)

asyncio.run(main())