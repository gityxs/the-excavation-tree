addLayer("S", {
    name: "Sticks", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
	points: new Decimal(0),
	resetTime: new Decimal(0),
	st: new Decimal(0)
    }},
    branches: ["W", "ST", "L"],
    color: "#a86e34",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "sticks", // Name of prestige currency
    baseResource: "experience", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	if ( hasUpgrade("S", 21) ) mult = mult.times(upgradeEffect("S", 21))
	if ( hasUpgrade("S", 24) ) mult = mult.times(2)
	if ( hasUpgrade("S", 31) ) mult = mult.times(upgradeEffect("S", 31))
	if ( hasUpgrade("L", 11) ) mult = mult.times(upgradeEffect("L", 11))
	if ( hasMilestone("ST", 3) ) mult = mult.times( player.ST.points.plus(1.5).pow(0.5) )
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for Sticks.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    buyables: {
    	11: {
        	cost: new Decimal(2500),
		title: "Merge",
        	display() { return "Convert 2500 sticks, 1000 wood into 1 stone stick" },
        	canAfford() { return player.S.points.gte(new Decimal(2500)) && player.W.points.gte(new Decimal(1000)) && hasUpgrade("ST", 12) },
		unlocked() { return hasUpgrade("ST", 12) },
        	buy() {
			player.S.points = player.S.points.sub(2500)
            		player.W.points = player.W.points.sub(1000)
            		setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		player.S.st = player.S.st.plus(1)
        	}
	}
    },
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
		tooltip() {
			if ( hasUpgrade("S", 23) )
				return "((x+1)^0.45)^1.1"
			else
				return "(x+1)^0.45"
		}
	    },
            13: {
		title: "Trial and Error",
		description: "Experience boosts Experience.",
		cost: new Decimal(5),
		effect() { 
			if ( hasUpgrade("W", 22) )
				return player.points.plus(2).log10().pow(0.5).plus(1).pow(1.08)
			else
				return player.points.plus(2).log10().pow(0.5).plus(1)
		},
		effectDisplay() { return upgradeEffect("S", 13)+"x" },
		unlocked() { return hasUpgrade("S", 12) },
		tooltip() {
			if ( hasUpgrade("W", 22) )
				return "((log(x+2)^0.5)+1)^1.08"
			else
				return "(log(x+2)^0.5)+1"
		}
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
	    },
	    31: {
		title: "Sticking Sticks",
		description: "Sticks boost itself",
		cost: new Decimal(200),
		unlocked() { return hasUpgrade("T", 32) },
		effect() { return player.S.points.plus(2).log10().pow(0.5).plus(0.75) },
		effectDisplay() { return upgradeEffect("S", 31)+"x" },
		tooltip: "(log(x+2)^0.5)+0.75"
	    },
	    32: {
		title: "Hydroponic",
		description: "Unlock the leaves layer and boost experience by x2",
		cost: new Decimal(1000),
		unlocked() { return hasUpgrade("S", 31) },
	    },
	    33: {
		fullDisplay() {  
			return "<font size=-1.5><b>Larger Trees</b></font> <br>Boost Stone Wood upgrade by to the power of 1.2</br> <br>Cost: 10K sticks, 2 stone sticks, 5 tree centimeters</br>"
		},
		canAfford() { return player.S.points.gte(new Decimal(10000)) && player.S.st.gte(new Decimal(2)) && player.TR.points.gte(new Decimal(5)) },
		unlocked() { return hasUpgrade("ST", 12) },
		pay() {
			player.S.points = player.S.points.sub(10000);
			player.S.st = player.S.st.sub(2);
			player.TR.points = player.TR.points.sub(5)
		}
	    },
	    34: {
		fullDisplay() {  
			return "<font size=-1.5><b>Even MORE EXPERIENCE</b></font> <br>Boost Expierence, now from wood! Upgrade by to the power of 1.1</br> <br>Cost: 15K sticks, 3 stone sticks, 7 tree centimeters</br>"
		},
		canAfford() { return player.S.points.gte(new Decimal(15000)) && player.S.st.gte(new Decimal(3)) && player.TR.points.gte(new Decimal(7)) },
		unlocked() { return hasUpgrade("S", 33) },
		pay() {
			player.S.points = player.S.points.sub(15000);
			player.S.st = player.S.st.sub(3);
			player.TR.points = player.TR.points.sub(7)
		}
	    }
    },
    layerShown(){return true},
    tabFormat: [
    	"main-display",
	["display-text", function() { if ( hasUpgrade("ST", 12) ) return "You have "+format(player.S.st)+" stone sticks" }],
	"prestige-button",
    	"blank",
    	"buyables",
    	"blank",
    	"upgrades"
    ]
}),

