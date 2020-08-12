Module.register("MMM-CyRide", {
  defaults: { stopID: "5108903", customerID: "187" },
  start: function () {
    this.page = 0;
    this.sendSocketNotification("MMM-CYRIDE-SET_CYRIDE_CONFIG", this.config);
    setInterval(() => {
      this.updateDom(1000);
    }, 5000); // cycle displayed data every 5 seconds
  },
  getDom: async function () {
    if (!Array.isArray(this.data)) return;
    var wrapper = document.createElement("div");
    wrapper.style = "text-align:left;max-width:350px;";
    const title = document.createElement("h6");
    title.innerHTML = "CYRIDE | UPCOMING STOPS";
    title.style = "margin:0px;";
    wrapper.appendChild(title);

    this.data.map((route, i) => {
      if (i % 2 !== this.page) return;
      let upcomingStops = [];
      route.stops.forEach((s) => {
        if (s.Minutes >= 0 && s.Minutes < 60) upcomingStops.push(s); // don't show stops with negative time or longer than an hour away
      });
      if (upcomingStops.length === 0) return;
      const container = document.createElement("div");
      const header = document.createElement("h5");
      header.style = "margin:0px;";
      const detailsContainer = document.createElement("div");
      const divider = document.createElement("hr");
      divider.style = "margin-top:0px;margin-bottom:5px;";

      upcomingStops.forEach((stop) => {
        if (stop.Time <= 0 || stop.Time > 60) return;
        const timeDetails = document.createElement("p");
        timeDetails.style = "font-size:20px;margin:0px;line-height:normal;";
        timeDetails.innerHTML = `${stop.Time} min${
          stop.Time === "1" ? "" : "s"
        } | ${stop.ArriveTime}${stop.IsLastStop ? " - LAST STOP" : ""}`;
        detailsContainer.appendChild(timeDetails);
      });

      let color = getColor(route.routeName);
      const box = document.createElement("div");
      box.style = `height:20px;width:20px;background-color:${color};display:inline-block;`;

      header.innerHTML = route.routeName;
      header.style =
        "display:inline-block;margin-left:12px;margin-top:0px;margin-bottom:0px;text-overflow:ellipsis;white-space:nowrap;width:270px;overflow:hidden;vertical-align:bottom";
      container.appendChild(box);
      container.appendChild(header);
      container.appendChild(divider);
      container.appendChild(detailsContainer);
      wrapper.appendChild(container);
    });
    if (this.page === 1) this.page = 0;
    else if (this.page === 0) this.page = 1;
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
  }
});
const getColor = (routeName) => {
  // get color of route based on route number
  let color;
  switch (routeName.split(" ")[0]) {
    case "1":
      color = "red";
      break;
    case "2":
      color = "green";
      break;
    case "3":
      color = "blue";
      break;
    case "5":
      color = "yellow";
      break;
    case "6":
      color = "brown";
      break;
    case "7":
      color = "#8B008B"; // purple
      break;
    case "9":
      color = "#DDA0DD"; // plum
      break;
    case "11":
      color = "#7d161a"; // cherry
      break;
    case "12":
      color = "#C8A2C8"; // lilac
      break;
    case "14":
      color = "#FFE4C4"; // peach
      break;
    case "21":
      color = "#C8102E"; // ISU CARDINAL -- GO CLONES!!
      break;
    case "23":
      color = "orange";
      break;
    case "25":
      color = "#F1BE48"; // ISU GOLD -- GO CLONES!!
      break;
    default:
      color = "black"; // show nothing
  }
  return color;
};
