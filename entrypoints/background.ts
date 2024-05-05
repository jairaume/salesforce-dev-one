import { themes } from "@/themes";
import { State } from "@/types";

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  const DEV_CONSOLE_URL = 'salesforce.com/_ui/common/apex/debug/ApexCSIPage';

  const initState: State = {
    active: false,
    themeId: 0,
    themes: themes,
    animations: false,
  }

  // Return the current tab
  async function getCurrentTab() {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await browser.tabs.query(queryOptions);
    return tab;
  }

  // Returns true if the url is a dev console url
  function allowedUrl(url: string | undefined) {
    return url?.startsWith('http') && url?.indexOf(DEV_CONSOLE_URL) !== -1;
  }
    
  browser.runtime.onInstalled.addListener(() => {
    browser.storage.sync.set({ state: initState })
  });

  browser.storage.onChanged.addListener(handleChange)

  browser.tabs.onActivated.addListener(handleChange);

  browser.tabs.onUpdated.addListener(handleChange)

  async function handleChange(){
    const tab = await getCurrentTab();
    const data = await browser.storage.sync.get('state')
    applyBadge(tab, data.state);
  }

  function applyBadge(tab: any, state: State) {
    if(state.active && allowedUrl(tab.url) && tab.id !== undefined){
      setBadgeOn(state.themes[state.themeId].colors.word);
    } else {
      setBadgeOff();
    }
  }

  function setBadgeOn(color: string){
    browser.action.setBadgeBackgroundColor({color: color});
    browser.action.setBadgeText({text: ' '});
  }

  function setBadgeOff(){
    browser.action.setBadgeText({text: ''});
  }
});