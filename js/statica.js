addLayer("ES2", {
    name: "Ethereal Sticks", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ES", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked() { return true},
        points: new Decimal(0),
        pps: new Decimal(0)
    }},
    color: "#3f2399",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "ethereal sticks", // Name of prestige currency
    baseResource: "experience", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: "0", // Row the layer is in on the tree (0 is the first row)
    create() {
    	if (hasUpgrade("ES2", 11) && inArea("statica")) {
    	    let mult = new Decimal(1)
            if (hasUpgrade("ES2", 12)) mult = mult.times(5)
            if (hasUpgrade("ES2", 13)) mult = mult.times(upgradeEffect("ES2", 13))
            if (hasUpgrade("ES2", 14)) mult = mult.times(3)
            if (getBuyableAmount("ES2", 11).gte(1)) mult = mult.times(buyableEffect("ES2", 11))
            if (hasUpgrade("ES2", 11) && hasUpgrade("ES2", 21) ) mult = mult.times(upgradeEffect("ES2", 11))
            if (hasUpgrade("ES2", 22)) mult = mult.times(4)
            if (hasUpgrade("ES2", 24)) mult = mult.times(100)
            player.ES2.pps = mult
            player.ES2.points = player.ES2.points.plus(mult.div(30))
        }
    },
    upgrades: {
    	11: {
    	    title: "Imaginary",
            description() {
            	if(hasUpgrade("ES2", 21)) {
            	    return "Start to gain ethereal sticks, and boost ethereal sticks by the square root of Discovery's effect."
                } else {
                    return "Start to gain ethereal sticks"
                }
            },
            tooltip() {
            	if(hasUpgrade("ES2", 21)) {
            	    return "sqrt(x)"
                } else {
                    return ""
                }
            },
            effect() { return upgradeEffect("ES2", 13).sqrt() },
            effectDisplay() {
            	if(hasUpgrade("ES2", 21)) {
            	    return format(upgradeEffect("ES2", 11))+"x"
                } else {
                    return "+1"
                }
            },
            cost: new Decimal(0)
        },
        12: {
    	    title: "Inspecting",
            description: "Boost ethereal sticks by 5",
            cost: new Decimal(10)
        },
        13: {
    	    title: "Discovery",
            description: "Boost ethereal sticks depending on how many upgrades you bought.",
            cost: new Decimal(60),
            unlocked() {return hasUpgrade("ES2", 12)},
            tooltip: "2^x",
            effect() { return new Decimal(2).pow(upgradeLength("ES2")) },
            effectDisplay() { return format(upgradeEffect("ES2", 13))+"x" }
        },
        14: {
    	    title: "Researching",
            description: "Triple ethereal stick gain and unlock a new buyable",
            cost: new Decimal(600),
            unlocked() {return hasUpgrade("ES2", 13)}
        },
        21: {
    	    title: "It's real!",
            description: "Imaginary upgrade now also has an effect",
            cost: new Decimal(5000),
            unlocked() {return hasUpgrade("ES2", 14) && getBuyableAmount("ES2", 11).gte(1)}
        },
        22: {
    	    title: "It's real?",
            description: "Quadruple ethereal stick gain, but Content doesn't reset this upgrade, and the first 3 upgrades.",
            cost: new Decimal(100000),
            unlocked() {return hasUpgrade("ES2", 21) && getBuyableAmount("ES2", 11).gte(2)}
        },
        23: {
    	    title: "EtherRealReal",
            description: "Double Content's effects to ethereal sticks.",
            cost: new Decimal(2e6),
            unlocked() {return hasUpgrade("ES2", 21) && hasUpgrade("ES2", 22) && getBuyableAmount("ES2", 11).gte(3)}
        },
        24: {
        	title: "Statically",
            description: "Multiply ethereal sticks by a hundred",
            cost: new Decimal("1.5e7"),
            unlocked() {return hasUpgrade("ES2", 23) && getBuyableAmount("ES2", 11).gte(4)}
        },
    },
    buyables: {
        11: {
            cost(x) { 
            	let stop = 0
                if(x.gte(4)) stop = 100
                return new Decimal(4).plus(x).plus(stop)
            },
            title: "Content",
            display() { return "Reset all your ethereal stick upgrades and ethereal sticks, to double ethereal stick gain by 2 (not compounding) and unlock new upgrades. Cost: "+format(this.cost())+" upgrades<br />Currently: "+format(buyableEffect("ES2", 11))+"x"},
            canAfford() { return new Decimal(upgradeLength("ES2")).gte(this.cost()) },
            buy() {
            	let keep = []
                if(hasUpgrade("ES2", 22)) keep.push(11, 12, 13, 22)
                player.ES2.upgrades = keep
                player.ES2.points = new Decimal(0)
                player.ES2.pps = new Decimal(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { 
            	let mult = new Decimal(1)
                if (hasUpgrade("ES2", 23)) mult = mult.times(2)
                return x.mul(2).mul(mult)
            },
        },
    },
    layerShown() { return inArea("statica")},
    isActive() {return tmp[this.layer].layerShown},
    tabFormat: [
        "main-display",
        "resource-display",
        ["display-text", function() { return "You are making "+format(player.ES2.pps)+" ethereal sticks per second." }],
        "upgrades",
        "buyables"
    ]
})