import { useState } from "react";
import "./App.scss";
import Search from "./search.component";

type Route = "/" | "search";

function App() {
  const [route, setRoute] = useState<Route>("/");
  return (
    <>
      {route === "/" ? (
        <div className="home-card">
          <div>
            <h1>Pdf Search app</h1>
            <div>
              <p>click the below button to search pdf using keys</p>
              <button onClick={() => setRoute("search")}>Search!</button>
            </div>
          </div>
        </div>
      ) : (
        <Search />
      )}
    </>
  );
}

export default App;
