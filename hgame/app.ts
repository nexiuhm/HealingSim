
var game: Game;
var heightFactor: number = window.innerHeight / 100;
var widthFactor: number = window.innerWidth / 100;

window.onload = () => {

    // Create an instance of the Phaser game engine. 
    // Force WEBGL since Canvas doesnt support textures / blendmodes which we use heavily.
    // Automatically starts the boot state aka. application entry point

    game = new Game('100%','100%',Phaser.WEBGL,undefined,States.Boot);
};

/* Adding some extra functionality to the Phaser game engine */
/* Adds the ability to load "addons", and a different way to handle keyboard input */
class Game extends Phaser.Game {
    gameVersion: number = 0;
    defaultFont:string =  "myriad";
    addons = new AddonManager();
  
    constructor(width?: number | string, height?: number | string, renderer?: number, parent?: any, state?: any, transparent?: boolean, antialias?: boolean, physicsConfig?: any) {
        super(width,height,renderer,parent,state,transparent,antialias,physicsConfig);
    }

    /* Keyboard input dispatcher. Sends input to the current state instead of having the redudancy of up a keyboard for each state. */
    sendKeyBoardInputToCurrentState(keyPressData) {
        
        var currentState = this.state.getCurrentState();
        if (!currentState.handleKeyBoardInput)
            return;
        else
           currentState.handleKeyBoardInput(keyPressData);

    };
}