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
    nodeStyle: {
	"border-radius": "10% / 10%",
	"width": "50px",
	"height": "125px"
    },
    doReset(reset) {
	let keep = [];
	if ( hasMilestone("ST", 4) ) keep.push("upgrades")
	if (layers[reset].row > this.row) layerDataReset("S", keep)
    },
    passiveGeneration() {
	if ( hasUpgrade("W", 24) )
		if ( hasUpgrade("R", 14) )
		    if ( hasUpgrade("T", 41) )
			    return new Decimal(1)
			else
			    return new Decimal(0.1)
		else
			return new Decimal(0.01)
	else
		return new Decimal(0)
    },
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
	if ( hasMilestone("ST", 3) ) mult = mult.times( player.ST.points.plus(1.5).pow(hasUpgrade("ST", 14) ? 0.75:0.5) )
	if ( hasUpgrade("TI", 11) ) mult = mult.times(10)
	if ( hasUpgrade("TI", 13) ) mult = mult.times(2)
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
			let gain = new Decimal(1)
			if( inChallenge("B", 11) ) gain = new Decimal(2)
			if ( hasUpgrade("S", 23) )
				return player.S.points.plus(2).pow(0.45).pow(1.1).div(gain)
			else
				return player.S.points.plus(2).pow(0.45).div(gain)
		},
		effectDisplay() { return format(upgradeEffect("S", 12))+"x" },
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
			let gain = new Decimal(1)
			if( inChallenge("B", 11) ) gain = new Decimal(2)
			if ( hasUpgrade("W", 22) )
				return player.points.plus(2).log10().pow(0.5).plus(1).pow(1.08).div(gain)
			else
				return player.points.plus(2).log10().pow(0.5).plus(1).div(gain)
		},
		effectDisplay() { return format(upgradeEffect("S", 13))+"x" },
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
		effectDisplay() { return format(upgradeEffect("S", 21))+"x" },
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
		description: "Boost Crafting effect to the power of 1.1",
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
		effect() { 
			let gain = new Decimal(1)
			if( inChallenge("B", 11) ) gain = new Decimal(2)
            return player.S.points.plus(2).log10().pow(0.5).plus(0.75).div(gain)
        },
		effectDisplay() { return format(upgradeEffect("S", 31))+"x" },
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
			return "<font size=-1.5><b>Larger Trees</b></font> <br>Boost Stone Wood effect to the power of 1.2</br> <br>Cost: 10K sticks, 2 stone sticks, 5 tree centimeters</br>"
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
			return "<font size=-1.5><b>Even MORE EXPERIENCE</b></font> <br>Boost Expierence, now from wood! Effect to the power of 1.1</br> <br>Cost: 15K sticks, 3 stone sticks, 7 tree centimeters</br>"
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
    nodeStyle: {
	"border-radius": "25% / 25%",
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    doReset(reset) {
	keep = []
	if ( hasUpgrade("R", 11) ) keep.push("upgrades")
	if ( layers[reset].row > this.row ) layerDataReset("W", keep)
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
			if ( hasMilestone("ST", 5) ) gain2 = gain2.times(4);
			if ( hasUpgrade("L", 13) ) gain2 = gain2.times(upgradeEffect("L", 13));
			if ( hasUpgrade("R", 13) ) gain2 = gain2.times(upgradeEffect("R", 13));
			if ( hasUpgrade("L", 15) ) gain2 = gain2.times(upgradeEffect("L", 15));
			if ( hasUpgrade("TI", 11) ) gain2 = gain2.times(10);
			if ( hasUpgrade("W", 31) ) gain2 = gain2.times(2);
			player.W.points = player.W.points.plus(gain2) 
		},
		onHold() { 
			if ( hasUpgrade("T", 11) )
				gain2 = new Decimal(1);
				if ( hasUpgrade("W", 11) ) gain2 = gain2.plus(1);
				if ( hasUpgrade("ST", 11) ) gain2 = gain2.plus(2);
				if ( hasUpgrade("W", 14) ) gain2 = gain2.times(upgradeEffect("W", 14));
				if ( hasUpgrade("L", 12) ) gain2 = gain2.times(upgradeEffect("L", 12));
				if ( hasMilestone("ST", 5) ) gain2 = gain2.times(4);
				if ( hasUpgrade("L", 13) ) gain2 = gain2.times(upgradeEffect("L", 13));
				if ( hasUpgrade("R", 13) ) gain2 = gain2.times(upgradeEffect("R", 13));
				if ( hasUpgrade("L", 15) ) gain2 = gain2.times(upgradeEffect("L", 15));
				if ( hasUpgrade("TI", 11) ) gain2 = gain2.times(10);
				if ( hasUpgrade("W", 31) ) gain2 = gain2.times(2);
				player.W.points = player.W.points.plus(gain2) 
		}
	    }
    },
    buyables: {
    	11: {
        	cost: new Decimal(1000),
		title: "Convert",
        	display() { 
			if ( hasUpgrade("L", 22) )
				return "Convert 1000 wood into 2 refined wood (buys max)" 
			else
				return "Convert 1000 wood into 1 refined wood (buys max)"
		},
        	canAfford() { return player.W.points.gte(new Decimal(1000)) && hasUpgrade("W", 21) },
		unlocked() { return hasUpgrade("W", 21) },
        	buy() {
			let rice = new Decimal(1)
			if ( hasUpgrade("L", 22) ) rice = rice.times(2)
			// doing buy max on my own bcuz it wont work and it will NaN >:(
			let amount = player.W.points.div(1000).floor()
			let cost = amount.times(1000)
			setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
			player.W.points = player.W.points.sub(cost)
			player.W.refinedwood = player.W.refinedwood.plus(amount.times(rice))
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
		effectDisplay() { return format(upgradeEffect("W", 13))+"x" },
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
		effectDisplay() { return format(upgradeEffect("W", 14))+"x" },
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
			return "<font size=-1.5><b>Successfully Failed</b></font> <br>Boost trial and error effect to the power of 1.08</br> <br>Cost: 1000 Wood, 2 refined wood</br>"
		},
		canAfford() { return player.W.points.gte(new Decimal(1000)) && player.W.refinedwood.gte(new Decimal(2)) },
		unlocked() { return hasUpgrade("W", 21) },
		pay() {
			player.W.points = player.W.points.sub(1000);
			player.W.refinedwood = player.W.refinedwood.sub(2)
		}
	    },
	    23: {
		fullDisplay() {  
			return "<font size=-1.5><b>Dont leaf me...</b></font> <br>Double leaf gain</br> <br>Cost: 10K Wood, 10 refined wood</br>"
		},
		canAfford() { return player.W.points.gte(new Decimal(10000)) && player.W.refinedwood.gte(new Decimal(10)) },
		unlocked() { return hasUpgrade("R", 12) },
		pay() {
			player.W.points = player.W.points.sub(10000);
			player.W.refinedwood = player.W.refinedwood.sub(10)
		}
	    },
	    24: {
		fullDisplay() {  
			return "<font size=-1.5><b>Reproducing Sticks</b></font> <br>Passively generate 1% of sticks</br> <br>Cost: 20K Wood, 20 refined wood</br>"
		},
		canAfford() { return player.W.points.gte(new Decimal(20000)) && player.W.refinedwood.gte(new Decimal(20)) },
		unlocked() { return hasUpgrade("W", 23) },
		pay() {
			player.W.points = player.W.points.sub(20000);
			player.W.refinedwood = player.W.refinedwood.sub(20)
		}
	    },
	    31: {
		fullDisplay() {  
			return "<font size=-1.5><b>Wood Zapping</b></font> <br>Double wood gain and unlock more tree upgrades</br> <br>Cost: 1e9 wood, 1,000,000 refined wood</br>"
		},
		canAfford() { return player.W.points.gte(new Decimal("1e9")) && player.W.refinedwood.gte(new Decimal("1e6")) },
		unlocked() { return hasUpgrade("TI", 13) },
		pay() {
			player.W.points = player.W.points.sub("1e9");
			player.W.refinedwood = player.W.refinedwood.sub("1e6")
		}
	    }
    },
    layerShown() { 
    	if (inChallenge("B", 11))
            return false
        else
            return hasUpgrade("S", 14)
    },
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
		branches: [41],
		description: "Unlock the tin layer",
		cost: new Decimal(500000),
		unlocked() { return hasUpgrade("T", 22) },
		style: {
			transform: "translate(95px, 50px)"
		}
		},
		41: {
		title: "Ctiks",
		description: "Gain 100% of your sticks",
		cost: new Decimal(1000000),
		unlocked() { return hasChallenge("B", 11) },
		style: {
			transform: "translate(215px, 75px)"
		}
	    }
    },
    layerShown() { return hasUpgrade("S", 22) || hasUpgrade("L", 11) || hasUpgrade("TI", 11) }
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
        	name: "skilled",
        	done() { return player.points.gte(1000) },
		tooltip: "get 1000 experience",
		image: "resources/Ach1.png"
    	},
	12: {
        	name: "its hard",
        	done() { return player.ST.points.gte(1) },
		tooltip: "get 1 stone",
		image: "resources/Ach2.png"
    	},
	13: {
        	name: "dont step",
        	done() { return player.L.points.gte(1) },
		tooltip: "get 1 leaf",
		image: "resources/Ach3.png"
    	},
	14: {
        	name: "not the same",
        	done() { return player.W.refinedwood.gte(1) },
		tooltip: "get 1 refined wood",
		image: "resources/Ach4.png"
    	},
	15: {
        	name: "small but big",
        	done() { return player.TR.points.gte(50) && player.TR.layerShown == true },
		tooltip: "have your tree be 50 centimeters tall",
		image: "resources/Ach5.png"
    	},
	16: {
        	name: "stop chopping",
        	done() { return player.W.points.gte(1500) },
		tooltip: "get 1500 wood",
		image: "resources/Ach6.png"
    	},
	21: {
        	name: "nanotubes",
        	done() { return player.points.gte(1000000) },
		tooltip: "get 1M experience",
		image: "resources/Ach7.png"
    	},
	22: {
        	name: "aleph / 100,000",
        	done() { return player.S.points.gte(100000) },
		tooltip: "get 100K sticks",
		image: "resources/Ach8.png"
    	},
	23: {
        	name: "its the same",
        	done() { return player.W.refinedwood.gte(10) },
		tooltip: "get 10 refined wood",
		image: "resources/Ach9.png"
    	},
	24: {
        	name: "no salary",
        	done() { return player.R.points.gte(1) },
		tooltip: "hire 1 researcher",
		image: "resources/Ach10.png"
    	},
    25: {
        	name: "count leaves",
        	done() { return player.L.points.gte(100000) },
		tooltip: "count 100,000 leaves",
		image: "resources/Ach11.png"
    	},
    26: {
        	name: "unpaid people",
        	done() { return player.R.points.gte(1000) },
		tooltip: "hire 1,000 researchers",
		image: "resources/Ach12.png"
    	},
    31: {
        	name: "stone?",
        	done() { return player.TI.points.gte(1) },
		tooltip: "acquire 1 tin",
		image: "resources/Ach13.png"
    	},
    32: {
        	name: "willionare",
        	done() { return player.W.points.gte("1e9") },
		tooltip: "have 1e9 wood",
		image: "resources/Ach14.png"
    	},
    33: {
        	name: "batterying",
        	done() { return player.B.points.gte(1) && player.B.layerShown == true },
		tooltip: "have 1 power or more",
		image: "resources/Ach15.png"
    	},
    34: {
        	name: "not so broken",
        	done() { return hasChallenge("B", 11) },
		tooltip: "complete broken sticks challenge",
		image: "resources/Ach16.png"
    	},
    35: {
        	name: "whoops",
        	done() { return player.B.points.gte(500) },
		tooltip: "have more than 500 power",
		image: "resources/Ach17.png"
    	},
    36: {
        	name: "re-re-re-refined",
        	done() { return player.W.refinedwood.gte(1000000) },
		tooltip: "get 1M refined wood",
		image: "resources/Ach18.png"
    	},
    41: {
        	name: "impossible",
        	done() { return player.TI.points.gte(2) },
		tooltip: "get 2 tin",
		image: "resources/Ach19.png"
    	},
    42: {
        	name: "a lillion",
        	done() { return player.L.points.gte("1e6") },
		tooltip: "get a million leaves",
		image: "resources/Ach20.png"
    	},
    43: {
        	name: "dollar stores sells wood now",
        	done() { return player.W.points.gte("1e10") },
		tooltip: "get 1e10 wood",
		image: "resources/Ach21.png"
    	},
    44: {
        	name: "yeowch",
        	done() { return player.B.points.gte(4000) },
		tooltip: "get 4000 power",
		image: "resources/Ach22.png"
    	},
    45: {
        	name: "secret ingredient",
        	done() { return player.TR.seed.gte(0.0001) },
		tooltip: "buy 1 seed",
		image: "resources/Ach23.png"
    	},
    46: {
        	name: "sticks > humans",
        	done() { return player.S.points.gte("1e10") },
		tooltip: "get 1e10 sticks",
		image: "resources/Ach24.png"
    	}
    },
    layerShown() { return hasUpgrade("S", 22) || hasUpgrade("L", 11) | hasUpgrade("TI", 11) }
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
    branches: ["L", "R", "TI"],
    color: "#7a7a7a",
    requires: new Decimal(50), // Can be a function that takes requirement increases into account
    resource: "stone", // Name of prestige currency
    baseResource: "sticks", // Name of resource prestige is based on
    baseAmount() {return player.S.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
    	if ( hasUpgrade("ST", 13) )
            exp = new Decimal(1.5)
        else
            exp = new Decimal(1.75)
        return exp
    }, // Prestige currency exponent
    canBuyMax() { return hasUpgrade("ST", 13) },
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
        	requirementDescription: "1 Total Stone",
        	effectDescription: "Stone boosts experience",
        	done() { return player.ST.total.gte(1) },
		tooltip: "(x+0.25)^1.05"
    	},
	1: {
        	requirementDescription: "3 Total Stone",
        	effectDescription: "Unlock researchers",
        	done() { return player.ST.total.gte(3) }
    	},
	2: {
        	requirementDescription: "5 Total Stone",
        	effectDescription: "Unlock the tree layer",
        	done() { return player.ST.total.gte(5) }
    	},
	3: {
        	requirementDescription: "7 Total Stone",
        	effectDescription: "Stone boosts sticks",
        	done() { return player.ST.total.gte(7) },
		    tooltip() {
	            if ( hasUpgrade("ST", 14) )
                    return "(x+1.5)^0.75"
                else
                    return "(x+1.5)^0.5"
            }
    	},
	4: {
        	requirementDescription: "9 Total Stone",
        	effectDescription: "Stick upgrades don't reset",
        	done() { return player.ST.total.gte(9) }
    	},
	5: {
        	requirementDescription: "11 Total Stone",
        	effectDescription: "x4 wood",
        	done() { return player.ST.total.gte(11) }
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
	    },
	    13: {
		title: "Tunnel",
		description: "Decrease sticks needed for stone requirement, and get ability to buy max stone",
		cost: new Decimal(5),
		unlocked() { return hasChallenge("B", 11) }
	    },
	    14: {
		title: "Stoicks",
		description: "Increase boost to sticks by stone",
		cost: new Decimal(9),
		unlocked() { return hasUpgrade("ST", 13) }
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
    doReset(reset) {
	keep = [];
	if (reset == "R") keep.push("upgrades");
	if (reset == "R") layerDataReset("L", keep)
	if (layers[reset].row > this.row) layerDataReset("L", keep)
    },
    nodeStyle: {
	"border-radius": "50% / 75%",
    },
    color: "#32a852",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "leaves", // Name of prestige currency
    baseResource: "refined wood", // Name of resource prestige is based on
    baseAmount() {return player.W.refinedwood}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	if ( hasUpgrade("W", 23) ) mult = mult.times(2)
	if ( hasUpgrade("L", 14) ) mult = mult.times(upgradeEffect("L", 14))
	if ( hasUpgrade("L", 21) ) mult = mult.times(2)
	if ( hasUpgrade("TI", 11) ) mult = mult.times(2)
	if ( hasUpgrade("TI", 12) ) mult = mult.times(upgradeEffect("TI", 12))
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
		effectDisplay() { return format(upgradeEffect("L", 11))+"x" },
		tooltip: "(log((x*1.5)+1.1)^0.2)+1"
	    },
	    12: {
		title: "Wood from Leaves!?!?",
		description: "Leaves boost wood",
		cost: new Decimal(2),
		effect() { 
			return player.L.points.plus(1.25).pow(0.5).plus(0.5)
		},
		effectDisplay() { return format(upgradeEffect("L", 12))+"x" },
		tooltip: "((x+1.25)^0.5)+0.5"
	    },
	    13: {
		title: "Artificial Wood Growth",
		description: "Tree Centimeters boost wood",
		cost: new Decimal(5),
		effect() { 
			return player.TR.points.plus(1).log10().pow(0.4).plus(1)
		},
		effectDisplay() { return format(upgradeEffect("L", 13))+"x" },
		tooltip: "(log(x+1)^0.4)+1"
	    },
	    14: {
		title: "Let's research leaves?",
		description: "Researchers boost leaves",
		cost: new Decimal(10),
		effect() { 
			return player.R.points.plus(2).pow(0.4)
		},
		effectDisplay() { return format(upgradeEffect("L", 14))+"x" },
		tooltip: "(x+2)^0.4"
	    },
	    15: {
		title: "Branches",
		description: "Wood boost itself",
		cost: new Decimal(15),
		effect() { 
			return player.W.points.plus(5).log10().pow(0.2).plus(1)
		},
		effectDisplay() { return format(upgradeEffect("L", 15))+"x" },
		tooltip: "(log(x+5)^0.5)+1"
	    },
	    21: {
		title: "Autumn",
		description: "x2 Leaf Gain",
		cost: new Decimal(20),
		unlocked() { return hasUpgrade("R", 14) }
	    },
	    22: {
		title: "Re-Refining",
		description: "x2 Refined Wood",
		cost: new Decimal(25),
		unlocked() { return hasUpgrade("L", 21) }
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
	gain5 = new Decimal(1)
	if ( hasUpgrade("R", 12) ) gain5 = gain5.times(2)
	if ( hasUpgrade("R", 15) ) gain5 = gain5.times(upgradeEffect("R", 15))
	player.R.rpr = new Decimal(0).plus(gain5)
	player.R.rps = player.R.rpr.times(player.R.points)
	player.T.points = player.T.points.plus(player.R.rps)
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	if ( hasUpgrade("R", 14) ) mult = mult.times(upgradeEffect("R", 14))
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
		title: "Artifical Wood",
		description: "Wood upgrades don't reset",
		cost: new Decimal(1),
		unlocked() { return player.R.points.gte(new Decimal(2)) || hasUpgrade("R", 11) }
	    },
	    12: {
		title: "Re-searching",
		description: "Double research gain from researchers and unlock more wood upgrades",
		cost: new Decimal(3),
		unlocked() { return hasUpgrade("R", 11) }
	    },
	    13: {
		title: "Serious Work",
		description: "Researchers boost wood",
		cost: new Decimal(5),
		unlocked() { return hasUpgrade("R", 12) },
		effect() { 
			return player.R.points.plus(1.5).pow(0.45)
		},
		effectDisplay() { return format(upgradeEffect("R", 13))+"x" },
		tooltip: "(x+1)^0.45"
	    },
	    14: {
		title: "Discover the BIG BANG",
		description: "Passively gain 10% of sticks, Researchers boost itself and unlock more leaf upgrades",
		cost: new Decimal(7),
		unlocked() { return hasUpgrade("R", 13) },
		effect() { 
			return player.R.points.plus(2).log10().pow(0.4).plus(1)
		},
		effectDisplay() { return format(upgradeEffect("R", 14))+"x" },
		tooltip: "((log(x+2))^0.4)+1"
	    },
	    15: {
		fullDisplay() {  
			return "<font size=-1.5><b>Tree Knowledge</b></font> <br>Boost research per researcher by tree centimeters</br> <br>((log(x+2))^0.4)+1</br> <br>Cost: 20 researchers, 10,000 research</br>"
		},
		canAfford() { return player.R.points.gte(new Decimal(20)) && player.T.points.gte(new Decimal(10000)) },
		unlocked() { return hasUpgrade("R", 14) },
		pay() {
			player.R.points = player.R.points.sub(20);
			player.T.points = player.T.points.sub(10000)
		},
		effect() {
			return player.TR.points.plus(2).log10().pow(0.4).plus(1)
		},
		tooltip() { return "Effect: "+format(player.TR.points.plus(2).log10().pow(0.4).plus(1))+"x" }
	    }
    },
    layerShown(){ return hasMilestone("ST", 1) },
    tabFormat: [
    	"main-display",
    	["display-text", function() { return "Your researchers are making "+format(player.R.rps)+" research per tick, where each researcher makes "+format(player.R.rpr)+" research." }],
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
	seed: new Decimal(0)
    }},
    automate() {
	gain4 = new Decimal(0.001)
	if ( hasUpgrade("TR", 11) ) gain4 = gain4.times(2)
	if ( hasUpgrade("TR", 12) ) gain4 = gain4.times(2)
	if ( hasUpgrade("TR", 13) ) gain4 = gain4.times(2)
	player.TR.fert = player.TR.fert.plus(player.TR.seed)
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
        	display() { return "Fertilize the tree and get +0.0001 more centimeters per tick" },
		unlocked() { return hasUpgrade("TR", 12) },
        	canAfford() { return player.T.points.gte( new Decimal(100) ) },
		style: {
			transform: "translate(0px, -10px)"
		},
        	buy() {
            		player.T.points = player.T.points.sub(100)
            		setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		player.TR.fert = player.TR.fert.plus(0.0001)
        	}
	},
	12: {
        	cost: new Decimal("1e6"),
		title: "Plant Seeds - 1,000,000 research",
        	display() { return "Plant a seed and get +1 more fertilizers per tick" },
		unlocked() { return hasUpgrade("TR", 14) },
        	canAfford() { return player.T.points.gte( new Decimal("1e6") ) },
		style: {
			transform: "translate(0px, -10px)"
		},
        	buy() {
            		player.T.points = player.T.points.sub("1e6")
            		setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		player.TR.seed = player.TR.seed.plus(0.0001)
        	}
	}
    },
    upgrades: {
	    11: {
		title: "Faster Growth",
		description: "Double growth",
		cost: new Decimal(3),
	    },
	    12: {
		title: "Fertilizers",
		description: "Unlock fertilizers and double growth",
		cost: new Decimal(5),
		unlocked() { return hasUpgrade("TR", 11) }
	    },
	    13: {
		title: "Electree-cee-tree",
		description: "Unlock more battery upgrades and double growth",
		cost: new Decimal(50),
		unlocked() { return hasUpgrade("W", 31) }
	    },
	    14: {
		title: "PolyNomial",
		description: "Unlock seed buyable",
		cost: new Decimal(100),
		unlocked() { return hasUpgrade("TR", 13) }
	    }
    },
    layerShown() { return hasMilestone("ST", 2) },
    tabFormat: [
	["display-text", function() { return "Your tree is "+format(player.TR.points)+" centimeters tall, and it is growing "+format(player.TR.sps)+" centimeters per tick." }],
    	["display-image", "resources/Tree.png"],
    	"blank",
	"buyables",
	"blank",
    	"upgrades"
    ]
}),

