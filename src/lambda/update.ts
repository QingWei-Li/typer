import faunadb from "faunadb";
import isJSON from "is-json";

const db = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET });
const q = faunadb.query;

export async function handler(event) {
  if (!isJSON(event.body)) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: ""
    };
  }

  const data = JSON.parse(event.body);

  if (!data.id || !data.token) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: ""
    };
  }

  const { data: resData, ref } = await db.query(
    q.Get(q.Match(q.Index("posts_by_id"), data.id))
  );

  if (resData.token !== data.token) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "TOKEN_INVALID",
        message: "token invalid"
      })
    };
  }

  await db.query(
    q.Update(ref, {
      data: {
        id: data.id,
        token: data.token,
        body: data.body
      }
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      id: data.id,
      token: data.token
    })
  };
}
