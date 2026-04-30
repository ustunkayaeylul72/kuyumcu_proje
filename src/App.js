import React, { useState } from 'react';
import Home from './pages/Home';
import Invest from './pages/Invest';
import AdminTerminal from './pages/AdminTerminal';
import LiveTicker from './components/LiveTicker';
import './styles/main.css';
import './styles/doviz_kuru.css';
import './styles/dashboard.css';
import logoImg from './assets/logo.png';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch(activeTab) {
      case 'home': return <Home />;
      case 'invest': return <Invest />;
      case 'admin': return <AdminTerminal />;
      default: return <Home />;
    }
  };

  return (
    <div className="App">
      <nav className="premium-nav">
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logoImg} alt="Aurum X Logo" style={{ height: '40px', width: 'auto', borderRadius: '8px' }} />
          <span className="gold-text">AURUM</span> X
        </div>
        <div className="nav-links">
          <button className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>Vitrin</button>
          <button className={`nav-btn ${activeTab === 'invest' ? 'active' : ''}`} onClick={() => setActiveTab('invest')}>Yatırım</button>
          <button className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>Admin</button>
        </div>
      </nav>
      
      <LiveTicker />

      <main className="content-area">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
