namespace Addons {
    export class UnitFrames {
        state: States.Play;
        
        constructor(screen: States.Play) {
            this.state = screen;

            var playerFrame = new UnitFrame(screen.UIParent, screen, screen.player, 300, 30);
            playerFrame.enableDrag();
            //playerFrame.setSize(50, 50);
            //new TargetFrame(this.container,widthFactor * 75 - this.targetFrameWidth/2, heightFactor * 75 - (this.targetFrameHeight / 2), 300, 50, screen.player, screen);
           
        }


    }
}