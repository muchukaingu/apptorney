module.exports.dateDifference = function(date1, date2) {
    var dt1 = new Date(date1);
    var dt2 = new Date(date2);

    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
}


module.exports.checkMonth = function(date1, date2) {
    var dt1 = new Date(date1);
    var dt2 = new Date(date2);


    if ((dt1.getMonth() - dt2.getMonth() + dt1.getFullYear() - dt2.getFullYear()) == 0) {

        return true;
    }
    return false;
}