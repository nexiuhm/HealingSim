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
            game.load.bitmapFont("myriad", "fonts/font.png", "fonts/font.xml");
        }

        create() {
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