function unpack(rows, key) {
  return rows.map((row) => row[key]);
}

function drawBoxPlot(gender) {
  const fileName = `83年1月至113年10月死亡人口按區域(${gender}).csv`;
  d3.csv(fileName).then((res) => {
    const year = unpack(res, "年份");
    const month = unpack(res, "月份");
    const totalCount = unpack(res, "區域別總計");

    // 創建12個陣列
    const monthlyTotals = Array.from({ length: 12 }, () => []);

    // 將83至112每年對應月份的人數放入陣列
    res.forEach((row) => {
      if (row["年份"] >= 83 && row["年份"] <= 112) {
        const monthIndex = parseInt(row["月份"], 10) - 1; // 將月份轉換為索引 (0-11)
        monthlyTotals[monthIndex].push(parseInt(row["區域別總計"], 10));
      }
    });

    // 準備箱型圖的數據
    const data = monthlyTotals.map((totals, index) => ({
      y: totals,
      type: "box",
      name: `${index + 1}月`,
      x: Array(totals.length).fill(`${index + 1}月`),
    }));

    // 設定箱型圖的佈局
    const layout = {
      title: `月份死亡人數箱型圖 (${gender})`,
      xaxis: {
        title: "月份",
        tickvals: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        ticktext: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
      },
      yaxis: {
        title: "每月死亡人數",
      },
    };

    // 繪製箱型圖
    Plotly.newPlot("boxPlotDiv", data, layout);
  });
}

let currentMode = "2D";
let currentGender = "全";

function drawHeatMap(gender) {
  const fileName = `83年1月至113年10月死亡人口按區域(${gender}).csv`;
  d3.csv(fileName).then((res) => {
    const counties = [
      // 縣市名稱照北到南順序排列
      "新北市",
      "臺北市",
      "基隆市",
      "桃園市",
      "宜蘭縣",
      "新竹縣",
      "新竹市",
      "苗栗縣",
      "臺中市",
      "彰化縣",
      "南投縣",
      "花蓮縣",
      "雲林縣",
      "嘉義縣",
      "嘉義市",
      "臺南市",
      "高雄市",
      "臺東縣",
      "屏東縣",
      "澎湖縣",
      "金門縣",
      "連江縣",
    ];

    // 創建12個月份的陣列，每個陣列包含各縣市的總和
    const monthlyTotals = Array.from({ length: 12 }, () =>
      Array(counties.length).fill(0)
    );
    const monthlyCounts = Array.from({ length: 12 }, () =>
      Array(counties.length).fill(0)
    );

    // 將83至112每年對應月份的各縣市人數放入陣列
    res.forEach((row) => {
      if (row["年份"] >= 83 && row["年份"] <= 112) {
        const monthIndex = parseInt(row["月份"], 10) - 1; // 將月份轉換為索引 (0-11)
        counties.forEach((county, index) => {
          monthlyTotals[monthIndex][index] += parseInt(row[county], 10);
          monthlyCounts[monthIndex][index] += 1;
        });
      }
    });

    // 計算平均值
    const monthlyAverages = monthlyTotals.map((totals, monthIndex) =>
      totals.map(
        (total, countyIndex) => total / monthlyCounts[monthIndex][countyIndex]
      )
    );

    // 準備熱圖的數據
    const data = [
      {
        z: monthlyAverages, // 保持月份順序，使1月在上
        x: counties,
        y: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        type: currentMode === "3D" ? "surface" : "heatmap",
        colorscale: "Viridis",
      },
    ];

    // 設定熱圖的佈局
    const layout = {
      title: `各縣市每月平均死亡人數熱圖 (${gender})(83年至112年平均)`,
      xaxis: {
        title: "縣市",
      },
      yaxis: {
        title: "月份",
      },
    };

    // 繪製熱圖
    Plotly.newPlot("heatPlotDiv", data, layout);
  });
}

function toggleHeatMapMode() {
  currentMode = currentMode === "2D" ? "3D" : "2D";
  // 重新繪製當前選擇的熱圖
  drawHeatMap(currentGender);
}

