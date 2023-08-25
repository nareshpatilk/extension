

const dropDown = document.getElementById('mySelect')



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


const setChartData = (option)=>{
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


const changedOption = ()=>{
  setChartData(dropDown.value)
}


const onDOM = () => {

  let abc = {}
  //Process the datatype and send it extension, need to find a proper way to create a data structure
  Array.from(document.getElementsByClassName("ag-cell-value")).forEach(x => {
    abc[x.getAttribute('col-id')] = Array.isArray(abc[x.getAttribute('col-id')]) ? [...abc[x.getAttribute('col-id')], x.textContent] : [x.textContent]
  })

  return abc
}

let result;

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

  const selectElem = document.getElementById("mySelect");

  for (let i of Object.keys(result)){
    const element = document.createElement("option");
    element.innerText =i;
    element.value = i
    selectElem.append(element);
  }


  console.log(chart.series,'sdn')


}


document.getElementById('scrapeEmails').addEventListener("click", onWindowLoad);

dropDown.addEventListener("change", changedOption);

