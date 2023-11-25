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
    microtabs: {
        stuff: {
            "Tier 1": {
                content: [
                    ["column", [ ["row", [ ["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14] ] ], ["row", [ ["upgrade", 21], ["upgrade", 22], ["upgrade", 23], ["upgrade", 24] ] ], ["row", [ ["upgrade", 31], ["upgrade", 32], ["upgrade", 33], ["upgrade", 34] ] ], ["row", [ ["upgrade", 41], ["upgrade", 42], ["upgrade", 43] ] ] ] ] // columns of rows.
                ],
            },
            "Tier 2": {
                content: [
                    ["column", [ ["row", [ ["upgrade", 51], ["upgrade", 52], ["upgrade", 53], ["upgrade", 54] ] ], ["row", [ ["upgrade", 61], ["upgrade", 62], ["upgrade", 63], ["upgrade", 64] ] ] ] ]
                ],
                unlocked() {return hasMilestone("F", 0) }
            },
        }
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
	mult = mult.times(getBuyableAmount("M", 14).times(0.1).plus(1))
	if ( hasUpgrade("S", 42) ) mult = mult.times(2)
	if ( hasUpgrade("R", 24) ) mult = mult.times(5)
	if ( hasUpgrade("S", 61) ) mult = mult.times(upgradeEffect("S", 61))
	if ( hasUpgrade("S", 64) ) mult = mult.times(5)
	if ( hasUpgrade("B", 22) ) mult = mult.times(2)
	if ( hasUpgrade("F", 11) ) mult = mult.times(10)
	if(hasMilestone("C", 0)) mult = mult.times(3)
	if ( inChallenge("B", 12) ) mult = mult.div(100) // divide comes first
	if ( inChallenge("B", 13) ) mult = mult.sqrt() // sqrt comes first
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
		cost: new Decimal(0)
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
	    },
	    41: {
		title: "The beginning of the end",
		description: "Unlock more battery challenges",
		cost: new Decimal(100), // Used to be 1K
		currencyDisplayName: "stone sticks",
		currencyInternalName: "st",
		currencyLayer: "S",
		unlocked() {return hasUpgrade("M", 14)}
	    },
	    42: {
		title: "Stick it out",
		description: "Double stick gain",
		cost: new Decimal("1e10"),
		unlocked() { return hasUpgrade("S", 41) },
	    },
	    51: {
		title: "Testing", // Tier 2
		description: "Double EXP Gain",
		cost: new Decimal("5e10"),
	    },
	    52: {
		title: "Merging",
		description: "Sticks slightly boost experience.",
		cost: new Decimal("7e10"),
		effect() { 
			let gain = new Decimal(1)
			if( inChallenge("B", 11) ) gain = new Decimal(2)
			if(!hasUpgrade("S", 63))
		        return player.S.points.plus(1).log10().plus(2).pow(0.1).div(gain) // you little log10 NaN >:(
		    else
		        return player.S.points.plus(1).log10().plus(2).pow(0.1).pow(1.1).div(gain)
		},
		effectDisplay() { return format(upgradeEffect("S", 52))+"x" },
		unlocked() { return hasUpgrade("S", 51) },
		tooltip() {
			if(!hasUpgrade("S", 63))
		        return "(log(x+1)+2)^0.1"
		    else
		        return "((log(x+1)+2)^0.1)^1.1"
		}
	    },
	    53: {
		title: "Leftover Notes",
		description: "Experience slightly boosts experience.",
		cost: new Decimal("9e10"),
		effect() { 
			let gain = new Decimal(1)
			if( inChallenge("B", 11) ) gain = new Decimal(2)
			return player.points.plus(2).log10().plus(1).pow(0.075).div(gain)
		},
		effectDisplay() { return format(upgradeEffect("S", 53))+"x" },
		unlocked() { return hasUpgrade("S", 52) },
		tooltip() {
			return "(log(x+2)+1)^0.075"
		}
	    },
	    54: {
		title: "Cutting Wood",
		description: "Unlock more wood upgrades",
		cost: new Decimal("2e11"),
		unlocked() { return hasUpgrade("S", 53) },
	    },
	    43: {
		title: "Wait...", // back to t1
		description: "Unlock the... Antimatter Dimensions Layer??????",
		cost: new Decimal("4e11"),
		unlocked() { return hasUpgrade("W", 32) },
		tooltip: "WHAT"
	    },
	    61: {
		title: "Skilled Sticks", // back to t2
		description: "Boost sticks slightly based on experience",
		cost: new Decimal("2.5e11"),
		effect() { return player.points.plus(1000).log10().pow(0.05) },
		effectDisplay() { return format(upgradeEffect("S", 61))+"x" },
		unlocked() { return hasUpgrade("R", 23) },
		tooltip: "(log(x+1000)^0.05)"
	    },
	    62: {
		title: "Advanced Modifications",
		description: "Double research per researcher",
		cost: new Decimal("3e11"),
		unlocked() { return hasUpgrade("S", 61) },
	    },
	    63: {
		title: "Professional Merging",
		description: "Boost Merging upgrade to the power of 1.1",
		cost: new Decimal("4e11"),
		unlocked() { return hasUpgrade("S", 62) },
	    },
	    64: {
		title: "WE NEED STICKS",
		description: "Boost sticks by x5",
		cost: new Decimal("4e12"),
		unlocked() { return hasUpgrade("S", 63) },
	    },
    },
    layerShown(){return true},
    tabFormat: [
    	"main-display",
	["display-text", function() { if ( hasUpgrade("ST", 12) ) return "You have "+format(player.S.st)+" stone sticks" }],
	["display-text", function() { return "Your sticks has a boost of ×<em>"+format(tmp[this.layer].gainMult)+"</em>"}, { "color": "#a86e34", "font-size": "16px"}],
	"prestige-button",
    	"blank",
    	"buyables",
    	"blank",
    	["microtabs", "stuff"]
    ]
}),

addLayer("W", {
    name: "Wood", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["ST"],
    startData() { return {
        unlocked() {
        	if (inChallenge("B", 11))
            return false
        else
            return hasUpgrade("S", 14)
        },
	points: new Decimal(0),
	refinedwood: new Decimal(0),
    }},
    color: "#eb9846",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "wood", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
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
			gain2 = gain2.times(getBuyableAmount("M", 15).times(0.1).plus(1))
			if ( hasUpgrade("W", 32) ) gain2 = gain2.times(2);
			if ( hasUpgrade("F", 31) ) gain2 = gain2.times(10);
			if(hasMilestone("C", 0)) gain2 = gain2.times(3);
			if ( inChallenge("B", 12) ) gain2 = gain2.div(100);
			if ( inChallenge("B", 13) ) gain2 = gain2.sqrt();
			return gain2
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
			let gain2 = tmp[this.layer].gainMult;
			player.W.points = player.W.points.plus(gain2) 
		},
		onHold() { 
			if ( hasUpgrade("T", 11) )
				gain2 = tmp[this.layer].gainMult;
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
	    },
	    32: {
		fullDisplay() {  
			return "<font size=-1.5><b>Stay the same</b></font> <br>Unlock more tier 1 stick upgrades, double wood gain</br> <br>Cost: 1e11 wood, 1e8 refined wood</br>"
		},
		canAfford() { return player.W.points.gte(new Decimal("1e11")) && player.W.refinedwood.gte(new Decimal("1e8")) },
		unlocked() { return hasUpgrade("S", 54) },
		pay() {
			player.W.points = player.W.points.sub("1e11");
			player.W.refinedwood = player.W.refinedwood.sub("1e8")
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
	["display-text", function() { return "Your wood has a boost of ×<em>"+format(tmp[this.layer].gainMult)+"</em>"}, { "color": "#eb9846", "font-size": "16px"}],
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
        unlocked() { return hasUpgrade("S", 22) || hasUpgrade("L", 11) || hasUpgrade("TI", 11) },
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
		branches: [41, 42],
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
			transform: "translate(275px, 75px)"
		}
	    },
	    42: {
		title: "Industrial Age",
		description: "Unlock the coal layer",
		cost: new Decimal("1e10"),
		unlocked() { return hasUpgrade("F", 41) },
		style: {
			transform: "translate(10px, 75px)"
		}
	    }
    },
    layerShown() { return hasUpgrade("S", 22) || hasUpgrade("L", 11) || hasUpgrade("TI", 11) || hasMilestone("C", 0) }
}),

