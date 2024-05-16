addLayer("C", { // row 4 -> row 6
    name: "Coal", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked() { return hasUpgrade("T", 42) },
	points: new Decimal(0),
	total: new Decimal(0),
	mini: new Decimal(0),
	mp: new Decimal(0)
    }},
    color: "#7a7a7a",
    nodeStyle: {
    	"color": "#ffffff",
        "background-color": "#1f1f1f",
        "border-radius": "100% 25% 0%",
    },
    requires: new Decimal(2), // Can be a function that takes requirement increases into account
    resource: "coal", // Name of prestige currency
    baseResource: "fire stage", // Name of resource prestige is based on
    baseAmount() {return player.F.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for Coal.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    milestones: {
    	0: {
        	requirementDescription: "1 Total Coal",
        	effectDescription: "Unlock more recoveries, x3 cash, x3 charge gain, x3 battery capacity, x3 wood, x3 sticks",
        	done() { return player.C.total.gte(1) },
    	},

    },
    buyables: {
    	11: {
        	cost() {
                    return new Decimal(1)
            },
            style: {
	              "color": "#ffffff",
	              "width": "120px",
	              "height": "120px",
	              "font-size": "10px"
                },
		title() { return "Tening - "+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit},
        	display() { return "x10 mini resources, multiplying your mini resources gain by ×"+format(getBuyableAmount(this.layer, this.id).times(10).plus(1))+"<br>Cost: "+format(this.cost())+" Mini points</br>"},
		unlocked() { return player.mti.points.gte(1) && player.C.points.gte(1) },
        	canAfford() { return player.C.mp.gte( this.cost() ) },
            purchaseLimit: 5,
            branches: [21, 22],
        	buy() {
            	player[this.layer].mp = player[this.layer].mp.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        	}
	},
	21: {
        	cost() {
                    return new Decimal(1)
            },
            style: {
	              "color": "#ffffff",
	              "width": "120px",
	              "height": "120px",
	              "font-size": "10px"
                },
		title() { return "Coal Fried EXP - "+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit},
        	display() { return "x2 experience, multiplying your experience by ×"+format(getBuyableAmount(this.layer, this.id).times(2).plus(1))+"<br>Cost: "+format(this.cost())+" Mini points</br>"},
		unlocked() { return getBuyableAmount("C", 11).gte(1) },
        	canAfford() { return player.C.mp.gte( this.cost() ) },
            purchaseLimit: 5,
            branches: [31, 32],
        	buy() {
            	player[this.layer].mp = player[this.layer].mp.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        	}
	},
	22: {
        	cost() {
                    return new Decimal(1)
            },
            style: {
	              "color": "#ffffff",
	              "width": "120px",
	              "height": "120px",
	              "font-size": "10px"
                },
		title() { return "Microscopik Stiks - "+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit},
        	display() { return "x2 mini sticks, multiplying your mini sticks by ×"+format(getBuyableAmount(this.layer, this.id).times(2).plus(1))+"<br>Cost: "+format(this.cost())+" Mini points</br>"},
		unlocked() { return getBuyableAmount("C", 11).gte(1) },
        	canAfford() { return player.C.mp.gte( this.cost() ) },
            purchaseLimit: 5,
            branches: [33, 34],
        	buy() {
            	player[this.layer].mp = player[this.layer].mp.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        	}
	},
	31: {
        	cost() {
                    return new Decimal(1)
            },
            style: {
	              "color": "#ffffff",
	              "width": "120px",
	              "height": "120px",
	              "font-size": "10px"
                },
		title() { return "Grilled Wood - "+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit},
        	display() { return "x2 wood, multiplying your wood by ×"+format(getBuyableAmount(this.layer, this.id).times(2).plus(1))+"<br>Cost: "+format(this.cost())+" Mini points</br>"},
		unlocked() { return getBuyableAmount("C", 21).gte(1) },
        	canAfford() { return player.C.mp.gte( this.cost() ) },
            purchaseLimit: 5,
            branches: [41],
        	buy() {
            	player[this.layer].mp = player[this.layer].mp.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        	}
	},
	32: {
        	cost() {
                    return new Decimal(1)
            },
            style: {
	              "color": "#ffffff",
	              "width": "120px",
	              "height": "120px",
	              "font-size": "10px"
                },
		title() { return "Fried Sticks - "+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit},
        	display() { return "x2 sticks, multiplying your sticks by ×"+format(getBuyableAmount(this.layer, this.id).times(2).plus(1))+"<br>Cost: "+format(this.cost())+" Mini points</br>"},
		unlocked() { return getBuyableAmount("C", 21).gte(1) },
        	canAfford() { return player.C.mp.gte( this.cost() ) },
            purchaseLimit: 5,
            branches: [41],
        	buy() {
            	player[this.layer].mp = player[this.layer].mp.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        	}
	},
	33: {
        	cost() {
                    return new Decimal(1)
            },
            style: {
	              "color": "#ffffff",
	              "width": "120px",
	              "height": "120px",
	              "font-size": "10px"
                },
		title() { return "Pico Experience - "+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit},
        	display() { return "x2 mini experience, multiplying your mini exp by ×"+format(getBuyableAmount(this.layer, this.id).times(2).plus(1))+"<br>Cost: "+format(this.cost())+" Mini points</br>"},
		unlocked() { return getBuyableAmount("C", 22).gte(1) },
        	canAfford() { return player.C.mp.gte( this.cost() ) },
            purchaseLimit: 5,
            branches: [41],
        	buy() {
            	player[this.layer].mp = player[this.layer].mp.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        	}
	},
	34: {
        	cost() {
                    return new Decimal(1)
            },
            style: {
	              "color": "#ffffff",
	              "width": "120px",
	              "height": "120px",
	              "font-size": "10px"
                },
		title() { return "Spared Sticks - "+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit},
        	display() { return "Start with 1 million mini sticks on mini tin reset"+"<br>Cost: "+format(this.cost())+" Mini points</br>"},
		unlocked() { return getBuyableAmount("C", 22).gte(1) },
        	canAfford() { return player.C.mp.gte( this.cost() ) },
            purchaseLimit: 1,
            branches: [41],
        	buy() {
            	player[this.layer].mp = player[this.layer].mp.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        	}
	},
	41: {
        	cost() {
                    return new Decimal(2)
            },
            style: {
	              "color": "#ffffff",
	              "width": "120px",
	              "height": "120px",
	              "font-size": "10px"
                },
		title() { return "Expansion - "+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit},
        	display() { return "Unlock a new upgrade in leaf layer."+"<br>Cost: "+format(this.cost())+" Mini points</br>"},
		unlocked() { return getBuyableAmount("C", 31).gte(1) && getBuyableAmount("C", 32).gte(1) && getBuyableAmount("C", 33).gte(1) && getBuyableAmount("C", 34).gte(1) },
        	canAfford() { return player.C.mp.gte( this.cost() ) },
            purchaseLimit: 1,
            branches: [51, 52],
        	buy() {
            	player[this.layer].mp = player[this.layer].mp.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        	}
	},
	51: {
        	cost() {
                    return new Decimal(1)
            },
            style: {
	              "color": "#ffffff",
	              "width": "120px",
	              "height": "120px",
	              "font-size": "10px"
                },
		title() { return "Merrier the More - "+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit},
        	display() { return "Multiply mini points by itself."+"<br>Cost: "+format(this.cost())+" Mini points</br><br> Currently: "+format(buyableEffect("C", 51))+"x"},
		unlocked() { return hasUpgrade("L", 24) && getBuyableAmount("C", 41).gte(1)},
		effect() { return player.C.mp.plus(1).log10().plus(1) },
		tooltip: "log10(x+1)+1",
        	canAfford() { return player.C.mp.gte( this.cost() ) },
            purchaseLimit: 1,
        	buy() {
            	player[this.layer].mp = player[this.layer].mp.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        	}
	},
	52: {
        	cost() {
                    return new Decimal(4)
            },
            style: {
	              "color": "#ffffff",
	              "width": "120px",
	              "height": "120px",
	              "font-size": "10px"
                },
		title() { return "I wanna win - "+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit},
        	display() { return "Unlock mini tin upgrades"+"<br>Cost: "+format(this.cost())+" Mini points</br>"},
		unlocked() { return hasUpgrade("L", 24) && getBuyableAmount("C", 41).gte(1)},
        	canAfford() { return player.C.mp.gte( this.cost() ) },
            purchaseLimit: 1,
        	buy() {
            	player[this.layer].mp = player[this.layer].mp.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        	}
	},
	},
	
    make() {
    	let gain = new Decimal(1)
        if (hasUpgrade("ms", 11)) gain = gain.times(2)
        if (hasUpgrade("ms", 12)) gain = gain.times(2)
        if (hasUpgrade("ms", 13)) gain = gain.times(2)
        if (hasUpgrade("ms", 14)) gain = gain.times(upgradeEffect("ms", 14))
        if (hasUpgrade("ms", 15)) gain = gain.times(2)
        if (hasUpgrade("mw", 11)) gain = gain.times(2)
        if (hasUpgrade("ms", 21)) gain = gain.times(2)
        if (hasUpgrade("ms", 22)) gain = gain.times(upgradeEffect("ms", 22))
        if (hasUpgrade("mw", 13)) gain = gain.times(3)
        if (hasUpgrade("mw", 15)) gain = gain.times(2)
        if (hasUpgrade("mst", 11)) gain = gain.times(3)
        if (hasUpgrade("mst", 14)) gain = gain.times(4)
        if (hasUpgrade("mw", 21)) gain = gain.times(2)
        if (hasUpgrade("mw", 23)) gain = gain.times(5)
        if (hasUpgrade("ml", 11)) gain = gain.times(3)
        if (hasUpgrade("ml", 15)) gain = gain.times(5)
        if (hasUpgrade("mr", 11)) gain = gain.times(3)
        gain = gain.times(getBuyableAmount("C", 11).times(10).plus(1)) // tening
        gain = gain.times(getBuyableAmount("C", 33).times(2).plus(1)) // pico exp
        let real = gain.div(30)
    	if (tmp.C.layerShown) player.C.mini = player.C.mini.plus(real)
        return gain
    },
    layerShown(){ return hasUpgrade("T", 42) && inArea("main")},
    isActive(){return tmp[this.layer].layerShown},
    tabFormat: [
    	"main-display",
    	"resource-display",
	    "prestige-button",
    	"blank",
    	"milestones",
        "blank",
        ["display-text", function() { return "You have <h1 style='text-shadow: 0px 0px 10px #ffffff'>"+format(player.C.mini)+"</h1> mini experience" } ],
        ["display-text", function() { return "("+format(tmp.C.make)+"/sec)" } ],
        ["display-text", "Current Endgame: 1 mini tin" ],
        ["tree", [ ["ms"], ["mw", "blank"], ["mst"], ["blank", "ml"], ["mr"], ["mti"] ] ],
        "blank",
        ["display-text", function() { return "You have "+format(player.C.mp)+" mini points." } ],
        ["row", [ ["buyable", 11] ] ],
        "blank",
        ["row", [ ["buyable", 21], "blank", ["buyable", 22] ] ],
        "blank",
        ["row", [ ["buyable", 31], "blank", ["buyable", 32], "blank", ["buyable", 33], "blank", ["buyable", 34] ] ],
        "blank",
        ["buyable", 41],
        "blank",
        ["row", [ ["buyable", 51], "blank", ["buyable", 52] ] ]
    ]
}),

