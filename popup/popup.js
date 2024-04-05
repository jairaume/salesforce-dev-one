import themes from '../themes.json' with { type: "json" };
const DEV_CONSOLE_URL = 'salesforce.com/_ui/common/apex/debug/ApexCSIPage';

const checkbox = document.querySelector('#checkbox');
const themeSelect = document.querySelector('#theme-select');

const currentState = {
  active: false,
  themeId: 0
}

themes.forEach((theme, i) => {
  const option = document.createElement('option');
  option.value = i;
  option.text = theme.name;
  themeSelect.appendChild(option);
});

chrome.storage.sync.get('state', (data) => {
  if(data.state){
    currentState.active = data.state.active;
    currentState.themeId = data.state.themeId;
    checkbox.checked = currentState.active;
    themeSelect.value = currentState.themeId;
  }
});


(async ()=> {
  const tab = await getCurrentTab();
  if(allowedUrl(tab.url) && currentState.active){
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: toggleTheme,
      args: [currentState.active]
    });
  }
})();

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

checkbox.addEventListener('change', async () => {
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
});

themeSelect.addEventListener('change', async () => {
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
});

function toggleTheme(value) {
  if(value){
    document.body.classList.add('dev-console-one-theme');
  } else {
    document.body.classList.remove('dev-console-one-theme');
  }
}

function allowedUrl(url) {
  return url.indexOf(DEV_CONSOLE_URL) !== -1;
}

function applyTheme(theme) {
  const colorMap = new Map(Object.entries(theme.colors));
  for(const [key, value] of colorMap){
    document.documentElement.style.setProperty('--'+key, value);
  };
}

async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
