// Get interactive dom elements
const checkbox = document.querySelector('#checkbox');
const themeSelect = document.querySelector('#theme-select');

// Define state object
const currentState = {
  active: false,
  themeId: 0,
  themes: []
}

// Get the themes from the background script
window.onload = function() {
  chrome.storage.sync.get('state', (data) => {
    if(data.state){
      // Update the current state
      currentState.active = data.state.active;
      currentState.themeId = data.state.themeId;
      currentState.themes = data.state.themes;
      initThemeOptions();
      // Update the UI
      updateUI();
    }
  });
}

// Initialize the theme options
function initThemeOptions(){
  currentState.themes.forEach((theme, index) => {
    console.log(theme)
    const option = document.createElement('option');
    option.value = index;
    option.text = theme.name;
    themeSelect.appendChild(option);
  });
}

// Define Listeners
checkbox.addEventListener('change', activeChange);
themeSelect.addEventListener('change',themeChange);

// Define functions
function activeChange(){
  currentState.active = checkbox.checked;
  chrome.storage.sync.set({ state: currentState});
}

function themeChange(){
  currentState.themeId = themeSelect.value;
  chrome.storage.sync.set({ state: currentState});
}

chrome.storage.onChanged.addListener(()=>{
  chrome.storage.sync.get('state', (data) => {
    if(data.state != currentState){
      currentState.active = data.state.active;
      currentState.themeId = data.state.themeId;
      updateUI();
    }
  });
})

function updateUI(){
  checkbox.checked = currentState.active;
  themeSelect.value = currentState.themeId;
}