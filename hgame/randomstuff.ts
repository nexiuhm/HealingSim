/* Some random work-in-progress stuff

// Stuff made here will probably fit in other files with normal names ;)

/*
// ######## Test ability ######################################################################
var container = this.add.graphics(500, 500);
container.width = -150;
container.height = -150;
container.alpha = 1;

container.addChild(this.add.bitmapText(250, 200, "myriad", "Keep the tank alive....Good luck (its a dk, huhuh)", 14));

container.addChild(this.add.bitmapText(250, 350, "myriad", "Press 'ONE' for Flash Heal. Press 'TWO' for Shield", 14));
// Ability icon
var ab2 = this.add.image(0, 0, "pws");
ab2.width = 50;
ab2.height = 50;

// Alpha mask for cooldown overlay
var mask = this.add.graphics(0, 0);
mask.beginFill(0xFFFFFF);
mask.drawRect(0, 0, 50, 50);
        
// Cooldown overlay arc
this.cd_overlay = this.add.graphics(0, 0);
this.cd_overlay.beginFill(0x323232);

this.cd_overlay.alpha = 0.7;
this.cd_overlay.mask = mask;
this.cd_overlay.blendMode = PIXI.blendModes.MULTIPLY;

this.tweensr = this.add.tween(this.angle).to({ max: 270 }, 4000, "Linear", false);
var complete = new Phaser.Signal();

complete.add(() => onSpellReady(this));
this.tweensr.onComplete = complete;

// spellflash 
var flash = this.add.sprite(25, 25, "spell_flash");
flash.width = 80;
flash.height = 80;
flash.alpha = 0;
flash.anchor.set(0.5);
flash.blendMode = PIXI.blendModes.ADD;
function onSpellReady(that) {
    console.log(that);
    that.cd_overlay.clear();
    that.angle.max = -90;
    that.cd_overlay.arc(25, 25, 40, Phaser.Math.degToRad(0), Phaser.Math.degToRad(that.angle.max), true);
    //var tvn = that.add.tween(flash).to({ alpha: 1 }, 700, Phaser.Easing.Bounce.InOut, true, undefined,-1);
}




container.addChild(ab2);
container.addChild(this.cd_overlay);
container.addChild(mask);
container.addChild(flash);
       // ############################################################################################
*/