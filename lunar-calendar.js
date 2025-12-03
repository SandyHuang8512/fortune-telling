// Lunar Calendar Conversion Library
// Supports years 1900-2100

const LunarCalendar = (function() {
    'use strict';

    // Lunar calendar data (1900-2100)
    // Each element represents a year's lunar month data
    const lunarInfo = [
        0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
        0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
        0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
        0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
        0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
        0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
        0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
        0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
        0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
        0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
        0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
        0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
        0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
        0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
        0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
        0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
        0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
        0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
        0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
        0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
        0x0d520,0x0d520
    ];

    // Heavenly Stems (天干)
    const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    
    // Earthly Branches (地支)
    const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // Chinese zodiac animals
    const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];
    
    // Lunar months
    const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '臘'];

    // Get leap month for a lunar year
    function leapMonth(year) {
        return lunarInfo[year - 1900] & 0xf;
    }

    // Get days in a lunar year
    function lunarYearDays(year) {
        let sum = 348;
        for (let i = 0x8000; i > 0x8; i >>= 1) {
            sum += (lunarInfo[year - 1900] & i) ? 1 : 0;
        }
        return sum + leapDays(year);
    }

    // Get days in leap month
    function leapDays(year) {
        if (leapMonth(year)) {
            return (lunarInfo[year - 1900] & 0x10000) ? 30 : 29;
        }
        return 0;
    }

    // Get days in a lunar month
    function monthDays(year, month) {
        return (lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29;
    }

    // Convert solar date to lunar date
    function solarToLunar(solarYear, solarMonth, solarDay) {
        const baseDate = new Date(1900, 0, 31);
        const objDate = new Date(solarYear, solarMonth - 1, solarDay);
        let offset = Math.floor((objDate - baseDate) / 86400000);

        let lunarYear, lunarMonth, lunarDay;
        let temp = 0;
        
        for (lunarYear = 1900; lunarYear < 2101 && offset > 0; lunarYear++) {
            temp = lunarYearDays(lunarYear);
            offset -= temp;
        }

        if (offset < 0) {
            offset += temp;
            lunarYear--;
        }

        const leap = leapMonth(lunarYear);
        let isLeap = false;

        for (lunarMonth = 1; lunarMonth < 13 && offset > 0; lunarMonth++) {
            if (leap > 0 && lunarMonth === (leap + 1) && !isLeap) {
                --lunarMonth;
                isLeap = true;
                temp = leapDays(lunarYear);
            } else {
                temp = monthDays(lunarYear, lunarMonth);
            }

            if (isLeap && lunarMonth === (leap + 1)) {
                isLeap = false;
            }

            offset -= temp;
        }

        if (offset === 0 && leap > 0 && lunarMonth === leap + 1) {
            if (isLeap) {
                isLeap = false;
            } else {
                isLeap = true;
                --lunarMonth;
            }
        }

        if (offset < 0) {
            offset += temp;
            --lunarMonth;
        }

        lunarDay = offset + 1;

        return {
            year: lunarYear,
            month: lunarMonth,
            day: lunarDay,
            isLeap: isLeap
        };
    }

    // Convert lunar date to solar date
    function lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeap = false) {
        const leap = leapMonth(lunarYear);
        let offset = 0;

        for (let i = 1900; i < lunarYear; i++) {
            offset += lunarYearDays(i);
        }

        let isLeapMonth = false;
        for (let i = 1; i < lunarMonth; i++) {
            if (leap > 0 && i === leap + 1 && !isLeapMonth) {
                --i;
                isLeapMonth = true;
                offset += leapDays(lunarYear);
            } else {
                offset += monthDays(lunarYear, i);
            }

            if (isLeapMonth && i === leap + 1) {
                isLeapMonth = false;
            }
        }

        if (isLeap) {
            offset += monthDays(lunarYear, lunarMonth);
        }

        offset += lunarDay - 1;

        const baseDate = new Date(1900, 0, 31);
        const resultDate = new Date(baseDate.getTime() + offset * 86400000);

        return {
            year: resultDate.getFullYear(),
            month: resultDate.getMonth() + 1,
            day: resultDate.getDate()
        };
    }

    // Get year's Gan Zhi (干支)
    function getYearGanZhi(year) {
        const ganIndex = (year - 4) % 10;
        const zhiIndex = (year - 4) % 12;
        return heavenlyStems[ganIndex] + earthlyBranches[zhiIndex];
    }

    // Get zodiac animal
    function getZodiac(year) {
        return zodiacAnimals[(year - 4) % 12];
    }

    // Generate year options for select
    function generateYearOptions() {
        const years = [];
        for (let year = 1900; year <= 2100; year++) {
            years.push({
                value: year,
                label: `${year}年 (${getYearGanZhi(year)}${getZodiac(year)}年)`
            });
        }
        return years;
    }

    // Generate month options
    function generateMonthOptions() {
        const months = [];
        for (let month = 1; month <= 12; month++) {
            months.push({
                value: month,
                label: `${lunarMonths[month - 1]}月 (${month}月)`
            });
        }
        return months;
    }

    // Generate day options
    function generateDayOptions(year, month) {
        const days = [];
        const maxDays = monthDays(year, month);
        for (let day = 1; day <= maxDays; day++) {
            days.push({
                value: day,
                label: `${day}日`
            });
        }
        return days;
    }

    return {
        solarToLunar,
        lunarToSolar,
        getYearGanZhi,
        getZodiac,
        generateYearOptions,
        generateMonthOptions,
        generateDayOptions,
        heavenlyStems,
        earthlyBranches,
        zodiacAnimals
    };
})();