function drawAnimationMap() {
  const geoJsonFile = "taiwan_geo.json";
  const csvFile = "83年1月至113年10月死亡人口按區域(全).csv";

  Promise.all([d3.json(geoJsonFile), d3.csv(csvFile)]).then(
    ([geoData, csvData]) => {
      const years = Array.from({ length: 112 - 83 + 1 }, (_, i) => i + 83);

      let frames = [];

      years.forEach((year) => {
        const filteredData = csvData.filter((row) => row["年份"] == year);
        const regionData = {};

        filteredData.forEach((row) => {
          Object.keys(row).forEach((key) => {
            if (key !== "年份" && key !== "月份" && key !== "區域別總計") {
              if (!regionData[key]) {
                regionData[key] = 0;
              }
              regionData[key] += parseInt(row[key], 10);
            }
          });
        });

        frames.push({
          name: `${year}`,
          data: [
            {
              type: "choropleth",
              locationmode: "geojson-id",
              featureidkey: "properties.name",
              locations: Object.keys(regionData),
              geojson: geoData,
              z: Object.values(regionData),
              zmin: 0,
              zmax: 30000,
              colorscale: [
                [0, "lightyellow"],
                [1, "brown"],
              ],
              colorbar: {
                title: "死亡人數",
                ticksuffix: "",
                showticksuffix: "last",
              },
              hovertemplate: "%{location}: %{z:,} 死亡人數",
              hoverlabel: {
                bgcolor: "white",
                bordercolor: "black",
                font: {
                  family: "Arial",
                  size: 30,
                  color: "black",
                },
              },
              name: "",
            },
          ],
          layout: {
            title: {
              text: `${year} 年各縣市死亡人數`,
              font: {
                size: 40,
                color: "black",
              },
              x: 0.5,
              y: 0.98,
            },
          },
        });
      });

      const layout = {
        title: {
          text: `各縣市死亡人數`,
          font: {
            size: 40,
            color: "black",
          },
          x: 0.5,
          y: 0.98,
        },
        geo: {
          center: {
            lon: 120.32,
            lat: 23.84,
          },
          fitbounds: "locations",
          projection: {
            type: "mercator",
          },
          resolution: 50,
        },
        margin: {
          l: 10,
          r: 10,
          t: 60,
          b: 10,
        },
        updatemenus: [
          {
            type: "buttons",
            showactive: false,
            buttons: [
              {
                label: "播放",
                method: "animate",
                args: [null, { mode: "immediate", fromcurrent: true }],
              },
              {
                label: "暫停",
                method: "animate",
                args: [
                  [null],
                  {
                    mode: "immediate",
                    frame: { redraw: false, duration: 0 },
                    transition: { duration: 0 },
                  },
                ],
              },
            ],
          },
        ],
        sliders: [
          {
            active: 0,
            steps: frames.map((frame) => ({
              label: frame.name,
              method: "animate",
              args: [
                [frame.name],
                {
                  mode: "immediate",
                  transition: { duration: 300 },
                  frame: { duration: 300, redraw: false },
                },
              ],
            })),
          },
        ],
      };

      Plotly.newPlot("animationMapDiv", frames[0].data, layout).then(() => {
        Plotly.addFrames("animationMapDiv", frames);
      });
    }
  );
}

