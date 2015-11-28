namespace States {
    export class Play extends Phaser.State {

        player: Player;
        events = new EventManager(); //### TODO ###
        raid = new Raid(this.events); // ### TODO ###
        
        create() {
         
            // Start the world fade-in effect
            this.world.alpha = 0;
            this.add.tween(this.world).to({ alpha: 1 }, 4000, Phaser.Easing.Cubic.InOut, true);

            // Add a background to the screen
            game.add.image(game.stage.x, game.stage.y, "bg");

            // Init player. ## TODO ##: Use data from selection screen. See Phaser documentation for sending args between states?
            this.player = this.raid.createUnit(class_e.PRIEST, race_e.RACE_BLOOD_ELF, 100, "Player");

            // Load enabled addons
            game.addons.loadEnabledAddons(this);

            // Start the boss/healing simulator
            this.raid.startTestDamage(this.player);

            // TEST

            var test = new CooldownFrame(this);

        }

        update() {
            this.events.GAME_LOOP_UPDATE.dispatch();
        };

        handleKeyBoardInput(key) {
            // ## TODO ## : Find a better way to deal with this, maybe just send the input to the addons, and let the addons/ui decide what to do with it.

            var keybindings = data.getKeyBindings();
            for (var binding in keybindings) {
                var keybinding = keybindings[binding];
                if (keybinding.key == key) {
                    if (keybinding.spell)
                        this.player.cast_spell(keybinding.spell);
                    break;
                }
            }
        }


        render() {
            this.events.GAME_LOOP_RENDER.dispatch();
        }
    }
}