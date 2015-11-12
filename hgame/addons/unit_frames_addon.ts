namespace Addons {
    export class UnitFrames {
        state: States.Play;

        x;
        y;
        constructor(screen: States.Play) {

            new UnitFrame(widthFactor, heightFactor * 6, 300, 50, screen.player, screen);
            new TargetFrame(widthFactor * 4, heightFactor * 6, 300, 50, screen.player, screen);
        }

    }
}