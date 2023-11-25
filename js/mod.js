let modInfo = {
	name: "Excavation Tree",
	id: "ExcTreAvaE",
	author: "tree enjoyer",
	pointsName: "Experience",
	modFiles: ["layers.js", "tree.js", "layerss.js"],
	discordName: "EXC Discord",
	discordLink: "https://discord.gg/9ZjwG5PGTU",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.2",
	name: "The Explosion Update",
}

let changelog = `<h1>Changelog:</h1><br>
    <h3>v1.2</h3><br>
		- Fixed battery upgrades<br>
		- Fixed some softlocks<br>
        - Added coal layer<br>
        - Added magnet layer<br>
        - Added fire stages<br>
        - Customized some things<br>
        - Added antimatter dimensions!?!?<br>
        - Added tier 2 stick upgrades<br>
        - Added more tech<br>
        - Added tons of achievements<br>
        - Added more themes<br>
        - Please fix your battery upgrades in the options tab <br>
        - Added more challenges<br>
	<h3>v1.1</h3><br>
		- Fixed decimal precision<br>
		- Fixed typos<br>
        - Added more tin and stone and tech upgrades<br>
        - Added battery, and recovery layer<br>
        - Added challenges<br>
        - Added more themes<br>
        - Added some custom styling`

let winText = `Congrats, you have dug to the void. Wait for more updates to progress even more.`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return hasUpgrade("S", 11)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)

	if( hasUpgrade("S", 12) )
		gain = gain.times(upgradeEffect("S", 12))

	if( hasUpgrade("S", 13) )
		gain = gain.times(upgradeEffect("S", 13))

	if( hasUpgrade("S", 14) )
		gain = gain.plus(3)

	if( hasUpgrade("W", 13) )
		gain = gain.times(upgradeEffect("W", 13))

	if( hasMilestone("ST", 0) )
		gain = gain.times( player.ST.points.plus(1.5).pow(1.05) )

	if( hasUpgrade("S", 32) )
		gain = gain.times(2)

	if ( hasUpgrade("TI", 11) ) 
		gain = gain.times(10)
		
	if ( player.B.layerShown == true )
	    gain = gain.times(player.B.points.plus(15).log10().pow(0.5))
	
	gain = gain.times(getBuyableAmount("M", 13).times(0.1).plus(1)) // shop boost
	
	if ( hasUpgrade("S", 51) ) 
		gain = gain.times(2)
		
	if( hasUpgrade("S", 52) )
		gain = gain.times(upgradeEffect("S", 52))
		
	if( hasUpgrade("S", 53) )
		gain = gain.times(upgradeEffect("S", 53))
		
	if ( hasUpgrade("R", 23) ) 
		gain = gain.times(2)
		
	if ( hasUpgrade("B", 23) ) 
		gain = gain.times(2)
		
	if ( hasUpgrade("F", 21) ) gain = gain.times(10)
	
	if ( inChallenge("B", 12) )
	    gain = gain.div(100)

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"Current Endgame: 1 coal"
]

// Determines when the game "ends"
function isEndgame() {
	return player.C.points.gte(new Decimal(1))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {
}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
