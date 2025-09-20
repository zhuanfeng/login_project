import React, { useState, useRef } from 'react';
import './App.css';
import UserForm from './components/UserForm';
import UserList from './components/UserList';

function App() {
  const [currentView, setCurrentView] = useState('form'); // 'form' 或 'list'
  const userListRef = useRef();

  // 用户创建成功后的回调
  const handleUserCreated = () => {
    // 如果当前在列表视图，刷新列表
    if (currentView === 'list' && userListRef.current) {
      userListRef.current.refreshList();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>用户登记系统</h1>
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${currentView === 'form' ? 'active' : ''}`}
            onClick={() => setCurrentView('form')}
          >
            用户注册
          </button>
          <button 
            className={`toggle-btn ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => setCurrentView('list')}
          >
            用户列表
          </button>
        </div>
      </header>
      <main className="App-main">
        {currentView === 'form' ? 
          <UserForm onUserCreated={handleUserCreated} /> : 
          <UserList ref={userListRef} />
        }
      </main>
    </div>
  );
}

export default App;
