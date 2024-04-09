import themes from '../themes.json' with { type: "json" };
const DEV_CONSOLE_URL = 'salesforce.com/_ui/common/apex/debug/ApexCSIPage';

// Get interactive dom elements
const checkbox = document.querySelector('#checkbox');
const themeSelect = document.querySelector('#theme-select');

// Define state object
const currentState = {
  active: false,
  themeId: 0
}

// Initialize themes
themes.forEach((theme, i) => {
  const option = document.createElement('option');
  option.value = i;
  option.text = theme.name;
  themeSelect.appendChild(option);
});

// Inject custom CSS File
(async ()=> {
  const tab = await getCurrentTab();
  if(allowedUrl(tab.url)){
    console.log('CSS INSERTION...')
    chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['scripts/inject.css']
    });
  }
})();

// Get state stored in local storage
chrome.storage.sync.get('state', (data) => {
  if(data.state){
    // Update the current state
    currentState.active = data.state.active;
    currentState.themeId = data.state.themeId;
    // Update the UI
    checkbox.checked = currentState.active;
    themeSelect.value = currentState.themeId;
    // Apply the theme if active
    if(currentState.active) {activeChange();themeChange();}
  }
});

// Activate or not the extension
async function activeChange(){
  const tab = await getCurrentTab();
  currentState.active = checkbox.checked;
  chrome.storage.sync.set({ state: currentState});

  if(allowedUrl(tab.url)){
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: toggleTheme,
      args: [currentState.active]
    });
  }
}

// Change the theme
async function themeChange(){
  const tab = await getCurrentTab();
  currentState.themeId = themeSelect.value;
  chrome.storage.sync.set({ state: currentState});

  if(allowedUrl(tab.url) && currentState.active){
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: applyTheme,
      args: [themes[currentState.themeId]]
    });
  }
}

// Define Listeners
checkbox.addEventListener('change', activeChange);
themeSelect.addEventListener('change',themeChange);

// Activate or not the theming
function toggleTheme(value) {
  if(value){
    console.log('ADD CLASS to body')
    document.body.classList.add('dev-console-one-theme');
  } else {
    console.log('REMOVE CLASS to body')
    document.body.classList.remove('dev-console-one-theme');
  }
}
// Returns true if the url is a dev console url
function allowedUrl(url) {
  return url.indexOf(DEV_CONSOLE_URL) !== -1;
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
// Return the current tab
async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
