//import * as utils from "../lib/utils";
import * as constants from "./constants.js";
import { load, drawMap, updatePlayers, updateMap } from "./map-rendering.js";
import { updateHUD } from "./ui.js";
import { sendMessage, interpretMessage } from "./socket.js";

let params = new URL(document.location).searchParams;
let ipAddress = params.get("ip");
let port = params.get("port");
let username = params.get("username");

if (
    ipAddress == null ||
    username == null ||
    port == null ||
    ipAddress === "" ||
    port === "" ||
    username === ""
) {
    location.replace("/");
}

/**
 * Game Config Object
 */
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

/**
 * 10x10 Array representing the grid map.
 * Contains reference to image object and its state. 0 -> normal grass, 1 -> no vision grass, etc ...
 */
var map_array = Array.from(Array(constants.MAP_NUMBER_BLOCKS_HEIGHT), (_) =>
    Array(constants.MAP_NUMBER_BLOCKS_WIDTH).fill(0)
);

/**
 * Game Multiplayer Variables - which are used to sync with the server
 */
var gameState = {
    playerID: 0,
    players: [],
    started: false,
    ended: false,
    gameObjectIndexCounter: 0,
    
};

/**
 * Music config
 */
var music_config = {
    mute: muteKey,
    volume: 0.5,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0,
};

/**
 * Sound effects config
 */
var sound_effect_config = {
    mute: false,
    volume: 0.3,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: false,
    delay: 0,
};

var char_color = "blue"; // Color of slime. Make this change variable be attributed by server in future

/**
 * Game Global Variables
 */
var game = new Phaser.Game(config);

var playerObjects = [];

var leftKey;
var rightKey;
var upKey;
var downKey;
var muteKey;
var sKey;
var qKey;
var wKey;
var eKey;
var rKey;

var bpm;
var timerMovement;
var incrementTimer;
var cursors;
var windowKeySize = 200;

var direction = "";
var action = "";


var gameOverText;
var gameEndedText;

var music;

/**
 * UI Variables
 */
var timer_bar = document.getElementById("timer-bar");
var max_width = timer_bar.style.width;
var cur_width = timer_bar.style.width;

var skill_elems = [
    document.getElementById("harvest"),
    document.getElementById("sow"),
    document.getElementById("xp"),
    document.getElementById("fight"),
    document.getElementById("share"),
    document.getElementById("steal"),
    document.getElementById("flee"),
];

/**
 * Websocket to communicate with the server.
 */
const socket = new WebSocket("ws://" + ipAddress + ":" + port);

/**
 * Socket onMessage event. This function gets called whenever a message is received from the server.
 * @param {*} event
 */
socket.onmessage = (event) => {
    var response = interpretMessage(this, gameState, socket, event.data);

    console.log(gameState);
};

/**
 * Socket onOpen event. This function gets called at the beginning of the connection.
 */
socket.onopen = (event) => {
    // nothing for now...
};

/**
 * Game Functions:
 *  preload() -> loads media
 *  create() -> starts all objects and configs
 *  update() -> gets called every frame
 */

function preload() {
    this.load.spritesheet("slime", "img/slime" + char_color + ".png", {
        frameWidth: 32,
        frameHeight: 32,
    });

    this.load.audio("game_music", [
        "audio/Undertale-OST_015_sans.mp3",
        "audio/Undertale-OST_015_sans.ogg",
    ]);

    // load sound effects
    this.load.audio("save_sound_effect", [
        "audio/sound_effects/save.mp3",
        "audio/sound_effects/save..ogg",
    ]);
    this.load.audio("sow_sound_effect", [
        "audio/sound_effects/sow.mp3",
        "audio/sound_effects/sow.ogg",
    ]);
    this.load.audio("harvest_sound_effect", [
        "audio/sound_effects/harvest.mp3",
        "audio/sound_effects/harvest.ogg",
    ]);
    this.load.audio("move_sound_effect", [
        "audio/sound_effects/move.mp3",
        "audio/sound_effects/move.ogg",
    ]);

    this.load.audio("punch_sound_effect", [
        "audio/sound_effects/punch.mp3",
        "audio/sound_effects/punch.ogg",
    ]);

    load(this);
}

function create() {
    cursors = this.input.keyboard.createCursorKeys();
    leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    muteKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    drawMap(this, map_array);

    /** ANIMATIONS  */
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

    /** PLAYERS GAME OBJECTS not yet associated with the players ( will be when start packet is received) */
    for (var i = 0; i < 4; i++) {
        playerObjects.push(
            this.physics.add
                .sprite(1, 1, "slime")
                .setOrigin(0, 0)
                .setScale(constants.SCALE)
                .play("idle")
        );
    }

    gameEndedText = this.add.text(
        (constants.MAP_NUMBER_BLOCKS_WIDTH *
            (constants.BLOCK_SIZE_X / constants.SCALE - 6)) /
            2,
        (constants.MAP_NUMBER_BLOCKS_HEIGHT *
            (constants.BLOCK_SIZE_Y / constants.SCALE - 1)) /
            2,
        "YOU ENDED X PLACE",
        {
            font: "20px Arial",
            align: "center",
            color: "#000000",
        }
    );

    /** UI Text*/
    gameOverText = this.add.text(
        (constants.MAP_NUMBER_BLOCKS_WIDTH *
            (constants.BLOCK_SIZE_X / constants.SCALE - 6)) /
            2,
        (constants.MAP_NUMBER_BLOCKS_HEIGHT *
            (constants.BLOCK_SIZE_Y / constants.SCALE - 1)) /
            2,
        "GAME OVER",
        {
            font: "40px Arial",
            align: "center",
            color: "#000000",
        }
    );

    gameEndedText.setBackgroundColor("#FFFFCC");
    gameEndedText.visible = false;
    gameOverText.setBackgroundColor("#696969");
    gameOverText.visible = false;


    /** MUSIC */

    music = this.sound.add("game_music");
    music.play(music_config);
    bpm = 128;
    timerMovement = 0;
    incrementTimer = (60 * 1000) / bpm;
    music.pause();
}

