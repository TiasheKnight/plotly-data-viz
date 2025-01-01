d3.csv("../static/data/WPP2024_MORT_F01_1_DEATHS_SINGLE_AGE_BOTH_SEXES.csv").then(
    res => {
        console.log(res);
        drawBoxPlot(res);
    }
);

function unpack(rows,key){
    return rows.map(function (row){
        return row[key];
    });
}
var myPlot = document.getElementById('myGraph');
function drawBoxPlot(res,loc='World',gender=null,ageLow=0,ageHigh=100,year=2023){
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
            text: "Deaths Distribution by Age: " + ageLow + " to " + ageHigh +' in '+  loc + " in " + year, 
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
            drawBoxPlot(res, country, gender, ageLow, ageHigh, year);
        }
    );
    
};