
/* Adding some extra functionality to the Phaser.Group  */

class Frame extends Phaser.Group  {
    _width = 200;
    _height = 100;
    x = 200;
    y = 200;
    interactionEnabled = true;
    // Main container
    _displayObjectContainer: Phaser.Group;
    // Interaction / input overlay
    private _interactionLayer: Phaser.Sprite;
    
    constructor(parent , x?, y?, w?, h?){
        
        super(game,parent);
       

        // Set default pos
 
        this._interactionLayer = new Phaser.Sprite(game, 0, 0);

        this._interactionLayer.width = this.width;
        this._interactionLayer.height = this.height;

        this.addChild(this._interactionLayer);
        
        this._interactionLayer.bringToTop();
        
    }

    addChild(child:PIXI.DisplayObject):PIXI.DisplayObject {
        var childAdded = super.addChild(child)
        this._interactionLayer.width = this.width;
        this._interactionLayer.height = this.height;
        return childAdded;
    }
    
    private _drag() {
        // Capture initial positions when the object is clicked
        var initialMousePos = { x: this.game.input.x, y: this.game.input.y };
        var containerInitialPos = { x: this.x, y: this.y };
        this.alpha = 0.5;
        // Attatch callback to the game main loop. Usure if we should use the event system for this.
        MAINSTATE.events.GAME_LOOP_UPDATE.add(() => {
            this.x = this.game.input.mousePointer.x - initialMousePos.x + containerInitialPos.x;
            this.y = this.game.input.mousePointer.y - initialMousePos.y + containerInitialPos.y;
        });
    }

    /* Public interface below */

    // aka unlock
    enableDrag() {
        this.enableInteraction();
        this._interactionLayer.events.onInputDown.add(() => { this._drag() });
        this._interactionLayer.events.onInputUp.add(() => { MAINSTATE.events.GAME_LOOP_UPDATE.removeAll(); this.alpha = 1;});
    }

    enableInteraction() {
        this._interactionLayer.inputEnabled = true;
        this._interactionLayer.bringToTop();
    }

    setSize(width, height) {
        this._width = width;
        this._height = height;
        this._interactionLayer.width = this._width;
        this._interactionLayer.height = this._height;

    };
  
    hide() {
        this.alpha = 0;
    };

    show() {
        this.alpha = 1;
    };

    setPos(x:number, y:number) {
        this.x = x;
        this.y = y;
    };

}



class StatusBar extends Frame  {
    // defaults
    private _animationStyle = "Linear";
    private _animationDuration = 200;

    
    // displayObjects
    private _bar: PIXI.Graphics;
    private _texture: Phaser.Sprite;
    //
    private _minValue = 0;
    private _maxValue = 1;
    private _currentValue = 1;
     
    constructor(parent:Phaser.Group, width,height) {
       
        super(parent);
        
        this.setPos(0, 0);
        this.setSize(width, height);
        this.enableInteraction();
        
        this._bar = new Phaser.Graphics(game,0,0);
        this._bar.beginFill(0xFFFFFF);
        this._bar.drawRect(0, 0, this._width, this._height);
        this._bar.endFill();
        
        this._texture = new Phaser.Sprite(game, 0, 0, "castbar_texture");
        this._texture.width = this._width;
        this._texture.height = this._height;
        this._texture.blendMode = PIXI.blendModes.MULTIPLY;

        this._bar.addChild(this._texture);
        
        this.addChild(this._bar);

        

        this._updateBarWidth();

    };

    private _updateBarWidth() {
        if (this._currentValue <= this._minValue) {
            this._bar.alpha = 0;
        }
        else {
            this._bar.alpha = 1;
            var barWidthInPixels = Math.round((this._currentValue / this._maxValue) * this._width);
            game.add.tween(this._bar).to({ width: barWidthInPixels }, this._animationDuration, this._animationStyle, true);
            //this._bar.width = barWidthInPixels;
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

class UnitFrame extends Frame {
    //options
    unit: Player;
    config = {
        allowedAbsorbOverflow: 10
    };

    // Atonomy of the unit frame
    healthBar: StatusBar;
    absorbBar: StatusBar;
    powerBar: StatusBar;

    constructor(parent, state:States.Play, unit: Player, width,height) {
        super(parent);
        // Reference to the player object we are representing.
        this.unit = unit;
        this.setSize(width, height);
        //  - Create container for the UnitFrame, all the other stuff is added as children of this element.
        // Create the healthbar
                                      // Parent //
        this.healthBar = new StatusBar(this ,width, height/3*2);
        this.healthBar.setMaxValue( this.unit.getMaxHealth() );
        this.healthBar.setValue(this.unit.getMaxHealth());
        this.healthBar.setColor(data.getClassColor(this.unit.classId));
        // Create absorb indicator
       // this.absorbBar = new StatusBar(this.healthBar, width, height/3);

        this.powerBar = new StatusBar(this,width,height/3);
        this.powerBar.setPos(0, this.healthBar.height);
        this.powerBar.setColor(0x005ce6);

        // this.roleIcon = new StatsIcon();
        // Shows if tank healer or dps
   
        state.events.UNIT_HEALTH_CHANGE.add((e) => this.UNIT_HEALTH_CHANGE(e));
        state.events.UNIT_DEATH.add((e) => this.UNIT_DEATH(e));

    }
    
    UNIT_HEALTH_CHANGE(e) {
        if (e != this.unit)
            return;
        this.healthBar.setValue(this.unit.getCurrentHealth());
        /*
        if (this.unit.healthPercent > 20) { 
            this.healthBar.setColor(red)
        } */
    }
    UNIT_MAX_HEALTH_CHANGED() {
        this.healthBar.setMaxValue(this.unit.getMaxHealth());
    }
    UNIT_MANA_CHANGE() {
    }
    UNIT_ROLE_CHANGED() {
        // set role icon
    }

    

    UNIT_DEATH(evt) {
        if (evt != this.unit)
            return;
        this.healthBar.setValue(0);
        
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