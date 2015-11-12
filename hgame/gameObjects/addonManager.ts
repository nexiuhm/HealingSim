/* Addon manager class - To keep things consistant it works a lot like how Phaser deals with states.
/* Clarification: An addon is basicly a subroutine that displays graphical information to the screen and modifies this information as a reaction to events the game creates*/
class AddonManager {
    private addons = {};

    add(addonKey: string, addonCode: Function) {
        this.addons[addonKey] = { name: addonKey, enabled: true, code: addonCode };
    }

    disableAddon(addonKey: string) {
        if (!this.addons[addonKey])
            return;
        else
            this.addons[addonKey].enabled = false;
    }
    enableAddon(addonKey: string) {
        if (!this.addons[addonKey])
            return;
        else
            this.addons[addonKey].enabled = true;
    }

    /* Returns info about all registred addons. */
    getListOfAddons() {
        var addonList = [];
        for (var addon in this.addons) {
            var currentAddon = this.addons[addon];
            addonList.push([currentAddon.name, currentAddon.enabled]);
        }
        return addonList;
    }

    /* Executes the addon code to the current state/stage */
    loadEnabledAddons(stateToDrawTo: Phaser.State) {
        for (var addon in this.addons) {
            var currentAddon = this.addons[addon];
            if (currentAddon.enabled)
                new currentAddon.code(stateToDrawTo);
        }
    }
}