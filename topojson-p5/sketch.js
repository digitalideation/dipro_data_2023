/*
Swiss Data from
"Bundesamt für Statistik (BFS), GEOSTAT".
via https://github.com/interactivethings/swiss-maps
*/

let swiss;
let cantons;

var wwidth = 960,
    wheight = 600;


var projection = d3.geo.albers()
    .rotate([0, 0])
    .center([8.3, 46.8])
    .scale(16000)
    .translate([wwidth / 2, wheight / 2])
    .precision(.1);


function preload() {
    //data from here 
    //https://unpkg.com/swiss-maps@4/2021/ch-combined.json
    //swiss = loadJSON("data/ch-combined.json");
    swiss = loadJSON("data/readme-swiss.json");

   

}

function setup() {
    createCanvas(wwidth, wheight);
    cantons = topojson.feature(swiss, swiss.objects.cantons);
   
    
    textSize(11)
    console.log(cantons)

    noLoop();
}


function draw() {
    background(255);

    noFill();
    stroke(0, 100);

    //print(cantons);
    // draw the cantons

    for (let j = 0; j < cantons.features.length; j++) {
       
        //print(cantons.features[j])
        if (cantons.features[j].geometry.type === 'Polygon') {
            let shape = cantons.features[j].geometry.coordinates[0];
            //find center of shape
           
            
            fill(100, 50, 0, 100)
            stroke(0, 100);
            beginShape();
            drawShape(shape)
            endShape(CLOSE);

            let c=centroid(cantons.features[j].geometry);
            let pos = projection(c);
            fill(0)
            noStroke();
            //ellipse(pos[0], pos[1], 5,5)
            text("KT "+j+cantons.features[j].properties.name,pos[0], pos[1] )
        } else if (cantons.features[j].geometry.type === 'MultiPolygon') {
            let multipolygon = cantons.features[j].geometry.coordinates;

            
            for (let s = 0; s < multipolygon.length; s++) {
                let subshape = multipolygon[s];

                for (let m = 0; m < subshape.length; m++) {
                    let shape = subshape[m];
                    //print(shape)
                    fill(100, 150, 0, 100);
                    stroke(0, 100);
                    beginShape();
                    drawShape(shape)
                    endShape();
                }

                //
            }

            let ct=topojson.mesh(swiss, swiss.objects.cantons.geometries[j]);
            let c=centroid(ct);
            let pos = projection(c);
            
            fill(0)
            //ellipse(pos[0], pos[1], 10,10)
            noStroke();
            text("KT "+j+cantons.features[j].properties.name,pos[0], pos[1] )


        }

    }

}


function drawShape(shape) {

    for (let p = 0; p < shape.length; p++) {
        let borderCoordinate = shape[p];
        let x = projection(borderCoordinate)[0];
        let y = projection(borderCoordinate)[1];
        vertex(x, y);
    }

}

//https://gist.github.com/seyuf/ab9c980776e4c2cb350a2d1e70976517
function centroid(poly){
    var c = [0,0];
    var ring = poly.coordinates[0];
    for(i= 0; i < (ring.length-1); i++){
      c[0] += (ring[i][0] + ring[i+1][0]) * (ring[i][0]*ring[i+1][1] - ring[i+1][0]*ring[i][1]);
      c[1] += (ring[i][1] + ring[i+1][1]) * (ring[i][0]*ring[i+1][1] - ring[i+1][0]*ring[i][1]);
    }
    var a = area(poly);
    c[0] /= a *6;
    c[1] /= a*6;
    return c;

  }

 function area(poly){
    var s = 0.0;
    var ring = poly.coordinates[0];
    for(i= 0; i < (ring.length-1); i++){
      s += (ring[i][0] * ring[i+1][1] - ring[i+1][0] * ring[i][1]);
    }
    return 0.5 *s;
  }