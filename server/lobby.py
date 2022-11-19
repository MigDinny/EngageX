import json

class Player:

    def __init__(self, id, x, y, playerModel):
        self.x = x
        self.y = y
        self.playerModel = playerModel

class Lobby:

    tick_time_ms = 5000
    players = {}
    #Temporary. So we can have 500 charmodels before it crashes (we need to delete sockets that exit!!)
    charmodels = ["blue", "green"] + 500 * ["blue"]
    send_to_users = None # send_to_users(ids, msg)

    def __init__(self, sender_function, tick_time = 5000):
        self.send_to_users = sender_function
        self.tick_time_ms = tick_time
        pass

    def movement(self, direction, id):
        match direction:
            case "right":
                self.players[id].x += 1
            case "left":
                self.players[id].x -= 1
            case "up":
                self.players[id].y -= 1
            case "down":
                self.players[id].y += 1
        

    def process_message(self, message):
        print(self.players)
        msg = json.loads(message)
        match msg["type"]:
            #case "open":
                #return self.add_player(msg)

            case "update":
                match msg["action"]:
                    case "movement":
                        if(msg["direction"] == ""):
                             return {"type" : "ignore"}

                        self.movement(msg["direction"], msg["id"])
                        return {"type" : "update", "map_state" : self.players}
            case default:
                return {"type" : "ignore"}
        #msg = {"type": "message", "player": message, "column": 3, "row": 0}
        pass

  
    def add_player(self,id):
        #self.players[id]["x"] = 1
        #self.players[id]["y"] = 1
        #self.players[id]["playerModel"] = "blue"

        self.players[id] = (Player(id, 1, 1, "blue"))
        
        return {"type" : "init", "player": self.players[id].playerModel, "id": id}

    #TODO
    def update_map(self):
        return ""

    # updates game state every TICK-time
    def run(self):
        # call tick every tick-time
        pass

    def tick(self, tick):
        # process game tick
        pass