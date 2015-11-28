class Raid {
    players = [];
    events;
    deathCounter: number;

    constructor(eventManager: EventManager) {
        this.events = eventManager;
    }

    getPlayerList(): any {
        return this.players;
    }


    generateTestPlayers() {
        var playersToBeCreated = 20;
        while (--playersToBeCreated) {
            var classs = game.rnd.between(player_class.MIN, player_class.MAX),
                race = game.rnd.between(player_race.MIN, player_race.MAX),
                level = 100,
                name = data.generatePlayerName();

            var unit = this.createUnit(classs, race, level, name);
            this.addPlayer(unit);
        }
    }

    addPlayer(unit: Player) {
        this.players.push(unit);
    }
    // Make a function who will only make a valid raid: 2 tanks, 3 healer and 5 dps for 10 man template
    // Extend to 25 man
    // When you create a unit you also have to pass them a reference to the event manager, so they know how to communicate events.
    createUnit(classs, race, level, name) { 

        // Check if a valid "level" is chosen;
        if (level < player_level.MIN || level > player_level.MAX)
            level = player_level.DEFAULT;
        else
            level = level;

        switch (classs) {
            case class_e.PRIEST:
                return new Priest.Priest(race, level, name, this.events);
                break;

            default:
                return new Player(classs, race, level, name, this.events);
                break;

        }

    }

    startTestDamage() {
        var tank = this.players[2];

        // --- Create some random damage for testing purposes ----
        var createSomeRandomDamage = setInterval(randomDamage.bind(this), 3600);
        var createSomeRandomDamage2 = setInterval(randomDamage2.bind(this), 1560);
        var createSomeRandomDamage3 = setInterval(applyAbsorb.bind(this), 1960);
        var testAoeDamage = setInterval(aoeDamage.bind(this), 1960);
        var testAoeHealing = setInterval(aoeHealing.bind(this), 2500);
        function randomDamage2() {
            var random = game.rnd.between(0, this.players.length);
            this.players[random].recive_damage({ amount: game.rnd.between(100000, 250000) });
        }

        function randomDamage() {
            tank.recive_damage({ amount: game.rnd.between(15555, 338900) });
        }
        
        function aoeDamage() {
            var i = game.rnd.between(0, this.players.length);
            for (; i < this.players.length; i++) {
                var player = this.players[i];
                player.recive_damage({ amount: game.rnd.between(25555, 68900) })

            }
        }

        function aoeHealing() {
            for (var i = 0; i < this.players.length; i++) {
                var player = this.players[i];
                player.setHealth(player.getCurrentHealth() + game.rnd.between(15000, 78900));

            }
        }

        function applyAbsorb() {
            //this.player.setAbsorb(game.rnd.between(115, 88900));
            tank.setHealth(tank.getCurrentHealth() + game.rnd.between(10000, 38900));
        }
        // ---------------------------------------------------------
    }


}