addLayer("ACH", {
    name: "Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ACH", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked() { return hasUpgrade("S", 22) || hasUpgrade("L", 11) | hasUpgrade("TI", 11) }
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
        	done() { return player.TR.points.gte(50) && hasMilestone("ST", 2) },
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
        	done() { return player.B.points.gte(1) && hasUpgrade("TI", 11) },
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
    	},
    51: {
        	name: "successfully dumb",
        	done() { return player.points.gte("1e7") && inChallenge("B", 12) },
		tooltip: "get 10M experience during the Ineffective Learning battery challenge",
		image: "resources/Ach25.png"
    	},
    52: {
        	name: "attract.",
        	done() { return player.M.points.gte(3) },
		tooltip: "get 3 magnets",
		image: "resources/Ach26.png"
    	},
    53: {
        	name: "burger khalifa",
        	done() { return player.TR.points.gte("1e5") },
		tooltip: "have your tree be taller than 100,000 centimeters",
		image: "resources/Ach27.png"
    	},
    54: {
        	name: "stonks",
        	done() { return player.M.box.gte(5) },
		tooltip: "get 5 boxes",
		image: "resources/Ach28.png"
    	},
    55: {
        	name: "moneh moneh moneh",
        	done() { return player.M.cash.gte(250) },
		tooltip: "get 250 cash",
		image: "resources/Ach29.png"
    	},
    56: {
        	name: "root of the problem",
        	done() { return hasChallenge("B", 13) },
		tooltip: "complete tree root challenge",
		image: "resources/Ach30.png"
    	},
    61: {
        	name: "1 big step",
        	done() { return player.TR.points.gte("1e6") },
		tooltip: "make your tree be bigger than 1M centimeters",
		image: "resources/Ach31.png"
    	},
    62: {
        	name: "riches to rags",
        	done() { return player.F.points.gte(1) },
		tooltip: "acquire fire stage 1",
		image: "resources/Ach32.png"
    	},
    63: {
        	name: "above average",
        	done() { return hasUpgrade("S", 51) },
		tooltip: "get a tier 2 stick upgrade",
		image: "resources/Ach33.png"
    	},
    64: {
        	name: "zoooooooooom",
        	done() { return player.S.points.gte("1e12") },
		tooltip: "get a trillion (1e12) sticks",
		image: "resources/Ach34.png"
    	},
    65: {
        	name: "the great wall of cap",
        	done() { return player.AD.points.gte("2e8") },
		tooltip: "get 2e8 antimatter reward: unlock an antimatter upgrade",
		image: "resources/Ach35.png"
    	},
    66: {
        	name: "too expensive",
        	done() { return player.F.points.gte(2) },
		tooltip: "acquire fire stage 2",
		image: "resources/Ach36.png"
    	},
    71: {
        	name: "stickocalypse",
        	done() { return player.S.points.gte("1e13") },
		tooltip: "get 1e13 sticks",
		image: "resources/Ach37.png"
    	},
    72: {
        	name: "futuristic sticks",
        	done() { return hasUpgrade("S", 61) && hasUpgrade("S", 62) && hasUpgrade("S", 63) && hasUpgrade("S", 64) },
		tooltip: "get all row 2 tier 2 stick upgrades",
		image: "resources/Ach38.png"
    	},
    73: {
        	name: "feel the thunder",
        	done() { return player.B.points.gte(10000) },
		tooltip: "get 10,000 power",
		image: "resources/Ach39.png"
    	},
    74: {
        	name: "the choice",
        	done() { return player.F.fp.gte(1) },
		tooltip: "get 1 fire point",
		image: "resources/Ach40.png"
    	},
    75: {
        	name: "indesicive",
        	done() { return hasUpgrade("F", 11) && hasUpgrade("F", 21) },
		tooltip: "get the 2 starting fire point upgrades reward: get a new recovery",
		image: "resources/Ach41.png"
    	},
    76: {
        	name: "it's lit",
        	done() { return player.C.points.gte(1) },
		tooltip: "get a coal",
		image: "resources/Ach42.png"
    	},
    },
    layerShown() { return hasUpgrade("S", 22) || hasUpgrade("L", 11) || hasUpgrade("TI", 11) || hasMilestone("C", 0) }
}),

addLayer("ST", {
    name: "Stone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ST", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked() { return hasUpgrade("T", 22) },
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
        unlocked() { return hasUpgrade("S", 32) },
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
    layerShown(){ return hasUpgrade("S", 32) },
    tabFormat: [
    	"main-display",
         "resource-display",
	    ["display-text", function() { return "Your leaves has a boost of ×<em>"+format(tmp[this.layer].gainMult)+"</em>"}, { "color": "#32a852", "font-size": "16px"}],
    	"prestige-button",
        "blank",
    	"upgrades"
    ]
}),

addLayer("R", {
    name: "Researchers", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked() { return hasMilestone("ST", 1) },
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
	if ( hasUpgrade("R", 21) ) gain5 = gain5.times(2)
	if ( hasUpgrade("R", 22) ) gain5 = gain5.times(2)
	if ( hasUpgrade("S", 62) ) gain5 = gain5.times(2)
	if ( hasUpgrade("F", 41) ) gain5 = gain5.times(100)
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
	    },
	21: {
		title: "Paid Workers",
		description: "Research per researcher is doubled",
		cost: new Decimal(100),
		unlocked() { return hasMilestone("F", 1) },
		currencyDisplayName: "cash",
		currencyInternalName: "cash",
		currencyLayer: "M",
	    },
	22: {
		title: "Double Pay",
		description: "Research per researcher is doubled again",
		cost: new Decimal(3000),
		unlocked() { return hasUpgrade("R", 21) }
	    },
	23: {
		title: "Chemical Modification",
		description: "Unlock more tier 2 stick upgrades, double EXP gain",
		cost: new Decimal(4000),
		unlocked() { return hasUpgrade("R", 22) }
	    },
	24: {
		title: "Saving Energy",
		description: "Unlock more battery upgrades, x5 stick gain",
		cost: new Decimal(150),
		unlocked() { return hasUpgrade("R", 23) },
		currencyDisplayName: "cash",
		currencyInternalName: "cash",
		currencyLayer: "M",
	    },
    },
    layerShown(){ return hasMilestone("ST", 1) },
    tabFormat: [
    	"main-display",
        "resource-display",
    	["display-text", function() { return "Your researchers are making "+format(player.R.rps)+" research per tick, where each researcher makes "+format(player.R.rpr)+" research." }],
        ["display-text", function() { return "Your researchers has a boost of ×<em>"+format(tmp[this.layer].gainMult)+"</em>"}, { "color": "#7240b3", "font-size": "16px"}],
	    "prestige-button",
	    "blank",
    	"upgrades"
    ]
}),

