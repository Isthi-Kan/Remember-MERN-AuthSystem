import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' //import BrowserRouter 
import { AppContextProvider } from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    {/* App.jsx is the child of AppContextProvider. so it can access the context values. */}
    <AppContextProvider> 
      <App />
    </AppContextProvider>

  </BrowserRouter>,
  // BrowserRouter allows your React app to use different URLs/pages without refreshing the browser.
)
