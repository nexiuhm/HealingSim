module data {


    // ## TODO ## import character data from armory
    function getArmoryData(name: string = 'Blome', realm: string = 'the-maelstrom') {
        //validate realm
        //validate name
        var blizz_api_url = "https://eu.api.battle.net";
        var api_key = 'fhmzgc7qd2ypwdg87t2j8nuv6pxcbftb'; // risky to have it here ? :p

        var data = $.getJSON(blizz_api_url + '/wow/character/' + realm + '/' + name + '?fields=stats&locale=en_GB&apikey=' + api_key);

        game.dbg(data);
    }


    /* Future goal:  grab spelldata from simcraft files.  */
    export function getSpellData(spell) {
        var spelldata = {

            flash_of_light: {
                casttime: 1350,
                resource_cost: 10,
                resource_type: "mana",
                cooldown: 0,
                name: 'Flash Of Light'

            },

            healing_surge: {
                casttime: 1500,
                resource_cost: 10,
                resource_type: "mana",
                cooldown: 0,
                name: 'Flash Of Light'

            },

            power_word_shield: {
                casttime: 0,
                resource_cost: 10,
                resource_type: "mana",
                cooldown: 1500,
                name: 'Power Word Shield'
            },

            clarity_of_will: {
                casttime: 1890,
                resource_cost: 10,
                resource_type: "mana",
                cooldown: 0,
                name: 'Clarity Of Will'
            }


        }
        return spelldata[spell];
    }
}