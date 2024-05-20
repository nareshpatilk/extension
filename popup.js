const dropDown = document.getElementById("mySelect");
const dynamicChart = document.getElementById("dynamicChart");
let result;

const pieChart = Highcharts.chart("container", {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: "pie",
  },
  title: {
    text: "Pie Chart",
    align: "left",
  },
  tooltip: {
    pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
  },
  accessibility: {
    enabled: false,
    point: {
      valueSuffix: "%",
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>: {point.percentage:.1f} %",
      },
    },
  },
  series: [
    {
      name: "Brands",
      colorByPoint: true,
      data: [],
    },
  ],
  exporting: {
    enabled: true, // Enable exporting module
  },
});

const barChart = Highcharts.chart("barChart", {
  chart: {
    type: "column",
  },
  title: {
    align: "left",
    text: "Bar Chart",
  },
  accessibility: {
    enabled: false,
    announceNewData: {
      enabled: true,
    },
  },
  xAxis: {
    type: "category",
  },
  yAxis: {},
  legend: {
    enabled: false,
  },
  plotOptions: {
    series: {
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        format: "{point.y:.1f}%",
      },
    },
  },

  tooltip: {
    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
    pointFormat:
      '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
  },

  series: [
    {
      name: "Browsers",
      colorByPoint: true,
      data: [],
    },
  ],
  exporting: {
    enabled: true, // Enable exporting module
  },
});

const setChartData = (option) => {
  console.log(option);
  let obj = result[option].reduce((acc, curr) => {
    const currentDict = acc.find((dict) => dict.name === curr);
    if (currentDict) {
      currentDict.y += 1;
    } else {
      acc.push({ name: curr, y: 1 });
    }
    return acc;
  }, []);

  console.log(obj);
  pieChart.series[0].setData(obj);
  barChart.series[0].setData(obj);
};

const changedOption = () => {
  setChartData(dropDown.value);
};

async function scrapeHtmlCode() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: typeOfTable,
    });
  } catch (e) {
    document.body.textContent = "Cannot access page";
    return;
  }
  console.log("herere is the data = > ", result);

  buildOptions();

  setChartData(Object.keys(result)[0]);

  // process the result
}

async function dynamicCode() {
  var chartDisplay = document.getElementById("chart");
  if (chartDisplay.style.display === "none") {
    chartDisplay.style.display = "block";
  } else {
    chartDisplay.style.display = "none";
  }

  var dynamicSelect = document.getElementById("mySelect");
  if (dynamicSelect.style.display === "none") {
    dynamicSelect.style.display = "block";
  } else {
    dynamicSelect.style.display = "none";
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    console.log("i started");
    [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: toKnowType,
    });
  } catch (e) {
    console.log(e);
    document.body.textContent = "Cannot access page";
    return;
  }
  console.log("herere is the data = > ", result);

  setChartData(Object.keys(result)[0]);
  buildOptions();

  // process the result
}

