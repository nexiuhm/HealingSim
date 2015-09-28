﻿///<reference path='../player.ts' />
///<reference path='../spell_base.ts' />
namespace Priest {

    export class Priest extends Player {
        constructor(playerData) {
            super(playerData);

        }

        spells = {
            power_word_shield:  new power_word_shield(this),
            flash_of_light:     new flash_of_light(this),
            clarity_of_will:    new clarity_of_will(this)
        }

        
    }

    



    // ### SPELLS #########################

    class flash_of_light extends SpellBase {

        constructor(player:Player) {
            super(data.getSpellData('flash_of_light'), player);
        }

        cast_time() {
            var ct = super.cast_time();

            //#### Cast time incresed by 200% if Shaman has Tidal Waves buff #### //
            if (this.target.hasAura("tidal_waves")) {
                ct *= 2;
            }
            return ct;
        }

        execute() {
            super.execute();
            //this.target.consumeAura("tidal_waves", 1); 
            var crit = game.rnd.between(1, 2);
            this.target.setHealth(this.target.stats.health + 110000 * crit);
        }



    }

    class power_word_shield extends SpellBase {
        constructor(player) {
            super(data.getSpellData('power_word_shield'), player);
        }

        can_use() {
          
            // Can't use shield if target has 'Weakened Soul' debuff
            if (this.target.hasAura("weakened_soul"))
                return false;
            else 
            return super.can_use();
            
        }

        execute() {
            super.execute();
            var crit = game.rnd.between(1, 2);
            this.target.setAbsorb(90000 * crit);

        }



}

    class clarity_of_will extends SpellBase {
        constructor(player) {
            super(data.getSpellData('clarity_of_will'), player);
        }



        execute() {
            super.execute();
            var crit = game.rnd.between(1, 2);
            this.target.setAbsorb(110000 * crit);

        }



}

}
/*

           
              .,-:;//;:=,
          . :H@@@MM@M#H/.,+%;,
       ,/X+ +M@@M@MM%=,-%HMMM@X/,
     -+@MM; $M@@MH+-,;XMMMM@MMMM@+-
    ;@M@@M- XM@X;. -+XXXXXHHH@M@M#@/.
  ,%MM@@MH ,@%=             .---=-=:=,.
  =@#@@@MX.,                -%HX$$%%%:;
 =-./@M@M$                   .;@MMMM@MM:
 X@/ -$MM/                    . +MM@@@M$
,@M@H: :@:                    . =X#@@@@-
,@@@MMX, .                    /H- ;@M@M=
.H@@@@M@+,                    %MM+..%#$.
 /MMMM@MMH/.                  XM@MH; =;
  /%+%$XHH@$=              , .H@@@@MX,
   .=--------.           -%H.,@@@@@MX,
   .%MM@@@HHHXX$$$%+- .:$MMX =M@@MM%.
     =XMMM@MM@MM#H;,-+HMM@M+ /MMMX=
       =%@M@M#@$-.=$@MM@@@M; %M%=
         ,:+$+-,/H#MMMMMMM@= =,
               =++%%%%+/:-.


*/