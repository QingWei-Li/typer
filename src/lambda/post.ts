import faunadb from "faunadb";
import uuid from "shimo-guid";
import isJSON from "is-json";
import md5 from "md5";

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
  const id = uuid.new(16);
  const token = md5(`${md5(id)}${md5(process.env.SECRET_TOKEN)}`);

  return db
    .query(
      q.Create(q.Ref("classes/posts"), {
        data: {
          id,
          body: data.body,
          token
        }
      })
    )
    .then(res => {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id,
          token
        })
      };
    })
    .catch(err => {
      return {
        statusCode: 400,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: err.name,
          message: err.message
        })
      };
    });
}
