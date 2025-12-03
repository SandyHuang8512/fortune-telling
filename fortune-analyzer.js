// Fortune Analyzer
// Analyzes BaZi and provides fortune readings

const FortuneAnalyzer = (function () {
    'use strict';

    // Personality traits based on day master
    const personalityTraits = {
        '甲': '性格剛直，積極進取，具有領導才能。為人正直不阿，富有開拓精神，但有時過於固執己見。適合從事需要決斷力的工作。',
        '乙': '性格柔和，善於適應環境，富有藝術氣質。為人細膩敏感，善解人意，但有時優柔寡斷。適合從事創意或服務性工作。',
        '丙': '性格熱情，光明磊落，充滿活力。為人慷慨大方，樂於助人，但有時過於衝動。適合從事需要熱情和創造力的工作。',
        '丁': '性格溫和，內斂含蓄，思慮周密。為人細心謹慎，富有同情心，但有時過於敏感。適合從事需要耐心和細緻的工作。',
        '戊': '性格穩重，誠實可靠，腳踏實地。為人忠厚老實，責任心強，但有時過於保守。適合從事穩定性強的工作。',
        '己': '性格溫順，包容性強，善於協調。為人謙和有禮，善於理財，但有時過於謹慎。適合從事管理或財務工作。',
        '庚': '性格剛毅，果斷堅定，富有正義感。為人直率坦誠，意志堅強，但有時過於剛硬。適合從事需要執行力的工作。',
        '辛': '性格細膩，追求完美，品味高雅。為人精明能幹，注重細節，但有時過於挑剔。適合從事精密或藝術性工作。',
        '壬': '性格靈活，智慧過人，善於變通。為人聰明機智，適應力強，但有時過於圓滑。適合從事需要智慧和靈活性的工作。',
        '癸': '性格柔順，富有想像力，感受力強。為人溫柔體貼，富有智慧，但有時過於消極。適合從事需要創意和洞察力的工作。'
    };

    // Analyze personality
    function analyzePersonality(bazi) {
        const dayMaster = bazi.day.stem;
        return personalityTraits[dayMaster] || '性格特質分析中...';
    }

    // Analyze career with work fortune rating
    function analyzeCareer(bazi, elementBalance) {
        const dominant = BaZiCalculator.getDominantElement(elementBalance);
        const dayMaster = bazi.day.stem;
        const dayElement = BaZiCalculator.elements[dayMaster];
        const dayStrength = BaZiCalculator.getDayMasterStrength(bazi, elementBalance);

        let workFortune = '';
        let careerAdvice = '';

        // Determine work fortune rating
        if (dayStrength === '強') {
            workFortune = '工作運【旺】- 當前工作運勢旺盛，事業發展順利。適合積極爭取升遷機會，或開展新的業務項目。';
        } else if (dayStrength === '中') {
            workFortune = '工作運【平】- 工作運勢平穩，適合穩紮穩打。建議專注於提升專業能力，等待更好的機會。';
        } else {
            workFortune = '工作運【弱】- 工作運勢較弱，需要更加努力。建議低調行事，避免與人爭鋒，多向前輩學習。';
        }

        // Career advice based on dominant element
        if (dominant.length > 0) {
            const element = dominant[0];
            const careerFields = {
                '木': '教育、文化、出版、林業、醫藥、紡織',
                '火': '能源、餐飲、娛樂、電子、化工、美容',
                '土': '房地產、建築、農業、陶瓷、礦業、保險',
                '金': '金融、機械、汽車、珠寶、五金、法律',
                '水': '貿易、運輸、旅遊、水產、飲料、通訊'
            };
            careerAdvice = `適合行業：${careerFields[element]}。建議選擇與${element}相關的領域發展，更能發揮所長。`;
        } else {
            careerAdvice = '五行較為平衡，適合多方面發展。建議根據個人興趣選擇職業方向，發揮自身優勢。';
        }

        return `${workFortune}\n\n${careerAdvice}`;
    }

    // Analyze wealth with 正財 and 偏財
    function analyzeWealth(bazi, elementBalance) {
        const dayMaster = bazi.day.stem;
        const dayElement = BaZiCalculator.elements[dayMaster];
        const dominant = BaZiCalculator.getDominantElement(elementBalance);

        // Determine wealth stars (財星 = element controlled by day master)
        const wealthElement = getControlledElement(dayElement);
        const wealthCount = elementBalance[wealthElement] || 0;

        let zhengCai = ''; // 正財
        let pianCai = ''; // 偏財
        let advice = '';

        // 正財分析 (Regular Wealth - stable income)
        if (wealthCount >= 2) {
            zhengCai = '【正財運旺】正財運勢佳，工資收入穩定，適合從事固定薪資的工作。財富累積穩健，宜長期儲蓄和投資。';
        } else if (wealthCount === 1) {
            zhengCai = '【正財運平】正財運勢平穩，收入來源穩定但增長較慢。建議努力工作，爭取加薪或升職機會。';
        } else {
            zhengCai = '【正財運弱】正財運勢較弱，固定收入可能不太理想。建議提升專業技能，增加收入來源。';
        }

        // 偏財分析 (Windfall - investment, bonus)
        const dayYinYang = BaZiCalculator.yinYang[dayMaster];
        if (dominant.length > 0 && (dominant.includes('金') || dominant.includes('水'))) {
            pianCai = '【偏財運旺】偏財運勢旺盛，適合投資理財、做生意或發展副業。可能有意外之財，但需注意風險控制。';
        } else if (wealthCount >= 1) {
            pianCai = '【偏財運平】偏財運勢一般，可適度投資，但不宜過於冒險。建議以穩健型投資為主，如基金、債券等。';
        } else {
            pianCai = '【偏財運弱】偏財運勢較弱，不宜投機或高風險投資。建議以正財為主，謹慎理財，避免借貸。';
        }

        // Overall advice
        advice = '理財建議：開源節流，量入為出。建議將收入的30%用於儲蓄，20%用於投資，保持良好的財務習慣。';

        return `${zhengCai}\n\n${pianCai}\n\n${advice}`;
    }

    // Analyze love and relationships (enhanced)
    function analyzeLove(bazi, elementBalance) {
        const dayMaster = bazi.day.stem;
        const dayElement = BaZiCalculator.elements[dayMaster];
        const elementCount = elementBalance[dayElement];

        let peachBlossom = '';
        let relationship = '';
        let advice = '';

        // Peach blossom analysis
        const peachBlossomBranches = ['子', '午', '卯', '酉'];
        const hasPeachBlossom = [bazi.year.branch, bazi.month.branch, bazi.day.branch, bazi.hour.branch]
            .some(branch => peachBlossomBranches.includes(branch));

        if (hasPeachBlossom) {
            peachBlossom = '【桃花運旺】命帶桃花，異性緣佳，容易吸引他人注意。單身者今年有望遇到心儀對象，建議多參加社交活動。';
        } else if (elementCount >= 3) {
            peachBlossom = '【桃花運平】桃花運勢一般，感情機會需要主動爭取。建議擴展社交圈，多認識新朋友。';
        } else {
            peachBlossom = '【桃花運弱】桃花運勢較弱，感情發展較慢。建議提升自我魅力，保持積極樂觀的態度。';
        }

        // Relationship analysis
        if (dayElement === '火') {
            relationship = '感情熱烈主動，追求浪漫激情。已婚者需注意保持新鮮感，避免感情倦怠。';
        } else if (dayElement === '土') {
            relationship = '感情穩定踏實，重視家庭責任。已婚者家庭生活和諧，夫妻相互扶持。';
        } else if (dayElement === '金') {
            relationship = '感情理性務實，重視精神交流。已婚者夫妻相敬如賓，感情持久。';
        } else if (dayElement === '水') {
            relationship = '感情靈活多變，善於表達情感。已婚者需注意溝通，避免誤會。';
        } else {
            relationship = '感情溫和體貼，善解人意。已婚者感情專一，家庭美滿。';
        }

        advice = '感情建議：真誠待人，用心經營。單身者不要急於求成，緣分到了自然會遇到對的人。';

        return `${peachBlossom}\n\n${relationship}\n\n${advice}`;
    }

    // Analyze health (enhanced with detailed organ systems)
    function analyzeHealth(bazi, elementBalance) {
        const analyses = [];
        const seasonalAdvice = [];

        const healthDetails = {
            '木': {
                organ: '肝膽系統',
                strong: '肝膽功能良好，但需注意避免過勞和情緒波動。春季（3-5月）是養肝的最佳時機。',
                weak: '肝膽系統較弱，容易疲勞、眼睛乾澀。建議多吃綠色蔬菜，保持規律作息，避免熬夜。',
                lacking: '命中缺木，需特別注意肝膽健康。易有肝火旺、眼疾等問題。建議定期體檢，多接觸大自然。',
                season: '春季需特別保養'
            },
            '火': {
                organ: '心血管系統',
                strong: '心臟功能強健，但需注意血壓和心率。夏季（6-8月）要避免過度勞累和情緒激動。',
                weak: '心血管系統較弱，容易心悸、失眠。建議保持平和心態，適度運動，多曬太陽。',
                lacking: '命中缺火，需注意心血管健康。易有血液循環不良、手腳冰冷等問題。建議多運動，保持體溫。',
                season: '夏季需特別保養'
            },
            '土': {
                organ: '脾胃系統',
                strong: '脾胃功能良好，但需注意飲食節制。長夏（農曆六月）要避免暴飲暴食。',
                weak: '脾胃系統較弱，容易消化不良、食慾不振。建議清淡飲食，細嚼慢嚥，少吃生冷。',
                lacking: '命中缺土，需注意脾胃健康。易有胃痛、腹瀉等問題。建議規律飲食，多吃溫熱食物。',
                season: '長夏需特別保養'
            },
            '金': {
                organ: '肺部呼吸系統',
                strong: '肺部功能強健，但需注意呼吸道保護。秋季（9-11月）要預防感冒和過敏。',
                weak: '肺部系統較弱，容易咳嗽、氣喘。建議多做深呼吸，避免空氣污染，增強體質。',
                lacking: '命中缺金，需注意呼吸系統健康。易有鼻炎、支氣管炎等問題。建議多做有氧運動。',
                season: '秋季需特別保養'
            },
            '水': {
                organ: '腎臟泌尿系統',
                strong: '腎臟功能良好，但需注意水分代謝。冬季（12-2月）要保暖，避免受寒。',
                weak: '腎臟系統較弱，容易腰痠、耳鳴。建議多喝溫水，避免熬夜，保持充足睡眠。',
                lacking: '命中缺水，需注意腎臟健康。易有泌尿系統問題、骨質疏鬆等。建議多補充水分，定期檢查。',
                season: '冬季需特別保養'
            }
        };

        for (const [element, count] of Object.entries(elementBalance)) {
            let status;
            if (count === 0) status = 'lacking';
            else if (count >= 3) status = 'strong';
            else status = 'weak';

            if (healthDetails[element]) {
                const detail = healthDetails[element];
                analyses.push(`【${detail.organ}】${detail[status]}`);
                if (status === 'lacking' || status === 'weak') {
                    seasonalAdvice.push(detail.season);
                }
            }
        }

        let result = analyses.join('\n\n');
        if (seasonalAdvice.length > 0) {
            result += `\n\n【季節保養】${seasonalAdvice.join('、')}。`;
        }

        return result;
    }

    // Calculate monthly fortune for a specific year
    function calculateMonthlyFortune(bazi, year) {
        const monthlyPillars = BaZiCalculator.getMonthlyPillars(year);
        const dayMaster = bazi.day.stem;
        const dayElement = BaZiCalculator.elements[dayMaster];
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'];

        const monthlyFortunes = monthlyPillars.map((pillar, index) => {
            const monthElement = pillar.element;
            let rating = '';
            let fortune = '';
            let caution = '';

            // Detailed advice parts
            let workAdvice = '';
            let healthAdvice = '';
            let pettyAdvice = '';

            // Determine monthly fortune rating and detailed advice
            if (isSupporting(monthElement, dayElement)) {
                rating = '旺';
                fortune = '運勢上揚，諸事順利';

                workAdvice = '【工作】貴人相助，工作進展順利，適合推動新計劃或爭取表現機會。';
                healthAdvice = '【健康】精力充沛，但需注意作息規律，避免因過度興奮而失眠。';
                pettyAdvice = '【小人】人緣佳，小人退散，適合拓展人脈，與同事建立良好關係。';

            } else if (isControlling(monthElement, dayElement)) {
                rating = '弱';
                fortune = '運勢波折，謹慎為上';

                workAdvice = '【工作】壓力較大，易受上司責難或任務繁重。建議低調行事，細心處理細節。';
                healthAdvice = '【健康】抵抗力弱，易感冒或腸胃不適。注意飲食衛生，多休息。';
                pettyAdvice = '【小人】易犯小人，職場上恐有口舌是非。建議少說話多做事，避免捲入紛爭。';

            } else if (monthElement === dayElement) {
                rating = '平';
                fortune = '運勢平穩，穩紮穩打';

                workAdvice = '【工作】平穩無波，適合鞏固既有成果。不宜有大變動，按部就班即可。';
                healthAdvice = '【健康】身體狀況平穩，適合進行溫和的運動，如散步或瑜伽。';
                pettyAdvice = '【小人】人際關係平淡，無太大利益衝突。保持禮貌距離即可。';

            } else if (isControlled(monthElement, dayElement)) {
                rating = '中';
                fortune = '運勢主動，可有作為';

                workAdvice = '【工作】掌控力強，適合帶領團隊或獨立作業。但需注意不要過於強勢。';
                healthAdvice = '【健康】火氣較旺，易急躁。注意心血管保養，保持心情平和。';
                pettyAdvice = '【小人】競爭激烈，雖能壓制對手，但也要留有餘地，以免樹敵。';

            } else {
                rating = '平';
                fortune = '運勢平和，按部就班';

                workAdvice = '【工作】平淡期，無大起大落。適合進修學習，充實自己。';
                healthAdvice = '【健康】注意季節交替的身體變化，適時增減衣物。';
                pettyAdvice = '【小人】君子之交淡如水，與人相處宜真誠，避免過多算計。';
            }

            // Combine advice into a single formatted string (using <br> for HTML display)
            caution = `${workAdvice}<br>${healthAdvice}<br>${pettyAdvice}`;

            return {
                month: index + 1,
                monthName: monthNames[index],
                pillar: `${pillar.stem}${pillar.branch}`,
                element: monthElement,
                rating: rating,
                fortune: fortune,
                caution: caution
            };
        });

        return monthlyFortunes;
    }

    // Calculate yearly fortune
    function calculateYearlyFortune(bazi, currentYear) {
        // Calculate year GanZhi and zodiac
        const yearGanZhi = getYearGanZhi(currentYear);
        const yearZodiac = getZodiac(currentYear);
        const yearStem = yearGanZhi[0];
        const yearBranch = yearGanZhi[1];
        const yearElement = BaZiCalculator.elements[yearStem];

        const dayMaster = bazi.day.stem;
        const dayElement = BaZiCalculator.elements[dayMaster];

        let fortune = '';
        let workFortune = '';
        let healthFortune = '';
        let pettyPeopleFortune = '';
        let suggestions = [];

        // Analyze relationship between yearly element and day master
        if (yearElement === dayElement) {
            fortune = `今年${currentYear}年為${yearGanZhi}${yearZodiac}年，流年五行與您的日主相同，運勢平穩。這一年適合鞏固基礎，穩步發展。雖然不會有太大的突破，但也不會遇到重大阻礙。建議保持現狀，耐心等待更好的機會。`;

            workFortune = '【工作運勢】平穩發展期。工作上不會有太大的變動，適合專注於手頭的任務，積累經驗。與同事關係融洽，合作順利。建議利用這段時間提升專業技能，為將來的發展打下基礎。';

            healthFortune = '【健康運勢】身體狀況良好，但需注意避免因生活過於安逸而缺乏運動。建議保持規律的作息和飲食，適當增加戶外活動，增強體質。';

            pettyPeopleFortune = '【人際運勢】人際關係和諧，小人干擾較少。適合多參加社交活動，拓展人脈。但也要注意不要過於輕信他人，保持適度的警惕。';

            suggestions.push('保持穩定，不宜冒進');
            suggestions.push('鞏固既有成果');
            suggestions.push('培養新的技能');
        } else if (isSupporting(yearElement, dayElement)) {
            fortune = `今年${currentYear}年為${yearGanZhi}${yearZodiac}年，流年五行生助日主，運勢上揚。這是發展的好時機，適合積極進取，把握機會。事業、財運都有提升的可能，但仍需腳踏實地，不可過於冒進。`;

            workFortune = '【工作運勢】貴人運旺盛。工作上容易得到上司或長輩的提攜，有升職加薪的機會。適合承擔更重要的責任，或開展新的項目。建議積極表現，展現自己的才華。';

            healthFortune = '【健康運勢】精力充沛，身體機能活躍。但要注意不要因為工作忙碌而忽視休息，避免過勞。建議勞逸結合，保持身心愉悅。';

            pettyPeopleFortune = '【人際運勢】人緣極佳，容易結識對自己有幫助的朋友。小人退散，合作順利。建議多與人交流，分享自己的想法，會得到意想不到的支持。';

            suggestions.push('把握機會，積極進取');
            suggestions.push('可考慮投資或創業');
            suggestions.push('擴展人際關係網絡');
            suggestions.push('學習新知識，提升能力');
        } else if (isControlling(yearElement, dayElement)) {
            fortune = `今年${currentYear}年為${yearGanZhi}${yearZodiac}年，流年五行克制日主，運勢較為波折。這一年需要謹慎行事，避免冒險。可能會遇到一些挑戰和阻礙，但只要保持冷靜，穩健應對，仍可化險為夷。`;

            workFortune = '【工作運勢】壓力較大。工作上可能會遇到嚴格的要求或棘手的問題，進展不如預期順利。建議保持低調，認真負責，避免與上司發生衝突。';

            healthFortune = '【健康運勢】抵抗力稍弱，容易感到疲勞或不適。需特別注意季節交替時的保養，預防感冒。建議多休息，減輕心理壓力。';

            pettyPeopleFortune = '【人際運勢】易犯小人。職場上可能會有人在背後議論或阻礙你的工作。建議謹言慎行，不要參與是非八卦，做好自己的本職工作。';

            suggestions.push('謹慎行事，避免冒險');
            suggestions.push('保守理財，避免大額投資');
            suggestions.push('注意身體健康');
            suggestions.push('多與貴人聯繫，尋求幫助');
        } else if (isControlled(yearElement, dayElement)) {
            fortune = `今年${currentYear}年為${yearGanZhi}${yearZodiac}年，日主克制流年五行，運勢較為主動。這一年適合發揮主導作用，掌控局面。事業上可以大展拳腳，但需注意不要過於強勢，以免引起他人反感。`;

            workFortune = '【工作運勢】掌控力強。工作上能夠獨當一面，帶領團隊達成目標。適合創業或擔任領導職務。但要注意不要剛愎自用，多聽取他人的意見。';

            healthFortune = '【健康運勢】火氣較旺，容易急躁易怒。需注意心血管和肝膽方面的保養。建議多做舒緩運動，如瑜伽或太極，調節情緒。';

            pettyPeopleFortune = '【人際運勢】競爭激烈。雖然你有能力壓制對手，但也要注意不要樹敵過多。建議以德服人，化敵為友，營造良好的合作氛圍。';

            suggestions.push('發揮主導作用，掌控局面');
            suggestions.push('適合開展新項目');
            suggestions.push('注意人際關係，避免過於強勢');
            suggestions.push('保持謙虛，虛心學習');
        } else {
            fortune = `今年${currentYear}年為${yearGanZhi}${yearZodiac}年，流年五行與日主關係平和。運勢較為平穩，適合按部就班地發展。這一年不會有太大的起伏，宜保持平常心，穩健前行。`;

            workFortune = '【工作運勢】平淡踏實。工作上按部就班，沒有太大的挑戰，也沒有太大的驚喜。適合沉澱自己，思考未來的方向。建議保持耐心，做好手頭的每一件事。';

            healthFortune = '【健康運勢】身體狀況平穩。只需保持良好的生活習慣，定期體檢即可。建議多參加戶外活動，呼吸新鮮空氣。';

            pettyPeopleFortune = '【人際運勢】君子之交淡如水。人際關係平淡，沒有太多的利益糾葛。適合與志同道合的朋友交流心得，享受平靜的生活。';

            suggestions.push('保持平常心，穩健前行');
            suggestions.push('完善現有計劃');
            suggestions.push('培養興趣愛好');
        }

        return {
            year: currentYear,
            ganZhi: yearGanZhi,
            zodiac: yearZodiac,
            element: yearElement,
            fortune: fortune,
            workFortune: workFortune,
            healthFortune: healthFortune,
            pettyPeopleFortune: pettyPeopleFortune,
            suggestions: suggestions
        };
    }

    // Helper functions
    function isSupporting(element1, element2) {
        const support = {
            '木': '火',
            '火': '土',
            '土': '金',
            '金': '水',
            '水': '木'
        };
        return support[element1] === element2;
    }

    function isControlling(element1, element2) {
        const control = {
            '木': '土',
            '火': '金',
            '土': '水',
            '金': '木',
            '水': '火'
        };
        return control[element1] === element2;
    }

    function isControlled(element1, element2) {
        return isControlling(element2, element1);
    }

    function getControlledElement(element) {
        const control = {
            '木': '土',
            '火': '金',
            '土': '水',
            '金': '木',
            '水': '火'
        };
        return control[element] || '土';
    }

    // Get year GanZhi (干支)
    function getYearGanZhi(year) {
        const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        const ganIndex = (year - 4) % 10;
        const zhiIndex = (year - 4) % 12;
        return heavenlyStems[ganIndex] + earthlyBranches[zhiIndex];
    }

    // Get zodiac animal
    function getZodiac(year) {
        const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];
        return zodiacAnimals[(year - 4) % 12];
    }

    // Generate complete fortune analysis
    function generateFortuneAnalysis(bazi, currentYear = new Date().getFullYear()) {
        const elementCount = BaZiCalculator.countElements(bazi);

        return {
            personality: analyzePersonality(bazi),
            career: analyzeCareer(bazi, elementCount),
            wealth: analyzeWealth(bazi, elementCount),
            love: analyzeLove(bazi, elementCount),
            health: analyzeHealth(bazi, elementCount),
            yearly: calculateYearlyFortune(bazi, currentYear),
            monthly2025: calculateMonthlyFortune(bazi, 2025),
            monthly2026: calculateMonthlyFortune(bazi, 2026)
        };
    }

    return {
        generateFortuneAnalysis,
        analyzePersonality,
        analyzeCareer,
        analyzeWealth,
        analyzeLove,
        analyzeHealth,
        calculateYearlyFortune,
        calculateMonthlyFortune
    };
})();
