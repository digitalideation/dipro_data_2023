
/*
Vergleich der Umrechung von longitude und latitude in x und y Koordinaten
Schwarze Punkte, Umrechung nach http://de.wikipedia.org/wiki/Schweizer_Koordinatensystem
Swissgrid 

Rote Punkte, ohne Umrechnung der Projekion in Sexagesimalsekunden
lineare Projektion der Punkte auf die Kartenfläche

Blaue Punkte Umrechung mit d3
UTM Mercator

*/
let geojson;

let chW = 3.4;
let chH = 2.3;

let boundsX1, boundsY1;
let boundsX2, boundsY2;

let minWest = 600000;//Bern
let maxOst = 600000;//Bern
let maxNorth = 200000;//Bern
let minSouth = 200000;//Bern

//Abstand Canvas
let mapX1 = 30;
let mapY1 = 50;
let mapX2 = 30;
let mapY2 = 25;

//------Swiss Boundaries minimale und maximale latituden, longituden
// https://labs.karavia.ch/swiss-boundaries-geojson/
let latMin = parseFloat(45.8179585);
let latMax = parseFloat(47.8084543);
let lonMin = parseFloat(5.955902);
let lonMax = parseFloat(10.4921713);

let centerLat = (latMax - latMin) / 2 + latMin;
let centerLon = (lonMax - lonMin) / 2 + lonMin;
let sc = window.innerWidth - mapX1*2;

// D3
var projection = d3
    .geoMercator()
    .center([centerLon, centerLat])
    .translate([10, 10])
    .scale(sc*12.8)


let datenpunkte = [];

function preload() {
    geojson = loadJSON('switzerland.geojson');


}
function setup() {
    let factor = windowWidth / chW;
    let h = chH * factor;
    createCanvas(windowWidth, h);
    mapX2 = width - 30;
    mapY2 = height - 25;
    stroke(0);
    convertGeojsonProjection();
    drawGeojsonProjection();
   // drawd3Projection();

    drawgeojson();

    legende()

    noLoop();
}



function draw() {
    //background(220);
}



//Umrechnung von longitude und latitude in x und y nach https://de.wikipedia.org/wiki/Schweizer_Landeskoordinaten

function convertGeojsonProjection() {
    if (geojson) {
        // Loop through the features in the GeoJSON
        for (let feature of geojson.features) {
            // Check the geometry type (e.g., Polygon)
            if (feature.geometry.type === 'Polygon') {
                // Extract the coordinates of the polygon
                let coords = feature.geometry.coordinates[0]; // Assuming it's a simple polygon
                for (let coord of coords) {
                    // Convert GeoJSON coordinates to screen coordinates

                    let punkt = new Orte(coord[1], coord[0]);
                    punkt.makeSwissGrid()
                    datenpunkte.push(punkt)

                }

            }
        }
    }
}





function drawGeojsonProjection() {
    beginShape();
    noStroke();
    fill(200, 0, 100, 100)
    for (let i = 0; i < datenpunkte.length; i++) {
        let o = datenpunkte[i];



        o.setXY()
        o.drawPoint();

    }
    endShape(CLOSE)
}

