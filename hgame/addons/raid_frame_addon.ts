﻿class RaidFrame {
    raid: Array<UnitFrame> = [];
    unitFrameHeight: number = 40;
    unitFrameWidth: number = 90;
    screen: Phaser.State;
    spacing: number = 2;
    x;
    y;

    constructor(x, y, screen: Phaser.State) {
        this.x = x;
        this.y = y;
        this.screen = screen;
        this.init();
    }

    init() {
        // TODO
        // Create a UnitFrame for each player in the raid
        
        for (var g = 0; g < 4; g++) {

            for (var p = 0; p < 5; p++) {
                var x = new Player(game.rnd.between(0, 10), game.rnd.between(7, 19), 100, util.generatePlayerName());
                this.raid.push(new UnitFrame(this.unitFrameWidth * g + this.x + 5, p * (this.unitFrameHeight + this.spacing) + this.y, this.unitFrameWidth, this.unitFrameHeight, x, this.screen));
            }
        }
        // Arrange the frames spacing etc. to be within the boundaries set in this class
    }
}