const getColor = (routeName) => {
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
