import faunadb from "faunadb";
import marked from "marked";
import Prism from "prismjs";

const db = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET });
const q = faunadb.query;

export async function handler(event) {
  const guid = event.queryStringParameters.guid;
  const { data } = await db.query(q.Get(q.Match(q.Index("posts_by_id"), guid)));

  return {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: `<!doctype html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <title>Marked in the browser</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link href="https://fonts.googleapis.com/css?family=Roboto:400,500|Roboto+Mono" rel="stylesheet">
      <link rel="stylesheet" href="/assets/netlify-style.css">
    </head>
    <body>
      ${marked(data.body, {
        gfm: true,
        breaks: false,
        highlight: function(code, lang) {
          return Prism.highlight(code, Prism.languages[lang || "markup"]);
        }
      })}
    </body>
    </html>`
  };
}
