// Activate or not the theming
function toggleTheme() {
  chrome.storage.sync.get('state', ({ state }) => {
    const { active } = state;
    if(active){
      document.body.classList.add('dev-console-one-theme');
    }
    else{
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
    for(const [key, value] of colorMap){
      if (typeof value === 'string' || value === null) {
          document.documentElement.style.setProperty('--'+key, value);
      }
    };
  });
}

// Apply the theme
toggleTheme();
applyTheme();