import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
  register(process.env.PUBLIC_URL + "service-worker.js");
}

import "normalize.css";
import { render } from "react-dom";
import React, { useState } from "react";
import { Editor } from "./components/editor/index";
import { Publish } from "./components/publish";
import Axios from "axios";

function App(props: { body?: string; id?: string }) {
  const [body, setBody] = useState(props.body);

  return (
    <main>
      <Editor initbody={body} onChange={val => setBody(val)} />
      <Publish data={body} id={props.id} />
    </main>
  );
}

const guid = location.pathname.split("/")[1];

if (guid) {
  Axios("/.netlify/functions/get", {
    params: {
      guid: location.pathname.split("/")[1]
    }
  }).then(res => {
    const data = res.data.data;

    render(
      <App body={data.body} id={data.id} />,
      document.getElementById("app")
    );
  });
} else {
  render(<App />, document.getElementById("app"));
}
