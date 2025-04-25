const { createInterface } = require("node:readline");
const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ">>> ",
});

readline.prompt();

readline
  .on("line", (line) => {
    console.log(line);

    process.exit(0);
  })
  .on("close", () => {
    console.log("Process ended, exiting.");
  });
