import { GeistProvider, CssBaseline } from '@geist-ui/core'
import PanelContent from './PanelContent';
import { useEffect, useState } from 'react';
import { State } from '@/types';

const App = () => {
    const [themeType, setThemeType] = useState(
        typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
    )
    if (typeof window !== 'undefined') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            setThemeType(e. matches ? 'dark' : 'light')
        })
    }

    const [accentColor, setAccentColor] = useState<string>('')  
    useEffect(() => {
        browser.storage.sync.get('state').then((data) => {
            const state = data.state as State;
            if(!state) return;
            setAccentColor(state.themes[state.themeId]?.colors.word);
        });
    })
    const unwatch = storage.watch<State>('sync:state', (newState) => {
        if(!newState) return;
        setAccentColor(newState.themes[newState.themeId]?.colors.word);
    });  
    useEffect(() => {
        document.documentElement.style.setProperty('--accent-color', accentColor);
    }, [accentColor]);

    return (
        <GeistProvider themeType={themeType}>
            <CssBaseline /> 
            <PanelContent />
        </GeistProvider>
    )
}

export default App;