
var game: Game;

window.onload = () => {
    game = new Game;
};

class Game extends Phaser.Game {
    gameVersion: number = 0;
    defaultFont:string =  "myriad";
    addons = [];
    // Custom signals/events
    TARGET_CHANGE_EVENT: Phaser.Signal = new Phaser.Signal();
    UNIT_HEALTH_CHANGE: Phaser.Signal = new Phaser.Signal();
    UNIT_ABSORB: Phaser.Signal = new Phaser.Signal();
    UNIT_STARTS_SPELLCAST: Phaser.Signal = new Phaser.Signal();
    UNIT_FINISH_SPELLCAST: Phaser.Signal = new Phaser.Signal();
    UNIT_CANCEL_SPELLCAST: Phaser.Signal = new Phaser.Signal();
    UI_ERROR_MESSAGE: Phaser.Signal = new Phaser.Signal();

    constructor() {
        // Set up webGL renderer.
        super(window.innerWidth, window.innerHeight, Phaser.WEBGL, "game_wrapper");
        
        // Register game states
        this.state.add("Boot", States.Boot);
        this.state.add("MainMenu", States.MainMenu);
        this.state.add("Play", States.Play);

        // Start boot state
        this.state.start("Boot");
    }

    /* Keyboard input dispatcher. Sends input to the current state instead of having the redudancy of setting up keyboard for each state. */
    sendKeyBoardInputToCurrentState(keyPressData) {
        
        var currentState = this.state.getCurrentState();
        if (!currentState.handleKeyBoardInput)
            return;
        else
           currentState.handleKeyBoardInput(keyPressData);

    };

    registerAddon(addonName, addonCode) {

    }
}