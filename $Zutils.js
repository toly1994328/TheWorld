$.fn.hello = function () {
    console.log(this);
};

//设置元素可拖拽
$.fn.canDrag = function (callback) {
    var $el = $(this);
    var mX = 0, mY = 0, isDrag = false;
    //鼠标按下
    $el.on('mousedown', function (e) {
        mX = e.pageX - $el[0].offsetLeft;//鼠标按下点与元素最左边距离
        mY = e.pageY - $el[0].offsetTop;//鼠标按下点与元素最右边距离
        isDrag = true;
    });
    //鼠标移动
    $el[0].onmousemove = function (ev) {
        var moveX = 0, moveY = 0;
        if (isDrag) {
            moveX = ev.pageX - mX;
            moveY = ev.pageY - mY;

            var innerWidth = window.innerWidth;
            var innerHeight = window.innerHeight;
            var elW = $el.innerWidth();
            var elH = $el.innerHeight();

            var maxY = innerHeight - elH;
            var maxX = innerWidth - elW;

            moveX = Math.min(maxX, Math.max(0, moveX));
            moveY = Math.min(maxY, Math.max(0, moveY));

            $el.css({
                left: moveX,
                top: moveY,
                cursor: "move"
            })
        }
        //拖拽回调函数
        if (callback && typeof(callback) === "function") {
            callback();
        }

    };
    //鼠标松开
    $el[0].onmouseup = function (ev) {
        isDrag = false;
    }
};

//动画封装方法
$.fn.anim = function (cssJson, callback) {
    var $el = $(this);
    var isOver = true;
    clearInterval($el[0].timer);
    $el[0].timer = setInterval(function () {
        for (var attr in cssJson) {
            var attrValue = parseFloat($el.css(attr));
            if (attr === 'opacity') {
                attrValue = Math.round(attrValue * 100);
            }
            var speed = (Math.round(cssJson[attr]) - attrValue) / 15;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (attrValue != Math.round(cssJson[attr])) {
                isOver = false;
            } else {
                isOver = true;
            }
            if (attr === 'opacity') {
                $el.css(attr, (attrValue + speed) / 100);
            } else {
                $el.css(attr, Math.ceil(attrValue + speed));
            }
        }
        if (isOver) {
            clearInterval($el[0].timer);
            if (callback && typeof(callback) === "function") {
                callback();
            }
        }
    }, 30);
};


/*****************************************************************/
/*****************************尺寸相关*****************************/
/*****************************************************************/
//元素在窗口尺寸变化时回调函数
$.onSizeChange = function (callback) {
    var timer = null;
    $(window).resize(function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
            //回调函数
            if (callback && typeof(callback) === "function") {
                callback();
            }
        }, 50);
    });
};

/**
 * 窗口变化时，元素中心居于屏幕中心
 */
$.fn.autoCenter = function () {
    var self = this;
    $(this).center();
    $.onSizeChange(function () {
        $(self).center();
    })
};

//元素自动于窗口宽高百分比处（窗口尺寸变化时亦可）
$.fn.autoInWin = function (perX, perY) {
    var self = this;
    $(this).inWindow();
    $.onSizeChange(function () {
        $(self).inWindow(perX, perY);
    })
};

//元素自动填满视口（窗口尺寸变化时亦可）
$.fn.autoFillWindow=function () {
    var self = this;
    $(this).fillWindow();
    $.onSizeChange(function () {
        $(self).fillWindow();
    })
},

/**
 * 元素中心居于屏幕中心
 */
$.fn.center = function () {
    var $el = $(this);
    var perW = (window.innerWidth / 2 - $el.outerWidth() / 2) / window.innerWidth;
    var perH = (window.innerHeight / 2 - $el.outerHeight() / 2) / window.innerHeight;
    $el.inWindow(perW, perH);
};

/**
 * 左上定点在屏幕宽高相应百分比处(包括边框)
 * @param perX
 * @param perY
 */
$.fn.inWindow = function (perX, perY) {
    $(this).offset({top: window.innerHeight * perY, left: window.innerWidth * perX});
};

/**
 * 元素的宽高变成分别屏幕宽高的百分比(包括边框)
 * @param perW
 * @param perH
 */
$.fn.perSize = function (perW, perH) {
    var $el = $(this);
    var borderW2 = $el.outerWidth() - $el.innerWidth();
    var borderH2 = $el.outerHeight() - $el.innerHeight();
    $el.css({
        width: (window.innerWidth - borderW2) * perW,
        height: (window.innerHeight - borderW2) * perH
    })
};

/**
 * 让元素居中占满屏(包括边框)
 */
$.fn.fillWindow = function () {
    var $el = $(this);
    $el.inWindow(0, 0);
    $el.perSize(1, 1);
};

/**
 * 获取元素左上角相对于屏幕的坐标
 * @returns {{x: *, y: *}}
 */
$.fn.getPos = function () {
    var $el = $(this);
    return {
        x: $el.offset().left,
        y: $el.offset().top
    };
};

/**
 * 获取元素尺寸(布局+边线+元素宽)
 * @returns {{x: *, y: *}}
 */
$.fn.getOutSize = function () {
    var $el = $(this);
    return {
        x: $el.outerWidth(),
        y: $el.outerHeight()
    };
};

/**
 * 设置元素相对文档的绝对位置
 */
$.fn.setPos = function ($el, x, y) {
    var $el = $(this);
    $el.offset({top: y, left: x});
};

/**
 * 获取窗口尺寸
 */
$.win = function () {
    return {
        w: window.innerWidth,
        h: window.innerHeight
    };
};

/*****************************************************************/
/*****************************辅助相关*****************************/
/*****************************************************************/
/**
 * 不选中元素（消除蓝色）
 */
$.fn.dontSelectEl = function () {
    document.onselectstart = new Function('event.returnValue=false');
};