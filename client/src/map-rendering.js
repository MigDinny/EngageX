import * as constants from "./constants.js";

export const load = (c) => {
    c.load.image("grid", "img/grid.png");
    c.load.image("grass-block", "img/grass_vision.png");
    c.load.image("grass-block-no-vision", "img/grass_no_vision.png");

    c.load.setBaseURL("");
    c.load.spritesheet(
        "dude",
        "http://labs.phaser.io/assets/sprites/dude.png",
        {
            frameWidth: 32,
            frameHeight: 48,
        }
    );
};

export const drawMap = (c, map) => {
    for (var line = 0; line < constants.MAP_NUMBER_BLOCKS_X; line++) {
        for (var col = 0; col < constants.MAP_NUMBER_BLOCKS_Y; col++) {
            var tmp_obj = c.add
                .image(line * 16, col * 16, "grass-block")
                .setOrigin(0);
            tmp_obj.state = 1;
            map[line][col] = tmp_obj;
        }
    }
};

// Updates map. Also lights up squares that are adjacent to user
export const updateMap = (c, map_array, playerPosition) => {
    for (var line = 0; line < constants.MAP_NUMBER_BLOCKS_X; line++) {
        for (var col = 0; col < constants.MAP_NUMBER_BLOCKS_Y; col++) {
            if (
                playerPosition[0] - line <= 1 &&
                playerPosition[0] - line >= -1 &&
                playerPosition[1] - col <= 1 &&
                playerPosition[1] - col >= -1
            )
                map_array[line][col].state = 0;
            else map_array[line][col].state = 1;
            switch (map_array[line][col].state) {
                case 0:
                    map_array[line][col].setTexture("grass-block");
                    break;
                case 1:
                    map_array[line][col].setTexture("grass-block-no-vision");
                    break;
            }
        }
    }
};

// updates player on the map based on player position
export const updatePlayer = (c, playerPosition, playerObject) => {
    playerObject.x = playerPosition[0] * 16 -8;
    playerObject.y = playerPosition[1] * 16 -8;
};