addLayer("ms", { // Mini sticks in the Mini tree
    name: "Mini sticks",
    symbol: "MS",
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    previousTab: "C",
    color: "#c79769",                       // The color for this layer, which affects many elements.
    resource: "mini sticks",            // The name of this layer's main prestige resource.
    row: -10,                                 // The row this layer is on (0 is the first row).
    baseResource: "mini experience",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.C.mini },  // A function to return the current amount of baseResource.
    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.             // Also the amount required to unlock the layer.
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1)               // Factor in any bonuses multiplying gain here.
        if (hasUpgrade("mw", 11)) mult = mult.times(2)
        if (hasUpgrade("ms", 23)) mult = mult.times(2)
        if (hasUpgrade("mw", 14)) mult = mult.times(2)
        if (hasUpgrade("mst", 11)) mult = mult.times(3)
        if (hasUpgrade("mst", 13)) mult = mult.times(4)
        if (hasUpgrade("mw", 22)) mult = mult.times(player.mw.upgrades.length * 0.1 + 1)
        if (hasUpgrade("mw", 24)) mult = mult.times(5)
        if (hasUpgrade("ml", 11)) mult = mult.times(3)
        if (hasUpgrade("ml", 13)) mult = mult.times(3)
        if (hasUpgrade("mr", 11)) mult = mult.times(3)
        mult = mult.times(getBuyableAmount("C", 11).times(10).plus(1)) // tening
        mult = mult.times(getBuyableAmount("C", 22).times(2).plus(1)) // microskopik stiks
        return mult
    },
    onPrestige(gain) {
    	player.C.mini = new Decimal(0)
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
    upgrades: {
    	11: {
		    title: "Minion",
		    description: "Double mini gain",
		    cost: new Decimal(1)
	    },
	    12: {
		    title: "Micro",
		    description: "Double mini gain again",
		    cost: new Decimal(2),
		    unlocked() { return hasUpgrade("ms", 11) }
	    },
	    13: {
		    title: "Tiny",
		    description: "Double mini gain yet again",
		    cost: new Decimal(3),
		    unlocked() { return hasUpgrade("ms", 12) }
	    },
	    14: {
		    title: "Nano",
		    description: "Boost mini based on mini sticks",
		    cost: new Decimal(5),
		    unlocked() { return hasUpgrade("ms", 13) },
		    effect() { return player.ms.points.div(25).plus(1) },
		    effectDisplay() { return "×"+format(upgradeEffect("ms", 14)) },
		    tooltip: "(x÷25)+1"
	    },
	    15: {
		    title: "Pico",
		    description: "Double mini, Unlock wood",
		    cost: new Decimal(7),
		    unlocked() { return hasUpgrade("ms", 14) }
	    },
	    21: {
		    title: "Short",
		    description: "Double mini...",
		    cost: new Decimal(50),
		    unlocked() { return hasUpgrade("mw", 12) }
	    },
	    22: {
		    title: "Milli",
		    description: "Boost mini based on mini",
		    cost: new Decimal(60),
		    unlocked() { return hasUpgrade("ms", 21) },
		    effect() { return player.C.mini.plus(1).log10().pow(0.5) },
		    effectDisplay() { return "×"+format(upgradeEffect("ms", 22)) },
		    tooltip: "log(x+1)^0.5"
	    },
	    23: {
		    title: "Thin",
		    description: "Double mini stick gain",
		    cost: new Decimal(100),
		    unlocked() { return hasUpgrade("ms", 22) }
	    },
	    24: {
		    title: "Slow",
		    description: "Double experience gain (not mini)",
		    cost: new Decimal(1000),
		    unlocked() { return hasUpgrade("ms", 23) }
	    },
	    25: {
		    title: "Dirty",
		    description: "Double mini wood gain",
		    cost: new Decimal(1250),
		    unlocked() { return hasUpgrade("ms", 24) }
	    },
    },
    branches: ["mw", "mst", "ml", "mr"],
}),

