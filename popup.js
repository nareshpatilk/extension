function alertMan() {
        alert('Ramya is beautiful girl');
        writeAllTabUrlToConsole();
}

async function writeAllTabUrlToConsole() {
    try {
        // Get all the tabs
        const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        
        // Write all their URLs to the popup's console
        for(let t of tabs){
            alert(t.url);
        }
    }
    catch(err) {
        console.log('err' , err);
        // Handle errors
    }
}


function onWindowLoad() {
    // var message = document.querySelector('#mainForm');

    // chrome.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
    //     var activeTab = tabs[0];
    //     var activeTabId = activeTab.id;

    //     return chrome.scripting.executeScript({
    //         target: { tabId: activeTabId },
    //         // injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
    //         func: DOMtoString,
    //         // args: ['body']  // you can use this to target what element to get the html for
    //     });

    // }).then(function (results) {
    //     message.innerText = results[0].result;
    // }).catch(function (error) {
    //     message.innerText = 'There was an error injecting script : \n' + error.message;
    // });
    chrome.runtime.onMessage.addListener(function(request, sender) {
        alert(request)
        if (request.action == "getSource") {
            this.pageSource = request.source;
            var title = this.pageSource.match(/<title[^>]*>([^<]+)<\/title>/)[1];
            alert(title)
        }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        console.log(tabs);
        console.log(chrome.tabs);
        chrome.scripting.executeScript(
            tabs[0].id,
            { code: 'var s = document.documentElement.outerHTML; chrome.runtime.sendMessage({action: "getSource", source: s});' }
        );
    });
    //alert(message);
}

// window.onload = onWindowLoad;

// function DOMtoString(selector) {
//     if (selector) {
//         selector = document.querySelector(selector);
//         if (!selector) return "ERROR: querySelector failed to find node"
//     } else {
//         selector = document.documentElement;
//     }
//     return selector.outerHTML;
// }


document.getElementById('scrapeEmails').addEventListener("click", onWindowLoad);
