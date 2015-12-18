/* The Boot state configures the Phaser game engine and loads assets */
namespace States {

    export class Boot extends Phaser.State {
        preload() {
            game.load.image("MenuScreenText",               "./assets/menu_state_text.png");
            game.load.image("MenuScreenBackground",         "./assets/textures/bg_texture.png");
            game.load.image("castbar_texture",              "./assets/textures/BantoBar.png");
            game.load.image("castbar_texture2",             "./assets/textures/LiteStep.png");
            game.load.image("ab_texture",                   "./assets/textures/action_bar_texture.png");
            game.load.image("elite",                        "./assets/textures/elite_texture.png");
            game.load.image("bg",                           "./assets/play_state_background.png");
            game.load.image("icon_5",                       "./assets/icons/spell_holy_powerwordshield.jpg");
            game.load.image("icon_2",                       "./assets/icons/power_infusion.jpg");
            game.load.bitmapFont("myriad",                  "./assets/fonts/font.png", "./assets/fonts/font.xml");
        }

        onWindowResize(data) {
            console.log("NEW WIDTH: "+ data.width, "NEW HEIGHT: " + data.height);
            //currentState.world.resize(data.width, data.height);
            game.canvas.height = window.innerHeight;
            game.canvas.width = window.innerWidth;

            // Recalculate the factors used to place displayObjects.
            // ### TODO ### Need to find a way for the displayObjects to reposition themselves with these new values.
            heightFactor = window.innerHeight / 100;
            widthFactor = window.innerWidth / 100;
        }

        create() {
            // Set scalemode for the game.
            game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            game.scale.onSizeChange.add((data) => this.onWindowResize(data));
            
            // Register game states
            game.state.add("MainMenu", States.MainMenu);
            game.state.add("Play", States.Play);

            // Register addons to the game
            game.addons.add("Cast Bar 0.1", Addons.CastFrame);
            game.addons.add("Raid Frames 0.1", Addons.RaidFrame);
            game.addons.add("Unit Frames 0.1", Addons.UnitFrames);
            game.addons.add("Debug", Addons.Debug);
            game.addons.add("BossTimers", Addons.BigWigs);


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