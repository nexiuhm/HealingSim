﻿
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
    config = {
        allowedAbsorbOverflow: 10
    };
    container: Phaser.Graphics;
    state: States.Play;

    // Atonomy of the unit frame
    health: Phaser.Graphics;
    absorb: Phaser.Graphics;
    background: Phaser.Graphics;
    overlay_texture: Phaser.Sprite;
    unit_name: Phaser.BitmapText;
    health_text: Phaser.BitmapText;

    constructor(parentContainer,x, y, w, h, unit: Player, playState: States.Play) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        
        
        // Reference to the player object we are representing.
        this.unit = unit;
        // Reference to the state we are going to draw to ( This feels like a weird way to do it, improve later)
        this.state = playState;

        //  - Create container for the UnitFrame, all the other stuff is added as children of this element.
        this.container = new Phaser.Graphics(game,x, y);
        this.container.width = w;
        this.container.height = h; 
        
        // Create the healthbar layer
        this.health = new Phaser.Graphics(game,0, 0);
        // Create absorb layer
        this.absorb = new Phaser.Graphics(game,0, 0);
        
        this.absorb.blendMode = PIXI.blendModes.ADD;
        this.absorb.alpha = 0.5;

        // Create the texture layer
        this.overlay_texture = new Phaser.Sprite(game,0, 0, "castbar_texture");
        this.overlay_texture.blendMode = PIXI.blendModes.MULTIPLY;
        this.overlay_texture.width = w;
        this.overlay_texture.height = h;

        // Create the player name layer
        this.unit_name = this.state.add.bitmapText(w / 2, h / 2,"myriad", this.unit.name, 12);
        this.unit_name.tint = data.getClassColor(this.unit.classId);
        this.unit_name.anchor.set(0.5);
       
        // Add the layers as children of the container
        this.container.addChild(this.health);
        this.container.addChild(this.overlay_texture);
        this.container.addChild(this.absorb);
        this.container.addChild(this.unit_name);

        parentContainer.add(this.container);
       

        // Add interaction
        this.container.inputEnabled = true;
        
        this.container.events.onInputDown.add(() => {
            this.state.player.setTarget(this.unit );
        });
        
        //Scale the health bar to represent the player's health.
        this.initHealthBar();
        this.initAbsorbBar();
        this.UPDATE();
        
        // Set up event listeners. ### TODO Need a way to filter out events that is not coming from this unit
        this.state.events.UNIT_HEALTH_CHANGE.add(() => this.UPDATE());
        this.state.events.UNIT_ABSORB.add(() => this.UPDATE());
        this.state.events.UNIT_DEATH.add(() => this.UNIT_DEATH());
    }

    UPDATE() {

        var new_health_width = this.calcBarWidth(this.unit.getCurrentHealth(), this.unit.getMaxHealth());
        var new_absorb_width = this.calcBarWidth(this.unit.getAbsorb(), this.unit.getMaxHealth());
        // Need to update the x value of the absorb everytime the health "moves"
        var new_absorb_x = new_health_width;
        
        // Some weird stuff happens if the width of a displayObject is set to 0? Fucks up targetting. No idea why
        // This fixes it for now

        /* Make sure the absorb never overflows the bar width */
        if ((new_absorb_width + new_health_width) > this.width)
            new_absorb_width = this.width - new_health_width + this.config.allowedAbsorbOverflow;

        if (new_health_width <= 0)
            new_health_width = 1;
        if (new_absorb_width <= 0)
            new_absorb_width = 1;
        
        // ugly
        this.state.add.tween(this.health).to({ width: new_health_width }, 150, "Linear", true);
        this.state.add.tween(this.absorb).to({ x: new_absorb_x }, 150, "Linear", true);
        this.state.add.tween(this.absorb).to({ width: new_absorb_width }, 50, "Linear", true);
    }

    UNIT_MANA_CHANGE(eventData) {
        // animate the change in resource
    }

    UNIT_DEATH() {

        this.health.width = this.width;
        this.unit_name.setText("DEAD");
        this.health.alpha = 0;
        this.absorb.alpha = 0;
    }

    calcBarWidth(currentValue, maxValue): number {
        var barWidthInPixels = Math.round((currentValue / maxValue ) * this.width);
        return barWidthInPixels;
    }
 
    initUnitName() {
        this.unit_name.setText(this.unit.name);
        this.unit_name.tint = data.getClassColor(this.unit.classId);
    }

    initHealthBar() { // Its not possible to change the color of the health bar. It needs to be redrawn from scratch.
        this.health.clear();
        this.health.beginFill(data.getClassColor(this.unit.classId));
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