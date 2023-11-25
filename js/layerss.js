addLayer("C", { // row 4 -> row 6
    name: "Coal", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked() { return hasUpgrade("T", 42) },
	points: new Decimal(0),
	total: new Decimal(0),
	steam: new Decimal(0)
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
    layerShown(){ return hasUpgrade("T", 42) },
    tabFormat: [
    	"main-display",
    	"resource-display",
	    "prestige-button",
    	"blank",
    	"milestones"
    ]
})