function drawCumulativeAnimationMap() {
  const geoJsonFile = "taiwan_geo.json";
  const csvFile = "83年1月至113年10月死亡人口按區域(全).csv";

  Promise.all([d3.json(geoJsonFile), d3.csv(csvFile)]).then(
    ([geoData, csvData]) => {
      const years = Array.from({ length: 112 - 83 + 1 }, (_, i) => i + 83);
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const monthNames = [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ];

      let frames = [];
      let cumulativeData = {};

      years.forEach((year) => {
        months.forEach((month) => {
          const filteredData = csvData.filter(
            (row) => row["年份"] == year && row["月份"] == month
          );

          filteredData.forEach((row) => {
            Object.keys(row).forEach((key) => {
              if (key !== "年份" && key !== "月份" && key !== "區域別總計") {
                if (!cumulativeData[key]) {
                  cumulativeData[key] = 0;
                }
                cumulativeData[key] += parseInt(row[key], 10);
              }
            });
          });

          frames.push({
            name: `${year}-${month}`,
            data: [
              {
                type: "choropleth",
                locationmode: "geojson-id",
                featureidkey: "properties.name",
                locations: Object.keys(cumulativeData),
                geojson: geoData,
                z: Object.values(cumulativeData),
                zmin: 0,
                zmax: 18000,
                colorscale: [
                  [0, "lightyellow"],
                  [1, "brown"],
                ],
                colorbar: {
                  title: "死亡人數",
                  ticksuffix: "",
                  showticksuffix: "last",
                },
                hovertemplate: "%{location}: %{z:,} 死亡人數",
                hoverlabel: {
                  bgcolor: "white",
                  bordercolor: "black",
                  font: {
                    family: "Arial",
                    size: 30,
                    color: "black",
                  },
                },
                name: "",
              },
            ],
            layout: {
              title: {
                text: `${year} 年累計各縣市死亡人數 (至${
                  monthNames[month - 1]
                })`,
                font: {
                  size: 40,
                  color: "black",
                },
                x: 0.5,
                y: 0.98,
              },
            },
          });
        });
        cumulativeData = {}; // 每年重置累加數據
      });

      const layout = {
        title: {
          text: `累計各縣市死亡人數(逐月)`,
          font: {
            size: 40,
            color: "black",
          },
          x: 0.5,
          y: 0.98,
        },
        geo: {
          center: {
            lon: 120.32,
            lat: 23.84,
          },
          fitbounds: "locations",
          projection: {
            type: "mercator",
          },
          resolution: 50,
        },
        margin: {
          l: 10,
          r: 10,
          t: 60,
          b: 10,
        },
        updatemenus: [
          {
            type: "buttons",
            showactive: false,
            buttons: [
              {
                label: "播放",
                method: "animate",
                args: [null, { mode: "immediate", fromcurrent: true }],
              },
              {
                label: "暫停",
                method: "animate",
                args: [
                  [null],
                  {
                    mode: "immediate",
                    frame: { redraw: false, duration: 0 },
                    transition: { duration: 0 },
                  },
                ],
              },
            ],
          },
        ],
        sliders: [
          {
            active: 0,
            steps: frames.map((frame) => ({
              label: frame.name,
              method: "animate",
              args: [
                [frame.name],
                {
                  mode: "immediate",
                  transition: { duration: 300 },
                  frame: { duration: 300, redraw: false },
                },
              ],
            })),
          },
        ],
      };

      Plotly.newPlot("animationMapDiv2", frames[0].data, layout).then(() => {
        Plotly.addFrames("animationMapDiv2", frames);
      });
    }
  );
}

