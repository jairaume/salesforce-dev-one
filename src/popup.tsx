import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Theme } from "./types";

type State = {
  active: boolean;
  themeId: number;
  themes: Theme[];
}

const Popup = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<State>({
    active: false, 
    themeId: 0,
    themes: []
  });

  useEffect(() => {
    chrome.storage.sync.get('state', (data) => {
      setState(data.state);
    });
    setIsLoading(false);
  }, []);

  const themeOptions = state?.themes.map((theme, index) => (
    <option key={index} value={index}>{theme.name}</option>
  ));
  
  useEffect(() => {
    if(isLoading) return;
    chrome.storage.sync.set({state: state});
  }, [state]);

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!state) return;
    setState({...state, active: e.target.checked});
  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(!state) return;
    setState({...state, themeId: parseInt(e.target.value)});
  }

  return (
    <>
    <main>
      <h1>Salesforce Dev Console One</h1>
      <form>
        <label htmlFor="checkbox">Activate theme</label>
        <input type="checkbox" checked={state?.active} onChange={handleCheckbox}/>

        <label htmlFor="theme-select">Choose a theme</label>
        <select name="theme" value={state?.themeId} onChange={handleSelect}>
          {themeOptions}
        </select>
        <p>{state.themes[state.themeId]?.description}</p>
      </form>
    </main>
    </>
  )
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
