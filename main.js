const { convertArrayToCSV } = require("convert-array-to-csv");
const fileSystem = require("node:fs");
const { createInterface } = require("node:readline");

const StakingInfo = require("./classes.js");
const actualBy365 = require("./functions.js");

const readLine = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ">",
});

let state = "init";

const capturedInput = {};
const dateRegex = /^20[0-9][0-9]-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/;

// CONSOLE GREET
console.log(
  "\nWelcome to the Simplified Ethereum (ETH) Staking Profit Calculator\n"
);
console.log(
  "\n[Info] Note: Use dates from 2000–2099 in YYYY-MM-DD format. When entering days, make sure it is valid for chosen month (e.g., setting payment day to 31 for February will roll over to the next month).\n"
);

// STARTING PROMPTS
readLine.setPrompt(
  "Would you like to set staking details? Enter 'y' for yes or 'n' for no: "
);
readLine.prompt();

readLine.on("line", (line) => {
  line = line.trim().toLowerCase();

  // SWITCH TO CAPTURE INPUTS
  switch (state) {
    case "init":
      if (line === "n") {
        console.log(
          "\n☑️  Calculations will be done with default parameters.\n"
        );

        const csi = new StakingInfo(null, 24, 25, 10, 23, true, true, null, 8);

        funcManageData(csi);
        readLine.close();
      } else if (line === "y") {
        state = "startDate";
        readLine.setPrompt(
          "Enter start date in YYYY-MM-DD format, years (2000-2099), e.g., 2025-04-15: "
        );
        readLine.prompt();
      } else {
        console.log("\n❌ Invalid input. Enter 'y' or 'n': ");
      }
      break;

    // CASE startDate
    case "startDate":
      if (!dateRegex.test(line)) {
        console.log(
          "\n❌ Invalid start date. Enter start date in YYYY-MM-DD format from 2000 to 2099: "
        );
        readLine.prompt();
      } else {
        capturedInput.startDate = line;
        state = "durationInMonths";
        readLine.setPrompt("Enter duration in months (6–120), e.g., 24: ");
        readLine.prompt();
      }
      break;

    // CASE durationInMonths
    case "durationInMonths":
      const durationInMonths = Number(line);
      if (
        isNaN(durationInMonths) ||
        durationInMonths < 6 ||
        durationInMonths > 120
      ) {
        console.log(
          "\n❌ Invalid duration. Enter a number between 6 and 120: "
        );
        readLine.prompt();
      } else {
        capturedInput.durationInMonths = durationInMonths;
        state = "investment";
        readLine.setPrompt("Enter investment amount e.g., 25: ");
        readLine.prompt();
      }
      break;

    // CASE investment
    case "investment":
      const investment = parseFloat(line);
      if (isNaN(investment) || investment <= 0) {
        console.log("\n❌ Invalid investment. Enter a positive number: ");
        break;
      } else {
        capturedInput.investment = investment;
        state = "rate";
        readLine.setPrompt("Enter staking rate in % (1–100), e.g., 10: ");
        readLine.prompt();
      }
      break;

    case "rate":
      const rate = parseFloat(line);
      if (isNaN(rate) || rate < 1 || rate > 100) {
        console.log(
          "\n❌ Invalid staking rate. Enter a number between 1 and 100: "
        );
        readLine.prompt();
      } else {
        capturedInput.rate = rate;
        state = "paymentDay";
        readLine.setPrompt(
          "Enter payment day of the month from (1-31), e.g., 23: "
        );
        readLine.prompt();
      }
      break;

    // CASE paymentDay
    case "paymentDay":
      const paymentDay = Number(line);
      if (isNaN(paymentDay) || paymentDay < 1 || paymentDay > 31) {
        console.log(
          "\n❌ Invalid payment day. Enter a number between 1 and 31: "
        );
        readLine.prompt();
      } else {
        capturedInput.paymentDay = paymentDay;
        state = "isReinvesting";
        readLine.setPrompt("Reinvest rewards? Enter 'y' or 'n': ");
        readLine.prompt();
      }
      break;

    // CASE isReinvesting
    case "isReinvesting":
      if (line !== "y" && line !== "n") {
        console.log(
          "\n❌ Invalid choice of reinvestment. Enter 'y' or 'n' for no: "
        );
        readLine.prompt();
      } else if (line === "y") {
        capturedInput.isReinvesting = true;
        state = "isRateChange";
        readLine.setPrompt("Apply a rate change? Enter 'y' or 'n': ");
        readLine.prompt();
      } else if (line === "n") {
        capturedInput.isReinvesting = false;
        state = "isRateChange";
        readLine.setPrompt("Apply a rate change? Enter 'y' or 'n': ");
        readLine.prompt();
      }
      break;

    // CASE isRateChange
    case "isRateChange":
      if (line !== "y" && line !== "n") {
        console.log(
          "\n❌ Invalid choice of rate change. Enter 'y' or 'n' for no: "
        );
        readLine.prompt();
      } else if (line === "y") {
        capturedInput.isRateChange = true;
        state = "rateChangeDate";
        readLine.setPrompt(
          "Enter rate change date in YYYY-MM-DD format, e.g., 2026-04-15): "
        );
        readLine.prompt();
      } else if (line === "n") {
        capturedInput.isRateChange = false;
        capturedInput.rateChangeDate = null;
        capturedInput.rateChange = 0;

        const csi = new StakingInfo(
          capturedInput.startDate,
          capturedInput.durationInMonths,
          capturedInput.investment,
          capturedInput.rate,
          capturedInput.paymentDay,
          capturedInput.isReinvesting,
          capturedInput.isRateChange,
          capturedInput.rateChangeDate,
          capturedInput.rateChange
        );
        funcManageData(csi);
        readLine.close();
      }
      break;

    // CASE rateChangeDate
    case "rateChangeDate":
      if (!dateRegex.test(line)) {
        console.log(
          "\n❌ Invalid rate change date. Enter rate change date in YYYY-MM-DD format): "
        );
        readLine.prompt();
      } else {
        capturedInput.rateChangeDate = line;
        state = "rateChange";
        readLine.setPrompt("Enter new staking rate in % (1–100), e.g., 8): ");
        readLine.prompt();
      }
      break;

    // CASE rateChange
    case "rateChange":
      const rateChange = Number(line);
      if (isNaN(rateChange) || rateChange < 1 || rateChange > 100) {
        console.log(
          "\n❌ Invalid new staking rate. Enter a number between 1 and 100: "
        );
        readLine.prompt();
      } else {
        capturedInput.rateChange = rateChange;

        const csi = new StakingInfo(
          capturedInput.startDate,
          capturedInput.durationInMonths,
          capturedInput.investment,
          capturedInput.rate,
          capturedInput.paymentDay,
          capturedInput.isReinvesting,
          capturedInput.isRateChange,
          capturedInput.rateChangeDate,
          capturedInput.rateChange
        );
        funcManageData(csi);
        readLine.close();
      }
      break;
  }
});
readLine.on("close", () => {
  console.log("\n[System] Note: Ending process.");
});

