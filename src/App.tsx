import { AfterPage } from './pages/AfterPage'
import { BeforePage } from './pages/BeforePage'

export function App() {
  if (window.location.pathname === '/after') return <AfterPage />
  if (window.location.pathname !== '/before') window.history.replaceState({}, '', '/before')
  return <BeforePage />
}
