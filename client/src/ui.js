import { SKILL_SRC_ENABLED, SKILL_SRC_DISABLED, MAX_XP }  from "./constants.js";

/**
 * This enables the skill on the UI.
 * @param {array of elements} skill_elems array of all skill elements
 * @param {integer} skillPosition index of the skill element to be affected
 */
export const enableSkill = (skill_elems, skillPosition) => {
    skill_elems[skillPosition].src = SKILL_SRC_ENABLED[skillPosition];
};

/**
 * This disables the skill on the UI.
 * @param {array of elements} skill_elems array of all skill elements
 * @param {integer} skillPosition index of the skill element to be affected
 */
export const disableSkill = (skill_elems, skillPosition) => {
    skill_elems[skillPosition].src = SKILL_SRC_DISABLED[skillPosition];
};

/**
 * Sets the position of the player on the UI.
 * @param {integer} position position of the player
 */
export const setPosition = (position) => {
    const element = document.getElementById("position");
    switch (position) {
        case 1:
            element.innerHTML = "1st";
            break;
        case 2:
            element.innerHTML = "2nd";
            break;
        case 3:
            element.innerHTML = "3rd";
            break;
        default:
            element.innerHTML = String(position) + "th";
    }
};

/**
 * Sets the HP of the player on the UI hp bar and text.
 * @param {integer} hpPercentage percentage of player's hp
 */
const setHP = (hpPercentage) => {
    document.getElementById("hp-bar").style["width"] = hpPercentage + "%";
    document.getElementById("hp-text").innerHTML =
        "HP: " + String(hpPercentage) + "/100";
};

/**
 * Sets the XP of the player on the UI xp bar and text.
 * @param {integer} xp
 * @param {integer} xpPercentage
 */
const setXP = (xp, xpPercentage) => {
    document.getElementById("xp-bar").style["width"] = xpPercentage + "%";
    document.getElementById("xp-text").innerHTML = "XP: " + String(xp);
};

/**
 * Updates the HUD - HP, XP and position on the leaderboard
 * @param {*} gameState
 */
export const updateHUD = (gameState) => {
    setHP(gameState.players[gameState.playerID].hp);
    setXP(
        gameState.players[gameState.playerID].xp,
        gameState.players[gameState.playerID].xp / MAX_XP
    );
};
