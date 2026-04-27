import LicenseChecker from './components/LicenseChecker'
import './App.css'
import './index.css'
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div className="container">
      <LicenseChecker />
       <Analytics />
    </div>
  )
}

export default App