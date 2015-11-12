/* The Boot state configures the Phaser game engine and loads assets */
namespace States {

    export class Boot extends Phaser.State {
        preload() {
            game.load.image("SelectionScreenBackground", "graphics/temp.png");
            game.load.image("castbar_texture", "graphics/BantoBar.png");
            game.load.image("castbar_texture2", "graphics/LiteStep.png");
            game.load.image("ab_texture", "graphics/ab_texture.png");
            game.load.image("bg", "graphics/bg.jpg");
            game.load.image("pws", "graphics/spell_holy_powerwordshield.jpg");
            game.load.image("blue_particle", "graphics/blue.png");
            game.load.bitmapFont("myriad", "fonts/font.png", "fonts/font.xml");
        }

        onWindowResize(data) {
            console.log("NEW WIDTH: "+ data.width, "NEW HEIGHT: " + data.height);
            //currentState.world.resize(data.width, data.height);
            game.canvas.height = window.innerHeight;
            game.canvas.width = window.innerWidth;
        }

        create() {
            // Set scalemode for the game.
            game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            game.scale.onSizeChange.add((data) => this.onWindowResize(data));
            //have the game centered 



            // Register addons to the game
            game.addons.add("Cast Bar 0.1", Addons.CastFrame);
            game.addons.add("Raid Frames 0.1", Addons.RaidFrame);
            game.addons.add("Unit Frames 0.1", Addons.UnitFrames);

            // Enable this to capture FPS
            game.time.advancedTiming = true;
            // Needed for Phaser 2.4.4 or tweens act weird
            game.tweens.frameBased = true;
            // Setup the keyboard for the game.
            game.input.keyboard.addCallbacks(game, undefined, undefined, game.sendKeyBoardInputToCurrentState);
            // Start the post-boot state
            game.state.start("MainMenu");
        }

    };
}