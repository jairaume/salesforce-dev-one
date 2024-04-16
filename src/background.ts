import {themes} from './themes';
const DEV_CONSOLE_URL = 'salesforce.com/_ui/common/apex/debug/ApexCSIPage';

const initState = {
  active: false,
  themeId: 0,
  themes: themes
}

// Return the current tab
async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

// Returns true if the url is a dev console url
function allowedUrl(url: string | undefined) {
  return url?.startsWith('http') && url?.indexOf(DEV_CONSOLE_URL) !== -1;
}

// Returns true if the current tab is allowed
function isTabPermitted(tab: chrome.tabs.Tab) {
  return allowedUrl(tab?.url);
}
  
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ state: initState })
});

chrome.storage.onChanged.addListener(handleChange)

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('backgroundjs - Tab activated')
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if(isTabPermitted(tab)){
      applyCustomization(tab);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{
  console.log('backgroundjs - Tab updated')
  if(isTabPermitted(tab)){
    applyCustomization(tab);
  }
})

async function handleChange(){
  console.log('backgroundjs - Storage changed')
  const tab = await getCurrentTab();
  if(isTabPermitted(tab)){
    applyCustomization(tab);
  }
}

function applyCustomization(tab: chrome.tabs.Tab) {
  if(allowedUrl(tab.url)){
    if(tab.id !== undefined){
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['js/content_script.js'],
      });
    }
  }
}