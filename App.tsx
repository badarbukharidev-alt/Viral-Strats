import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { ToolPage } from './components/ToolPage';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'tool'>('landing');

  return (
    <HashRouter>
      <div className="antialiased text-gray-900 bg-white">
        {view === 'landing' ? (
          <LandingPage onStart={() => setView('tool')} />
        ) : (
          <ToolPage onBack={() => setView('landing')} />
        )}
      </div>
    </HashRouter>
  );
};

export default App;