// // // MAIN CORE FUNCTION
function funcManageData(csi) {
  const csvFile = [];
  const headers = [
    "Line #",
    "Reward Date",
    "Investment Amount",
    "Current Month Reward Amount",
    "Total Reward Amount To Date",
    "Staking Reward Rate",
  ];
  csvFile.push(headers);

  // ITERATIONS
  for (let i = 1; i <= csi.getDurationInMonths(); i++) {
    // Debugging loggers
    // console.log("investment:", csi.getInvestment());
    // console.log("monthGainedReward:", csi.getMonthGainedReward());
    // console.log("rateChangeDate:", csi.rateChangeDate);
    // console.log("totalGainedReward:", csi.getTotalGainedReward());
    // console.log("rateChange:", csi.getRateChange());
    // console.log("rate:", csi.getRate());

    // If first month
    if (i === 1) {
      csi.setMonthGainedReward(
        actualBy365(
          i,
          csi.getDurationInMonths(),
          csi.startDate,
          csi.rewardDate,
          csi.rateChangeDate,
          csi.getPaymentDay(),
          csi.getRate(),
          csi.getRateChange(),
          csi.getInvestment(),
          csi.getIsRateChange(),
          csi
        )
      );
      csi.setTotalGainedReward(csi.getMonthGainedReward());
    }

    // Setting last months day, if start day is less or equal to than payment day
    if (
      i == csi.durationInMonths + 1 &&
      csi.getPaymentDay() >= csi.startDate.getUTCDate()
    ) {
      csi.rewardDate.setDate(csi.startDate.getUTCDate());
    }

    const row = [
      i,
      `${csi.rewardDate.getUTCFullYear()}-${(csi.rewardDate.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}-${csi.rewardDate
        .getUTCDate()
        .toString()
        .padStart(2, "0")}`,
      csi.getInvestment().toFixed(6),
      csi.getMonthGainedReward().toFixed(6),
      csi.getTotalGainedReward().toFixed(6),
      `${
        csi.getIsRateChange() &&
        csi.rateChangeDate &&
        csi.rewardDate >= csi.rateChangeDate
          ? csi.getRateChange().toFixed(2)
          : csi.getRate().toFixed(2)
      }%`,
    ];

    csvFile.push(row);

    // INCREMENTS
    if (i <= csi.getDurationInMonths()) {
      csi.rewardDate.setMonth(csi.rewardDate.getUTCMonth() + 1);
    }

    if (csi.getIsReinvesting()) {
      csi.setInvestment(csi.getInvestment() + csi.getMonthGainedReward());
    }

    // Calculating the next month
    csi.setMonthGainedReward(
      actualBy365(
        i + 1,
        csi.getDurationInMonths(),
        csi.startDate,
        csi.rewardDate,
        csi.rateChangeDate,
        csi.getPaymentDay(),
        csi.getRate(),
        csi.getRateChange(),
        csi.getInvestment(),
        csi.getIsRateChange(),
        csi
      )
    );

    csi.setTotalGainedReward(
      csi.getMonthGainedReward() + csi.getTotalGainedReward()
    );
  }

  // EXPORTING
  const csvFromArrayOfArrays = convertArrayToCSV(csvFile, {
    separator: ";",
  });

  const finalExport = `sep=;\n${csvFromArrayOfArrays}`;

  fileSystem.writeFile(
    "output.csv",
    finalExport,
    { encoding: "utf8" },
    (err) => {
      if (err) {
        console.log("❌ Error:", err);
      }
      console.log("✅ CSV file saved successfully!");
    }
  );
}
