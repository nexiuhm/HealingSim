namespace Addons {
    export class UnitFrames {

        constructor(screen: Phaser.State) {
            new UnitFrame(400, 600, 300, 50, screen.player, screen);
            new TargetFrame(1200, 600, 300, 50, screen.player, screen);
        }

    }
}