import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";

import About from "./components/about/About";
import Game from "./components/game/Game";
import Settings from "./components/settings/Settings";

const App = () => {
  const showAbout = useSelector((state: RootState) => state.setting.showAbout);
  return (
    <div className="app">
      <main>
        {showAbout && <About />}
        <Game />
        <Settings />
      </main>
    </div>
  );
};

export default App;
