async function scrapeHtmlCode() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let result;
  try {
    [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: typeOfTable,
    });
  } catch (e) {
    document.body.textContent = "Cannot access page";
    return;
  }

console.log('herere is the data = > ' + result)
  // process the result
  Highcharts.chart("container", {
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

        data: result,
      },
    ],
  });
}

function normalTableExtract() {}

async function typeOfTable() {
  const data = document.documentElement.innerHTML;
  let finalResult = new Map();
  let chartResult = [];
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

    const manipulateData = new Map();
    let map1 = new Map();

    for (let header of headers) {
      manipulateData.set(header, []);
    }

    for (let l = 0; l < tabledata.length; l++) {
      for (k = 0; k < tabledata[l].length; k++) {
        let arr = manipulateData.get(headers[k]);
        arr.push(tabledata[l][k]);
        manipulateData.set(headers[k], arr);
      }
    }

    

    manipulateData.forEach((v, k) => {
      let res = v.reduce((occurrences, item) => {
        occurrences[item] = (occurrences[item] || 0) + 1;
        return occurrences;
      }, []);
      finalResult.set(k, res);
    });

    const reduced = finalResult.get('Website');
    const result = Object.keys(reduced).map((item) => {
      return { name: item, y: reduced[item] };
    });
    //console.log(result);

    chartResult = result;
  } catch (err) {
    alert(err);
    console.log(err);
  }
  return chartResult;
}

document.getElementById("scrapeData").addEventListener("click", scrapeHtmlCode);
