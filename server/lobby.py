import json
import threading
import time
import asyncio

class Player:

    def __init__(self, id, x, y, playerModel):
        self.id = id
        self.x = x
        self.y = y
        self.playerModel = playerModel
        self.hp = 100
        self.xp = 0

    def toJSONable(self):
        temp = {"id": self.id, "x": self.x, "y": self.y, "hp": self.hp, "xp": self.xp}
        return temp

class Lobby:

    # Game constants
    mapDimensions = [20, 10] # 20 columns, 10 rows
    tick_time_ms = 5000
    tick_time_sec = 5
    charmodels = ["blue", "green"] + 500 * ["blue"] #Temporary. So we can have 500 charmodels before it crashes (we need to delete sockets that exit!!)

    # functions
    send_to_users = None # send_to_users(ids, msg)

    # game variables
    tick_counter = 0
    players = {} # players dictionary of objects
    
    
    def __init__(self, sender_function, tick_time = 5000):
        self.send_to_users = sender_function
        self.tick_time_ms = tick_time
        pass

    def movement(self, direction, id):
        match direction:
            case "right":
                if (self.players[id].x < self.mapDimensions[0]): self.players[id].x += 1
            case "left":
                if (self.players[id].x > 1):                     self.players[id].x -= 1
            case "up":
                if (self.players[id].y > 1):                     self.players[id].y -= 1
            case "down":
                if (self.players[id].x < self.mapDimensions[1]): self.players[id].y += 1
        

    # processes the message from clientID (which is the same as the playerID)
    # doesn't necessarily send a response
    def process_message(self, message, clientID):
        msg = json.loads(message)

        match msg["type"]:

            case "input":

                match msg["action"]:
                    
                    case 'MR':
                        self.movement('right', clientID)
                    case 'ML':
                        self.movement('left', clientID)
                    case 'MU':
                        self.movement('up', clientID)
                    case 'MD':
                        self.movement('down', clientID)
            
            case "start":
                self.run()

    def add_player(self, id):
        self.players[id] = (Player(id, 1, 1, "blue"))

        return {"type" : "init", "model": self.players[id].playerModel, "id": id}

    # updates game state every TICK-time
    def run(self):
        thread = threading.Thread(target=self.between_callback)

        print("Game starting...")
        thread.start()

    def between_callback(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        loop.run_until_complete(self.tick())
        loop.close()

    async def tick(self):
        while (True):
            # process game tick
            self.tick_counter += 1
            print("TICK: " + str(self.tick_counter))

            # build game state to be sent
            players_list = []
            for (k,v) in self.players.items():
                players_list.append(v.toJSONable())

            gameState = {"type": "update", "players": players_list}

            # send game state to users
            await self.send_to_users([], json.dumps(gameState), all=True)

            time.sleep(self.tick_time_sec)
