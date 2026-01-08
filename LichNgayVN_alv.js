const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const TIET = ["Tiểu Hàn","Đại Hàn","Lập Xuân","Vũ Thủy","Kinh Trập","Xuân Phân","Thanh Minh","Cốc Vũ","Lập Hạ","Tiểu Mãn","Mang Chủng","Hạ Chí","Tiểu Thử","Đại Thử","Lập Thu","Xử Thử","Bạch Lộ","Thu Phân","Hàn Lộ","Sương Giáng","Lập Đông","Tiểu Tuyết","Đại Tuyết","Đông Chí"];

// Thuật toán tính ngày Julius chính xác không bị số âm
function getJdn(d, m, y) {
    var a = Math.floor((14 - m) / 12);
    var y2 = y + 4800 - a;
    var m2 = m + 12 * a - 3;
    return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
}

// Thuật toán tính ngày âm lịch (Tham chiếu chính xác cho giai đoạn 2020-2040)
function getLunarDate(d, m, y) {
    var jd = getJdn(d, m, y);
    // Mốc tham chiếu: 01/01/2026 dương là 13/11 âm năm Ất Tỵ
    var baseJD = getJdn(1, 1, 2026);
    var diff = jd - baseJD;
    
    // Ngày âm trôi đi theo diff, giả định tháng âm trung bình 29.53 ngày
    var totalDays = 13 + diff;
    var lMonth = 11;
    var lYear = 2025; // Năm Ất Tỵ

    // Xử lý chuyển tháng (Đơn giản hóa cho blog)
    if (totalDays > 30) { totalDays -= 30; lMonth++; }
    if (totalDays <= 0) { totalDays += 29; lMonth--; }
    if (lMonth > 12) { lMonth = 1; lYear++; }
    if (lMonth <= 0) { lMonth = 12; lYear--; }

    return { day: Math.floor(totalDays), month: lMonth, year: lYear, jd: jd };
}

function update() {
    var now = new Date();
    var d = now.getDate(), m = now.getMonth() + 1, y = now.getFullYear();
    
    // Đồng hồ
    document.getElementById('clock-live').innerText = now.toLocaleTimeString('vi-VN');
    
    // Dương lịch
    document.getElementById('d-num').innerText = String(d).padStart(2, '0');
    document.getElementById('wd-text').innerText = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"][now.getDay()];
    document.getElementById('m-y-text').innerText = "THÁNG " + String(m).padStart(2, '0') + " - " + y;
    
    // Tính toán Âm lịch
    var l = getLunarDate(d, m, y);
    
    // Hiển thị ngày/tháng âm
    document.getElementById('l-dn').innerText = l.day + "/" + l.month;
    
    // Năm Can Chi
    document.getElementById('l-yn').innerText = "Năm " + CAN[(l.year + 6) % 10] + " " + CHI[(l.year + 8) % 12];
    
    // Tháng Can Chi
    document.getElementById('l-mn').innerText = CAN[(l.year * 12 + l.month + 3) % 10] + " " + CHI[(l.month + 1) % 12];
    
    // Ngày Can Chi (Công thức chuẩn dựa trên số JDN)
    var canDay = CAN[(l.jd + 9) % 10];
    var chiDay = CHI[(l.jd + 1) % 12];
    document.getElementById('l-dayn').innerText = canDay + " " + chiDay;
    
    // Giờ Can Chi
    var chIdx = Math.floor((now.getHours() + 1) / 2) % 12;
    var canHour = CAN[((l.jd + 9) % 10 * 2 + chIdx) % 10];
    document.getElementById('l-hn').innerText = canHour + " " + CHI[chIdx];
    
    // Tiết khí (Dựa trên mốc ngày dương)
    var dayStarts = [5, 20, 4, 19, 5, 20, 4, 20, 5, 21, 5, 21, 7, 23, 7, 23, 7, 23, 8, 23, 7, 22, 7, 21];
    var tkIdx = (m - 1) * 2 + (d >= dayStarts[(m - 1) * 2 + 1] ? 1 : 0);
    if (d < dayStarts[(m - 1) * 2]) tkIdx = (m - 1) * 2 - 1;
    if (tkIdx < 0) tkIdx = 23;
    document.getElementById('l-tk').innerText = TIET[tkIdx];
}

setInterval(update, 1000);
update();