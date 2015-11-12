namespace Addons {
    export class UnitFrames {
        state: States.Play;
        unitFrameHeight = 50;
        unitFrameWidth = 300;
        targetFrameHeight = 50;
        targetFrameWidth = 300;
        x;
        y;
        constructor(screen: States.Play) {
            
            new UnitFrame(widthFactor*25 - this.unitFrameWidth/2, heightFactor * 75 - this.unitFrameHeight / 2, 300, 50, screen.player, screen);
            new TargetFrame(widthFactor * 75 - this.targetFrameWidth/2, heightFactor * 75 - (this.targetFrameHeight / 2), 300, 50, screen.player, screen);
        }

    }
}