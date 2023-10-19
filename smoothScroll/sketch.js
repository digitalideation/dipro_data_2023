
let visual = document.getElementById("placeholder");
let visualY = visual.offsetTop;
let visualHeight = 3000;
visual.style.height = visualHeight + "px";

let smoothScroll = 0;
let smoothnessScroll = 20;

let smoothPeople = 0;
let smoothnessPeople = 5;

let years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
let people = [500, 1000, 5000, 2992, 10, 3049, 200, 4999];
let activeYear = 2010;

function setup() {
	createCanvas(500, windowHeight);
}

function draw() {

	background(200);

	//scroll interpolieren
	smoothScroll = smoothScroll - (smoothScroll - window.scrollY+ visualY) / smoothnessScroll;

	//auwahl jahr
	for (let i = 0; i < years.length; i++) {
		let yPos = 10 + i * 500 - smoothScroll;
		if (yPos > windowHeight * 0.25 && yPos < windowHeight * 0.75) {
			activeYear = i;
			fill("red")
		} else {
			fill("black");
		}
		text(years[i], 10, yPos);
	}

	//balken
	smoothPeople = smoothPeople - (smoothPeople - people[activeYear]) / smoothnessPeople;
	rect(100, windowHeight/2-smoothPeople/10/2, 50, smoothPeople/10);

	//Verschiedene Scroll-Situationen
	if (window.scrollY + windowHeight < visualY) {
		canvas.style.top = windowHeight + "px";
	}else if (window.scrollY + windowHeight > visualY && window.scrollY + windowHeight < visualY + windowHeight) {
		canvas.style.top = (visual.offsetTop - window.scrollY) + "px";
	}else if(window.scrollY > visualY && window.scrollY < visualY + visualHeight - windowHeight){
		canvas.style.top = "0px";
	}else if(window.scrollY > visualY + visualHeight - windowHeight){
		canvas.style.top = (visual.offsetTop - window.scrollY + visualHeight - windowHeight) + "px";
	}

}