
// ### Major todo: Clean up & refactoring ###
/*----  Unit frame to contain basic unit info. -------------- */ 
/*      In it most basic form it will only display a healthbar.  */
/*      This should be the first thing to be implemented (Used for target/ player frame + raid frames )  */

class UnitFrame {
    //options
    unit: Player;
    width: number;
    height: number;
    x: number;
    y: number;

    container: Phaser.Graphics;
    screen: Phaser.State;

    // Atonomy of the unit frame
    health: Phaser.Graphics;
    absorb: Phaser.Graphics;
    background: Phaser.Graphics;
    overlay_texture: Phaser.Sprite;
    unit_name: Phaser.BitmapText;
    health_text: Phaser.BitmapText;

    constructor(x, y, w, h, unit: Player, screen: Phaser.State) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        
        
        // Reference to the player object we are representing.
        this.unit = unit;
        // Reference to the screen we are going to draw to ( This feels like a weird way to do it, improve later)
        this.screen = screen;

        //  - Create container for the UnitFrame, all the other stuff is added as children of this element.
        this.container = this.screen.add.graphics(x, y);
        this.container.width = w;
        this.container.height = h; 
        // Create the healthbar layer
        this.health = this.screen.add.graphics(0, 0);
        // Create absorb layer
        this.absorb = this.screen.add.graphics(0, 0);
        
        this.absorb.blendMode = PIXI.blendModes.COLOR_BURN;
        this.absorb.alpha = 0.5;

        // Create the texture layer
        this.overlay_texture = this.screen.add.sprite(0, 0, "castbar_texture");
        this.overlay_texture.blendMode = PIXI.blendModes.MULTIPLY;
        this.overlay_texture.width = w;
        this.overlay_texture.height = h;

        // Create the player name layer
        this.unit_name = this.screen.add.bitmapText(w / 2, h / 2,"myriad", this.unit.name, 12);
        this.unit_name.tint = util.getClassColor(this.unit.classId);
        this.unit_name.anchor.set(0.5);
       
        // Add the layers as children of the container
        this.container.addChild(this.health);
        this.container.addChild(this.overlay_texture);
        this.container.addChild(this.absorb);
        this.container.addChild(this.unit_name);

        // Add interaction
        this.container.inputEnabled = true;
        this.container.events.onInputDown.add(() => {
            game.playerControlledUnit.setTarget(this.unit );
        });
        
        //Scale the health bar to represent the player's health.
        this.initHealthBar();
        this.initAbsorbBar();
        this.UPDATE();
        
        // Set up event listeners. ### TODO Need a way to filter out events that is not coming from this unit
        game.UNIT_HEALTH_CHANGE.add(() => this.UPDATE());
        game.UNIT_ABSORB.add(() => this.UPDATE());
    }

    UPDATE() {

        var new_health_width = this.calcBarWidth(this.unit.getCurrentHealth(), this.unit.getMaxHealth());
        var new_absorb_width = this.calcBarWidth(this.unit.getAbsorb(), this.unit.getMaxHealth());
        // Need to update the x value of the absorb everytime the health "moves"
        var new_absorb_x = new_health_width;
        
        // Some weird stuff happens if the width of a displayObject is set to 0? Fucks up targetting. No idea why
        // This fixes it for now
        if (new_health_width <= 0)
            new_health_width = 1;
        if (new_absorb_width <= 0)
            new_absorb_width = 1;

        // ugly
        this.screen.add.tween(this.health).to({ width: new_health_width }, 150, "Linear", true);
        this.screen.add.tween(this.absorb).to({ x: new_absorb_x }, 150, "Linear", true);
        this.screen.add.tween(this.absorb).to({ width: new_absorb_width }, 50, "Linear", true);
    }

    UNIT_MANA_CHANGE(eventData) {
        // animate the change in resource
    }

    UNIT_DEATH(eventData) {
        // make healthbar grey? show skull icon?
    }

    calcBarWidth(currentValue, maxValue): number {
        var barWidthInPixels = Math.round((currentValue / maxValue ) * this.width);
        return barWidthInPixels;
    }
 
    initUnitName() {
        this.unit_name.setText(this.unit.name);
        this.unit_name.tint = util.getClassColor(this.unit.classId);
    }

    initHealthBar() { // Its not possible to change the color of the health bar. It needs to be redrawn from scratch.
        this.health.clear();
        this.health.beginFill(util.getClassColor(this.unit.classId));
        this.health.drawRect(0, 0, 1, this.height);
    }
    
    initAbsorbBar() {  
        this.absorb.clear();
        this.absorb.beginFill(0x43b6e8);
        this.absorb.drawRect(0, 0, 1, this.height);
    }
}

class TargetFrame extends UnitFrame {
    ownerUnit: Player;
    constructor(x, y, w, h, unit: Player, screen: Phaser.State) {
        super(x, y, w, h, unit, screen);
        this.ownerUnit = this.unit;
        this.unit = this.ownerUnit.target;
        // Subscribe to the target change event. This event is emitted in the Player.setTarget() function
        game.TARGET_CHANGE_EVENT.add(() => this.UNIT_TARGET_CHANGE());
    }

    UNIT_TARGET_CHANGE() {
          this.unit = this.ownerUnit.target;
          this.initUnitName();
          this.initHealthBar();
          this.initAbsorbBar();
          this.UPDATE();
    }
}

class RaidFrame {
    raid: Array<UnitFrame> = [];
    unitFrameHeight: number = 40;
    unitFrameWidth: number = 90;
    screen: Phaser.State;
    spacing: number = 2;
    x;
    y;

    constructor(x, y, screen: Phaser.State) {
        this.x = x;
        this.y = y;
        this.screen = screen;
        this.init();
    }

