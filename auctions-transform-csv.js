const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const data = JSON.parse(fs.readFileSync("auctions.json", "utf8"));

const auctionsCsvWriter = createCsvWriter({
  path: "auctions.csv",
  header: [
    { id: "id", title: "id" },
    { id: "pk", title: "pk" },
    { id: "year_month", title: "year_month" },
  ],
});

const aggregationsCsvWriter = createCsvWriter({
  path: "quarterly_aggregations.csv",
  header: [
    {
      id: "auction_id",
      title: "auction_id",
    },
    {
      id: "quarter_number",
      title: "quarter_number",
    },
    {
      id: "quarter_start",
      title: "quarter_start",
    },
    {
      id: "quarter_end",
      title: "quarter_end",
    },
    {
      id: "number_of_auctions",
      title: "number_of_auctions",
    },
    {
      id: "number_of_sales",
      title: "number_of_sales",
    },
  ],
});

const auctionsData = [];
const aggregationsData = [];

data.forEach((auction) => {
  auctionsData.push({
    id: auction._id.$oid,
    pk: auction.pk,
    year_month: auction.year_month,
  });

  auction.quarterly_aggregations.forEach((aggregation) => {
    aggregationsData.push({
      auction_id: auction._id.$oid,
      quarter_number: parseInt(aggregation.quarter_number),
      quarter_start: aggregation.quarter_start,
      quarter_end: aggregation.quarter_end,
      number_of_auctions: parseInt(aggregation.number_of_auctions),
      number_of_sales: parseInt(aggregation.number_of_sales),
    });
  });
});

auctionsCsvWriter.writeRecords(auctionsData).then(() => {
  console.log("Auctions data has been written to auctions.csv");
});

aggregationsCsvWriter.writeRecords(aggregationsData).then(() => {
  console.log(
    "Quarterly aggregations data has been written to quarterly_aggregations.csv"
  );
});
