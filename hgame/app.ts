
var game: Game;

window.onload = () => {
    game = new Game;
};


class Game extends Phaser.Game {
    gameVersion: number = 0;
    defaultFont:string =  "myriad";
    addons = new AddonManager();
    
    constructor() {
        // Create an instance of the Phaser game engine. Force WEBGL since Canvas doesnt support textures / blendmodes which we use heavily.
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
}

/* Addon manager class - To keep things consistant it works a lot like how Phaser deals with states.
/* Clarification: An addon is basicly a subroutine that displays graphical information to the screen and modifies this information as a reaction to events the game creates*/
class AddonManager {
    private addons = {};

    add(addonKey: string, addonCode:Function) {
        this.addons[addonKey] = { name: addonKey, enabled: true, code: addonCode };
    }

    disableAddon(addonKey:string) {
        if (!this.addons[addonKey])
            return;
        else
            this.addons[addonKey].enabled = false;
    }
    enableAddon(addonKey:string) {
        if (!this.addons[addonKey])
            return;
        else
            this.addons[addonKey].enabled = true;
    }

    /* Returns info about all registred addons. */
    getListOfAddons() {
        var addonList = [];
        for (var addon in this.addons) {
            var currentAddon = this.addons[addon];
            addonList.push([currentAddon.name, currentAddon.enabled]);
        }
        return addonList;
    }

    /* Executes the addon code to the current state/stage */
    loadEnabledAddons(stateToDrawTo:Phaser.State) {
        for (var addon in this.addons) {
            var currentAddon = this.addons[addon];
            if (currentAddon.enabled)
                new currentAddon.code(stateToDrawTo);
        }
    }
}