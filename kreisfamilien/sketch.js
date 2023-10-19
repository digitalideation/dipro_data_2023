
let chreis = [];
let mitte = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

//track mouse position
let mouse;
let track;
window.addEventListener("mousemove", (event) => { mouse = { x: event.clientX, y: event.clientY } });

function createCircle({ parent, x, y, r, drag = 0.9, mX = 0, mY = 0, stroke = 0, strokeColor, align, valign, id = "c" + chreis.length, scale = 1, color, opacity, cursor = "auto", pointer = "auto", text, click }) {

	const e = document.createElement("rect");
	e.id = id;
	e.style.width = r * 2 * scale + "px";
	e.style.height = r * 2 * scale + "px";
	e.style.left = x * scale + "px";
	e.style.top = y * scale + "px";
	e.style.transform = "rotate(" + r + "deg)";
	e.style.marginLeft = -r * scale + "px";
	e.style.marginTop = (-r) * scale + "px";

	e.style.background = color;
	e.style.opacity = opacity;
	e.style.cursor = cursor;
	e.style.pointerEvents = pointer;
	e.style.border = "solid";
	e.style.borderWidth = stroke * scale + "px";
	e.style.borderColor = strokeColor;
	e.style.display = "flex";
	if (align == "center") e.style.justifyContent = "center";
	if (valign == "center") e.style.alignItems = "center";

	e.style.borderRadius = "50%";

	if (text) {
		e.style.color = fontColor;
		e.style.fontSize = size * scale + "px";
		e.style.fontFamily = fontFamily;
		e.style.textAlign = align;
		e.style.lineHeight = lineHeight;
		e.innerHTML = text;
	}

	if (click) {
		e.onclick = click;
		e.addEventListener("touchend", (event) => { click() });
	}

	//physics
	e.r = r;
	e.i = chreis.length;
	e.kids = [];
	e.drag = false;
	e.x = x;
	e.y = y;
	e.mX = mX;
	e.mY = mY;
	e.drag = drag;

	chreis.push(e);
	parent.appendChild(e);
	return e;
}

function getDistance(a, b) {
	const aa = a.x - b.x;
	const bb = a.y - b.y;
	return Math.sqrt(aa * aa + bb * bb);
}

function magnet(a, b, restingDistance = 10, stiffness = 0.1) {

	let diffX = a.x - b.x;
	let diffY = a.y - b.y;
	let d = Math.sqrt(diffX * diffX + diffY * diffY);

	if (d == 0) d = 0.001; // 0 creates NaN
	const differenceScalar = (restingDistance - d) / d * stiffness;

	if (a.mX && b.mX) {
		const translateX = diffX * (differenceScalar * 0.5);
		const translateY = diffY * (differenceScalar * 0.5);
		a.mX = a.mX + translateX;
		a.mY = a.mY + translateY;
		b.mX = b.mX - translateX;
		b.mY = b.mY - translateY;
	}

	if (!b.mX) {
		const translateX = diffX * differenceScalar;
		const translateY = diffY * differenceScalar;
		a.mX = a.mX + translateX;
		a.mY = a.mY + translateY;
	}

}

//kreise erstellen
for (let i = 0; i < 8; i++) {
	createCircle({ parent: document.body, color: "#f00", r: 20 + Math.random() * 20, x: 0, y: 0, drag: 0.9, cursor: "pointer", click: function () { track = this.i } });

	//position random
	chreis[i].x = Math.random() * window.innerWidth;
	chreis[i].y = Math.random() * window.innerHeight;
}

//link and color kids
chreis[0].kids = [1, 2, 3];
chreis[0].style.backgroundColor = "#000";
chreis[1].style.backgroundColor = "#fc0";
chreis[2].style.backgroundColor = "#fc0";
chreis[3].style.backgroundColor = "#fc0";

chreis[4].kids = [5, 6, 7];
chreis[4].style.backgroundColor = "#00f";
chreis[5].style.backgroundColor = "#fc0";
chreis[6].style.backgroundColor = "#fc0";
chreis[7].style.backgroundColor = "#fc0";


function sketch(timeStamp) {

	for (let i = 0; i < chreis.length; i++) {

		let c = chreis[i];

		//distanzen
		for (let k = i + 1; k < chreis.length; k++) {

			//abstand zwischen eltern
			if (c.kids.length > 0 && chreis[k].kids.length > 0) {
				let minDistance = (c.r + chreis[k].r) + 200;
				if (getDistance(c, chreis[k]) < minDistance) {
					magnet(chreis[k], c, minDistance, 0.1);
				}
			} else {
				//abstand zwischen kids
				let minDistance = (c.r + chreis[k].r) + 20;
				if (getDistance(c, chreis[k]) < minDistance) {
					magnet(chreis[k], c, minDistance, 0.1);
				}
			}
		}

		//zur mitte ziehen
		magnet(c, mitte, 0, 0.0005);

		//kids zu eltern ziehen
		for (let e = 0; e < c.kids.length; e++) {
			let kid = chreis[c.kids[e]];
			let minDistance = c.r + kid.r;
			magnet(c, kid, minDistance, 0.05);
		}

		//mouse dragging
		if(track !== undefined) magnet(chreis[track], mouse, 0, 0.005);

		//momentum berechnen
		c.x = c.x + c.mX;
		c.y = c.y + c.mY;
		c.mX = c.mX * c.drag;
		c.mY = c.mY * c.drag;

		//positionieren
		c.style.transform = "translateX(" + c.x + "px) translateY(" + c.y + "px)";
	}

	//loop neu starten
	window.requestAnimationFrame(sketch);
}

//loop initieren
window.requestAnimationFrame(sketch);