
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
    private _width:number = 200;
    private _height:number =  20;

    // displayObjects
    private _bar: Phaser.Graphics;
    private _texture: Phaser.Sprite;
    //
    private _minValue = 0;
    private _maxValue = 1;
    private _currentValue = 1;
     
    constructor(parent:Phaser.Group) {
       

        this._bar = new Phaser.Graphics(game, 400, 400);
        this._bar.beginFill(0x00cc00);
        this._bar.drawRect(0, 0, this._width, this._height);
        this._bar.endFill();
        
        parent.addChild(this._bar);

        this._texture = new Phaser.Sprite(game, 0, 0, "castbar_texture");
        this._texture.width = this._width;
        this._texture.height = this._height;
        this._texture.blendMode = PIXI.blendModes.MULTIPLY;

        this._bar.addChild(this._texture);

        this._updateBarWidth();

    };

    private _updateBarWidth() {
        if (this._currentValue <= this._minValue) {
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
        // 
    }
    setMaxValue(newMaxValue: number) {
        this._maxValue = newMaxValue;
        this._updateBarWidth();
    }

    setValue(newValue:number) {
        this._currentValue = newValue;
            
        this._updateBarWidth();
       
    }
}
/*
class UnitFrame {
    constructor(parentContainer, x, y, w, h, unit: Player, playState: States.Play) {
    }
}
*/
class UnitFrame {
    //options
    unit: Player;
    config = {
        allowedAbsorbOverflow: 10
    };

    // Atonomy of the unit frame
    healthBar: StatusBar;
    absorbBar: StatusBar;
    powerBar: StatusBar;
    unit_name: Phaser.BitmapText;
    health_text: Phaser.BitmapText;
    container;

    constructor(parentContainer,x, y, w, h, unit: Player) {
        return;
        // Reference to the player object we are representing.
        this.unit = unit;

        //  - Create container for the UnitFrame, all the other stuff is added as children of this element.
        this.container = new Phaser.Group(game); // Should be frame
        // Create the healthbar
                                      // Parent //
        this.healthBar = new StatusBar(this.container);
                        
        // Create absorb indicator
        this.absorbBar = new StatusBar(this.container);

        // Manabar, rage , energy
        this.powerBar = new StatusBar(this.container);
       
        // this.roleIcon = new StatsIcon();
        // Shows if tank healer or dps
    
        // listen for HealthChange
        // listen for MaxHealthChange
        // listen for Death
        // listen for Role Change
    }

    UNIT_HEALTH_CHANGE() {
        this.healthBar.setValue(this.unit.getCurrentHealth());
    }
    UNIT_MAX_HEALTH_CHANGED() {
        this.healthBar.setMaxValue(this.unit.getMaxHealth());
    }
    UNIT_MANA_CHANGE() {
    }
    UNIT_ROLE_CHANGED() {
    }

    UNIT_DEATH(evt) {
        if (evt.unit != this.unit)
            return;
       
    }

}
/* ## TODO ## Make this more general */
class StatusIcon {
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