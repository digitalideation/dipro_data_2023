let geojson;
let meldungen;
let kreiseZueri = [];

var wwidth = 900,
    wheight = 900;


// D3
var projection = d3
    .geoMercator()
    .center([8.5410422, 47.41])
    .scale(260000)
    .precision(.1);


let datenpunkte = [];

function preload() {
    geojson = loadJSON('stzh.adm_stadtkreise_a.json');
    meldungen = loadJSON('stzh.zwn_meldungen_p.json');

}
function setup() {
    createCanvas(wwidth, wheight);
    background(100)
    drawd3Projection();

    drawMeldungen();


    noLoop();
}

function drawMeldungen() {
    if (meldungen) {
        for (let feature of meldungen.features) {
            let coord = feature.geometry.coordinates;
            let pos = projection([coord[0], coord[1]]);
            point(pos[0], pos[1]);
        }
    }
}

function drawd3Projection() {
    if (geojson) {
        push();

        // Loop through the features in the GeoJSON
        for (let feature of geojson.features) {

            // Check the geometry type (e.g., Polygon)
            if (feature.geometry.type === 'Polygon') {
                // Extract the coordinates of the polygon
                let coords = feature.geometry.coordinates[0];
                // console.log(coords.length)

                // Begin drawing the shape


                beginShape();

                for (let coord of coords) {

                    // Convert GeoJSON coordinates to screen coordinates
                    let pos = projection([coord[0], coord[1]]);
                    vertex(pos[0], pos[1]);


                }



                endShape(CLOSE)

            }
        }
        pop();


    }
}

