// 设置起始时间为 2025 年 1 月 1 日中午 12 点
var startQishu = 1;
var startDate = new Date(2025, 0, 1, 12, 0, 0); // 注意：1 月是 0 月

function getCurrentQishu() {
    var now = new Date();

    // 如果当前还没到中午 12 点，则视为“昨天的期数”
    if (now.getHours() < 12) {
        now.setDate(now.getDate() - 1);
    }

    // 统一设置为中午 12 点，避免小时差引起的误差
    var currentNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);

    // 计算从起始日中午到当前中午的天数差
    var diffDays = Math.round((currentNoon - startDate) / (1000 * 60 * 60 * 24));

    // 返回当前期数
    return startQishu + diffDays;
}

// 调用并输出当前期数
var qishu = getCurrentQishu();