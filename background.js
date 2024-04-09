import themes from '../themes.json' with { type: "json" };
const DEV_CONSOLE_URL = 'salesforce.com/_ui/common/apex/debug/ApexCSIPage';

const currentState = {
  active: false,
  themeId: 0,
  themes: themes
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ state: currentState })
});

chrome.storage.onChanged.addListener(handleChange)

chrome.tabs.onUpdated.addListener(handleChange)

async function handleChange(){
    console.log('Storage changed')
    const tab = await getCurrentTab();
    chrome.storage.sync.get('state', (data) => {
        if(data.state){
            currentState.active = data.state.active;
            currentState.themeId = data.state.themeId;
        }
        if(isCurrentTabAllowed(tab)){
            applyCustomization(tab);
        }
    });
}

function applyCustomization(tab) {
    if(allowedUrl(tab.url)){
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: toggleTheme,
            args: [currentState.active]
        });
        
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: applyTheme,
            args: [themes[currentState.themeId]]
        });
    }
}

// Activate or not the theming
function toggleTheme(value) {
  if(value){
    console.log("Adding theme")
    document.body.classList.add('dev-console-one-theme');
  } else {
    console.log("Removing theme")
    document.body.classList.remove('dev-console-one-theme');
  }
}
// Apply the selected theme colors
function applyTheme(theme) {
  const colorMap = new Map(Object.entries(theme.colors));
  console.log("Setting theme colors ", theme.name)
  for(const [key, value] of colorMap){
    console.log(key, value)
    document.documentElement.style.setProperty('--'+key, value);
  };
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
  return url?.indexOf(DEV_CONSOLE_URL) !== -1;
}