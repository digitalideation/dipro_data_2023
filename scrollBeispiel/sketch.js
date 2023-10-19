
document.body.style.height = "50000px";

let scroll = 0;
let smoothScroll = 0;
let smoothness = 20;

let smoothAnimation = 0;
let animationSmoothness = 20;

let abstand = 200;

let years = [1999, 2000, 2001, 2002, 2003, 2004, 2005];
let numbers = [20, 40, 50, 10, 100, 120, 85];
let activeYear = 0;

function setup() {
	createCanvas(500, windowHeight);
}

function draw() {

	smoothScroll = smoothScroll - (smoothScroll - window.scrollY) / smoothness;

	smoothAnimation = smoothAnimation - (smoothAnimation - numbers[activeYear]) / animationSmoothness;

	background(100);



	fill(200);

	for (let i = 0; i < years.length; i++) {

		let yPos = i * abstand - smoothScroll;

		if (yPos < windowHeight/2 + abstand/2 && yPos > windowHeight/2 - abstand/2) {
			activeYear = i;
			fill("red")
		} else {
			fill("black");
		}
		text(years[i], 10, yPos);
	}


	console.log(smoothAnimation);

	text(10, 10, 20, 100);
	rect(50, 50, 20, smoothAnimation*3);

}