addLayer("TR", {
    name: "Tree", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "TR", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked() { return hasMilestone("ST", 2) },
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
        unlocked(){return hasUpgrade("T", 33)},
	points: new Decimal(0),
	tinium: new Decimal(0),
    }},
    branches: ["B", ["F", 1, 5], "C" ],
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
        unlocke() { return hasUpgrade("TI", 12) && !inChallenge("B", 12) && !inChallenge("B", 13) },
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
	},
	21: {
        	cost: new Decimal(1),
		    title: "Get 10 leaves with fire stage 1 (Won't fetch currency)",
        	display() { return "Recovery Buyable" },
        	canAfford() { return player.F.points.gte(1) },
        	buy() {
            	setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		player.L.points = player.L.points.plus(10)
        	},
		    style: {
			    "border-radius": "50%",
    		},
            unlocked() {return hasMilestone("F", 0)}
	},
	22: {
        	cost: new Decimal(1),
		    title: "Get row 1 stone upgrades with fire stage 1 (Must have atleast 1 not-bought row 1 stone upgrade)",
        	display() { return "Recovery Buyable" },
        	canAfford() { return player.F.points.gte(1) && !hasUpgrade("ST", 11) || !hasUpgrade("ST", 12) || !hasUpgrade("ST", 13) || !hasUpgrade("ST", 14) },
        	buy() {
            	setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		if ( !hasUpgrade("ST", 11) ) player.ST.upgrades.push("11"); player.ST.total = player.ST.total.plus(2)
	            if ( !hasUpgrade("ST", 12) ) player.ST.upgrades.push("12"); player.ST.total = player.ST.total.plus(4)
	            if ( !hasUpgrade("ST", 13) ) player.ST.upgrades.push("13"); player.ST.total = player.ST.total.plus(5)
	            if ( !hasUpgrade("ST", 14) ) player.ST.upgrades.push("14"); player.ST.total = player.ST.total.plus(9)
        	},
		    style: {
			    "border-radius": "50%",
    		},
            unlocked() {return hasMilestone("F", 0)}
	},
	23: {
        	cost: new Decimal(1),
		    title: "Get 2000 researchers with 2 fire stages (Must have less than the currency purchased)",
        	display() { return "Recovery Buyable" },
        	canAfford() { return player.F.points.gte( new Decimal(2) ) && player.R.points.lt( new Decimal(2000) ) },
        	buy() {
            	setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		player.R.points = new Decimal(2000)
        	},
		    style: {
			    "border-radius": "50%",
    		},
            unlocked() {return hasUpgrade("AD", 11)}
	},
	24: {
        	cost: new Decimal(1),
		    title: "Get 5 million leaves with 2 fire stages (Must have less than the currency purchased)",
        	display() { return "Recovery Buyable" },
        	canAfford() { return player.F.points.gte( new Decimal(2) ) && player.L.points.lt( 5000000 ) },
        	buy() {
            	setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		player.L.points = new Decimal("5e6")
        	},
		    style: {
			    "border-radius": "50%",
    		},
            unlocked() {return hasAchievement("ACH", 75)}
	},
	31: {
        	cost: new Decimal(1),
		    title: "Get 250 cash with 1 fire stage (Must have less than the currency purchased)",
        	display() { return "Recovery Buyable" },
        	canAfford() { return player.F.points.gte( new Decimal(1) ) && player.M.cash.lt( 250 ) },
        	buy() {
            	setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		player.M.cash = new Decimal(250)
        	},
		    style: {
			    "border-radius": "50%",
    		},
            unlocked() {return hasUpgrade("F", 31)}
	},
	32: {
        	cost: new Decimal(1),
		    title: "Get 2 fire stage with 1 coal (Must have less than the currency purchased)",
        	display() { return "Recovery Buyable" },
        	canAfford() { return player.C.points.gte( new Decimal(1) ) && player.F.points.lt( 2 ) },
        	buy() {
            	setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		player.F.points = new Decimal(2)
	            player.F.total = new Decimal(2)
        	},
		    style: {
			    "border-radius": "50%",
    		},
            unlocked() {return hasMilestone("C", 0)}
	},
	33: {
        	cost: new Decimal(1),
		    title: "Get 2 tin with 1 coal (Must have less than the currency purchased)",
        	display() { return "Recovery Buyable" },
        	canAfford() { return player.C.points.gte( new Decimal(1) ) && player.TI.points.lt( 2 ) },
        	buy() {
            	setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
	    		player.TI.points = new Decimal(2)
        	},
		    style: {
			    "border-radius": "50%",
    		},
            unlocked() {return hasMilestone("C", 0)}
	},
    },
    layerShown() { return hasUpgrade("TI", 12) || hasMilestone("C", 0) && !inChallenge("B", 12) && !inChallenge("B", 13) },
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
        unlocked() { return hasUpgrade("TI", 12) },
        points: new Decimal(0),
        speed: new Decimal(0.1),
        cap: new Decimal(100),
        save: false,
    }},
    doReset(layer) {
    	if (layer == "M") player.B.points = new Decimal(0)
        if (layers[layer].row > this.row) layerDataReset("B")
    },
    branches: ["M"],
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
	if (hasChallenge("B", 12)) gain4 = gain4.times(2)
	if (hasUpgrade("B", 22)) gain4 = gain4.times(2)
	if(hasMilestone("C", 0)) gain4 = gain4.times(3)
	hat = new Decimal(100)
	hat = hat.plus(getBuyableAmount("B", 12).times(25))
	if (hasUpgrade("B", 11)) hat = hat.times(2)
	if (hasUpgrade("B", 13)) hat = hat.times(2)
	if (hasUpgrade("B", 14)) hat = hat.times(2)
	if (hasUpgrade("B", 21)) hat = hat.times(2)
	if (hasUpgrade("B", 23)) hat = hat.times(2)
	if(hasMilestone("C", 0)) hat = hat.times(3)
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
    infoboxes: {
        warning: {
            title: "Warning",
            body() { return "If any of your battery upgrades amount exceed 20 (or have an large amount of cost, or you are softlocked) then please go to options and click Fix Battery Upgrades." },
        }
    },
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
        12: {
            name: "Ineffective Learning",
            challengeDescription: "Reset sticks, wood and stick and wood upgrades, and divide experience, stick and wood gain by 100, disable recoveries",
            goalDescription: "Get 1M experience",
            rewardDescription: "Unlock the magnet layer, and double charge gain",
            style: {
	              "border-radius": "5% / 5%"
            },
            unlocked() {return hasUpgrade("B", 21)},
            onEnter() {
            	player.points = new Decimal(10),
                player.S.points = new Decimal(0),
                player.W.points = new Decimal(0),
                player.S.upgrades = [],
                player.W.upgrades = []
            },
            canComplete: function() {return player.points.gte("1e6")}
        },
        13: {
            name: "Tree Roots",
            challengeDescription: "Reset sticks, wood and stick and wood upgrades, and square root wood, sticks and experience, disable recoveries",
            goalDescription: "Get 1e9 experience",
            rewardDescription: "Double capacity and unlock fire stages",
            style: {
	              "border-radius": "5% / 5%"
            },
            unlocked() {return hasUpgrade("S", 41)},
            onEnter() {
            	player.points = new Decimal(10),
                player.S.points = new Decimal(0),
                player.W.points = new Decimal(0),
                player.S.upgrades = ["41"],
                player.W.upgrades = []
            },
            canComplete: function() {return player.points.gte("1e9")}
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
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
            	player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
            	player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
		cost: new Decimal(600),
		unlocked() { return hasUpgrade("TI", 13) },
		style: {
	              "border-radius": "5% / 5%"
        }
	    },
	    14:{
		title: "Static Electricity",
		description: "Unlock another buyable and double capacity",
		cost: new Decimal(1250),
		unlocked() { return hasUpgrade("TR", 13) },
		style: {
	              "border-radius": "5% / 5%"
        }
	    },
	    21:{
		title: "Training",
		description: "Unlock another challenge and double capacity",
		cost: new Decimal(2000),
		unlocked() { return hasUpgrade("B", 14) },
		style: {
	              "border-radius": "5% / 5%"
        }
	    },
	    22:{
		title: "Electrified Sticks",
		description: "Double stick gain, and double charge gain.",
		cost: new Decimal(3000),
		unlocked() { return hasUpgrade("R", 24) },
		style: {
	              "border-radius": "5% / 5%"
        }
	    },
	    23:{
		title: "Energized Skill",
		description: "Double experience gain, double capacity",
		cost: new Decimal(5000),
		unlocked() { return hasUpgrade("B", 22) },
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
    ["infobox", "warning"],
    "blank",
	"buyables",
	"blank",
    ["microtabs", "stuff"]
    ]
}),

