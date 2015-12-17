namespace Addons {
    export class UnitFrames {
        
        constructor(screen: States.Play) {

            var testBoss = new Player(class_e.WARRIOR, race_e.RACE_HUMAN, 100, "Ragnaros", screen.events,true);
            setInterval(function () { testBoss.recive_damage({ amount: 3500 }) }, 1200);

            var playerFrame = new UnitFrame(screen.UIParent, screen, screen.player, 300, 50);
            playerFrame.togglePowerBar();
            playerFrame.setPos(500, 800);
            playerFrame.input.enableDrag();

            var targetFrame = new UnitFrame(screen.UIParent, screen, screen.player, 300, 50);
            targetFrame.setPos(1000, 800);

            var bossFrame = new UnitFrame(screen.UIParent, screen, testBoss, 300, 50);
            bossFrame.setPos(1200, 500);

            //test case
           
        }


    }
}