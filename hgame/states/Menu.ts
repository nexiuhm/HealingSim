namespace States {

    export class MainMenu extends Phaser.State {
        // Show HTML form on screen. 
        // - Options to select player, difficulty,--
        // Validate/Process form input
        
        create() {
            this.add.image(0, 0, "SelectionScreenBackground");
        }

        handleKeyBoardInput(keyCode) {
            // On any input, the game is started
            game.state.start("Play");
        }
    }
}