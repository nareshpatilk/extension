let result;

const finalchart = Highcharts.chart("container", {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: "pie",
  },
  title: {
    text: "Dynamic Dashboards",
    align: "left",
  },
  tooltip: {
    pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
  },
  accessibility: {
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
      data: null,
    },
  ],
});

function showChart() {
  setChartData(element.value);
}

const setChartData = (option) => {
  let obj = result[option].reduce((acc, curr) => {
    const currentDict = acc.find((dict) => dict.name === curr);

    if (currentDict) {
      currentDict.y += 1;
    } else {
      acc.push({ name: curr, y: 1 });
    }

    return acc;
  }, []);

  finalchart.series[0].setData(obj);
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

  for (let h of Object.keys(result)) {
    var option = document.createElement("option");
    option.innerText = h;
    option.value = h;
    element.append(option);
  }
  setChartData(Object.keys(result)[0]);

  // process the result
}

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
    const table = document.querySelector("table");
    const thead = table.querySelectorAll("thead");
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
    const tbody = table.querySelector("tbody");
    const trow = tbody.querySelectorAll("tr");

    const tabledata = [];
    for (const row of trow) {
      const tds = row.querySelectorAll("td");
      const eachRow = [];
      for (const td of tds) {
        let val = td.innerText;
        if (val.toString().length > 0) {
          eachRow.push(val.trim());
        } else {
          eachRow.push("scrpaeeeeeeeeeeee");
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
    console.log(manipulateData);
    Object.entries(manipulateData).forEach((v, k) => {
      let res = v.reduce((occurrences, item) => {
        occurrences[item] = (occurrences[item] || 0) + 1;
        return occurrences;
      }, []);
      finalResult[k] = res;
    });

    console.log("final 148 ", finalResult);
    chartResult.mapRes.push(manipulateData);
    newResult = manipulateData;
  } catch (err) {
    alert(err);
    console.log(err);
  }
  return newResult;
}

document.getElementById("scrapeData").addEventListener("click", scrapeHtmlCode);
let element = document.getElementById("typeColumn");
element.addEventListener("change", showChart);