function drawPieChart(gender, years) {
  const fileName = `83年1月至113年10月死亡人口按區域(${gender}).csv`;
  d3.csv(fileName).then((res) => {
    const counties = [
      "新北市",
      "臺北市",
      "基隆市",
      "桃園市",
      "宜蘭縣",
      "新竹縣",
      "新竹市",
      "苗栗縣",
      "臺中市",
      "彰化縣",
      "南投縣",
      "花蓮縣",
      "雲林縣",
      "嘉義縣",
      "嘉義市",
      "臺南市",
      "高雄市",
      "臺東縣",
      "屏東縣",
      "澎湖縣",
      "金門縣",
      "連江縣",
    ];

    const totalDeathsByCounty = counties.reduce((acc, county) => {
      acc[county] = 0;
      return acc;
    }, {});

    const charts = [];

    years.forEach((year) => {
      const yearlyDeathsByCounty = { ...totalDeathsByCounty };

      res.forEach((row) => {
        if (year === "平均" || row["年份"] == year) {
          counties.forEach((county) => {
            yearlyDeathsByCounty[county] += parseInt(row[county], 10);
          });
        }
      });

      const totalDeaths = Object.values(yearlyDeathsByCounty).reduce(
        (a, b) => a + b,
        0
      );
      const labels = Object.keys(yearlyDeathsByCounty);
      const values = labels.map((county) => yearlyDeathsByCounty[county]);
      const text = labels.map((county) => {
        const percentage = (yearlyDeathsByCounty[county] / totalDeaths) * 100;
        return percentage >= 4 ? `${county} (${percentage.toFixed(2)}%)` : "";
      });

      const data = [
        {
          type: "pie",
          labels: labels,
          values: values,
          text: text,
          textinfo: "text",
          insidetextorientation: "radial",
        },
      ];

      const layout = {
        title: `${year} 年各縣市死亡人數圓餅圖 (${gender})`,
      };

      charts.push({ data, layout });
    });

    // 清空之前的圖表
    document.getElementById("pieChartDiv").innerHTML = "";

    // 繪製新的圖表
    charts.forEach((chart, index) => {
      const div = document.createElement("div");
      div.id = `pieChartDiv${index}`;
      document.getElementById("pieChartDiv").appendChild(div);
      Plotly.newPlot(div.id, chart.data, chart.layout);
    });
  });
}

function drawSunburstChart(gender) {
  const fileName = `83年1月至113年10月死亡人口按區域(${gender}).csv`;
  d3.csv(fileName).then((res) => {
    const counties = [
      "新北市",
      "臺北市",
      "基隆市",
      "桃園市",
      "宜蘭縣",
      "新竹縣",
      "新竹市",
      "苗栗縣",
      "臺中市",
      "彰化縣",
      "南投縣",
      "花蓮縣",
      "雲林縣",
      "嘉義縣",
      "嘉義市",
      "臺南市",
      "高雄市",
      "臺東縣",
      "屏東縣",
      "澎湖縣",
      "金門縣",
      "連江縣",
    ];

    north_counties = [
      "臺北市",
      "新北市",
      "基隆市",
      "新竹市",
      "桃園市",
      "新竹縣",
      "宜蘭縣",
    ];
    central_counties = ["臺中市", "苗栗縣", "彰化縣", "南投縣", "雲林縣"];
    south_counties = [
      "高雄市",
      "臺南市",
      "嘉義市",
      "嘉義縣",
      "屏東縣",
      "澎湖縣",
    ];
    east_counties = ["花蓮縣", "臺東縣"];
    offshore_islands = ["金門縣", "連江縣"];

    const totalDeathsByCounty = counties.reduce((acc, county) => {
      acc[county] = 0;
      return acc;
    }, {});

    const yearlyDeathsByRegion = {
      北部: { ...totalDeathsByCounty },
      中部: { ...totalDeathsByCounty },
      南部: { ...totalDeathsByCounty },
      東部: { ...totalDeathsByCounty },
      離島: { ...totalDeathsByCounty },
    };

    res.forEach((row) => {
      counties.forEach((county) => {
        if (north_counties.includes(county)) {
          yearlyDeathsByRegion["北部"][county] += parseInt(row[county], 10);
        } else if (central_counties.includes(county)) {
          yearlyDeathsByRegion["中部"][county] += parseInt(row[county], 10);
        } else if (south_counties.includes(county)) {
          yearlyDeathsByRegion["南部"][county] += parseInt(row[county], 10);
        } else if (east_counties.includes(county)) {
          yearlyDeathsByRegion["東部"][county] += parseInt(row[county], 10);
        } else if (offshore_islands.includes(county)) {
          yearlyDeathsByRegion["離島"][county] += parseInt(row[county], 10);
        }
      });
    });

    const totalDeaths = Object.values(yearlyDeathsByRegion).reduce(
      (acc, region) => acc + Object.values(region).reduce((a, b) => a + b, 0),
      0
    );

    const data = [
      {
        type: "sunburst",
        labels: [
          "北部",
          "中部",
          "南部",
          "東部",
          "離島",
          ...north_counties,
          ...central_counties,
          ...south_counties,
          ...east_counties,
          ...offshore_islands,
        ],
        parents: [
          "",
          "",
          "",
          "",
          "",
          ...Array(north_counties.length).fill("北部"),
          ...Array(central_counties.length).fill("中部"),
          ...Array(south_counties.length).fill("南部"),
          ...Array(east_counties.length).fill("東部"),
          ...Array(offshore_islands.length).fill("離島"),
        ],
        values: [
          Object.values(yearlyDeathsByRegion["北部"]).reduce(
            (a, b) => a + b,
            0
          ),
          Object.values(yearlyDeathsByRegion["中部"]).reduce(
            (a, b) => a + b,
            0
          ),
          Object.values(yearlyDeathsByRegion["南部"]).reduce(
            (a, b) => a + b,
            0
          ),
          Object.values(yearlyDeathsByRegion["東部"]).reduce(
            (a, b) => a + b,
            0
          ),
          Object.values(yearlyDeathsByRegion["離島"]).reduce(
            (a, b) => a + b,
            0
          ),
          ...north_counties.map(
            (county) => yearlyDeathsByRegion["北部"][county]
          ),
          ...central_counties.map(
            (county) => yearlyDeathsByRegion["中部"][county]
          ),
          ...south_counties.map(
            (county) => yearlyDeathsByRegion["南部"][county]
          ),
          ...east_counties.map(
            (county) => yearlyDeathsByRegion["東部"][county]
          ),
          ...offshore_islands.map(
            (county) => yearlyDeathsByRegion["離島"][county]
          ),
        ].map((value) => (value / totalDeaths) * 100),
        hoverinfo: "label+value+percent total",
        branchvalues: "total",
      },
    ];

    const layout = {
      title: `各區/縣市死亡人數佔臺灣比例旭日圖(83年至112年平均)`,
    };

    Plotly.newPlot("sunburstDiv", data, layout);
  });
}

