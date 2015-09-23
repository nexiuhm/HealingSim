var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path='../player.ts' />
///<reference path='../spell_base.ts' />
var Priest;
(function (Priest_1) {
    var Priest = (function (_super) {
        __extends(Priest, _super);
        function Priest(playerData) {
            _super.call(this, playerData);
            this.spells = {
                power_word_shield: new power_word_shield(this),
                flash_of_light: new flash_of_light(this),
                clarity_of_will: new clarity_of_will(this)
            };
        }
        return Priest;
    })(Player);
    Priest_1.Priest = Priest;
    var flash_of_light = (function (_super) {
        __extends(flash_of_light, _super);
        function flash_of_light(player) {
            _super.call(this, data.getSpellData('flash_of_light'), player);
        }
        flash_of_light.prototype.cast_time = function () {
            var ct = _super.prototype.cast_time.call(this);
            if (this.target.hasAura("tidal_waves")) {
                ct *= 2;
            }
            return ct;
        };
        flash_of_light.prototype.execute = function () {
            _super.prototype.execute.call(this);
            var crit = game.rnd.between(1, 2);
            this.target.setHealth(this.target.stats.health + 110000 * crit);
        };
        return flash_of_light;
    })(SpellBase);
    var power_word_shield = (function (_super) {
        __extends(power_word_shield, _super);
        function power_word_shield(player) {
            _super.call(this, data.getSpellData('power_word_shield'), player);
        }
        power_word_shield.prototype.can_use = function () {
            if (this.target.hasAura("weakened_soul"))
                return false;
            return true;
        };
        power_word_shield.prototype.execute = function () {
            _super.prototype.execute.call(this);
            var crit = game.rnd.between(1, 2);
            this.target.setAbsorb(90000 * crit);
        };
        return power_word_shield;
    })(SpellBase);
    var clarity_of_will = (function (_super) {
        __extends(clarity_of_will, _super);
        function clarity_of_will(player) {
            _super.call(this, data.getSpellData('clarity_of_will'), player);
        }
        clarity_of_will.prototype.execute = function () {
            _super.prototype.execute.call(this);
            var crit = game.rnd.between(1, 2);
            this.target.setAbsorb(110000 * crit);
        };
        return clarity_of_will;
    })(SpellBase);
})(Priest || (Priest = {}));