addLayer("TI", {
    name: "Tin", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "TI", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
	points: new Decimal(0),
	tinium: new Decimal(0),
    }},
    branches: ["B"],
    doReset(reset) {
	let keep = [];
	if (layers[reset].row > this.row) layerDataReset("TI", keep)
    },
    color: "#dfe3eb",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "tin", // Name of prestige currency
    baseResource: "stone", // Name of resource prestige is based on
    baseAmount() {return player.ST.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "i", description: "I: Reset for tIn.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    nodeStyle: {
	"border-radius": "25% / 25%",
	transform: "rotate(5deg)"
    },
    buyables: {
    	11: {
        	cost: new Decimal(100),
		title: "Tiniumify",
        	display() { return "Convert 1000 leaves and 100 tin into 1 tinium" },
        	canAfford() { return player.TI.points.gte(new Decimal(100)) && player.L.points.gte(new Decimal(1000)) },
		unlocked() { return false },
        	buy() {
			player.TI.points = player.TI.points.sub(100)
            		player.L.points = player.L.points.sub(1000)
            		setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		player.TI.tinium = player.TI.tinium.plus(1)
        	}
	}
    },
    upgrades: {
	    11: {
		title: "Ore Power",
		description: "x10 sticks, wood and experience, x2 leaves, and unli access to tech tree and achievements",
		cost: new Decimal(1)
	    },
	    12: {
		title: "Tinland!",
		description: "Unlocks Recovery Layer (PERMANENT), Unlocks battery layer and tin boosts leaves.",
		cost: new Decimal(1),
		effect() {
			return player.TI.points.plus(1.5).pow(0.5)
		},
		effectDisplay() { return format(upgradeEffect("TI", 12))+"x" },
		tooltip: "(x+1.5)^0.5"
	    },
	    13: {
		title: "Tin Sticks n Batteries",
		description: "Double stick gain, and unlock more wood and battery upgrades, unlock more recoveries",
		cost: new Decimal(2),
		unlocked() { return hasChallenge("B", 11) }
	    }
    },
    layerShown(){return hasUpgrade("T", 33)},
    tabFormat: [
    	"main-display",
	["display-text", function() { if ( player.TI.tinium.gte(new Decimal(1)) ) return "You have "+format(player.TI.tinium)+" tinium" }],
	"prestige-button",
    	"blank",
    	"buyables",
    	"blank",
    	"upgrades"
    ]
}),

