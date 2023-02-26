import { useState } from 'react';
import { Header } from "./components/Header"
import { FormArea } from "./components/FormArea"

import './App.css';

function App() {

  const [CrudMode, setCrudMode] = useState("Create");

  const switchMode = (newMode) => {
    setCrudMode(newMode);
  }

  return (
    <div className="App">
      <Header callback={switchMode}/>
      <div className="FormArea">
        <FormArea mode={CrudMode}/>
      </div>
    </div>
  );
}

export default App;