const toKnowType = async () => {
  const onDOM = () => {
    let abc = {};
    //Process the datatype and send it extension, need to find a proper way to create a data structure
    Array.from(document.getElementsByClassName("ag-cell-value")).forEach(
      (x) => {
        abc[x.getAttribute("col-id")] = Array.isArray(
          abc[x.getAttribute("col-id")]
        )
          ? [...abc[x.getAttribute("col-id")], x.textContent]
          : [x.textContent];
      }
    );
    return abc;
  };

  async function typeOfTable() {
    const data = document.documentElement.innerHTML;
    let finalResult = {};
    let chartResult = {
      headers: [],
      mapRes: [],
    };
    let newResult;
    const headers = [];
    try {
      let table = document.querySelector("table:has(thead)");
      table = table == null ? document.querySelector("table") : table;
      thead =
        table == null
          ? table.querySelectorAll("tr")
          : table.querySelectorAll("thead");
      const th = table.querySelectorAll("th");
      let i = 0;
      for (const header of th) {
        let val = header.innerText;
        if (val.toString().length > 0) {
          headers.push(val.trim());
        } else {
          headers.push(++i);
        }
      }
      chartResult.headers = headers;
      const tbody = table.querySelector("table:has(tbody)");
      const trow =
        tbody != null
          ? tbody.querySelectorAll("tr")
          : table.querySelectorAll("tr");

      const tabledata = [];
      for (const row of trow) {
        const tds = row.querySelectorAll("td");
        const eachRow = [];
        for (const td of tds) {
          let val = td.innerText;
          if (val.toString().length > 0) {
            eachRow.push(val.trim());
          } else {
            eachRow.push("unknown");
          }
        }
        tabledata.push(eachRow);
      }

      const manipulateData = {};

      for (let header of headers) {
        manipulateData[header] = [];
      }

      for (let l = 0; l < tabledata.length; l++) {
        for (k = 0; k < tabledata[l].length; k++) {
          let arr = manipulateData[headers[k]];
          arr.push(tabledata[l][k]);
          manipulateData[headers[k]] = arr;
        }
      }
      Object.entries(manipulateData).forEach((v, k) => {
        let res = v.reduce((occurrences, item) => {
          occurrences[item] = (occurrences[item] || 0) + 1;
          return occurrences;
        }, []);
        finalResult[k] = res;
      });

      chartResult.mapRes.push(manipulateData);
      newResult = manipulateData;
    } catch (err) {
      console.log(err);
      //alert(err);
    }
    return newResult;
  }

  async function slickGrid() {
    let chartResult = {
      headers: [],
      mapRes: [],
    };
    let finalres = {};
    const headers = [];
    const slickHeaderColumns = document.querySelectorAll(
      ".slick-header-columns"
    )[0];

    if (slickHeaderColumns) {
      const ce = slickHeaderColumns.querySelectorAll("*");

      for (const c of ce) {
        if (c.classList.contains("slick-header-column")) {
          const cn = c.textContent.trim();
          if (cn.length > 0) {
            headers.push(cn.replace("\n\t\t\t\t", ""));
          }
        }
      }
    }
    chartResult.headers = headers;
    const slickViewport = document.querySelector(".slick-viewport");
    const slickdata = [];

    if (slickViewport) {
      const rows = slickViewport.querySelectorAll(".slick-row");

      for (const row of rows) {
        let i = 0;
        const cells = row.querySelectorAll(".slick-cell");

        const dataval = {};
        for (let i = 0; i < headers.length; i++) {
          dataval[headers[i]] = "";
        }

        for (const cell of cells) {
          if (!cell.className.toString().includes("slick-cell-checkboxse")) {
            const cellvalue = cell.textContent.trim();
            dataval[headers[i]] = cellvalue;
            i++;
          }
        }
        slickdata.push(dataval);
      }
    }

    for (let i = 0; i < headers.length; i++) {
      finalres[headers[i]] = [];
    }

    let j = 0;
    for (let he of headers) {
      for (let i = 0; i < slickdata.length; i++) {
        const key = Object.keys(slickdata[i])[j];

        if (key === he) {
          finalres[he].push(slickdata[i][key]);
        }
      }
      j++;
    }
    console.log(finalres, "1222", finalres);
    return finalres;
  }

  if (
    Array.from(document.getElementsByClassName("ag-cell-value"))?.length > 0
  ) {
    return await onDOM();
  } else if (
    Array.from(document.getElementsByClassName("slick-header-columns"))
      ?.length > 0
  ) {
    return await slickGrid();
  } else {
    return await typeOfTable();
  }
};

const buildOptions = () => {
  var length = dropDown.options.length;
  for (i = length - 1; i >= 0; i--) {
    dropDown.options[i] = null;
  }

  for (let h of Object.keys(result)) {
    var option = document.createElement("option");
    option.innerText = h;
    option.value = h;
    dropDown.append(option);
  }
};

dynamicChart.addEventListener("click", dynamicCode);
dropDown.addEventListener("change", changedOption);
