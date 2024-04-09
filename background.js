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

  
chrome.tabs.onUpdated.addListener(handleChange);

async function handleChange(){
    console.log('Storage changed')
    chrome.storage.sync.get('state', (data) => {
        if(data.state){
            currentState.active = data.state.active;
            currentState.themeId = data.state.themeId;
        }
    });
    const tab = await getCurrentTab();
    if(isCurrentTabAllowed(tab)){
        applyCustomization(currentState, tab);
    }
}

function applyCustomization(state, tab) {
    if(state.active){
        console.log('Applying customization')
        activeChange(tab);
        themeChange(tab);
    }
}


// Activate or not the extension
async function activeChange(tab){
  if(allowedUrl(tab.url)){
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: toggleTheme,
      args: [currentState.active]
    });
  }
}

// Change the theme
async function themeChange(tab){
  if(allowedUrl(tab.url) && currentState.active){
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
    document.body.classList.add('dev-console-one-theme');
  } else {
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