addLayer("M", {
    name: "Magnets", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked(){return hasChallenge("B", 12) },
	points: new Decimal(0),
	resetTime: new Decimal(0),
	cloth: new Decimal(0),
	plastic: new Decimal(0),
	box: new Decimal(0),
	spoon: new Decimal(0),
	bottle: new Decimal(0),
	att: new Decimal(0),
	best: new Decimal(0),
	cash: new Decimal(0)
    }},
    nodeStyle: {
    	"background": "linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(0,0,255,1) 100%)",
        "background-origin": "border-box"
    },
    doReset(reset) {
    	if (reset == "F") player.M.cash = new Decimal(0)
        if (layers[reset].row > this.row) layerDataReset("M")
    },
    microtabs: {
        stuff: {
            Upgrades: {
                content: [
                    "upgrades"
                ],
                unlocked() {return player.M.points.gte(2)}
            },
            Attraction: {
                content: [
                    ["display-text", function() {
                    	return "Here you can use your magnets to attract!"
                        	
                    }],
                    "blank",
                    ["buyable", 11]
                ],
                unlocked() {return player.M.points.gte(1)}
            },
            Inventory: {
                content: [
                    ["display-text", function() { 
                    	if(player.M.bottle.gte(1))
                            return "You have "+format(player.M.bottle)+" bottles, which sell for "+format(player.M.bottle)+" cash."
                    }],
                    ["display-text", function() { 
                    	if(player.M.spoon.gte(1))
                            return "You have "+format(player.M.spoon)+" spoons, which sell for "+format(player.M.spoon.times(2))+" cash."
                    }],
                    ["display-text", function() { 
                    	if(player.M.box.gte(1))
                            return "You have "+format(player.M.box)+" boxes, which sell for "+format(player.M.box.times(4))+" cash."
                    }],
                    ["display-text", function() { 
                    	if(player.M.plastic.gte(1))
                            return "You have "+format(player.M.plastic)+" plastic, which sell for "+format(player.M.plastic.times(8))+" cash."
                    }],
                    ["display-text", function() { 
                    	if(player.M.cloth.gte(1))
                            return "You have "+format(player.M.cloth)+" cloth, which sell for "+format(player.M.cloth.times(16))+" cash."
                    }],
                    ["buyable", 12]
                ],
                unlocked() {return player.M.points.gte(1)}
            },
            Shop: {
                content: [
                    ["display-text", function() { return "You have "+format(player.M.cash)+" cash" }],
                    ["row", [ ["buyable", 13], ["buyable", 14], ["buyable", 15] ] ]
                ],
                unlocked() {return player.M.points.gte(1)}
            }
        }
    },
    color: "#7303fc",
    requires: new Decimal(500), // Can be a function that takes requirement increases into account
    resource: "magnets", // Name of prestige currency
    baseResource: "power", // Name of resource prestige is based on
    baseAmount() {return player.B.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "M: Reset for Magnets.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    resetDescription: "Create ",
    buyables: {
    	    11: { // Attraction Button
            	cost: new Decimal(2500),
		        title: "Attract",
            	display() { return "Attract from a random spot for a chance to get an object" },
            	canAfford() { return true },
            	buy() {
            	    if (Math.floor( Math.random() * 17) == 16 && hasUpgrade("M", 13) ) {
			            player.M.cloth = player.M.cloth.plus(1)
			            player.M.att = new Decimal(5)
			            console.log("cloth")
			            console.log(player.M.att)
			        }
            	    else if (Math.floor( Math.random() * 9) == 8 && hasUpgrade("M", 13) ) {
			            player.M.plastic = player.M.plastic.plus(1)
			            player.M.att = new Decimal(4)
			            console.log("plastic")
			            console.log(player.M.att)
			        }
			        else if (Math.floor( Math.random() * 5) == 4) {
			            player.M.box = player.M.box.plus(1)
			            player.M.att = new Decimal(3)
			            console.log("box")
			            console.log(player.M.att)
			        }
			        else if (Math.floor(Math.random() * 3) == 2 ) {
			            player.M.spoon = player.M.spoon.plus(1)
			            player.M.att = new Decimal(2)
			            console.log("spoon")
			            console.log(player.M.att)
			        }
			        else
			            player.M.bottle = player.M.bottle.plus(1) // amt
			            player.M.att = new Decimal(1) // id
			            console.log(Math.floor(Math.random() * 3))
            	},
                style: {
	              "background": "linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(0,0,255,1) 100%)",
	              "background-origin": "border-box",
	              "border-radius": "0%"
                }
	        },
            12: { // Sell All
            	cost: new Decimal(2500),
		        title: "Sell All",
            	display() { 
            	    let lol = player.M.bottle.plus(player.M.spoon.times(2).plus(player.M.box.times(4).plus(player.M.plastic.times(8).plus(player.M.cloth.times(16)))))
                    if(hasUpgrade("M", 12)) lol = lol.times(upgradeEffect("M", 12)).plus(1)
                    if(hasMilestone("C", 0)) lol = lol.times(3)
                    return "Sell your objects which gives you "+format(lol)+" cash."},
            	canAfford() { return true },
            	buy() {
            	    let smth = player.M.bottle.plus(player.M.spoon.times(2).plus(player.M.box.times(4).plus(player.M.plastic.times(8).plus(player.M.cloth.times(16)))))
                    if(hasUpgrade("M", 12)) smth = smth.times(upgradeEffect("M", 12)).plus(1)
                    if(hasMilestone("C", 0)) smth = smth.times(3)
                    player.M.cash = player.M.cash.plus(smth)
			        player.M.bottle = new Decimal(0)
			        player.M.spoon = new Decimal(0)
			        player.M.box = new Decimal(0)
			        player.M.plastic = new Decimal(0)
			        player.M.cloth = new Decimal(0)
            	},
                style: {
	              "background": "linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(0,0,255,1) 100%)",
	              "background-origin": "border-box",
	              "border-radius": "0%"
                }
	        },
	        13: {
        	cost() {
                    return new Decimal(25).pow(new Decimal(1.04).pow(getBuyableAmount(this.layer, this.id)) )
            },
            style: {
	              "background": "linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(0,0,255,1) 100%)",
	              "background-origin": "border-box",
                },
		title() { return "Attracted EXP - "+getBuyableAmount(this.layer, this.id)},
        	display() { return "Attract stray EXP, which is multiplying your experience gain by ×"+format(getBuyableAmount(this.layer, this.id).times(0.1).plus(1))+"<br>Cost: "+format(this.cost())+" Cash</br>"},
		unlocked() { return true},
        	canAfford() { return player.M.cash.gte( this.cost() ) },
        	buy() {
            	player[this.layer].cash = player[this.layer].cash.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        	}
	},
	14: {
        	cost() {
                    return new Decimal(50).pow(new Decimal(1.04).pow(getBuyableAmount(this.layer, this.id)) )
            },
            style: {
	              "background": "linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(0,0,255,1) 100%)",
	              "background-origin": "border-box"
                },
		title() { return "Magnetized Sticks - "+getBuyableAmount(this.layer, this.id)},
        	display() { return "Magnetize sticks, which is multiplying stick gain by ×"+format(getBuyableAmount(this.layer, this.id).times(0.1).plus(1))+"<br>Cost: "+format(this.cost())+" Cash</br>"},
		unlocked() { return hasUpgrade("M", 11) },
        	canAfford() { return player.M.cash.gte( this.cost() ) },
        	buy() {
            	player[this.layer].cash = player[this.layer].cash.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        	}
	},
	15: {
        	cost() {
                    return new Decimal(500).pow(new Decimal(1.04).pow(getBuyableAmount(this.layer, this.id)) )
            },
            style: {
	              "background": "linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(0,0,255,1) 100%)",
	              "background-origin": "border-box",
                },
		title() { return "Red N' Blue - "+getBuyableAmount(this.layer, this.id)},
        	display() { return "Color wood red and blue, which is multiplying wood by ×"+format(getBuyableAmount(this.layer, this.id).times(0.1).plus(1))+"<br>Cost: "+format(this.cost())+" Cash</br>"},
		unlocked() { return hasUpgrade("M", 13) },
        	canAfford() { return player.M.cash.gte( this.cost() ) },
        	buy() {
            	player[this.layer].cash = player[this.layer].cash.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        	}
	},
    },
    upgrades: {
	    11: {
		title: "Magnetricting",
		description: "Unlock more shop buyables",
		cost: new Decimal(1),
		unlocked() {return player.M.points.gte(2)}
	    },
	    12: {
		title: "Cash grows on trees",
		description: "Tree centimeters boost cash gained from selling",
		cost: new Decimal(75),
		currencyDisplayName: "cash",
		currencyInternalName: "cash",
		currencyLayer: "M",
		unlocked() {return hasUpgrade(this.layer, 11)},
		effect() { return player.TR.points.log10().pow(0.2) },
		effectDisplay() { return format(upgradeEffect("M", 12).plus(1))+"x" },
		tooltip: "log(x)^0.2"
	    },
	    13: {
		title: "Monopoly",
		description: "Unlock more shop buyables and unlock more objects",
		cost: new Decimal(250),
		currencyDisplayName: "cash",
		currencyInternalName: "cash",
		currencyLayer: "M",
		unlocked() {return hasUpgrade(this.layer, 12)}
	    },
	    14: {
		title: "The end of the beginning",
		description: "Unlock more stick upgrades",
		cost: new Decimal(5),
		currencyDisplayName: "cloth",
		currencyInternalName: "cloth",
		currencyLayer: "M",
		unlocked() {return hasUpgrade(this.layer, 13)}
	    }
    },
    layerShown(){return hasChallenge("B", 12) },
    tabFormat: [
    	"main-display",
        "resource-display",
	    "prestige-button",
    	"blank",
    	["microtabs", "stuff"]
    ]
}),

