import "./style.styl";
import Axios from "axios";
import { useState } from "react";

async function postData(data) {
  let url = "/.netlify/functions/post";
  if (data.id) {
    url = "/.netlify/functions/update";
  }
  const {
    data: { id, token }
  } = await Axios.post(url, data);
  localStorage.setItem(id, token);
  location.href = `/${id}`;
}

export function Publish(props: { data: string; id?: string }) {
  const { data, id } = props;
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem(id);

  return (
    <button
      onClick={async () => {
        setLoading(true);
        await postData({
          body: data,
          id,
          token
        });
        setLoading(false);
      }}
      className={`publish ${data && !loading ? "" : "disabled"}`}
    >
      {loading ? "Publishing" : "Publish"}
    </button>
  );
}
