import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  // NOTE: React.StrictMode intentionally removed — react-beautiful-dnd (drag-and-drop)
  // is incompatible with StrictMode's double-render in React 18. This is a known
  // upstream limitation of the library. Remove this comment before switching to @hello-pangea/dnd.
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          duration: 3500,
        }}
      />
    </AuthProvider>
  </BrowserRouter>
)
