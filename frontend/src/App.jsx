import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import KBListPage from './pages/KBListPage';
import KBEditPage from './pages/KBEditPage';
import TicketsPage from './pages/TicketsPage';
import TicketCreatePage from './pages/TicketCreatePage';
import TicketDetailPage from './pages/TicketDetailPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <nav>
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/kb">KB</Link> | <Link to="/tickets">Tickets</Link> | <Link to="/settings">Settings</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/kb" element={<KBListPage />} />
            <Route path="/kb/new" element={<KBEditPage />} />
            <Route path="/kb/:id" element={<KBEditPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/tickets/new" element={<TicketCreatePage />} />
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;