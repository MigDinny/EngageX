import * as constants from "./constants.js";







var texture_map = [[14,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,15],
                   [9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,5,0,11],
                   [9,7,7,7,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,8,7,8,0,0,0,0,11],
                   [9,7,7,1,7,7,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,8,7,8,7,0,0,0,0,11],
                   [9,7,1,8,1,7,0,0,0,0,0,7,0,7,0,0,0,0,0,0,0,7,8,8,7,0,0,0,0,11],
                   [9,7,7,1,7,7,0,0,0,0,7,8,7,8,7,0,0,0,0,0,0,8,7,8,7,0,0,0,1,11],
                   [9,7,7,7,7,7,0,0,0,0,7,8,8,8,7,0,0,0,0,0,0,7,8,7,8,0,0,0,0,11],
                   [9,0,0,0,0,0,0,0,0,0,0,7,8,7,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,11],
                   [9,0,0,0,0,8,0,0,0,0,0,0,7,0,0,7,0,0,0,0,0,0,0,0,0,3,0,3,0,11],
                   [9,0,0,0,0,8,0,0,0,0,0,0,0,0,7,8,7,0,0,0,3,0,0,0,0,6,0,6,0,11],
                   [9,0,0,4,5,8,5,0,0,0,0,0,0,7,8,1,8,7,0,0,0,0,0,0,0,0,0,0,0,11],
                   [9,0,0,0,0,5,0,0,0,0,0,0,7,8,1,1,1,8,7,0,0,0,0,0,0,7,0,7,0,11],
                   [9,1,0,0,0,8,0,1,0,0,0,0,0,7,8,1,8,7,0,0,0,0,0,0,0,7,7,7,0,11],
                   [9,0,0,0,0,0,0,0,0,0,0,0,3,0,7,8,7,0,0,0,0,6,0,0,0,0,0,0,0,11],
                   [13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,16]];

export const load = (c) => {
    c.load.spritesheet("slime", "img/slimeblue.png", {
        frameWidth: 32,
        frameHeight: 32,
    });

    for(let i = 0; i < 17; i++){
        c.load.image("grass-block" + i, "img/normal_grass" + i + ".png");
    }
    
    c.load.image("grass-block-no-vision", "img/no_vision_grass.png");
    c.load.image("food-block", "img/grown_grass.png");
    
    c.load.setBaseURL("");


};

export const drawMap = (c, map) => {
    for (var line = 0; line < constants.MAP_NUMBER_BLOCKS_HEIGHT; line++) {
        for (var col = 0; col < constants.MAP_NUMBER_BLOCKS_WIDTH; col++) {
            var tmp_obj = c.add
                .image(
                    col * constants.BLOCK_SIZE_X,
                    line * constants.BLOCK_SIZE_Y,
                    "grass-block0"
                )
                .setOrigin(0, 0)
                .setScale(constants.SCALE);

            tmp_obj.state = 1;
            map[line][col] = tmp_obj;
        }
    }
};

// Updates map. Also lights up squares that are adjacent to user
export const updateMap = (map_array, gameState) => {
    //console.log(gameState);
    for (var line = 0; line < constants.MAP_NUMBER_BLOCKS_HEIGHT; line++) {
        for (var col = 0; col < constants.MAP_NUMBER_BLOCKS_WIDTH; col++) {
            if (
                gameState.players[gameState.playerID].position[0] - col <= constants.VISION_RANGE &&
                gameState.players[gameState.playerID].position[0] - col >= -constants.VISION_RANGE &&
                gameState.players[gameState.playerID].position[1] - line <= constants.VISION_RANGE &&
                gameState.players[gameState.playerID].position[1] - line >= -constants.VISION_RANGE
            )
                map_array[line][col].state = 0;
            else map_array[line][col].state = 1;

            switch (map_array[line][col].state) {
                case 0:
                    map_array[line][col].setTexture("grass-block" + texture_map[line][col]);
                    break;
                case 1:
                    map_array[line][col].setTexture("grass-block-no-vision");
                    break;
            }
        }
    }

    var foodArr =  gameState.players[gameState.playerID].foodArr;
    var player_x = gameState.players[gameState.playerID].position[0];
    var player_y = gameState.players[gameState.playerID].position[1];


    for(var line = 0; line < foodArr.length; line++){
        let y_pos = player_y - constants.VISION_RANGE + line;

        for(var col = 0; col < foodArr[0].length; col++){
            let x_pos = player_x - constants.VISION_RANGE + col;
           
            switch(foodArr[line][col]){
                case -1:
                    continue;
                case 0:
                    map_array[y_pos][x_pos].setTexture("grass-block" + texture_map[y_pos][x_pos]);
                    break;
                case 1:
                    map_array[y_pos][x_pos].setTexture("food-block");
                    break;
            }
        }
    }

};

// updates player on the map based on player position
export const updatePlayers = (gameState, playerObjects) => {
    for (var i = 0; i < gameState.players.length; i++) {
        var player = gameState.players[i];
        var pobj = playerObjects[player.gameObjectIndex];

        pobj.x =
            player.position[0] * constants.BLOCK_SIZE_X -
            constants.BLOCK_SIZE_X / 2;
        pobj.y =
            player.position[1] * constants.BLOCK_SIZE_Y -
            constants.BLOCK_SIZE_Y / 2;
    }
    
};
