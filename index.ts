import './style.css';

import p5 = require('p5');
import { AnimatedSprite } from './animation';
import { Background } from './background';

let monster: AnimatedSprite;
let flipMonster = false;
let monsterGlobalX = 0;
let background: Background;
const backgroundScale = 3;
const monsterScale = 0.4;
const monsterY = 1080 / backgroundScale * 0.95 - 490 * monsterScale;
const assetBase = 'https://cddataexchange.blob.core.windows.net/images/monster-run/';

export let p: p5;
new p5((p5: p5) => {
    p = p5;
    p.preload = preload;
    p.setup = setup;
    p.draw = draw;
});

function buildMinotaurName(animation: string, index: number) {
    return assetBase + `Minotaur_01/${animation}/Minotaur_01_${animation}_${(1000 + index).toString().substr(1)}.png`;
}

function preload() {
    //Hilfsklasse
    background = new Background();
    background.addImage('B1', assetBase + '1_game_background/1_game_background.png');
    background.addImage('B2', assetBase + '2_game_background/2_game_background.png');
    background.addImage('B3', assetBase + '3_game_background/3_game_background.png');
    background.addImage('B4', assetBase + '4_game_background/4_game_background.png');
    background.activateImage(`B1`);

    //Hilfsklasse AnimatedSprite 
    monster = new AnimatedSprite(720, 490);
    //Wackeln beim Herumstehen
    monster.addAnimationWithNameBuilder('Idle', 11, 100, buildMinotaurName);
    
    monster.addAnimationWithNameBuilder('Walking', 17, 20, buildMinotaurName);
    monster.addAnimationWithNameBuilder('Attacking', 11, 40, buildMinotaurName);
    monster.setIdleAnimation('Idle');
}

function setup() {
    p.createCanvas(1920 / backgroundScale, 1080 / backgroundScale);
}

function draw() {
    p.background('white');
    background.activateImage(`B${getBackground(monsterGlobalX)}`);
    p.image(background.currentImage, 0, 0, p.width, p.height);

    if (p.keyIsDown(p.LEFT_ARROW)) {
        monster.activateAnimation('Walking');
        flipMonster = true;
        monsterGlobalX = Math.max(0, monsterGlobalX - 3);
    } else if (p.keyIsDown(p.RIGHT_ARROW)) {
        monster.activateAnimation('Walking');
        flipMonster = false;
        monsterGlobalX = Math.min((1920 / backgroundScale) * 4 - 1, monsterGlobalX + 3);
    } else if (p.keyIsDown(32)) {
        monster.activateAnimation('Attacking', true, () => console.log('end of attack')); //
    } else {
        monster.clearAnimation();
    }

    p.push();
    p.scale(monsterScale * (flipMonster ? -1 : 1), monsterScale);
    p.translate(
        ((monsterGlobalX / monsterScale) * (flipMonster ? -1 : 1)) % (1920 / backgroundScale / monsterScale),
        monsterY / monsterScale
    );
    monster.draw(true);
    p.pop();
}

function getBackground(x: number) {
    return Math.min(4, Math.max(1, Math.floor(x / (1920 / backgroundScale)) + 1));
}
