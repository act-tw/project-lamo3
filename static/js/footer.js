"use strict";
$(function(){
    $("#footer>ol>li.subscribeBn").click(function(){
        $("#mailBox").stop().animate({
            bottom:0
        }).mouseleave(function(){
            $(this).animate({bottom:-260})
        });
    });
});