addLayer("W", {
    name: "Wood", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["ST"],
    startData() { return {
        unlocked: true,
	points: new Decimal(0),
	refinedwood: new Decimal(0),
    }},
    color: "#eb9846",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "wood", // Name of prestige currency
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
			if ( hasUpgrade("ST", 11) ) gain2 = gain2.plus(2);
			if ( hasUpgrade("W", 14) ) gain2 = gain2.times(upgradeEffect("W", 14));
			if ( hasUpgrade("L", 12) ) gain2 = gain2.times(upgradeEffect("L", 12));
			player.W.points = player.W.points.plus(gain2) 
		},
		onHold() { 
			if ( hasUpgrade("T", 11) )
				gain2 = new Decimal(1);
				if ( hasUpgrade("W", 11) ) gain2 = gain2.plus(1);
				if ( hasUpgrade("ST", 11) ) gain2 = gain2.plus(2);
				if ( hasUpgrade("W", 14) ) gain2 = gain2.times(upgradeEffect("W", 14));
				if ( hasUpgrade("L", 12) ) gain2 = gain2.times(upgradeEffect("L", 12));
				player.W.points = player.W.points.plus(gain2) 
		}
	    }
    },
    buyables: {
    	11: {
        	cost: new Decimal(1000),
		title: "Convert",
        	display() { return "Convert 1000 wood into 1 refined wood" },
        	canAfford() { return player.W.points.gte(new Decimal(1000)) && hasUpgrade("W", 21) },
		unlocked() { return hasUpgrade("W", 21) },
        	buy() {
            		player.W.points = player.W.points.sub(1000)
            		setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		player.W.refinedwood = player.W.refinedwood.plus(1)
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
				if ( hasUpgrade("S", 34) )
					return player.W.points.plus(5).log10().pow(0.4).plus(1).pow(1.1)
				else
					return player.W.points.plus(5).log10().pow(0.4).plus(1)
			else
				return new Decimal(5)
		},
		effectDisplay() { return upgradeEffect("W", 13)+"x" },
		tooltip() {
			if ( hasUpgrade("S", 34) )
				return "((log(x+5)^0.4)+1)^1.1"
			else
				return "(log(x+5)^0.4)+1"
		}
	    },
	    14: {
		title: "Stone Wood",
		description: "Stone boosts wood",
		cost: new Decimal(1000),
		unlocked() { return hasUpgrade("T", 31) },
		effect() { 
			if ( hasUpgrade("S", 33) )
				return player.ST.points.plus(1.25).pow(0.5).pow(1.2)
			else
				return player.ST.points.plus(1.25).pow(0.5)
		},
		effectDisplay() { return upgradeEffect("W", 14)+"x" },
		tooltip() { 
			if ( hasUpgrade("S", 33) ) 
				return "((x+1.25)^0.5)^1.2" 
			else
				return "(x+1.25)^0.5"
		},
	    },
	    21: {
		title: "NEW and IMPROVED",
		description: "Unlock Refined Wood type",
		cost: new Decimal(1500),
		unlocked() { return hasUpgrade("ST", 11) }
	    },
	    22: {
		fullDisplay() {  
			return "<font size=-1.5><b>Successfully Failed</b></font> <br>Boost trial and error effect by to the power of 1.08</br> <br>Cost: 1000 Wood, 2 refined wood</br>"
		},
		canAfford() { return player.W.points.gte(new Decimal(1000)) && player.W.refinedwood.gte(new Decimal(2)) },
		unlocked() { return hasUpgrade("W", 21) },
		pay() {
			player.W.points = player.W.points.sub(1000);
			player.W.refinedwood = player.W.refinedwood.sub(2)
		}
	    }
    },
    layerShown() { return hasUpgrade("S", 14) },
    tabFormat: [
    	"main-display",
	["display-text", function() { return "You have "+format(player.W.refinedwood)+" refined wood" }],
    	"blank",
    	"buyables",
    	"blank",
    	"clickables",
    	"blank",
    	"upgrades"
    ]
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
		},
		branches: [31]
	    },
            22: {
		title: "Stone Age",
		description: "Unlock the stone layer",
		cost: new Decimal(5),
		unlocked() { return hasUpgrade("T", 11) },
		style: {
			transform: "translate(10px, 25px)"
		},
		branches: [32, 33]
	    },
	    31: {
		title: "Wood Expansion",
		description: "Unlock even more wood upgrades",
		cost: new Decimal(10),
		unlocked() { return hasUpgrade("T", 21) },
		style: {
			transform: "translate(50px, 50px)"
		}
	    },
	    32: {
		title: "Stone Tools",
		description: "Unlock even more stick upgrades",
		cost: new Decimal(15),
		unlocked() { return hasUpgrade("T", 22) },
		style: {
			transform: "translate(70px, 50px)"
		}
	    },
	    33: {
		title: "Tin Cans",
		description: "Unlock the tin layer",
		cost: new Decimal(10000),
		unlocked() { return hasUpgrade("T", 22) },
		style: {
			transform: "translate(95px, 50px)"
		}
	    }
    },
    layerShown() { return hasUpgrade("S", 22) || hasUpgrade("L", 11) }
}),

