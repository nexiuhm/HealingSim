namespace Addons {
    export class UnitFrames {
        state: States.Play;
        unitFrameHeight = 50;
        unitFrameWidth = 300;
        targetFrameHeight = 50;
        targetFrameWidth = 300;
        interactionLayer: Phaser.Sprite;
        container;
        x;
        y;
        constructor(screen: States.Play) {
            this.state = screen;
            this.container = screen.add.group();
            this.interactionLayer = screen.add.sprite(0, 0,"castbar_texture");
            
            new UnitFrame(this.container,widthFactor*25 - this.unitFrameWidth/2, heightFactor * 75 - this.unitFrameHeight / 2, 300, 50, screen.player, screen);
            //new TargetFrame(this.container,widthFactor * 75 - this.targetFrameWidth/2, heightFactor * 75 - (this.targetFrameHeight / 2), 300, 50, screen.player, screen);
            
            /* ## Below is experimental stuff, will clean up ##*/
            this.interactionLayer.inputEnabled = true;
            this.interactionLayer.width = 300;
            this.interactionLayer.height = 50;
            this.interactionLayer.tint = 0xef342b;
            this.interactionLayer.alpha = 0;
            this.interactionLayer.blendMode = PIXI.blendModes.COLOR_DODGE;
            this.interactionLayer.x = widthFactor * 25 - this.unitFrameWidth / 2;
            this.interactionLayer.y = heightFactor * 75 - this.unitFrameHeight / 2;
            
            this.container.addChild(this.interactionLayer);

            this.interactionLayer.events.onInputDown.add(() => { this.drag() });
            this.interactionLayer.events.onInputUp.add(() => {
                // If (isDragging ) 
                this.state.events.GAME_LOOP_UPDATE.removeAll(); this.interactionLayer.alpha = 0;
            });
        }
        drag() {
            // Capture initial positions when the object is clicked
            var initialMousePos = { x: this.state.input.x, y: this.state.input.y };
            var containerInitialPos = { x: this.container.x, y: this.container.y };
            // Show the interaction layer
            this.interactionLayer.alpha = 0.5;
            // Attatch callback to the game main loop. Usure if we should use the event system for this.
            this.state.events.GAME_LOOP_UPDATE.add(() => {
                this.container.x = this.state.input.mousePointer.x - initialMousePos.x + containerInitialPos.x;
                this.container.y = this.state.input.mousePointer.y - initialMousePos.y + containerInitialPos.y;
            });
        }
    }

  
}