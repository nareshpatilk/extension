
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


  console.log(result,'extension received')

}

document.getElementById('scrapeEmails').addEventListener("click", onWindowLoad);
