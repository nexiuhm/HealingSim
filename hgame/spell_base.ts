//* Base spell class that all spells extends upon //


class SpellBase {
    //### Spell data ###
    onCooldown: boolean = false;
    resourceType: string;
    resourceAmount: number;
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

    constructor(spelldata,player) {
        this.resourceType = spelldata.resourceType;
        this.school = spelldata.school;
        this.name = spelldata.name;
        this.base_casttime = spelldata.casttime;
        this.base_cooldown = spelldata.cooldown;

        this.player = player;

    }

    cost() {
        return 0;

    }
    ready() {
        if (this.onCooldown) {
            return false;
        }

        else {
            return true;
        }
    }
    cast_time() {
        // ### TODO #######
        
        return this.base_casttime * this.player.composite_haste();
    }


    consumeResource()
    {
        if (this.cost() <= 0)
            return;
        
        this.player.consume_resource(this.resourceType, this.cost());
    }


    execute()
    {
        this.player.isCasting = false;
        this.onCooldown = true;

        var cd = this.cooldown();
        this.current_cooldown = game.time.events.add(cd, () => this.onCooldownReady());
        this.consumeResource();

    }
    
    onCooldownReady()
    {
        this.onCooldown = false;
        // Callback function that happens when cooldown timer is finished.
    }

    cooldown()
    {
        return this.base_cooldown;
    }
    tick_amount() {
    }

    tick() {
    }


    can_use(): boolean {
        /*
        if (this.resourceType != 'free_spell') {
            if (!this.player.hasResource(this.resourceType, this.resourceAmount))
                return false;
        }
        */
        return true;
    }
    cast()
    {   
        // Set source and target
        this.player.isCasting = true;
        this.target = this.player.target;

        // Check if there are any rules that makes the spell unable to be used.
        if (!this.can_use())
            return;

        // Calculate the cast time, based on caster current haste etc.
        var ct = this.cast_time();


        // ### TODO: Need to be able to handle channeled spells ###
        // If there is no cast time, just execute the spell right away
        if (ct == 0) {
            this.execute();
        }
        else {
            // Start cast timer, with cast_finished as callback
            this.current_cast = game.time.events.add(ct, () => this.cast_finished());
            this.onCooldown = true;

            // Send a signal/event that a spell is starting its cast.
            game.UNIT_STARTS_SPELLCAST.dispatch(ct, this.name);
        }
    }
    cast_finished()
    {
        game.UNIT_FINISH_SPELLCAST.dispatch();
        this.execute();
    }

    cancel_cast()
    {
    
        game.time.events.remove(this.current_cast);
      
    }

}
