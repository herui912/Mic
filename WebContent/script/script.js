$(document).ready(function () {

    $.ajax({
        type: "GET",
        url: "data/articles.json",
        success: function (response) {
            showtable(response);
            data = response;
        },
        error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alert("error:" + msg);
        },
        dataType: "json"

    });
    $.ajax({
        type: "GET",
        url: "data/more-articles.json",
        success: function (response) {
            moredata = response;
        },
        error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alert("error:" + msg);
        },
        dataType: "json"

    });
    //alert("more"+data.length);
    //alert("more"+moredata.length)
    function timeSince(date) {

        var seconds = Math.floor((new Date("11 9, 2013 18:00:00") - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval >= 1) {
            return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return interval + " months ago";
        }

        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return interval + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }


    var countsum = function (data) {
        var s = data.length;
        alert("s" + s);
    }
    var clicktime = 0;
    var showvolue = (clicktime + 1) * 10;
    showtable = function (data) {
        var str = "<table id='articaltable' class='table table-striped'>" +
            "<thead><tr><td>UNPUBLISHED ARTICALS</td><td>AUTHOR</td>" +
            "<td onclick=\"wordssort()\">WORDS</td><td onclick=\"datesort()\">" +
            "SUBMITTED</td></tr></thead>";
        var author, pubdate, pubmonth, pubyear, pubday, pubtime, pubinput = "";
        var upatc = ""
        for (var i = 0; i < showvolue; i++) {
            pubdate = data[i].publish_at.split(" ");
            pubmonth = pubdate[0].split("-")[1];
            pubyear = pubdate[0].split("-")[0];
            pubday = pubdate[0].split("-")[2];
            pubtime = pubdate[1];
            pubstring = pubmonth + " " + pubday + ", " + pubyear + " " + pubtime;
            pubinput = new Date(pubstring);
            //console.log(pubinput);

            author = data[i].profile.first_name + " " + data[i].profile.last_name;
            str += "<tbody><tr ><td><div class='jpg'><img src = " + data[i].image + " height='54px' width='96px'/></div><div class='description'>" + data[i].title + "</div></td><td class='authors'>" + author + "</td><td class='words'>" + data[i].words + "</td><td class='pubts'>" + timeSince(pubinput) + "</td></tr>";
        }
        str += "</tbody></table>";

        $("#grid").html(str);
    };
    deterdata = function () {
        if (showvolue <= data.length) {
            data = data;
        } else if (showvolue > data.length && showvolue < 60) {
            for (var i = 0; i < moredata.length; i++) {
                data.push(moredata[i]);

            }

        } else {
            alert("sorry..no more");
            $("#sm2").addClass("disabled");
            showvolue = data.length;
        }
    };
    $("#sm2").click(function () {
        clicktime++;
        showvolue = (clicktime + 1) * 10;
        deterdata();
        showtable(data);

    })


    var end = 0;
    appendtable = function (value) {
        var str = "";
        if (showvolue < data.length) {
            showvolue = showvolue;
        } else {
            showvolue = showvolue - data.length;
            if (showvolue >= moredata.length) {
                alert("sorry..no more");
                $("#smd").addClass("disabled");

            }
        }
        end = showvolue + 10;
        for (var i = showvolue; i < end; i++) {
            //alert("now is"+ showvolue);
            author = value[i].profile.first_name + " " + value[i].profile.last_name;
            str += "<tr ><td><div class='jpg'><img src = " + value[i].image + 
            " height='54px' width='96px'/></div><div class='description'>" + 
            value[i].title + "</div></td><td>" + author + "</td><td>" + value[i].words +
            "</td><td>" + value[i].publish_at + "</td></tr>";
        }

        $("#articaltable tr:last").after(str);
    }


    $("#smd").click(function () {
        clicktime++;
        showvolue = (clicktime) * 10;
        if (showvolue < data.length) {
            appendtable(data);
        } else {
            appendtable(moredata);
        };

    });
    var sortdata = [];
    var mdct = 0;
    var mdcd = 0;
    var sort_by = function (field, reverse, primer) {

        var key = primer ? function (x) {
                return primer(x[field])
            } : function (x) {
                return x[field]
            };

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }

    var sortbydate = function (data) {
        data.sort(function (a, b) {
            pubdate1 = b.publish_at.split(" ");
            pubmonth1 = pubdate1[0].split("-")[1];
            pubyear1 = pubdate1[0].split("-")[0];
            pubday1 = pubdate1[0].split("-")[2];
            pubtime1 = pubdate1[1];
            pubstring1 = pubmonth1 + " " + pubday1 + ", " + pubyear1 + " " + pubtime1;
            pubdate2 = a.publish_at.split(" ");
            pubmonth2 = pubdate2[0].split("-")[1];
            pubyear2 = pubdate2[0].split("-")[0];
            pubday2 = pubdate2[0].split("-")[2];
            pubtime2 = pubdate2[1];
            pubstring2 = pubmonth2 + " " + pubday2 + ", " + pubyear2 + " " + pubtime2;
            if (mdcd % 2 == 0) {
                return new Date(pubstring1) - new Date(pubstring2);
            } else {
                return new Date(pubstring2) - new Date(pubstring1);
            }

        });
    };

    wordssort = function () {
        mdct++;
        if (mdct % 2 == 0) {
            data.sort(sort_by('words', true, parseInt));
        } else {
            data.sort(sort_by('words', false, parseInt));
        }
        deterdata();
        showtable(data);
    }
    datesort = function () {
        mdcd++;
        sortbydate(data);
        deterdata();
        showtable(data);
    }




})