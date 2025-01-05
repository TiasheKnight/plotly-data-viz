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
function drawBarChart(data,country='World',gender=null,ageLow=0,ageHigh=100,year='2023'){
    const yearField = 'Year';
    const countryField = 'Region, subregion, country or area *';
    const age15Field = 'Life Expectancy at Age 15, both sexes (years)';
    const age65Field = 'Life Expectancy at Age 65, both sexes (years)';
    const age80Field = 'Life Expectancy at Age 80, both sexes (years)';

    const filteredData = data.filter(
        row => row[yearField] === year && row[countryField] === country
    );
    console.log(filteredData)
    if (filteredData.length > 0) {
        console.log('checking filteredData');
        const age15 = parseFloat(filteredData[0][age15Field]) || 0;
        const age65 = parseFloat(filteredData[0][age65Field]) || 0;
        const age80 = parseFloat(filteredData[0][age80Field]) || 0;
        // 创建 trace
        const barTrace = {
            x: ['Age 15', 'Age 65', 'Age 80'],
            y: [age15, age65, age80],
            type: 'bar',
            marker: { color: ['gray', 'blue', 'black'] },
            hovertemplate: '%{x}: %{y} years<extra></extra>',
        };

        const layout = {
            title: `${country} - Life Expectancy at Different Ages in ${year}`,
            xaxis: { title: 'Age Groups' },
            yaxis: { title: 'Life Expectancy (years)' },
            height: 400,
        };
            // Plot the chart
        Plotly.newPlot(myPlot, [barTrace], layout); // Ensure 'Bar_chart' is the correct ID of your plot element
            
    };
}
function renderVisualization(country, gender, ageLow, ageHigh, year){
    d3.csv('../static/data/WPP2024_GEN_F01_DEMOGRAPHIC_INDICATORS_COMPACT.csv').then(
        res => {
            console.log(res);
            drawBarChart(res, country, gender, ageLow, ageHigh, year);
        }
    );
    
};

