import faunadb from "faunadb";

const db = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET });
const q = faunadb.query;

export async function handler(event) {
  const guid = event.queryStringParameters.guid;
  const { data } = await db.query(q.Get(q.Match(q.Index("posts_by_id"), guid)));

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      data
    })
  };
}
