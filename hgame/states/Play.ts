﻿namespace States {
    export class Play extends Phaser.State {

        player: Player;

        create() {
            
            // Start the world fade-in effect
            this.worldFadeInEffect();

            // Add a background to the screen
            this.loadBackground();

            // Init player. TODO: Use data from selection screen. See Phaser documentation for sending args between states?
            this.player = new Priest.Priest(race_e.RACE_BLOOD_ELF, 100, "PlayerControlledUnit");

            // Load enabled addons
            this.loadAddons();

            // Start the boss/healing simulator
            this.startSimulation();
        }

        handleKeyBoardInput(key) {
            // ## Todo ## : Find a better way to deal with this, maybe just send the input to the addons, and let the addons/ui decide what to do with it.

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

        startSimulation() {
            //## TODO: Do this in a proper way: Create a boss, boss does damage. Timed events. Aggro etc. This needs some thought
            // --- Create some random damage for testing purposes ----
            var createSomeRandomDamage = setInterval(randomDamage.bind(this), 3600);
            var createSomeRandomDamage2 = setInterval(randomDamage2.bind(this), 1160);
            var createSomeRandomDamage3 = setInterval(absorb.bind(this), 1960);
            function randomDamage2() {
                this.player.recive_damage({ amount: game.rnd.between(11, 128900) });
            }

            function randomDamage() {
                this.player.recive_damage({ amount: game.rnd.between(215555, 338900) });
            }

            function absorb() {
                this.player.setAbsorb(game.rnd.between(115, 88900));
                this.player.setHealth(this.player.getCurrentHealth() + game.rnd.between(20000, 88900));
            }
            // ---------------------------------------------------------
        }

        loadAddons() {
            game.addons.loadEnabledAddons(this);
        }

        loadBackground() {
            var background = this.add.image(0, 0, "bg");
            background.width = window.innerWidth;
            background.height = window.innerHeight;
        }

        worldFadeInEffect() {
    
            this.world.alpha = 0;
            this.add.tween(this.world).to({ alpha: 1 }, 3500, Phaser.Easing.Cubic.InOut, true);
        }

        render() {
           
            game.debug.text(game.time.fps + " FPS", 20, 20, '#00FF96');
            game.debug.text("v. " + game.gameVersion, 20, 40, '#00FF96');
            game.debug.text("#### UNIT TARGET INFO ########## ", 20, 60, '#00FF96');
            if (this.player.target) {
                game.debug.text("#### Name: " + this.player.target.name, 20, 80, '#00FF96');
                game.debug.text("#### Health: " + this.player.target.getCurrentHealth(), 20, 100, '#00FF96');
                game.debug.text("#### Class: " + this.player.target.classId, 20, 120, '#00FF96');
                game.debug.text("#### Race: " + this.player.target.race, 20, 140, '#00FF96');
                game.debug.text("#### Haste_percent: " + this.player.target.total_haste() + ' %', 20, 160, '#00FF96');
    
            }
            
        }

    }
}