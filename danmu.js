/*!
 * canvas 播放器弹幕 - v1.0.x (2016-12-12)
 * Anthor tubiao.haung
 * Copyright 2016 qf.com.cn
 */
define(function(require, exports, module) { 'use strict';

    var $ = require('dom/1.0.x/');

    var canvas = null,
        ctx = null;

    // 弹幕队列
    var textArr = [];
    // 每一句弹幕的上边距离canvas上边的距离
    var numArrT = [];
    // 每一句弹幕的左边距离canvas左边的距离
    var numArrL = [];
    // 每一句弹幕的颜色
    var colorArr = [];
    // 存储已占用的管道
    var randomArr = [];
    // 用于防止弹幕重叠，被使用的管道不允许再次使用(记住 frontRandom 要小于 minPips)
    var frontRandom = 6;
    // 最小弹幕数时管道数(靠近屏幕最上方)
    var minPipes = 7;
    // 最多弹幕数时管道数
    var _maxPipes;

    // 弹幕颜色库
    var colorArrStore = ["pink", "white", "white", "white", "pink", "white", "pink", "white", "pink", "white",
    "white", "pink", "white", "pink", "white", "white", "pink", "white", "pink", "white"];

    /*
     * @param {string} opts.canvasId  canvas画布id
     * @param {int} opts.playerW  播放器的宽度
     * @param {int} opts.width  canvas的宽度
     * @param {int} opts.height  canvas的高度
     */
    var Danmu = function(opts) {
        this.playerW = opts.playerW;
        this.maxPipes = opts.maxPipes;

        canvas = document.getElementById(opts.canvasId);
        ctx = canvas.getContext("2d");
        canvas.width = opts.width;
        canvas.height = opts.height;
        ctx.font = "20px Courier New";
    };

    Danmu.prototype = {
        bomb: function() {
            var _this = this;

            setInterval(function() {
                //清理一下canvas画布
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();

                //初始化每一句弹幕到canvas上以及弹幕的颜色、每一句弹幕的移动速度
                //判断每一句弹幕走出canvas后清除
                for (var j = 0; j < textArr.length; j++) {
                    numArrL[j] -= (1.5 + (j * 0.05));
                    ctx.fillStyle = colorArr[j];
                    ctx.fillText(textArr[j], numArrL[j], numArrT[j]);

                    if (numArrL[j] <= -600) {
                        textArr.splice(j, 1);
                        colorArr.splice(j, 1);
                        numArrL.splice(j, 1);
                        numArrT.splice(j, 1);
                    }
                }
                ctx.restore();
            }, 20)
        },
        pushText: function(danmuText) {
            var _this = this,
                random;

            // 使弹幕靠最上方显示
            if (textArr.length >= 0 && textArr.length <= minPipes) {
                _maxPipes = minPipes + 1;
            } else if (textArr.length >= minPipes + 1 && textArr.length <= minPipes * 2) {
                _maxPipes = minPipes * 2 + 1;
            } else {
                _maxPipes = _this.maxPipes;
            }

            function createRandom() {
                random = parseInt(Math.random()*(_maxPipes - 1) + 1);  //生成1~maxPipes的随机整数
                if (_this.hadRandom(random)) {
                    createRandom();
                } else {
                    textArr.push(danmuText);
                    numArrL.push(_this.playerW);
                    numArrT.push(20 * random);
                    colorArr.push(colorArrStore[random]);
                    randomArr.push(random);
                    if (randomArr.length > frontRandom) {
                        randomArr = randomArr.slice(randomArr.length - frontRandom, randomArr.length);
                    }
                }
            }

            createRandom();
        },
        // 判断前5个弹幕的管道是否使用，避免管道重叠
        hadRandom: function(random) {
            for (var i in randomArr) {
                if (randomArr[i] === random) return true;
            }
            return false;
        },
        start: function() {

        },
        stop: function() {
            // 方案一，通过设置display
            // 方案二，清空textArr，在房间组播事件另设置一个标识
        }
    };

    return Danmu;

});

// 调用
// if (danmu === null) {
//     danmu = new Danmu({
//         canvasId: "qfDanmu",
//         playerW: 800,
//         width: 800,
//         height: 450,
//         maxPipes: 21
//     });
//     danmu.bomb();
// }
// danmu.pushText(iptVal);
