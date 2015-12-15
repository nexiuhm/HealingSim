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
            var playersInRaid = this.playState.raid.getPlayerList();
            for (var g = 0; g < 5; g++) {
                for (var p = 0; p < 5; p++) {
             
                    var unit = playersInRaid[(g*5) + p];
                    if (!unit)
                        break;
                    this.raid.push(new UnitFrame(this.container, this.unitFrameWidth * g + this.x, p * (this.unitFrameHeight + this.spacing) + this.y, this.unitFrameWidth, this.unitFrameHeight, unit, this.playState));
                }
            }

            /* Totally uneeded fancy effect */
            for (var player = 0; player < this.raid.length; player++) {
                var unitFrame_frame = this.raid[player].container;
                game.add.tween(unitFrame_frame).to({ x: window.innerWidth/2, y:-200 }, game.rnd.between(1200, 1500), Phaser.Easing.Elastic.Out, true,undefined,undefined,true);
            }
        }
    }
}