addLayer("mw", { // Mini sticks in the Mini tree
    name: "Mini wood",
    symbol: "MW",
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    color: "#856d4e",                       // The color for this layer, which affects many elements.
    resource: "mini wood",            // The name of this layer's main prestige resource.
    row: -10,                                 // The row this layer is on (0 is the first row).
    baseResource: "mini sticks",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.ms.points },  // A function to return the current amount of baseResource.
    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.             // Also the amount required to unlock the layer.
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1)               // Factor in any bonuses multiplying gain here.
        if (hasUpgrade("ms", 25)) mult = mult.times(2)
        if (hasUpgrade("mst", 12)) mult = mult.times(3)
        if (hasUpgrade("ml", 11)) mult = mult.times(3)
        if (hasUpgrade("ml", 12)) mult = mult.times(2)
        if (hasUpgrade("mr", 11)) mult = mult.times(3)
        if (hasUpgrade("mr", 13)) mult = mult.times(4)
        mult = mult.times(getBuyableAmount("C", 11).times(10).plus(1)) // tening
        return mult
    },
    onPrestige(gain) {
    	player.C.mini = new Decimal(0)
    	if(!hasUpgrade("ml", 13)) player.ms.points= new Decimal(0)
        if(!hasUpgrade("ml", 11)) player.ms.upgrades = []
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return hasUpgrade("ms", 15) },          // Returns a bool for if this layer's node should be visible in the tree.
    upgrades: {
    	11: {
		    title: "Small",
		    description: "Double mini gain, double mini stick gain",
		    cost: new Decimal(1)
	    },
	    12: {
		    title: "Little",
		    description: "Unlock row 2 mini stick upgrades",
		    cost: new Decimal(2),
		    unlocked() { return hasUpgrade("mw", 11) }
	    },
	    13: {
		    title: "Decent",
		    description: "Triple mini gain",
		    cost: new Decimal(20),
		    unlocked() { return hasUpgrade("mw", 12) }
	    },
	    14: {
		    title: "Average",
		    description: "Double mini stick gain",
		    cost: new Decimal(35),
		    unlocked() { return hasUpgrade("mw", 13) }
	    },
	    15: {
		    title: "Common",
		    description: "Unlock mini stone, double mini",
		    cost: new Decimal(60),
		    unlocked() { return hasUpgrade("mw", 14) }
	    },
	    21: {
		    title: "Hard",
		    description: "Double mini stone, Double mini",
		    cost: new Decimal(5000),
		    unlocked() { return hasUpgrade("mst", 15) }
	    },
        22: {
		    title: "Soft",
		    description: "Double mini stone, wood upgrades boost mini sticks by + ×0.1 each.",
		    cost: new Decimal(6000),
		    unlocked() { return hasUpgrade("mw", 21) }
	    },
	    23: {
		    title: "Clean",
		    description: "Quintuple mini",
		    cost: new Decimal(40000),
		    unlocked() { return hasUpgrade("mw", 22) }
	    },
	    24: {
		    title: "Linear",
		    description: "Quintuple mini sticks",
		    cost: new Decimal(80000),
		    unlocked() { return hasUpgrade("mw", 23) }
	    },
	    25: {
		    title: "Quadratic",
		    description: "Quintuple mini stone",
		    cost: new Decimal(500000),
		    unlocked() { return hasUpgrade("mw", 24) }
	    },
    },
    branches: ["mst", "ml", "mr"],
}),

