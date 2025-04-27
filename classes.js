class StakingInfo {
  #investment;
  #rate;
  #startDate;
  #durationInMonths;
  #paymentDay;
  #rewardDate;
  #monthGainedReward;
  #totalGainedReward;
  #isReinvesting;

  constructor() {
    this.investment = 25;
    this.rate = 10;

    this.startDate = new Date();
    this.startDate.setFullYear(2025);
    this.startDate.setMonth(3);
    this.startDate.setDate(25);
    this.startDate.setHours(3, 0, 0, 0); // GMT+3

    this.durationInMonths = 24;
    this.paymentDay = 23;

    this.rewardDate = new Date(this.startDate);
    if (this.rewardDate.getDate() <= this.paymentDay) {
      this.rewardDate.setDate(this.paymentDay);
    } else {
      this.rewardDate.setMonth(this.rewardDate.getMonth() + 1);
      this.rewardDate.setDate(this.paymentDay);
    }

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
  setMonthGainedReward(value) {
    this.monthGainedReward = value;
  }
  setTotalGainedReward(value) {
    this.totalGainedReward = value;
  }
}
module.exports = StakingInfo;
