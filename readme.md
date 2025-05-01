# Simplified Ethereum Staking Profit Calculator

> All calculations done with full precision values then displayed with six decimal values.
Rewards arrive up to the day before the payment day.
> Local time is set to GMT+3

## Instructions

### Environment Setup

Use links below, select your operating system, download files and install them into your computer.

- Node.js: https://nodejs.org/en/download
- Visual Studio Code: https://code.visualstudio.com/download

### Releases

After download and install, download project into folder, you can choose which **release** to download or simply selecting branches (_1_main_task_, _2_bonus_task_1_, _3_bonus_task_2_).

> Branch (_1_main_task_) ✅
Release **_Main Task_** program generates profit calculations with **static** information:
- Start date 2025-04-15
- Investment 25.000000 ETH
- Duration 2 years (24 months)
- Reward day on 23rd of the month
- Yearly reward rate 10%
- Customer is reinvesting

> Branch (_2_bonus_task_1_) ✅
Release **Bonus Task 1_** program generates profit with **static** rate change on static change day, as well with default parameters:
- Start date 2025-04-15
- Investment 25.000000 ETH
- Duration 2 years (24 months)
- Reward day on 23rd of the month
- Yearly reward rate 10%
- Customer is reinvesting
- New yearly reward rate 8%
- Rate change date 2026-04-15

> Branch (_3_bonus_task_2_), ❎ branch still has some minor issues
Release **Bonus Task 2_** program generates profit from input, includes rate change as well.

### Instructions

- Open project folder in (macOS terminal or Windows Console)
- Run in console `npm install`.
- Lastly, to run program run `node main.js`.
- Enter inputs into the program based on prompts.
- In case you want to exit program push `CTRL+C` combination.

Generated file can be opened on (macOS Numbers or Windows Excel).
