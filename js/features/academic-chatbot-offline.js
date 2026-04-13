/**
 * Academic Chatbot - Offline Version
 * No external APIs. Uses built-in knowledge base.
 * Subjects: Math, Science, English, GK (Nursery to Class 10)
 */

(function() {
    'use strict';

    // ==========================================
    // KNOWLEDGE BASE
    // ==========================================
    const knowledgeBase = {
        // MATHEMATICS
        math: {
            nursery: {
                'what is 1+1': '1 + 1 = 2 🎉',
                'what is 2+2': '2 + 2 = 4 🎉',
                'what is 5+5': '5 + 5 = 10 🎉',
                'count to 10': '1, 2, 3, 4, 5, 6, 7, 8, 9, 10! 🎯',
                'what is circle': 'A circle is round like a ball 🟢',
                'what is square': 'A square has 4 equal sides ⬜',
                'what is triangle': 'A triangle has 3 sides 🔺'
            },
            class_1: {
                'what is addition': 'Addition means putting things together. Example: 2 + 3 = 5',
                'what is subtraction': 'Subtraction means taking away. Example: 5 - 2 = 3',
                'what is number': 'Numbers help us count: 1, 2, 3, 4, 5...',
                'what is even number': 'Even numbers: 2, 4, 6, 8, 10 (divisible by 2)',
                'what is odd number': 'Odd numbers: 1, 3, 5, 7, 9 (not divisible by 2)',
                'count to 100': '10, 20, 30, 40, 50, 60, 70, 80, 90, 100! 🎯'
            },
            class_2: {
                'what is multiplication': 'Multiplication is repeated addition. 3 × 4 = 3 + 3 + 3 + 3 = 12',
                'what is division': 'Division means sharing equally. 12 ÷ 3 = 4',
                'what is fraction': 'A fraction is a part of a whole. Example: ½ means one part of two equal parts',
                'what is place value': 'Place value: In 234, 2=Hundreds, 3=Tens, 4=Ones',
                '2 times table': '2, 4, 6, 8, 10, 12, 14, 16, 18, 20!',
                '5 times table': '5, 10, 15, 20, 25, 30, 35, 40, 45, 50!'
            },
            class_3: {
                'what is perimeter': 'Perimeter is the distance around a shape. Rectangle: 2 × (length + width)',
                'what is area': 'Area is the space inside a shape. Rectangle: length × width',
                'what is time': 'Time has hours, minutes, seconds. 1 hour = 60 minutes',
                'what is money': 'Money: 100 paise = 1 Rupee. Coins: ₹1, ₹2, ₹5, ₹10',
                'what is measurement': 'We measure length in meters (m), weight in kilograms (kg), volume in liters (L)'
            },
            class_4: {
                'what is factor': 'Factors divide a number exactly. Factors of 12: 1, 2, 3, 4, 6, 12',
                'what is multiple': 'Multiples are products of a number. Multiples of 3: 3, 6, 9, 12, 15...',
                'what is lcm': 'LCM (Least Common Multiple) of 4 and 6 is 12',
                'what is hcf': 'HCF (Highest Common Factor) of 12 and 18 is 6',
                'what is decimal': 'Decimals show parts of a whole. 0.5 = ½, 0.25 = ¼',
                'what is percentage': 'Percentage means per 100. 50% = 50/100 = ½'
            },
            class_5: {
                'what is average': 'Average = Sum of numbers ÷ Count of numbers. Average of 10, 20, 30 = (10+20+30)÷3 = 20',
                'what is ratio': 'Ratio compares quantities. Ratio of 2:3 means 2 parts to 3 parts',
                'what is proportion': 'Proportion says two ratios are equal. 2:3 = 4:6',
                'what is angle': 'An angle is formed by two rays. Types: acute (<90°), right (=90°), obtuse (>90°)',
                'what is triangle': 'Triangle has 3 sides. Types: Equilateral (3 equal), Isosceles (2 equal), Scalene (none equal)',
                'what is quadrilateral': 'Quadrilateral has 4 sides. Examples: Square, Rectangle, Parallelogram'
            },
            class_6: {
                'what is integer': 'Integers: ..., -2, -1, 0, 1, 2, ... (positive, negative, and zero)',
                'what is algebra': 'Algebra uses letters (variables) for unknown numbers. Example: x + 3 = 7, so x = 4',
                'what is equation': 'Equation has = sign. 2x + 3 = 11, solve: 2x = 8, x = 4',
                'what is circle': 'Circle: All points equidistant from center. Radius = distance from center to edge',
                'what is pi': 'Pi (π) ≈ 3.14 or 22/7. Circumference = 2πr, Area = πr²',
                'what is symmetry': 'Symmetry: One half is mirror image of other half'
            },
            class_7: {
                'what is rational number': 'Rational numbers: p/q form where q≠0. Example: ½, -3/4, 5/1',
                'what is exponent': 'Exponent shows repeated multiplication. 2³ = 2×2×2 = 8',
                'what is linear equation': 'Linear equation: ax + b = 0. Has one solution. Example: 2x + 4 = 0, x = -2',
                'what is congruence': 'Two shapes are congruent if same size and shape. Symbol: ≅',
                'what is pythagoras theorem': 'Pythagoras: a² + b² = c² (right triangle). Example: 3² + 4² = 5²',
                'what is data handling': 'Data handling: collecting, organizing, representing data using graphs and charts'
            },
            class_8: {
                'what is square root': 'Square root: √x × √x = x. √16 = 4 because 4×4=16',
                'what is cube root': 'Cube root: ³√x × ³√x × ³√x = x. ³√27 = 3 because 3×3×3=27',
                'what is profit and loss': 'Profit = Selling Price - Cost Price. Loss = Cost Price - Selling Price',
                'what is compound interest': 'Compound Interest = P(1 + r/100)ⁿ - P. Interest on interest!',
                'what is polygon': 'Polygon: closed shape with straight sides. Triangle (3), Quadrilateral (4), Pentagon (5)',
                'what is 3d shape': '3D shapes have length, width, height. Cube, Cuboid, Sphere, Cylinder, Cone'
            },
            class_9: {
                'what is polynomial': 'Polynomial: expression with variables and coefficients. Example: 3x² + 2x + 1',
                'what is coordinate geometry': 'Coordinate geometry: points on x-y plane. Point (3,4) means x=3, y=4',
                'what is linear equation in two variables': 'ax + by + c = 0. Represents a straight line on graph',
                'what is euclid geometry': 'Euclid\'s geometry: basic truths about points, lines, planes',
                'what is herons formula': 'Heron\'s formula: Area = √[s(s-a)(s-b)(s-c)] where s=(a+b+c)/2',
                'what is probability': 'Probability = Favorable outcomes / Total outcomes. Range: 0 to 1'
            },
            class_10: {
                'what is real number': 'Real numbers: Rational + Irrational. Can be represented on number line',
                'what is quadratic equation': 'Quadratic: ax² + bx + c = 0. Formula: x = [-b ± √(b²-4ac)] / 2a',
                'what is arithmetic progression': 'AP: Sequence with common difference. nth term = a + (n-1)d',
                'what is trigonometry': 'Trigonometry: sin, cos, tan ratios in right triangle. sinθ = opposite/hypotenuse',
                'what is similarity': 'Similar triangles have same shape, proportional sides. Symbol: ~',
                'what is statistics': 'Statistics: Mean = Sum/Count, Median = middle value, Mode = most frequent'
            }
        },

        // SCIENCE
        science: {
            class_1: {
                'what is living thing': 'Living things: grow, eat, breathe, move, reproduce. Examples: humans, animals, plants',
                'what is non living thing': 'Non-living things: do not grow or eat. Examples: stone, water, chair',
                'what is plant': 'Plants are living things. They make their own food using sunlight (photosynthesis)',
                'what is animal': 'Animals are living things. They cannot make their own food. They eat plants or other animals'
            },
            class_2: {
                'what is food': 'Food gives us energy to work and grow. Types: carbohydrates, proteins, fats, vitamins',
                'what is water': 'Water is essential for life. We drink water, plants need water, animals need water',
                'what is air': 'Air is all around us. We breathe air. Plants need air. Air has oxygen and nitrogen',
                'what is sun': 'Sun is a star. It gives us light and heat. Plants need sunlight to make food'
            },
            class_3: {
                'what is matter': 'Matter is anything that has mass and takes up space. Three states: solid, liquid, gas',
                'what is solid': 'Solid: fixed shape and volume. Examples: book, stone, ice',
                'what is liquid': 'Liquid: takes shape of container, fixed volume. Examples: water, milk, oil',
                'what is gas': 'Gas: no fixed shape or volume. Examples: air, oxygen, carbon dioxide',
                'what is force': 'Force is a push or pull. Example: pushing a door, pulling a drawer'
            },
            class_4: {
                'what is habitat': 'Habitat is where animals and plants live. Examples: forest, desert, ocean, grassland',
                'what is adaptation': 'Adaptation: special features that help animals survive in their habitat',
                'what is food chain': 'Food chain: who eats whom. Example: Grass → Rabbit → Fox',
                'what is photosynthesis': 'Photosynthesis: plants make food using sunlight, water, CO₂. Release oxygen',
                'what is reproduction': 'Reproduction: making babies. Animals have babies, plants make seeds'
            },
            class_5: {
                'what is human body': 'Human body has systems: digestive, respiratory, circulatory, nervous, skeletal',
                'what is digestive system': 'Digestive system: breaks down food. Mouth → Stomach → Intestines',
                'what is respiratory system': 'Respiratory system: helps us breathe. Nose → Trachea → Lungs',
                'what is skeleton': 'Skeleton: 206 bones in human body. Gives shape and support',
                'what is sense organ': 'Sense organs: Eyes (see), Ears (hear), Nose (smell), Tongue (taste), Skin (touch)'
            },
            class_6: {
                'what is cell': 'Cell is the basic unit of life. All living things are made of cells',
                'what is tissue': 'Tissue: group of similar cells working together. Example: muscle tissue',
                'what is organ': 'Organ: group of tissues working together. Example: heart, lungs, brain',
                'what is magnet': 'Magnet attracts iron. Has two poles: North and South. Opposite poles attract',
                'what is light': 'Light helps us see. Travels in straight lines. Speed: 300,000 km/s'
            },
            class_7: {
                'what is nutrition': 'Nutrition: process of taking in food and using it. Types: autotrophic (self-feeding), heterotrophic (eating others)',
                'what is acid': 'Acids: sour taste, turn blue litmus red. Examples: lemon, vinegar',
                'what is base': 'Bases: bitter taste, turn red litmus blue. Examples: soap, baking soda',
                'what is weather': 'Weather: day-to-day atmospheric conditions. Climate: long-term weather pattern',
                'what is soil': 'Soil: top layer of earth. Has sand, silt, clay. Important for plants',
                'what is heat': 'Heat is a form of energy. Flows from hot to cold objects'
            },
            class_8: {
                'what is microorganism': 'Microorganisms: tiny living things. Bacteria, virus, fungi, algae. Some helpful, some harmful',
                'what is cell structure': 'Cell has: Cell membrane, Cytoplasm, Nucleus, Mitochondria, Ribosomes',
                'what is friction': 'Friction: force that opposes motion. Helps us walk, causes wear and tear',
                'what is pressure': 'Pressure = Force ÷ Area. Unit: Pascal (Pa)',
                'what is sound': 'Sound is a vibration. Needs medium to travel. Cannot travel in vacuum',
                'what is electric current': 'Electric current: flow of electrons. Unit: Ampere (A)'
            },
            class_9: {
                'what is atom': 'Atom: smallest unit of matter. Has protons (+), neutrons (neutral), electrons (-)',
                'what is molecule': 'Molecule: two or more atoms bonded. Example: H₂O (water), O₂ (oxygen)',
                'what is periodic table': 'Periodic table: organizes all elements. 118 elements discovered',
                'what is tissue in plants': 'Plant tissues: Meristematic (growing), Permanent (permanent)',
                'what is gravitation': 'Gravitation: force of attraction between masses. F = G×m₁×m₂/r²',
                'what is work': 'Work = Force × Distance. Unit: Joule (J). Only when displacement occurs'
            },
            class_10: {
                'what is chemical reaction': 'Chemical reaction: substances change into new substances. Example: burning, rusting',
                'what is photosynthesis equation': '6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂',
                'what is human eye': 'Human eye: cornea, iris, pupil, lens, retina. Lens focuses light on retina',
                'what is dna': 'DNA: genetic material. Double helix structure. Contains genes',
                'what is evolution': 'Evolution: gradual change in species over time. Theory by Charles Darwin',
                'what is ecosystem': 'Ecosystem: living + non-living components interacting. Example: forest, pond'
            }
        },

        // ENGLISH
        english: {
            nursery: {
                'a for': 'A for Apple 🍎',
                'b for': 'B for Ball ⚽',
                'c for': 'C for Cat 🐱',
                'd for': 'D for Dog 🐕',
                'e for': 'E for Elephant 🐘',
                'alphabet': 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z! 🎵'
            },
            class_1: {
                'what is noun': 'Noun: naming word. Names of people, places, things. Example: Ram, Delhi, book',
                'what is verb': 'Verb: action word. Example: run, eat, sleep, play',
                'what is adjective': 'Adjective: describing word. Example: big, small, red, happy',
                'what is pronoun': 'Pronoun: replaces noun. Example: he, she, it, they, we',
                'opposite of big': 'Opposite of big is small',
                'opposite of hot': 'Opposite of hot is cold'
            },
            class_2: {
                'what is sentence': 'Sentence: group of words that makes sense. Starts with capital, ends with full stop',
                'what is question mark': 'Question mark (?) used at end of questions. Example: What is your name?',
                'what is exclamation': 'Exclamation mark (!) shows strong feeling. Example: Wow! Amazing!',
                'what is singular': 'Singular: one. Example: one book, one pen',
                'what is plural': 'Plural: more than one. Example: two books, three pens',
                'what is article': 'Articles: a, an, the. "A" before consonants, "an" before vowels'
            },
            class_3: {
                'what is tense': 'Tense shows time. Past (happened), Present (happening), Future (will happen)',
                'what is past tense': 'Past tense: action already done. Example: I played, She walked',
                'what is present tense': 'Present tense: action now. Example: I play, She walks',
                'what is future tense': 'Future tense: action will happen. Example: I will play, She will walk',
                'what is synonym': 'Synonym: words with same meaning. Happy = Joyful, Big = Large',
                'what is antonym': 'Antonym: words with opposite meaning. Hot = Cold, Up = Down'
            },
            class_4: {
                'what is subject': 'Subject: who/what the sentence is about. Example: Ram (subject) is playing',
                'what is predicate': 'Predicate: what the subject does. Example: Ram is playing (predicate)',
                'what is preposition': 'Preposition: shows position. In, on, at, under, behind, between',
                'what is conjunction': 'Conjunction: joining word. And, but, or, because, so',
                'what is adverb': 'Adverb: describes verb. Example: run fast, speak softly',
                'what is punctuation': 'Punctuation marks: . , ? ! " " \' \' : ; -'
            },
            class_5: {
                'what is active voice': 'Active voice: subject does action. Example: Ram eats an apple',
                'what is passive voice': 'Passive voice: subject receives action. Example: An apple is eaten by Ram',
                'what is direct speech': 'Direct speech: exact words. Example: He said, "I am happy"',
                'what is indirect speech': 'Indirect speech: reported words. Example: He said that he was happy',
                'what is paragraph': 'Paragraph: group of sentences about one topic. Starts with indent',
                'what is comprehension': 'Comprehension: understanding what you read. Read carefully, answer questions'
            },
            class_6: {
                'what is clause': 'Clause: group of words with subject and verb. Main clause + Subordinate clause',
                'what is phrase': 'Phrase: group of words without complete meaning. Example: in the morning',
                'what is idiom': 'Idiom: phrase with special meaning. "Break a leg" = Good luck',
                'what is proverb': 'Proverb: wise saying. "Honesty is the best policy"',
                'what is homophone': 'Homophone: same sound, different meaning. Example: right/write, sea/see',
                'what is homonym': 'Homonym: same spelling/sound, different meaning. Example: bat (animal/sports)'
            },
            class_7: {
                'what is figure of speech': 'Figure of speech: creative use of words. Simile, metaphor, personification',
                'what is simile': 'Simile: comparison using "like" or "as". Example: as brave as a lion',
                'what is metaphor': 'Metaphor: direct comparison. Example: He is a lion (brave)',
                'what is personification': 'Personification: giving human qualities to non-human. Example: The wind whispered',
                'what is alliteration': 'Alliteration: same starting sound. Example: Peter Piper picked',
                'what is onomatopoeia': 'Onomatopoeia: sound words. Example: buzz, hiss, boom, crash'
            },
            class_8: {
                'what is narration': 'Narration: telling a story. First person (I), Second person (you), Third person (he/she)',
                'what is formal letter': 'Formal letter: official. To principal, boss. Format: Date, Address, Subject, Body',
                'what is informal letter': 'Informal letter: to friends/family. Friendly tone',
                'what is essay': 'Essay: short composition. Introduction, Body paragraphs, Conclusion',
                'what is precis': 'Precis: summary. Shorten without losing main points',
                'what is comprehension passage': 'Comprehension: read passage, answer questions based on it'
            },
            class_9: {
                'what is reported speech': 'Reported speech: telling what someone said. Changes in tense, pronouns',
                'what is modal verb': 'Modal verbs: can, could, may, might, must, should, will, would. Show ability/possibility',
                'what is conditional sentence': 'Conditional: if-then sentences. Zero, First, Second, Third conditionals',
                'what is relative clause': 'Relative clause: describes noun. Uses who, which, that, whom, whose',
                'what is active to passive': 'Active to Passive: Object becomes subject. Add be verb + past participle',
                'what is gap filling': 'Gap filling: fill blanks with correct words. Test grammar knowledge'
            },
            class_10: {
                'what is debate': 'Debate: formal discussion. For and against a topic. Structured arguments',
                'what is speech': 'Speech: formal talk. Introduction, Main points, Conclusion',
                'what is article writing': 'Article: for newspaper/magazine. Catchy title, introduction, body, conclusion',
                'what is story writing': 'Story: narrative. Characters, setting, plot, conflict, resolution',
                'what is notice writing': 'Notice: formal announcement. Heading, Date, Body, Signature',
                'what is email writing': 'Email: electronic mail. To, Subject, Body, Closing'
            }
        },

        // GENERAL KNOWLEDGE
        gk: {
            all: {
                'what is capital of india': 'New Delhi 🇮🇳',
                'what is capital of usa': 'Washington D.C. 🇺🇸',
                'what is capital of uk': 'London 🇬🇧',
                'what is capital of japan': 'Tokyo 🇯🇵',
                'what is capital of china': 'Beijing 🇨🇳',
                'what is capital of france': 'Paris 🇫🇷',
                'what is capital of germany': 'Berlin 🇩🇪',
                'what is capital of russia': 'Moscow 🇷🇺',
                'what is capital of australia': 'Canberra 🇦🇺',
                'what is capital of canada': 'Ottawa 🇨🇦',
                'what is capital of brazil': 'Brasília 🇧🇷',
                'what is largest country': 'Russia is the largest country by area',
                'what is smallest country': 'Vatican City is the smallest country',
                'what is largest ocean': 'Pacific Ocean is the largest ocean',
                'what is highest mountain': 'Mount Everest (8,848 meters) 🏔️',
                'what is longest river': 'Nile River (6,650 km) 🌊',
                'what is largest desert': 'Sahara Desert in Africa 🏜️',
                'what is largest continent': 'Asia is the largest continent',
                'what is smallest continent': 'Australia is the smallest continent',
                'how many continents': 'There are 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, Australia',
                'how many oceans': 'There are 5 oceans: Pacific, Atlantic, Indian, Southern, Arctic',
                'who invented telephone': 'Alexander Graham Bell invented telephone in 1876 📞',
                'who invented light bulb': 'Thomas Edison invented practical light bulb 💡',
                'who invented airplane': 'Wright Brothers (Orville and Wilbur) invented airplane ✈️',
                'who invented computer': 'Charles Babbage is father of computer 💻',
                'who invented internet': 'Tim Berners-Lee invented World Wide Web 🌐',
                'who discovered gravity': 'Isaac Newton discovered gravity 🍎',
                'who discovered america': 'Christopher Columbus discovered America in 1492',
                'who was first on moon': 'Neil Armstrong was first person on moon 🌙',
                'what is national animal of india': 'Royal Bengal Tiger 🐅',
                'what is national bird of india': 'Indian Peacock 🦚',
                'what is national flower of india': 'Lotus 🪷',
                'what is national tree of india': 'Banyan Tree 🌳',
                'what is national fruit of india': 'Mango 🥭',
                'what is national game of india': 'Hockey 🏑',
                'how many states in india': 'India has 28 states and 8 Union Territories',
                'who is prime minister of india': 'Narendra Modi (as of 2024)',
                'who is president of india': 'Droupadi Murmu (as of 2024)',
                'what is independence day of india': '15th August 1947 🇮🇳',
                'what is republic day of india': '26th January 1950',
                'what is national anthem': 'Jana Gana Mana by Rabindranath Tagore',
                'what is national song': 'Vande Mataram by Bankim Chandra Chattopadhyay',
                'what is currency of india': 'Indian Rupee (₹)',
                'what is currency of usa': 'US Dollar ($)',
                'what is currency of uk': 'British Pound (£)',
                'what is currency of japan': 'Japanese Yen (¥)',
                'what is currency of europe': 'Euro (€)',
                'how many planets': 'There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune',
                'what is largest planet': 'Jupiter is the largest planet',
                'what is smallest planet': 'Mercury is the smallest planet',
                'what is hottest planet': 'Venus is the hottest planet',
                'what is red planet': 'Mars is called the Red Planet',
                'what is ring planet': 'Saturn has beautiful rings around it',
                'what is our galaxy': 'We live in the Milky Way galaxy 🌌',
                'what is sun': 'Sun is a star at center of our solar system ☀️',
                'what is moon': 'Moon is Earth\'s natural satellite 🌙',
                'what is solar eclipse': 'Solar eclipse: Moon comes between Sun and Earth',
                'what is lunar eclipse': 'Lunar eclipse: Earth comes between Sun and Moon',
                'what is rainbow': 'Rainbow: sunlight splits into 7 colors through water droplets 🌈',
                'what are 7 colors of rainbow': 'VIBGYOR: Violet, Indigo, Blue, Green, Yellow, Orange, Red',
                'what is un': 'UN (United Nations): organization of countries for world peace',
                'what is who': 'WHO (World Health Organization): takes care of world health',
                'what is unesco': 'UNESCO: promotes education, science, and culture',
                'what is red cross': 'Red Cross: helps people during emergencies and disasters',
                'what is olympics': 'Olympics: international sports competition held every 4 years 🏅',
                'what is fifa world cup': 'FIFA World Cup: biggest football tournament ⚽',
                'what is cricket world cup': 'Cricket World Cup: biggest cricket tournament 🏏',
                'who wrote ramayana': 'Ramayana written by Sage Valmiki',
                'who wrote mahabharata': 'Mahabharata written by Sage Vyasa',
                'who wrote geetanjali': 'Gitanjali written by Rabindranath Tagore',
                'who is father of nation': 'Mahatma Gandhi is father of Indian nation',
                'who is missile man': 'Dr. APJ Abdul Kalam is called Missile Man of India',
                'who is nightingale of india': 'Sarojini Naidu is called Nightingale of India',
                'what is bharat ratna': 'Bharat Ratna: India\'s highest civilian award',
                'what is nobel prize': 'Nobel Prize: most prestigious award in the world 🏆',
                'what is olympic medal': 'Olympic medals: Gold (1st), Silver (2nd), Bronze (3rd)'
            }
        }
    };

    // ==========================================
    // MATH SOLVER
    // ==========================================
    const MathSolver = {
        solve(expression) {
            try {
                // Clean the expression
                const clean = expression.toLowerCase()
                    .replace(/[^\d+\-*/().\s]/g, '')
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/x/g, '*')
                    .trim();

                if (!clean || clean.length < 3) return null;

                // Safety check - only allow numbers and operators
                if (!/^[\d+\-*/().\s]+$/.test(clean)) return null;

                // Evaluate safely
                const result = Function('"use strict"; return (' + clean + ')')();
                
                if (isNaN(result) || !isFinite(result)) return null;

                return {
                    expression: clean,
                    result: result,
                    formatted: `${clean} = ${result}`
                };
            } catch (error) {
                return null;
            }
        },

        detectMath(query) {
            const mathPatterns = [
                /^(\d+\s*[+\-*/×÷x]\s*\d+)+$/,  // 2+2, 5*3
                /^calculate\s+(.+)$/i,            // calculate 2+2
                /^solve\s+(.+)$/i,                // solve 5*3
                /^what is\s+(\d+\s*[+\-*/×÷x]\s*\d+)$/i,  // what is 2+2
                /^(\d+)\s*(plus|minus|times?|divided by)\s*(\d+)$/i  // 2 plus 2
            ];

            for (const pattern of mathPatterns) {
                const match = query.match(pattern);
                if (match) {
                    // Convert words to operators
                    let expr = query
                        .replace(/plus/gi, '+')
                        .replace(/minus/gi, '-')
                        .replace(/times?/gi, '*')
                        .replace(/divided by/gi, '/')
                        .replace(/calculate|solve|what is/gi, '');
                    return expr.trim();
                }
            }
            return null;
        }
    };

    // ==========================================
    // QUESTION MATCHER
    // ==========================================
    const QuestionMatcher = {
        normalize(query) {
            return query.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        },

        findMatch(query) {
            const normalized = this.normalize(query);
            
            // Search through all subjects and classes
            for (const [subject, classes] of Object.entries(knowledgeBase)) {
                for (const [classLevel, questions] of Object.entries(classes)) {
                    // Exact match
                    if (questions[normalized]) {
                        return {
                            answer: questions[normalized],
                            subject,
                            classLevel,
                            confidence: 'high'
                        };
                    }

                    // Partial match - check if query contains key terms
                    for (const [q, a] of Object.entries(questions)) {
                        const qWords = q.split(' ');
                        const queryWords = normalized.split(' ');
                        const matchCount = queryWords.filter(w => qWords.includes(w)).length;
                        
                        if (matchCount >= 2 && matchCount / qWords.length >= 0.5) {
                            return {
                                answer: a,
                                subject,
                                classLevel,
                                confidence: 'medium'
                            };
                        }
                    }
                }
            }

            return null;
        },

        getSuggestions(query) {
            const normalized = this.normalize(query);
            const suggestions = [];

            for (const [subject, classes] of Object.entries(knowledgeBase)) {
                for (const [classLevel, questions] of Object.entries(classes)) {
                    for (const q of Object.keys(questions)) {
                        if (q.includes(normalized) || normalized.split(' ').some(w => q.includes(w))) {
                            suggestions.push({
                                question: q,
                                subject,
                                classLevel
                            });
                        }
                    }
                }
            }

            return suggestions.slice(0, 5);
        }
    };

    // ==========================================
    // CHATBOT UI
    // ==========================================
    class AcademicChatbot {
        constructor() {
            this.messages = JSON.parse(localStorage.getItem('academic_chatbot_history') || '[]');
            this.isOpen = false;
            this.init();
        }

        init() {
            this.createUI();
            this.loadHistory();
            console.log('📚 Academic Chatbot initialized (Offline Mode)');
        }

        createUI() {
            if (document.getElementById('academic-chatbot')) return;

            const container = document.createElement('div');
            container.id = 'academic-chatbot';
            container.innerHTML = `
                <div class="academic-chatbot-container">
                    <button class="chatbot-toggle" onclick="academicChatbot.toggle()">
                        📚
                    </button>
                    <div class="chatbot-window" id="academic-chatbot-window">
                        <div class="chatbot-header">
                            <h3>📚 Academic Assistant</h3>
                            <span class="offline-badge">OFFLINE</span>
                            <button class="close-btn" onclick="academicChatbot.toggle()">✕</button>
                        </div>
                        <div class="chatbot-messages" id="academic-messages">
                            <div class="welcome-msg">
                                <p>👋 Hi! I'm your Academic Assistant!</p>
                                <p>I can help with:</p>
                                <ul>
                                    <li>🔢 Math (Nursery to Class 10)</li>
                                    <li>🔬 Science (Class 1-10)</li>
                                    <li>📖 English Grammar</li>
                                    <li>🌍 General Knowledge</li>
                                </ul>
                                <p class="hint">Try: "What is photosynthesis?" or "2 + 2"</p>
                            </div>
                        </div>
                        <div class="chatbot-input-area">
                            <input type="text" id="academic-input" 
                                placeholder="Ask me anything..." 
                                onkeypress="if(event.key==='Enter') academicChatbot.send()">
                            <button onclick="academicChatbot.send()">Send</button>
                        </div>
                    </div>
                </div>
            `;

            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .academic-chatbot-container {
                    position: fixed;
                    bottom: 20px;
                    right: 90px;
                    z-index: 9999;
                    font-family: 'Inter', sans-serif;
                }
                .chatbot-toggle {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                    transition: transform 0.3s;
                }
                .chatbot-toggle:hover { transform: scale(1.1); }
                .chatbot-window {
                    position: absolute;
                    bottom: 70px;
                    right: 0;
                    width: 350px;
                    height: 500px;
                    background: #1a1a2e;
                    border-radius: 15px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                }
                .chatbot-window.open { display: flex; }
                .chatbot-header {
                    background: #16213e;
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .chatbot-header h3 { color: #fff; margin: 0; font-size: 16px; }
                .offline-badge {
                    background: #10b981;
                    color: #fff;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 10px;
                }
                .close-btn {
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 18px;
                    cursor: pointer;
                }
                .chatbot-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 15px;
                }
                .welcome-msg {
                    background: #0f3460;
                    padding: 15px;
                    border-radius: 10px;
                    color: #eaeaea;
                    font-size: 13px;
                }
                .welcome-msg ul { margin: 10px 0; padding-left: 20px; }
                .welcome-msg li { margin: 5px 0; }
                .hint { color: #a0a0a0; font-style: italic; margin-top: 10px; }
                .message {
                    margin: 10px 0;
                    padding: 10px 15px;
                    border-radius: 15px;
                    max-width: 85%;
                    font-size: 13px;
                    line-height: 1.5;
                }
                .message.user {
                    background: #667eea;
                    color: #fff;
                    margin-left: auto;
                    border-bottom-right-radius: 5px;
                }
                .message.bot {
                    background: #0f3460;
                    color: #eaeaea;
                    border-bottom-left-radius: 5px;
                }
                .message.bot.error {
                    background: rgba(239, 68, 68, 0.2);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                }
                .chatbot-input-area {
                    display: flex;
                    padding: 15px;
                    background: #16213e;
                    gap: 10px;
                }
                .chatbot-input-area input {
                    flex: 1;
                    padding: 10px 15px;
                    border: none;
                    border-radius: 20px;
                    background: #0f3460;
                    color: #fff;
                    outline: none;
                }
                .chatbot-input-area button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 20px;
                    background: #667eea;
                    color: #fff;
                    cursor: pointer;
                }
            `;

            document.head.appendChild(style);
            document.body.appendChild(container);
        }

        toggle() {
            this.isOpen = !this.isOpen;
            document.getElementById('academic-chatbot-window').classList.toggle('open', this.isOpen);
            if (this.isOpen) {
                document.getElementById('academic-input').focus();
            }
        }

        send() {
            const input = document.getElementById('academic-input');
            const query = input.value.trim();
            if (!query) return;

            input.value = '';
            this.addMessage('user', query);
            this.processQuery(query);
        }

        async processQuery(query) {
            // Check for math first
            const mathExpr = MathSolver.detectMath(query);
            if (mathExpr) {
                const mathResult = MathSolver.solve(mathExpr);
                if (mathResult) {
                    this.addMessage('bot', `🧮 ${mathResult.formatted}`);
                    this.saveMessage(query, mathResult.formatted);
                    return;
                }
            }

            // Search knowledge base
            const match = QuestionMatcher.findMatch(query);
            
            if (match) {
                let response = match.answer;
                if (match.confidence === 'medium') {
                    response += '\n\n(Showing best match for your question)';
                }
                this.addMessage('bot', response);
                this.saveMessage(query, response);
            } else {
                // No match found
                const suggestions = QuestionMatcher.getSuggestions(query);
                let response = "❓ I don't have this answer in my knowledge base yet.\n\n";
                
                if (suggestions.length > 0) {
                    response += "Did you mean:\n";
                    suggestions.forEach((s, i) => {
                        response += `${i + 1}. "${s.question}"\n`;
                    });
                } else {
                    response += "Try asking about:\n";
                    response += "• Math: fractions, algebra, geometry\n";
                    response += "• Science: photosynthesis, human body\n";
                    response += "• English: grammar, tenses\n";
                    response += "• GK: capitals, famous people\n";
                }

                this.addMessage('bot', response, true);
                this.saveMessage(query, response);
            }
        }

        addMessage(role, text, isError = false) {
            const container = document.getElementById('academic-messages');
            const msg = document.createElement('div');
            msg.className = `message ${role}${isError ? ' error' : ''}`;
            msg.textContent = text;
            container.appendChild(msg);
            container.scrollTop = container.scrollHeight;
        }

        saveMessage(question, answer) {
            this.messages.push({
                question,
                answer,
                timestamp: Date.now()
            });

            // Keep only last 50 messages
            if (this.messages.length > 50) {
                this.messages = this.messages.slice(-50);
            }

            localStorage.setItem('academic_chatbot_history', JSON.stringify(this.messages));
        }

        loadHistory() {
            // Optional: display recent history
            console.log(`📚 Loaded ${this.messages.length} messages from history`);
        }

        clearHistory() {
            this.messages = [];
            localStorage.removeItem('academic_chatbot_history');
            document.getElementById('academic-messages').innerHTML = `
                <div class="welcome-msg">
                    <p>History cleared! Start fresh 👋</p>
                </div>
            `;
        }
    }

    // ==========================================
    // INITIALIZE
    // ==========================================
    window.academicChatbot = new AcademicChatbot();

    // Expose functions for admin use
    window.AcademicBotAdmin = {
        getKnowledgeBase: () => knowledgeBase,
        getStats: () => ({
            totalQuestions: Object.values(knowledgeBase).reduce((sum, subject) => 
                sum + Object.values(subject).reduce((s, cls) => s + Object.keys(cls).length, 0), 0),
            subjects: Object.keys(knowledgeBase),
            historyCount: window.academicChatbot.messages.length
        }),
        clearHistory: () => window.academicChatbot.clearHistory()
    };

})();