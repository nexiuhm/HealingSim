enum stat_e { STRENGHT, AGILITY, STAMINA, INTELLECT, SPIRIT };
enum class_e { WARRIOR, PALADIN, HUNTER, ROGUE, PRIEST, DEATHKNIGHT, SHAMAN, MAGE, WARLOCK, MONK, DRUID };
enum race_e { RACE_NONE = 0,RACE_BEAST, RACE_DRAGONKIN, RACE_GIANT, RACE_HUMANOID, RACE_DEMON, RACE_ELEMENTAL,RACE_NIGHT_ELF, RACE_HUMAN, RACE_GNOME, RACE_DWARF, RACE_DRAENEI, RACE_WORGEN,RACE_ORC, RACE_TROLL, RACE_UNDEAD, RACE_BLOOD_ELF, RACE_TAUREN, RACE_GOBLIN, RACE_PANDAREN, RACE_PANDAREN_ALLIANCE, RACE_PANDAREN_HORDE, RACE_MAX,RACE_UNKNOWN};
enum combat_rating_e {
    RATING_MOD_DODGE,
    RATING_MOD_PARRY,
    RATING_MOD_HIT_MELEE,
    RATING_MOD_HIT_RANGED,
    RATING_MOD_HIT_SPELL,
    RATING_MOD_CRIT_MELEE,
    RATING_MOD_CRIT_RANGED,
    RATING_MOD_CRIT_SPELL,
    RATING_MOD_MULTISTRIKE,
    RATING_MOD_READINESS,
    RATING_MOD_SPEED,
    RATING_MOD_RESILIENCE,
    RATING_MOD_LEECH,
    RATING_MOD_HASTE_MELEE,
    RATING_MOD_HASTE_RANGED,
    RATING_MOD_HASTE_SPELL,
    RATING_MOD_EXPERTISE,
    RATING_MOD_MASTERY,
    RATING_MOD_PVP_POWER,
    RATING_MOD_VERS_DAMAGE,
    RATING_MOD_VERS_HEAL,
    RATING_MOD_VERS_MITIG,
};
var PLAYER_MAX_LEVEL = 100;
var game: Game;


window.onload = () => {
    game = new Game;
};


class Game extends Phaser.Game {
    gameVersion: number = 0;
    playerControlledUnit: Player;
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
        
        // Start main state/loop
        this.state.add("Boot", Boot, true);
        this.state.add("SelectionScreen", SelectionScreen, false);
        this.state.add("Main", Main, false);
    }

   
    sendKeyBoardInputToCurrentState(keyPressData) {
        
        var currentState = this.state.getCurrentState();
        if (!currentState.handleKeyBoardInput)
            return;
        else
           currentState.handleKeyBoardInput(keyPressData);

    };

    registerAddon() {
        //## Todo
    }
}
class Boot extends Phaser.State {
    // All the assets we need we load here and only here
    preload() {
        this.load.image("SelectionScreenBackground", "graphics/temp.png");
        this.load.image("castbar_texture", "graphics/BantoBar.png");
        this.load.image("castbar_texture2", "graphics/LiteStep.png");
        this.load.image("ab_texture", "graphics/ab_texture.png");
        this.load.image("bg", "graphics/bg.jpg");
        this.load.image("pws", "graphics/spell_holy_powerwordshield.jpg");
        this.load.bitmapFont("myriad", "fonts/font.png", "fonts/font.xml");
    }

    create() {
        // Setup the keyboard for the game.
        game.input.keyboard.addCallbacks(game, undefined, undefined,(event) => game.sendKeyBoardInputToCurrentState(event));
        // Start the post-boot state
        game.state.start("SelectionScreen");
    }


};
class SelectionScreen extends Phaser.State {

    create() {
        // Select player etc.
        this.add.image(0, 0, "SelectionScreenBackground");
    }

    handleKeyBoardInput(keyCode) {
        // On any input, the game is started
        game.state.start("Main");
    }
}

class Main extends Phaser.State {
    
    player;

    create() {
        // Enable this to capture FPS
        this.time.advancedTiming = true; 
        
        // Start the world fade-in effect
        this.worldFadeInEffect();
        
        // Add a background to the screen
        this.loadBackground();

        // Init player
        this.player = new Priest.Priest(race_e.RACE_BLOOD_ELF, 100, "PlayerControlledUnit");

        // Load enabled addons
        this.loadAddons();

        // Start the boss/healing simulator
        this.startSimulation();
    }
    

    handleKeyBoardInput(key) {
        console.log(key);
        var keybindings = data.getKeyBindings();
        for (var binding in keybindings) {
            console.log(true);
                var bindobj = keybindings[binding] ;
                if (bindobj.key == key) {
                    console.log(true);
                    if (bindobj.spell)
                        this.do_action(bindobj.spell);
                    break;
                }
            }
        
    }
    do_action(spellName: string) {
 
        this.player.cast_spell(spellName);
    }
    startSimulation() {
        // --- Create some random damage for testing purposes ----
        var createSomeRandomDamage = setInterval(() => randomDamage, 3600);
        var createSomeRandomDamage2 = setInterval(() => randomDamage2, 1160);
        var createSomeRandomDamage3 = setInterval(() => absorb, 1960);
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
        var test_target_frame = new TargetFrame(1200, 600, 300, 50, this.player, this);
        var test_cast_frame = new CastFrame(400, 670, 300, 30, this.player, this);
        var test_group_frame = new RaidFrame(790, 350, this);
        var test_player_frame = new UnitFrame(400, 600, 300, 50, this.player, this);

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
        if (this.player.target) {
            game.debug.text("#### Name: " + this.player.target.name, 20, 80, '#00FF96');
            game.debug.text("#### Health: " + this.player.target.getCurrentHealth(), 20, 100, '#00FF96');
            game.debug.text("#### Class: " + this.player.target.classId, 20, 120, '#00FF96');
            game.debug.text("#### Race: " + this.player.target.race, 20, 140, '#00FF96');
            game.debug.text("#### Haste_percent: " + this.player.target.total_haste() + ' %', 20, 160, '#00FF96');

        }
    }
}