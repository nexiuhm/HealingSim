namespace Addons {
    export class UnitFrames {
        
        constructor(screen: States.Play) {

            var playerFrame = new UnitFrame(screen.UIParent, screen, screen.player, 300, 50)
            playerFrame.togglePowerBar();
            playerFrame.setPos(500, 800);
            //test case
           
        }


    }
}