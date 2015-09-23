var game: Game;
var cd_overlay ;

window.onload = () => {
    game = new Game;
};



class Game extends Phaser.Game {
    debugMessagesOn: boolean = true;
    gameVersion: number = 0;
    playerControlledUnit: Player;
    defaultFont:string =  "myriad";

    // Custom singals/events
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
        
        // Create the local player
        this.playerControlledUnit = new Priest.Priest({ name: "You", classid: 5, health: 440000 });
        
        
        // Start main state/loop
        this.state.add("Main", Main, false);
        this.state.add("SelectionScreen", SelectionScreen, true);
  
    }
 
    start() {
        this.state.start("Main");
    }

    dbg(message) {
        if (!this.debugMessagesOn)
            return;

        if (typeof message == 'string') {

            console.log('%c Debug ', 'background: #222; color: #bada55', message);
            return;
        }

      
    }

}
class SelectionScreen extends Phaser.State {
    preload() {
        this.load.image("ss", "graphics/temp.png");

    }
    create() {
        this.input.keyboard.onDownCallback = function () { this.game.start() };
        
        this.add.image(0, 0, "ss");
    }
}
/* Simulation game-state*/
class Main extends Phaser.State {
  
    keybindings = {
        'ACTION_BUTTON_1': Phaser.Keyboard.ONE,
        'ACTION_BUTTON_2': Phaser.Keyboard.TWO,
        'ACTION_BUTTON_3': Phaser.Keyboard.THREE,
        'ACTION_BUTTON_4': Phaser.Keyboard.FOUR,
        'ACTION_BUTTON_5': Phaser.Keyboard.FIVE,
        'ACTION_BUTTON_6': Phaser.Keyboard.SIX,
        'ACTION_BUTTON_7': Phaser.Keyboard.F,
        'ACTION_BUTTON_8': Phaser.Keyboard.V
    };

    preload() {
        // load some textures
        this.load.image("castbar_texture", "graphics/BantoBar.png");
        this.load.image("castbar_texture2", "graphics/LiteStep.png");
        this.load.image("ab_texture", "graphics/ab_texture.png");
        this.load.image("bg", "graphics/bg.jpg");
        this.load.image("alpha_mask", "graphics/alpha_mask.png");
        this.load.image("pws", "graphics/spell_holy_powerwordshield.jpg");
        this.load.image("spell_flash", "graphics/spell_ready_shader.png");
        this.load.bitmapFont("myriad", "fonts/font.png", "fonts/font.xml");
    }
    create() {
        // Enable to this to capture FPS
        this.time.advancedTiming = true; 
        
        // Start the world fade-in effect
        this.worldFadeInEffect();
        
        // Add a background to the screen
        this.loadBackground();

        // Drawing the different UI widgets.
        this.loadAddons();

        // Setup keyboard input callback function
        this.input.keyboard.onDownCallback = (event) => this.handleKeyboardInput(event);
       
        // Start the boss/healing simulator
        this.startSimulation();

    }
    

    handleKeyboardInput(event) {
        switch (event.keyCode) {
            case this.keybindings.ACTION_BUTTON_1:
                game.playerControlledUnit.cast_spell('flash_of_light'); 
                break;

            case this.keybindings.ACTION_BUTTON_2:
                game.playerControlledUnit.cast_spell('power_word_shield');
                break;
            case this.keybindings.ACTION_BUTTON_3:
                game.playerControlledUnit.cast_spell('clarity_of_will');
                break;
        }
    }

    startSimulation() {
        // --- Create some random damage for testing purposes ----
        var createSomeRandomDamage = setInterval(randomDamage, 3600);
        var createSomeRandomDamage2 = setInterval(randomDamage2, 1160);
        var createSomeRandomDamage3 = setInterval(absrb, 1960);
        function randomDamage2() {
            game.playerControlledUnit.recive_damage({ amount: game.rnd.between(11, 128900) });

        }
        function randomDamage() {
            game.playerControlledUnit.recive_damage({ amount: game.rnd.between(215555, 338900) });
        }

        function absrb() {
            game.playerControlledUnit.setAbsorb(game.rnd.between(115, 88900));
            game.playerControlledUnit.setHealth(game.playerControlledUnit.stats.health + game.rnd.between(20000, 88900));
        }
       // ---------------------------------------------------------
       
    }
    loadAddons() {
        var test_target_frame = new TargetFrame(1200, 600, 300, 50, game.playerControlledUnit, this);
        var test_cast_frame = new CastFrame(400, 670, 300, 30, game.playerControlledUnit, this);
        var test_group_frame = new RaidFrame(790, 350, this);
        var test_player_frame = new UnitFrame(400, 600, 300, 50, game.playerControlledUnit, this);
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

        // This function wont be used much as most of the graphical animations are rendered using Tweens.
        game.debug.text(game.time.fps.toString()+ " FPS", 20, 20, '#00FF96');
        game.debug.text("v. " + game.gameVersion, 20, 40, '#00FF96');
        game.debug.text("#### UNIT TARGET INFO ########## ", 20, 60, '#00FF96');
        if (game.playerControlledUnit.target) {
            game.debug.text("#### Name: " + game.playerControlledUnit.target.name, 20, 80, '#00FF96');

            game.debug.text("#### Health: " + game.playerControlledUnit.target.stats.health, 20, 100, '#00FF96');
            game.debug.text("#### Class: " + game.playerControlledUnit.target.classId, 20, 120, '#00FF96');
        }

    }
    
}