    init() {
        // TODO
        // Create a UnitFrame for each player in the raid
        
        for (var g = 0; g < 4; g++) {
            
            for (var p = 0; p < 5; p++) {
                var x = new Player(game.rnd.between(0, 10), game.rnd.between(7,19), 100, util.generatePlayerName());
                this.raid.push(new UnitFrame(this.unitFrameWidth*g + this.x+5, p * (this.unitFrameHeight + this.spacing) + this.y, this.unitFrameWidth, this.unitFrameHeight, x, this.screen));
            } 
        }
        // Arrange the frames spacing etc. to be within the boundaries set in this class
    }
}

class ActionBar {

}

class Frame extends Phaser.Sprite { //### TODO,### add this as a base class for UI elements?
   
}

class CastFrame  {

    config = {
        castSuccessColor: 0x00FF96,
        castingColor: 0xFF7D0A,

    }
    castingUnit:Player = null; 
    cast_timer: Phaser.TimerEvent; // internal timer to be able to show cast progress on bar as text.
    anim:any = {};
    container: Phaser.Graphics;
    background: Phaser.Graphics;
    cast_bar: Phaser.Graphics;
    texture: Phaser.Sprite;
    spell_name: Phaser.BitmapText;
    x;
    y;
    width;
    height;
    screen: Phaser.State;

    constructor(x,y,w, h, castingUnit: Player,screen:Phaser.State) {

        this.x = x;
        this.y = y;   
        this.width = w;
        this.height = h;
        this.castingUnit = castingUnit;
        this.screen = screen;
  
        this.container = this.screen.add.graphics(x, y);
        this.container.width = w;
        this.container.height = h;

        // Background layer
        this.background = this.screen.add.graphics(0, 0);
        this.background.beginFill(0x368975);
        this.background.drawRect(0, 0, w, h);
        
        // Cast bar layer
        this.cast_bar = this.screen.add.graphics(0, 0);
        this.cast_bar.beginFill(0xFFFFFF);
        this.cast_bar.drawRect(0, 0, w,h);
        this.cast_bar.width = 0;
        this.cast_bar.tint = 0xFF7D0A;

        // Overlay texture
        this.texture = this.screen.add.sprite(0, 0, "castbar_texture2");
        this.texture.width = w;
        this.texture.height = h;
        this.texture.blendMode = PIXI.blendModes.MULTIPLY;

        // Name of the spell
        this.spell_name = this.screen.add.bitmapText(w / 2, h / 2, "myriad", "", 12);
        this.spell_name.anchor.set(0.5);
        
        this.container.addChild(this.background);
        this.container.addChild(this.cast_bar);
        this.container.addChild(this.texture);
        this.container.addChild(this.spell_name);
        
        // CastBar is hidden by default
        this.container.alpha = 0;

        // Init animations
        this.anim.fadeCastBar = this.screen.add.tween(this.container).to({ alpha: 0 }, 1000, "Linear", true);
        
        // Setup event listeners with callback functions
        game.UNIT_STARTS_SPELLCAST.add((s,t) => this.UNIT_STARTS_SPELLCAST(s,t));
        game.UNIT_FINISH_SPELLCAST.add(() => this.UNIT_FINISH_SPELLCAST());
    }

    private UNIT_STARTS_SPELLCAST(castTime,spellName) {
        /*
        if (event.source != this.castingUnit)
            return;
        */
        this.cast_bar.tint = this.config.castingColor;
        this.spell_name.text = spellName + ' ' + (castTime/1000).toFixed(2) + "s";
        
        this.cast_bar.width = 0;

        if (this.anim.fadeCastBar.isRunning == true) {
            this.anim.fadeCastBar.reverse = true;
        }
        else 
            this.container.alpha = 1;

        var castbar_animation = this.screen.add.tween(this.cast_bar).to({ width: this.width }, castTime, "Linear", true);
         // ### TODO #######
         //  - Draw icon for the spell on the cast bar
         // - Play casting sound?

    }

    private UNIT_STOP_SPELLCAST(event) {
        if (event.source != this.castingUnit)
            return;
        // ### TODO #######
        // - Stop any current casting animation(s)
        // - Start animation: make spellbar red then fade it away
    }

    private UNIT_FINISH_SPELLCAST() {
        this.cast_bar.tint = this.config.castSuccessColor;
        this.anim.fadeCastBar.reverse = false;
        this.anim.fadeCastBar.start();
        
        // ### TODO #######
        // - Play cast sucess sound?
    }
}

//* Future goal: This frame will listen for spells being used by the player and play cool animations based on that spell. Maybe even play spell sounds?
// https://cloudkidstudio.github.io/PixiParticlesEditor/# Could create a particle effect for each spell.

class SpellEffectFrame {

}

class BossTimers { 
    init() {
        // getBossTimingData(boss);
    }
}
/*
// Can't use that yet! spell not ready yet ! :p
class UIErrorsFrame extends Frame {

    error_text: any;

    constructor(h, w, x, y, player, UIParent: Phaser.Group) {
        super(h, w, x, y, UIParent);

        this.error_text = new Phaser.BitmapText(game, 1, 1, game.defaultFont, 'hm', 14);
        
        this.error_text.tint = 0xCC0000;
        this.error_text.height = 14;
        
        this.add(this.error_text);
       
        // Listen for error event
        game.UI_ERROR_MESSAGE.add(  (text) => this.CREATE_ERROR_MESSAGE(text)   );

    }

    CREATE_ERROR_MESSAGE(text) {
        this.error_text.setText(text);
        console.log(this.error_text.width);
        console.log(this.error_text.height);
    }
}
*/
