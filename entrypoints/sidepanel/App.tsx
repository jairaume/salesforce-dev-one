import { GeistProvider, CssBaseline } from '@geist-ui/core'
import PanelContent from './PanelContent';
import { useState } from 'react';

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

    return (
        <GeistProvider themeType={themeType}>
            <CssBaseline /> 
            <PanelContent />
        </GeistProvider>
    )
}

export default App;