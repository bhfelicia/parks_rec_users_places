const {
  syncAndSeed,
  client,
  getUsers,
  getPlaces,
  createUser,
  deleteUser,
} = require("./db");

const express = require("express");
const path = require("path");
const app = express();

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(express.urlencoded({ extended: false }));

const nav = ({ users, places }) => `
<ul id="nav">
<li> <a href='/'>Home</a> </li>
<li> <a href='/users'>${users.length} Users</a> </li>
<li> <a href='/places'>${places.length} Places</a> </li>
</ul>
`;
const head = ({ title }) => `
<head>
<link rel='stylesheet' href='/assets/styles.css' />
<title>${title}</title>
</head>
`;
app.get("/", async (req, res, next) => {
  try {
    const [users, places] = await Promise.all([getUsers(), getPlaces()]);
    res.send(`
    <html>
${head({ title: "Parks & Rec Home" })}
    <body>
    ${nav({ users, places })}

    <h1>Welcome to Parks & Rec Users and Places</h1>
    </body>
    </html>
    `);
  } catch (error) {
    next(error);
  }
});

app.get("/users", async (req, res, next) => {
  try {
    const [users, places] = await Promise.all([getUsers(), getPlaces()]);
    res.send(`
    <html>
    ${head({ title: "Parks & Rec Users" })}
    <body>
${nav({ users, places })}
<h1>Welcome to Parks & Rec Users</h1>
    ${users
      .map(
        (user) => `
      <li>
        ${user.name}
      </li>
    `
      )
      .join("")}
    </body>
    </html>
    `);
  } catch (error) {
    next(error);
  }
});

app.get("/places", async (req, res, next) => {
  try {
    const [users, places] = await Promise.all([getUsers(), getPlaces()]);
    res.send(`
    <html>
    <head>
    ${head({ title: "Parks and Rec Places" })}
    </head>
    <body>
    ${nav({ users, places })}
    <h1>Welcome to Parks & Rec Places</h1>
    <ul>
    ${places
      .map(
        (place) => `
    <li>
    ${place.name}
    </li>

    `
      )
      .join("")}
    </body>
    </ul>
    </html>
    `);
  } catch (error) {
    next(error);
  }
});

app.post("/users", async (req, res, next) => {
  try {
    await createUser(req.body);
    res.redirect("/users");
  } catch (error) {
    next(error);
  }
});

const init = async () => {
  try {
    await client.connect();
    await syncAndSeed();
    const Andy = await createUser({ name: "Andy" });
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`app listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

init();
