/* Reads WoW combatlog and puts the data into a javascript-object for easy access. */
/* Not really used by the game atm, but could be cool thing to expand upon later */

module cl_parser {
    
    export function parse(rawCombatLog) {
        if (!rawCombatLog || typeof rawCombatLog != 'string') {
            return;
        }
        //---- Make an array where each element is a line in the combatlog. ---------------------------------
        var combatlog = rawCombatLog.split('\n'),
            //---- Get the log start time from the first line of the combatlog array ----------------------
            logStartTime = _HHMMSStoMS(combatlog[0].slice(6, 17)),
            currentLine,
            evt_data,
            event_obj,
            parsedCombatLog = [],
            line;
        //--- Cycle through every element in the combatlog array, and save the data to an object ----------s
        for (line in combatlog) {
            currentLine = combatlog[line];
            evt_data = currentLine.slice(20).split(',');
            event_obj = {
                id: line,
                timestamp: _HHMMSStoMS(currentLine.slice(6, 17)) - logStartTime, // time since log start
                type: evt_data[0],
                source_id: evt_data[1],
                source_name: evt_data[2],
                dest_id: evt_data[5],
                dest_name: evt_data[6],
                spell_school: _schoolNameFromId(+evt_data[8]),
                amount: +evt_data[21] || 0,
                data: evt_data
            };
            parsedCombatLog.push(event_obj);

        }

        console.log("Parsing complete without error! ( " + combatlog.length + " lines total )");

        //--- Return the finished array of event objects. -------------------------------------------------
        return parsedCombatLog;
    }

    // Converts HH:MM:SS timeformat to milliseconds.
    function _HHMMSStoMS(HHMMSS) {
        var arr = HHMMSS.split(':');
        return arr[0] * 60000 * 60000 + arr[1] * 60000 + arr[2] * 1000;
    }

    function filter() {
    }

    function validate() {
    }

    function _schoolNameFromId(schoolId) {
        switch (schoolId) {
            case 0x0: return 'Physical'; // ?
            case 0x1: return 'Physical'; // ?
            case 0x2: return 'Holy';
            case 0x3: return 'Holystrike';
            case 0x4: return 'Holy';
            case 0x5: return 'Flamestrike';
            case 0x6: return 'Holyfire';
            case 0x8: return 'Nature';
            case 0x9: return 'Stormstrike';
            case 0xA: return 'Holystorm';
            case 0xB: return 'Firestorm';
            case 0xC: return 'Firestorm';
            case 0x11: return 'Froststrike';
        }
    }
}