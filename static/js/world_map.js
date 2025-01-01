d3.csv("../static/data/WPP2024_GEN_F01_DEMOGRAPHIC_INDICATORS_COMPACT.csv").then(Global_map);

var myPlot = document.getElementById('myGraph');

function unpack(rows, key) {
    return rows.map(function (row) {
        return row[key];
    });
}

function Global_map(rows,loc='World',gender=null,ageLow=0,ageHigh=100,year=2023) {
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
    Plotly.newPlot(myPlot, data, layout);

    // Add the click event listener here
    myPlot.on('plotly_click', function (eventData) {
        var country = eventData.points[0].location; // The 'location' field corresponds to the country
        console.log('Country clicked:', country);

        // Send the clicked country to Flask server via a POST request
        fetch('/country-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: country })
        })
        .then(response => response.json())
        .then(data => console.log('Response from server:', data))
        .catch(error => console.error('Error:', error));
    });
}
function renderVisualization(country, gender, ageLow, ageHigh, year){
    d3.csv('../static/data/WPP2024_GEN_F01_DEMOGRAPHIC_INDICATORS_COMPACT.csv').then(
        res => {
            console.log(res);
            Global_map(res, country, gender, ageLow, ageHigh, year);
        }
    );
    
};