addLayer("F", {
    name: "Fire Stages", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked() { return hasChallenge("B", 13) },
	points: new Decimal(0),
	total: new Decimal(0),
	fp: new Decimal(0)
    }},
    branches: ["C"],
    microtabs: {
        stuff: {
            Milestones: {
                content: [
                    "milestones"
                ],
                unlocked() {return player.M.points.gte(2)}
            },
            Sacrifice: {
                content: [
                    ["display-text", function() {
                    	return "Sacrifice your tin for a fire point."
                    }],
                    ["display-text", function() { return "You have "+player.F.fp+" fire points" }, {"color": "red"} ],
                    "blank",
                    ["buyable", 11],
                    "blank",
                    "upgrades"
                ],
                unlocked() {return player.F.points.gte(2)}
            },
        }
    },
    color: "#e03a3a",
    requires: new Decimal(500), // Can be a function that takes requirement increases into account
    resource: "fire stages", // Name of prestige currency
    baseResource: "cash", // Name of resource prestige is based on
    baseAmount() {return player.M.cash}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
    	exp = 1.5
        return exp
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "F: Reset for a Fire stage.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    buyables: {
    	11: {
        	cost: new Decimal(3),
            style: {
	              "border-radius": "25%",
	              "height": "125px",
	              "width": "175px",
	              "border": "5px solid",
	              "border-color": "rgba(0, 0, 0, 0.125)"
                },
		title() { return "Sacrifice for +1 fire point"},
        	display() { return "Req: "+player.TI.points+"/3 tin"},
        	canAfford() { return player.TI.points.gte(3) },
        	buy() {
            	player.TI.points = new Decimal(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.F.fp = player.F.fp.plus(1)
        	}
	},
	},
	upgrades: {
		11: {
		    title: "Fahrenheit Sticks",
		    description: "x10 sticks",
		    cost: new Decimal(1),
		    style: {
			    "border-radius": "50%"
			},
			currencyDisplayName: "fire points",
		    currencyInternalName: "fp",
		    currencyLayer: "F"
	    },
	    21: {
		    title: "Volcanic Experience",
		    description: "x10 experience",
		    cost: new Decimal(1),
		    style: {
			    "border-radius": "50%"
			},
			currencyDisplayName: "fire points",
		    currencyInternalName: "fp",
		    currencyLayer: "F"
	    },
	    31: {
		    title: "Scorching Wood",
		    description: "x10 wood, more recoveries!!",
		    cost: new Decimal(1),
		    style: {
			    "border-radius": "50%"
			},
			unlocked() { return hasAchievement("ACH", 75) },
			currencyDisplayName: "fire points",
		    currencyInternalName: "fp",
		    currencyLayer: "F"
	    },
	    41: {
		    title: "Burning Speed",
		    description: "x100 research per researcher, unlock new tech",
		    cost: new Decimal(1),
		    style: {
			    "border-radius": "50%"
			},
			unlocked() { return hasUpgrade("F", 31) },
			currencyDisplayName: "fire points",
		    currencyInternalName: "fp",
		    currencyLayer: "F"
	    },
	},
    milestones: {
    	0: {
        	requirementDescription: "Fire Stage 1",
        	effectDescription: "Unlock tier 2 stick upgrades, more recoveries",
        	done() { return player.F.points.gte(1) }
    	},
        1: {
        	requirementDescription: "Fire Stage 2",
        	effectDescription: "Unlock sacrifice, more researcher upgrades",
        	done() { return player.F.points.gte(2) && hasUpgrade("AD", 11) },
            unlocked() { return hasUpgrade("AD", 11) }
    	}
    },
    resetDescription: "Evolve for ",
    layerShown(){ return hasChallenge("B", 13) },
    tabFormat: [
    	["display-text", function() { return "You are on Fire Stage <em>"+player.F.points+"</em>"}, { "color": "red", "font-size": "32px"}],
    	"resource-display",
	    "prestige-button",
	    "blank",
	    ["microtabs", "stuff"]
    ],
    tooltip() { return "Fire Stage "+player.F.points },
    nodeStyle: {
    	background: "radial-gradient(circle, rgba(255,255,0,1) 0%, rgba(255,0,0,1) 100%)",
    	"background-origin": "border-box"
    },
}),

