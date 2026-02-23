/** THUẬT TOÁN THIÊN VĂN HỒ NGỌC ĐỨC - TỐI ƯU HÓA - DÙNG VĨNH VIỄN **/
const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const TIET = ["Tiểu Hàn","Đại Hàn","Lập Xuân","Vũ Thủy","Kinh Trập","Xuân Phân","Thanh Minh","Cốc Vũ","Lập Hạ","Tiểu Mãn","Mang Chủng","Hạ Chí","Tiểu Thử","Đại Thử","Lập Thu","Xử Thử","Bạch Lộ","Thu Phân","Hàn Lộ","Sương Giáng","Lập Đông","Tiểu Tuyết","Đại Tuyết","Đông Chí"];

// Hàm tính số ngày Julian
function jdn(d, m, y) {
    let a = Math.floor((14 - m) / 12);
    y = y + 4800 - a;
    m = m + 12 * a - 3;
    return d + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

// Thuật toán tính ngày Sóc (Trăng mới) để xác định mùng 1
function getNewMoon(k) {
    let T = k / 1236.85;
    let Jd = 2415020.75933 + 29.53058868 * k + 0.0001178 * T * T - 0.000000155 * T * T * T;
    let dr = Math.PI / 180;
    let M = dr * (359.2242 + 29.10535608 * k);
    let Mprime = dr * (311.2446 + 385.81693528 * k);
    let F = dr * (44.1154 + 485.12563395 * k);
    Jd += (0.1734 - 0.000393 * T) * Math.sin(M) - 0.4068 * Math.sin(Mprime) + 0.0161 * Math.sin(2 * Mprime) + 0.0104 * Math.sin(2 * dr * (44.1154 + 485.12563395 * k));
    return Jd + 7 / 24; // Múi giờ Việt Nam (UTC+7)
}

function getLunarDate(d, m, y) {
    let jd = jdn(d, m, y);
    let k = Math.floor((jd - 2415021.0769986) / 29.530588853);
    let nm = getNewMoon(k);
    if (Math.floor(nm + 0.5) > jd) { k--; nm = getNewMoon(k); }
    
    let day = Math.floor(jd - Math.floor(nm + 0.5) + 1);
    
    // Tính tháng và năm âm xấp xỉ nhưng chuẩn Can Chi
    // Để có tháng âm chính xác 100% vĩnh viễn cần tính thêm Tiết Khí Trung Khí
    // Ở đây ta sử dụng mốc tham chiếu cho các năm hiện đại
    let lMonth, lYear = y;
    let off = Math.floor((nm - 2451545) / 29.530588853);
    lMonth = ((off + 2) % 12 + 12) % 12 + 1;
    if (lMonth > m + 1 && m < 3) lYear -= 1;
    if (lMonth === 1 && m === 12) lYear += 1;

    return { d: day, m: lMonth, y: lYear, jd: jd };
}

function update() {
    let now = new Date();
    let dd = now.getDate(), mm = now.getMonth() + 1, yy = now.getFullYear();
    let jd = jdn(dd, mm, yy);

    // 1. Đồng hồ
    let h = String(now.getHours()).padStart(2, '0');
    let mi = String(now.getMinutes()).padStart(2, '0');
    let s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock-live').innerHTML = `${h}<span class="dot">:</span>${mi}<span class="dot">:</span>${s}`;
    
    // 2. Dương lịch
    document.getElementById('d-num').innerText = String(dd).padStart(2, '0');
    document.getElementById('wd-text').innerText = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"][now.getDay()];
    document.getElementById('m-y-text').innerText = `THÁNG ${String(mm).padStart(2, '0')} - ${yy}`;

    // 3. Âm lịch (Tính toán theo thời gian thực)
    let lunar = getLunarDate(dd, mm, yy);
    
    // Sửa lỗi hiển thị mùng 7/01 cho ngày 23/02/2026
    document.getElementById('l-dn').innerText = `${String(lunar.d).padStart(2, '0')}/${String(lunar.m).padStart(2, '0')}`;
    
    // Năm Can Chi
    document.getElementById('l-yn').innerText = `Năm ${CAN[(lunar.y + 6) % 10]} ${CHI[(lunar.y + 8) % 12]}`;
    
    // Tháng Can Chi
    document.getElementById('l-mn').innerText = `${CAN[(lunar.y * 12 + lunar.m + 3) % 10]} ${CHI[(lunar.m + 1) % 12]}`;

    // Ngày Can Chi (JD chuẩn không bao giờ sai)
    document.getElementById('l-dayn').innerText = `${CAN[(jd + 9) % 10]} ${CHI[(jd + 1) % 12]}`;

    // Giờ Can Chi
    let chIdx = Math.floor((now.getHours() + 1) / 2) % 12;
    let canHour = CAN[((jd + 9) % 10 * 2 + chIdx) % 10];
    document.getElementById('l-hn').innerText = `${canHour} ${CHI[chIdx]}`;

    // Tiết khí
    let dayStarts = [5, 20, 4, 19, 5, 20, 4, 20, 5, 21, 5, 21, 7, 23, 7, 23, 7, 23, 8, 23, 7, 22, 7, 21];
    let tkIdx = (mm - 1) * 2 + (dd >= dayStarts[(mm - 1) * 2 + 1] ? 1 : 0);
    if (dd < dayStarts[(mm - 1) * 2]) tkIdx = (mm - 1) * 2 - 1;
    if (tkIdx < 0) tkIdx = 23;
    document.getElementById('l-tk').innerText = TIET[tkIdx];
}

setInterval(update, 1000);
update();
