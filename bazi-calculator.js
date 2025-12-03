// BaZi (Eight Characters) Calculator
// Calculates the Four Pillars of Destiny

const BaZiCalculator = (function () {
    'use strict';

    // Heavenly Stems (天干)
    const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

    // Earthly Branches (地支)
    const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    // Five Elements (五行)
    const elements = {
        '甲': '木', '乙': '木',
        '丙': '火', '丁': '火',
        '戊': '土', '己': '土',
        '庚': '金', '辛': '金',
        '壬': '水', '癸': '水',
        '子': '水', '丑': '土', '寅': '木', '卯': '木',
        '辰': '土', '巳': '火', '午': '火', '未': '土',
        '申': '金', '酉': '金', '戌': '土', '亥': '水'
    };

    // Yin Yang (陰陽)
    const yinYang = {
        '甲': '陽', '乙': '陰',
        '丙': '陽', '丁': '陰',
        '戊': '陽', '己': '陰',
        '庚': '陽', '辛': '陰',
        '壬': '陽', '癸': '陰',
        '子': '陽', '丑': '陰', '寅': '陽', '卯': '陰',
        '辰': '陽', '巳': '陰', '午': '陽', '未': '陰',
        '申': '陽', '酉': '陰', '戌': '陽', '亥': '陰'
    };

    // Count elements in BaZi
    function countElements(bazi) {
        const count = {
            '木': 0,
            '火': 0,
            '土': 0,
            '金': 0,
            '水': 0
        };

        // Count from all four pillars
        ['year', 'month', 'day', 'hour'].forEach(pillar => {
            const stem = bazi[pillar].stem;
            const branch = bazi[pillar].branch;
            count[elements[stem]]++;
            count[elements[branch]]++;
        });

        return count;
    }

    // Get dominant element
    function getDominantElement(elementCount) {
        let maxCount = 0;
        let dominant = [];

        for (const [element, count] of Object.entries(elementCount)) {
            if (count > maxCount) {
                maxCount = count;
                dominant = [element];
            } else if (count === maxCount && count > 0) {
                dominant.push(element);
            }
        }

        return dominant;
    }

    // Get lacking element
    function getLackingElement(elementCount) {
        const lacking = [];

        for (const [element, count] of Object.entries(elementCount)) {
            if (count === 0) {
                lacking.push(element);
            }
        }

        return lacking;
    }

    // Get element balance analysis
    function getElementBalance(elementCount) {
        const total = Object.values(elementCount).reduce((a, b) => a + b, 0);
        const balance = {};

        for (const [element, count] of Object.entries(elementCount)) {
            balance[element] = {
                count: count,
                percentage: Math.round((count / total) * 100),
                status: count === 0 ? '缺' : count >= 3 ? '旺' : '平'
            };
        }

        return balance;
    }

    // Get day master (日主) strength
    function getDayMasterStrength(bazi, elementCount) {
        const dayMaster = bazi.day.stem;
        const dayElement = elements[dayMaster];

        // Simplified strength calculation
        const sameElementCount = elementCount[dayElement];
        const supportElements = getSupportingElements(dayElement);
        const supportCount = supportElements.reduce((sum, el) => sum + elementCount[el], 0);

        const strength = sameElementCount + supportCount * 0.5;

        if (strength >= 4) return '強';
        if (strength >= 2.5) return '中';
        return '弱';
    }

    // Get supporting elements
    function getSupportingElements(element) {
        const support = {
            '木': ['水'],
            '火': ['木'],
            '土': ['火'],
            '金': ['土'],
            '水': ['金']
        };
        return support[element] || [];
    }

    // Get controlling elements
    function getControllingElements(element) {
        const control = {
            '木': ['金'],
            '火': ['水'],
            '土': ['木'],
            '金': ['火'],
            '水': ['土']
        };
        return control[element] || [];
    }

    // Calculate monthly pillars for a specific year (for monthly fortune)
    function getMonthlyPillars(year) {
        const monthlyPillars = [];
        const yearStemIndex = (year - 4) % 10;

        // Month stem base calculation
        let monthStemBase;
        if (yearStemIndex === 0 || yearStemIndex === 5) monthStemBase = 2;  // 甲己年丙作首
        else if (yearStemIndex === 1 || yearStemIndex === 6) monthStemBase = 4;  // 乙庚年戊為頭
        else if (yearStemIndex === 2 || yearStemIndex === 7) monthStemBase = 6;  // 丙辛年庚寅求
        else if (yearStemIndex === 3 || yearStemIndex === 8) monthStemBase = 8;  // 丁壬年壬寅順
        else monthStemBase = 0;  // 戊癸年甲寅居

        for (let month = 1; month <= 12; month++) {
            const monthStemIndex = (monthStemBase + month - 1) % 10;
            const monthBranchIndex = (month + 1) % 12;

            monthlyPillars.push({
                month: month,
                stem: heavenlyStems[monthStemIndex],
                branch: earthlyBranches[monthBranchIndex],
                element: elements[heavenlyStems[monthStemIndex]]
            });
        }

        return monthlyPillars;
    }

    return {
        countElements,
        getDominantElement,
        getLackingElement,
        getElementBalance,
        getDayMasterStrength,
        getMonthlyPillars,
        elements,
        yinYang
    };
})();