addLayer("AD", {
    name: "Antimatter Dimensions", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "AD", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked() { return hasUpgrade("S", 43) },
	    points: new Decimal(0),
	    best: new Decimal(0),
	    resetTime: new Decimal(0),
	    tick: new Decimal(1),
	    one: new Decimal(0),
	    onem: new Decimal(1),
	    two: new Decimal(0),
	    twom: new Decimal(1),
	    threem: new Decimal(1),
	    fourm: new Decimal(1),
	    cap: new Decimal(2), // get tickspeed hardcapped
	    ant: new Decimal("2e8")
    }},
    nodeStyle: {
    	background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(0,0,0,1) 100%)",
    	"background-origin": "border-box",
        width: "120px",
        height: "120px",
        "font-size": "60px"
    },
    color: "#ffffff",
    requires: new Decimal(0), // Can be a function that takes requirement increases into account
    resource: "antimatter", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    calculateAnti() { // Calculate antimatter gain (runs at 30 milli)
        onem = new Decimal(1) // one multiplier
        if ( hasAchievement("AD", 14) ) onem = onem.times(player.points.plus(1).log10().pow(0.1))
        player.AD.onem = onem // set display onem
    	gain = new Decimal(1) // Antimatter per second
        one = new Decimal(0) // 1st dimensions per second
        two = new Decimal(0) // 2nd dimensions per second
        three = new Decimal(0) // 3rd dimensions per second
        one = one.plus(getBuyableAmount("AD", 12).times(0.1)) // Dim 1 polynomial by dim 2
        two = two.plus(getBuyableAmount("AD", 13).times(0.1)) // Dim 2 polynomial by dim 3
        three = three.plus(getBuyableAmount("AD", 14).times(0.1)) // Dim 3 polynomial by dim 4
        gain = gain.plus(getBuyableAmount("AD", 11).times(onem)) // Dim 1 * One multi
        gain = gain.times(player.AD.tick) // tickspeed
        one = one.times(player.AD.tick) // tickspeed
        two = two.times(player.AD.tick) // tickspeed
        three = three.times(player.AD.tick) // tickspeed
        onereal = one.div(30) // divide
        tworeal = two.div(30) // divide
        threereal = three.div(30) // divide
        real = gain.div(30) // Divide by 30 mills so its actually seconds.
        if( tmp.AD.layerShown ) if(player.AD.points.lt(player.AD.ant)) player.AD.points = player.AD.points.plus(real) // Add antimatter
        if(player.AD.points.lt(player.AD.ant)) setBuyableAmount(this.layer, 11, getBuyableAmount(this.layer, 11).plus(onereal))
        if(player.AD.points.lt(player.AD.ant)) setBuyableAmount(this.layer, 12, getBuyableAmount(this.layer, 12).plus(tworeal))
        if(player.AD.points.lt(player.AD.ant)) setBuyableAmount(this.layer, 13, getBuyableAmount(this.layer, 13).plus(threereal))
        return gain
    },
    news: "test",
    buyables: {
    	11: { // Dim 1
        	cost() {
                    return new Decimal(10).plus(getBuyableAmount(this.layer, this.id).times(15))
            },
            style: {
	              "width": "125px",
	              "height": "75px",
	              "border-radius": "0%"
                },
		title() { return "1st Dimension"},
        	display() { return "Cost: "+format(this.cost())+" Antimatter"},
        	canAfford() { return player.AD.points.gte( this.cost() ) },
        	buy() {
            	let first = new Decimal(10)
                let exp = new Decimal(15)
                let most = first.plus(getBuyableAmount(this.layer, this.id).times(exp))
                let max = player[this.layer].points.div(most).floor()
                player[this.layer].points = player[this.layer].points.sub(most)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
        	}
	},
	12: { // Dim 2
        	cost() {
                    return new Decimal(100).plus(getBuyableAmount(this.layer, this.id).times(150))
            },
            unlocked() {return hasAchievement(this.layer, 11)},
            style: {
	              "width": "125px",
	              "height": "75px",
	              "border-radius": "0%"
                },
		title() { return "2nd Dimension"},
        	display() { return "Cost: "+format(this.cost())+" Antimatter"},
        	canAfford() { return player.AD.points.gte( this.cost() ) },
        	buy() {
            	let first = new Decimal(100)
                let exp = new Decimal(150)
                let most = first.plus(getBuyableAmount(this.layer, this.id).times(exp))
                let max = player[this.layer].points.div(most).floor()
                player[this.layer].points = player[this.layer].points.sub(most)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                setBuyableAmount(this.layer, 11, new Decimal(0))
        	}
	},
	13: { // Dim 3
        	cost() {
                    return new Decimal(1000).plus(getBuyableAmount(this.layer, this.id).times(1500))
            },
            unlocked() {return hasAchievement(this.layer, 12)},
            style: {
	              "width": "125px",
	              "height": "75px",
	              "border-radius": "0%"
                },
		title() { return "3rd Dimension"},
        	display() { return "Cost: "+format(this.cost())+" Antimatter"},
        	canAfford() { return player.AD.points.gte( this.cost() ) },
        	buy() {
            	let first = new Decimal(1000)
                let exp = new Decimal(1500)
                let most = first.plus(getBuyableAmount(this.layer, this.id).times(exp))
                let max = player[this.layer].points.div(most).floor()
                player[this.layer].points = player[this.layer].points.sub(most)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                setBuyableAmount(this.layer, 11, new Decimal(0))
                setBuyableAmount(this.layer, 12, new Decimal(0))
        	}
	},
	14: { // Dim 4
        	cost() {
                    return new Decimal(10000).plus(getBuyableAmount(this.layer, this.id).times(5000000000))
            },
            unlocked() {return hasAchievement(this.layer, 15)},
            style: {
	              "width": "125px",
	              "height": "75px",
	              "border-radius": "0%"
                },
		title() { return "4th Dimension"},
        	display() { return "Cost: "+format(this.cost())+" Antimatter"},
        	canAfford() { return player.AD.points.gte( this.cost() ) },
        	buy() {
            	let first = new Decimal(10000)
                let exp = new Decimal(5000000000)
                let most = first.plus(getBuyableAmount(this.layer, this.id).times(exp))
                let max = player[this.layer].points.div(most).floor()
                player[this.layer].points = player[this.layer].points.sub(most)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                setBuyableAmount(this.layer, 11, new Decimal(0))
                setBuyableAmount(this.layer, 12, new Decimal(0))
                setBuyableAmount(this.layer, 13, new Decimal(0))
        	}
	},
	21: { // Tickspeed
        	cost() {
                    return new Decimal(1000).times(new Decimal(10).pow(getBuyableAmount(this.layer, this.id)))
            },
            style: {
	              "width": "175px",
	              "height": "125px",
	              "border-radius": "0%"
                },
		title() { return "Increase Tickspeed"},
        	display() { return "Cost: "+format(this.cost())+" Antimatter <br> Tickspeed: "+player.AD.tick+"/s</br>"+"<br> You have a tickspeed maximum of "+format(new Decimal(2).pow(player.AD.cap))+"/s </br>"},
        	canAfford() { return player.AD.points.gte( this.cost() ) && getBuyableAmount(this.layer, this.id).lt(player.AD.cap) },
        	buy() { // Each buy, x10, buy maxx
            	let first = new Decimal(1000)
                let exp = new Decimal(10)
                let most = first.times(exp.pow(getBuyableAmount(this.layer, this.id)))
                let max = player[this.layer].points.div(most).floor()
                player[this.layer].points = player[this.layer].points.sub(most)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max))
                player.AD.tick = player.AD.tick.times(2)
                setBuyableAmount(this.layer, 11, new Decimal(0))
                setBuyableAmount(this.layer, 12, new Decimal(0))
                setBuyableAmount(this.layer, 13, new Decimal(0))
                setBuyableAmount(this.layer, 14, new Decimal(0))
        	}
	},
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){ return hasUpgrade("S", 43) },
    microtabs: {
        stuff: {
            Dimensions: {
                content: [
                    "blank",
                    ["buyable", 21],
                    "blank",
                    ["row", [ ["display-text", function() { return "<b>You have "+format(getBuyableAmount("AD", 11))+" 1st dimensions <br>×"+format(player.AD.onem)+"</br></b>"}, { "font-size": "16px"}], "blank", ["buyable", 11]] ],
                    "blank",
                    ["row", [ ["display-text", function() { return "<b>You have "+format(getBuyableAmount("AD", 12))+" 2nd dimensions <br>×"+format(player.AD.twom)+"</br></b>"}, { "font-size": "16px"}], "blank", ["buyable", 12]] ],
                    "blank",
                    ["row", [ ["display-text", function() { return "<b>You have "+format(getBuyableAmount("AD", 13))+" 3rd dimensions <br>×"+format(player.AD.threem)+"</br></b>"}, { "font-size": "16px"}], "blank", ["buyable", 13]] ],
                    "blank",
                    ["row", [ ["display-text", function() { return "<b>You have "+format(getBuyableAmount("AD", 14))+" 4th dimensions <br>×"+format(player.AD.fourm)+"</br></b>"}, { "font-size": "16px"}], "blank", ["buyable", 14]] ]
                ],
            },
            Upgrades: {
                content: [
                    "upgrades"
                ],
            },
            Achievements: {
            	content: [
                    "achievements"
                ],
            }
        }
    },
    achievements: {
    	11: {
        	name: "start... somewhere",
        	done() { return player.AD.points.gte(100) },
		    tooltip: "get 100 antimatter <br>reward: unlock the 2nd dimension</br>",
		    image: "resources/Adch1.png"
    	},
        12: {
        	name: "2 antimatter = 2 dimensions?",
        	done() { return getBuyableAmount(this.layer, 12).gte(1) },
		    tooltip: "Get the 2nd dimension <br> Reward: unlock the 3rd dimension </br>",
		    image: "resources/Adch2.png"
    	},
        13: {
        	name: "usain bolt",
        	done() { return getBuyableAmount(this.layer, 21).gte(1) },
		    tooltip: "Increase your tickspeed",
		    image: "resources/Adch3.png"
    	},
        14: {
        	name: "thirty third",
        	done() { return getBuyableAmount(this.layer, 13).gte(3) },
		    tooltip: "have 3 3rd dimensions <br> reward: experience boosts dimension 1 production </br>",
		    image: "resources/Adch4.png"
    	},
        15: {
        	name: "cheat-tah",
        	done() { return getBuyableAmount(this.layer, 21).gte(2) },
		    tooltip: "Increase your tickspeed 2 times <br> reward: unlock 4th dimension </br>",
		    image: "resources/Adch5.png"
    	},
        16: {
        	name: "family friendly",
        	done() { return getBuyableAmount(this.layer, 14).gte(1) },
		    tooltip: "have 1 4th dimension <br> reward: a very huge cost scale :troll: </br>",
		    image: "resources/Adch6.png"
    	},
    },
    upgrades: {
	    11: {
		title: "Thats so lit!",
		description: "Unlock more fire stage milestones, unlock a new recovery",
		cost: new Decimal("1e6"),
		unlocked() { return hasAchievement("ACH", 65) }
	    },
    },
    tabFormat: [
        ["display-text", function() { return player.AD.news }, { "font-size": "20px"}],
    	"main-display",
        ["display-text", function() { return "You are making <b><font size=+1>"+format(tmp.AD.calculateAnti)+"</b></font> antimatter/s"}, { "font-size": "20px"}],
        "resource-display",
        ["display-text", function() { if(player.AD.points.gte(player.AD.ant))return "You have the maximum antimatter! <br>Maximum antimatter: "+format(player.AD.ant)+"</br>"}, { "color": "red", "font-size": "32px"}],
	    "blank",
	    ["microtabs", "stuff"]
    ]
}),

