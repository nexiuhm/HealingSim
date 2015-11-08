namespace Addons {
    export class RaidFrame {
        raid: Array<UnitFrame> = [];
        unitFrameHeight: number = 40;
        unitFrameWidth: number = 90;
        screen: Phaser.State;
        spacing: number = 2;
        x;
        y;

        constructor(screen: Phaser.State) {
            this.x = screen.world.centerX - 180;
            this.y = screen.world.centerY - 100;
            this.screen = screen;
            this.createRaidFrame();
        }

        createRaidFrame() {
            // TODO
            // Create a UnitFrame for each player in the raid
        
            for (var g = 0; g < 4; g++) {
                for (var p = 0; p < 5; p++) {
                    var x = new Player(game.rnd.between(0, 10), game.rnd.between(7, 19), 100, data.generatePlayerName());
                    this.raid.push(new UnitFrame(this.unitFrameWidth * g + this.x, p * (this.unitFrameHeight + this.spacing) + this.y, this.unitFrameWidth, this.unitFrameHeight, x, this.screen));
                }
            }
            // Arrange the frames spacing etc. to be within the boundaries set in this class
        }
    }
}