addLayer("RE", {
    name: "Recovery", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "RE", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: true,
	points: new Decimal(1),
    }},
    color: "#ededed",
    requires: new Decimal(0), // Can be a function that takes requirement increases into account
    resource: "jacorb", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    nodeStyle: {
	"border-radius": "10% / 10%",
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)
    buyables: {
    	11: {
        	cost: new Decimal(1),
		title: "Get 10 tree centimeters for 1 researcher (Must have less than the currency purchased)",
        	display() { return "Recovery Buyable" },
        	canAfford() { return player.R.points.gte( new Decimal(1) ) && player.TR.points.lt( new Decimal(10) ) },
        	buy() {
            		setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		player.TR.points = new Decimal(10)
        	},
		style: {
			"border-radius": "50%",
    		}
	},
	12: {
        	cost: new Decimal(1),
		title: "Get 3 leaves for 1 tin (Must have less than the currency purchased)",
        	display() { return "Recovery Buyable" },
        	canAfford() { return player.TI.points.gte( new Decimal(1) ) && player.L.points.lt( new Decimal(3) ) },
        	buy() {
            		setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		player.L.points = new Decimal(3)
        	},
		style: {
			"border-radius": "50%",
    		}
	},
	13: {
        	cost: new Decimal(1),
		title: "Get 2 stone for 1 tin (Must have less than the currency purchased)",
        	display() { return "Recovery Buyable" },
        	canAfford() { return player.TI.points.gte( new Decimal(1) ) && player.ST.points.lt( new Decimal(2) ) },
        	buy() {
            		setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.ST.total = player.ST.total.plus(2)
	    		player.ST.points = new Decimal(2)
        	},
		style: {
			"border-radius": "50%",
    		}
	},
	14: {
        	cost: new Decimal(1),
		    title: "Get 10 researchers for 500 power (Must have less than the currency purchased)",
        	display() { return "Recovery Buyable" },
        	canAfford() { return player.B.points.gte( new Decimal(500) ) && player.R.points.lt( new Decimal(10) ) },
        	buy() {
            	setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		player.R.points = new Decimal(10)
        	},
		    style: {
			    "border-radius": "50%",
    		},
            unlocked() {return hasUpgrade("TI", 13)}
	}
    },
    layerShown() { return hasUpgrade("TI", 12) },
    tabFormat: [
	["display-text", function() { return "Welcome to the Recovery Layer, in here you will get some recovery buyables. THEY WILL NOT DECREASE!"}],
    	"blank",
	"buyables"
    ],
    tooltip: ""
}),

