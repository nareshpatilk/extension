const dropDown = document.getElementById('mySelect')
let result;

const chart = Highcharts.chart('container', {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie'
  },
  title: {
    text: 'Dynamic Dashboards',
    align: 'left'
  },
  tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  accessibility: {
    point: {
      valueSuffix: '%'
    }
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
      }
    }
  },
  series: [{
    name: 'Brands',
    colorByPoint: true,
    data: []
  }]
});


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
  chart.series[0].setData(obj)

}

const changedOption = () => {
  setChartData(dropDown.value)
}



// const onDOM = (document) => {

//   let abc = {}
//   //Process the datatype and send it extension, need to find a proper way to create a data structure
//   Array.from(document.getElementsByClassName("ag-cell-value")).forEach(x => {
//     abc[x.getAttribute('col-id')] = Array.isArray(abc[x.getAttribute('col-id')]) ? [...abc[x.getAttribute('col-id')], x.textContent] : [x.textContent]
//   })

//   return abc
// }

// async function typeOfTable(document) {
//   const data = document.documentElement.innerHTML;
//   let finalResult = {};
//   let chartResult = {
//     headers: [],
//     mapRes: [],
//   };
//   let newResult;
//   const headers = [];
//   try {
//     const table = document.querySelector("table");
//     const thead = table.querySelectorAll("thead");
//     const th = table.querySelectorAll("th");
//     let i = 0;
//     for (const header of th) {
//       let val = header.innerText;
//       if (val.toString().length > 0) {
//         headers.push(val.trim());
//       } else {
//         headers.push(++i);
//       }
//     }
//     chartResult.headers = headers;
//     const tbody = table.querySelector("tbody");
//     const trow = tbody.querySelectorAll("tr");

//     const tabledata = [];
//     for (const row of trow) {
//       const tds = row.querySelectorAll("td");
//       const eachRow = [];
//       for (const td of tds) {
//         let val = td.innerText;
//         if (val.toString().length > 0) {
//           eachRow.push(val.trim());
//         } else {
//           eachRow.push("scrpaeeeeeeeeeeee");
//         }
//       }
//       tabledata.push(eachRow);
//     }

//     const manipulateData = {};

//     for (let header of headers) {
//       manipulateData[header] = [];
//     }

//     for (let l = 0; l < tabledata.length; l++) {
//       for (k = 0; k < tabledata[l].length; k++) {
//         let arr = manipulateData[headers[k]];
//         arr.push(tabledata[l][k]);
//         manipulateData[headers[k]] = arr;
//       }
//     }
//     console.log(manipulateData);
//     Object.entries(manipulateData).forEach((v, k) => {
//       let res = v.reduce((occurrences, item) => {
//         occurrences[item] = (occurrences[item] || 0) + 1;
//         return occurrences;
//       }, []);
//       finalResult[k] = res;
//     });

//     console.log("final 148 ", finalResult);
//     chartResult.mapRes.push(manipulateData);
//     newResult = manipulateData;
//   } catch (err) {
//     alert(err);
//     console.log(err);
//   }
//   return newResult;
// }


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

  buildOptions()

  setChartData(Object.keys(result)[0]);

  // process the result
}


async function dynamicCode() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: toKnowType,
    });
  } catch (e) {
    document.body.textContent = "Cannot access page";
    return;
  }
  console.log("herere is the data = > ", result);

  buildOptions()

  setChartData(Object.keys(result)[0]);

  // process the result
}


const toKnowType = () => {


  const onDOM = () => {

    let abc = {}
    //Process the datatype and send it extension, need to find a proper way to create a data structure
    Array.from(document.getElementsByClassName("ag-cell-value")).forEach(x => {
      abc[x.getAttribute('col-id')] = Array.isArray(abc[x.getAttribute('col-id')]) ? [...abc[x.getAttribute('col-id')], x.textContent] : [x.textContent]
    })
  
    return abc
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
  


  if (Array.from(document.getElementsByClassName("ag-cell-value"))?.length > 0) {
  return  onDOM()
  } else {
  return  typeOfTable()
  }

}


const buildOptions = () => {


  for (let h of Object.keys(result)) {
    var option = document.createElement("option");
    option.innerText = h;
    option.value = h;
    dropDown.append(option);
  }

}


async function onWindowLoad() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: onDOM,
    });

  } catch (e) {
    document.body.textContent = 'Cannot access page';
    return;
  }
  console.log(result)

  setChartData(Object.keys(result)[0])

  buildOptions()

  console.log(chart.series, 'sdn')


}


// document.getElementById('scrapeEmails').addEventListener("click", onWindowLoad);
// document.getElementById('scrapeData').addEventListener("click", scrapeHtmlCode);
document.getElementById('dynamicChart').addEventListener("click", dynamicCode);

dropDown.addEventListener("change", changedOption);

