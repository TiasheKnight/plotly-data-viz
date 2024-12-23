d3.csv("../static/data/WPP2024_GEN_F01_DEMOGRAPHIC_INDICATORS_COMPACT.csv").then(
    res => {
        console.log(res);
        drawLineChart(res);
    }
);

function unpack(rows,key){
    return rows.map(function (row){
        return row[key];
    });
}

function drawLineChart(res){
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

    let loc = "Europe and Northern America";

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
            text: "Total Deaths in " + loc, 
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

    Plotly.newPlot("myGraph", data, layout);
}