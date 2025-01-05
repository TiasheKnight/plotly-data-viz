d3.csv("../static/data/WPP2024_GEN_F01_DEMOGRAPHIC_INDICATORS_COMPACT.csv").then(
    res => {
        console.log(res);
        drawScatterPlot(res);
    }
);

function unpack(rows,key){
    return rows.map(function (row){
        return row[key];
    });
}
var myPlot = document.getElementById('myGraph');
function drawScatterPlot(res,loc='World',gender=null,ageLow=0,ageHigh=100,year=2023){
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
                text: 'Year',
                font: {
                    family: 'Cambria, monospace',
                    size: 18
                }
            }
        },
        yaxis: {
            title: {
                text: 'Deaths',
                font: {
                    family: 'Cambria, monospace',
                    size: 18
                }
            }
        }
    
    };

    Plotly.newPlot(myPlot, data, layout);
}
function renderVisualization(country, gender, ageLow, ageHigh, year){
    d3.csv('../static/data/WPP2024_GEN_F01_DEMOGRAPHIC_INDICATORS_COMPACT.csv').then(
        res => {
            console.log(res);
            drawScatterPlot(res, country, gender, ageLow, ageHigh, year);
        }
    );
    
};