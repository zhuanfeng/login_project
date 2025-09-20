import React from 'react';
import './App.css';
import UserForm from './components/UserForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>用户登记系统</h1>
      </header>
      <main className="App-main">
        <UserForm />
      </main>
    </div>
  );
}

export default App;
