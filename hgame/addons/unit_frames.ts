namespace Addons {
    export class UnitFrames {
        
        constructor(screen: States.Play) {

            var config = {
                emphasizedTime: 5000
            };

            var testBoss = new Player(class_e.WARRIOR, race_e.RACE_HUMAN, 100, "Ragnaros", screen.events,true);
            setInterval(function () { testBoss.recive_damage({ amount: 5250 }) }, 1200);

            var playerFrame = new UnitFrame(screen.UIParent, screen.player, 300, 50);
            playerFrame.togglePowerBar();
            playerFrame.setPos(500, 800);
            playerFrame.input.enableDrag();

            var targetFrame = new UnitFrame(screen.UIParent, screen.player, 300, 50);
            targetFrame.setPos(1000, 800);
            screen.events.TARGET_CHANGE_EVENT.add(() => targetFrame.setUnit(screen.player.target));
            var bossFrame = new UnitFrame(screen.UIParent, testBoss, 300, 50);
            bossFrame.setPos(1200, 500);

        }
    }
}