// 包含火化數量
function drawLineChart1() {
  const fileName = `96至112年火化數.csv`;
  const fileName2 = `96至112年環保葬數量.csv`;
  let years = [];
  let fired_counts = [];
  let park_counts = [];
  let ocean_counts = [];
  let tree_counts = [];
  let eco_counts = [];

  Promise.all([d3.csv(fileName), d3.csv(fileName2)]).then((results) => {
    const res1 = results[0];
    const res2 = results[1];

    years = unpack(res1, "統計期");
    fired_counts = unpack(res1, "屍體火化數");
    park_counts = unpack(res2, "公園、綠地");
    ocean_counts = unpack(res2, "海洋");
    tree_counts = unpack(res2, "樹葬");
    eco_counts = unpack(res2, "總計");

    const data = [
      {
        x: years,
        y: fired_counts,
        type: "scatter",
        mode: "lines",
        name: "火化數",
      },
      {
        x: years,
        y: park_counts,
        type: "scatter",
        mode: "lines",
        name: "公園、綠地",
      },
      {
        x: years,
        y: ocean_counts,
        type: "scatter",
        mode: "lines",
        name: "海洋",
      },
      {
        x: years,
        y: tree_counts,
        type: "scatter",
        mode: "lines",
        name: "樹葬",
      },
      {
        x: years,
        y: eco_counts,
        type: "scatter",
        mode: "lines",
        name: "環保葬總數",
      },
    ];

    const layout = {
      title: "96至112年火化與環保葬數量折線圖",
      xaxis: {
        title: "年份",
      },
      yaxis: {
        title: "數量",
      },
    };

    Plotly.newPlot("lineChartDiv", data, layout);
  });
}