class Orte {
    constructor(lat, long) {
        this.lat = lat;
        this.long = long;
        this.swissgridX;
        this.swissgridY;
        this.mapy;
        this.mapx;
    }
    makeSwissGrid() {
        /*
    http://de.wikipedia.org/wiki/Schweizer_Koordinatensystem
    Umwandlung in Sexagesimalsekunden:
    φ = 47° 13' 15" N
λ = 7° 1' 41" E
φ = (47*3600) + (13*60) + 15 = 169995
λ = (7*3600) + (1*60) + 41 = 25301
    
    */

        let s = float(this.lat);
        let m = float((this.lat - s) * 60);
        let sec = round((this.lat - (s + (m / 60))) * 3600);//471315 - 470000 - 1300
        //let gamma = (s * 3600) + (m*60) + sec;
        let gamma = round(this.lat * 3600);

        /*prletln("s"+s);
        prletln("m"+m);
        prletln("sec"+sec);
        prlet(gamma);*/

        s = floor(this.long);
        m = floor((this.long - s) * 60);
        sec = round((this.long - (s + (m / 60))) * 3600);
        /* prletln("s"+s);
        prletln("m"+m);
        prletln("sec"+sec);*/
        //let delta = (s * 3600) + (m*60) + sec;
        let delta = round(this.long * 3600);
        /*
        Berechnung der Hilfsgrössen:
        φ' = (169995 - 169028.66) / 10000 = 0.096634
        λ' = (25301 - 26782.5) / 10000 = -0.14815
        */
        let gamma_s = (gamma - 169028.66) / 10000;
        let delta_s = (delta - 26782.5) / 10000;
        // prlet(delta_s);
        /*
        Berechnung der Meterkoordinaten:
        x = 200147.07 + 308807.95 · φ' + 3745.25 · λ'2 + 76.63 · φ'2 + 119.79 · φ'3 - 194.56 · λ'2 · φ'
        x = 230071
        y = 600072.37 + 211455.93 · λ' - 10938.51 · λ' · φ' - 0.36 · λ' · φ'2 - 44.54 · λ'3
        y = 568902
        
        */
        // x- und y-Achse sind also im Vergleich zur mathematischen Konvention vertauscht.
        this.swissgridX = 200147.07 + 308807.95 * gamma_s + 3745.25 * pow(delta_s, 2) + 76.63 * pow(gamma_s, 2) + 119.79 * pow(gamma_s, 3) - 194.56 * pow(delta_s, 2) * gamma_s;
        this.swissgridY = 600072.37 + 211455.93 * delta_s - 10938.51 * delta_s * gamma_s - 0.36 * delta_s * pow(gamma_s, 2) - 44.54 * pow(delta_s, 3);


        //Boundaries
        if (this.swissgridX > minSouth) {
            minSouth = this.swissgridX;
        }
        if (this.swissgridX < maxNorth) {
            maxNorth = this.swissgridX;
        }
        if (this.swissgridY > maxOst) {
            maxOst = this.swissgridY;
        }
        if (this.swissgridY < minWest) {
            minWest = this.swissgridY;
        }
    }

    setXY() {
        // x- und y-Achse sind im Vergleich zur mathematischen Konvention vertauscht.
        let x = map(this.swissgridY, minWest, maxOst, mapX1, mapX2);
        let y = map(this.swissgridX, minSouth, maxNorth, mapY1, mapY2);
        this.mapx = x;
        this.mapy = y;


    }
    drawPoint() {
        //console.log(this.mapx)
        //ellipse(this.mapx, this.mapy, 2, 2);
        vertex(this.mapx, this.mapy);
    }

}


/*---------------Vergleich ohne Umrechnung Projektion-----*/


function drawgeojson() {
    if (geojson) {
        // Loop through the features in the GeoJSON
        for (let feature of geojson.features) {
            // Check the geometry type (e.g., Polygon)
            if (feature.geometry.type === 'Polygon') {
                // Extract the coordinates of the polygon
                let coords = feature.geometry.coordinates[0]; // Assuming it's a simple polygon

                // Begin drawing the shape
                stroke(255, 0, 0);
                noFill();
                beginShape();
                noStroke();
                fill(20, 20, 200, 60)
                for (let coord of coords) {
                    // Convert GeoJSON coordinates to screen coordinates
                    let x = map((coord[0]), lonMin, lonMax, mapX1, mapX2);
                    let y = map((coord[1]), latMin, latMax, mapY2, mapY1);
                    
                    vertex(x, y);
                }
                endShape(CLOSE)
            }
        }
    }
}


function drawd3Projection() {
    if (geojson) {
        push();
        translate(width / 2, height / 2);
        // Loop through the features in the GeoJSON
        for (let feature of geojson.features) {
            // Check the geometry type (e.g., Polygon)
            if (feature.geometry.type === 'Polygon') {
                // Extract the coordinates of the polygon
                let coords = feature.geometry.coordinates[0];

                // Begin drawing the shape
                noStroke();
                fill(0, 255, 255, 150);

                beginShape();
                for (let coord of coords) {
                    // Convert GeoJSON coordinates to screen coordinates
                    let pos = projection([coord[0], coord[1]]);
                    let x = map((pos[0] + width / 2), lonMin, lonMax, mapX1, mapX2);
                    let y = map((pos[1] + height / 2), latMin, latMax, mapY2, mapY1);
                    vertex(pos[0], pos[1]);
                    //ellipse(pos[0], pos[1],5,5);
                    //console.log(pos)
                    //console.log(x,y)
                }
                endShape(CLOSE)

            }
        }
        pop();
    }
}


function legende(){
    fill(200, 0, 100)
    //stroke(200, 0, 100, 180)
    text("Swiss Grid CH1903", 20,100)

    fill(20, 20, 200, 160)
    //stroke(200, 0, 100, 100)
    text("Ohne Anwendung von Kugelprojektion", 20,120)

    fill(0, 180, 255);
    //stroke(200, 0, 100, 100)
    text("UTM Mercator Projektion von d3", 20,140)
}