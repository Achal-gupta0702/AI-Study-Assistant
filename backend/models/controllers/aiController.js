// AI Controller with OpenAI integration + realistic mock fallback
const mockAI = {
  chat: (messages, subject, difficulty) => {
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
    const responses = {
      python: `## Python Explanation\n\n**Python** is a high-level, interpreted programming language known for its simplicity and readability.\n\n### Key Concepts:\n\`\`\`python\n# Variables and Data Types\nname = "Alice"      # String\nage = 20           # Integer\ngpa = 8.5          # Float\nis_student = True  # Boolean\n\n# Functions\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Alice"))  # Output: Hello, Alice!\n\`\`\`\n\n### Important Points:\n- Python uses **indentation** instead of braces\n- Everything in Python is an **object**\n- Python supports OOP, functional, and procedural programming\n\n**For Exams:** Focus on list comprehensions, decorators, and generators.`,
      
      'data structure': `## Data Structures\n\n### Arrays:\n- **Fixed size** contiguous memory\n- Access: O(1), Search: O(n), Insert/Delete: O(n)\n\n### Linked Lists:\n\`\`\`python\nclass Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n\`\`\`\n\n### Time Complexities:\n| Operation | Array | LinkedList |\n|-----------|-------|------------|\n| Access    | O(1)  | O(n)       |\n| Insert    | O(n)  | O(1)       |\n| Delete    | O(n)  | O(1)       |\n\n**Exam Tip:** Always mention time and space complexity!`,
      
      'dbms': `## Database Management Systems\n\n### ACID Properties:\n- **A**tomicity: All or nothing\n- **C**onsistency: Data remains valid\n- **I**solation: Transactions are independent\n- **D**urability: Committed data persists\n\n### SQL Queries:\n\`\`\`sql\n-- SELECT with JOIN\nSELECT s.name, c.course_name \nFROM students s\nINNER JOIN courses c ON s.course_id = c.id\nWHERE s.semester = 3;\n\n-- Normalization Example (3NF)\n-- Eliminate transitive dependencies\n\`\`\`\n\n**Important Topics:** Normalization (1NF, 2NF, 3NF, BCNF), Indexing, Transactions`,
      
      'os': `## Operating Systems\n\n### CPU Scheduling Algorithms:\n1. **FCFS** (First Come First Serve)\n2. **SJF** (Shortest Job First)\n3. **Round Robin** (with time quantum)\n4. **Priority Scheduling**\n\n### Example - Round Robin:\n\`\`\`\nProcesses: P1(burst=5), P2(burst=3), P3(burst=6)\nTime Quantum = 2\n\nGantt Chart:\n| P1 | P2 | P3 | P1 | P2 | P3 | P1 | P3 |\n0    2    4    6    8    9   11   12   14\n\`\`\`\n\n**Formula:** Avg Waiting Time = (Sum of waiting times) / n`,
      
      default: `## Answer\n\nThank you for your question! Here's a comprehensive explanation:\n\n### Overview:\nThis is an important topic in B.Tech CSE curriculum. Let me break it down step by step.\n\n### Key Points:\n1. **Foundation Concepts** - Understanding the basics is crucial\n2. **Implementation Details** - How it works in practice\n3. **Real-world Applications** - Where this is used\n\n### Example:\n\`\`\`python\n# Practical implementation\ndef solve_problem(input_data):\n    # Step 1: Initialize\n    result = []\n    \n    # Step 2: Process\n    for item in input_data:\n        result.append(item * 2)\n    \n    # Step 3: Return\n    return result\n\`\`\`\n\n### Study Tips:\n- Practice problems daily\n- Understand concepts, don't memorize\n- Draw diagrams for complex topics\n\n**Exam Focus:** Be clear about definitions, advantages, disadvantages, and applications.\n\n*Difficulty level: ${difficulty} | Subject: ${subject || 'General'}*`
    };
    
    let response = responses.default;
    if (lastMsg.includes('python') || lastMsg.includes('code')) response = responses.python;
    else if (lastMsg.includes('data structure') || lastMsg.includes('array') || lastMsg.includes('linked')) response = responses['data structure'];
    else if (lastMsg.includes('dbms') || lastMsg.includes('sql') || lastMsg.includes('database')) response = responses.dbms;
    else if (lastMsg.includes('os') || lastMsg.includes('operating') || lastMsg.includes('process') || lastMsg.includes('scheduling')) response = responses.os;
    
    return response;
  },

  summarize: (text, topic) => ({
    summary: `**Summary of "${topic || 'Your Notes'}"**\n\nThis content covers essential concepts in computer science education. The material has been analyzed to extract the most important information for your exam preparation.\n\nThe text discusses fundamental principles that form the backbone of B.Tech CSE curriculum, focusing on practical applications and theoretical foundations.`,
    keyPoints: [
      'Core concepts and definitions are clearly outlined',
      'Implementation details with practical examples provided',
      'Time and space complexity analysis included',
      'Real-world applications and use cases discussed',
      'Common exam questions and patterns identified'
    ],
    importantTerms: [
      { term: 'Algorithm', definition: 'Step-by-step procedure for solving a problem' },
      { term: 'Complexity', definition: 'Measure of resources (time/space) needed by an algorithm' },
      { term: 'Data Structure', definition: 'Way of organizing data for efficient access and modification' },
      { term: 'Abstraction', definition: 'Hiding implementation details and showing only functionality' }
    ],
    examNotes: '**Exam Revision Notes:**\n\n1. Focus on definitions and formal descriptions\n2. Know the advantages and disadvantages\n3. Practice numerical problems if applicable\n4. Draw diagrams to explain complex concepts\n5. Remember edge cases and special conditions\n\n**Most likely exam questions:**',
    possibleQuestions: [
      'Define and explain the main concept with an example',
      'Compare and contrast with related concepts',
      'What are the advantages and disadvantages?',
      'Solve a numerical problem using the given method',
      'Explain the real-world applications'
    ]
  }),

  quiz: (subject, topic, count, difficulty) => {
    const quizBank = {
      'Data Structures': [
        { question: 'What is the time complexity of accessing an element in an array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correct: 0, explanation: 'Array access by index is O(1) because arrays use contiguous memory and can directly calculate the address.' },
        { question: 'Which data structure uses LIFO principle?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], correct: 1, explanation: 'Stack uses Last In First Out (LIFO) principle - the last element pushed is the first to be popped.' },
        { question: 'What is the height of a complete binary tree with n nodes?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(√n)'], correct: 1, explanation: 'A complete binary tree with n nodes has height ⌊log₂n⌋, which is O(log n).' },
        { question: 'In a Min-Heap, where is the minimum element stored?', options: ['Last node', 'Root node', 'Left child', 'Right child'], correct: 1, explanation: 'In a Min-Heap, the minimum element is always at the root node.' },
        { question: 'What is the worst case complexity of Quick Sort?', options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], correct: 2, explanation: 'Quick Sort has O(n²) worst case when the pivot is always the smallest or largest element.' }
      ],
      'DBMS': [
        { question: 'Which normal form eliminates transitive dependencies?', options: ['1NF', '2NF', '3NF', 'BCNF'], correct: 2, explanation: '3NF eliminates transitive dependencies where non-key attributes depend on other non-key attributes.' },
        { question: 'ACID stands for:', options: ['Atomic, Consistent, Isolated, Durable', 'Automatic, Consistent, Isolated, Data', 'Atomic, Complete, Isolated, Durable', 'None of these'], correct: 0, explanation: 'ACID properties ensure reliable database transactions: Atomicity, Consistency, Isolation, Durability.' },
        { question: 'Which SQL command is used to modify existing records?', options: ['INSERT', 'UPDATE', 'MODIFY', 'ALTER'], correct: 1, explanation: 'UPDATE command modifies existing records in a table using SET and WHERE clauses.' },
        { question: 'What does DDL stand for?', options: ['Data Definition Language', 'Data Design Language', 'Database Definition Language', 'Data Deployment Language'], correct: 0, explanation: 'DDL (Data Definition Language) includes commands like CREATE, ALTER, DROP for defining database structure.' },
        { question: 'Which join returns all rows from both tables?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], correct: 3, explanation: 'FULL OUTER JOIN returns all rows from both tables, with NULLs where there are no matches.' }
      ],
      'default': [
        { question: `In ${topic || subject}, which concept is most fundamental?`, options: ['Basic Operations', 'Advanced Algorithms', 'Complex Formulas', 'None of these'], correct: 0, explanation: 'Basic operations form the foundation of any concept in computer science.' },
        { question: `What is the primary purpose of ${topic || subject}?`, options: ['Efficiency improvement', 'Code readability', 'Problem solving', 'All of the above'], correct: 3, explanation: `${topic || subject} serves multiple purposes including efficiency, readability and problem-solving.` },
        { question: `Which approach is best for learning ${topic || subject}?`, options: ['Memorization only', 'Practice and understanding', 'Theory only', 'Skipping basics'], correct: 1, explanation: 'Practice with understanding is the most effective learning approach in computer science.' },
        { question: `Time complexity notation O(n) means:`, options: ['Constant time', 'Linear time', 'Quadratic time', 'Logarithmic time'], correct: 1, explanation: 'O(n) represents linear time complexity where execution time grows proportionally with input size.' },
        { question: `Which is NOT a programming paradigm?`, options: ['Object-Oriented', 'Functional', 'Procedural', 'Sequential'], correct: 3, explanation: 'Sequential is a program execution concept, not a programming paradigm.' }
      ]
    };
    
    const bank = quizBank[subject] || quizBank.default;
    const selected = bank.slice(0, Math.min(count, bank.length));
    
    return selected.map((q, i) => ({
      id: i + 1,
      question: q.question,
      options: q.options,
      correctAnswer: q.correct,
      explanation: q.explanation
    }));
  },

  flashcards: (subject, topic, count) => {
    const cardBank = {
      'Data Structures': [
        { q: 'What is a Stack?', a: 'A linear data structure that follows LIFO (Last In First Out) principle. Elements are added and removed from the same end called "top". Operations: push(), pop(), peek(). Applications: Function calls, undo operations, expression evaluation.' },
        { q: 'What is a Queue?', a: 'A linear data structure that follows FIFO (First In First Out) principle. Elements are added at rear and removed from front. Operations: enqueue(), dequeue(), peek(). Applications: BFS, job scheduling, printer queue.' },
        { q: 'Define Binary Search Tree (BST)', a: 'A binary tree where: left child < parent < right child. Search: O(log n) average, O(n) worst. In-order traversal gives sorted output. Operations: insert, delete, search.' },
        { q: 'What is Hashing?', a: 'A technique to map data to a fixed-size array using a hash function. Hash Table provides O(1) average case for search, insert, delete. Collision handling: Chaining (linked lists) or Open Addressing (linear probing).' },
        { q: 'Difference between Array and Linked List?', a: 'Array: Fixed size, contiguous memory, O(1) access, O(n) insert/delete. Linked List: Dynamic size, non-contiguous, O(n) access, O(1) insert/delete at known position.' }
      ],
      'default': [
        { q: `Define ${topic || subject}`, a: `${topic || subject} is a fundamental concept in B.Tech CSE that involves understanding core principles, practical applications, and theoretical foundations. It is essential for problem-solving and system design.` },
        { q: `What are the types of ${topic || subject}?`, a: `Types include: 1) Basic type - foundational concepts, 2) Intermediate type - applied concepts, 3) Advanced type - complex implementations. Each builds upon the previous level.` },
        { q: `Applications of ${topic || subject}`, a: `Real-world applications: Software development, system design, algorithm optimization, database management, network protocols, and artificial intelligence systems.` },
        { q: `Advantages of ${topic || subject}`, a: `Key advantages: 1) Efficiency improvement, 2) Better code organization, 3) Easier debugging, 4) Scalability, 5) Reusability, 6) Industry standard practices.` },
        { q: `Exam formula for ${topic || subject}`, a: `Key formulas and rules to remember:\n- Definition: Clear and concise\n- Properties: List all key properties\n- Complexity: Time and space analysis\n- Examples: At least one solved example\n- Applications: 2-3 real-world uses` }
      ]
    };
    
    const bank = cardBank[subject] || cardBank.default;
    return bank.slice(0, Math.min(count, bank.length)).map((c, i) => ({
      id: i + 1, question: c.q, answer: c.a, isKnown: false, needsReview: false
    }));
  }
};

exports.chat = async (req, res) => {
  try {
    const { messages, subject, difficulty = 'intermediate' } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages array is required' });
    }

    let response;

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      try {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        const systemPrompt = `You are an expert AI tutor for B.Tech CSE students in India. 
Subject: ${subject || 'Computer Science'}. 
Difficulty: ${difficulty}.
Provide clear, structured explanations with code examples when relevant.
Format responses with markdown. Include exam tips when appropriate.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'system', content: systemPrompt }, ...messages.slice(-10)],
          max_tokens: 1000,
          temperature: 0.7
        });
        response = completion.choices[0].message.content;
      } catch (apiErr) {
        console.log('OpenAI API error, using mock:', apiErr.message);
        response = mockAI.chat(messages, subject, difficulty);
      }
    } else {
      response = mockAI.chat(messages, subject, difficulty);
    }

    res.json({ success: true, response, tokensUsed: 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.summarize = async (req, res) => {
  try {
    const { text, topic, subject } = req.body;
    if (!text && !topic) {
      return res.status(400).json({ success: false, message: 'Text or topic is required' });
    }

    let result;

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      try {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        const prompt = `Analyze this study material for B.Tech CSE student.
${text ? `Text: ${text.substring(0, 3000)}` : `Topic: ${topic}`}
Subject: ${subject || 'Computer Science'}

Respond in JSON format:
{
  "summary": "2-3 paragraph summary",
  "keyPoints": ["point1", "point2", "point3", "point4", "point5"],
  "importantTerms": [{"term": "term1", "definition": "def1"}],
  "examNotes": "exam revision notes",
  "possibleQuestions": ["q1", "q2", "q3", "q4", "q5"]
}`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500
        });
        result = JSON.parse(completion.choices[0].message.content);
      } catch (apiErr) {
        result = mockAI.summarize(text, topic);
      }
    } else {
      result = mockAI.summarize(text, topic);
    }

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.generateQuiz = async (req, res) => {
  try {
    const { subject, topic, count = 5, difficulty = 'medium' } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ success: false, message: 'Subject and topic are required' });
    }

    let questions;

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      try {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        const prompt = `Generate ${count} MCQ questions for B.Tech CSE exam.
Subject: ${subject}, Topic: ${topic}, Difficulty: ${difficulty}

JSON format:
[{"question":"Q?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"Why A is correct"}]

correctAnswer is 0-indexed. Make questions exam-oriented.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2000
        });
        questions = JSON.parse(completion.choices[0].message.content);
      } catch (apiErr) {
        questions = mockAI.quiz(subject, topic, count, difficulty);
      }
    } else {
      questions = mockAI.quiz(subject, topic, count, difficulty);
    }

    res.json({ success: true, questions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.generateFlashcards = async (req, res) => {
  try {
    const { subject, topic, count = 5 } = req.body;
    if (!subject) {
      return res.status(400).json({ success: false, message: 'Subject is required' });
    }

    let cards;

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      try {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        const prompt = `Generate ${count} flashcards for B.Tech CSE student.
Subject: ${subject}, Topic: ${topic || subject}

JSON format:
[{"question":"concept/term?","answer":"detailed answer with key points"}]

Make answers comprehensive but memorable.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500
        });
        const raw = JSON.parse(completion.choices[0].message.content);
        cards = raw.map((c, i) => ({ id: i + 1, question: c.question, answer: c.answer, isKnown: false, needsReview: false }));
      } catch (apiErr) {
        cards = mockAI.flashcards(subject, topic, count);
      }
    } else {
      cards = mockAI.flashcards(subject, topic, count);
    }

    res.json({ success: true, cards });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const memStore = require('../memStore');
    let progress = null;
    if (memStore.isActive) {
      progress = await memStore.getProgress(req.user._id);
    } else {
      try {
        const Progress = require('../models/Progress');
        progress = await Progress.findOne({ user: req.user._id });
      } catch(e) {}
    }

    const recommendations = {
      topicsToRevise: ['Binary Trees', 'SQL Joins', 'Process Scheduling', 'TCP/IP Layers'],
      topicsToLearnNext: ['Graph Algorithms', 'Transaction Management', 'Memory Management', 'Cryptography'],
      suggestedQuizzes: [
        { subject: 'Data Structures', topic: 'Trees', difficulty: 'medium', reason: 'Low score on previous attempt' },
        { subject: 'DBMS', topic: 'Normalization', difficulty: 'hard', reason: 'Not attempted yet' }
      ],
      suggestedFlashcards: [
        { subject: 'Operating Systems', topic: 'CPU Scheduling', reason: 'Weak area identified' },
        { subject: 'Computer Networks', topic: 'OSI Model', reason: 'Needs more practice' }
      ],
      studyTips: [
        'Spend 30 minutes daily on Data Structures problems',
        'Review DBMS normalization rules before the exam',
        'Practice OS scheduling algorithms with examples',
        'Create mind maps for Computer Networks'
      ],
      motivation: `You're doing great! Keep up the ${progress?.currentStreak || 0}-day streak. Consistency is key to success.`
    };
    
    res.json({ success: true, recommendations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