addLayer("mst", { // Mini sticks in the Mini tree
    name: "Mini stone",
    symbol: "MST",
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    color: "#bababa",                       // The color for this layer, which affects many elements.
    resource: "mini stone",            // The name of this layer's main prestige resource.
    row: -10,                                 // The row this layer is on (0 is the first row).
    baseResource: "mini wood",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.mw.points },  // A function to return the current amount of baseResource.
    requires: new Decimal(100),              // The amount of the base needed to  gain 1 of the prestige currency.             // Also the amount required to unlock the layer.
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1)               // Factor in any bonuses multiplying gain here.
        if (hasUpgrade("mw", 21)) mult = mult.times(2)
        if (hasUpgrade("mw", 22)) mult = mult.times(2)
        if (hasUpgrade("mw", 25)) mult = mult.times(5)
        if (hasUpgrade("ml", 11)) mult = mult.times(3)
        if (hasUpgrade("ml", 14)) mult = mult.times(3)
        if (hasUpgrade("mr", 11)) mult = mult.times(3)
        if (hasUpgrade("mr", 14)) mult = mult.times(10)
        mult = mult.times(getBuyableAmount("C", 11).times(10).plus(1)) // tening
        return mult
    },
    onPrestige(gain) {
    	player.C.mini = new Decimal(0)
    	if(!hasUpgrade("mr", 13)) player.mw.points= new Decimal(0)
        if(!hasUpgrade("ml", 13)) player.ms.points= new Decimal(0)
        if(!hasUpgrade("ml", 12)) player.mw.upgrades = []
        if(!hasUpgrade("ml", 11)) player.ms.upgrades = []
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return hasUpgrade("mw", 15) },          // Returns a bool for if this layer's node should be visible in the tree.
    upgrades: {
    	11: {
		    title: "Middle",
		    description: "Triple stick gain, Triple mini",
		    cost: new Decimal(1)
	    },
	    12: {
		    title: "Okay",
		    description: "Triple mini wood gain",
		    cost: new Decimal(2),
		    unlocked() { return hasUpgrade("mst", 11) }
	    },
	    13: {
		    title: "Normal",
		    description: "Quadruple mini stick gain",
		    cost: new Decimal(3),
		    unlocked() { return hasUpgrade("mst", 12) }
	    },
	    14: {
		    title: "Nothing Wrong",
		    description: "Quintiple mini gain",
		    cost: new Decimal(4),
		    unlocked() { return hasUpgrade("mst", 13) }
	    },
	    15: {
		    title: "Positive",
		    description: "Unlock mini leaf, unlock row 2 mini wood",
		    cost: new Decimal(12),
		    unlocked() { return hasUpgrade("mst", 14) }
	    },
    },
    branches: ["ml", "mr"]
}),

