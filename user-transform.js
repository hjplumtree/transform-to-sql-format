const fs = require("fs");

// Read the users.json file
const data = JSON.parse(fs.readFileSync("users.json", "utf8"));

// Function to escape single quotes in text
const escapeQuotes = (str) => str.replace(/'/g, "''");

// Transform each user into an SQL INSERT statement
let sqlStatements = data
  .map((user) => {
    const id = user._id;
    const name = escapeQuotes(user.name);
    const roles = user.roles
      .map((role) => `'${escapeQuotes(role)}'`)
      .join(", ");

    return `INSERT INTO users (id, name, roles) VALUES ('${id}', '${name}', ARRAY[${roles}]);`;
  })
  .join("\n");

// Save the SQL statements to a file
fs.writeFileSync("users.sql", sqlStatements, "utf8");

console.log("Data has been transformed and saved");
