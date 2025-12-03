// Main Application Logic
// Handles form submission, UI updates, and user interactions

(function () {
    'use strict';

    // DOM Elements
    const form = document.getElementById('baziForm');
    const inputSection = document.getElementById('inputSection');
    const resultsSection = document.getElementById('resultsSection');
    const resetBtn = document.getElementById('resetBtn');

    // Initialize the application
    function init() {
        setupEventListeners();
    }

    // Setup event listeners
    function setupEventListeners() {
        form.addEventListener('submit', handleFormSubmit);
        resetBtn.addEventListener('click', handleReset);
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();

        // Get input values
        const yearStem = document.getElementById('yearStemInput').value;
        const yearBranch = document.getElementById('yearBranchInput').value;
        const monthStem = document.getElementById('monthStemInput').value;
        const monthBranch = document.getElementById('monthBranchInput').value;
        const dayStem = document.getElementById('dayStemInput').value;
        const dayBranch = document.getElementById('dayBranchInput').value;
        const hourStem = document.getElementById('hourStemInput').value;
        const hourBranch = document.getElementById('hourBranchInput').value;

        // Validate all inputs
        if (!yearStem || !yearBranch || !monthStem || !monthBranch ||
            !dayStem || !dayBranch || !hourStem || !hourBranch) {
            alert('請填寫完整的八字四柱');
            return;
        }

        // Create BaZi object from user input
        const bazi = {
            year: {
                stem: yearStem,
                branch: yearBranch,
                element: BaZiCalculator.elements[yearStem]
            },
            month: {
                stem: monthStem,
                branch: monthBranch,
                element: BaZiCalculator.elements[monthStem]
            },
            day: {
                stem: dayStem,
                branch: dayBranch,
                element: BaZiCalculator.elements[dayStem]
            },
            hour: {
                stem: hourStem,
                branch: hourBranch,
                element: BaZiCalculator.elements[hourStem]
            }
        };

        // Calculate element counts
        const elementCount = BaZiCalculator.countElements(bazi);

        // Generate fortune analysis
        const fortune = FortuneAnalyzer.generateFortuneAnalysis(bazi);

        // Display results
        displayBaZi(bazi, elementCount);
        displayFortune(fortune);

        // Show results section with animation
        inputSection.style.display = 'none';
        resultsSection.style.display = 'block';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Display BaZi (Four Pillars)
    function displayBaZi(bazi, elementCount) {
        // Year Pillar
        document.getElementById('yearStem').textContent = bazi.year.stem;
        document.getElementById('yearBranch').textContent = bazi.year.branch;
        document.getElementById('yearElement').textContent = bazi.year.element;

        // Month Pillar
        document.getElementById('monthStem').textContent = bazi.month.stem;
        document.getElementById('monthBranch').textContent = bazi.month.branch;
        document.getElementById('monthElement').textContent = bazi.month.element;

        // Day Pillar
        document.getElementById('dayStem').textContent = bazi.day.stem;
        document.getElementById('dayBranch').textContent = bazi.day.branch;
        document.getElementById('dayElement').textContent = bazi.day.element;

        // Hour Pillar
        document.getElementById('hourStem').textContent = bazi.hour.stem;
        document.getElementById('hourBranch').textContent = bazi.hour.branch;
        document.getElementById('hourElement').textContent = bazi.hour.element;

        // Element counts
        document.getElementById('woodCount').textContent = elementCount['木'];
        document.getElementById('fireCount').textContent = elementCount['火'];
        document.getElementById('earthCount').textContent = elementCount['土'];
        document.getElementById('metalCount').textContent = elementCount['金'];
        document.getElementById('waterCount').textContent = elementCount['水'];

        // Add element colors to pillar elements
        const pillars = document.querySelectorAll('.pillar-element');
        pillars.forEach(pillar => {
            const element = pillar.textContent;
            pillar.style.background = getElementColor(element);
            pillar.style.color = element === '金' ? '#0A0A0A' : 'white';
        });
    }

    // Display fortune analysis
    function displayFortune(fortune) {
        // Personality
        document.getElementById('personalityAnalysis').textContent = fortune.personality;

        // Career
        document.getElementById('careerAnalysis').textContent = fortune.career;

        // Wealth
        document.getElementById('wealthAnalysis').textContent = fortune.wealth;

        // Love
        document.getElementById('loveAnalysis').textContent = fortune.love;

        // Health
        document.getElementById('healthAnalysis').textContent = fortune.health;

        // Yearly fortune
        const yearValue = document.querySelector('.year-value');
        yearValue.textContent = `${fortune.yearly.year} ${fortune.yearly.ganZhi}${fortune.yearly.zodiac}年`;

        document.getElementById('yearlyGeneral').textContent = fortune.yearly.fortune;
        document.getElementById('yearlyWork').textContent = fortune.yearly.workFortune;
        document.getElementById('yearlyHealth').textContent = fortune.yearly.healthFortune;
        document.getElementById('yearlyPettyPeople').textContent = fortune.yearly.pettyPeopleFortune;

        // Suggestions
        const suggestionsList = document.getElementById('suggestionsList');
        suggestionsList.innerHTML = '';

        fortune.yearly.suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            suggestionsList.appendChild(li);
        });

        // Monthly fortune 2025
        displayMonthlyFortune(fortune.monthly2025, 'monthly2025Body');

        // Monthly fortune 2026
        displayMonthlyFortune(fortune.monthly2026, 'monthly2026Body');
    }

    // Display monthly fortune table
    function displayMonthlyFortune(monthlyData, tableBodyId) {
        const tbody = document.getElementById(tableBodyId);
        tbody.innerHTML = '';

        monthlyData.forEach(month => {
            const tr = document.createElement('tr');

            // Month name
            const tdMonth = document.createElement('td');
            tdMonth.className = 'month-name';
            tdMonth.textContent = month.monthName;
            tr.appendChild(tdMonth);

            // Pillar
            const tdPillar = document.createElement('td');
            tdPillar.className = 'pillar-text';
            tdPillar.textContent = month.pillar;
            tr.appendChild(tdPillar);

            // Element
            const tdElement = document.createElement('td');
            tdElement.textContent = month.element;
            tdElement.style.color = getElementColor(month.element);
            tdElement.style.fontWeight = '700';
            tr.appendChild(tdElement);

            // Fortune with rating
            const tdFortune = document.createElement('td');
            const ratingSpan = document.createElement('span');
            ratingSpan.className = `rating ${getRatingClass(month.rating)}`;
            ratingSpan.textContent = month.rating;
            tdFortune.appendChild(ratingSpan);
            tdFortune.appendChild(document.createTextNode(' ' + month.fortune));
            tr.appendChild(tdFortune);

            // Caution
            const tdCaution = document.createElement('td');
            tdCaution.innerHTML = month.caution;
            tr.appendChild(tdCaution);

            tbody.appendChild(tr);
        });
    }

    // Get rating class for styling
    function getRatingClass(rating) {
        const classMap = {
            '旺': 'wang',
            '平': 'ping',
            '弱': 'ruo',
            '中': 'zhong'
        };
        return classMap[rating] || 'ping';
    }

    // Get element color
    function getElementColor(element) {
        const colors = {
            '木': '#2E7D32',
            '火': '#D32F2F',
            '土': '#F57C00',
            '金': '#CFD8DC',
            '水': '#1976D2'
        };
        return colors[element] || '#666';
    }

    // Handle reset button
    function handleReset() {
        resultsSection.style.display = 'none';
        inputSection.style.display = 'block';
        form.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
