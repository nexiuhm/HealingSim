namespace Addons {
    export class RaidFrame {
        raidFrames: Array<UnitFrame> = [];
        unitFrameHeight: number = 40;
        unitFrameWidth: number = 90;
        playState: States.Play;
        spacing: number = 2;
        container;
        x;
        y;
        
        constructor(playState: States.Play) {

            this.playState = playState;

            this.container = new Frame(playState.UIParent);
            this.container.enableDrag();
            this.createRaidFrame();
 
        }
        createRaidFrame() {

            var playersInRaid = this.playState.raid.getPlayerList();
            for (var g = 0; g < 5; g++) {
                for (var p = 0; p < 5; p++) {
                    var unit = playersInRaid[(g * 5) + p];
                    
                    if (!unit)
                        break;
                    var raidFrame = new UnitFrame(this.container, this.playState, unit,this.unitFrameWidth, this.unitFrameHeight);

                    if (unit === this.playState.player)
                        raidFrame.togglePowerBar();

                    raidFrame.setPos(this.unitFrameWidth * g, p * (this.unitFrameHeight + this.spacing));
                    this.raidFrames.push(raidFrame);
                }
            }

            /* Position parent frame base on how big the raid got */
            this.container.x = widthFactor * 50 - this.unitFrameWidth * (g/2);
            this.container.y = heightFactor * 50 - this.unitFrameHeight * (g/2);
           
            /* Spawn effect */
            for (var player = 0; player < this.raidFrames.length; player++) {
                var unitFrame = this.raidFrames[player];
                game.add.tween(unitFrame).to({y:-800 }, 1550 + (player*10), Phaser.Easing.Elastic.Out, true,undefined,undefined,true);
            }
            
        }
    }
}