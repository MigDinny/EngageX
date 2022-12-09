// GAME constants
export const MAX_XP = 250;
export const VISION_RANGE = 3;

// UI constants
export const SCALE = 1; // not being used, please do not change this value
export const MAP_NUMBER_BLOCKS_WIDTH = 40;
export const MAP_NUMBER_BLOCKS_HEIGHT = 20;
export const BLOCK_SIZE_X = 16 * SCALE;
export const BLOCK_SIZE_Y = 16 * SCALE;

export const INIT_PLAYER_POSITIONS = [
    [1, 1],
    [19, 1],
    [1, 9],
    [19, 9],
];

// enabled skill src paths
export const HARVEST_ENABLED = "img/HUD/harvest-enabled.png";
export const SOW_ENABLED = "img/HUD/sow-enabled.png";
export const XP_ENABLED = "img/HUD/xp-enabled.png";
export const FIGHT_ENABLED = "img/HUD/fight-enabled.png";
export const SHARE_ENABLED = "img/HUD/share-enabled.png";
export const STEAL_ENABLED = "img/HUD/steal-enabled.png";
export const FLEE_ENABLED = "img/HUD/flee-enabled.png";
export const SKILL_SRC_ENABLED = [
    HARVEST_ENABLED,
    SOW_ENABLED,
    XP_ENABLED,
    FIGHT_ENABLED,
    SHARE_ENABLED,
    STEAL_ENABLED,
    FLEE_ENABLED,
];

// disabled skill src paths
export const HARVEST_DISABLED = "img/HUD/harvest-disabled.png";
export const SOW_DISABLED = "img/HUD/sow-disabled.png";
export const XP_DISABLED = "img/HUD/xp-disabled.png";
export const FIGHT_DISABLED = "img/HUD/fight-disabled.png";
export const SHARE_DISABLED = "img/HUD/share-disabled.png";
export const STEAL_DISABLED = "img/HUD/steal-disabled.png";
export const FLEE_DISABLED = "img/HUD/flee-disabled.png";
export const SKILL_SRC_DISABLED = [
    HARVEST_DISABLED,
    SOW_DISABLED,
    XP_DISABLED,
    SHARE_DISABLED,
    STEAL_DISABLED,
    FLEE_DISABLED,
];

// connection constants
export const SERVER_ADDR = "localhost";
export const SERVER_PORT = 9001;
