import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import GroupsList from './components/GroupsList';
import Chat from './components/Chat';

function App() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <Register onSwitch={() => setShowRegister(false)} />
    ) : (
      <Login onSwitch={() => setShowRegister(true)} />
    );
  }

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GroupsList />} />
          <Route path="/chat/:groupId" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
