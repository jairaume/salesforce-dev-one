import './inject.css';
import { State } from '@/types';

export default defineContentScript({
  matches: ["https://*/_ui/common/apex/debug/ApexCSIPage/*"],
  main() {
    console.log('Hello content.');

    browser.storage.sync.get('state').then(({ state }) => {
      applyTheme(state);
    });
    
    browser.storage.onChanged.addListener((changes) => {
      if(changes.state === undefined) return;
      const state: State = changes.state.newValue as State;
      applyTheme(state);
    });
    
    const applyTheme = (state: State) => {
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
    }
  },
});
