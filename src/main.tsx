import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import EntryPage from './EntryPage.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <EntryPage />
    </StrictMode>,
)