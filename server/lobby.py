import json


class Lobby:

    tick_time_ms = 5000
    players = []
    #Temporary. So we can have 500 charmodels before it crashes (we need to delete sockets that exit!!)
    charmodels = ["blue", "green"] + 500 * ["blue"]
    send_to_users = None # send_to_users(ids, msg)

    def __init__(self, sender_function, tick_time = 5000):
        self.send_to_users = sender_function
        self.tick_time_ms = tick_time
        pass

    def process_message(self, message):
        print(self.players)
        msg = json.loads(message)
        match msg["type"]:
            case "open":
                return self.add_player(msg)
            case default:
                return msg
        #msg = {"type": "message", "player": message, "column": 3, "row": 0}
        return 
    
    def add_player(self,msg):
        #Talvez perigoso cbb
        id = len(self.players)
        self.players.append(id)
        return {"type" : "start", "player": self.charmodels[id-1], "id": id}

    #TODO
    def update_map(self):
        return "";

    # updates game state every TICK-time
    def run(self):
        # call tick every tick-time
        pass

    def tick(self, tick):
        # process game tick
        pass