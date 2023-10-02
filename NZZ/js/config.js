const duration = 3 // Gibt an, wie viele Sekunden Video pro Textbox gescrollt werden sollen

var main = d3.select(".main");
var scrolly = main.select(".scrolly");
var figure = scrolly.select(".figure");
var progress = 0


// initialize the scrollama
var scroller = scrollama();

function handleStepProgress(response) {
	progress = response.progress * duration + (response.index) * duration // Rechnet die Position im Video in Sekunden aus
	window.requestAnimationFrame(setVideo) // Performance-Optimierung. Nur neuzeichnen, wenn der Browser ready ist.
}

function setVideo() {
	document.getElementById("video").currentTime = progress // Video auf die korrekte Zeit setzen
	console.log(progress)
}


function handleStepEnter(response) {
	// Little message
	console.log("Step", response.index, "entered the stage. The direction is", response.direction)
}

function handleStepExit(response) {
	// Little message
	console.log("Step", response.index, "exited the stage. The direction is", response.direction)
}


// generic window resize listener event
function handleResize() {
	// 1. update height of step elements
	var figureHeight = window.innerHeight;
	var figureMarginTop = 0;

	figure
		.style("height", figureHeight + "px")
		.style("top", figureMarginTop + "px");

	// 2. tell scrollama to update new element dimensions
	scroller.resize();
}

function init() {
	// 1. force a resize on load to ensure proper dimensions are sent to scrollama
	handleResize();

	// 2. setup the scroller passing options
	// 		this will also initialize trigger observations
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller
		.setup({
			step: ".scrolly .step",
			offset: 1,
			progress: true,
			debug: false
		})
		.onStepEnter(handleStepEnter)
		.onStepExit(handleStepExit)
		.onStepProgress(handleStepProgress)
}

// kick things off
init();