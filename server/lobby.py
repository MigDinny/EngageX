class Lobby:

    tick_time_ms = 5000
    players = []
    send_to_users = None # send_to_users(ids, msg)

    def __init__(self, sender_function, tick_time = 5000):
        self.send_to_users = sender_function
        self.tick_time_ms = tick_time
        pass

    def process_message(self, message):
        return message
    
    def add_player(self, id):
        pass

    # updates game state every TICK-time
    def run(self):
        # call tick every tick-time
        pass

    def tick(self):
        # process game tick
        pass