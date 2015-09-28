
class Player {

        id: number;
        level: number = 100;
        name: string;
        classId: number;
        alive: boolean = true;
        target: Player = this;
        onGlobal: boolean = false;
        isCasting: boolean = false;
        currentCast = null;
        instance: Raid = null; // reference to the raid group the players are in
        spells: any; // spells are added in the class modules
       
        constructor(options) {
            
            this.id = options.id;
            this.level = 100;

            // Create some random data for testing 
            this.name = options.name || util.generatePlayerName();
            this.stats.health = options.health || util.randomNumberFromTo(0, this.getMaxHealth());
            this.classId = options.classid || Math.round(util.randomNumberFromTo(0, 11));
        }

        base_stats = {
            int: 2000,
            agility: 24,
            stamina: 2000,
            hasteRating: 1200,
            masteryRating: 2414,
            critRating: 455,
            dodgeRating: 142,
            spirit: 4555,
            armorRating: 2413,
            maxMana: 300000,
            maxHealth: 440000
        };

        stats = {
            health: 440000,
            mana: 300000,
            absorb: 50000
            
        };

        avoid() {
            //returns dodge, parry, or miss?. Returns false if nothing was avoided.
        }
        
        getAbsorb() {
            return this.stats.absorb;
        }

        hasAbsorb() {
            return true;
        }
        recive_damage(dmg) {
            if (!this.alive)
                return;
            var avoided_damage: boolean = false;

        
            //--- Avoidance ---------------------------------------
            /*
            if ( dmg.isAvoidable ) {

                if ( this.avoid() ) {
                    avoided_damage = true;
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

        
        setHealth(value: number) {
            if (!this.alive) 
                return;
            if (value <= 0) {
                this.stats.health = 0;
                this.alive = false;
                return;
            }
            if (value >= this.base_stats.maxHealth) {
                this.stats.health = this.base_stats.maxHealth;
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
            return this.base_stats.maxHealth;
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