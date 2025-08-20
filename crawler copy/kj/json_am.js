var down_time = null; // 定义全局变量来存储定时器ID
var colorClassMap = {
    "red": "kj-lotto-red",
    "blue": "kj-lotto-blue",
    "green": "kj-lotto-green"
};

function fetchDataAndCache() {
    // 发起 GET 请求
    fetch('https://api.macaumarksix.com/api/live2')
      .then(response => response.json()) // 将响应转换为 JSON 格式
      .then(jsonData => {
            // 获取当前日期并加一天
            const currentDate = new Date(jsonData[0].openTime);
            currentDate.setDate(currentDate.getDate() + 1);

            const month = String(currentDate.getMonth() + 1); // 月份从0开始，所以要加1
            const day = String(currentDate.getDate()); // 获取日期

            // 将日期格式化为"月份,日期"的形式
            const formattedDate = month + ',' + day;
            // 将 jsonData[0].expect 的值加1
            const expectPlusOne = parseInt(jsonData[0].expect) + 1;

            // 去掉当期期数和下一期期数的年份
            const currentExpect = jsonData[0].expect.toString().substr(-3);
            const nextExpect = expectPlusOne.toString().substr(-3);

            // 添加额外的数据到 data
            const extraData = '\u65e5,21\u70b930\u5206';
            // 格式化数据
            const openCodeArray = jsonData[0].openCode.split(',');
            for (var i = 0; i < 7; i++) {
                if (isNaN(parseInt(openCodeArray[i]))) {
                    switch (i) {
                        case 0:
                            openCodeArray[i] = '即';
                            break;
                        case 1:
                            openCodeArray[i] = '将';
                            break;
                        case 2:
                            openCodeArray[i] = '开';
                            break;
                        case 3:
                            openCodeArray[i] = '将';
                            break;
                        case 4:
                            openCodeArray[i] = '请';
                            break;
                        case 5:
                            openCodeArray[i] = '稍';
                            break;
                        case 6:
                            openCodeArray[i] = '后';
                            break;
                        default:
                            break;
                    }
                }
            }

            var modifiedKValue = openCodeArray.join(',');

            // 构建包含格式化数据的对象
            const amJson1 = {
                data: currentExpect + ',' + modifiedKValue + ',' + nextExpect + ',' + formattedDate + ',' + extraData
            };

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
                $(".domain").text(hostname);
                $(".name").text(name);
                $(".Day").text(datas[10]);
                $(".Moon").text(datas[9]);
                $(".Nq").text(datas[8]);
                $(".Qi").text(datas[0]);
                $(".Time").text(datas[12]);

                // 正确计算星期几
                const year = new Date().getFullYear();
                const month = parseInt(datas[9]);
                const day = parseInt(datas[10]);
                const targetDate = new Date(year, month - 1, day);
                const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
                const weekDay = weekDays[targetDate.getDay()];
                $(".Week").text(weekDay);

                $(".Auto").text(data.data.Auto);
                for (var i = 0; i < 7; i++) {
                    var name_ = "#w" + i;
                    var namex_ = "#m" + i + "x";
                    $(name_).html(datas[i + 1] + "&nbsp;");
                    $(name_).attr("style", "color:#000");
                    // $(name_).addClass("kj-lotto-"+bose(datas[i+1]));
                    $(name_).removeClass("kj-lotto-red kj-lotto-blue kj-lotto-green");
                    if (!isNaN(parseInt(datas[i + 1]))) { // 新增判断，非数字不匹配五行和生肖
                        $(name_).addClass(colorClassMap[bose(datas[i + 1])]);
                        $(namex_).text(shengxiao(datas[i + 1]) + '/' + wuxing(datas[i + 1]));
                      //$(namex_).text(shengxiao(datas[i+1]));
                    } else {
                        $(namex_).text(''); // 非数字则不显示五行和生肖
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
            };

            $(function () {
                setContent(amJson1, "老 澳 彩");
            });

            // 显示时间
            function shwoTime(s) {
                let a = 0, b = 0, c = 0, d = 0;
                if (s > 0) {
                    d = Math.floor(s / 86400);
                    a = Math.floor(s / 3600 % 24);
                    b = Math.floor(s / 60 % 60);
                    c = Math.floor(s % 60);
                }
                d == 0 ? document.getElementById('day_show').style.display = 'none' : document.getElementById('day_show').textContent = d + "天";
                9 >= a && (a = "0" + a);
                9 >= b && (b = "0" + b);
                9 >= c && (c = "0" + c);
                document.getElementById('hour_show').textContent = a;
                document.getElementById('minute_show').textContent = b;
                document.getElementById('second_show').textContent = c;
            }

            function stepTimer(stamp) {
                document.getElementById('down-show').innerHTML = '<strong id="day_show">0天</strong><strong id="hour_show">0</strong>:<strong id="minute_show">0</strong>:<strong id="second_show">0</strong>';
                var f = stamp - (new Date).getTime() / 1E3;
                shwoTime(f);
                if (f >= 0) {
                    down_time = window.clearInterval(down_time); //停止计时器
                    down_time = setInterval(function () {
                        f--;
                        shwoTime(f);
                        if (f <= 0) {
                            clearInterval(down_time);
                            // 当倒计时为0时，修改1 - 7号位置的内容
                            for (var i = 0; i < 7; i++) {
                                var name_ = "#w" + i;
                                var namex_ = "#m" + i + "x";
                                $(name_).html(['即', '将', '开', '奖', '请', '稍', '后'][i] + "&nbsp;");
                                $(name_).removeClass("kj-lotto-red kj-lotto-blue kj-lotto-green");
                                $(namex_).text('');
                            }
                        }
                    }, 1E3);
                }
            }
            // 打印格式化后的数据
            // console.log('var amJson1=' + JSON.stringify(amJson1) + ';');
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

    if (hours === 21 && minutes >= 30 && minutes <= 36) {
        fetchDataAndCache();
        //console.log("当前时间：" + now.toLocaleString() + "，符合规定时间，执行请求");
    }
}

// 每秒钟检查一次时间是否符合规定时间
setInterval(checkAndFetchData, 3000);

// 页面加载完成后，运行一次定时器函数，以便立即检查当前时间
document.addEventListener('DOMContentLoaded', checkAndFetchData);