setInterval(function () { // news ticker
                dice = Math.floor( Math.random() * 76 )
                if ( dice == 0 )
                    player.AD.news = "Why am i here..."
                if ( dice == 1 )
                    player.AD.news = "AntiExcavation Discoveries"
                if ( dice == 2 )
                    player.AD.news = "Breaking news: No one cares"
                if ( dice == 3 )
                    player.AD.news = "It's the apocalypse!!"
                if ( dice == 4 )
                    player.AD.news = "Boring news..."
                if ( dice == 5 )
                    player.AD.news = "Its not a collab guys..."
                if ( dice == 6 )
                    player.AD.news = "Baba is not you"
                if ( dice == 7 )
                    player.AD.news = "Functioning news ticker? No way."
                if ( dice == 8 )
                    player.AD.news = "Why is it exclusive?"
                if ( dice == 9 )
                    player.AD.news = "If you are incremental, clap your hands.."
                if ( dice == 10 )
                    player.AD.news = "AntimatterettamitnA"
                if ( dice == 11 )
                    player.AD.news = "Its sad. :("
                if ( dice == 12 )
                    player.AD.news = "THIS IS COPY!1!1!1 - mobile game ad player"
                if ( dice == 13 )
                    player.AD.news = "13, the unlucky number"
                if ( dice == 14 )
                    player.AD.news = "Look behind you!"
                if ( dice == 15 )
                    player.AD.news = "Can you catch all news messages?"
                if ( dice == 16 )
                    player.AD.news = "Its a dream!"
                if ( dice == 17 )
                    player.AD.news = "Are you sure about that? Are you-"
                if ( dice == 18 )
                    player.AD.news = "Stop. Look up."
                if ( dice == 19 )
                    player.AD.news = "Matter Excavations"
                if ( dice == 20 )
                    player.AD.news = "Do not read this news ticker. Please. I am begging you. Too late you are cursed now..."
                if ( dice == 21 )
                    player.AD.news = "You need to touch "+format(player.AD.points)+" grass."
                if ( dice == 22 )
                    player.AD.news = "Get softcapped. Wait, actually get HARD RESETED"
                if ( dice == 23 )
                    player.AD.news = "Who wrote news tickers? Well it all started with the big bang-"
                if ( dice == 24 )
                    player.AD.news = "Do your homework first before playing..."
                if ( dice == 25 )
                    player.AD.news = "-.-.-.-.-.-.--.-.-.-.-.-.--.--.----.--.-.-."
                if ( dice == 26 )
                    player.AD.news = "Dont trust them. By them i mean the NEWS TICKERS! But then that means you wont trust this one..."
                if ( dice == 27 )
                    player.AD.news = "Did you wait 5 minutes?"
                if ( dice == 28 )
                    player.AD.news = "Who is better... CFI... or GCI... or... Both?"
                if ( dice == 29 )
                    player.AD.news = "The news ticker before this one was 100% true."
                if ( dice == 30 )
                    player.AD.news = "The news ticker after this is 100% false."
                if ( dice == 31 )
                    player.AD.news = "The news ticker before this is the game's opinion."
                if ( dice == 32 )
                    player.AD.news = "The news ticker after this was written by a child."
                if ( dice == 33 )
                    player.AD.news = "News tickers are 1% faster!"
                if ( dice == 34 )
                    player.AD.news = "This was written by an adult. (ReAl)"
                if ( dice == 35 )
                    player.AD.news = "Quote the news ticker after this in a messaging app."
                if ( dice == 36 )
                    player.AD.news = "Make sure to hit that subscribe button..."
                if ( dice == 37 )
                    player.AD.news = "WHY IS IT NOT SCROLLING :("
                if ( dice == 38 )
                    player.AD.news = "Easy Medium Hard Difficult. Whats next?"
                if ( dice == 39 )
                    player.AD.news = "The news ticker before this was a fake one"
                if ( dice == 40 )
                    player.AD.news = "The news ticker after this describes the news ticker after it."
                if ( dice == 41 )
                    player.AD.news = "Not stolen from hevi"
                if ( dice == 42 )
                    player.AD.news = "True endgame... Is to get all achievements!"
                if ( dice == 43 )
                    player.AD.news = "Mercury cannot be colonized as both sides are extremely hot and cold "
                if ( dice == 44 )
                    player.AD.news = "Whoops, were running out of ideas !!"
                if ( dice == 45 )
                    player.AD.news = "This is not news at all! It's olds!"
                if ( dice == 46 )
                    player.AD.news = "*Insert a funny joke here*"
                if ( dice == 47 )
                    player.AD.news = "You better laughed at the previous news ticker."
                if ( dice == 48 )
                    player.AD.news = "FibbonacciccanobbiF"
                if ( dice == 49 )
                    player.AD.news = "Dont check out the code for this, its jumbled around"
                if ( dice == 50 )
                    player.AD.news = "Halfway from 100! Let's go!!!"
                if ( dice == 51 )
                    player.AD.news = "Shoutout to AOAIWJN128J(#82("
                if ( dice == 52 )
                    player.AD.news = "Breaking News: Local man in possesion of antimatter"
                if ( dice == 53 )
                    player.AD.news = "Would you rather have no tin or have no stone?"
                if ( dice == 54 )
                    player.AD.news = "Why is this here? This aint relevant.."
                if ( dice == 55 )
                    player.AD.news = "Never gonna give you up, never gonna let you down"
                if ( dice == 56 )
                    player.AD.news = "If you said you were telling lies then when you said that would be a lie.."
                if ( dice == 57 )
                    player.AD.news = "Paradox"
                if ( dice == 58 )
                    player.AD.news = "2.718281828459045"
                if ( dice == 59 )
                    player.AD.news = "What's e^iπ + 1?"
                if ( dice == 60 )
                    player.AD.news = "3.14159265"
                if ( dice == 61 )
                    player.AD.news = "Wheres Wally?"
                if ( dice == 62 )
                    player.AD.news = "Roman Tower"
                if ( dice == 63 )
                    player.AD.news = "Sheesh bro, you played this for "+formatTime(player.timePlayed)+"!?!?"
                if ( dice == 64 )
                    player.AD.news = "Super Mario 64"
                if ( dice == 65 )
                    player.AD.news = "This isnt excavation is it?"
                if ( dice == 66 )
                    player.AD.news = "Too much news for your brain to handle.."
                if ( dice == 67 )
                    player.AD.news = "Breaking News: Local airplane spotted with 10 tons of.. sticks?"
                if ( dice == 68 )
                    player.AD.news = "Breaking News: Local man spotted stealing "+format(player.TI.points)+" tin!"
                if ( dice == 69 )
                    player.AD.news = "Breaking News: Local Tree spotted that has grown "+format(player.TR.points)+" cm!"
                if ( dice == 70 )
                    player.AD.news = "Breaking News: Local news ticker spreading fake news. Dont believe everything you see."
                if ( dice == 71 )
                    player.AD.news = "Breaking News: Today we will be repairing news, because someone broke it."
                if ( dice == 72 )
                    player.AD.news = "Are yah sure about that"
                if ( dice == 73 )
                    player.AD.news = "Krusty Krab, The most delicious burgers! Call now."
                if ( dice == 74 )
                    player.AD.news = "Krusty Krab, no health inspectors has come in. Call now."
                if ( dice == 75 )
                    player.AD.news = "Simon says... laugh at the news ticker after this one."
}, 5000)