addLayer("B", {
    name: "Battery", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        speed: new Decimal(0.1),
        cap: new Decimal(100),
        save: false,
    }},
    bars: {
         bigBar: {
             direction: RIGHT,
             width: 500,
             height: 50,
             progress() { return player.B.points.div(player.B.cap) },
             fillStyle: {
             	"background-color": "#c9c36b"
             },
             borderStyle: {
             	"border-color": "#707070",
                 "border": "10px solid"
             }
         }
    },
    automate() {
	gain4 = new Decimal(0.1)
	gain4 = gain4.plus(getBuyableAmount("B", 11).times(0.02))
	gain4 = gain4.plus(getBuyableAmount("B", 13).times(0.04))
	if (hasUpgrade("B", 12)) gain4 = gain4.times(2)
	hat = new Decimal(100)
	hat = hat.plus(getBuyableAmount("B", 12).times(25))
	if (hasUpgrade("B", 11)) hat = hat.times(2)
	if (hasUpgrade("B", 13)) hat = hat.times(2)
	if (hasUpgrade("B", 14)) hat = hat.times(2)
	player.B.cap = new Decimal(0).plus(hat)
	player.B.speed = new Decimal(0).plus(gain4)
	if (player.B.points.lt(player.B.cap) ) player.B.points = player.B.points.plus(player.B.speed)
    },
    microtabs: {
        stuff: {
            Upgrades: {
                content: [
                    "upgrades"
                ]
            },
            Challenges: {
                content: [
                    "challenges"
                ],
                unlocked() { return hasUpgrade("B", 12) }
            }
        }
    },
    color: "#c9c36b",
    requires: new Decimal(0), // Can be a function that takes requirement increases into account
    resource: "power", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: "2", // Row the layer is in on the tree (0 is the first row)
    position: 1,
    challenges: {
        11: {
            name: "Broken Sticks",
            challengeDescription: "Perform a row 3 reset and every stick upgrade's effect will be halved, and wood layer won't unlock.",
            goalDescription: "Get 1000 experience",
            rewardDescription: "Unlock more stone, tin and tech tree upgrades",
            style: {
	              "border-radius": "5% / 5%"
            },
            onEnter() {
            	player.points = new Decimal(10),
                player.ST.milestones = [],
                player.ST.points = new Decimal(0),
                player.ST.upgrades = [],
                player.ST.total = new Decimal(0),
                player.L.points = new Decimal(0),
                player.L.upgrades = [],
                player.R.points = new Decimal(0),
                player.R.upgrades = [],
                player.R.rpr = new Decimal(1),
                doReset("ST", true)
            },
            canComplete: function() {return player.points.gte(1000)}
        },
    },
    buyables: {
    	11: {
        	cost() {
                    return new Decimal(90).pow(new Decimal(1.04).pow(getBuyableAmount("B", 11)) )
            },
            style: {
	              "border-radius": "5% / 5%"
            },
		title() { return "Battery Charger - "+getBuyableAmount(this.layer, this.id) },
        	display() { return "Speed up the battery, which is adding to your charge gain by "+format(getBuyableAmount(this.layer, this.id).times(0.02))+"<br>Cost: "+format(this.cost())+" Power</br>"},
		unlocked() { return true},
        	canAfford() { return player.B.points.gte( this.cost() ) },
        	buy() {
            	let first = new Decimal(90)
                let exp = 1.04
                let max = Decimal.affordGeometricSeries(player[this.layer].points, first, exp, getBuyableAmount(this.layer, this.id))
                let most = Decimal.sumGeometricSeries(max, first, exp, getBuyableAmount(this.layer, this.id))
                player[this.layer].points = player[this.layer].points.sub(most)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
        	}
	},
	12: {
        	cost() {
                    return new Decimal(100).pow(new Decimal(1.04).pow(getBuyableAmount(this.layer, this.id)) )
            },
            style: {
	              "border-radius": "5% / 5%"
            },
		title() { return "Longer Battery - "+getBuyableAmount(this.layer, this.id) },
        	display() { return "Make your battery longer, which is adding to your capacity by "+format(getBuyableAmount(this.layer, this.id).times(25))+"<br>Cost: "+format(this.cost())+" Power</br>"},
		unlocked() { return true},
        	canAfford() { return player.B.points.gte( this.cost() ) },
        	buy() {
            	let first = new Decimal(100)
                let exp = 1.04
                let max = Decimal.affordGeometricSeries(player[this.layer].points, first, exp, getBuyableAmount(this.layer, this.id))
                let most = Decimal.sumGeometricSeries(max, first, exp, getBuyableAmount(this.layer, this.id))
                player[this.layer].points = player[this.layer].points.sub(most)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
        	}
	},
	13: {
        	cost() {
                    return new Decimal(1000).pow(new Decimal(1.04).pow(getBuyableAmount(this.layer, this.id)) )
            },
            style: {
	              "border-radius": "5% / 5%"
            },
		title() { return "Faster Electricity - "+getBuyableAmount(this.layer, this.id) },
        	display() { return "Electricity is faster, which is adding to your charge gain by "+format(getBuyableAmount(this.layer, this.id).times(0.04))+"<br>Cost: "+format(this.cost())+" Power</br>"},
		unlocked() { return hasUpgrade("B", 14)},
        	canAfford() { return player.B.points.gte( this.cost() ) },
        	buy() {
            	let first = new Decimal(1000)
                let exp = 1.04
                let max = Decimal.affordGeometricSeries(player[this.layer].points, first, exp, getBuyableAmount(this.layer, this.id))
                let most = Decimal.sumGeometricSeries(max, first, exp, getBuyableAmount(this.layer, this.id))
                player[this.layer].points = player[this.layer].points.sub(most)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
        	}
	}
    },
    nodeStyle: {
	"border-radius": "10% / 10%",
	"width": "125px",
	"height": "50px"
    },
    upgrades: {
	    11: {
		title: "We love some power",
		description: "Double battery capacity",
		cost: new Decimal(175),
		style: {
	              "border-radius": "5% / 5%"
        }
        },
        12:{
		title: "Electrifying",
		description: "Unlock challenges and double charge gain",
		cost: new Decimal(400),
		unlocked() { return hasUpgrade("B", 11) },
		style: {
	              "border-radius": "5% / 5%"
        }
	    },
	    13:{
		title: "Fork and Outlet",
		description: "Double capacity",
		cost: new Decimal(700),
		unlocked() { return hasUpgrade("TI", 13) },
		style: {
	              "border-radius": "5% / 5%"
        }
	    },
	    14:{
		title: "Static Electricity",
		description: "Unlock another buyable and double capacity",
		cost: new Decimal(2000),
		unlocked() { return hasUpgrade("TR", 13) },
		style: {
	              "border-radius": "5% / 5%"
        }
	    }
    },
    tooltip() { return format(player[this.layer].points)+"/"+format(player[this.layer].cap)+" power" },
    layerShown() { return hasUpgrade("TI", 12) },
    tabFormat: [
	["display-text", function() { return "Your battery is storing "+format(player[this.layer].points)+" power, and is getting charged "+format(player.B.speed)+" per tick, and has a maximum of "+format(player[this.layer].cap)+" power, which boosts experience gain by ×"+format(player.B.points.plus(15).log10().pow(0.5))}],
    	"blank",
    ["bar", "bigBar"],
    "blank",
	"buyables",
	"blank",
    ["microtabs", "stuff"]
    ]
})
