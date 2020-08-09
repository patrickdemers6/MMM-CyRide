Module.register("MMM-CyRide", {
  defaults: { stopID: "5108903", customerID: "187" },
  start: function () {
    var timer = setInterval(() => {
      this.updateDom();
    });
  },
  getDom: async function () {
    const { stopID, customerID } = this.config;
    const arrivals = await fetch(
      `https://mycyride.com/Stop/${stopID}/Arrivals?customerID=${customerID}`
    );
    console.log(arrivals);
  },
});
