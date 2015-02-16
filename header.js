String.prototype.splitLast = function (separator) {
    var si = this.split(separator);
    var sb = "";
    var max = si.length;
    for (var i = 0; i < max; i++) {
        if (i < max - 1) {
            sb += si[i];
            if (i < max - 2) {
                sb += separator;
            }
        }
    }
    var output = [];
    if (sb != "") {
        output.push(sb);
    }
    output.push(si[max - 1]);
    return output;
};
var isLocal = /^file\:\/\/\//i.test(location.href);
function initShoppingCart() {
    var cartlist = [{ MerNo: "S01450641015", MerNo1: "01450641015", MerName: "帽內撞呢料雙蓋袋風衣外套", Color: "杏色", Size: "S", Price: 1495, Num: 1, PhotoSmPath: "http://s3.hicloud.net.tw/fifty/men/0145064101539/0145064101539.jpg", ColorPhotoPath: "http://s3.hicloud.net.tw/fifty/men/0145064101539/color.jpg" }];
    function getdata(cartlist) {
        var count = 0;
        var sum = 0;
        var html = "";
        try {
            if (cartlist[0].MerName) {
                for (var i = 0; i < cartlist.length; i++) {
                    html += "<tr>"
                    html += "<td>" + cartlist[i].MerName + "</td>"
                    html += "<td><img src=\"" + cartlist[i].ColorPhotoPath + "\" width=\"11\" /></td>"
                    html += "<td>" + cartlist[i].Size + "</td>"
                    html += "<td>" + cartlist[i].Price + "</td>"
                    html += "<td class=\"end\">" + cartlist[i].Num + "</td>"
                    html += "</tr>"
                    count += cartlist[i].Num;
                    sum += cartlist[i].Num * cartlist[i].Price;
                }
            }
        } catch (err) {
        }
        $(".header>.box>.control>.right>.bagbox>div>.list>table>tbody").html(html);
        $(".count").text(count);
    }
    if (isLocal) {
        getdata(cartlist);
    } else {
        $.getJSON("../Common/CartList.ashx", function (cartlist) {
            getdata(cartlist);
        });
    }
}

