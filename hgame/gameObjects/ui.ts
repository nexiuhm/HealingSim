
// ### Major todo: Clean up & refactoring ###
/*----  Unit frame to contain basic unit info. -------------- */ 
/*      In it most basic form it will only display a healthbar.  */
/*      This should be the first thing to be implemented (Used for target/ player frame + raid frames )  */


class Frame {
    width = 200;
    height = 100;
    x = 200;
    y = 200;
    interactionEnabled = true;
    playState: States.Play;
    // Main container
    displayObjectContainer: Phaser.Group;
    // Interaction / input overlay
    interactionLayer: Phaser.Sprite;

    constructor(x?, y?, w?, h?){
        this.displayObjectContainer = new Phaser.Group(game);
        this.interactionLayer = new Phaser.Sprite(game, 0, 0);

        // Set default pos
        this.displayObjectContainer.x = this.x;
        this.displayObjectContainer.y = this.y;

        this.interactionLayer.width = this.width;
        this.interactionLayer.height = this.height;

        this.displayObjectContainer.add(this.interactionLayer);
        
    }

    enableInteraction() {
        this.interactionLayer.inputEnabled = true;
    }

    setSize(width,height) {

    };

    addChild() {
    };

    hide() {
    };

    setPos(x, y) {
    };

}



class StatusBar  {
    // defaults
    private _animationStyle = Phaser.Easing.Linear;
    private _animationDuration = 200;
    private _width:number = 100;
    private _height:number =  50;

    // displayObject
    private _bar: Phaser.Graphics;

    //
    private _minValue;
    private _maxValue;
    private _currentValue: number;
     
    constructor( maxValue: number) {
        this._minValue = 0;
        this._maxValue = maxValue;
        this._currentValue = maxValue;

        this._bar = new Phaser.Graphics(game, 0, 0);

    };

    private _updateBarWidth() {
        if (this._currentValue >= this._minValue) {
            this._bar.alpha = 0;
        }
        else {
            this._bar.alpha = 1;
            var barWidthInPixels = Math.round((this._currentValue / this._maxValue) * this._width);
            this._bar.width = barWidthInPixels;
        }
    }

    /* Public interface below */

    setColor(color) {
        this._bar.tint = color;
        
    }

    setMinMaxValues(){
    }

    setTexture() {
        // Create the texture layer
        /*
        this.overlay_texture = new Phaser.Sprite(game, 0, 0, "castbar_texture");
        this.overlay_texture.blendMode = PIXI.blendModes.MULTIPLY;
        this.overlay_texture.width = w;
        this.overlay_texture.height = h;
        */
    }
    setMaxValue(newMaxValue:number) {
        this._updateBarWidth();
    }

    setValue(newValue:number) {
        if (newValue > this._maxValue)
            newValue = this._maxValue;
        this._updateBarWidth();
       
    }
}
class UnitFrame {
    constructor(parentContainer, x, y, w, h, unit: Player, playState: States.Play) {
    }
}
/* ## Major todo ##
class UnitFrame {
    //options
    unit: Player;
    width: number;
    height: number;
    x: number;
    y: number;
    config = {
        allowedAbsorbOverflow: 10
    };
    container;
    state: States.Play;

    // Atonomy of the unit frame
    healthBar: StatusBar;
    absorbBar: StatusBar;
    powerBar: StatusBar;
    unit_name: Phaser.BitmapText;
    health_text: Phaser.BitmapText;

    constructor(parentContainer,x, y, w, h, unit: Player, playState: States.Play) {
 
        // Reference to the player object we are representing.
        this.unit = unit;

        //  - Create container for the UnitFrame, all the other stuff is added as children of this element.
        this.container = new Frame()
            .setSize(width, height);
        this.container.enableInteraction();
        
        // Create the healthbar layer
        this.health = new StatusBar();
                        .setTexture
        // Create absorb layer
        this.absorb = new StatusBar();
        this.absorb.blendMode = PIXI.blendModes.ADD;
        this.absorb.alpha = 0.5;

       

        // Create the player name layer
        this.unit_name = this.state.add.bitmapText(w / 2, h / 2,"myriad", this.unit.name, 12);
        this.unit_name.tint = data.getClassColor(this.unit.classId);
        this.unit_name.anchor.set(0.5);
        
    
        // Set up event listeners. ### TODO Need a way to filter out events that is not coming from this unit
        this.state.events.UNIT_HEALTH_CHANGE.add(() => this.UPDATE());
        this.state.events.UNIT_ABSORB.add(() => this.UPDATE());
        this.state.events.UNIT_DEATH.add((evt) => this.UNIT_DEATH(evt));
    }

    UPDATE() {
        
       
    }

    UNIT_MANA_CHANGE(eventData) {
        // animate the change in resource
    }

    UNIT_DEATH(evt) {
        if (evt.unit != this.unit)
            return;
        this.health.width = this.width;
        this.unit_name.setText("DEAD");
        this.health.alpha = 0;
        this.absorb.alpha = 0;
    }

}
*/
class CooldownFrame {
    x = 500;
    y = 500;
    w = 50;
    h = 50;
    spellid;
    playState: States.Play;