addLayer("ACH", {
    name: "Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ACH", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: true,
    }},
    tooltip: "",
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
    	},
	12: {
        	name: "Welcome to the underground",
        	done() { return player.ST.points.gte(1) },
		tooltip: "Get 1 stone",
		image: "resources/Ach2.png"
    	},
	13: {
        	name: "Im gonna leaf now.",
        	done() { return player.L.points.gte(1) },
		tooltip: "Get 1 leaf",
		image: "resources/Ach3.png"
    	},
	14: {
        	name: "It's just compressed...",
        	done() { return player.W.refinedwood.gte(1) },
		tooltip: "Get 1 refined wood",
		image: "resources/Ach4.png"
    	},
	15: {
        	name: "Same Size Spoon",
        	done() { return player.TR.points.gte(50) },
		tooltip: "Have your tree be 50 centimeters tall",
		image: "resources/Ach5.png"
    	},
	16: {
        	name: "Please stop chopping",
        	done() { return player.W.points.gte(1500) },
		tooltip: "Get 1500 Wood",
		image: "resources/Ach6.png"
    	},
	21: {
        	name: "Experience Nanotubes",
        	done() { return player.points.gte(1000000) },
		tooltip: "Get 1M Experience",
		image: "resources/Ach7.png"
    	},
	22: {
        	name: "Aleph Sticks",
        	done() { return player.S.points.gte(100000) },
		tooltip: "Get 100K Sticks",
		image: "resources/Ach8.png"
    	},
	23: {
        	name: "Shiny!",
        	done() { return player.W.refinedwood.gte(10) },
		tooltip: "Get 10 refined wood",
		image: "resources/Ach9.png"
    	},
	24: {
        	name: "No salary at all",
        	done() { return player.R.points.gte(1) },
		tooltip: "Hire 1 researcher",
		image: "resources/Ach10.png"
    	}
    },
    layerShown() { return hasUpgrade("S", 22) || hasUpgrade("L", 11) }
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
    branches: ["L", "R"],
    color: "#7a7a7a",
    requires: new Decimal(50), // Can be a function that takes requirement increases into account
    resource: "stone", // Name of prestige currency
    baseResource: "sticks", // Name of resource prestige is based on
    baseAmount() {return player.S.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.75, // Prestige currency exponent
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
    	},
	1: {
        	requirementDescription: "3 Stone",
        	effectDescription: "Unlock researchers",
        	done() { return player.ST.total.gte(3) }
    	},
	2: {
        	requirementDescription: "5 Stone",
        	effectDescription: "Unlock the tree layer",
        	done() { return player.ST.total.gte(5) }
    	},
	3: {
        	requirementDescription: "7 Stone",
        	effectDescription: "Stone boosts sticks",
        	done() { return player.ST.total.gte(7) },
		tooltip: "(x+1.5)^0.5"
    	}

    },
    upgrades: {
	    11: {
		title: "Stone Axe",
		description: "+2 Wood per chop and unlock more wood upgrades",
		cost: new Decimal(2)
	    },
	    12: {
		title: "Stone Sticks",
		description: "Unlock more stick upgrades and unlock stone sticks",
		cost: new Decimal(4),
		unlocked() { return hasUpgrade("ST", 11) }
	    }
    },
    layerShown(){ return hasUpgrade("T", 22) },
    tabFormat: [
    	"main-display",
    	["display-text", function() { return "You have made a total of "+format(player.ST.total)+" stone" }],
	"prestige-button",
	"blank",
    	"upgrades",
    	"blank",
    	"milestones"
    ]
}),

