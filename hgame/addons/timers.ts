namespace Addons {
    export class BigWigs {

        constructor(api) {

            // Container for the timer bars
            var _bars = {};
            var timerTestData = { ability: "Heavy Aoe", repeats: true, time: 30000 };

            var timerFrame = new Frame(api.UIParent);
            timerFrame.setPos(1200, 900);

            // When timers reach a certain time left, they are move to the emphasized frame.
            var bigTimerFrame = new Frame(api.UIParent);


            // When timers are finished they will destroy themselves and respawn if the "repeats" property is set to true;
            var timer = new StatusBar(timerFrame, 200, 25);
                timer.setValues(0, 1, 0);
                timer.setValue(0, 30000);
                timer.setColor(0xFF5E14);
            var ability_name = new Phaser.BitmapText(game, 5, 5, "myriad", timerTestData.ability,14);
            timer.addChild(ability_name);

             /* ## Todo ## make this kind of functionalty so addons can hook some script to the game loop.
                timer.setScript("OnLoop", function () {          
                    if (bar.timeLeft < config.emphasizedTime)
                        // move bar to BigTimerFrame
            }); */
            
               //## Called when a timerbar is removed or added.
              function rearrangeBars() {
                  // loop through all "timers" and rearrange to anchor.
              };

        }
    }
}