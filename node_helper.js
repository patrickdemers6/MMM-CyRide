var NodeHelper = require("node_helper");
const fetch = require("node-fetch");
const getData = async (self) => {
  const response = await fetch(
    `https://mycyride.com/Stop/${self.STOP_ID}/Arrivals?customerID=${self.CUSTOMER_ID}`
  );
  const arrivals = await response.json();
  return arrivals;
};
module.exports = NodeHelper.create({
  start: function () {
    var self = this;
    console.log("Starting module: " + this.name);
    const interval = setInterval(async () => {
      if (this.STOP_ID && this.CUSTOMER_ID) {
        const data = await getData(this);
        this.sendSocketNotification("STOPS_DATA", data);
      }
    }, 1 * 60 * 1000);
  },
  socketNotificationReceived: async function (notification, payload) {
    if (notification === "SET_CYRIDE_CONFIG") {
      this.STOP_ID = payload.stopID;
      this.CUSTOMER_ID = payload.customerID;
    }
    const data = await getData(this);
    this.sendSocketNotification("STOPS_DATA", data);
  }
});
