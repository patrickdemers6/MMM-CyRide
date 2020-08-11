const getColor = require("./getColor");
Module.register("MMM-CyRide", {
  defaults: { stopID: "5108903", customerID: "187" },
  start: function () {
    this.sendSocketNotification("MMM-CYRIDE-SET_CYRIDE_CONFIG", this.config);
  },
  getDom: async function () {
    if (!Array.isArray(this.data)) return;
    var wrapper = document.createElement("div");
    const title = document.createElement("h6");
    title.innerHTML = "CYRIDE | UPCOMING STOPS";
    title.style = "margin:0px;";
    wrapper.appendChild(title);

    this.data.map((route) => {
      const container = document.createElement("div");
      const header = document.createElement("h5");
      header.style = "margin:0px;";
      const detailsContainer = document.createElement("div");
      const divider = document.createElement("hr");
      divider.style = "margin-top:0px;margin-bottom:5px;";
      route.stops.forEach((stop) => {
        const timeDetails = document.createElement("p");
        timeDetails.style = "font-size:20px;margin:0px;line-height:normal;";
        timeDetails.innerHTML = `${stop.Time} min${
          stop.Time === "1" ? "" : "s"
        } | ${stop.ArriveTime}${stop.IsLastStop ? " - LAST STOP" : ""}`;
        detailsContainer.appendChild(timeDetails);
      });

      container.appendChild(header);
      container.appendChild(divider);
      container.appendChild(detailsContainer);
      wrapper.appendChild(container);
      let color = getColor(route.routeName);
      header.innerHTML =
        `<div style="height:20px;width:20px;background-color:${color};display:inline-block;margin-left:10px;"/>` +
        route.routeName;
    });
    return wrapper;
  },
  socketNotificationReceived: function (notification, payload) {
    if (notification !== "MMM-CYRIDE-STOPS_DATA") return;
    let upcomingBusses = [];
    if (!payload) {
      this.data = null;
      this.updateDom();
      return;
    }
    payload.forEach((routePayload) => {
      upcomingBusses.push(
        routePayload.Arrivals.filter(({ ArriveTime }, i) => ArriveTime && i < 2)
      );
    });
    let routes = upcomingBusses.map((busStops) => {
      let minutesTill = [];
      busStops.forEach(({ Minutes }) => {
        minutesTill.push(Minutes);
      });
      return {
        routeName: busStops[0].RouteName,
        minutesUntil: Math.min(...minutesTill),
        stops: busStops
      };
    });
    this.data = routes;
    this.updateDom();
  }
});
