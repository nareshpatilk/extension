
async function onWindowLoad() {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  let result;
  try {
    [{result}] = await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => document.documentElement.outerHTML,
    });
  } catch (e) {
    document.body.textContent = 'Cannot access page';
    return;
  }
  // process the result
  document.body.textContent = result;
    
}

document.getElementById('scrapeEmails').addEventListener("click", onWindowLoad);
