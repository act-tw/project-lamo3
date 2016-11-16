$(function() {
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

});