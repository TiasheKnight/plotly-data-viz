d3.csv('WPP2024_GEN_F01_DEMOGRAPHIC_INDICATORS_COMPACT.csv').then(
    res => {
        console.log(res);
        drawLineChart(res);
    }
);

function unpack(rows, key) {
    return rows.map(function (row) {
        return row[key];
    });
}

function drawLineChart(data){

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
    Plotly.newPlot('myGraph', traces, layout);
}