$(document).ready(function () {
    var data = "";
    var moredata = "";
    var dl1 = 0;
    var dl2 = 0;
    var clicktime = 0;
    var showvolue = (clicktime + 1) * 10;

    //get data from articles.json
    $.ajax({
        type: "GET",
        url: "data/articles.json",
        success: function (response) {
            showtable(response);
            data = response;
            dl1 = data.length;
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
    //get data from more-articles.json
    var xmlhttp = new XMLHttpRequest();
    var url = "data/more-articles.json";
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            moredata = myArr;
            dl2 = moredata.length;
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    
  //determine use which data
    	deterdata = function () {
        if (showvolue <= data.length) {
            data = data;
        } else if (showvolue > data.length && showvolue <=60) {
            for (var i = 0; i < moredata.length; i++) {
                data.push(moredata[i]);
            }

        } else {
            alert("sorry..no more articles");
            $("#sm2").addClass("disabled");
            showvolue = 60;
        }
    };

    var sortdata = [];
    var mdct = 0;
    var mdcd = 0;
    //sortby key
    function sort_by(field, reverse, primer) {

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
    function sortbyword(mdct) {
        if (mdct % 2 == 0) {
            data.sort(sort_by('words', true, parseInt));
        } else {
            data.sort(sort_by('words', false, parseInt));
        }
    }

    function sortbydate(data, mdcd) {
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
    wordssort = function() {
        mdct++;
        deterdata();
        sortbyword(mdct);

        showtable(data);
        setCookie("sorttype", "w", 1);
        setCookie("sortc", mdct, 1);
    }
    datesort = function() {
        mdcd++;
        deterdata();
        sortbydate(data, mdcd);

        showtable(data);
        setCookie("sorttype", "d", 1);
        setCookie("sortc", mdcd, 1);
    }
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 60 * 1000));
        //right version: d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
       // alert("you just set cookie" + document.cookie);
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function checkCookie() {
        var clicktime = getCookie("clicktime");
        var sorttype = getCookie("sorttype");
        //if button clicked
        if (clicktime != "") {
            alert("Welcome back ");
            showvolue = (parseInt(clicktime) + 1) * 10;
            if(showvolue>60){
            	showvolue=60;
            	//$("#sm2").addClass("disabled");
            }
            deterdata();
            if (sorttype != "") {

                if (sorttype == "w") {
                    var sortc = getCookie("sortc");
                    mdct = parseInt(sortc);
                    
                    sortbyword(mdct);
                }
                if (sorttype == "d") {
                    var sortc = getCookie("sortc");
                    mdcd = parseInt(sortc);
                    sortbydate(data, mdcd);
                }
            }
            showtable(data);
        }
        //if only sort clicked
        else if (sorttype != "") {
            if (sorttype == "w") {
                var sortc = getCookie("sortc");
                mdct = parseInt(sortc);
                deterdata();
                sortbyword(mdct);

                showtable(data);
            }
            if (sorttype == "d") {
                var sortc = getCookie("sortc");
                mdcd = parseInt(sortc);
                deterdata();
                sortbydate(data, mdcd);

                showtable(data);
            }

        } 
        //nothing been clicked
        else {
            alert("No cookies");
        }
    }

    checkCookie();

    //format to days ago
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
    b1click = function(){
    	 clicktime1 = getCookie("clicktime");
         if (clicktime1 != "") {
             clicktime = parseInt(clicktime1);
         }
         clicktime++;
         showvolue = (clicktime + 1) * 10;
         if (showvolue == 40) {
             alert("From now on, you'll see extra articles");
         }
         deterdata();
         showtable(data);
         setCookie("clicktime", clicktime, 1);
    }

    function showtable(data) {
        var dl3 = dl1 + dl2;
        var str = "<table id='articaltable' class='table table-hover'>" +
            "<thead><tr><td>UNPUBLISHED ARTICALS (" + dl3 + ")" +
            "</td><td>AUTHOR</td><td onclick=\"wordssort()\">WORDS</td>" +
            "<td onclick=\"datesort()\">SUBMITTED</td></tr></thead>";
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
            author = data[i].profile.first_name + " " + data[i].profile.last_name;
            str += "<tbody><tr ><td><div class='jpg img-thumbnail'><img src = " + data[i].image 
            + " height='54px' width='96px'/></div><div class='description'>" 
            + data[i].title + "</div></td><td class='authors' style='text-align:center;'>" + author 
            + "</td><td class='words' style='text-align:center;'>" + data[i].words + "</td><td class='pubts' style='text-align:center;'>" 
            + timeSince(pubinput) + "</td></tr>";
        }
        str += "</tbody><tfoot><tr><td colspan='4' onclick=\"b1click()\" style='text-align:center;'>" +
        		"<button class='btn btn-info'>show 10 more...</button></td>" +
        		"</tr></tfoot></table>";

        $("#grid").html(str);
    };
})