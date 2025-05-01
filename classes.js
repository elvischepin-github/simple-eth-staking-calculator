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

  constructor(
    startDateArg = null,
    durationInMonthsArg = 24,
    investmentArg = 25,
    rateArg = 10,
    paymentDayArg = 23,
    isReinvestingArg = true,
    isRateChangeArg = true,
    rateChangeDateArg = null,
    rateChangeArg = 8
  ) {
    this.#investment = investmentArg;
    this.#rate = rateArg;
    this.#rateChange = rateChangeArg;

    this.#startDate =
      startDateArg === null ? new Date(2025, 3, 15) : new Date(startDateArg);
    this.#startDate.setHours(3, 0, 0, 0); // GMT+3

    this.#durationInMonths = durationInMonthsArg;
    this.#paymentDay = paymentDayArg;

    this.#rewardDate =
      this.#rewardDate == null
        ? new Date(this.#startDate)
        : new Date(2026, 3, 15);
    if (this.#rewardDate.getDate() <= this.#paymentDay) {
      this.#rewardDate.setDate(this.#paymentDay);
    } else if (this.rewardDate.getDate() > this.paymentDay) {
      this.#rewardDate.setMonth(this.#rewardDate.getMonth() + 1);
      this.#rewardDate.setDate(this.#paymentDay);
    }

    this.#rateChangeDate =
      rateChangeDateArg === null
        ? new Date(2026, 3, 15)
        : new Date(rateChangeDateArg);
    this.#rateChangeDate.setHours(3, 0, 0, 0); // GMT+3

    this.#monthGainedReward = 0;
    this.#totalGainedReward = 0;
    this.#isReinvesting = isReinvestingArg;
    this.#isRateChange = isRateChangeArg;

    this.#isChangeRateTransitionMonthCalculated = false;
  }

  // GETTERS
  getInvestment() {
    return this.#investment;
  }
  getRate() {
    return this.#rate;
  }
  getRateChange() {
    return this.#rateChange;
  }
  getDurationInMonths() {
    return this.#durationInMonths;
  }
  getPaymentDay() {
    return this.#paymentDay;
  }
  getMonthGainedReward() {
    return this.#monthGainedReward;
  }
  getTotalGainedReward() {
    return this.#totalGainedReward;
  }
  getIsReinvesting() {
    return this.#isReinvesting;
  }
  getIsRateChange() {
    return this.#isRateChange;
  }
  getIsChangeRateTransitionMonthCalculated() {
    return this.#isChangeRateTransitionMonthCalculated;
  }
  get startDate() {
    return this.#startDate;
  }
  get rewardDate() {
    return this.#rewardDate;
  }
  get rateChangeDate() {
    return this.#rateChangeDate;
  }

  // SETTERS
  setInvestment(value) {
    this.#investment = value;
  }
  setMonthGainedReward(value) {
    this.#monthGainedReward = value;
  }
  setDurationInMonths(value) {
    this.#durationInMonths = value;
  }
  setTotalGainedReward(value) {
    this.#totalGainedReward = value;
  }
  setIsRateChange(bool) {
    this.#isRateChange = bool;
  }
  setIsChangeRateTransitionMonthCalculated(bool) {
    this.#isChangeRateTransitionMonthCalculated = bool;
  }
}

module.exports = StakingInfo;
