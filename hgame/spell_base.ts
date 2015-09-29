﻿//* Base spell class that all spells extends upon //

class SpellBase {
    //### Spell data ###
    
    powerType: string;
    powerCost: number;
    school: string;
    name: string;
    base_casttime: number;
    base_cooldown: number;
    // #################
    player: Player;
    target: Player;
    //### Timers ######
    current_cast: Phaser.TimerEvent;
    current_cooldown: Phaser.TimerEvent;
    //### Bools ######
    onCooldown: boolean = false;
    hasCooldown = false;
    hasPowerCost = false;
    isInstant = false;

    constructor(spelldata, player) {
        // The player that owns the spell
        this.player = player;

        this.powerType = spelldata.resourceType;
        this.school = spelldata.school;
        this.name = spelldata.name;
        this.base_casttime = spelldata.casttime;
        this.base_cooldown = spelldata.cooldown;

        if (this.base_cooldown > 0)
            this.hasCooldown = true;

        if (this.powerCost > 0)
            this.hasPowerCost = true;

        if (this.base_casttime == 0)
            this.isInstant = true;
    }

    use() {
       
        // Save the target beeing casted on
        this.target = this.player.target;

        // Check if there are any rules that makes the spell unable to be used.
        if (!this.can_use()) {
            return;
        }

        // If no cast time, execute  spell right away
        if (this.isInstant)
            this.execute();
        else
            this.start_casting();

    }

    execute() {
   
        this.consumeResource();

        if (this.hasCooldown)
            this.start_cooldown();
           
    }

    start_casting() {
        this.player.isCasting = true;
        // ### TODO: Need to be able to handle channeled spells ###
        var ct = this.cast_time();
        this.current_cast = game.time.events.add(ct, () => this.cast_finished());

        // Send a signal/event that a spell is starting its cast.
        game.UNIT_STARTS_SPELLCAST.dispatch(ct, this.name);
    }

    start_cooldown() {
        this.onCooldown = true;
        // Get the cooldown
        var cd = this.cooldown();
        // Start the timer with callback
        this.current_cooldown = game.time.events.add(cd, () => this.onCooldownReady());
    }

   can_use():boolean {
        if (this.onCooldown) {
            return false;
        }
        return true;
    }

    cast_finished() {
        this.player.isCasting = false;
        game.UNIT_FINISH_SPELLCAST.dispatch();
        this.execute();
    }

    cast_time() {
        // ### TODO #######
        return this.base_casttime * this.player.total_haste();
    }

    cancel_cast() {
        game.time.events.remove(this.current_cast);
    }

    consumeResource() {
        if (!this.hasPowerCost)
            return;
        this.player.consume_resource(this.powerType, this.powerCost);
    }

    onCooldownReady() {
        console.log("CD READY");
        this.onCooldown = false;
    }

    cooldown() {
        return this.base_cooldown;
    }
    
    cost() {
        return this.powerCost;
    }
}