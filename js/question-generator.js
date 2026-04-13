// ==========================================
// DYNAMIC QUESTION GENERATOR
// ==========================================

const QuestionGenerator = {
    // Question templates by subject
    templates: {
        Mathematics: {
            easy: [
                { question: 'What is 15 + 27?', options: ['40', '41', '42', '43'], correct: 2 },
                { question: 'What is 8 × 7?', options: ['54', '56', '58', '48'], correct: 1 },
                { question: 'What is 100 - 37?', options: ['63', '67', '73', '53'], correct: 0 },
                { question: 'What is 12 ÷ 4?', options: ['2', '3', '4', '6'], correct: 1 },
                { question: 'What is 9 + 16?', options: ['23', '24', '25', '26'], correct: 2 }
            ],
            medium: [
                { question: 'What is 25% of 80?', options: ['15', '20', '25', '30'], correct: 1 },
                { question: 'If 3x + 5 = 20, what is x?', options: ['3', '4', '5', '6'], correct: 2 },
                { question: 'What is 7²?', options: ['42', '45', '49', '56'], correct: 2 },
                { question: 'What is the square root of 144?', options: ['10', '11', '12', '14'], correct: 2 },
                { question: 'What is 15% of 200?', options: ['20', '25', '30', '35'], correct: 2 }
            ],
            hard: [
                { question: 'What is the discriminant of x² + 5x + 6 = 0?', options: ['0', '1', '4', '9'], correct: 1 },
                { question: 'What is sin(30°)?', options: ['0', '0.5', '0.707', '1'], correct: 1 },
                { question: 'What is the derivative of 3x²?', options: ['3x', '6x', 'x³', '9x'], correct: 1 },
                { question: 'What is the value of π (pi) approximately?', options: ['3.12', '3.14', '3.16', '3.18'], correct: 1 },
                { question: 'What is 2³ + 3²?', options: ['15', '16', '17', '18'], correct: 2 }
            ]
        },
        
        Science: {
            easy: [
                { question: 'What is the chemical symbol for water?', options: ['H2O', 'CO2', 'NaCl', 'O2'], correct: 0 },
                { question: 'What planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 1 },
                { question: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correct: 2 },
                { question: 'What is the speed of light approximately?', options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '100,000 km/s'], correct: 0 },
                { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'], correct: 2 }
            ],
            medium: [
                { question: 'What is the atomic number of Carbon?', options: ['4', '6', '8', '12'], correct: 1 },
                { question: 'Which force keeps planets in orbit around the Sun?', options: ['Electromagnetic', 'Nuclear', 'Gravitational', 'Friction'], correct: 2 },
                { question: 'What is the pH of pure water?', options: ['5', '7', '9', '11'], correct: 1 },
                { question: 'What is the most abundant gas in Earth\'s atmosphere?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'], correct: 2 },
                { question: 'How many chromosomes do humans have?', options: ['23', '44', '46', '48'], correct: 2 }
            ],
            hard: [
                { question: 'What is the Heisenberg Uncertainty Principle related to?', options: ['Energy conservation', 'Position and momentum', 'Wave-particle duality', 'Thermodynamics'], correct: 1 },
                { question: 'What is the valency of Sulphur in H2SO4?', options: ['2', '4', '6', '8'], correct: 2 },
                { question: 'What type of bond is formed between Na and Cl?', options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'], correct: 1 },
                { question: 'What is the SI unit of electric current?', options: ['Volt', 'Watt', 'Ampere', 'Ohm'], correct: 2 },
                { question: 'What is the process by which plants make food?', options: ['Respiration', 'Fermentation', 'Photosynthesis', 'Oxidation'], correct: 2 }
            ]
        },
        
        Programming: {
            categories: {
                Python: {
                    easy: [
                        { question: 'What is the correct file extension for Python files?', options: ['.py', '.python', '.pt', '.pn'], correct: 0 },
                        { question: 'Which keyword is used to define a function in Python?', options: ['func', 'def', 'function', 'define'], correct: 1 },
                        { question: 'What is the output of print(2 ** 3)?', options: ['6', '8', '9', 'Error'], correct: 1 },
                        { question: 'Which symbol is used for single-line comments in Python?', options: ['//', '#', '/*', '--'], correct: 1 },
                        { question: 'What data type is the result of: type(3.14)?', options: ['int', 'float', 'double', 'decimal'], correct: 1 }
                    ],
                    medium: [
                        { question: 'What is a list comprehension in Python?', options: ['A way to create lists', 'A loop structure', 'A function', 'An error'], correct: 0 },
                        { question: 'Which method adds an element to the end of a list?', options: ['add()', 'append()', 'insert()', 'extend()'], correct: 1 },
                        { question: 'What does the "self" keyword represent in Python classes?', options: ['The class itself', 'The instance', 'The parent class', 'Nothing'], correct: 1 },
                        { question: 'What is the purpose of __init__ method?', options: ['Destructor', 'Constructor', 'Modifier', 'Accessor'], correct: 1 },
                        { question: 'Which module is used for regular expressions?', options: ['regex', 're', 'regexp', 'pattern'], correct: 1 }
                    ],
                    hard: [
                        { question: 'What is a decorator in Python?', options: ['A design pattern', 'A function modifier', 'A class method', 'A variable'], correct: 1 },
                        { question: 'What is the Global Interpreter Lock (GIL)?', options: ['A threading mutex', 'A lock type', 'A memory lock', 'A file lock'], correct: 0 },
                        { question: 'What is the difference between deep copy and shallow copy?', options: ['No difference', 'Nested objects handling', 'Speed', 'Memory'], correct: 1 },
                        { question: 'What is metaclass in Python?', options: ['A class of class', 'A base class', 'An abstract class', 'A final class'], correct: 0 },
                        { question: 'What does *args and **kwargs mean?', options: ['Pointers', 'Variable arguments', 'Errors', 'Types'], correct: 1 }
                    ]
                },
                C: {
                    easy: [
                        { question: 'Who developed the C programming language?', options: ['James Gosling', 'Dennis Ritchie', 'Bjarne Stroustrup', 'Guido van Rossum'], correct: 1 },
                        { question: 'Which symbol is used for pointer declaration in C?', options: ['&', '*', '#', '@'], correct: 1 },
                        { question: 'What is the size of int in C (typically)?', options: ['2 bytes', '4 bytes', '8 bytes', 'Depends on system'], correct: 3 },
                        { question: 'Which function is used for input in C?', options: ['print()', 'scanf()', 'input()', 'read()'], correct: 1 },
                        { question: 'What is the correct format specifier for int?', options: ['%f', '%d', '%c', '%s'], correct: 1 }
                    ],
                    medium: [
                        { question: 'What is a pointer in C?', options: ['A variable storing address', 'A data type', 'A function', 'An array'], correct: 0 },
                        { question: 'What does malloc() do?', options: ['Allocates memory', 'Frees memory', 'Copies memory', 'Checks memory'], correct: 0 },
                        { question: 'What is the difference between = and ==?', options: ['No difference', 'Assignment vs Comparison', 'Both assignment', 'Both comparison'], correct: 1 },
                        { question: 'What is a structure in C?', options: ['User-defined data type', 'A function', 'A loop', 'A pointer'], correct: 0 },
                        { question: 'Which header file is needed for printf?', options: ['stdlib.h', 'stdio.h', 'string.h', 'math.h'], correct: 1 }
                    ],
                    hard: [
                        { question: 'What is a function pointer?', options: ['Pointer to function', 'Return type', 'Parameter', 'Variable'], correct: 0 },
                        { question: 'What is dynamic memory allocation?', options: ['Runtime allocation', 'Compile time', 'Static', 'Constant'], correct: 0 },
                        { question: 'What is a dangling pointer?', options: ['Points to freed memory', 'Null pointer', 'Wild pointer', 'Void pointer'], correct: 0 },
                        { question: 'What is the use of typedef?', options: ['Create alias', 'Define variable', 'Declare function', 'Include file'], correct: 0 },
                        { question: 'What is extern keyword used for?', options: ['External linkage', 'Internal variable', 'Static variable', 'Constant'], correct: 0 }
                    ]
                },
                'C++': {
                    easy: [
                        { question: 'Who developed C++?', options: ['Dennis Ritchie', 'Bjarne Stroustrup', 'James Gosling', 'Ken Thompson'], correct: 1 },
                        { question: 'What is the correct extension for C++ files?', options: ['.c', '.cpp', '.cc', '.cxx'], correct: 1 },
                        { question: 'Which operator is used for output in C++?', options: ['<<', '>>', '<', '>'], correct: 0 },
                        { question: 'What is a class in C++?', options: ['User-defined type', 'Function', 'Variable', 'Loop'], correct: 0 },
                        { question: 'Which keyword is used to create objects?', options: ['new', 'class', 'object', 'create'], correct: 0 }
                    ],
                    medium: [
                        { question: 'What is inheritance in C++?', options: ['Code reuse mechanism', 'A loop', 'A function', 'A variable'], correct: 0 },
                        { question: 'What is polymorphism?', options: ['Multiple forms', 'Single form', 'No form', 'Error'], correct: 0 },
                        { question: 'What is a constructor?', options: ['Initializes objects', 'Destroys objects', 'Modifies objects', 'Copies objects'], correct: 0 },
                        { question: 'What is the difference between struct and class?', options: ['Default access', 'No difference', 'Size', 'Speed'], correct: 0 },
                        { question: 'What is a virtual function?', options: ['Override in derived class', 'Static function', 'Private function', 'Constant'], correct: 0 }
                    ],
                    hard: [
                        { question: 'What is multiple inheritance?', options: ['Inherit from multiple classes', 'Single inherit', 'No inherit', 'Error'], correct: 0 },
                        { question: 'What is the diamond problem?', options: ['Ambiguity in multiple inheritance', 'A loop', 'A bug', 'Memory leak'], correct: 0 },
                        { question: 'What are templates in C++?', options: ['Generic programming', 'Specific types', 'Classes only', 'Functions only'], correct: 0 },
                        { question: 'What is RAII?', options: ['Resource management idiom', 'A class', 'A function', 'An error'], correct: 0 },
                        { question: 'What is move semantics?', options: ['Transfer resources', 'Copy resources', 'Delete resources', 'Allocate'], correct: 0 }
                    ]
                },
                Java: {
                    easy: [
                        { question: 'Who developed Java?', options: ['Microsoft', 'Sun Microsystems', 'Apple', 'IBM'], correct: 1 },
                        { question: 'What is the extension of Java source files?', options: ['.java', '.jav', '.j', '.js'], correct: 0 },
                        { question: 'Which keyword is used for inheritance in Java?', options: ['inherits', 'extends', 'implements', 'uses'], correct: 1 },
                        { question: 'What is JVM?', options: ['Java Virtual Machine', 'Java Variable Method', 'Java Version Manager', 'Java Visual Model'], correct: 0 },
                        { question: 'Is Java platform independent?', options: ['Yes', 'No', 'Sometimes', 'Only on Windows'], correct: 0 }
                    ],
                    medium: [
                        { question: 'What is an interface in Java?', options: ['Contract for classes', 'A class', 'A method', 'A variable'], correct: 0 },
                        { question: 'What is the difference between == and .equals()?', options: ['Reference vs Content', 'No difference', 'Both same', 'Speed'], correct: 0 },
                        { question: 'What is an abstract class?', options: ['Cannot be instantiated', 'Final class', 'Static class', 'Private class'], correct: 0 },
                        { question: 'What is exception handling?', options: ['Runtime error management', 'Compile error', 'Syntax error', 'Logic error'], correct: 0 },
                        { question: 'What is the purpose of final keyword?', options: ['Cannot be changed', 'Can be changed', 'Variable type', 'Access modifier'], correct: 0 }
                    ],
                    hard: [
                        { question: 'What is garbage collection in Java?', options: ['Automatic memory management', 'Manual deletion', 'File cleanup', 'Cache clear'], correct: 0 },
                        { question: 'What are generics in Java?', options: ['Type parameters', 'Specific types', 'Variables', 'Methods'], correct: 0 },
                        { question: 'What is multithreading?', options: ['Concurrent execution', 'Single execution', 'Sequential', 'Parallel arrays'], correct: 0 },
                        { question: 'What is serialization?', options: ['Object to byte stream', 'String conversion', 'Array sorting', 'File reading'], correct: 0 },
                        { question: 'What is the volatile keyword?', options: ['Thread visibility', 'Constant value', 'Private variable', 'Static method'], correct: 0 }
                    ]
                },
                OS: {
                    easy: [
                        { question: 'What does OS stand for?', options: ['Operating System', 'Open Source', 'Operating Software', 'Open System'], correct: 0 },
                        { question: 'Which is an example of an OS?', options: ['Linux', 'Python', 'Chrome', 'Word'], correct: 0 },
                        { question: 'What is the kernel?', options: ['Core of OS', 'User interface', 'Application', 'Driver'], correct: 0 },
                        { question: 'What is a process?', options: ['Program in execution', 'A file', 'A variable', 'A function'], correct: 0 },
                        { question: 'What is multiprogramming?', options: ['Multiple programs in memory', 'Single program', 'No program', 'Error'], correct: 0 }
                    ],
                    medium: [
                        { question: 'What is deadlock?', options: ['Processes waiting indefinitely', 'Fast execution', 'Memory full', 'CPU overload'], correct: 0 },
                        { question: 'What is virtual memory?', options: ['Extension of RAM', 'ROM', 'Cache', 'Register'], correct: 0 },
                        { question: 'What is scheduling?', options: ['Process execution order', 'File management', 'Memory allocation', 'I/O handling'], correct: 0 },
                        { question: 'What is a semaphore?', options: ['Synchronization tool', 'Memory type', 'Process type', 'File type'], correct: 0 },
                        { question: 'What is thrashing?', options: ['Excessive paging', 'Fast execution', 'Memory full', 'CPU idle'], correct: 0 }
                    ],
                    hard: [
                        { question: 'What is the Banker\'s algorithm used for?', options: ['Deadlock avoidance', 'Memory allocation', 'CPU scheduling', 'File management'], correct: 0 },
                        { question: 'What is Belady\'s anomaly?', options: ['More frames, more faults', 'Less frames, more faults', 'Cache hit', 'Memory leak'], correct: 0 },
                        { question: 'What is a race condition?', options: ['Concurrent access issue', 'Fast execution', 'Slow process', 'Memory error'], correct: 0 },
                        { question: 'What is context switching?', options: ['Save/restore process state', 'File switching', 'Memory swap', 'CPU upgrade'], correct: 0 },
                        { question: 'What is a critical section?', options: ['Shared resource access code', 'Important function', 'Main method', 'Loop'], correct: 0 }
                    ]
                },
                DSA: {
                    easy: [
                        { question: 'What does DSA stand for?', options: ['Data Structures & Algorithms', 'Digital System Architecture', 'Dynamic System Analysis', 'Data System Access'], correct: 0 },
                        { question: 'Which data structure uses FIFO?', options: ['Queue', 'Stack', 'Array', 'Tree'], correct: 0 },
                        { question: 'Which data structure uses LIFO?', options: ['Stack', 'Queue', 'Linked List', 'Graph'], correct: 0 },
                        { question: 'What is an array?', options: ['Contiguous memory', 'Non-contiguous', 'Linked', 'Tree'], correct: 0 },
                        { question: 'What is the time complexity of binary search?', options: ['O(log n)', 'O(n)', 'O(n²)', 'O(1)'], correct: 0 }
                    ],
                    medium: [
                        { question: 'What is a linked list?', options: ['Nodes with pointers', 'Array', 'Tree', 'Graph'], correct: 0 },
                        { question: 'What is a binary tree?', options: ['Max 2 children per node', 'Unlimited children', 'No children', 'One child'], correct: 0 },
                        { question: 'What is hashing?', options: ['Key to value mapping', 'Sorting', 'Searching', 'Traversing'], correct: 0 },
                        { question: 'Which sorting algorithm is fastest on average?', options: ['Quick Sort', 'Bubble Sort', 'Selection Sort', 'Insertion Sort'], correct: 0 },
                        { question: 'What is a stack overflow?', options: ['Stack memory full', 'Fast execution', 'Memory leak', 'CPU error'], correct: 0 }
                    ],
                    hard: [
                        { question: 'What is dynamic programming?', options: ['Optimal substructure + overlap', 'Random solving', 'Brute force', 'Greedy'], correct: 0 },
                        { question: 'What is the space complexity of recursive Fibonacci?', options: ['O(n)', 'O(1)', 'O(2^n)', 'O(log n)'], correct: 2 },
                        { question: 'What is an AVL tree?', options: ['Self-balancing BST', 'Unbalanced tree', 'Binary tree', 'Graph'], correct: 0 },
                        { question: 'What is Dijkstra\'s algorithm used for?', options: ['Shortest path', 'Sorting', 'Searching', 'Hashing'], correct: 0 },
                        { question: 'What is the time complexity of merge sort?', options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'], correct: 0 }
                    ]
                },
                'Web Development': {
                    easy: [
                        { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], correct: 0 },
                        { question: 'Which tag is used for the largest heading in HTML?', options: ['<h6>', '<head>', '<h1>', '<header>'], correct: 2 },
                        { question: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'], correct: 1 },
                        { question: 'Which HTML tag is used to create a hyperlink?', options: ['<link>', '<a>', '<href>', '<url>'], correct: 1 },
                        { question: 'What is the correct file extension for JavaScript files?', options: ['.java', '.js', '.script', '.jscript'], correct: 1 }
                    ],
                    medium: [
                        { question: 'Which CSS property changes text color?', options: ['text-color', 'font-color', 'color', 'text-style'], correct: 2 },
                        { question: 'What is the purpose of the <script> tag in HTML?', options: ['Add styles', 'Add JavaScript', 'Add images', 'Add metadata'], correct: 1 },
                        { question: 'Which JavaScript keyword declares a constant variable?', options: ['var', 'let', 'const', 'static'], correct: 2 },
                        { question: 'What does DOM stand for?', options: ['Data Object Model', 'Document Object Model', 'Digital Object Method', 'Dynamic Object Mode'], correct: 1 },
                        { question: 'Which CSS selector targets an element by ID?', options: ['.', '#', '*', '@'], correct: 1 }
                    ],
                    hard: [
                        { question: 'What is event bubbling in JavaScript?', options: ['Event propagation from child to parent', 'Event on click only', 'Event on hover', 'Event cancellation'], correct: 0 },
                        { question: 'What is the box model in CSS?', options: ['Content, padding, border, margin', 'Width and height only', 'Display and position', 'Color and font'], correct: 0 },
                        { question: 'What does AJAX stand for?', options: ['Asynchronous JavaScript and XML', 'Advanced JavaScript and XML', 'Async JSON and XML', 'Active JavaScript XML'], correct: 0 },
                        { question: 'Which HTTP method is used to send data to a server?', options: ['GET', 'POST', 'DELETE', 'HEAD'], correct: 1 },
                        { question: 'What is a media query in CSS used for?', options: ['Responsive design', 'Video playback', 'Audio control', 'Image loading'], correct: 0 }
                    ]
                }
            }
        },
        
        Physics: {
            easy: [
                { question: 'What is the unit of force?', options: ['Watt', 'Newton', 'Joule', 'Pascal'], correct: 1 },
                { question: 'What is the acceleration due to gravity on Earth?', options: ['8.9 m/s²', '9.8 m/s²', '10.8 m/s²', '7.8 m/s²'], correct: 1 },
                { question: 'What is Newton\'s first law also known as?', options: ['Law of acceleration', 'Law of inertia', 'Law of reaction', 'Law of gravity'], correct: 1 },
                { question: 'What is the unit of energy?', options: ['Newton', 'Watt', 'Joule', 'Ampere'], correct: 2 },
                { question: 'Light travels fastest in?', options: ['Water', 'Glass', 'Vacuum', 'Air'], correct: 2 }
            ],
            medium: [
                { question: 'What is the formula for kinetic energy?', options: ['mv', '½mv²', 'mgh', 'F×d'], correct: 1 },
                { question: 'What is the unit of electric resistance?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], correct: 2 },
                { question: 'What does E=mc² represent?', options: ['Kinetic energy', 'Mass-energy equivalence', 'Potential energy', 'Thermal energy'], correct: 1 },
                { question: 'What is the SI unit of power?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correct: 2 },
                { question: 'What type of wave is sound?', options: ['Transverse', 'Longitudinal', 'Electromagnetic', 'Stationary'], correct: 1 }
            ],
            hard: [
                { question: 'What is the Heisenberg Uncertainty Principle?', options: ['Energy conservation', 'Position-momentum limit', 'Wave-particle duality', 'Entropy increase'], correct: 1 },
                { question: 'What is the photoelectric effect?', options: ['Light absorption', 'Electron emission by light', 'Light reflection', 'Light refraction'], correct: 1 },
                { question: 'What is the unit of magnetic flux?', options: ['Tesla', 'Weber', 'Henry', 'Gauss'], correct: 1 },
                { question: 'What is the first law of thermodynamics?', options: ['Entropy always increases', 'Energy conservation', 'Absolute zero unreachable', 'Heat flows hot to cold'], correct: 1 },
                { question: 'What is the de Broglie wavelength formula?', options: ['λ=h/mv', 'λ=mc²', 'λ=F/q', 'λ=vt'], correct: 0 }
            ]
        },
        
        English: {
            easy: [
                { question: 'What is the past tense of "run"?', options: ['Runned', 'Ran', 'Running', 'Runs'], correct: 1 },
                { question: 'Which is a noun?', options: ['Quickly', 'Beautiful', 'Happiness', 'Run'], correct: 2 },
                { question: 'What is the plural of "child"?', options: ['Childs', 'Children', 'Childrens', 'Childes'], correct: 1 },
                { question: 'Which word is an adjective?', options: ['Quickly', 'Happy', 'Jump', 'Table'], correct: 1 },
                { question: 'What is the opposite of "ancient"?', options: ['Old', 'Modern', 'Classic', 'Traditional'], correct: 1 }
            ],
            medium: [
                { question: 'What is a synonym for "ubiquitous"?', options: ['Rare', 'Omnipresent', 'Unique', 'Specific'], correct: 1 },
                { question: 'What figure of speech is "time is money"?', options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'], correct: 1 },
                { question: 'Which sentence is in passive voice?', options: ['The cat chased the mouse', 'The mouse was chased', 'The cat is chasing', 'The mouse ran'], correct: 1 },
                { question: 'What is the superlative form of "good"?', options: ['Gooder', 'Goodest', 'Better', 'Best'], correct: 3 },
                { question: 'What is an antonym for "benevolent"?', options: ['Kind', 'Malevolent', 'Generous', 'Compassionate'], correct: 1 }
            ],
            hard: [
                { question: 'What is the literary device in "the wind whispered"?', options: ['Metaphor', 'Simile', 'Personification', 'Alliteration'], correct: 2 },
                { question: 'What is an oxymoron?', options: ['Exaggeration', 'Contradictory terms', 'Comparison', 'Repetition'], correct: 1 },
                { question: 'Which is an example of alliteration?', options: ['Dark as night', 'Peter Piper picked', 'Time flies', 'LOUD noise'], correct: 1 },
                { question: 'What is the etymology of a word?', options: ['Its meaning', 'Its origin', 'Its pronunciation', 'Its spelling'], correct: 1 },
                { question: 'What is a portmanteau?', options: ['A type of poem', 'Blended word', 'Foreign word', 'Old word'], correct: 1 }
            ]
        },
        
        Chemistry: {
            easy: [
                { question: 'What is the chemical symbol for Gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correct: 2 },
                { question: 'What is the atomic number of Hydrogen?', options: ['1', '2', '3', '4'], correct: 0 },
                { question: 'What type of bond shares electrons?', options: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'], correct: 1 },
                { question: 'What is the most reactive metal?', options: ['Iron', 'Gold', 'Francium', 'Copper'], correct: 2 },
                { question: 'What is table salt chemically?', options: ['NaCl', 'KCl', 'CaCl', 'NaF'], correct: 0 }
            ],
            medium: [
                { question: 'What is the valency of Oxygen?', options: ['1', '2', '3', '4'], correct: 1 },
                { question: 'What is an acid with pH less than 7?', options: ['Base', 'Neutral', 'Acid', 'Salt'], correct: 2 },
                { question: 'What gas is released in photosynthesis?', options: ['CO2', 'N2', 'O2', 'H2'], correct: 2 },
                { question: 'What is the molecular formula of methane?', options: ['CH4', 'C2H6', 'C3H8', 'CO2'], correct: 0 },
                { question: 'What type of reaction is combustion?', options: ['Endothermic', 'Exothermic', 'Neutral', 'Decomposition'], correct: 1 }
            ],
            hard: [
                { question: 'What is Avogadro\'s number?', options: ['6.022 × 10²³', '3.14 × 10²³', '9.8 × 10²³', '1.6 × 10²³'], correct: 0 },
                { question: 'What is the electron configuration of Carbon?', options: ['2,4', '2,6', '2,8', '2,2'], correct: 0 },
                { question: 'What is Le Chatelier\'s principle about?', options: ['Reaction rates', 'Equilibrium shift', 'Bond energy', 'Electron transfer'], correct: 1 },
                { question: 'What is an isotope?', options: ['Same protons, different neutrons', 'Same neutrons, different protons', 'Same electrons', 'Same mass'], correct: 0 },
                { question: 'What is the shape of methane molecule?', options: ['Linear', 'Trigonal', 'Tetrahedral', 'Octahedral'], correct: 2 }
            ]
        },
        
        Biology: {
            easy: [
                { question: 'What is the basic unit of life?', options: ['Atom', 'Molecule', 'Cell', 'Organ'], correct: 2 },
                { question: 'What organelle contains DNA?', options: ['Ribosome', 'Nucleus', 'Mitochondria', 'Golgi'], correct: 1 },
                { question: 'What is photosynthesis?', options: ['Food breakdown', 'Food production using light', 'Cell division', 'Protein synthesis'], correct: 1 },
                { question: 'How many chambers does the human heart have?', options: ['2', '3', '4', '5'], correct: 2 },
                { question: 'What is the largest organ in the human body?', options: ['Liver', 'Brain', 'Skin', 'Heart'], correct: 2 }
            ],
            medium: [
                { question: 'What is DNA replication?', options: ['Protein synthesis', 'DNA copying', 'Cell division', 'RNA production'], correct: 1 },
                { question: 'What is the function of ribosomes?', options: ['Energy production', 'Protein synthesis', 'DNA storage', 'Waste removal'], correct: 1 },
                { question: 'What is natural selection?', options: ['Random mutation', 'Survival of fittest', 'Genetic drift', 'Gene flow'], correct: 1 },
                { question: 'What is the role of enzymes?', options: ['Energy storage', 'Speed up reactions', 'DNA repair', 'Cell structure'], correct: 1 },
                { question: 'What is osmosis?', options: ['Active transport', 'Water movement', 'Protein synthesis', 'Cell division'], correct: 1 }
            ],
            hard: [
                { question: 'What is the Krebs cycle?', options: ['DNA replication', 'Cellular respiration', 'Protein synthesis', 'Photosynthesis'], correct: 1 },
                { question: 'What is a codon?', options: ['Amino acid', '3-base sequence', 'Protein', 'Enzyme'], correct: 1 },
                { question: 'What is the function of tRNA?', options: ['Store genetic info', 'Transport amino acids', 'Catalyze reactions', 'Cell signaling'], correct: 1 },
                { question: 'What is genetic drift?', options: ['Natural selection', 'Random allele frequency change', 'Mutation', 'Gene flow'], correct: 1 },
                { question: 'What is the Hardy-Weinberg principle about?', options: ['Evolution', 'Population genetics equilibrium', 'Mutation rates', 'Natural selection'], correct: 1 }
            ]
        },
        
        'General Knowledge': {
            easy: [
                { question: 'What is the capital of India?', options: ['Mumbai', 'Delhi', 'Kolkata', 'Chennai'], correct: 1 },
                { question: 'How many continents are there?', options: ['5', '6', '7', '8'], correct: 2 },
                { question: 'What is the national animal of India?', options: ['Lion', 'Tiger', 'Elephant', 'Leopard'], correct: 1 },
                { question: 'Which is the largest ocean?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3 },
                { question: 'What is the currency of USA?', options: ['Euro', 'Pound', 'Dollar', 'Yen'], correct: 2 }
            ],
            medium: [
                { question: 'Who wrote the Indian national anthem?', options: ['Rabindranath Tagore', 'Bankim Chandra', 'Sarojini Naidu', 'Subhash Chandra Bose'], correct: 0 },
                { question: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Ganga', 'Yangtze'], correct: 1 },
                { question: 'Which planet has the most moons?', options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], correct: 1 },
                { question: 'What is the largest desert in the world?', options: ['Sahara', 'Arabian', 'Gobi', 'Antarctica'], correct: 3 },
                { question: 'Who invented the telephone?', options: ['Thomas Edison', 'Alexander Graham Bell', 'Nikola Tesla', 'Guglielmo Marconi'], correct: 1 }
            ],
            hard: [
                { question: 'What is the deepest point in the ocean?', options: ['Mariana Trench', 'Puerto Rico Trench', 'Java Trench', 'Philippine Trench'], correct: 0 },
                { question: 'Which country has the most time zones?', options: ['Russia', 'USA', 'France', 'China'], correct: 2 },
                { question: 'What is the smallest country in the world?', options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], correct: 1 },
                { question: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'], correct: 1 },
                { question: 'What is the hardest natural substance?', options: ['Gold', 'Iron', 'Diamond', 'Platinum'], correct: 2 }
            ]
        },
        
        History: {
            easy: [
                { question: 'Who was the first President of India?', options: ['Jawaharlal Nehru', 'Rajendra Prasad', 'Sardar Patel', 'Subhash Chandra Bose'], correct: 1 },
                { question: 'In which year did India gain independence?', options: ['1945', '1946', '1947', '1948'], correct: 2 },
                { question: 'Who built the Taj Mahal?', options: ['Akbar', 'Jahangir', 'Shah Jahan', 'Aurangzeb'], correct: 2 },
                { question: 'What is the ancient language of India?', options: ['Hindi', 'Sanskrit', 'Tamil', 'Prakrit'], correct: 1 },
                { question: 'Who was known as the Iron Man of India?', options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'Subhash Chandra Bose'], correct: 2 }
            ],
            medium: [
                { question: 'Which dynasty built the Great Wall of China?', options: ['Han', 'Tang', 'Ming', 'Qing'], correct: 2 },
                { question: 'Who discovered America?', options: ['Christopher Columbus', 'Vasco da Gama', 'Marco Polo', 'Amerigo Vespucci'], correct: 0 },
                { question: 'When did World War II end?', options: ['1943', '1944', '1945', '1946'], correct: 2 },
                { question: 'Who was the first Mughal emperor?', options: ['Akbar', 'Humayun', 'Babur', 'Jahangir'], correct: 2 },
                { question: 'What was the ancient name of Patna?', options: ['Pataliputra', 'Taxila', 'Ujjain', 'Varanasi'], correct: 0 }
            ],
            hard: [
                { question: 'When was the Battle of Plassey fought?', options: ['1755', '1756', '1757', '1758'], correct: 2 },
                { question: 'Who wrote "The History of the Decline and Fall of the Roman Empire"?', options: ['Edward Gibbon', 'Thomas Carlyle', 'Arnold Toynbee', 'Herodotus'], correct: 0 },
                { question: 'Which treaty ended World War I?', options: ['Treaty of Paris', 'Treaty of Versailles', 'Treaty of Vienna', 'Treaty of Berlin'], correct: 1 },
                { question: 'Who was the founder of the Maurya Empire?', options: ['Ashoka', 'Bindusara', 'Chandragupta Maurya', 'Bimbisara'], correct: 2 },
                { question: 'In which year did the Berlin Wall fall?', options: ['1987', '1988', '1989', '1990'], correct: 2 }
            ]
        }
    },
    
    // Map academic levels to subjects
    subjectMap: {
        school: ['Mathematics', 'Science', 'English', 'General Knowledge', 'History'],
        highSchool: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
        college: ['C Programming', 'Data Structures & Algorithms', 'Java', 'Python', 'Operating Systems', 'Web Development']
    },
    
    // Default fallback questions when category is not found
    defaultQuestions: {
        easy: [
            { question: 'What is the output of 2 + 2?', options: ['3', '4', '5', '6'], correct: 1 },
            { question: 'What is the chemical symbol for water?', options: ['H2O', 'CO2', 'NaCl', 'O2'], correct: 0 },
            { question: 'What planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 1 },
            { question: 'What is the past tense of "run"?', options: ['Runned', 'Ran', 'Running', 'Runs'], correct: 1 },
            { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'], correct: 2 },
            { question: 'What is 15% of 200?', options: ['20', '30', '25', '35'], correct: 1 },
            { question: 'Which gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correct: 2 },
            { question: 'What is the plural of "child"?', options: ['Childs', 'Children', 'Childrens', 'Childes'], correct: 1 },
            { question: 'What is the unit of force?', options: ['Watt', 'Newton', 'Joule', 'Pascal'], correct: 1 },
            { question: 'Which is a noun?', options: ['Quickly', 'Beautiful', 'Happiness', 'Run'], correct: 2 }
        ],
        medium: [
            { question: 'What is the atomic number of Carbon?', options: ['4', '6', '8', '12'], correct: 1 },
            { question: 'What is the formula for kinetic energy?', options: ['mv', '½mv²', 'mgh', 'F×d'], correct: 1 },
            { question: 'What is a synonym for "ubiquitous"?', options: ['Rare', 'Omnipresent', 'Unique', 'Specific'], correct: 1 },
            { question: 'What is the pH of pure water?', options: ['5', '7', '9', '11'], correct: 1 },
            { question: 'What is the value of x in 2x + 5 = 15?', options: ['5', '10', '7.5', '20'], correct: 0 },
            { question: 'Which force keeps planets in orbit around the Sun?', options: ['Electromagnetic', 'Nuclear', 'Gravitational', 'Friction'], correct: 2 },
            { question: 'What figure of speech is "time is money"?', options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'], correct: 1 },
            { question: 'How many chromosomes do humans have?', options: ['23', '44', '46', '48'], correct: 2 },
            { question: 'What is the area of a rectangle with length 8 and width 5?', options: ['13', '26', '40', '45'], correct: 2 },
            { question: 'What type of bond is formed between Na and Cl?', options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'], correct: 1 }
        ],
        hard: [
            { question: 'What is the Heisenberg Uncertainty Principle related to?', options: ['Energy conservation', 'Position and momentum', 'Wave-particle duality', 'Thermodynamics'], correct: 1 },
            { question: 'What is the derivative of x²?', options: ['x', '2x', 'x²', '2'], correct: 1 },
            { question: 'What is an oxymoron?', options: ['Exaggeration', 'Contradictory terms', 'Comparison', 'Repetition'], correct: 1 },
            { question: 'What is the valency of Sulphur in H2SO4?', options: ['2', '4', '6', '8'], correct: 2 },
            { question: 'What is the integral of 2x?', options: ['x²', 'x² + C', '2x²', '2'], correct: 1 },
            { question: 'What is the photoelectric effect?', options: ['Light absorption', 'Electron emission by light', 'Light reflection', 'Light refraction'], correct: 1 },
            { question: 'What is the etymology of a word?', options: ['Its meaning', 'Its origin', 'Its pronunciation', 'Its spelling'], correct: 1 },
            { question: 'What is the SI unit of electric current?', options: ['Volt', 'Watt', 'Ampere', 'Ohm'], correct: 2 },
            { question: 'What is the solution to x² - 5x + 6 = 0?', options: ['1 and 6', '2 and 3', '-2 and -3', '5 and 6'], correct: 1 },
            { question: 'What is a portmanteau?', options: ['A type of poem', 'Blended word', 'Foreign word', 'Old word'], correct: 1 }
        ]
    },
    
    // Generate questions for a subject and difficulty
    generate(subject, category = null, difficulty = 'medium', count = 5) {
        const subjectQuestions = this.templates[subject];
        
        // If subject not found, use default questions
        if (!subjectQuestions) {
            console.warn(`Subject "${subject}" not found, using default questions`);
            return this.shuffleAndSelect(this.defaultQuestions[difficulty] || this.defaultQuestions.medium, count);
        }
        
        // If subject has categories (e.g., Programming)
        if (subjectQuestions.categories) {
            if (!category) {
                // Use first available category if none specified
                category = Object.keys(subjectQuestions.categories)[0];
            }
            
            let categoryData = subjectQuestions.categories[category];
            
            // Fallback: if category not found, use first available category
            if (!categoryData) {
                console.warn(`Category "${category}" not found for ${subject}, using fallback`);
                const availableCategories = Object.keys(subjectQuestions.categories);
                if (availableCategories.length > 0) {
                    categoryData = subjectQuestions.categories[availableCategories[0]];
                } else {
                    // Ultimate fallback to default questions
                    return this.shuffleAndSelect(this.defaultQuestions[difficulty] || this.defaultQuestions.medium, count);
                }
            }
            
            const questions = categoryData[difficulty] || categoryData.medium || categoryData.easy;
            if (!questions || questions.length === 0) {
                console.warn(`No questions for ${subject}/${category}/${difficulty}, using default`);
                return this.shuffleAndSelect(this.defaultQuestions[difficulty] || this.defaultQuestions.medium, count);
            }
            return this.shuffleAndSelect(questions, count);
        }
        
        // Legacy support for non-categorized subjects
        const difficultyQuestions = subjectQuestions[difficulty] || subjectQuestions.medium || subjectQuestions.easy;
        if (!difficultyQuestions || difficultyQuestions.length === 0) {
            console.warn(`Difficulty "${difficulty}" not found for ${subject}, using default`);
            return this.shuffleAndSelect(this.defaultQuestions[difficulty] || this.defaultQuestions.medium, count);
        }
        
        return this.shuffleAndSelect(difficultyQuestions, count);
    },
    
    // Shuffle and select questions
    shuffleAndSelect(questions, count) {
        if (!questions || questions.length === 0) return [];
        
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, shuffled.length));
        
        return selected.map(q => {
            if (q.generator) {
                const generated = q.generator();
                const options = generated.generateOptions(generated.answer);
                const correctIndex = options.indexOf(generated.answer);
                
                return {
                    question: generated.question,
                    options: options.map(String),
                    correctIndex: correctIndex,
                    xpReward: q.xpReward || 20
                };
            } else {
                return {
                    question: q.question,
                    options: q.options,
                    correctIndex: q.correct,
                    xpReward: q.xpReward || 20
                };
            }
        });
    },
    
    // Generate numeric options (for math questions)
    generateNumericOptions(correct, count = 4) {
        const options = [correct];
        const range = Math.max(10, Math.abs(correct) * 0.5);
        
        while (options.length < count) {
            const offset = Math.floor(Math.random() * range) - range / 2;
            const wrong = correct + offset;
            if (!options.includes(wrong) && wrong !== correct) {
                options.push(wrong);
            }
        }
        
        // Shuffle options
        return options.sort(() => Math.random() - 0.5);
    },
    
    // Generate string options
    generateStringOptions(correct, distractors, count = 4) {
        const options = [correct];
        const shuffled = [...distractors].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < shuffled.length && options.length < count; i++) {
            if (!options.includes(shuffled[i])) {
                options.push(shuffled[i]);
            }
        }
        
        return options.sort(() => Math.random() - 0.5);
    },
    
    // Get difficulty based on user level
    getDifficultyForLevel(level) {
        if (level <= 2) return 'easy';
        if (level <= 5) return 'medium';
        return 'hard';
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionGenerator;
}
