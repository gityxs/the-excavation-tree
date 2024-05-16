addLayer("CE3", {
    name: "Challenge Experience", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CE", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked() { return true},
        points: new Decimal(0),
        pps: new Decimal(1)
    }},
    color: "#c2625b",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "challenge experience", // Name of prestige currency
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
    gen() {
    	if(inArea("challe26e")) {
        	let mult = new Decimal(1)
            if(hasChallenge("CE3", 11)) mult = mult.times(challengeEffect("CE3", 11))
            if(hasMilestone("CE3", 0)) mult = mult.times(2)
            if(getBuyableAmount("CE3", 11).gte(1)) mult = mult.pow(buyableEffect("CE3", 11).plus(1))
            if(inChallenge("CE3", 11)) mult = mult.div(new Decimal(2).pow(challengeCompletions("CE3", 11) + 1))
            if(inChallenge("CE3", 12)) mult = mult.sqrt()
            player.CE3.pps = mult
            player.CE3.points = player.CE3.points.plus(mult.div(30))
        }
    },
    row: "0", // Row the layer is in on the tree (0 is the first row)
    challenges: {
    	11: {
    	    name: "Inconvenience",
            challengeDescription: function() { return "Reset challenge experience and divide it by "+format(new Decimal(2).pow(challengeCompletions("CE3", 11) + 1))+". Completions: "+challengeCompletions("CE3", 11)+"/"+tmp.CE3.challenges[this.id].completionLimit},
            goalDescription: function() { return format(new Decimal(10).times(new Decimal(1.5).pow(challengeCompletions("CE3", 11))))+" Challenge Experience" },
            canComplete: function() {return player.CE3.points.gte(new Decimal(10).times(new Decimal(1.5).pow(challengeCompletions("CE3", 11))))},
            rewardDescription: "Quadruple challenge experience gain compounding every completion",
            completionLimit: function() {return 5 + challengeEffect("CE3", 12)},
            rewardEffect() {return new Decimal(4).pow(challengeCompletions("CE3", 11)) },
            rewardDisplay() {return format(challengeEffect("CE3", 11))+"x"},
            onEnter() {
            	player.CE3.points = new Decimal(0)
            }
        },
        12: {
    	    name: "The Opposite",
            unlocked() {return hasMilestone("CE3", 0)},
            challengeDescription: function() { return "Square root challenge experience."+" Completions: "+challengeCompletions("CE3", 12)+"/3"},
            goalDescription: function() { return format(new Decimal(675).times(new Decimal(3).pow(challengeCompletions("CE3", 12))))+" Challenge Experience" },
            canComplete: function() {return player.CE3.points.gte(new Decimal(675).times(new Decimal(3).pow(challengeCompletions("CE3", 12))))},
            rewardDescription: "Increase completion limit of Inconvenience by 1",
            completionLimit: 3,
            rewardEffect() {return challengeCompletions("CE3", 12)},
            rewardDisplay() {return "+"+format(challengeEffect("CE3", 12))},
            onEnter() {
            	player.CE3.points = new Decimal(0)
            }
        },
        21: {
    	    name: "First Test",
            unlocked() {return getBuyableAmount("CE3", 11).gte(3) && challengeCompletions("CE3", 11) >= 8 && challengeCompletions("CE3", 12) >= 3 },
            challengeDescription: function() { return "Combine the effects of Inconvenience and The Opposite."},
            goalDescription: "1,000 Challenge Experience",
            canComplete: function() {return player.CE3.points.gte(new Decimal(1000))},
            rewardDescription: "Unlock the next layer",
            countsAs: [11, 12],
            onEnter() {
            	player.CE3.points = new Decimal(0)
            }
        },
    },
    milestones: {
    	0: {
            requirementDescription: "10000 challenge experience",
            effectDescription: "Unlock more challenges and double challenge exp gain",
            done() { return player.CE3.points.gte(10000) }
        },
        1: {
            requirementDescription: "2,500,000 challenge experience",
            effectDescription: "Unlock some buyables",
            done() { return player.CE3.points.gte("2.5e6") }
        },
    },
    buyables: {
        11: {
            cost(x) { return new Decimal("2.5e6").mul(x.plus(1)) },
            title: "Speedrun",
            display() { return "Reset your challenge experience and challenges, to increase the exponent of challenge experience gain by +0.05. Cost: "+format(this.cost())+" challenge experience. Amount: "+getBuyableAmount("CE3", 11)+"/3 <br />Currently: +"+format(buyableEffect("CE3", 11))},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = new Decimal(0),
                player[this.layer].challenges[11] = 0,
                player[this.layer].challenges[12] = 0,
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone("CE3", 1)},
            effect(x) {return x.mul(0.05)},
            purchaseLimit: 3
        },
    },
    layerShown() { return inArea("challe26e")},
    isActive() {return tmp[this.layer].layerShown},
    tabFormat: [
        "main-display",
        "resource-display",
        ["display-text", function() { return "You are making "+format(player.CE3.pps)+" challenge experience per second." }],
        "milestones",
        "challenges",
        "buyables"
    ]
})