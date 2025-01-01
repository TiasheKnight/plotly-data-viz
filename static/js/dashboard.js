

function unpack(rows,key){
    return rows.map(function (row){
        return row[key];
    });
}

//graphs
var histogram = document.getElementById('histogram');
var boxPlot = document.getElementById('boxPlot');
var Bar_chart = document.getElementById('Bar_chart');
var pieChart = document.getElementById('pieChart');
var scatterPlot = document.getElementById('scatterPlot');
var taiwanMap = document.getElementById('worldMap');
var worldMap= document.getElementById('worldMap');

// draw graphs
function drawHistogram(res,loc='World',gender=null,ageLow=0,ageHigh=100,year=2023){
    let dies = [];
    let R=unpack(res, 'Region, subregion, country or area *');
    let T=unpack(res, "Year");
    
    for (let i=0; i<R.length; i++){
        if (T[i]!=year || R[i]!=loc) continue;
        for (let j=ageLow; j<ageHigh; j++){
            let D=unpack(res, j.toString());
            dies.push(D[i]);
        }
        D=unpack(res, "100+");
        dies.push(D[i]);
    }
    
    let binEdges = [];
    for (let i=ageLow; i<=ageHigh; i++){
        binEdges.push(i);
    }
    let binContents = dies;
    let binCenters = [];
    for (let i = 0; i < binEdges.length - 1; i++) {
        binCenters.push((binEdges[i] + binEdges[i + 1]) / 2);
    }
    
    let trace1 = {
        x: binCenters,
        y: binContents,
        type: 'bar',       // Bar plot mimicking bar_chart bin content
        width: 1
    };

    let data = [trace1];
    let titleText = "Deaths Distribution by Ages in " + loc + " in " + year;

    if (ageLow !== null && ageHigh !== null) {
        if (!(ageLow === 0 && ageHigh === 100)) {
            titleText = "Deaths Distribution by Ages: " + ageLow + " to " + ageHigh + " in " + loc + " in " + year;
        }
    }   

    let layout = {
        title: {
            text: titleText, 
            font: {
                family: 'Cambria, monospace',
                size: 18
            }
        }, 
        xaxis: {
            title: {
                text: 'Age',
                font: {
                    family: 'Cambria, monospace',
                    size: 18
                }
            }
        },
        yaxis: {
            title: {
                text: 'Number of People (Thousands)',
                font: {
                    family: 'Cambria, monospace',
                    size: 18
                }
            }
        }
    
    };

    Plotly.newPlot(histogram, data, layout);

}
function drawBoxPlot(res, loc='World'){
    let dies = [];
    let year = 2023;

    let R=unpack(res, 'Region, subregion, country or area *');
    let T=unpack(res, "Year");
    
    for (let i=0; i<R.length; i++){
        if (T[i]!=year || R[i]!=loc) continue;
        for (let j=0; j<100; j++){
            let D=unpack(res, j.toString());
            dies.push(D[i]);
        }
    }
    
    let Ndies = [];
    for (let i=0; i<dies.length; i++){
        for (let j=0; j<dies[i]; j++){
            Ndies.push(i);
        }
    }
    console.log(Ndies);

    
    let trace1 = {
        x: Ndies,
        type: "box",
        boxpoints: false,
        name: loc
    };

    let data = [trace1];

    let layout = {
        title: {
            text: "Deaths Distribution by Age in " + loc + " in " + year, 
            font: {
                family: 'Cambria, monospace',
                size: 18
            }
        }, 
        xaxis: {
            title: {
                text: 'Age',
                font: {
                    family: 'Cambria, monospace',
                    size: 18
                }
            }
        },
        yaxis: {
            title: {
                text: 'Number of People (Thousands)',
                font: {
                    family: 'Cambria, monospace',
                    size: 18
                }
            }
        }
    
    };

    Plotly.newPlot(boxPlot, data, layout);
}
function drawBarChart(data, value='World') {
    let countries = [...new Set(unpack(data, 'Region, subregion, country or area *'))];
    
    let traces = [];
    
    countries.forEach(country => {
        let countryData = data.filter(row => row['Region, subregion, country or area *'] === country);
        
        if (country === value) {  // Fixed condition to check against 'value'
            // Create trace
            let trace = {
                mode: 'lines+markers',
                type: 'scatter',
                name: country,
                x: unpack(countryData, 'Year'),
                y: unpack(countryData, 'Total Deaths (thousands)')
            };
            
            traces.push(trace);
        }
    });

    // Layout outside the loop
    let layout = {
        margin: { t: 60 },
        xaxis: { 
            title: 'Year'
        },
        yaxis: { 
            title: 'Deaths'
        },
        title: 'Deaths by Country and Year in '+ value+ ' in 2023'
    };

    // Plot the chart
    Plotly.newPlot('Bar_chart', traces, layout);  // Ensure 'Bar_chart' is the correct ID of your plot element
}
function drawPieChart(data, value='World') {
    let countryField = "Region, subregion, country or area *";
    let yearField = "Year";
    let maleDeathsField = "Male Deaths (thousands)";
    let femaleDeathsField = "Female Deaths (thousands)";
  
    // Filter data for 2023
    let data2023 = data.filter((row) => row[yearField] === "2023");
  
    // Log filtered data to check if it is correct
    console.log("Data for 2023:", data2023);
  
    // Get list of all countries
    let countries = [...new Set(unpack(data2023, countryField))];

    // Create traces list
    let traces = [];
    
    // Configure layout for subplots
    let rows = 1;
    let cols = 1; // Each country will have a separate pie chart
    
    // Loop through countries
    countries.forEach((country, idx) => {
        // If we are filtering for a specific country, check if the country matches the value
        if (country === value) {
            // Filter data for the current country
            let countryData = data2023.filter((row) => row[countryField] === country);

            // If data for the current country exists
            if (countryData.length > 0) {
                let maleDeaths = parseFloat(countryData[0][maleDeathsField]) || 0;
                let femaleDeaths = parseFloat(countryData[0][femaleDeathsField]) || 0;
                let totalDeaths = maleDeaths + femaleDeaths; // Calculate total deaths
    
                // Calculate male and female death percentages
                let malePercentage = (maleDeaths / totalDeaths) * 100;
                let femalePercentage = (femaleDeaths / totalDeaths) * 100;
    
                // Create pie chart trace for the country
                let pieTrace = {
                    type: "pie",
                    labels: ["Male Deaths", "Female Deaths"],
                    values: [maleDeaths, femaleDeaths],
                    textinfo: "label+percent", // Show labels and percentages
                    insidetextorientation: "radial",
                    domain: { row: idx, column: 0 }, // Position pie chart in grid
                    name: `${country} Deaths`,
                };
    
                traces.push(pieTrace);
            }
        }
    });

    // Configure layout for the chart
    let layout = {
        title: "Deaths by Gender in " + value+" in 2023",
        grid: { rows: rows, columns: cols }, // One pie chart per country
        height: rows * 400, // Dynamic height to fit all pie charts
        showlegend: false, // Hide legend to avoid clutter
    };

    // Render the pie chart with Plotly
    Plotly.newPlot('pieChart', traces, layout); // Ensure 'pieChart' is the correct ID of your chart container
}
function drawScatterPlot(res, loc = 'World'){
    let nTaiwan=0;
    let notTaiwan=0;
    let years = [];
    let dies = [];
    let D=unpack(res, "Total Deaths (thousands)");
    let R=unpack(res, 'Region, subregion, country or area *');
    let T=unpack(res, "Year");
    console.log(D);
    console.log(R);
    console.log(T);

    for (let i=0; i<D.length; i++){
        if (R[i] == loc){
            years.push(T[i]);
            dies.push(D[i]);
        }
    };

    let trace1 = {
        x: years,
        y: dies,
        type: "scatter",
        mode: "lines+markers",
        title: "Taiwan vs not Taiwan",
        labels: ['Taiwan','not Taiwan'],
        marker: {
            size: 5, 
            color: "Blue"
        }, 
        line: {
            width: 2.5, 
            color: "Blue"
        }, 
    
        values:[nTaiwan, notTaiwan],
        text:[nTaiwan, notTaiwan]
    };

    let data = [trace1];

    let layout = {
        title: {
            text: "Total Deaths in " + loc+ " in 2023", 
            font: {
                family: 'Cambria, monospace',
                size: 18
            }
        }, 
        xaxis: {
            title: {
                text: 'x Axis',
                font: {
                    family: 'Cambria, monospace',
                    size: 18
                }
            }
        },
        yaxis: {
            title: {
                text: 'y Axis',
                font: {
                    family: 'Cambria, monospace',
                    size: 18
                }
            }
        }
    
    };

    Plotly.newPlot(scatterPlot, data, layout);
}
function drawTaiwanMap(died_data, geo_data) {
    console.log(unpack(died_data, "Category2Title").sort());
    let all_cities = [];
    for (let i = 0; i < geo_data.features.length; i++) {
        all_cities.push(geo_data.features[i].properties.COUNTYNAME);
    }
    console.log(all_cities.sort());
    console.log(unpack(died_data, "Val"));

    let trace1 = {
        name: "",
        type: "choropleth",
        locationmode: "geojson-id",
        featureidkey: "properties.COUNTYNAME",
        locations: unpack(died_data, "Category2Title"),
        geojson: geo_data,
        z: unpack(died_data, "Val"),
        zmin: 0,
        zmax: 30000,
        colorscale: [
            [0, 'lightyellow'],
            [1, 'brown']
        ],
        hovertemplate: "%{location}:" + "%{z:,}人",
        hoverlabel: {
            bgcolor: "white",
            bordercolor: "black",
            font: {
                family: "Arial",
                size: 30,
                color: "black"
            }
        },
    };

    let data = [trace1];
    let layout = {
        title: {
            text: "2023 Number of deaths per county/city",
            font: {
                family: 'Cambria, monospace',
                size: 18,
                color: "black"
            },
            tickformat: ",.0f",
            x: 0.5,
            y: 0.98,
        },
        geo: {
            center: {
                lon: 120.32,
                lat: 23.84
            },
            fitbounds: "locations",
            projection: {
                type: "mercator"
            },
            resolution: 50,
        },
        margin: {
            l: 10,
            r: 10,
            t: 60,
            b: 10,
        }
    };

    Plotly.newPlot(taiwanMap, data, layout);
    // worldMap.on('plotly_click', function (eventData) {
    //     // Get the clicked country
    //     var country = eventData.points[0].location;
    //     console.log('Country clicked:', country);

    //         // Load data for the selected country
    //             Promise.all([
    //                 d3.json("../static/json/data.json"),
    //                 d3.json("../static/json/taiwan_geo.json")
    //             ]).then(function(data) {
    //                 drawTaiwanMap(data[0], data[1]);
    
    //             // Draw visualizations for the selected country
    //             drawHistogram(data, country);
    //             drawBoxPlot(data, country);
    //             drawBarChart(data, country);
    //             drawPieChart(data, country);
    //             drawScatterPlot(data, country);
    //         }).catch(function (error) {
    //             console.error("Error loading data:", error);
    //         });
    // });
}
function drawWorldMap(rows) {
    var year = 2023;
    var Death = [];
    var Country = [];
    var DD = [];
    var CC = [];
    var wrong = [];
    var max = [];
    var max2 = [];

    var time = unpack(rows, "Year");
    var D = unpack(rows, "Total Deaths (thousands)");
    var C = unpack(rows, "Region, subregion, country or area *");

    for (let i = 0; i < time.length; i++) {
        if (time[i] == year) {
            DD.push(D[i].replace(/\s+/g, ""));
            CC.push(C[i]);
        }
    }

    for (let j = 0; j < DD.length; j++) {
        if (CC[j] == "China") {
            max.push(DD[j].replace(/\s+/g, ""));
        }
        if (CC[j] == "SIDS Atlantic, Indian Ocean and South China Sea (AIS)") {
            wrong.push(DD[j].replace(/\s+/g, ""));
        }
        if (CC[j] == "India") {
            max2.push(DD[j].replace(/\s+/g, ""));
        }
    }

    var m = parseFloat(max[0].replace(/'/g, ""));
    var m2 = parseFloat(max2[0].replace(/'/g, ""));
    var w = parseFloat(wrong[0].replace(/'/g, ""));

    for (let z = 0; z < DD.length; z++) {
        if ((DD[z] <= m || DD[z] <= m2) && DD[z] != w) {
            Death.push(DD[z].replace(/\s+/g, ""));
            Country.push(CC[z]);
        }
    }

    console.log('output Death:', Death);
    console.log('output Country:', Country);

    let trace1 = {
        type: "choropleth",
        locationmode: "country names",
        locations: Country,
        z: Death,
        zmin: 0,
        zmax: Math.max(...Death.map(value => parseFloat(value.replace(/\s+/g, "")))), // Remove spaces and calculate max value
        text: unpack(rows, "location"),
        autocolorscale: true,
        colorscale: "Picnic" // https://plotly.com/javascript/colorscales/
    };

    let data = [trace1];

    let layout = {
        title: year + " Total Deaths (thousands)",
        geo: {
            projection: {
                Default: "110",
                type: "van der grinten1" // https://plotly.com/javascript/reference/layout/geo/#layout-geo-projection-type
            }
        }
    };

    // Render the plot
    Plotly.newPlot(worldMap, data, layout);

    // Add the click event listener here
    // worldMap.on('plotly_click', function (eventData) {
    //     var country = eventData.points[0].location; // The 'location' field corresponds to the country
    //     console.log('Country clicked:', country);

    //     // Send the clicked country to Flask server via a POST request
    //     fetch('/country-click', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ country: country })
    //     })
    //     .then(response => response.json())
    //     .then(data => console.log('Response from server:', data))
    //     .catch(error => console.error('Error:', error));
    // });
        // Add the click event listener here
        worldMap.on('plotly_click', function (eventData) {
            // Get the clicked country
            var country = eventData.points[0].location;
            console.log('Country clicked:', country);
        
            if (country === 'China, Taiwan Province of China') {
                // Load Taiwan-specific data and draw the Taiwan map
                Promise.all([
                    d3.json("../static/json/data.json"),
                    d3.json("../static/json/taiwan_geo.json")
                ]).then(function (data) {
                    drawTaiwanMap(data[0], data[1]);
                }).catch(function (error) {
                    console.error("Error loading Taiwan data:", error);
                });
            } else {
                // Load data for the selected country
                Promise.all([
                    d3.csv("../static/data/WPP2024_MORT_F01_1_DEATHS_SINGLE_AGE_BOTH_SEXES.csv"),
                    d3.csv("../static/data/WPP2024_GEN_F01_DEMOGRAPHIC_INDICATORS_COMPACT.csv")
                ]).then(function (datasets) {
                    const mortalityData = datasets[0];
                    const demographicData = datasets[1];
        
                    // Draw visualizations for the selected country
                    drawHistogram(mortalityData, country);
                    drawBoxPlot(mortalityData, country);
                    drawBarChart(demographicData, country);
                    drawPieChart(demographicData, country);
                    drawScatterPlot(demographicData, country);
                }).catch(function (error) {
                    console.error("Error loading data:", error);
                });
            }
        });
};

function fetchAndDrawWorldMap(value) {
    fetch(`/get_world_map_data?value=${value}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
            } else {
                console.log('Data received:', data);
                // Call your function with the relevant data
                drawWorldMap(data);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Example usage: Call this function with a value
fetchAndDrawWorldMap('World');



d3.csv("../static/data/WPP2024_MORT_F01_1_DEATHS_SINGLE_AGE_BOTH_SEXES.csv").then(
    res1 => {
        // console.log(res1);
        drawHistogram(res1);
        drawBoxPlot(res1);
    }
);

d3.csv('../static/data/WPP2024_GEN_F01_DEMOGRAPHIC_INDICATORS_COMPACT.csv').then(
    res2 => {
        // console.log(res2);
        drawBarChart(res2);
        drawPieChart(res2);
        drawWorldMap(res2);
        drawScatterPlot(res2);
    }
);

// Promise.all([
//     d3.json("../static/json/data.json"),
//     d3.json("../static/json/taiwan_geo.json")
// ]).then(function(data) {
//     drawTaiwanMap(data[0], data[1]);
// }); 