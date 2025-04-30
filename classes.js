class StakingInfo {
  #investment;
  #rate;
  #rateChange;
  #rateChangeDate;
  #startDate;
  #durationInMonths;
  #paymentDay;
  #rewardDate;
  #monthGainedReward;
  #totalGainedReward;
  #isRateChange;
  #isReinvesting;

  #isChangeRateTransitionMonthCalculated;

  constructor() {
    this.investment = 25;
    this.rate = 10;
    this.rateChange = 8;

    this.startDate = new Date();
    this.startDate.setFullYear(2025);
    this.startDate.setMonth(3);
    this.startDate.setDate(15);
    this.startDate.setHours(3, 0, 0, 0); // GMT+3

    this.durationInMonths = 24;
    this.paymentDay = 23;

    this.rewardDate = new Date(this.startDate);
    if (this.rewardDate.getDate() <= this.paymentDay) {
      this.rewardDate.setDate(this.paymentDay);
    } else if (this.rewardDate.getDate() > this.paymentDay) {
      this.rewardDate.setMonth(this.rewardDate.getMonth() + 1);
      this.rewardDate.setDate(this.paymentDay);
    }

    this.rateChangeDate = new Date();
    this.rateChangeDate.setFullYear(2026);
    this.rateChangeDate.setMonth(3);
    this.rateChangeDate.setDate(26);
    this.rateChangeDate.setHours(3, 0, 0, 0); // GMT+3

    this.gainedMonthlyReward = 0;
    this.isReinvesting = true;
    this.isRateChange = true;

    this.isChangeRateTransitionMonthCalculated = false;
  }

  // GET
  getInvestment() {
    return this.investment;
  }
  getRate() {
    return this.rate;
  }
  getRateChange() {
    return this.rateChange;
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
  getIsRateChange() {
    return this.isRateChange;
  }
  getIsChangeRateTransitionMonthCalculated() {
    return this.isChangeRateTransitionMonthCalculated;
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
  setIsRateChange(bool) {
    this.isRateChange = bool;
  }
  setIsChangeRateTransitionMonthCalculated(bool) {
    this.isChangeRateTransitionMonthCalculated = bool;
  }
}
module.exports = StakingInfo;
