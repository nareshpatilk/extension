async function scrapeHtmlCode() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let result;
  try {
    [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: fetchTableHeader,
    });
  } catch (e) {
    document.body.textContent = "Cannot access page";
    return;
  }
  // process the result
  console.log(result);
  document.body.textContent = result;
}

async function fetchTableHeader() {
  const data = document.documentElement.innerHTML;
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
    
    for(let header of headers){
      manipulateData.set(header, []);
    }

    for(let l = 0; l < tabledata.length; l++){
      for( k = 0; k < tabledata[l].length; k++){
        let arr = manipulateData.get(headers[k]);        
        arr.push(tabledata[l][k]);
        manipulateData.set(headers[k], arr)
      }
    }

    let finalResult = new Map();

    manipulateData.forEach((v, k) => {
      
      let res = v.reduce((occurrences, item) => {
        occurrences[item] = (occurrences[item] || 0) + 1;
        return occurrences;
      }, [])
      finalResult.set(k, res);
    })

    console.log('<<<<', finalResult);
  } catch (err) {
    alert(err);
    console.log(err);
  }
  return headers;
}

document
  .getElementById("scrapeEmails")
  .addEventListener("click", scrapeHtmlCode);
