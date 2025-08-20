var down_time = null;
var colorClassMap = {
    "red": "kj-lotto-red",
    "blue": "kj-lotto-blue",
    "green": "kj-lotto-green"
};

function fetchDataAndCache() {
    fetch('../api/newxam.php')
      .then(response => response.json())
      .then(jsonData => {
        const currentDate = new Date(jsonData[0].openTime);
        currentDate.setDate(currentDate.getDate() + 1);
        const month = String(currentDate.getMonth() + 1);
        const day = String(currentDate.getDate());
        const formattedDate = month + ',' + day;
        const expectPlusOne = parseInt(jsonData[0].expect) + 1;
        const currentExpect = jsonData[0].expect.toString().substr(-3);
        const nextExpect = expectPlusOne.toString().substr(-3);
        const extraData = '\u65e5,23\u70b930\u5206';

        const openCodeArray = jsonData[0].openCode.split(',');
        for (var i = 0; i < 7; i++) {
            var num = parseInt(openCodeArray[i]);
            if (isNaN(num) || num <= 0) {
                openCodeArray[i] = ['即', '将', '开', '奖', '请', '稍', '后'][i];
            }
        }

        var modifiedKValue = openCodeArray.join(',');

        const amJson1 = {
            data: currentExpect + ',' + modifiedKValue + ',' + nextExpect + ',' + formattedDate + ',' + extraData
        };

        var shengxiao = function(n) {
            n = parseInt(n);
            if (isNaN(n) || n < 1 || n > 49) return '';
            var xiao = ['蛇','龙','兔','虎','牛','鼠','猪','狗','鸡','猴','羊','马','蛇','龙','兔','虎','牛','鼠','猪','狗','鸡','猴','羊','马','蛇','龙','兔','虎','牛','鼠','猪','狗','鸡','猴','羊','马','蛇','龙','兔','虎','牛','鼠','猪','狗','鸡','猴','羊','马','蛇'];
            return xiao[n - 1];
        };

        var wuxing = function(n) {
            n = parseInt(n);
            if (isNaN(n) || n < 1 || n > 49) return '';
            var xing = ['火','火','金','金','土','土','木','木','火','火','金','金','水','水','木','木','火','火','土','土','水','水','木','木','金','金','土','土','水','水','火','火','金','金','土','土','木','木','火','火','金','金','水','水','木','木','火','火','土'];
            return xing[n - 1];
        };

        var bose = function(n) {
            n = parseInt(n);
            if (isNaN(n) || n < 1 || n > 49) return '';
            var boseArr = ['red','red','blue','blue','green','green','red','red','blue','blue','green','red','red','blue','blue','green','green','red','red','blue','green','green','red','red','blue','blue','green','green','red','red','blue','green','green','red','red','blue','blue','green','green','red','blue','blue','green','green','red','red','blue','blue','green'];
            return boseArr[n - 1];
        }

        var setContent = function(data, name) {
            var hostname = document.location.hostname;
            var datas = data.data.split(",");
            $(".domain").text(hostname);
            $(".name").text(name);
            $(".Day").text(datas[10]);
            $(".Moon").text(datas[9]);
            $(".Nq").text(datas[8]);
            $(".Qi").text(datas[0]);
            $(".Time").text(datas[12]);

            const year = new Date().getFullYear();
            const month = parseInt(datas[9]);
            const day = parseInt(datas[10]);
            const targetDate = new Date(year, month - 1, day);
            const weekDays = ['日','一','二','三','四','五','六'];
            $(".Week").text(weekDays[targetDate.getDay()]);

            $(".Auto").text(data.data.Auto);
            for (var i = 0; i < 7; i++) {
                var name_ = "#w" + i;
                var namex_ = "#m" + i + "x";
                $(name_).html(datas[i + 1] + "&nbsp;");
                $(name_).removeClass("kj-lotto-red kj-lotto-blue kj-lotto-green");
                var num = parseInt(datas[i + 1]);
                if (!isNaN(num) && num >= 1 && num <= 49) {
                    $(name_).addClass(colorClassMap[bose(num)]);
                    $(namex_).text(shengxiao(num) + '/' + wuxing(num));
                } else {
                    $(namex_).text('');
                }
            }

            var y = new Date().getFullYear();
            var m_ = new Date().getMonth() + 1;
            var m = parseInt(datas[9]);
            if (m == 1 && m_ == 12) y++;
            var date_ = y + "/" + datas[9] + "/" + datas[10] + " " + datas[12].replace("点", ":").replace("分", "") + ":00";
            var time = new Date(date_).getTime() / 1000;
            stepTimer(time);
        };

        $(function () {
            setContent(amJson1, "新 澳 彩");
        });

        function shwoTime(s) {
            let d = 0, a = 0, b = 0, c = 0;
            if (s > 0) {
                d = Math.floor(s / 86400);
                a = Math.floor(s / 3600 % 24);
                b = Math.floor(s / 60 % 60);
                c = Math.floor(s % 60);
            }
            d == 0 ? document.getElementById('day_show').style.display = 'none' : document.getElementById('day_show').textContent = d + "天";
            document.getElementById('hour_show').textContent = a < 10 ? '0' + a : a;
            document.getElementById('minute_show').textContent = b < 10 ? '0' + b : b;
            document.getElementById('second_show').textContent = c < 10 ? '0' + c : c;
        }

        function stepTimer(stamp) {
            document.getElementById('down-show').innerHTML = '<strong id="day_show">0天</strong><strong id="hour_show">0</strong>:<strong id="minute_show">0</strong>:<strong id="second_show">0</strong>';
            var f = stamp - new Date().getTime() / 1000;
            shwoTime(f);
            if (f >= 0) {
                clearInterval(down_time);
                down_time = setInterval(function () {
                    f--;
                    shwoTime(f);
                    if (f <= 0) {
                        clearInterval(down_time);
                        for (var i = 0; i < 7; i++) {
                            var name_ = "#w" + i;
                            var namex_ = "#m" + i + "x";
                            $(name_).html(['即','将','开','奖','请','稍','后'][i] + "&nbsp;");
                            $(name_).removeClass("kj-lotto-red kj-lotto-blue kj-lotto-green");
                            $(namex_).text('');
                        }
                    }
                }, 1000);
            }
        }

      })
      .catch(error => {
        console.error('请求出错:', error);
      });
}

fetchDataAndCache();

function checkAndFetchData() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    if (hours === 23 && minutes >= 25 && minutes <= 40) {
        fetchDataAndCache();
    }
}

setInterval(checkAndFetchData, 3000);
document.addEventListener('DOMContentLoaded', checkAndFetchData);