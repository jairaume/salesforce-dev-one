console.log("hello from content script")

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
        if (typeof value === 'string' || value === null) {
            document.documentElement.style.setProperty('--'+key, value);
        }
      };
    });
  }