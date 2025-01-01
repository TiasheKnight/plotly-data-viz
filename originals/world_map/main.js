
d3.csv(dataURL).then(Global_map);

function unpack(rows, key) {
    return rows.map(function (row) {
        return row[key];
    });
}


function Global_map(rows) {
    year=2023
    Death=[]
    Country=[]
    DD=[]
    CC=[]
    wrong=[]
    max=[]
    max2=[]

    time=unpack(rows, "Year");
    D=unpack(rows, "Total Deaths (thousands)");
    C=unpack(rows, "Region, subregion, country or area *");

    for(let i = 0; i < time.length ; i++){
        if ( time[i] == year) {
            DD.push(D[i].replace(/\s+/g, "")); 
            CC.push(C[i]);
        }
      }

    for(let j = 0; j < DD.length ; j++){
        if ( CC[j] == "China") {
            max.push(DD[j].replace(/\s+/g, "")); // 移除空格
        }     
        if ( CC[j] ==  "SIDS Atlantic, Indian Ocean and South China Sea (AIS)") {
            wrong.push(DD[j].replace(/\s+/g, "")); // 移除空格
        }
        if ( CC[j] == "India") {
            max2.push(DD[j].replace(/\s+/g, "")); // 移除空格
        }
      }

    m = parseFloat(max[0].replace(/'/g, "")); // 去掉單引號，並轉換為數字
    m2 = parseFloat(max2[0].replace(/'/g, "")); // 去掉單引號，並轉換為數字
    w = parseFloat(wrong[0].replace(/'/g, "")); // 去掉單引號，並轉換為數字

    for(let z = 0; z < DD.length ; z++){
        if ( (DD[z]<=m || DD[z]<=m2 )&& DD[z] !=w) {
            Death.push(DD[z].replace(/\s+/g, "")); // 移除空格
            Country.push(CC[z]);
        }
      }

    console.log('output Death:',Death);
    console.log('output Country:',Country);

    //rows.push({ location: 'Taiwan', alcohol: '2' });
    let trace1 = {
        type:"choropleth",
        locationmode: "country names",
        locations: Country,
        
        z: Death,
        zmin: 0,
        zmax: Math.max(...Death.map(value => parseFloat(value.replace(/\s+/g, "")))), // 同樣移除空格後計算最大值

        zmin: 0,    
        //zmax: 3000, 
        text: unpack(rows, "location"),
        autocolorscale: true,


        colorscale:"Picnic" //https://plotly.com/javascript/colorscales/
    };
    let data = [trace1];

    let layout = {
        title: year+" Total Deaths (thousands)",
        geo: {
            projection: {
                Default: "110",
                type: "van der grinten1" //https://plotly.com/javascript/reference/layout/geo/#layout-geo-projection-type
            },
        },

    };
    Plotly.newPlot("myGraph", data, layout);
}
