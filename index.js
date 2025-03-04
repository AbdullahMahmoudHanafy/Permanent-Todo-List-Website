import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const pool = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "12345",
  port: "5432"
})

pool.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("select * from items order by id ASC");
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: result.rows,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await pool.query("insert into items (title) values ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const newId = req.body["updatedItemId"];
  const newTitle = req.body["updatedItemTitle"];
  try {
    await pool.query("update items set title = ($1) where id = ($2)", [newTitle, newId]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const item = req.body["deleteItemId"];
  try {
    await pool.query("delete from items where id = ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
