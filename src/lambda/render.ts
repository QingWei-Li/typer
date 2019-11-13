import faunadb from "faunadb";
import marked from "marked";
import Prism from "prismjs";

const db = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET });
const q = faunadb.query;

export async function handler(event) {
  const guid = event.queryStringParameters.guid || event.path.replace("/", "");

  if (!guid) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: "missing guid"
      })
    };
  }
  const { data } = await db.query(q.Get(q.Match(q.Index("posts_by_id"), guid)));

  const tokens = marked.lexer(data.body, {
    gfm: true,
    breaks: false,
    highlight: function(code, lang) {
      return Prism.highlight(code, Prism.languages[lang || "markup"]);
    }
  });
  const title = tokens.find(t => t.type === "heading");
  const body = marked.parser(tokens);

  return {
    statusCode: 200,
    headers: {
      "content-type": "text/html"
    },
    body: `<!doctype html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <title>${(title ? title.text : "Untitled") +
        " - Powered by Typer"}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link href="https://fonts.googleapis.com/css?family=Roboto:400,500|Roboto+Mono" rel="stylesheet">
      <link rel="stylesheet" href="/assets/netlify-style.css">
      <style>
      .publish {
        font-size: 16px;
        border: 1px solid;
        position: fixed;
        right: 30%;
        margin-right: -100px;
        top: 40px;
        background: #fff;
        border-radius: 16px;
        border: 1px solid #ddd;
        color: #333;
        padding: 4px 20px;
        outline: none;
        text-decoration: none;
        font-family: inherit;
        line-height: 1.15;
        display: none;
      }

      @media screen and (max-width: 900px) {
        .publish {
            top: 10px;
            right: 10px;
            margin-right: 0;
        }
      }
      </style>
    </head>
    <body>
      ${body}
      <a id="edit" class="publish" href="/${data.id}/edit">Edit</a>
    </body>
    <script>
      var m = location.search.match(/token=(\\w+)/)
      var token = m ? m[1] : localStorage.getItem("${data.id}")
      if (token) {
        var edit = document.getElementById("edit")
        if (m) {
          edit.href = "/${data.id}/edit?token=" + token
        }
        edit.style.display = "block"
      }
    </script>
    </html>`
  };
}