addLayer("ml", { // Mini leaves in the Mini tree
    name: "Mini leaves",
    symbol: "ML",
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    color: "#42f56c",                       // The color for this layer, which affects many elements.
    resource: "mini leaf",            // The name of this layer's main prestige resource.
    row: -10,                                 // The row this layer is on (0 is the first row).
    baseResource: "mini stone",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.mst.points },  // A function to return the current amount of baseResource.
    requires: new Decimal(750),              // The amount of the base needed to  gain 1 of the prestige currency.             // Also the amount required to unlock the layer.
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1)               // Factor in any bonuses multiplying gain here.
        if (hasUpgrade("mr", 11)) mult = mult.times(3)
        if (hasUpgrade("mr", 12)) mult = mult.times(4)
        if (hasUpgrade("mr", 15)) mult = mult.times(5)
        mult = mult.times(getBuyableAmount("C", 11).times(10).plus(1)) // tening
        return mult
    },
    onPrestige(gain) {
    	player.C.mini = new Decimal(0)
    	if(!hasUpgrade("mr", 13)) player.mw.points= new Decimal(0)
        if(!hasUpgrade("ml", 13)) player.ms.points= new Decimal(0)
        player.mst.points = new Decimal(0)
        if(!hasUpgrade("ml", 12)) player.mw.upgrades = []
        if(!hasUpgrade("ml", 11)) player.ms.upgrades = []
        if(!hasUpgrade("mr", 12)) player.mst.upgrades = []
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return hasUpgrade("mst", 15) },          // Returns a bool for if this layer's node should be visible in the tree.
    upgrades: {
    	11: {
		    title: "Good",
		    description: "Mini stick upgrades do not reset, triple every resource below this layer",
		    cost: new Decimal(1)
	    },
	    12: {
		    title: "Cool",
		    description: "Mini wood upgrades do not reset, double mini wood",
		    cost: new Decimal(4)
	    },
	    13: {
		    title: "Alright",
		    description: "Mini sticks do not reset, triple mini sticks",
		    cost: new Decimal(5)
	    },
	    14: {
		    title: "Better",
		    description: "Triple mini stone",
		    cost: new Decimal(10)
	    },
	    15: {
		    title: "Epic",
		    description: "Unlock mini researchers, quintuple mini gain",
		    cost: new Decimal(30)
	    },
    },
    branches: ["mr"]
}),

