import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { State } from "@/types";
import Header from "@/components/Header";

const baseState: State = {
  active: false, 
  animations: false,
  themeId: 0,
  themes: []
};


const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [state, setState] = useState<State>(baseState);
  const [accentColor, setAccentColor] = useState<string>("");

  useEffect(() => {
    browser.storage.sync.get('state').then((data) => {
      setState({...baseState, ...data.state} || baseState);
      setIsLoading(false);
    });
  }, []);

  const themeOptions = state?.themes.map((theme, index) => (
    <option key={index} value={index} className="dark:bg-neutral-950" style={{color:theme?.colors?.word}}>{theme?.name}</option>
  ));
  
  useEffect(() => {
    if(isLoading) return;
    browser.storage.sync.set({state: state});
    setAccentColor(state?.themes[state.themeId]?.colors.word);
  }, [state]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [accentColor]);

  const handleActiveCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!state) return;
    setState({...state, active: e.target.checked, animations: e.target.checked});
  }

  const handleAnimationsCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!state) return;
    setState({...state, animations: e.target.checked});
  }

  const handlePanel = ()=>{
    browser.tabs.query({ currentWindow: true, active: true }).then((tabs)=> {
      // @ts-ignore
      browser.sidePanel.open({windowId: tabs[0].windowId});
    })
  }

  const handleThemeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(!state) return;
    setState({...state, themeId: parseInt(e.target.value)});
  }

  return (
    <main className="font-poppins bg-neutral-100 text-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 p-3 px-5 grid gap-3 relative">
      <span className={"absolute dark:top-0 dark:left-0 bottom-0 left-full -translate-x-1/3 -translate-y-1/3 w-1/2 h-1/2 blur-[80px] opacity-80 duration-500 pointer-events-none z-0 "+(state.active &&"bg-[--accent-color]")}>&nbsp;</span>

      <Header colored={state.active} />
      
      {
        isLoading ? 
          <p>Loading...</p> 
        : 
        (
          <form className="grid gap-3 z-10 select-none">
            <label htmlFor="activeCheckbox" className="flex justify-between items-center gap-3">
              <p className="text-base">Active</p>
              <input type="checkbox" id="activeCheckbox" checked={state.active} onChange={handleActiveCheckbox}/>
              <div className="switch"></div>
            </label>

            <div className={"duration-300 grid gap-1 " + (!state.active && "opacity-30")}>
              <label className="text-base inline-flex items-center gap-2" htmlFor="theme-select">
                <Icon icon="streamline:paintbrush-2-solid" className="text-sm"/>
                <p>Theme</p>
              </label>

              <div className="relative before:absolute before:left-3 before:top-1/2 before:-translate-y-1/2 before:size-2 before:rounded-full before:bg-[--accent-color] before:ring dark:before:ring-neutral-700 before:ring-neutral-200 before:duration-300">
                <select 
                  className="w-full p-1 pl-6 rounded-md border-2 dark:bg-neutral-950 hover:dark:bg-neutral-800 dark:text-white dark:border-neutral-700 hover:dark:border-neutral-600 focus:dark:border-neutral-500 focus:outline-none duration-300 hover:border-neutral-300 focus:border-neutral-400"
                  id="theme" 
                  value={state.themeId} 
                  disabled={!state.active}
                  onChange={handleThemeSelect}
                >
                  {themeOptions}
                </select>
                </div>

              <p className="text-neutral-500 text-[10px] text-center">
                {state.themes[state.themeId]?.description}
              </p>
            </div>
            
            <div className="pt-3 duration-300" style={{opacity: !state.active ? .3 : 1}}>
              <h2 className="font-semibold text-neutral-600 dark:text-neutral-400">Additional options</h2>
              
              <div className="pl-2 pt-2 space-y-3">
                <label className="text-base flex justify-between gap-3 items-center" htmlFor="animationsCheckbox">
                  <div className="inline-flex items-center gap-2">
                    <Icon icon="material-symbols:animation"/>
                    <p>Animations</p>
                  </div>
                  <input type="checkbox" disabled={!state.active} id="animationsCheckbox" checked={state.animations} onChange={handleAnimationsCheckbox}/>
                  <div className="switch"></div>
                </label>

                <div className="text-base inline-flex items-center gap-2">
                  <Icon icon="fluent:panel-right-32-filled"/>
                  <button onClick={()=>{handlePanel()}} className="btn" disabled={!state.active}>
                    <p>Open Side-Panel</p>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )
      }
      <footer className="mt-2">
        <p className="text-[9px] text-center font-semibold text-neutral-500">Made with ❤️ by <a title="Jairaume" href="https://www.rasclejero.me" className="underline hover:text-[--accent-color]" target="_blank">jairaume</a></p>
      </footer>
    </main>
  )
};

export default App;