    // Display objects
    container: Phaser.Group;
    spellIcon: Phaser.Image;
    texture;
    cd_overlay: Phaser.Graphics;

    // Angle needs to be an object so we can pass it as a reference to the onGameUpdate callback
    angle = {current: 0}; 
    animTween: Phaser.Tween;

    constructor(state: States.Play, spellid, x, y ) {

        this.playState = state;
        this.spellid = spellid; 

        this.container = this.playState.add.group();
        this.container.x = x;
        this.container.y = y;


        // Spell icon
        var spellIcon = this.playState.add.image(0, 0, "icon_" + spellid);
        spellIcon.width = this.w;
        spellIcon.height = this.h;

        // Alpha mask for cooldown overlay
        var mask = this.playState.add.graphics(this.container.x, this.container.y);
        mask.beginFill(0xFFFFFF);
        mask.drawRect(0, 0, this.w, this.h);
        
        // Cooldown overlay arc init
        this.cd_overlay = this.playState.add.graphics(0, 0);
        this.cd_overlay.alpha = 0.8;
        this.cd_overlay.mask = mask;
        this.cd_overlay.blendMode = PIXI.blendModes.MULTIPLY;

        // adding displayObjects to the parent container
        this.container.add(spellIcon);
        this.container.add(this.cd_overlay);

        // listen to cooldown start event
        this.playState.events.ON_COOLDOWN_START.add((e) => this._onCooldownStart(e));
        this.playState.events.ON_COOLDOWN_ENDED.add((e) => this._onCooldownEnded(e));
    }

    private _onCooldownStart(event) {
       
        // The event is fired every time a spell cooldown starts, so we need to check if its the correct spell.
        if (event.spellid != this.spellid)
           return;
        // Create a timer that updates a variable locally.
        this.cd_overlay.alpha = 0.8;
        this.animTween = this.playState.add.tween(this.angle).to({ current: 270 }, event.cooldownLenght,undefined, true);
        // Hook the update cooldown arc to the main loop
        this.playState.events.GAME_LOOP_UPDATE.add(() => this._updateCooldownArc());

    }

    private _onCooldownEnded(event) {
        if (event.spellid != this.spellid)
            return;
        //this.hook.remove();
        // #TODO## Remove hook from game loop
        this.cd_overlay.alpha = 0;
        this.animTween.stop();
        this.angle.current = 0;
        this.cd_overlay.clear();
    
    }

    private _updateCooldownArc() {

        this.cd_overlay.clear();
        this.cd_overlay.beginFill(0x323232);
        this.cd_overlay.arc(25, 25, 50, Phaser.Math.degToRad(270), Phaser.Math.degToRad(this.angle.current), true);
        this.cd_overlay.endFill();
        // clear
        // redraw based on new values
    }

}
/*
class TargetFrame extends UnitFrame {
    ownerUnit: Player;
    constructor(parentContainer,x, y, w, h, unit: Player, state: States.Play) {
        super(parentContainer,x, y, w, h, unit, state);
        this.ownerUnit = this.unit;
        this.unit = this.ownerUnit.target;
        // Subscribe to the target change event. This event is emitted in the Player.setTarget() function
        this.state.events.TARGET_CHANGE_EVENT.add(() => this.UNIT_TARGET_CHANGE());
    }

    UNIT_TARGET_CHANGE() {
          this.unit = this.ownerUnit.target;
          this.initUnitName();
          this.initHealthBar();
          this.initAbsorbBar();
          this.UPDATE();
    }
}
*/