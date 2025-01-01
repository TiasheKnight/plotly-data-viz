Promise.all([
    d3.json("../static/json/data.json"),
    d3.json("../static/json/taiwan_geo.json")
]).then(function(data) {
    draw_map(data[0], data[1]);
}); 

function unpack(rows, key) {
    return rows.map(function(row){ 
        return row[key]; 
    });
}
var myPlot = document.getElementById('myGraph');

function draw_map(died_data, geo_data,loc='World',gender=null,ageLow=0,ageHigh=100,year=2023) {
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
                size: 20,
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

    Plotly.newPlot(myPlot, data, layout);
}