// 不包含火化數量
function drawLineChart2() {
  const fileName = `96至112年環保葬數量.csv`;
  let years = [];
  let park_counts = [];
  let ocean_counts = [];
  let tree_counts = [];
  let eco_counts = [];

  d3.csv(fileName).then((res) => {
    years = unpack(res, "統計期");
    park_counts = unpack(res, "公園、綠地");
    ocean_counts = unpack(res, "海洋");
    tree_counts = unpack(res, "樹葬");
    eco_counts = unpack(res, "總計");

    const data = [
      {
        x: years,
        y: park_counts,
        type: "scatter",
        mode: "lines",
        name: "公園、綠地",
      },
      {
        x: years,
        y: ocean_counts,
        type: "scatter",
        mode: "lines",
        name: "海洋",
      },
      {
        x: years,
        y: tree_counts,
        type: "scatter",
        mode: "lines",
        name: "樹葬",
      },
      {
        x: years,
        y: eco_counts,
        type: "scatter",
        mode: "lines",
        name: "環保葬總數",
      },
    ];

    const layout = {
      title: "96至112年環保葬數量折線圖",
      xaxis: {
        title: "年份",
      },
      yaxis: {
        title: "數量",
      },
    };

    Plotly.newPlot("lineChartDiv2", data, layout);
  });
}

function drawBarChart() {
  const fileName = `96至112年殯儀館.csv`;
  const fileName2 = `96至112年死亡統計.csv`;
  let years = [];
  let total_deaths = [];
  let funeral_homes = [];

  Promise.all([d3.csv(fileName), d3.csv(fileName2)]).then((results) => {
    const res1 = results[0];
    const res2 = results[1];

    years = unpack(res1, "統計期");
    funeral_homes = unpack(res1, "殯殮數");
    total_deaths = unpack(res2, "死亡人數");

    const data = [
      {
        x: years,
        y: funeral_homes,
        type: "bar",
        name: "殯儀館處理人數",
      },
      {
        x: years,
        y: total_deaths,
        type: "bar",
        name: "總死亡數",
      },
    ];

    const layout = {
      title: "96至112年殯儀館處理人數與總死亡數長條圖",
      xaxis: {
        title: "年份",
      },
      yaxis: {
        title: "數量",
      },
    };

    Plotly.newPlot("barChartDiv", data, layout);
  });
}

// 殯儀館數與總死亡數百分比成長趨勢
// 殯儀館數/總死亡數
function drawLineChart3() {
  const fileName = `96至112年殯儀館.csv`;
  const fileName2 = `96至112年死亡統計.csv`;
  let years = [];
  let total_deaths = [];
  let funeral_homes = [];

  Promise.all([d3.csv(fileName), d3.csv(fileName2)]).then((results) => {
    const res1 = results[0];
    const res2 = results[1];

    years = unpack(res1, "統計期");
    funeral_homes = unpack(res1, "殯殮數");
    total_deaths = unpack(res2, "死亡人數");

    const data = [
      {
        x: years,
        y: funeral_homes.map(
          (value, index) => (value / total_deaths[index]) * 100
        ),
        type: "scatter",
        mode: "lines",
        name: "殯儀館數/總死亡數",
      },
    ];

    const layout = {
      title: "96至112年殯儀館處理數/總死亡數百分比成長趨勢",
      xaxis: {
        title: "年份",
      },
      yaxis: {
        title: "百分比",
        range: [0, 100],
      },
    };

    Plotly.newPlot("lineChartDiv3", data, layout);
  });
}

function toggleDiscardedContent() {
  const container = document.getElementById("discardedContainer");
  if (container.style.display === "none") {
    container.style.display = "block";
  } else {
    container.style.display = "none";
  }
}

// 預設顯示全體數據
drawBoxPlot("全");
drawHeatMap("全");
drawAnimationMap();
drawCumulativeAnimationMap();
drawPieChart("全", ["平均"]);
drawSunburstChart("全");
drawLineChart1();
drawLineChart2();
drawBarChart();
drawLineChart3();

// 更新圓餅圖
function updatePieChart() {
  const gender = document.getElementById("genderSelect").value;
  const yearCheckboxes = document.querySelectorAll(
    'input[name="year"]:checked'
  );
  const years = Array.from(yearCheckboxes).map((checkbox) => checkbox.value);
  drawPieChart(gender, years);
}
