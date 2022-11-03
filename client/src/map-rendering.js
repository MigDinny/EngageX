import * as constants from "./constants.js";

export const load = (c) => {
    c.load.image("grid", "img/grid.png");
    c.load.image("grass-block", "img/grass_block.png");
    c.load.image("grass-block-no-vision", "img/grass_block_no_vision.png");

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
                .image(line * 50, col * 50, "grass-block")
                .setOrigin(0);
            tmp_obj.state = 0;
            map[line][col] = tmp_obj;
        }
    }
};

export const updateMap = (c, map) => {
    for (var line = 0; line < constants.MAP_NUMBER_BLOCKS_X; line++) {
        for (var col = 0; col < constants.MAP_NUMBER_BLOCKS_Y; col++) {
            switch (map[line][col].state) {
                case 0:
                    map[line][col].setTexture("grass-block");
                    break;
                case 1:
                    map[line][col].setTexture("grass-block-no-vision");
                    break;
            }
        }
    }
};

export const updatePlayer = (c, playerPosition, playerObject) => {
    playerObject.x = playerPosition[0] * 50 + 8;
    playerObject.y = playerPosition[1] * 50 - 2;
};
