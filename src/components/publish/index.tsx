import "./style.styl";
import Axios from "axios";
import { useState } from "react";

async function postData(data) {
  await Axios.post("/.netlify/functions/post", {
    body: data
  });
}

export function Publish(props: { data: string }) {
  const { data } = props;
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        setLoading(true);
        await postData(data);
        setLoading(false);
      }}
      className={`publish ${data && !loading ? "" : "disabled"}`}
    >
      {loading ? "Publishing" : "Publish"}
    </button>
  );
}
