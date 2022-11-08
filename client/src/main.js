//import * as utils from "../lib/utils";
import * as constants from "./constants.js";
//import { load, drawMap, updateMap, updatePlayer } from "./map-rendering.js";
import { load, drawMap, updatePlayer } from "./map-rendering.js";

var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    fps: {
        target: 30,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

// 10x10 array representing the grid map
// contains reference to image object. state: 0 -> normal grass, 1 -> no vision grass, ...
var map_array = Array.from(Array(constants.MAP_NUMBER_BLOCKS_Y), (_) =>
    Array(constants.MAP_NUMBER_BLOCKS_X).fill(0)
);

// player position X, Y coord in 10x10 grid
var playerPosition = [0, 0];
var playerObject;

var game = new Phaser.Game(config);
var cursors;

// UI Elements
var timer_bar = document.getElementById("timer-bar");
var max_width = timer_bar.style.width;
var cur_width = timer_bar.style.width;

function preload() {
    load(this);
}

//Updates map. Lights up squares that are adjacent to user
function updateMap(){

    for (var line = 0; line < constants.MAP_NUMBER_BLOCKS_X; line++) {
        for (var col = 0; col < constants.MAP_NUMBER_BLOCKS_Y; col++) {
            if(playerPosition[0] - line <= 1 && playerPosition[0] - line >= -1 && playerPosition[1] - col <= 1 && playerPosition[1] - col >=-1) map_array[line][col].state = 0;
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

function create() {
    drawMap(this, map_array, playerPosition);

    playerObject = this.physics.add
        .sprite(playerPosition[0] * 50 + 8, playerPosition[1] * 50 - 2, "dude")
        .setOrigin(0, 0);

    cursors = this.input.keyboard.createCursorKeys();
}

function update(time, delta) {

    
    map_array[0][0].state = 1;
    map_array[9][9].state = 1;

    //Updates timer size
    var new_width = parseInt(cur_width) - 1;
    if(new_width <= 0){
        timer_bar.style.width = max_width;
        cur_width = max_width;
    }
    else{
        timer_bar.style.width = new_width + "px"; 
    }   
    cur_width = timer_bar.style.width;


    // accept input and send it to server
    if (cursors.left.isDown) {
        if(playerPosition[0] - 1 >=0){
            playerPosition[0] = playerPosition[0] - 1 
        }
    } else if (cursors.right.isDown) {
        if(playerPosition[0] + 1 < constants.MAP_NUMBER_BLOCKS_X){
            playerPosition[0] = playerPosition[0] + 1
        }
    } else if (cursors.up.isDown) {
        if(playerPosition[1] - 1 >=0){
            playerPosition[1] = playerPosition[1] - 1 
        }
    } else if (cursors.down.isDown) {
        if(playerPosition[1] + 1 < constants.MAP_NUMBER_BLOCKS_Y){
            playerPosition[1] = playerPosition[1] + 1
        }
    }

    
    // update map according to map_array
    //updateMap(this, map_array, playerPosition);
    updateMap()
    
    // update player according to its position
    updatePlayer(this, playerPosition, playerObject);
}