addLayer("mr", { // Mini leaves in the Mini tree
    name: "Mini Researchers",
    symbol: "MR",
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    color: "#c98ced",                       // The color for this layer, which affects many elements.
    resource: "mini researchers",            // The name of this layer's main prestige resource.
    row: -10,                                 // The row this layer is on (0 is the first row).
    baseResource: "mini leaf",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.ml.points },  // A function to return the current amount of baseResource.
    requires: new Decimal(40),              // The amount of the base needed to  gain 1 of the prestige currency.             // Also the amount required to unlock the layer.
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1)               // Factor in any bonuses multiplying gain here.
        mult = mult.times(getBuyableAmount("C", 11).times(10).plus(1)) // tening
        if (hasUpgrade("mti",11)) mult = mult.times(upgradeEffect("mti", 11))
        return mult
    },
    onPrestige(gain) {
    	player.C.mini = new Decimal(0)
    	if(!hasUpgrade("mr", 13)) player.mw.points= new Decimal(0)
        if(!hasUpgrade("ml", 13)) player.ms.points= new Decimal(0)
        player.mst.points = new Decimal(0)
        player.ml.points = new Decimal(0)
        if(!hasUpgrade("ml", 12)) player.mw.upgrades = []
        if(!hasUpgrade("ml", 11)) player.ms.upgrades = []
        if(!hasUpgrade("mr", 12)) player.mst.upgrades = []
        player.ml.upgrades = []
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return hasUpgrade("ml", 15) },          // Returns a bool for if this layer's node should be visible in the tree.
    upgrades: {
    	11: {
		    title: "Super",
		    description: "Triple every resource below this layer",
		    cost: new Decimal(1)
	    },
	    12: {
		    title: "Duper",
		    description: "Stone upgrades do not reset, quadruple mini leaf.",
		    cost: new Decimal(3)
	    },
	    13: {
		    title: "Cuper",
		    description: "Wood does not reset, quadruple mini wood.",
		    cost: new Decimal(5)
	    },
	    14: {
		    title: "Mega",
		    description: "x10 mini stone, as you approach the final layer.",
		    cost: new Decimal(10)
	    },
	    15: {
		    title: "Ultra",
		    description: "x5 mini leaves, unlock the mini tin layer.",
		    cost: new Decimal(20)
	    },
    },
}),

