const fs = require("fs");

// Read the auctions.json file
const data = JSON.parse(fs.readFileSync("auctions.json", "utf8"));

// Function to escape single quotes in text
const escapeQuotes = (str) => str.replace(/'/g, "'");

let auctionSqlStatements = "";
let aggregationSqlStatements = "";

// Transform each auction document
data.foreach((auction) => {
  const id = auction.id;
  const pk = escapeQuotes(auction.pk);
  const year_month = auction.year_month;

  // Insert statement for the auctions table
  auctionSqlStatements += `INSERT INTO auctions (id, pk, year_month) VALUES ('${id}', '${pk}', '${year_month}')`;

  auction.quarterly_aggregations.forEach((aggregation) => {
    const quarter_number = aggregation.quarter_number;
    const quarter_start = aggregation.quarter_start;
    const quarter_end = aggregation.quarter_end;
    const number_of_auctions = aggregation.number_of_auctions;
    const number_of_sales = aggregation.number_of_sales;

    // Insert statement for the quarterly_aggregations table
    aggregationSqlStatements += `INSERT INTO quarterly_aggregations (auction_id, quarter_number, quarter_start, quarter_end, number_of_auctions, number_of_sales) VALUES ('${id}', '${quarter_number}', '${quarter_start}', '${quarter_end}', '${number_of_auctions}', '${number_of_sales}')`;
  });
});

fs.writeFileSync("auctions.sql", auctionSqlStatements, "utf8");
fs.writeFileSync(
  "quarterly_aggregations.sql",
  aggregationSqlStatements,
  "utf8"
);

console.log(
  "Data has been transformed and written to auctions.sql and quarterly_aggregations.sql"
);
