const { convertArrayToCSV } = require("convert-array-to-csv");
const fileSystem = require("node:fs");

const csvFile = [];

const testData = [
  {
    Line: 1,
    Reward_Date: "11/15/20",
    Investment_Amount: "10.000000",
    Current_Month_Reward_Amount: "0.009589",
    Total_Reward_Amount_To_Date: "0.009589",
    Staking_Reward_Rate: "7.00%",
  },
];
const headers = Object.keys(testData[0]);

csvFile.push(headers);

testData.forEach((item) => {
  csvFile.push(Object.values(item));
});

const csvFromArrayOfArrays = convertArrayToCSV(csvFile, {
  headers,
  separator: ";",
});

fileSystem.writeFile("output.csv", csvFromArrayOfArrays, (err) => {
  if (err) {
    console.log("❌ Error:", err);
  }
  console.log("CSV file saved successfully!");
});
