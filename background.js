import themes from '../themes.json' with { type: "json" };
const DEV_CONSOLE_URL = 'salesforce.com/_ui/common/apex/debug/ApexCSIPage';

const initState = {
  active: false,
  themeId: 0,
  themes: themes
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ state: initState })
});

chrome.storage.onChanged.addListener(handleChange)

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('Tab activated')
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if(isCurrentTabAllowed(tab)){
      applyCustomization(tab);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{
  console.log('Tab updated')
  if(isCurrentTabAllowed(tab)){
    applyCustomization(tab);
  }
})

async function handleChange(){
  console.log('Storage changed')
  const tab = await getCurrentTab();
  if(isCurrentTabAllowed(tab)){
    applyCustomization(tab);
  }
}

function applyCustomization(tab) {
  if(allowedUrl(tab.url)){
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: toggleTheme,
    });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: applyTheme,
    });
  }
}

// Activate or not the theming
function toggleTheme() {
  chrome.storage.sync.get('state', ({ state }) => {
    const { active } = state;
    if(active){
      console.log("Adding theme")
      document.body.classList.add('dev-console-one-theme');
    } else {
      console.log("Removing theme")
      document.body.classList.remove('dev-console-one-theme');
    }
  });
}
// Apply the selected theme colors
function applyTheme() {
  chrome.storage.sync.get('state', ({ state }) => {
    const { themeId, themes } = state;
    const theme = themes[themeId];
    const colorMap = new Map(Object.entries(theme.colors));
    console.log("Setting theme colors ", theme.name)
    for(const [key, value] of colorMap){
      console.log(key, value)
      document.documentElement.style.setProperty('--'+key, value);
    };
  });
}


// Returns true if the current tab is allowed
async function isCurrentTabAllowed() {
  const tab = await getCurrentTab();
  return allowedUrl(tab.url);
}

// Return the current tab
async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

// Returns true if the url is a dev console url
function allowedUrl(url) {
  return url?.startsWith('http') && url?.indexOf(DEV_CONSOLE_URL) !== -1;
}