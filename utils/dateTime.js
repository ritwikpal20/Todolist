const dmy = () => {
    var currentDate = new Date();
    //retreiving Month,day, year
    const longEnUSFormatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return longEnUSFormatter.format(currentDate);
};

var strTime = () => {
    var currentDate = new Date();
    //retreiving time
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes + " " + ampm;
};

module.exports = {
    date: dmy,
    time: strTime,
};
