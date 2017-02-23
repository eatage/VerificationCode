/* 
* drag 1.0
* date 2017-02-10
* 获取滑块验证码
*/
(function ($) {
    var __imgx = 0; //图片宽度
    var __imgy = 0; //图片高度
    var __spec = "";//图片尺寸
    var __executename;//校验通过后执行的函数名
    var __Verification;//验证码区域的div
    $.fn.slide = function (imgspec, executename) {
        var div = this;
        __Verification = div.attr("id");
        __spec = imgspec;
        __executename = executename;
        __init();
    }
    function __init() {
        if (typeof (__spec) !== "string") {//spec类型必须为string
            __spec = "300*300";
        }
        if (__spec == "")
            __spec = "300*300";
        var _spec = __spec.split('*');
        __imgx = _spec[0];
        __imgy = _spec[1];
        CreadeCodeDiv();
        $('#drag').drag(__executename, __imgx, __imgy, __Verification);
        $.ajax({ //获取验证码
            type: "POST",
            url: "./VerificationCode.ashx?action=getcode&&spec=" + __spec,
            dataType: "json",
            async: false,
            data: { point: 0 },
            success: function (result) {
                if (result['state'] == -1) {
                    return;
                }
                var errcode = result['errcode'];
                if (errcode != 0) {
                    document.getElementById(__Verification).innerHTML = "<span style='color:red'>验证码获取失败，" + result['errmsg'] + "</span>";
                }
                var yvalue = result['y'];
                var small = result['small'];
                var array = result['array'];
                var normal = result['normal'];
                __imgx = result['imgx'];
                __imgy = result['imgy'];
                $(".cut_bg").css("background-image", "url(" + normal + ")");
                $("#xy_img").css("background-image", "url(" + small + ")");
                $("#xy_img").css("top", yvalue);
                $("#drag").css("width", __imgx);
                $("#drag .drag_text").css("width", __imgx);
                $(".cut_bg").css("width", __imgx / 10);
                $(".cut_bg").css("height", __imgy / 2);
                $(".refesh_bg").css("left", __imgx - 25);
                var bgarray = array.split(',');
                //还原图片
                var _cutX = __imgx / 10;
                var _cutY = __imgy / 2;
                for (var i = 0; i < bgarray.length; i++) {
                    var num = indexOf(bgarray, i.toString()); //第i张图相对于混淆图片的位置为num
                    var x = 0, y = 0;
                    //还原前偏移
                    y = i > 9 ? -_cutY : 0;
                    x = i > 9 ? (i - 10) * -_cutX : i * -_cutX;
                    //当前y轴偏移量
                    if (num > 9 && i < 10) y = y - _cutY;
                    if (i > 9 && num < 10) y = y + _cutY;
                    //当前x轴偏移量
                    x = x + (num - i) * -_cutX;
                    //显示第i张图片
                    $("#bb" + i).css("background-position", x + "px " + y + "px");
                }
            },
            beforeSend: function () {

            }
        });
    }
    function indexOf(arr, str) {
        if (arr && arr.indexOf) return arr.indexOf(str);
        var len = arr.length;
        for (var i = 0; i < len; i++) { if (arr[i] == str) return i; } return -1;
    }
    function CreadeCodeDiv() {
        var __codeDIV = document.getElementById('' + __Verification + '');
        __codeDIV.innerHTML = '';
        var __codeHTML = "<div style='width:" + __imgx + "px;height:" + __imgy + "px;'><div id='bb0'class='cut_bg'></div>"
            + "<div id='bb1'class='cut_bg'></div><div id='bb2'class='cut_bg'></div><div id='bb3'class='cut_bg'></div>"
            + "<div id='bb4'class='cut_bg'></div><div id='bb5'class='cut_bg'></div><div id='bb6'class='cut_bg'></div>"
            + "<div id='bb7'class='cut_bg'></div><div id='bb8'class='cut_bg'></div><div id='bb9'class='cut_bg'></div>"
            + "<div id='bb10'class='cut_bg'></div><div id='bb11'class='cut_bg'></div><div id='bb12'class='cut_bg'></div>"
            + "<div id='bb13'class='cut_bg'></div><div id='bb14'class='cut_bg'></div><div id='bb15'class='cut_bg'></div>"
            + "<div id='bb16'class='cut_bg'></div><div id='bb17'class='cut_bg'></div><div id='bb18'class='cut_bg'></div>"
            + "<div id='bb19'class='cut_bg'></div><div id='xy_img'class='xy_img_bord'></div></div><div id='drag'></div>";
        __codeDIV.innerHTML = __codeHTML;
    }
})(jQuery);
/*
*滑块验证码
*/
(function ($) {
    $(".handler handler_bg").on('click', function (ev) {
        var oEvent = ev || event;
        console.log("x坐标是:" + oEvent.clientX + ",y坐标是:" + oEvent.clientY);
    });
    $.fn.drag = function (executename, imgx, imgy, __Verification) {
        var x, drag = this, isMove = false, defaults = {
        };
        //添加背景，文字，滑块
        var html = '<div class="drag_bg"></div><div class="drag_text" onselectstart="return false;" unselectable="on">拖动图片验证</div>'
            + '<div class="handler handler_bg"><a href="javascript:;" onclick="$(' + __Verification + ').slide(\'' + imgx + '*' + imgy + '\',\'' + executename + '\')"'
            + ' title="点击刷新验证码" style="width:16px;height:16px;"><div class="refesh_bg"></div></a></div>';
        this.append(html);
        var handler = drag.find('.handler');
        var drag_bg = drag.find('.drag_bg');
        var text = drag.find('.drag_text');
        var maxWidth = imgx - 40; // drag.width() - handler.width();  //能滑动的最大间距
        var t1 = new Date(); //开始滑动时间
        var t2 = new Date(); //结束滑动时间

        //开始滑动
        function dragstart(thisx) {
            $xy_img.show();
            isMove = true;
            x = thisx - parseInt(handler.css('left'), 10);
            t1 = new Date();
        }
        var $xy_img = $("#xy_img");
        var arrayDate = new Array();//鼠标/手指移动轨迹
        /*
         *鼠标/手指在上下文移动时，
         *移动距离大于0小于最大间距
         *滑块x轴位置等于鼠标移动距离
         */
        handler.mousedown(function (e) { dragstart(e.pageX); });//鼠标按下
        handler.mousemove(function (e) { dragmoving(e.pageX); });//移动鼠标
        handler.mouseup(function (e) { dragmovend(e.pageX); });//松开鼠标
        handler.mouseout(function (e) { });//鼠标移出元素
        handler.on("touchstart", function (e) { dragstart(e.originalEvent.touches[0].pageX); });//手指按下
        handler.on("touchmove", function (e) { dragmoving(e.originalEvent.touches[0].pageX); });//手指移动
        handler.on("touchend", function (e) { dragmovend(e.originalEvent.changedTouches[0].pageX); });//手指松开
        //鼠标/手指移动过程
        function dragmoving(thisx) {
            var _x = thisx - x;
            if (isMove) {
                $xy_img.css({ 'left': _x });
                if (_x > 0 && _x <= maxWidth) {
                    $(".refesh_bg").hide();
                    handler.css({ 'left': _x });
                    drag_bg.css({ 'width': _x });
                    arrayDate.push([_x, new Date().getTime()]);
                }
                else if (_x > maxWidth) {  //鼠标指针移动距离达到最大时清空事件
                }
            }
        }
        //鼠标/手指移动结束
        function dragmovend(thisx) {
            isMove = false;
            if (isNaN(x) || x == undefined) {
                return;
            }
            var _x = thisx - x;
            if (_x < 10) {
                $(".refesh_bg").show();
                $xy_img.css({ 'left': 0 });
                handler.css({ 'left': 0 });
                drag_bg.css({ 'width': 0 });
                return;
            }
            t2 = new Date();
            $.ajax({ //校验
                type: "POST",
                url: "./VerificationCode.ashx?action=check",
                dataType: "json",
                async: false,
                data:
                {
                    point: _x,
                    timespan: (t2 - t1),
                    datelist: arrayDate.join("|")
                },
                success: function (result) {
                    if (result['state'] == 0) {
                        for (var i = 1; 4 >= i; i++) {
                            $xy_img.animate({ left: _x - (40 - 10 * i) }, 50);
                            $xy_img.animate({ left: _x + 2 * (40 - 10 * i) }, 50, function () {
                                $xy_img.css({ 'left': result['data'] });
                            });
                        }
                        handler.css({ 'left': maxWidth });
                        drag_bg.css({ 'width': maxWidth });
                        $xy_img.removeClass('xy_img_bord');
                        $xy_img.css("border", "1px solid rgb(255,255,255)");
                        dragOk();
                    } else {
                        $(".refesh_bg").show();
                        $xy_img.css({ 'left': 0 });
                        handler.css({ 'left': 0 });
                        drag_bg.css({ 'width': 0 });
                        if (result['msg'] > 6) __init();
                    }
                },
                beforeSend: function () {
                }
            })
        }
        //清空事件
        function dragOk() {
            handler.removeClass('handler_bg').addClass('handler_ok_bg');
            text.text('验证通过');
            drag.css({ 'color': '#fff' });
            handler.unbind('mousedown');
            $(document).unbind('mousemove');
            $(document).unbind('mouseup');
            $(".refesh_bg").hide();
            if (executename != '')
                window[executename]();
        }
    };
})(jQuery);