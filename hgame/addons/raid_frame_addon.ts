namespace Addons {
    export class RaidFrame {
        raid: Array<UnitFrame> = [];
        unitFrameHeight: number = 40;
        unitFrameWidth: number = 90;
        state: States.Play;
        spacing: number = 2;
        x;
        y;
        
        constructor(state: States.Play) {
            this.x = state.world.centerX - 180;
            this.y = state.world.centerY - 100;
            this.state = state;
            this.createRaidFrame();
        }

        createRaidFrame() {
            // TODO
            // Create a UnitFrame for each player in the raid

            for (var g = 0; g < 4; g++) {
                for (var p = 0; p < 5; p++) {
                  
                        
                    var classs = game.rnd.between(player_class.MIN, player_class.MAX);
                    var race = game.rnd.between(player_race.MIN, player_race.MAX);
                    var level = 100;
                    var name = data.generatePlayerName();
                   
                    var unit = this.state.createUnit(classs,race,level,name);
                    this.raid.push(new UnitFrame(this.unitFrameWidth * g + this.x, p * (this.unitFrameHeight + this.spacing) + this.y, this.unitFrameWidth, this.unitFrameHeight, unit, this.state));
                }
            }
            // Arrange the frames spacing etc. to be within the boundaries set in this class
        }
    }
}