class Raid {
    players: Array<Player>
    events;

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
}

