import React, { useState } from "react";
import AddQuestion from "./addQuestion";
import ViewQuestion from "./viewQuestion";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("upload question");
  return (
    <div className="App">
      <header className="App-header">
      <h1>Läkemedelsberäkningar</h1>
        <nav>
          <button onClick={() => setActiveTab("upload question")}>Upload Question</button>
          <button onClick={() => setActiveTab("get question")}>View Random Question</button>
        </nav>
        <div>
          {activeTab === "upload question" && <AddQuestion />}
          {activeTab === "get question" && <ViewQuestion />}
        </div>
      </header>
    </div>
  );
}

export default App;
