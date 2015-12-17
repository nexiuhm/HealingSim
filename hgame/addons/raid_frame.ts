namespace Addons {
    export class RaidFrame {
        raidFrames: Array<UnitFrame> = [];
        unitFrameHeight: number = 40;
        unitFrameWidth: number = 90;
        playState: States.Play;
        spacing: number = 2;
        raidFrame: Frame;
        
        constructor(playState: States.Play) {

            this.playState = playState;

            this.raidFrame = new Frame(playState.UIParent);
            this.createRaidFrame();
 
        }
        createRaidFrame() {
            const MAX_GROUPS = 5;
            const MAX_PLAYERS_PER_GROUP = 5;

            var playersInRaid = this.playState.raid.getPlayerList();
            for (var g = 0; g < MAX_GROUPS; g++) {
                for (var p = 0; p < MAX_PLAYERS_PER_GROUP; p++) {
                    var unit = playersInRaid[(g * 5) + p];
                    
                    if (!unit)
                        break;
                                                    // parent //
                    var unitFrame = new UnitFrame(this.raidFrame, this.playState, unit,this.unitFrameWidth, this.unitFrameHeight);

                    if (unit === this.playState.player)
                        unitFrame.togglePowerBar();

                    unitFrame.setPos(this.unitFrameWidth * g, p * (this.unitFrameHeight + this.spacing));
                    this.raidFrames.push(unitFrame);
                    console.log(g);
                }
            }

            /* Position parent frame base on how big the raid got */
            this.raidFrame.x = widthFactor * 50 - this.raidFrame.width / 2;
            this.raidFrame.y = heightFactor * 50 - this.raidFrame.height /2;
           
            /* Spawn effect */
            for (var player = 0; player < this.raidFrames.length; player++) {
                var unitFrame = this.raidFrames[player];
                game.add.tween(unitFrame).to({y:-800 }, 1550 + (player*10), Phaser.Easing.Elastic.Out, true,undefined,undefined,true);
            }
            
        }
    }
}