function endScoreTextUpdate(){
    let count = 1;

    for (let i = 0; i < gameState.players.length; i++) {
        if(i != gameState.playerID){
            if(gameState.players[i].xp > gameState.players[gameState.playerID].xp){
                count++;
            }
        }
    }

    if( count == 1){
        gameEndedText.text = "Game ended! Congratulations, you placed " + count + "st";
    }else{
        gameEndedText.text = "Game ended! You placed " + count + "th";
    } 
   

}
var firstTick = true;
var sound_effect_played = false;

function update(time, delta) {
    if (gameState.started && !gameState.ended) {

        // checks if player is still alive
        if (gameState.players[gameState.playerID].hp > 0) {
            // updates timer size
            var new_width =
                parseInt(max_width) -
                ((time % incrementTimer) * parseInt(max_width)) /
                    incrementTimer;

            // allows new sound effect to be played
            if (parseFloat(timer_bar.style.width) < new_width) {
                sound_effect_played = false;
            }

            timer_bar.style.width = new_width + "px";
            cur_width = timer_bar.style.width;

            if (new_width < windowKeySize) {
                timer_bar.style.backgroundColor = "yellow";
            } else {
                timer_bar.style.backgroundColor = "red";
            }

            /* INPUT HANDLING  */
            if (Phaser.Input.Keyboard.JustDown(leftKey)) {
                let msg = { type: "input", action: "ML" };
                sendMessage(socket, msg);
                if (!sound_effect_played) {
                    this.sound
                        .add("move_sound_effect")
                        .play(sound_effect_config);
                    sound_effect_played = true;
                }

                // Pause needs to be here to cancel old animations
                // playerObjects[gameState.playerID].anims.pause();
                // playerObjects[gameState.playerID].anims.play('horizontal').chain('idle');
            } else if (Phaser.Input.Keyboard.JustDown(rightKey)) {
                let msg = { type: "input", action: "MR" };
                sendMessage(socket, msg);
                if (!sound_effect_played) {
                    this.sound
                        .add("move_sound_effect")
                        .play(sound_effect_config);
                    sound_effect_played = true;
                }

                // playerObjects[gameState.playerID].anims.pause();
                // playerObjects[gameState.playerID].anims.play("horizontal").chain("idle");
            } else if (Phaser.Input.Keyboard.JustDown(upKey)) {
                let msg = { type: "input", action: "MU" };
                sendMessage(socket, msg);
                if (!sound_effect_played) {
                    this.sound
                        .add("move_sound_effect")
                        .play(sound_effect_config);
                    sound_effect_played = true;
                }

                // playerObjects[gameState.playerID].anims.pause();
                // playerObjects[gameState.playerID].play('vertical').chain('idle');
            } else if (Phaser.Input.Keyboard.JustDown(downKey)) {
                let msg = { type: "input", action: "MD" };
                sendMessage(socket, msg);
                if (!sound_effect_played) {
                    this.sound
                        .add("move_sound_effect")
                        .play(sound_effect_config);
                    sound_effect_played = true;
                }

                // playerObjects[gameState.playerID].anims.pause();
                // playerObjects[gameState.playerID].anims.play('vertical').chain('idle');
            } else if (Phaser.Input.Keyboard.JustDown(qKey)) {
                let msg = { type: "input", action: "HV" };
                sendMessage(socket, msg);
                if (!sound_effect_played) {
                    this.sound
                        .add("harvest_sound_effect")
                        .play(sound_effect_config);
                    sound_effect_played = true;
                }
            } else if (Phaser.Input.Keyboard.JustDown(wKey)) {
                let msg = { type: "input", action: "SO" };
                sendMessage(socket, msg);
                if (!sound_effect_played) {
                    this.sound
                        .add("sow_sound_effect")
                        .play(sound_effect_config);
                    sound_effect_played = true;
                }
            } else if (Phaser.Input.Keyboard.JustDown(eKey)) {
                let msg = { type: "input", action: "XP" };
                sendMessage(socket, msg);
                if (!sound_effect_played) {
                    this.sound
                        .add("save_sound_effect")
                        .play(sound_effect_config);
                    sound_effect_played = true;
                }
            } else if (Phaser.Input.Keyboard.JustDown(rKey)) {
                let msg = {type: "input", action: "FG"}
                sendMessage(socket, msg);

                if (!sound_effect_played) {
                    this.sound
                        .add("punch_sound_effect")
                        .play(sound_effect_config);
                    sound_effect_played = true;
                }
            }

            if (Phaser.Input.Keyboard.JustDown(muteKey)) {
                if (music.isPlaying) {
                    music.pause();
                } else {
                    music.resume();
                }
            }
        }
        // player has died
        else {
            gameOverText.visible = true;
        }
    }

    // only start music when first update packet is sent
    if (gameState.started && firstTick) {
        music.resume();
        firstTick = false;
    }

    if(gameState.ended){
        endScoreTextUpdate();
        gameEndedText.visible = true;
    }

    // send START packet
    if (Phaser.Input.Keyboard.JustDown(sKey)) {
        sendMessage(socket, { type: "start" });
    }

    // update map according to map_array
    if (gameState.started) updateMap(map_array, gameState);

    // update player according to its position
    if (gameState.started) updatePlayers(gameState, playerObjects);

    if (gameState.started) updateHUD(gameState);
}
