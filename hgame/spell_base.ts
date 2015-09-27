//* Base spell class that all spells extends upon //

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
        this.powerType = spelldata.resourceType;
        this.school = spelldata.school;
        this.name = spelldata.name;
        this.base_casttime = spelldata.casttime;
        this.base_cooldown = spelldata.cooldown;
        this.player = player;

        if (this.base_cooldown > 0)
            this.hasCooldown = true;

        if (this.powerCost > 0)
            this.hasPowerCost = true;

        if (this.base_casttime == 0)
            this.isInstant = true;

    }



    cast() {
        this.player.isCasting = true;
        // Save the target beeing casted on
        this.target = this.player.target;

        // Check if there are any rules that makes the spell unable to be used.
        if (!this.can_use())
            return;
    
        // If there is no cast time, just execute the spell right away
        if (this.isInstant)
            this.execute();
        else
            this.start_casting();

    }

    execute() {
        this.player.isCasting = false;

        this.consumeResource();

        if (this.hasCooldown) {
            this.onCooldown = true;
            // Get the cooldown
            var cd = this.cooldown();
            // Start the timer with callback
            this.current_cooldown = game.time.events.add(cd, () => this.onCooldownReady());
        }


    }

    can_use(): boolean {
        if (this.hasPowerCost) {
            // TODO: Check if player has the requried resources to use spell.
        }
        if (this.onCooldown)
            return false


        return true;
    }



    start_casting() {
        // ### TODO: Need to be able to handle channeled spells ###
        var ct = this.cast_time();
        this.current_cast = game.time.events.add(ct, () => this.cast_finished());

        // Send a signal/event that a spell is starting its cast.
        game.UNIT_STARTS_SPELLCAST.dispatch(ct, this.name);
    }



    cost() {
        return this.powerCost;

    }
   
    cast_time() {
        // ### TODO #######
        
        return this.base_casttime * this.player.total_haste();
    }


    consumeResource() {
        if (!this.hasPowerCost)
            return;

        this.player.consume_resource(this.powerType, this.powerCost);
    }




    onCooldownReady() {
        this.onCooldown = false;
    }

    cooldown() {
        return this.base_cooldown;
    }
   

    cast_finished() {
        game.UNIT_FINISH_SPELLCAST.dispatch();
        this.execute();
    }



    cancel_cast() {

        game.time.events.remove(this.current_cast);

    }

}

