//import * as utils from "../lib/utils";
import * as constants from "./constants.js";
//import { load, drawMap, updateMap, updatePlayer } from "./map-rendering.js";
import { load, drawMap, updatePlayer, updateMap } from "./map-rendering.js";

var config = {
    type: Phaser.AUTO,

    pixelArt: true,
    scale: {
        parent: "game_parent",
        mode: Phaser.Scale.FIT,
        width: constants.BLOCK_SIZE_X * constants.MAP_NUMBER_BLOCKS_WIDTH,
        height: constants.BLOCK_SIZE_Y * constants.MAP_NUMBER_BLOCKS_HEIGHT,
    },

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
var map_array = Array.from(Array(constants.MAP_NUMBER_BLOCKS_HEIGHT), (_) =>
    Array(constants.MAP_NUMBER_BLOCKS_WIDTH).fill(0)
);

// player position X, Y coord in 10x10 grid
var playerPosition = [0, 0];
var playerObject;

var music;

var game = new Phaser.Game(config);
var leftKey;
var rightKey;
var upKey;
var downKey;
var muteKey;

var bpm = 120 / 4;
var timerMovement;
var incrementTimer;
var startMusic;
var musicOffset = 0;
var cursors;
var windowKeySize = 200;
var keyPressed = 0;
var delayApply = windowKeySize/2;
var loadTime = 0;

// UI Elements
var timer_bar = document.getElementById("timer-bar");
var max_width = timer_bar.style.width;
var cur_width = timer_bar.style.width;

function preload() {
    this.load.spritesheet("slime", "img/slimeblue.png",
    {
        frameWidth:32,
        frameHeight: 32,
    });


    //this.load.audio("game_music", ["audio/Kevin_MacLeod___One-eyed_Maestro.mp3", "audio/Kevin_MacLeod___One-eyed_Maestro.ogg"]);
    this.load.audio("game_music", ["audio/Undertale - Megalovania.mp3", "audio/Undertale - Megalovania.ogg"]);
    
    load(this);
}

function create() {

    leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    muteKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);


    drawMap(this, map_array);

    playerObject = this.physics.add
        .sprite(playerPosition[0] * 16 - 8, playerPosition[1] * 16 - 8, "slime")
        .setOrigin(0, 0);

    playerObject.setScale(constants.SCALE);
    this.anims.create({
        key: "idle",
        frameRate: 10,
        frames: this.anims.generateFrameNumbers("slime", { start: 0, end: 3 }),
        repeat: -1,
    });
    this.anims.create({
        key: "vertical",
        frameRate: 10,
        frames: this.anims.generateFrameNumbers("slime", {
            start: 15,
            end: 20,
        }),
        repeat: 0,
    });
    
    this.anims.create({
        key: "horizontal",

        frameRate: 10,
        frames: this.anims.generateFrameNumbers("slime", { start: 7, end: 12 }),
        repeat: 0,
    });
    
    playerObject.play("idle");

    music = this.sound.add("game_music")
    startMusic = true;
    incrementTimer = 60 * 1000 / bpm;
    timerMovement = 0;
}

function update(time, delta) {

    // start music
    if(startMusic) {
        loadTime = time ;

        music.play(muteKey, 1, true);
        music.setVolume(0.5);   // change with config
        startMusic = false;
    }

    //apply loading offset
    time = time - loadTime;

    // Updates timer size
    var new_width = parseInt(max_width) - (time % incrementTimer) * parseInt(max_width) / incrementTimer;
    timer_bar.style.width = new_width + "px";
    cur_width = timer_bar.style.width;

    cursors = this.input.keyboard.createCursorKeys();

    // accept input and send it to server
    if(timerMovement + incrementTimer + delayApply + musicOffset < time) {
        timerMovement += incrementTimer;   
        
        applyKey(this, cursors);

        keyPressed = 0;
    }

    checkKeys(this, cursors, time);
    


    if (Phaser.Input.Keyboard.JustDown(muteKey)) {
        if (music.isPlaying) {
            music.pause();
        } else {
            music.resume();
        }
    }

    // update map according to map_array
    updateMap(this, map_array, playerPosition);

    // update player according to its position
    updatePlayer(this, playerPosition, playerObject);

    map_array[0][0].state = 1;
    map_array[9][9].state = 1;
}

function checkKeys(g, cursors, time) {
    if (keyPressed != 0) {
        return;
    }

    if (cursors.left.isDown) {
        //console.log(((timerMovement + incrementTimer) - time), (((timerMovement + incrementTimer) - time) < windowKeySize));
        if(Math.abs((timerMovement + incrementTimer) - time) < windowKeySize) {
            keyPressed = cursors.left;
        } else { keyPressed = -1; }

    } else if (cursors.right.isDown) {
        if(Math.abs((timerMovement + incrementTimer) - time) < windowKeySize) {
            keyPressed = cursors.right;
        } else { keyPressed = -1; }

    } else if (cursors.up.isDown) {
        if(Math.abs((timerMovement + incrementTimer) - time) < windowKeySize) {
            keyPressed = cursors.up;
        } else { keyPressed = -1; }
        
    } else if (cursors.down.isDown) {
        if(Math.abs((timerMovement + incrementTimer) - time) < windowKeySize) {
            keyPressed = cursors.down;
        } else { keyPressed = -1; }
    }
}

function applyKey(g, cursors) {
    if (keyPressed == 0 || keyPressed == -1) {
        return
    }

    if (keyPressed == cursors.left) {
        if (playerPosition[0] - 1 >= 0) {
            playerPosition[0] = playerPosition[0] - 1;
            
            //Pause needs to be here to cancel old animations
            playerObject.anims.pause();
            playerObject.anims.play('horizontal').chain('idle');
        }
    } else if (keyPressed == cursors.right) {          // Phaser.Input.Keyboard.JustDown(rightKey)
        if (playerPosition[0] + 1 < constants.MAP_NUMBER_BLOCKS_WIDTH) {
            playerPosition[0] = playerPosition[0] + 1;
            
            playerObject.anims.pause();
            playerObject.anims.play("horizontal").chain("idle");

        }
    } else if (keyPressed == cursors.up) {
        if (playerPosition[1] - 1 >= 0) {
            playerPosition[1] = playerPosition[1] - 1;
            
            playerObject.anims.pause();
            playerObject.play('vertical').chain('idle');
        }
    } else if (keyPressed == cursors.down) {
        if (playerPosition[1] + 1 < constants.MAP_NUMBER_BLOCKS_HEIGHT) {
            playerPosition[1] = playerPosition[1] + 1;
            
            
            playerObject.anims.pause();
            playerObject.anims.play('vertical').chain('idle');
        }
    }
}