
// game.registerAddon("Cast Frame 1.0", CastFrame);
class CastFrame {

    config = {
        castSuccessColor: 0x00FF96,
        castingColor: 0xFF7D0A,

    }
    castingUnit: Player = null;
    cast_timer: Phaser.TimerEvent; // internal timer to be able to show cast progress on bar as text.
    anim: any = {};
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

    constructor(x, y, w, h, castingUnit: Player, screen: Phaser.State) {

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
        this.cast_bar.drawRect(0, 0, w, h);
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
        game.UNIT_STARTS_SPELLCAST.add((s, t) => this.UNIT_STARTS_SPELLCAST(s, t));
        game.UNIT_FINISH_SPELLCAST.add(() => this.UNIT_FINISH_SPELLCAST());
    }

    private UNIT_STARTS_SPELLCAST(castTime, spellName) {
        /*
        if (event.source != this.castingUnit)
            return;
        */
        this.cast_bar.tint = this.config.castingColor;
        this.spell_name.text = spellName + ' ' + (castTime / 1000).toFixed(2) + "s";

        this.cast_bar.width = 0;

        if (this.anim.fadeCastBar.isRunning == true) {
            this.anim.fadeCastBar.reverse = true;
        }
        else
            this.container.alpha = 1;

        this.screen.add.tween(this.cast_bar).to({ width: this.width }, castTime, "Linear", true);
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