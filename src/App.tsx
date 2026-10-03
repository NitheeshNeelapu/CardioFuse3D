import React from 'react';
import { useAppStore } from './state/useAppStore';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Evaluation } from './pages/Evaluation';
import { About } from './pages/About';
import { DataFlowDiagram } from './components/Architecture/DataFlowDiagram';

export const App: React.FC = () => {
  const activeTab = useAppStore((s) => s.activeTab);

  return (
    <Layout>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'architecture' && <DataFlowDiagram />}
      {activeTab === 'evaluation' && <Evaluation />}
      {activeTab === 'about' && <About />}
    </Layout>
  );
};

export default App;
