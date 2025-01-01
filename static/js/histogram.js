d3.csv("../static/data/WPP2024_MORT_F01_1_DEATHS_SINGLE_AGE_BOTH_SEXES.csv").then(
    res => {
        console.log(res);
        drawHistogram(res);
    }
);

function unpack(rows,key){
    return rows.map(function (row){
        return row[key];
    });
}

var myPlot = document.getElementById('myGraph');

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


    if (!(ageLow === 0 && ageHigh === 100)) {
        titleText = "Deaths Distribution by Ages: " + ageLow + " to " + ageHigh + " in " + loc + " in " + year;
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

    Plotly.newPlot(myPlot, data, layout);

}
function renderVisualization(country, gender, ageLow, ageHigh, year){
    d3.csv("../static/data/WPP2024_MORT_F01_1_DEATHS_SINGLE_AGE_BOTH_SEXES.csv").then(
        res => {
            console.log(res);
            drawHistogram(res, country, gender, ageLow, ageHigh, year);
        }
    );
    
};