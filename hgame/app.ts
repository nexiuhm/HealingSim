
var game: Game;
var heightFactor: number = window.innerHeight/100;
var widthFactor: number = window.innerWidth/100;

window.onload = () => {
    game = new Game;
};


class Game extends Phaser.Game {
    gameVersion: number = 0;
    defaultFont:string =  "myriad";
    addons = new AddonManager();
    

    constructor() {


        // Create an instance of the Phaser game engine. Force WEBGL since Canvas doesnt support textures / blendmodes which we use heavily.
        super(window.innerWidth, window.innerHeight, Phaser.AUTO, "game_wrapper");
        
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
}