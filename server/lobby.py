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
        temp = {"id": self.id, "x": self.x, "y": self.y, "hp": self.hp, "xp": self.xp, "model": self.playerModel}
        return temp

class Lobby:

    # Game constants
    mapDimensions = [40, 20] # 40 columns, 20 rows
    initial_player_positions = [[1,1], [mapDimensions[0], 1], [1, mapDimensions[1]], [mapDimensions[0], mapDimensions[1]]]
    tick_time_ms = 1000
    tick_time_sec = 1
    charmodels = ["blue", "green"] + 500 * ["blue"] #Temporary. So we can have 500 charmodels before it crashes (we need to delete sockets that exit!!)

    # functions
    send_to_users = None # send_to_users(ids, msg)

    # game variables
    tick_counter = 0
    players = {} # players dictionary of objects
    playersInputBoolean = [False, False, False, False] # checks if player inputted anything this current tick
    
    gameStarted = False
    endTick = False
    
    ## CONSTRUCTOR
    def __init__(self, sender_function):
        self.send_to_users = sender_function

        
    def add_player(self, id):
        self.players[id] = (Player(id, self.initial_player_positions[id%4][0], self.initial_player_positions[id%4][1], "blue"))

        return {"type" : "init", "model": self.players[id].playerModel, "id": id}
    

    # processes the message from clientID (which is the same as the playerID)
    # doesn't necessarily send a response
    async def process_message(self, message, clientID):
        msg = json.loads(message)

        match msg["type"]:

            case "input":
                # ignore further inputs this tick
                if (self.playersInputBoolean[clientID%4]): return

                self.playersInputBoolean[clientID%4] = True
                
                match msg["action"]:
                    
                    case 'MR':
                        self.__movement__('right', clientID)
                    case 'ML':
                        self.__movement__('left', clientID)
                    case 'MU':
                        self.__movement__('up', clientID)
                    case 'MD':
                        self.__movement__('down', clientID)
            
            case "start":
                if (self.gameStarted):
                    self.endTick = True
                    return
                
                players_list = []
                for (k,v) in self.players.items():
                    players_list.append(v.toJSONable())
                
                startPacket = {"type": "start",  "players": players_list}

                await self.send_to_users([], json.dumps(startPacket), all=True)

                self.__run__()
                
    ## HANDLE MOVEMENT
    def __movement__(self, direction, id):
        match direction:
            case "right":
                if (self.players[id].x < self.mapDimensions[0]): self.players[id].x += 1
            case "left":
                if (self.players[id].x > 1):                     self.players[id].x -= 1
            case "up":
                if (self.players[id].y > 1):                     self.players[id].y -= 1
            case "down":
                if (self.players[id].y < self.mapDimensions[1]): self.players[id].y += 1
                
    # updates game state every TICK-time
    def __run__(self):
        self.gameStarted = True
        thread = threading.Thread(target=self.__between_callback__)

        print("Game starting...")
        thread.start()

    def __between_callback__(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        loop.run_until_complete(self.__tick__())
        loop.close()

    async def __tick__(self):
        while (not self.endTick):
            # process game tick
            self.tick_counter += 1
            print("TICK: " + str(self.tick_counter))

            # build game state to be sent
            players_list = []
            for (k,v) in self.players.items():
                players_list.append(v.toJSONable())

            gameState = {"type": "update", "tick": self.tick_counter, "players": players_list}

            # send game state to users
            await self.send_to_users([], json.dumps(gameState), all=True)

            # clear input boolean
            self.playersInputBoolean = [False, False, False, False]
            
            time.sleep(self.tick_time_sec)
