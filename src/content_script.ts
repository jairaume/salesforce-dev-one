import { State } from "./types";
// Apply the selected theme colors
function applyTheme() {
  chrome.storage.sync.get('state', (data) => {
    const state: State = data.state;
    const { active, animations, themeId, themes } = state;
    const theme = themes[themeId];
    const colorMap = new Map(Object.entries(theme.colors));
    if(active){
      document.body.classList.add('dev-console-one-theme');
    }
    else{
      document.body.classList.remove('dev-console-one-theme');
    }
    if(animations){
      document.body.classList.add('dev-console-one-animations');
    }
    else{
      document.body.classList.remove('dev-console-one-animations');
    }
    for(const [key, value] of colorMap){
      if (typeof value === 'string' || value === null) {
          document.documentElement.style.setProperty('--'+key, value);
      }
    };
  });
}

// Apply the theme
applyTheme();