$(function() {
    (function() {
        var data = [
            { Idno: 5, Name: "newin", MouseoverName: "", PhotoPath: "http://photo.lamo3.com.tw/eshop/common/nav-new-in.png", MainPhoto: "", ShowType: 0, OrderNum: 1, V1: "" },
            { Idno: 6, Name: "beautifulthings", MouseoverName: "", PhotoPath: "http://photo.lamo3.com.tw/eshop/common/nav-beautiful-things.png", MainPhoto: "", ShowType: 0, OrderNum: 1, V1: "" },
            { Idno: 7, Name: "lookbook", MouseoverName: "", PhotoPath: "http://photo.lamo3.com.tw/eshop/common/nav-lookbook.png", MainPhoto: "", ShowType: 0, OrderNum: 1, V1: "" },
            { Idno: 8, Name: "onsale", MouseoverName: "", PhotoPath: "http://photo.lamo3.com.tw/eshop/common/nav-on-sale.png", MainPhoto: "", ShowType: 0, OrderNum: 1, V1: "" },
            { Idno: 9, Name: "event", MouseoverName: "", PhotoPath: "http://photo.lamo3.com.tw/eshop/common/nav-event.png", MainPhoto: "", ShowType: 2, OrderNum: 1, V1: "http://www.google.com.tw/" }
        ];

        function getdata(data) {
            if (data !== null) {
                var html = "";
                for (var i = 0, max = data.length; i < max; i++) {
                    html += "<a href=\"";
                    switch (data[i].ShowType) {
                    case 0:
                        html += "../Shop/itemlist.aspx?m=" + data[i].Idno;
                        break;
                    case 2:
                    case 3:
                        html += data[i].V1;
                        break;
                    }
                    html += "\"" + (data[i].ShowType === 3 ? " target=\"_blank\"" : "") + "><img src=\"" + data[i].PhotoPath + "\"></a>";
                }
                $(".header>.box>.control>.left").html(html).on("mouseenter mouseleave", "img", function() {
                    var $this = $(this);
                    var src = $this.attr("src");
                    var srcSplitLast;
                    if (src.indexOf("-hover.") < 0) {
                        srcSplitLast = src.splitLast(".");
                        var url = srcSplitLast[0] + "-hover." + srcSplitLast[1];
                        var img = new Image();
                        img.src = url;
                        img.onload = function() {
                            $this.attr("src", url);
                        };
                    } else {
                        srcSplitLast = src.splitLast("-hover.");
                        $this.attr("src", srcSplitLast[0] + "." + srcSplitLast[1]);
                    }
                });
            }
        }

        if (isLocal) {
            getdata(data);
        } else {
            $.getJSON("../common/ajax/menucmd.ashx", function(data) {
                getdata(data);
            });
        }
    })(); //menu
    (function() {
        $(".header>.box>.control>.right>.nav>.search").click(function() {
            $(".header>.searchbox").animate({ show: "show", height: 220 });
        });
        $(".header>.searchbox>div>.close").click(function() {
            $(".header>.searchbox").animate({ hide: "hide", height: 0 });
        });
    })(); //search
    (function() {

        function openBagBox() {
            $(".header>.box>.control>.right>.bagbox").show();
            if ($(".header>.box>.control>.right>.nav>.bag>span").text() === "0") {
                $(".header>.box>.control>.right>.bagbox").show().find(".empty").show().end().find(".list").hide();
                $(".header>.box>.control>.right>.bagbox>div>.checkout").addClass("goshopping").attr("href", "../Shop");
            } else {
                $(".header>.box>.control>.right>.bagbox").show().find(".empty").hide().end().find(".list").show();
                $(".header>.box>.control>.right>.bagbox>div>.checkout").removeClass("goshopping").attr("href", "../Shop/cartList.aspx");
            }
        }

        function closeBagBox() {
            $(".header>.box>.control>.right>.bagbox").hide();
        }

        $(".header>.box>.control>.right>.nav>.bag,.header>.box>.control>.right>.bagbox").on({
            mouseenter: function() {
                var $bagbox = $(".header>.box>.control>.right>.bagbox");
                if ($bagbox.data("sid") !== undefined && $bagbox.data("sid") !== null) {
                    clearTimeout($bagbox.data("sid"));
                    $bagbox.data("sid", null);
                }
                openBagBox();
            },
            mouseleave: function() {
                var $bagbox = $(".header>.box>.control>.right>.bagbox");
                $bagbox.data("sid", setTimeout(function() {
                    closeBagBox();
                }, 500));
            }
        });
        initShoppingCart();
    })(); //bag
    (function() {
        $(".header>.box>.control>.right>.upnav>.customerservice").click(function() {
            $(".header>.customerservicebox").animate({ show: "show", height: 430 });
        });
        $(".header>.customerservicebox>div>.close").click(function() {
            $(".header>.customerservicebox").animate({ hide: "hide", height: 0 });
        });
        if (isLocal) {
        	$(".header>.customerservicebox>div>.outbox").html("CUSTOMER SERVICE");
        } else {
        	$(".header>.customerservicebox>div>.outbox").load("../UserFiles/htmlCustomPage2.htm");	
        }
    })(); //customerservice
    (function() {
        $(".header>.eventbox>div>.eventbutton").click(function() {
            var right = parseInt($(".header>.eventbox").css("right"));
            if (right === -190) {
                $(".header>.eventbox").animate({ "right": 0 });
            } else {
                $(".header>.eventbox").animate({ "right": -190 });
            }
            if (isLocal) {
            	$(".header>.eventbox>div>.eventcontent").html("EVENT");
            } else {
            	$(".header>.eventbox>div>.eventcontent").load("../UserFiles/htmlCustomPage1.htm");
            }
            
        });
    })(); //event
    (function() {

        function run() {
            if ($(document).scrollTop() > 100) {
                if ($(".top").is(":visible")) {
                    var rnd = parseInt(Math.random() * 3, 10) + 1;
                    $(".top>.string").attr("class", "string s" + rnd);
                } else {
                    $(".top").fadeIn();
                }
            } else {
                if ($(".top").is(":visible")) {
                    $(".top").fadeOut();
                }
            }
        }

        $(".top>.baloon,.top>.string").click(function() {
            $("html,body").animate({ "scrollTop": 0 });
        });
        setInterval(run, 500);
    })(); //top
});