var isLocal = /^file\:\/\/\//i.test(location.href);

var ItemList = {};

function AddItem(merno1, id, color, icon) {
    var obj = new Object;
    obj.Id = id;
    obj.Color = color;
    obj.Icon = icon;
    obj.SizeList = {};
    obj.Photos = new Array();
    obj.SizeNoList = new Array();
    ItemList[merno1] = ItemList[merno1] || {};
    ItemList[merno1][color] = obj;
}

function AddSize(merno1, id, color, size, state, isZero) {
    var obj = new Object;
    obj.Id = id;
    obj.Color = color;
    obj.Size = size;
    obj.State = state;
    obj.isZero = isZero;
    var item = ItemList[merno1][color];
    if (item != undefined) {
        item.SizeList[id] = obj;
        //在IE9排序會亂，所以用陣列記順序
        item.SizeNoList[item.SizeNoList.length] = id;
    }
}

$(function() {

    function gotourl(option, isReturnUrl) {
        option = $.extend({
            m: QueryString("m"),
            p: QueryString("p"),
            pat: QueryString("pat"),
            o: QueryString("o"),
            sa: QueryString("sa"),
            smfp: QueryString("smfp"),
            idno: QueryString("idno"),
            "ctl00%24edtSearch": QueryString("ctl00%24edtSearch") || QueryString("ctl00$edtSearch"),
            s: QueryString("s")
        }, option);
        var param = "";
        for (var a in option) {
            if (option[a] !== "") {
                param += "&" + a + "=" + option[a];
            }
        }
        if (isReturnUrl) {
            return location.pathname + "?" + param.substr(1);
        } else {
            location.href = location.pathname + "?" + param.substr(1);
            return null;
        }
    }

    (function() {
        var $waterfall = $(".waterfall");
        var $items = $waterfall.find(">div");

        function getMinIndex(ary) {
            if (!Array.prototype.indexOf) {
                Array.prototype.indexOf = function(elt /*, from*/) {
                    var len = this.length >>> 0;
                    var from = Number(arguments[1]) || 0;
                    from = (from < 0)
                        ? Math.ceil(from)
                        : Math.floor(from);
                    if (from < 0)
                        from += len;

                    for (; from < len; from++) {
                        if (from in this &&
                            this[from] === elt)
                            return from;
                    }
                    return -1;
                };
            }
            return ary.indexOf(Math.min.apply(null, ary));
        }

        function resize() {
            $("#itemRigthDiv").css("display", "block");
            var itemWidth = $items.eq(0).outerWidth(true);
            var rowCount = parseInt($waterfall.width() / itemWidth, 10);
            var rowHeight = [];
            for (var i = 0; i < rowCount; i++) {
                rowHeight.push($items.eq(i).outerHeight(true));
                $items.eq(i).removeAttr("style");
            }
            for (var i = rowCount; i < $items.length; i++) {
                var minIndex = getMinIndex(rowHeight);
                $items.eq(i).css({ "position": "absolute", "left": minIndex * itemWidth, "top": rowHeight[minIndex] });
                rowHeight[minIndex] += $items.eq(i).outerHeight(true);
            }
            $waterfall.height(Math.max.apply(null, rowHeight));
            $("#itemRigthDiv").css("display", "inline-block");
        }

        $(window).resize(function() {
            resize();
        }).resize();
        $(window).load(function() {
            resize();
        });
        for (var i = 1; i < 4; i++) {
            setTimeout(function () {
                resize();
            }, i * 500);
        }
    })(); //core
    (function() {
        var $waterfall = $(".waterfall");
        $waterfall.on("mouseenter mouseleave", ">div a>img", function() {
            var $this = $(this);
            var src = $this.attr("src");
            var srcSplitLast;
            if (src.indexOf("-2.") < 0) {
                srcSplitLast = src.splitLast(".");
                var url = srcSplitLast[0] + "-2." + srcSplitLast[1];
                var img = new Image();
                img.src = url;
                img.onload = function() {
                    $this.attr("src", url);
                };
            } else {
                srcSplitLast = src.splitLast("-2.");
                $this.attr("src", srcSplitLast[0] + "." + srcSplitLast[1]);
            }
        });
    })(); //switch items image
    (function() {

        function open() {
            $(".sortbar>.flag").addClass("close");
            $(".sortbox").show();
        }

        function close() {
            $(".sortbar>.flag").removeClass("close");
            $(".sortbox").hide();
        }

        $(document).click(function() {
            close();
        });

        $(".sortbar>.sortbox").click(function(e) {
            e.stopPropagation();
        });

        $(".sortbar>.flag").click(function(e) {
            if ($(this).hasClass("close")) {
                close();
            } else {
                open();
            }
            e.stopPropagation();
        });

        $(".sortbar>.sortbox>.control>.confirmbtn").click(function() {
            close();
            var sortPrice = $(".group.price>.selected").text();
            var params = {};
            if (sortPrice == "價格由高至低") {
                params.o = "2";
                params.sa = "1";
            } else if (sortPrice == "價格由低至高") {
                params.o = "2";
                params.sa = "0";
            } else {
                params.o = "";
                params.sa = "";
            }
            if ($(".group.size>.selected").length > 0) {
                var s = [];
                $(".group.size>.selected").each(function() {
                    s.push($(this).text());
                });
                params.s = s;
            } else {
                params.s = "";
            }
            gotourl(params);
        });

        $(".sortbar>.sortbox>.control>.clearbtn").click(function() {
            $(".sortbar>.sortbox>div>div>div").removeClass("selected");
        });

        $(".sortbar>.sortbox>div>div.price").on("click", "div:not('.no')", function() {
            $(this).parent().find(".selected").removeClass('selected').end().end().addClass("selected");
        });

        $(".sortbar>.sortbox>div>div.size").on("click", "div:not('.no')", function() {
            if ($(this).hasClass("selected")) {
                $(this).removeClass("selected");
            } else {
                $(this).addClass("selected");
            }
        });

        (function() {
            $(window).resize(function() {
                var $waterfall = $(".waterfall");
                var $items = $waterfall.find(">div");
                var itemWidth = $items.eq(0).outerWidth(true);
                var rowCount = parseInt($waterfall.width() / itemWidth, 10);
                $(".sortbar").width(rowCount * itemWidth - 18);
                $(".sortbar>.item,.sortbar>.look").show();
            });
        })(); //adjust item look position

        (function() {
            $(".sortbar>.look").click(function() {
                var $this = $(this),
                    $img = $(".front>a>img");
                $this.addClass("close").next().removeClass("close");
                $img.each(function() {
                    var $self = $(this),
                        src = $self.attr("src");
                    var srcSplitLast;
                    if (src.indexOf("-2.") < 0) {
                        srcSplitLast = src.splitLast(".");
                        var url = srcSplitLast[0] + "-2." + srcSplitLast[1];
                        var img = new Image();
                        img.src = url;
                        img.onload = function() {
                            $self.attr("src", url);
                        };
                    }
                });
            });

            $(".sortbar>.item").click(function() {
                var $this = $(this),
                    $img = $(".front>a>img");
                $this.addClass("close").prev().removeClass("close");
                $img.each(function() {
                    var $self = $(this),
                        src = $self.attr("src");
                    var srcSplitLast;
                    if (src.indexOf("-2.") > -1) {
                        srcSplitLast = src.splitLast("-2.");
                        $self.attr("src", srcSplitLast[0] + "." + srcSplitLast[1]);
                    }
                });
            }).click();


        })(); //item and look 

        (function() {
            if (QueryString("o") === "2" && QueryString("sa") === "1") {
                $(".group.price>div:contains('價格由高至低')").addClass("selected");
            } else if (QueryString("o") === "2" && QueryString("sa") === "0") {
                $(".group.price>div:contains('價格由低至高')").addClass("selected");
            }
        })(); //init sort by price

        (function() {
            if (window["filterSize"]) {
                var filterSize = window["filterSize"];
                var html = "";
                for (var i = 0, max = filterSize.length; i < max; i++) {
                    html += "<div>" + filterSize[i] + "</div>";
                }
                $(".group.size").append(html);
            }
        })(); //build size

        (function() {
            if (QueryString("s") !== "") {
                var s = QueryString("s").split(",");
                for (var i = 0, max = s.length; i < max; i++) {
                    $(".group.size>div").each(function() {
                        if ($(this).text() == s[i]) {
                            $(this).addClass("selected");
                        }
                    });
                }
            }
        })(); //init sort by size
    })(); //sort
    (function() {
        $(window).resize(function() {
            var $waterfall = $(".waterfall");
            var $items = $waterfall.find(">div");
            var itemWidth = $items.eq(0).outerWidth(true);
            var rowCount = parseInt($waterfall.width() / itemWidth, 10);
            $(".pagerbox").css("left", rowCount * itemWidth + 18);
        }); //adjust pager position
        (function() {
            if (isLocal) {
                window.allCount = 420;
                window.pagerSize = 60;
            }
            var max = Math.ceil(allCount / pagerSize);
            var cur = QueryString("smfp");
            if (cur === "") {
                cur = 1;
            } else {
                cur = parseInt(cur, 10);
                if (isNaN(cur)) {
                    cur = 1;
                }
            }
            var html = "";
            if (max <= 5) {
                for (var i = 1; i <= max; i++) {
                    html += "<div";
                    if (i === cur) {
                        html += " class=\"active\"";
                    }
                    html += ">" + i + "</div>";
                }
            } else {
                if (cur < 4) {
                    for (var i = 1; i <= 5; i++) {
                        html += "<div";
                        if (i === cur) {
                            html += " class=\"active\"";
                        }
                        html += ">" + i + "</div>";
                    }
                } else if (cur >= max - 2) {
                    for (var i = max - 4; i <= max; i++) {
                        html += "<div";
                        if (i === cur) {
                            html += " class=\"active\"";
                        }
                        html += ">" + i + "</div>";
                    }
                } else {
                    for (var i = -2; i <= 2; i++) {
                        html += "<div";
                        if (cur + i === cur) {
                            html += " class=\"active\"";
                        }
                        html += ">" + (cur + i) + "</div>";
                    }
                }
            }
            if (max <= 5) {
                $(".pagerbox>.prev,.pagerbox>.next").hide();
            }
            $(".pagerbox>.countbox").html(html);
            if (cur === 1) {
                $(".pagerbox>.prev").css("visibility", "hidden");
            } else if (cur === max) {
                $(".pagerbox>.next").css("visibility", "hidden");
            }
            $(".pagerbox>.countbox").on("click", "div", function() {
                gotourl({ smfp: $(this).text() });
            });
            $(".pagerbox>.prev").click(function() {
                gotourl({ smfp: cur - 1 });
            });
            $(".pagerbox>.next").click(function() {
                gotourl({ smfp: cur + 1 });
            });
        })(); //build pager count
    })(); //pager
    (function() {
        var data = [
            { Idno: 5, Name: "newin", MouseoverName: "", PhotoPath: "http://photo.lamo3.com.tw/eshop/common/nav-new-in.png", MainPhoto: "", ShowType: 0, OrderNum: 1, V1: "" },
            { Idno: 6, Name: "beautifulthings", MouseoverName: "", PhotoPath: "http://photo.lamo3.com.tw/eshop/common/nav-beautiful-things.png", MainPhoto: "", ShowType: 0, OrderNum: 1, V1: "" },
            { Idno: 7, Name: "lookbook", MouseoverName: "", PhotoPath: "http://photo.lamo3.com.tw/eshop/common/nav-lookbook.png", MainPhoto: "", ShowType: 0, OrderNum: 1, V1: "" },
            { Idno: 8, Name: "onsale", MouseoverName: "", PhotoPath: "http://photo.lamo3.com.tw/eshop/common/nav-on-sale.png", MainPhoto: "", ShowType: 0, OrderNum: 1, V1: "" },
            { Idno: 9, Name: "event", MouseoverName: "", PhotoPath: "http://photo.lamo3.com.tw/eshop/common/nav-event.png", MainPhoto: "", ShowType: 2, OrderNum: 1, V1: "http://www.google.com.tw/" }
        ];
        if (QueryString("pat") === "1") {
            (function() {
                $(".sortbar").hide();

                function getdata(data) {
                    var html = "";
                    for (var i = 0, max = data.length; i < max; i++) {
                        if (data[i].Idno === parseInt(QueryString("m"), 10)) {
                            html += "<a href=\"" + gotourl({ pat: "" }, true) + "\">" + data[i].Name + "</a>";
                            html += "<span class=\"flag\">&nbsp;</span>";
                            html += "<a href=\"" + gotourl({ idno: "" }, true) + "\">穿搭頁</a>";
                            break;
                        }
                    }
                    if (window["patIdno"] && window["patName"]) {
                        html += "<span class=\"flag\">&nbsp;</span>";
                        html += "<a href=\"" + gotourl({ idno: patIdno }, true) + "\">" + patName + "</a>";
                    }
                    $(".navibar").append(html);
                }

                if (isLocal) {
                    getdata(data);
                } else {
                    $.getJSON("../common/ajax/menucmd.ashx", function(data) {
                        getdata(data);
                    });
                }
            })();
        } else {
            (function() {
                var m = parseInt(QueryString("m"), 10);
                var p = parseInt(QueryString("p"), 10);

                function getdata(data) {
                    var html = "";
                    for (var i = 0, imax = data.length; i < imax; i++) {
                        if (data[i].Idno === m) {
                            html += "<a href=\"" + gotourl({ m: data[i].Idno, p: "" }, true) + "\">" + data[i].Name + "</a>";
                            for (var j = 0, jmax = data[i].SubClass.length; j < jmax; j++) {
                                if (data[i].SubClass[j].Idno === p) {
                                    html += "<span class=\"flag\">&nbsp;</span>";
                                    html += "<a href=\"" + gotourl({ m: data[i].Idno, p: data[i].SubClass[j].Idno }, true) + "\">" + data[i].SubClass[j].Name + "</a>";
                                } else {
                                    for (var k = 0, kmax = data[i].SubClass[j].List.length; k < kmax; k++) {
                                        if (data[i].SubClass[j].List[k].Idno === p) {
                                            html += "<span class=\"flag\">&nbsp;</span>";
                                            html += "<a href=\"" + gotourl({ m: data[i].Idno, p: data[i].SubClass[j].Idno }, true) + "\">" + data[i].SubClass[j].Name + "</a>";
                                            html += "<span class=\"flag\">&nbsp;</span>";
                                            html += "<a href=\"" + gotourl({ m: data[i].Idno, p: data[i].SubClass[j].List[k].Idno }, true) + "\">" + data[i].SubClass[j].List[k].Name + "</a>";
                                        }
                                    }
                                }
                            }
                        }
                    }
                    $(".navibar").append(html);
                }

                if (isLocal) {
                    getdata(data);
                } else {
                    $.getJSON("../common/ajax/menucmd.ashx", function(data) {
                        getdata(data);
                    });
                }
            })();
        }
    })(); //navi
    (function() {

        function isIe(ver) {
            var b = document.createElement("b");
            b.innerHTML = "<!--[if IE ' + ver + ']><i></i><![endif]-->";
            return b.getElementsByTagName("i").length === 1;
        }

        if (isIe(8) || isIe(9)) {
            $(".waterfall>div>.back").hide();
        }
        $(".infobtn").click(function() {
            var $front = $(this).parent().parent();
            var $back = $front.next();
            if (isIe(8) || isIe(9)) {
                $back.show();
                $front.hide();
                $back.parent().height($front.outerHeight() - 2);
                $back.find(".backbtn").css("right", 4);
            } else {
                $front.addClass("rotate").one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                    $back.addClass("rotate");
                    $front.unbind();
                }); //not support ie8~9
            }
        });

        $(".backbtn").click(function() {
            var $back = $(this).parent();
            var $front = $back.prev();
            if (isIe(8) || isIe(9)) {
                $front.show();
                $back.hide();
            } else {
                $back.removeClass("rotate").one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                    $front.removeClass("rotate");
                    $back.unbind();
                }); //not support ie8~9                    
            }

        });


    })(); //infobtn and backbtn
    (function() {
        $(".namelabel>.colorbox").on("click", "img", function() {
            var $this = $(this),
                color = $this.attr("color"),
                $colorbox = $this.parent(),
                merno1 = $colorbox.parent().find(".addtobag").attr("merno1"),
                html = "";
            $colorbox.find(">img.selected").removeClass("selected").end().end().addClass("selected");
            for (var a in ItemList[merno1][color].SizeList) {
                var size = ItemList[merno1][color].SizeList[a],
                    state = size.State;
                if ((size.State >= 2) && (!size.isZero == 1)) {
                    state = 0;
                }
                if (state != 3) //0=正常,1=預購,2=貨到通知
                {
                    html += "<a href=\"javascript:void(0);\" k=\"" + a + "\" s=\"" + state + "\">" + size.Size + "</a>";
                } else if (state == 3) //3=斷貨
                {
                    html += "<span s=\"3\">" + size.Size + "</span>";
                }
            }
            $colorbox.prev().html(html);
        });
    })(); //select color(build size)
    (function() {
        $(".namelabel>.colorbox").each(function() {
            var $this = $(this),
                $addtobag = $this.parent().find(".addtobag"),
                merno1 = $addtobag.attr("merno1"),
                defColor = $addtobag.attr("color"),
                html = "";
            for (var color in ItemList[merno1]) {
                html += "<img color=\"" + color + "\" src=\"" + ItemList[merno1][color].Icon + "\" >";
            }
            $this.html(html).find("img[color='" + defColor + "']").click();
        });
    })(); //build color
    (function() {
        $(".sizebox").on("click", ">*", function() {
            $(this).parent().find(">*.selected").removeClass("selected");
            $(this).addClass("selected");
            if ($(this).attr("s") === "3") {
                $(this).parent().parent().find(".addtobag").removeClass("notice").addClass("no");
            } else if ($(this).attr("s") === "2") {
                $(this).parent().parent().find(".addtobag").removeClass("no").addClass("notice");
            } else {
                $(this).parent().parent().find(".addtobag").removeClass("no notice");
            }
        });
    })(); //select size
    (function() {
        $(".namelabel>.addtobag").click(function() {
            if ($(this).parent().find(".sizebox>*.selected").length === 0) {
                alert("請選擇尺寸");
            } else {
                if (!$(this).hasClass("no")) {
                    if ($(this).hasClass("notice")) {
                        $("<a>").fancybox({
                            width: 500,
                            height: 300,
                            padding: 0,
                            margin: 0,
                            centerOnScroll: true,
                            enableEscapeButton: false,
                            hideOnOverlayClick: false,
                            showCloseButton: true,
                            scrolling: "no",
                            type: "iframe",
                            href: "../common/ItemNotify.aspx?mid=" + $(this).parent().find(".sizebox>*.selected").attr("k")
                        }).click();
                    } else {
                        CartAPI.AddToCart($(this).attr("merno1"), $(this).parent().find(".sizebox>*.selected").attr("k"), 1, function(data) {
                            if (data.IsSuccess) {
                                try {
                                    initShoppingCart();
                                } catch(e) {
                                }
                                alert("已加入購物車");
                            } else {
                                alert(data.Message);
                            }
                        });
                    }
                }
            }
        });
    })(); //add to bag
    (function() {
        $(".namelabel>.wishlist").click(function() {
            if ($(this).parent().find(".sizebox>*.selected").length === 0) {
                alert("請選擇尺寸");
            } else {
                CartAPI.AddToTrace($(this).prev().attr("merno1"), $(this).parent().find(".sizebox>*.selected").attr("k"), function(data) {
                    if (data.IsSuccess) {
                        try {
                        } catch(e) {
                        }
                        alert("已加入收藏");
                    } else {
                        alert(data.Message);
                    }
                });
            }
        });
    })(); //wishlist
    (function() {
        var search = QueryString("ctl00%24edtSearch") || QueryString("ctl00$edtSearch");
        if (search !== "") {
            $(".navibar").hide();
            $(".sortbar>.flag").hide();
            $(".sortbar").css("margin-top", 22);
            $("#ctl00_ContentPlaceHolder1_ilItems").css({ "max-width": 1232, "min-width": 924 });
            var output = "<div style=\"margin:10px 0;\">";
            output = "你搜尋的關鍵字是\"" + search + "\"";
            if (window["allCount"] !== undefined && window["allCount"] === 0) {
                $(".sortbar").hide();
                output += "，找不到相關的商品";
            }
            output += "。</div>";
            $(".waterfall").before(output);
        }
    })(); //search
    (function () {
        if (QueryString("pat") !== "" && QueryString("idno") === "") {
            $(".waterfall").addClass("itemparts");
        }
    })(); //itemparts
});