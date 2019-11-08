import "./style.styl";
import Axios from "axios";
import { useState } from "react";
import * as qss from "qss";

async function postData(data) {
  let isCreate = true;
  let url = "/.netlify/functions/post";
  if (data.id) {
    url = "/.netlify/functions/update";
    if (!data.token) {
      alert("Missing token");
      return;
    }
    isCreate = false;
  }
  const {
    data: { id, token }
  } = await Axios.post(url, {
    id: data.id,
    token: data.token,
    body: data.body
  });
  if (isCreate) {
    localStorage.setItem(id, token);
    prompt(
      "Secret Edit Link. PLEASE DON'T SHARE",
      `${location.href}${id}?token=${token}`
    );
  }
  location.href = `/${id}${data.inQuery ? `?token=${token}` : ""}`;
}

export function Publish(props: { data: string; id?: string }) {
  const query: any = qss.decode(location.search.substring(1)) || {};
  const { data, id } = props;
  const [loading, setLoading] = useState(false);
  const token = query.token || localStorage.getItem(id);

  return (
    <button
      onClick={async () => {
        setLoading(true);
        await postData({
          body: data,
          id,
          token,
          inQuery: !!query.token
        });
        setLoading(false);
      }}
      className={`publish ${data && !loading ? "" : "disabled"}`}
    >
      {loading ? "Publishing" : "Publish"}
    </button>
  );
}
