addLayer("S", {
    name: "Sticks", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
	points: new Decimal(0),
	resetTime: new Decimal(0)
    }},
    branches: ["W", "ST"],
    color: "#a86e34",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "sticks", // Name of prestige currency
    baseResource: "experience", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	if ( hasUpgrade("S", 21)) mult = mult.times(upgradeEffect("S", 21))
	if ( hasUpgrade("S", 24) ) mult = mult.times(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for Sticks.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
	    11: {
		title: "Practice",
		description: "Gain 1 experience per second.",
		cost: new Decimal(1)
	    },
	    12: {
		title: "Crafting",
		description: "Sticks boost experience.",
		cost: new Decimal(1),
		effect() { 
			if ( hasUpgrade("S", 23) )
				return player.S.points.plus(2).pow(0.45).pow(1.1)
			else
				return player.S.points.plus(2).pow(0.45)
		},
		effectDisplay() { return upgradeEffect("S", 12)+"x" },
		unlocked() { return hasUpgrade("S", 11) },
		tooltip: "(x+1)^0.45"
	    },
            13: {
		title: "Trial and Error",
		description: "Experience boosts Experience.",
		cost: new Decimal(5),
		effect() { return player.points.plus(2).log10().pow(0.5).plus(1) },
		effectDisplay() { return upgradeEffect("S", 13)+"x" },
		unlocked() { return hasUpgrade("S", 12) },
		tooltip: "(log(x+2)^0.5)+1"
	    },
	    14: {
		title: "Wood Cutting",
		description: "Unlocks Wood layer, and experience gain is added by 3.",
		cost: new Decimal(10),
		unlocked() { return hasUpgrade("S", 13) },
		tooltip: "+3"
	    },
	    21: {
		title: "Experienced Sticks",
		description: "Boost sticks depending on experience",
		cost: new Decimal(15),
		effect() { return player.points.plus(100).log10().pow(0.1) },
		effectDisplay() { return upgradeEffect("S", 21)+"x" },
		unlocked() { return hasUpgrade("W", 12) },
		tooltip: "(log(x+100)^0.1)"
	    },
	    22: {
		title: "Technology Break-out",
		description: "Unlock achievements and the tech tree",
		cost: new Decimal(25),
		unlocked() { return hasUpgrade("W", 12) },
	    },
	    23: {
		title: "High Quality Crafting",
		description: "Boost Crafting upgrade by to the power of 1.1",
		cost: new Decimal(30),
		unlocked() { return hasUpgrade("T", 21) },
	    },
	    24: {
		title: "Not ENOUGH STICKS!",
		description: "Boost Sticks by x2",
		cost: new Decimal(40),
		unlocked() { return hasUpgrade("S", 23) },
	    }
    },
    layerShown(){return true}
}),

addLayer("W", {
    name: "Wood", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["ST"],
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#eb9846",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "wood", // Name of prestige currency
    baseResource: "experience", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    clickables: {
    	11: {
		title: "Chop",
        	display() { return "Click to chop a tree which would grant you wood." },
		canClick() {return true},
		style: {
			transform: "translate(0px, -10px)"
		},
		onClick() { 
			let gain2 = new Decimal(1);
			if ( hasUpgrade("W", 11) ) gain2 = gain2.plus(1);
			player.W.points = player.W.points.plus(gain2) 
		},
		onHold() { 
			if ( hasUpgrade("T", 11) )
				gain2 = new Decimal(1);
				if ( hasUpgrade("W", 11) ) gain2 = gain2.plus(1);
				player.W.points = player.W.points.plus(gain2) 
		}
	    }
    },
    upgrades: {
	    11: {
		title: "Chopper",
		description: "Gain 1 more wood per click",
		cost: new Decimal(25),
	    },
	    12: {
		title: "UpGs",
		description: "Unlock 2 more stick upgrades",
		cost: new Decimal(40),
		unlocked() { return hasUpgrade("W", 11) }
	    },
	    13: {
		title: "Experience, now from wood!",
		description: "Wood now boosts experience (Softcap 5x)",
		cost: new Decimal(500),
		unlocked() { return hasUpgrade("T", 11) },
		effect() { 
			if ( upgradeEffect("W", 13) < new Decimal(5) )
				return player.W.points.plus(5).log10().pow(0.4).plus(1)
			
			else
				return new Decimal(5)
		},
		effectDisplay() { return upgradeEffect("W", 13)+"x" },
		tooltip: "(log(x+5)^0.4)+1"
	    }
    },
    layerShown() { return hasUpgrade("S", 14) }
}),

addLayer("T", {
    name: "Tech", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#cf46eb",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "research", // Name of prestige currency
    baseResource: "sticks", // Name of resource prestige is based on
    baseAmount() {return player.S.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)
    buyables: {
    	11: {
        	cost: new Decimal(25),
		title: "Study - 25 Sticks",
        	display() { return "Study and get 1 research" },
        	canAfford() { return player.S.points.gte( new Decimal(25) ) },
		style: {
			transform: "translate(0px, -10px)"
		},
        	buy() {
            		player.S.points = player.S.points.sub(25)
            		setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		player.T.points = player.T.points.plus(1)
        	}
    	}
    },
    upgrades: {
	    11: {
		title: "Inventing Fire",
		description: "Unlock more wood upgrades, and get the ability to hold wood clickable.",
		cost: new Decimal(1),
		branches: [21, 22]
	    },
	    21: {
		title: "Sticks are useful!!!",
		description: "Unlock more stick upgrades",
		cost: new Decimal(3),
		unlocked() { return hasUpgrade("T", 11) },
		style: {
			transform: "translate(-10px, 25px)"
		}
	    },
            22: {
		title: "Stone Age",
		description: "Unlock the stone layer",
		cost: new Decimal(5),
		unlocked() { return hasUpgrade("T", 11) },
		style: {
			transform: "translate(10px, 25px)"
		}
	    }
    },
    layerShown() { return hasUpgrade("S", 22) }
}),

addLayer("ACH", {
    name: "Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ACH", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: true,
    }},
    color: "#f5c542",
    requires: new Decimal(0), // Can be a function that takes requirement increases into account
    resource: "", // Name of prestige currency
    baseResource: "experience", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)
    achievements: {
    	11: {
        	name: "EXP^3",
        	done() { return player.points.gte(1000) },
		tooltip: "Get 1000 Experience",
		image: "resources/Ach1.png"
    	}
    },
    layerShown() { return hasUpgrade("S", 22) }
}),

addLayer("ST", {
    name: "Stone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ST", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
	points: new Decimal(0),
	total: new Decimal(0)
    }},
    color: "#7a7a7a",
    requires: new Decimal(50), // Can be a function that takes requirement increases into account
    resource: "stone", // Name of prestige currency
    baseResource: "sticks", // Name of resource prestige is based on
    baseAmount() {return player.S.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "t", description: "T: Reset for sTone.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    milestones: {
    	0: {
        	requirementDescription: "1 Stone",
        	effectDescription: "Stone boosts experience",
        	done() { return player.ST.total.gte(1) },
		tooltip: "(x+0.25)^1.05"
    	}

    },
    upgrades: {
	    11: {
		title: "Stone Axe",
		description: "+2 Wood per chop and unlock more wood upgrades",
		cost: new Decimal(2)
	    }
    },
    layerShown(){ return hasUpgrade("T", 22) }
})
