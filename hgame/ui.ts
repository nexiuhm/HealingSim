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