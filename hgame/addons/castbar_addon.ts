namespace Addons {
    export class CastFrame {

        config = {
            castSuccessColor: 0x00FF96,
            castingColor: 0xFF7D0A,
            width: 300,
            height: 30,
            x: 500,
            y: 500
        };

        castingUnit: Player = null;
        cast_timer: Phaser.TimerEvent; // internal timer to be able to show cast progress on bar as text.
        anim: any = {};
        container: Phaser.Group;
        background: Phaser.Graphics;
        cast_bar: Phaser.Graphics;
        texture: Phaser.Sprite;
        spell_name: Phaser.BitmapText;

        state: States.Play;

        constructor(state: States.Play) {

            this.state = state;
            this.castingUnit = this.state.player;
            
            this.config.x = this.state.world.centerX - this.config.width / 2;
            this.config.y = this.state.world.centerY + 200;
            // Parent container
            this.container = this.state.add.group();
            this.container.x = this.config.x;
            this.container.y = this.config.y;
            // Background layer
            this.background = this.state.add.graphics(0, 0);
            this.background.beginFill(0x368975);
            this.background.drawRect(0, 0, this.config.width, this.config.height);
        
            // Cast bar layer
            this.cast_bar = this.state.add.graphics(0, 0);
            this.cast_bar.beginFill(0xFFFFFF);
            this.cast_bar.drawRect(0, 0, this.config.width, this.config.height);
            this.cast_bar.width = 0;
            this.cast_bar.tint = 0xFF7D0A;
        
            // Overlay texture
            this.texture = this.state.add.sprite(0, 0, "castbar_texture2");
            this.texture.width = this.config.width;
            this.texture.height = this.config.height;
            this.texture.blendMode = PIXI.blendModes.MULTIPLY;

            // Name of the spell
            this.spell_name = this.state.add.bitmapText(this.config.width / 2, this.config.height / 2, "myriad", "", 12);
            this.spell_name.anchor.set(0.5);

            this.container.addChild(this.background);
            this.container.addChild(this.cast_bar);
            this.container.addChild(this.texture);
            this.container.addChild(this.spell_name);
        
            // CastBar is hidden by default
            this.container.alpha = 0;

            // Init animations
            this.anim.fadeCastBar = this.state.add.tween(this.container).to({ alpha: 0 }, 1000, "Linear", false);
        
            // Setup event listeners with callback functions
            this.state.events.UNIT_STARTS_SPELLCAST.add((s, t) => this.UNIT_STARTS_SPELLCAST(s, t));
            this.state.events.UNIT_FINISH_SPELLCAST.add(() => this.UNIT_FINISH_SPELLCAST());
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

            this.state.add.tween(this.cast_bar).to({ width: this.config.width }, castTime, "Linear", true);
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
}