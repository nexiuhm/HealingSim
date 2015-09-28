
class Player {
        // --- Basic unit data ------------
        level: number = 100;
        name: string;
        classId: class_e;
        race: race_e;
        // ----Players current target--------------
        target: Player = this;
        isCasting: boolean = false;
        alive: boolean = true;
        instance: Raid = null; // reference to the raid group the players are in
        // --- Players spells ---------------------
        spells: any; 
        base_stats = {
            strenght: 2000,
            agility: 24,
            stamina: 0,
            intellect: 0,
            spirit: 0
        };

        stats = {
            health: 440000,
            mana: 300000,
            absorb: 50000,
            maxHealth: 440000

        };
        constructor( _class:class_e, race:race_e, level, name:string) {
        
            this.level = level;
            this.race = race;
            this.name = name;
            this.classId = _class;

            this.init_base_stats();
           
           
        }

        init_base_stats() {
            /* This is the stats someone would have 0 gear */
            this.base_stats.agility =   data.classBaseStats(this.classId, this.level, stat_e.AGILITY) + data.raceBaseStats(this.race, stat_e.AGILITY); // + race base
            this.base_stats.stamina =   data.classBaseStats(this.classId, this.level, stat_e.STAMINA) + data.raceBaseStats(this.race, stat_e.STAMINA); // + race base
            this.base_stats.intellect = data.classBaseStats(this.classId, this.level, stat_e.INTELLECT) + data.raceBaseStats(this.race, stat_e.INTELLECT);
            this.base_stats.spirit =    data.classBaseStats(this.classId, this.level, stat_e.SPIRIT) + data.raceBaseStats(this.race, stat_e.SPIRIT);
            this.base_stats.strenght = data.classBaseStats(this.classId, this.level, stat_e.STRENGHT) + data.raceBaseStats(this.race, stat_e.STRENGHT);

            // *TODO* add stats from gear

        }

        init_stats() {
            /* ### TODO ###
            - This will calculate the current stats. 
                 stat * scaling = current stat
                 stamina * health_per_stamina = health; etc
            */
        }

        avoid() {
            //returns dodge, parry, or miss?. Returns false if nothing was avoided.
        }
        
     


        recive_damage(dmg) {
            if (!this.alive)
                return;
            var avoided_damage: boolean = false;

        
            //--- Avoidance ---------------------------------------
            /*
            if ( dmg.isAvoidable ) {

                if ( this.avoid() ) {
                    avoided_damage = true; // Note: Only warriors and paladins have block
                }
            }
            */
            //--- Resistance and absorb ---------------------------

            if ( !avoided_damage ) {

                //dmg.amount *= this.getResistancePercent('PHYSICAL');
                
                // Full absorb
                if (this.stats.absorb > dmg.amount) {
                    this.stats.absorb -= dmg.amount;
                    game.UNIT_ABSORB.dispatch(this);
                    return;
                }
                // Partial absorb
                if (this.stats.absorb > 0) {
                    dmg.amount -= this.stats.absorb;
                    this.stats.absorb = 0;
                    game.UNIT_ABSORB.dispatch(this);
                }
               

                this.setHealth(this.stats.health - dmg.amount);
                game.UNIT_HEALTH_CHANGE.dispatch(this);

            }
        }


        cast_spell(spellName: string) {

            // ## Find spell ####
            if (!this.spells[spellName])
                return;
            var spell = this.spells[spellName];
            // ##################
            if (this.isCasting) {
    
                game.UI_ERROR_MESSAGE.dispatch("Can't do that yet");        
            }
         
            else
                spell.use();
        }


        hasAura(aura:String) {
            return false;
        }
        resistance(dmg): number {
            return 0;

        }


        die() {
            this.alive = false;
            //## TODO ## 
            // - Remove all auras that doesnt presist through death.
            // - Other stuff that needs to happen when you die.

        }

        getAbsorb() {
            return this.stats.absorb;
        }s
        setHealth(value: number) {
            if (!this.alive) 
                return;
            if (value <= 0) {
                this.stats.health = 0;
                this.alive = false;
                return;
            }
            if (value >= this.getMaxHealth()) {
                this.stats.health = this.getMaxHealth();
            }
            else {
                this.stats.health = value;
            }

            game.UNIT_HEALTH_CHANGE.dispatch(this);
            // ## TODO ##
            // - Make sure it doesnt exceed maximum possible health
            // - Handle overhealing here? or somewhere else
            
        }

        setAbsorb(value: number) {
            if (value <= 0)
                return;
            
            this.stats.absorb += value;
            

            game.UNIT_ABSORB.dispatch(this);
            
            // ## TODO ##
            // - Handle overhealing here? or somewhere else
            
        }

        getMaxHealth() {
            return this.stats.maxHealth;
        }

        getCurrentHealth() {
            return this.stats.health;
        }

        setTarget(unit: Player) {
            // Just dont bother if its the same target
            if (unit == this.target) {
                return;
            }

            // Set target & emitt event 
            this.target = unit;
            game.TARGET_CHANGE_EVENT.dispatch();
        }
        
        consume_resource(resource,amount) {
        }


        // ## TODO ## Calculates the total haste amount on the player. Base stats + buffs + auras
        total_haste() {
            // 1.5 = 150% haste and so on
            return 1;
        }

        // Needed for some spells. Chain heal comes to mind
        findMostInjuredPlayers(players: number): Array<Player> {
        
            var playersInRange = this.instance.getPlayerList();
            var lowestPlayers = playersInRange.sort(
                function sortByDamageTakenAscending(player, otherPlayer) {
                    if (player.getHealthPercent() < otherPlayer.getHealthPercent()) {
                        return -1;
                    } else if (player.getHealthPercent() > otherPlayer.getHealthPercent()) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
                );
            return lowestPlayers.slice(0,players);
        }


 }