addLayer("L", {
    name: "Leaves", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
	points: new Decimal(0),
    }},
    color: "#32a852",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "leaves", // Name of prestige currency
    baseResource: "refined wood", // Name of resource prestige is based on
    baseAmount() {return player.W.refinedwood}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "l", description: "L: Reset for Leaves", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
	    11: {
		title: "Books of Knowledge",
		description: "Leaves boost sticks and tech tree and achievements stay.",
		cost: new Decimal(1),
		effect() { 
			return player.L.points.times(1.5).plus(1.1).log10().pow(0.2).plus(1)
		},
		effectDisplay() { return upgradeEffect("L", 11)+"x" },
		tooltip: "(log((x*1.5)+1.1)^0.2)+1"
	    },
	    12: {
		title: "Wood from Leaves!?!?",
		description: "Leaves boost wood",
		cost: new Decimal(2),
		effect() { 
			return player.L.points.plus(1.25).pow(0.5).plus(0.5)
		},
		effectDisplay() { return upgradeEffect("L", 12)+"x" },
		tooltip: "((x+1.25)^0.5)+0.5"
	    }
    },
    layerShown(){ return hasUpgrade("S", 32) }
}),

addLayer("R", {
    name: "Researchers", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
	points: new Decimal(0),
	rpr: new Decimal(1),
	rps() { return player.R.rpr.times(player.R.points) }
    }},
    color: "#7240b3",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "researchers", // Name of prestige currency
    baseResource: "leaves", // Name of resource prestige is based on
    baseAmount() {return player.L.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    automate() {
	player.R.rps = player.R.rpr.times(player.R.points),
	player.T.points = player.T.points.plus(player.R.rps)
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: Reset for Researchers", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
	    11: {
		title: "Re-searching",
		description: "Double research gain from researchers",
		cost: new Decimal(5)
	    }
    },
    layerShown(){ return hasMilestone("ST", 1) },
    tabFormat: [
    	"main-display",
    	["display-text", function() { return "Your researchers are making "+format(player.R.rps)+" research per second, where each researcher makes "+format(player.R.rpr)+" research." }],
	"prestige-button",
	"blank",
    	"upgrades"
    ]
}),

addLayer("TR", {
    name: "Tree", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "TR", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: true,
	points: new Decimal(1),
	sps: new Decimal(0.001),
	fert: new Decimal(0),
    }},
    automate() {
	gain4 = new Decimal(0.001)
	if ( hasUpgrade("TR", 11) ) gain4 = gain4.times(2)
	if ( hasUpgrade("TR", 12) ) gain4 = gain4.times(2)
	player.TR.sps = new Decimal(0).plus(gain4).plus(player.TR.fert)
	player.TR.points = player.TR.points.plus(player.TR.sps)
    },
    color: "#2f5e1a",
    requires: new Decimal(0), // Can be a function that takes requirement increases into account
    resource: "centimeters", // Name of prestige currency
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
		title: "Apply Fertilizer - 100 research",
        	display() { return "Fertilize the tree and get +0.0001 more centimeters per second" },
        	canAfford() { return player.T.points.gte( new Decimal(100) ) },
		style: {
			transform: "translate(0px, -10px)"
		},
        	buy() {
            		player.T.points = player.T.points.sub(100)
            		setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		player.TR.fert = player.TR.fert.plus(0.0001)
        	}
	}
    },
    upgrades: {
	    11: {
		title: "Faster Growth",
		description: "Double growth",
		cost: new Decimal(25),
	    },
	    12: {
		title: "Fertilizers",
		description: "Unlock fertilizers and double growth",
		cost: new Decimal(5),
		unlocked() { return hasUpgrade("TR", 11) }
	    }
    },
    layerShown() { return hasMilestone("ST", 2) },
    tabFormat: [
	["display-text", function() { return "Your tree is "+format(player.TR.points)+" centimeters tall, and it is growing "+format(player.TR.sps)+" centimeters per second." }],
    	["display-image", "resources/Tree.png"],
    	"blank",
	"buyables",
	"blank",
    	"upgrades"
    ]
})
