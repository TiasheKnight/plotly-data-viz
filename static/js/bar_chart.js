d3.csv('../static/data/WPP2024_GEN_F01_DEMOGRAPHIC_INDICATORS_COMPACT.csv').then(
    res => {
        console.log(res);
        drawBarChart(res);
    }
);

function unpack(rows, key) {
    return rows.map(function (row) {
        return row[key];
    });
}
var myPlot = document.getElementById('myGraph');
function drawBarChart(data,loc='World',gender=null,ageLow=0,ageHigh=100,year=2023){

    let countries = [...new Set(unpack(data, 'Region, subregion, country or area *'))];
    

    let traces = [];
    
    countries.forEach(country => {
    
        let countryData = data.filter(row => row['Region, subregion, country or area *'] === country);
        
        // 创建 trace
        let trace = {
            mode: 'lines+markers',
            type: 'scatter',
            name: country,
            x: unpack(countryData, 'Year'),
            y: unpack(countryData, 'Total Deaths (thousands)')
        };
        
        traces.push(trace);
    });

    let layout = {
        margin: {t: 60},
        xaxis: { 
            title: 'Year'
        },
        yaxis: { 
            title: 'Deaths'
        },
        title: 'Deaths by Country and Year'
    };

    // 绘制图表
    Plotly.newPlot(myPlot, traces, layout);
}

