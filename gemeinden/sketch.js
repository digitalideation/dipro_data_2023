let data = [];
const API_KEY = 'YOUR-KEY';
let dataAdd=[];


function preload() {


  d3.csv("data/kt-hauptstadt.csv", function (csv) {
    data.push(csv)
  })

}

function setup() {
  //console.log(data)
  createCanvas(400, 400);

  if (data.length > 0) {
    

      //https://api-ninjas.com/api/geocoding
      
      fetchDataInLoop(data)
        .then(() => {
          console.log("All data fetched and saved as JSON file.");
        })
        .catch(error => {
          console.error("An error occurred:", error);
        });


    

  }



}

function draw() {
  background(220);
}


async function fetchDataInLoop(data) {
  for (let d = 0; d < data.length; d++) {


    const apiUrl = 'https://api.api-ninjas.com/v1/geocoding?city=' + data[d].Hauptstadt + '&country=CH'; // Replace with your API endpoint
    const customHeaders = {
      'Accept': 'application/json',
      'X-Api-Key': API_KEY
    };
    await fetchData(apiUrl, customHeaders);
   
  }

  
  // After all requests are completed, save the collected data as a JSON file
  for(let n=0;n<data.length;n++){
    data[n]["longitude"]=dataAdd[n][0]["longitude"];
    data[n]["latitude"]=dataAdd[n][0]["latitude"];
    
  }
  //console.log(data)
  saveJSON(data, 'collectedData.json');
}


async function fetchData(url, customHeaders) {
  try {
    const requestHeaders = new Headers({
      'Content-Type': 'application/json', // Example: Set the content type to JSON
      ...customHeaders, // Merge any additional headers provided as a parameter
    });

    // Use the fetch function to make an asynchronous HTTP request with custom headers
    const response = await fetch(url, {
      method: 'GET', // You can specify the HTTP method (GET, POST, etc.) here
      headers: requestHeaders,
    });

    // Check if the HTTP request was successful (status code 200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response as JSON
    const d = await response.json();
    //console.log(d)
    dataAdd.push(d);
    // Return the parsed data to the caller
    return d;
    
  } catch (error) {
    // Handle any errors that occurred during the fetch or parsing
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to let the caller handle it
  }
}

