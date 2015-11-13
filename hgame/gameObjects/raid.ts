class Raid {
    players: Array<Player>
    events;
    deathCounter: number;

    constructor(eventManager: EventManager) {
        this.events = eventManager;
    }

    getPlayerList():any {   
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

        }

    }

    startTestDamage(playerToBeDamaged: Player) {
        var player = playerToBeDamaged;

        // --- Create some random damage for testing purposes ----
        var createSomeRandomDamage = setInterval(randomDamage.bind(this), 3600);
        var createSomeRandomDamage2 = setInterval(randomDamage2.bind(this), 1160);
        var createSomeRandomDamage3 = setInterval(applyAbsorb.bind(this), 1960);
        function randomDamage2() {
            player.recive_damage({ amount: game.rnd.between(11, 128900) });
        }

        function randomDamage() {
            player.recive_damage({ amount: game.rnd.between(215555, 338900) });
        }

        function applyAbsorb() {
            //this.player.setAbsorb(game.rnd.between(115, 88900));
            player.setHealth(player.getCurrentHealth() + game.rnd.between(20000, 88900));
        }
        // ---------------------------------------------------------
    }


}

