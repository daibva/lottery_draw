var down_time = null; // 定义全局变量来存储定时器ID
var colorClassMap = {
    "red": "kj-lotto-red",
    "blue": "kj-lotto-blue",
    "green": "kj-lotto-green"
};

function fetchDataAndCache() {
    // 发起 GET 请求https://8777kj.vip/kj.json   https://ws4.servers01.com/hk_kj.json  https://193644.com/hk_kj.json
    fetch('https://ws2.servers01.com/hk_kj.json')
      .then(response => response.json())
      .then(data => {
            var kValue = data.k;
            var kArray = kValue.split(',');

            var modifiedKValue = kArray.join(',');
            var hkJson = { "data": modifiedKValue };

            var shengxiao = function (n) {
                n = parseInt(n) - 1;
                var xiao = ['蛇', '龍', '兔', '虎', '牛', '鼠', '豬', '狗', '雞', '猴', '羊', '馬', '蛇', '龍', '兔', '虎', '牛', '鼠', '豬', '狗', '雞', '猴', '羊', '馬', '蛇', '龍', '兔', '虎', '牛', '鼠', '豬', '狗', '雞', '猴', '羊', '馬', '蛇', '龍', '兔', '虎', '牛', '鼠', '豬', '狗', '雞', '猴', '羊', '馬', '蛇'];
                return xiao[n];
            };
            var wuxing = function (n) {
                n = parseInt(n) - 1;
                var xing = ['火', '火', '金', '金', '土', '土', '木', '木', '火', '火', '金', '金', '水', '水', '木', '木', '火', '火', '土', '土', '水', '水', '木', '木', '金', '金', '土', '土', '水', '水', '火', '火', '金', '金', '土', '土', '木', '木', '火', '火', '金', '金', '水', '水', '木', '木', '火', '火', '土'];
                return xing[n];
            };
            var bose = function (n) {
                n = parseInt(n) - 1;
                var boseArr = ['red', 'red', 'blue', 'blue', 'green', 'green', 'red', 'red', 'blue', 'blue', 'green', 'red', 'red', 'blue', 'blue', 'green', 'green', 'red', 'red', 'blue', 'green', 'green', 'red', 'red', 'blue', 'blue', 'green', 'green', 'red', 'red', 'blue', 'green', 'green', 'red', 'red', 'blue', 'blue', 'green', 'green', 'red', 'blue', 'blue', 'green', 'green', 'red', 'red', 'blue', 'blue', 'green'];
                return boseArr[n];
            }
            var setContent = function (data, name) {
                var hostname = document.location.hostname;
                var datas = data.data.split(",");

                // 去掉当前开奖期数的年份
                if (datas[0].length > 4) {
                    datas[0] = datas[0].substring(4);
                }

                // 去掉下一期期数的年份
                if (datas[8].length > 4) {
                    datas[8] = datas[8].substring(4);
                }

                $(".domain").text(hostname);
                $(".name").text(name);
                $(".Day").text(datas[10]);
                $(".Moon").text(datas[9]);
                $(".Nq").text(datas[8]);
                $(".Qi").text(datas[0]);
                $(".Time").text(datas[12]);
                $(".Week").text(datas[11]);
                $(".Auto").text(data.data.Auto);

                var message = '即将开奖请稍后'.split('');
                for (var i = 0; i < 7; i++) {
                    var name_ = "#w" + i;
                    var namex_ = "#m" + i + "x";
                    var num = parseInt(datas[i + 1]);
                    if (isNaN(num) || num < 1 || num > 49) {
                        // 如果不是 01 - 49 的数字，显示“即将开奖请稍后”
                        $(name_).html(message[i] + "&nbsp;");
                        $(name_).attr("style", "color:#000");
                        $(name_).removeClass("kj-lotto-red kj-lotto-blue kj-lotto-green");
                        $(namex_).text('');
                    } else {
                        $(name_).html(datas[i + 1] + "&nbsp;");
                        $(name_).attr("style", "color:#000");
                        $(name_).removeClass("kj-lotto-red kj-lotto-blue kj-lotto-green");
                        $(name_).addClass(colorClassMap[bose(datas[i + 1])]);
                        $(namex_).text(shengxiao(datas[i + 1]) + '/' + wuxing(datas[i + 1]));
                    }
                }

                var y = new Date().getFullYear();
                var m_ = new Date().getMonth() + 1;
                var m = parseInt(datas[9]);
                if (m == 1 && m_ == 12) {
                    y++;
                }
                var date_ = y + "/" + datas[9] + "/" + datas[10] + " " + datas[12].replace("点", ":").replace("分", "") + ":00";
                var time = new Date(date_).getTime() / 1000;
                stepTimer(time);
            }

            $(function () {
                setContent(hkJson, "香 港 彩");
            });

            // 显示时间
            function shwoTime(s) {
                let a = 0, b = 0, c = 0;
                if (s > 0) {
                    // 将天数转换为小时数
                    a = Math.floor(s / 3600);
                    b = Math.floor(s / 60 % 60);
                    c = Math.floor(s % 60);
                }
                9 >= a && (a = "0" + a);
                9 >= b && (b = "0" + b);
                9 >= c && (c = "0" + c);
                document.getElementById('hour_show').textContent = a;
                document.getElementById('minute_show').textContent = b;
                document.getElementById('second_show').textContent = c;
                // 隐藏天数显示
                document.getElementById('day_show').style.display = 'none';
            }

            function stepTimer(stamp) {
                document.getElementById('down-show').innerHTML = '<strong id="day_show">0天</strong><strong id="hour_show">0</strong>:<strong id="minute_show">0</strong>:<strong id="second_show">0</strong>';
                var f = stamp - (new Date).getTime() / 1E3;
                if (f < 0) {
                    // 如果时间已经过去，不开启倒计时
                    return;
                }
                shwoTime(f);
                if (f >= 0) {
                    down_time = window.clearInterval(down_time); //停止计时器
                    down_time = setInterval(function () {
                        f--;
                        shwoTime(f);
                        if (f <= 0) {
                            clearInterval(down_time);
                            // 当倒计时为 0 时，显示“即将开奖请稍后”
                            var message = '马上开奖请稍后'.split('');
                            for (var i = 0; i < 7; i++) {
                                var name_ = "#w" + i;
                                var namex_ = "#m" + i + "x";
                                $(name_).html(message[i] + "&nbsp;");
                                $(name_).removeClass("kj-lotto-red kj-lotto-blue kj-lotto-green");
                                $(namex_).text('');
                            }
                            // 倒计时结束后重新获取数据并计算倒计时
                            setTimeout(fetchDataAndCache, 1000);
                        }
                    }, 1E3);
                }
            }
        })
      .catch(error => {
            console.error('请求出错:', error);
        });
}

// 页面加载时请求一次数据
fetchDataAndCache();
//console.log("第一次请求");
// 定时器函数
function checkAndFetchData() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    if (hours === 21 && minutes >= 30 && minutes <= 35) {
        fetchDataAndCache();
        //console.log("当前时间：" + now.toLocaleString() + "，符合规定时间，执行请求");
    }
}

// 每秒钟检查一次时间是否符合规定时间
setInterval(checkAndFetchData, 3000);

// 页面加载完成后，运行一次定时器函数，以便立即检查当前时间
document.addEventListener('DOMContentLoaded', checkAndFetchData);
    