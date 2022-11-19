import * as constants from "./constants.js";

export const load = (c) => {
    c.load.spritesheet("slime", "img/slimeblue.png", {
        frameWidth: 32,
        frameHeight: 32,
    });

    c.load.image("grass-block", "img/grass_vision.png");
    c.load.image("grass-block-no-vision", "img/grass_no_vision.png");

    c.load.setBaseURL("");
};

export const drawMap = (c, map) => {
    console.log(map);

    for (var line = 0; line < constants.MAP_NUMBER_BLOCKS_HEIGHT; line++) {
        for (var col = 0; col < constants.MAP_NUMBER_BLOCKS_WIDTH; col++) {
            var tmp_obj = c.add
                .image(
                    col * constants.BLOCK_SIZE_X,
                    line * constants.BLOCK_SIZE_Y,
                    "grass-block"
                )
                .setOrigin(0, 0)
                .setScale(constants.SCALE);

            tmp_obj.state = 1;
            map[line][col] = tmp_obj;
        }
    }
};

// Updates map. Also lights up squares that are adjacent to user
/*export const updateMap = (c, map_array, playerPosition) => {
    for (var line = 0; line < constants.MAP_NUMBER_BLOCKS_HEIGHT; line++) {
        for (var col = 0; col < constants.MAP_NUMBER_BLOCKS_WIDTH; col++) {
            if (
                playerPosition[0] - col <= 2 &&
                playerPosition[0] - col >= -2 &&
                playerPosition[1] - line <= 2 &&
                playerPosition[1] - line >= -2
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
};*/

export const updateMap = (c, current_state, id) => {

}

// updates player on the map based on player position
export const updatePlayer = (c, playerPosition, playerObject) => {
    playerObject.x =
        playerPosition[0] * constants.BLOCK_SIZE_X - constants.BLOCK_SIZE_X / 2;
    playerObject.y =
        playerPosition[1] * constants.BLOCK_SIZE_Y - constants.BLOCK_SIZE_Y / 2;
};
