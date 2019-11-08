import "normalize.css";
import { render } from "react-dom";
import React, { useState } from "react";
import { Editor } from "./components/editor/index";
import { Publish } from "./components/publish";

function App() {
  const [body, setBody] = useState();

  return (
    <main>
      <Editor onChange={val => setBody(val)} />
      <Publish data={body} />
    </main>
  );
}

render(<App />, document.getElementById("app"));
