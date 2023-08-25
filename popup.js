
const onDOM = () => {

  let abc = {}
  //Process the datatype and send it extension, need to find a proper way to create a data structure
  Array.from(document.getElementsByClassName("ag-cell-value")).forEach(x => {
    abc[x.getAttribute('col-id')] = Array.isArray(abc[x.getAttribute('col-id')]) ? [...abc[x.getAttribute('col-id')],x.innerHTML]:[x.innerHTML]
  })

  return abc
}


async function onWindowLoad() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let result;
  try {
    [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: onDOM,
    });

  } catch (e) {
    document.body.textContent = 'Cannot access page';
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 200;
  document.body.appendChild(canvas);
  
  // Create a Chart object.
  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Red', 'Green', 'Blue'],
      datasets: [{
        label: 'Number of Users',
        data: [10, 20, 30]
      }]
    }
  })
  
  // Render the chart.
  chart.draw();

}

document.getElementById('scrapeEmails').addEventListener("click", onWindowLoad);
