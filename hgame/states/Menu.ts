namespace States {

    export class MainMenu extends Phaser.State {
        // Show HTML form on screen. 
        // - Options to select player, difficulty,--
        // Validate/Process form input
        
        create() {
          
            this.printAddonList();
            this.addBackground();
        }

        addBackground() {
            game.add.image(0, 0, "SelectionScreenBackground");

            var emitter = this.add.emitter(this.world.centerX, this.world.centerY, 200);

            emitter.makeParticles(['blue_particle']);

            emitter.setRotation(0, 1);
            emitter.setAlpha(0.2, 0.4);
            emitter.setScale(3,3, 3, 3);
            emitter.gravity = 5000;
            emitter.start(false, 50000, 1);
            this.add.tween(emitter).to({ gravity: -10, x: 0, y: -500 }, 4000, Phaser.Easing.Exponential.InOut, true);
        };
        printAddonList() {
            var addonList = game.addons.getListOfAddons();
            var lineHeight = 15;
            var headerText = this.add.bitmapText(0, 0, game.defaultFont, "### REGISTRED ADDONS ###", 14);
            headerText.tint = 0xFF00FF;
            for (var i = 0; i < addonList.length; i++) {
                this.add.bitmapText(0,lineHeight * i + lineHeight, game.defaultFont, "## Addon Name: " + addonList[i][0] + "  ## Enabled : " + addonList[i][1],14);
            };
        }
        handleKeyBoardInput(keyCode) {
            // On any input, the game is started
            game.state.start("Play");
        }
    }
}