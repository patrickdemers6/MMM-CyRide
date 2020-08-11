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
      let color;
      switch (route.routeName.split(" ")[0]) {
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
      header.innerHTML =
        `<div style="height:20px;width:20px;background-color:${color};display:inline-block;margin-left:10px;"/>` +
        route.routeName;
    });
    return wrapper;
  },
  socketNotificationReceived: function (notification, payload, sender) {
    if (notification !== "MMM-CYRIDE-STOPS_DATA") return;
    console.log(notification, payload);
    let upcomingBusses = [];
    payload.forEach((routePayload) => {
      upcomingBusses.push(
        routePayload.Arrivals.filter((bus, i) => bus.ArriveTime && i < 2)
      );
    });
    let routes = upcomingBusses.map((busStops) => {
      let minutesTill = [];
      busStops.forEach((stop) => {
        minutesTill.push(stop.Minutes);
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
