import React from "react";

import Nav from "./components/navbar/Nav";
import Game from "./components/game/Game";
import Settings from "./components/settings/Settings";

const App = () => {
  return (
    <div className="app">
      <main>
        <Game />
        <Settings />
      </main>
    </div>
  );
};

export default App;