addLayer("mti", { // Mini tin in the Mini tree
    name: "Mini Tin",
    symbol: "MTI",
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        goofy: new Decimal(0)
    }},
    nodeStyle: {
    	"border-radius": "0%",
        "box-shadow": "inset 0px 0px 10px #000000"
    },
    color: "#f2f7ff",                       // The color for this layer, which affects many elements.
    resource: "mini tin",            // The name of this layer's main prestige resource.
    row: -10,                                 // The row this layer is on (0 is the first row).
    baseResource: "mini researchers",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.mr.points },  // A function to return the current amount of baseResource.
    requires: new Decimal(50),              // The amount of the base needed to  gain 1 of the prestige currency.             // Also the amount required to unlock the layer.
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1)               // Factor in any bonuses multiplying gain here.
        if (hasUpgrade("mti",11)) mult = mult.times(upgradeEffect("mti", 11))
        return mult
    },
    something() {
    	player.mti.goofy = new Decimal(1)
        if (getBuyableAmount("C",51).gte(1)) player.mti.goofy = player.mti.goofy.times(buyableEffect("C", 51))
    },
    onPrestige(gain) {
    	player.C.mini = new Decimal(0)
    	player.mw.points= new Decimal(0)
        if( getBuyableAmount("C", 34).gte(1) ? player.ms.points= new Decimal(1e6) : player.ms.points= new Decimal(0) )
        player.mst.points = new Decimal(0)
        player.ml.points = new Decimal(0)
        player.mr.points = new Decimal(0)
        player.mw.upgrades = []
        player.ms.upgrades = []
        player.mst.upgrades = []
        player.ml.upgrades = []
        player.mr.upgrades = []
        let asdfg = new Decimal(1)
        if (getBuyableAmount("C",51).gte(1)) asdfg = asdfg.times(buyableEffect("C", 51))
        player.C.mp = player.C.mp.plus(asdfg)
    },
    resetDescription() {return "Reset everything for +"+format(player.mti.goofy)+" mini points and reset for "},
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return hasUpgrade("mr", 15) },          // Returns a bool for if this layer's node should be visible in the tree.
    upgrades: {
    	11: {
		    title: "New Metal",
		    description: "Boost mini researchers and mini tin based on mini points",
		    cost: new Decimal(40),
		    effect() { return player.C.mp.plus(4).sqrt() },
		    effectDisplay() { return format(upgradeEffect("mti", 11))+"x" },
		    unlocked() { return getBuyableAmount("C", 52).gte(1) },
		    tooltip: "sqrt(x+4)"
	    },
	    12: {
		    title: "Rocket Science",
		    description: "Unlock the Rocket layer",
		    cost: new Decimal(45),
		    unlocked() { return hasUpgrade("mti", 11) }
		}
	},
    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", function() { if(!getBuyableAmount("C", 52).gte(1)) return "Nothing here yet... or is there?"}],
        "upgrades"
    ]
})