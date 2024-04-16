import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { State } from "./types";
import "./tailwind.css";

const baseState: State = {
  active: false, 
  animations: false,
  themeId: 0,
  themes: []
};


const Popup = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [state, setState] = useState<State>(baseState);

  useEffect(() => {
    chrome.storage.sync.get('state', (data) => {
      setState({...baseState, ...data.state} || baseState);
      setIsLoading(false);
    });
  }, []);

  const themeOptions = state?.themes.map((theme, index) => (
    <option key={index} value={index}>{theme.name}</option>
  ));
  
  useEffect(() => {
    if(isLoading) return;
    chrome.storage.sync.set({state: state});
  }, [state]);

  const handleActiveCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!state) return;
    setState({...state, active: e.target.checked, animations: e.target.checked});
  }

  const handleAnimationsCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!state) return;
    setState({...state, animations: e.target.checked});
  }

  const handleThemeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(!state) return;
    setState({...state, themeId: parseInt(e.target.value)});
  }

  return (
    <main className="dark:bg-gray-950 dark:text-white">
      <h1>Salesforce Dev-Console One</h1>
      {
        isLoading ? 
          <p>Loading...</p> 
        : 
        (
          <form>
            <label htmlFor="activeCheckbox">Activate theme</label>
            <input type="checkbox" name="activeCheckbox" checked={state?.active} onChange={handleActiveCheckbox}/>

            <label htmlFor="animationsCheckbox">Enable animations</label>
            <input type="checkbox" name="animationsCheckbox" checked={state?.animations} onChange={handleAnimationsCheckbox}/>

            <label htmlFor="theme-select">Choose a theme</label>
            <select name="theme" value={state?.themeId} onChange={handleThemeSelect}>
              {themeOptions}
            </select>
            <p>{state.themes[state.themeId]?.description}</p>
          </form>
        )
      }
    </main>
  )
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
