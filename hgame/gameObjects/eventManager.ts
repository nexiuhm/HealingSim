class EventManager {
   
    // ### TODO ### 
    GAME_LOOP_UPDATE = new Phaser.Signal();
    TARGET_CHANGE_EVENT = new Phaser.Signal();
    UNIT_HEALTH_CHANGE = new Phaser.Signal();
    UNIT_ABSORB = new Phaser.Signal();
    UNIT_STARTS_SPELLCAST = new Phaser.Signal();
    UNIT_FINISH_SPELLCAST = new Phaser.Signal();
    UNIT_CANCEL_SPELLCAST = new Phaser.Signal();
    UI_ERROR_MESSAGE = new Phaser.Signal();
    UNIT_DEATH = new Phaser.Signal();


}