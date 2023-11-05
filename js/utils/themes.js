// ************ Themes ************
var themes = ["default", "aqua", "heatwave", "lollipop", "grass"]

var colors = {
	default: {
		1: "#ffffff",//Branch color 1
		2: "#bfbfbf",//Branch color 2
		3: "#7f7f7f",//Branch color 3
		color: "#dfdfdf",
		points: "#ffffff",
		locked: "#bf8f8f",
		background: "#0f0f0f",
		background_tooltip: "rgba(0, 0, 0, 0.75)",
	},
	aqua: {
		1: "#bfdfff",
		2: "#8fa7bf",
		3: "#5f6f7f",
		color: "#bfdfff",
		points: "#dfefff",
		locked: "#c4a7b3",
		background: "#001f3f",
		background_tooltip: "rgba(0, 15, 31, 0.75)",
	},
	heatwave: {
		1: "#f5c1c1",
		2: "#f5c1c1",
		3: "#f5c1c1",
		color: "#ffbfbf",
		points: "#ffdfdf",
		locked: "#c4a7b3",
		background: "#3f0000",
		background_tooltip: "rgba(0, 15, 31, 0.75)",
	},
	lollipop: {
		1: "#ffffff",
		2: "#ffffff",
		3: "#ffffff",
		color: "#ff8a8a",
		points: "#ffdfdf",
		locked: "#c4a7b3",
		background: "#7d0000",
		background_tooltip: "rgba(0, 15, 31, 0.75)",
	},
	grass: {
		1: "#ccffce",
		2: "#ccffce",
		3: "#ccffce",
		color: "#bbfabe",
		points: "#ffdfdf",
		locked: "#c4a7b3",
		background: "#002905",
		background_tooltip: "rgba(0, 15, 31, 0.75)",
	},
}
function changeTheme() {

	colors_theme = colors[options.theme || "default"];
	document.body.style.setProperty('--background', colors_theme["background"]);
	document.body.style.setProperty('--background_tooltip', colors_theme["background_tooltip"]);
	document.body.style.setProperty('--color', colors_theme["color"]);
	document.body.style.setProperty('--points', colors_theme["points"]);
	document.body.style.setProperty("--locked", colors_theme["locked"]);
}
function getThemeName() {
	return options.theme? options.theme : "default";
}

function switchTheme() {
	let index = themes.indexOf(options.theme)
	if (options.theme === null || index >= themes.length-1 || index < 0) {
		options.theme = themes[0];
	}
	else {
		index ++;
		options.theme = themes[index];
	}
	changeTheme();
	resizeCanvas();
}
