class StakingInfo {
  #investment;
  #rate;
  #startDate;
  #rewardDate;
  #durationInMonths;
  #paymentDay;
  #monthGainedReward;
  #totalGainedReward;
  #isReinvesting;

  constructor() {
    this.investment = 25;
    this.rate = 10;

    this.startDate = new Date();
    this.startDate.setFullYear(2025);
    this.startDate.setMonth(4);
    this.startDate.setDate(15);
    this.startDate.setHours(3, 0, 0, 0); // GMT+3

    this.durationInMonths = 24;
    this.paymentDay = 23;
    this.gainedMonthlyReward = 0;
    this.isReinvesting = true;
  }

  // GET
  getInvestment() {
    return this.investment;
  }
  getRate() {
    return this.rate;
  }

  getDurationInMonths() {
    return this.durationInMonths;
  }
  getPaymentDay() {
    return this.paymentDay;
  }
  getMonthGainedReward() {
    return this.monthGainedReward;
  }
  getTotalGainedReward() {
    return this.totalGainedReward;
  }
  getIsReinvesting() {
    return this.isReinvesting;
  }

  // SET
  setInvestment(value) {
    this.investment = value;
  }
}
module.exports = StakingInfo;
