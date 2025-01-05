Promise.all([
    d3.json("../static/json/data.json"),
    d3.json("../static/json/taiwan_geo.json")
]).then(function(data) {
    let died_data = data[0];
    let geo_data = data[1];

    let unique_years = [...new Set(died_data.map(d => d.Period))]; // 取得所有年份
    console.log("Available years:", unique_years);

    // **找到 9900 年的台北市數據**
    let taipei_data = died_data.find(d => d.Period === 9900 && d.Category2Title === "台北市");
    
    if (taipei_data) {
        console.log("Adding 新北市 data for year 9900:", taipei_data.Val);

        // **新增 9900 年的新北市數據**
        died_data.push({
            Category1Title: taipei_data.Category1Title,
            Category2Title: "新北市",
            Category3Title: taipei_data.Category3Title,
            Category4Title: taipei_data.Category4Title,
            Category5Title: taipei_data.Category5Title,
            Period: 9900,
            Val: taipei_data.Val  // 設定與台北市相同的人數
        });
    }

    let selected_year = 11200; // 預設選擇 9600 年
    draw_map(died_data, geo_data, selected_year);
});

function unpack(rows, key) {
    return rows.map(function(row){ 
        return row[key]; 
    });
}
var myPlot = document.getElementById('myGraph');

function draw_map(died_data, geo_data, year=11200) {
    console.log(unpack(died_data, "Category2Title").sort());
    let filtered_data = died_data.filter(d => d.Period === year);

    console.log("Filtered data:", filtered_data);

    let trace1 = {
        name: "",
        type: "choropleth",
        locationmode: "geojson-id",
        featureidkey: "properties.COUNTYNAME",
        locations: unpack(filtered_data, "Category2Title"), // 各縣市
        geojson: geo_data,
        z: unpack(filtered_data, "Val"), // 死亡數
        zmin: 0,
        zmax: 35000,
        colorscale: [
            [0, 'lightyellow'],
            [1, 'brown']
        ],
        hovertemplate: "%{location}: %{z:,}人",
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
            text: year/100+1911 + " 年各縣市人口死亡數",
            font: {
                size: 40,
                color: "black"
            },
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
