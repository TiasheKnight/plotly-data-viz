// 提取指定字段的数据
function unpack(rows, key) {
  return rows.map(function (row) {
    return row[key];
  });
}

function drawPieCharts(data) {
  let countryField = "Region, subregion, country or area *";
  let yearField = "Year";
  let maleDeathsField = "Male Deaths (thousands)";
  let femaleDeathsField = "Female Deaths (thousands)";

  // 过滤出2024年的数据
  let data2023 = data.filter((row) => row[yearField] === "2023");

  // 检查是否成功过滤出2024年数据
  console.log("Data for 2023:", data2023);

  // 获取所有国家的列表
  let countries = [...new Set(unpack(data2023, countryField))];

  // 创建 traces 列表
  let traces = [];

  // 配置布局 - 使用subplots
  let rows = countries.length;
  let cols = 1; // 每个国家一个圆饼图

  countries.forEach((country, idx) => {
    // 过滤出当前国家的数据
    let countryData = data2023.filter((row) => row[countryField] === country);

    // 如果当前国家的数据存在
    if (countryData.length > 0) {
      let maleDeaths = parseFloat(countryData[0][maleDeathsField]) || 0;
      let femaleDeaths = parseFloat(countryData[0][femaleDeathsField]) || 0;
      let totalDeaths = maleDeaths + femaleDeaths; // 计算总死亡人数

      // 计算男性和女性死亡人数的占比
      let malePercentage = (maleDeaths / totalDeaths) * 100;
      let femalePercentage = (femaleDeaths / totalDeaths) * 100;

      // 创建一个圆饼图的 trace
      let pieTrace = {
        type: "pie",
        labels: ["Male Deaths", "Female Deaths"],
        values: [maleDeaths, femaleDeaths],
        textinfo: "label+percent", // 显示标签和占比
        insidetextorientation: "radial",
        domain: { row: idx, column: 0 }, // 将图表放在第 idx 行第 1 列
        name: `${country} Deaths`,
      };

      traces.push(pieTrace);
    }
  });

  // 配置图表布局
  let layout = {
    title: "Deaths by Gender in 2024",
    grid: { rows: rows, columns: cols }, // 每个国家一个圆饼图
    height: rows * 400, // 动态设置高度，确保有足够空间显示
    showlegend: false, // 不显示图例
  };

  // 绘制图表
  Plotly.newPlot("myGraph", traces, layout);
}

d3.csv("WPP2024_GEN_F01_DEMOGRAPHIC_INDICATORS_COMPACT.csv")
  .then((res) => {
    console.log(res); // 输出读取的数据，检查数据是否加载正确
    drawPieCharts(res);
  })
  .catch((error) => {
    console.error("Error loading CSV:", error); // 如果 CSV 加载失败，输出错误信息
  });
