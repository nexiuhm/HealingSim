namespace Addons {
    export class RaidFrame {
        raid: Array<UnitFrame> = [];
        unitFrameHeight: number = 40;
        unitFrameWidth: number = 90;
        playState: States.Play;
        spacing: number = 2;
        interactionLayer: Phaser.Sprite;
        container: Phaser.Group
        x;
        y;
        
        constructor(playState: States.Play) {
            this.x = widthFactor * 50 - this.unitFrameWidth * 2;
            this.y = heightFactor * 50 - this.unitFrameHeight * 2;
            this.playState = playState;

            this.container = playState.add.group();
            this.createRaidFrame();
            //this.interactionLayer = new Phaser.Sprite(game, 0, 0);
            //this.container.addChild(this.interactionLayer);}
        }
        createRaidFrame() {
            // TODO
            // Create a UnitFrame for each player in the raid
            //
            for (var g = 0; g < 4; g++) {
                for (var p = 0; p < 5; p++) {

                    var classs = game.rnd.between(player_class.MIN, player_class.MAX);
                    var race = game.rnd.between(player_race.MIN, player_race.MAX);
                    var level = 100;
                    var name = data.generatePlayerName();
                    
                    var unit = this.playState.raid.createUnit(classs,race,level,name);
                    this.raid.push(new UnitFrame(this.container,this.unitFrameWidth * g + this.x, p * (this.unitFrameHeight + this.spacing) + this.y, this.unitFrameWidth, this.unitFrameHeight, unit, this.playState));
                }
            }
            // Arrange the frames spacing etc. to be within the boundaries set in this class
        }
    }
}