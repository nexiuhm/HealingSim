namespace Addons {
    export class UnitFrames {

        constructor(screen: States.Play) {
            new UnitFrame(screen.world.centerX - 490, screen.world.centerY + 200, 300, 50, screen.player, screen);
            new TargetFrame(screen.world.centerX + 190, screen.world.centerY +200, 300, 50, screen.player, screen);
        }

    }
}