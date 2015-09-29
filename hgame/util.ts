
// random stuff / utility

module util {

    export function generatePlayerName():string {
        var nameList = "Eowiragan,Ferraseth,Umeilith,Wice,Brierid,Fedriric,Higod,Gweann,Thigovudd,Fraliwyr,Zardorin,Halrik,Qae,Gwoif,Zoican,Tjolme,Dalibwyn,Miram,Medon,Aseannor,Angleus,Seita,Sejta,Fraggoji,Verdisha,Oixte,Lazeil,Jhazrun,Kahva,Ussos,Usso,Neverknow,Sco,Treckie,Slootbag,Unpl,Smirk,Lappe,Fraggoboss,Devai,Luumu,Alzu,Altzu"
        var nameArray = nameList.split(",")
        var randomIndex = Math.round(randomNumberFromTo(0, nameArray.length - 1));
        return nameArray[randomIndex];
    }

    export function randomNumberFromTo(min, max) { // returns a random number between min & max
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    export function getClassColor(classId: number): number {
        var classColors = [0xC79C6E,0xF58CBA,0xABD473,0xFFF569,0xFFFFFF, 0xC41F3B,0x0070DE,0x69CCF0,0x9482C9,0x00FF96, 0xFF7D0A]
        return classColors[classId] || classColors[1];
    }

    // Check if raid contains x tanks and y healers.
    export function checkRaid() {
    }
} 