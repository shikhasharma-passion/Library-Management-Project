module.exports = [
  {
    name: "History and Evolution of Computers",
    author: "Dr. Alan Turing",
    category: "BCA",
    description: "Discover how the computing world started, from Charles Babbage's Difference Engine to vacuum tubes, transistors, and the silicon microprocessor revolution.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400",
    stream: "Computer Science",
    fullBookUrl: "https://archive.org/details/computerfrompascalto00gold/mode/2up",
    chapters: [
      {
        title: "Chapter 1: The Mechanical Era",
        content: `<h3>Calculating Machines</h3>
<p>For centuries, humans used mechanical tools for calculation. The abacus, invented thousands of years ago, was the earliest calculation helper. In 1642, Blaise Pascal designed the Pascaline, a mechanical adding calculator using gears and wheels.</p>
<p>The turning point occurred in 1822 when Charles Babbage conceived the Difference Engine, followed by the Analytical Engine. Babbage's Analytical Engine had all the pillars of modern computers: a store (memory), a mill (processor), and punch-card inputs. Ada Lovelace wrote the first program for this machine, making her the first programmer in history.</p>`,
        quiz: [
          {
            question: "Who conceived the Analytical Engine, the mechanical precursor to modern computers?",
            options: ["Alan Turing", "Charles Babbage", "Blaise Pascal", "John von Neumann"],
            answerIndex: 1
          },
          {
            question: "Who is recognized as the first programmer in computing history?",
            options: ["Grace Hopper", "Ada Lovelace", "Marie Curie", "Katherine Johnson"],
            answerIndex: 1
          }
        ]
      },
      {
        title: "Chapter 2: Five Generations of Computers",
        content: `<h3>Generational Transitions</h3>
<p>The history of electronic computing is categorized into generations:</p>
<ol>
  <li><strong>First Generation (1940-1956):</strong> Powered by Vacuum Tubes. They were massive, consumed immense power, and generated excessive heat. Examples: ENIAC, UNIVAC.</li>
  <li><strong>Second Generation (1956-1963):</strong> Transitioned to Transistors. They were smaller, faster, cheaper, and more energy-efficient.</li>
  <li><strong>Third Generation (1964-1971):</strong> Integrated Circuits (ICs). Multiple transistors were printed on silicon semiconductors, increasing processing speeds.</li>
  <li><strong>Fourth Generation (1971-Present):</strong> Microprocessors. Thousands of ICs were integrated onto a single silicon chip (VLSI/ULSI). The PC era began.</li>
  <li><strong>Fifth Generation (Present-Future):</strong> Artificial Intelligence, quantum computing, and parallel systems.</li>
</ol>`,
        quiz: [
          {
            question: "What core hardware component powered first-generation computers?",
            options: ["Transistors", "Integrated Circuits", "Vacuum Tubes", "Microprocessors"],
            answerIndex: 2
          },
          {
            question: "Which computer generation introduced Integrated Circuits (ICs)?",
            options: ["Second", "Third", "Fourth", "Fifth"],
            answerIndex: 1
          }
        ]
      }
    ]
  },
  {
    name: "Introduction to C Programming",
    author: "Dennis Ritchie",
    category: "Programming",
    description: "The absolute guide to programming in C, covering headers, syntax rules, pointers, and memory blocks. Perfect for BCA/MCA students.",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400",
    stream: "Computer Science",
    fullBookUrl: "https://archive.org/details/cprogramminglang00kern/mode/2up",
    chapters: [
      {
        title: "Chapter 1: Getting Started with C",
        content: `<h3>Variables and Data Types</h3>
<p>C is a statically typed language. Every variable must have a defined type. Basic types in C include: <code>int</code> (integers), <code>float</code> (single-precision floats), <code>double</code> (double-precision floats), and <code>char</code> (single characters).</p>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int age = 20;
    char grade = 'A';
    printf("Age: %d, Grade: %c\\n", age, grade);
    return 0;
}</code></pre>`,
        quiz: [
          {
            question: "Which header file is required to use the standard printf function in C?",
            options: ["<conio.h>", "<stdlib.h>", "<stdio.h>", "<math.h>"],
            answerIndex: 2
          },
          {
            question: "What is the return type of the main function in a standard C program?",
            options: ["void", "int", "char", "float"],
            answerIndex: 1
          }
        ]
      }
    ]
  },
  {
    name: "Object-Oriented Programming with C++",
    author: "Bjarne Stroustrup",
    category: "Programming",
    description: "Learn classes, structures, inheritance, and templates in C++. Master object-oriented methodology.",
    image: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=400",
    stream: "Computer Science",
    fullBookUrl: "https://archive.org/details/objectorientedpr00lafo/mode/2up",
    chapters: [
      {
        title: "Chapter 1: Classes and Objects",
        content: `<h3>OOP Paradigms</h3>
<p>C++ extends C by adding object-oriented paradigms. A <strong>class</strong> is a user-defined blueprint containing attributes (variables) and methods (functions). An <strong>object</strong> is an instance of a class.</p>
<pre><code>class Car {
public:
    string brand;
    void honk() {
        cout &lt;&lt; "Beep Beep!\\n";
    }
};</code></pre>`,
        quiz: [
          {
            question: "What keyword is used to define a blueprint structure (class) in C++?",
            options: ["struct", "class", "object", "blueprint"],
            answerIndex: 1
          },
          {
            question: "Which access modifier makes variables readable only inside the class scope?",
            options: ["public", "protected", "private", "hidden"],
            answerIndex: 2
          }
        ]
      }
    ]
  },
  {
    name: "Mastering Python",
    author: "Guido van Rossum",
    category: "Programming",
    description: "Learn syntax, list comprehensions, data structures, and object orientation in Python. The definitive student reference.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400",
    stream: "Computer Science",
    fullBookUrl: "https://archive.org/details/pythonprogramming00john/mode/2up",
    chapters: [
      {
        title: "Chapter 1: Python Lists and Tuples",
        content: `<h3>Lists versus Tuples</h3>
<p>Python offers sequential structures. Lists are defined using square brackets <code>[]</code> and are <strong>mutable</strong>. Tuples are defined using parentheses <code>()</code> and are <strong>immutable</strong> (cannot be modified after instantiation).</p>
<pre><code>fruits = ["apple", "banana"]
fruits.append("cherry") # Works!

coords = (40.7128, -74.0060)
# coords[0] = 41.0 # Raises TypeError!</code></pre>`,
        quiz: [
          {
            question: "Which of the following data structures in Python is immutable?",
            options: ["List", "Dictionary", "Tuple", "Set"],
            answerIndex: 2
          },
          {
            question: "How do you add an element to the end of a list in Python?",
            options: ["list.add()", "list.push()", "list.append()", "list.insert()"],
            answerIndex: 2
          }
        ]
      }
    ]
  },
  {
    name: "Java Language Fundamentals",
    author: "James Gosling",
    category: "Programming",
    description: "Master Java's write-once-run-anywhere philosophy, Java Virtual Machine (JVM) compilation, and package control.",
    image: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=400",
    stream: "Computer Science",
    fullBookUrl: "https://archive.org/details/javaprogramming00schi/mode/2up",
    chapters: [
      {
        title: "Chapter 1: Bytecode and the JVM",
        content: `<h3>WORA Principle</h3>
<p>Java compiles code into an intermediate format called <strong>bytecode</strong> (stored in <code>.class</code> files) rather than native machine code. The Java Virtual Machine (JVM) interprets this bytecode at runtime, providing cross-platform flexibility.</p>
<pre><code>public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}</code></pre>`,
        quiz: [
          {
            question: "What intermediate code format does the Java compiler generate?",
            options: ["Machine Code", "Bytecode", "Assembly", "Source Text"],
            answerIndex: 1
          },
          {
            question: "Which component executes Java bytecode on target operating systems?",
            options: ["JDK", "JRE", "JVM", "JAR"],
            answerIndex: 2
          }
        ]
      }
    ]
  },
  {
    name: "Operating Systems Demystified",
    author: "Andrew S. Tanenbaum",
    category: "BCA",
    description: "Understand process scheduling, thread management, memory paging, deadlocks, and disk space scheduling.",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=400",
    stream: "Computer Science",
    fullBookUrl: "https://archive.org/details/operatingsystemc00silb_0/mode/2up",
    chapters: [
      {
        title: "Chapter 1: What is an Operating System?",
        content: `<h3>OS Kernel and Core Services</h3>
<p>An Operating System (OS) is a program that acts as an interface between the computer user and the computer hardware. The core program of an OS is the **kernel**, which manages memory, processes, file systems, and hardware devices.</p>
<p>Key OS services include: Process Management, Memory Paging, File Allocation, and I/O Device Communication.</p>`,
        quiz: [
          {
            question: "What is the core component of an Operating System that interacts directly with hardware?",
            options: ["Shell", "Kernel", "Compiler", "Driver"],
            answerIndex: 1
          },
          {
            question: "Which function prevents multiple processes from locking resources indefinitely (deadlock)?",
            options: ["Memory allocation", "Process scheduling", "Deadlock detection", "Paging"],
            answerIndex: 2
          }
        ]
      }
    ]
  },
  {
    name: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    category: "Programming",
    description: "A modern introduction to programming, JavaScript, and the wonders of the digital world. Read by millions worldwide.",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=400",
    stream: "Computer Science",
    fullBookUrl: "https://eloquentjavascript.net/",
    chapters: [
      {
        title: "Chapter 1: Values, Types, and Operators",
        content: `<h3>Values</h3>
<p>Inside the computer's world, there is only data. You can read data, modify data, and create new data—but that which is not data simply does not exist. All this data is stored as long sequences of bits (binary digits: 0s and 1s). Bits are any kind of two-valued situation, usually described as high and low electrical charges, or on and off states.</p>
<p>To work with values in a comfortable way without getting lost in billions of bits, we must categorize them. In JavaScript, values are grouped into <strong>types</strong>: Numbers, Strings, Booleans, Objects, Functions, and Undefined values.</p>

<h3>Numbers</h3>
<p>Values of the number type are numeric values. In a JavaScript program, they are written as follows:</p>
<pre><code>let score = 100;
let pi = 3.14159;</code></pre>`,
        quiz: [
          {
            question: "How many bits are used in JavaScript to store a single number value?",
            options: ["16 bits", "32 bits", "64 bits", "128 bits"],
            answerIndex: 2
          },
          {
            question: "Which value is NOT a primitive type in JavaScript?",
            options: ["Number", "String", "Boolean", "Object"],
            answerIndex: 3
          }
        ]
      }
    ]
  },
  {
    name: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Algorithms",
    description: "The classic text covering computer algorithm architectures, complexities, and standard implementations. A computer science pillar.",
    image: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=400",
    stream: "Computer Science",
    fullBookUrl: "https://archive.org/details/introduction-to-algorithms-3rd-edition/mode/2up",
    chapters: [
      {
        title: "Chapter 1: The Role of Algorithms in Computing",
        content: `<h3>What is an Algorithm?</h3>
<p>Informally, an <strong>algorithm</strong> is any well-defined computational procedure that takes some value, or set of values, as <em>input</em> and produces some value, or set of values, as <em>output</em>. An algorithm is thus a sequence of computational steps that transform the input into the output.</p>
<p>We can also view an algorithm as a tool for solving a well-specified <em>computational problem</em>. The statement of the problem specifies in general terms the desired input/output relationship. The algorithm describes a specific computational procedure for achieving that input/output relationship.</p>`,
        quiz: [
          {
            question: "What is an algorithm's computational input?",
            options: ["A programming language", "A set of values transformed into output", "A database server", "An operating system"],
            answerIndex: 1
          }
        ]
      }
    ]
  },
  {
    name: "Principles of Management",
    author: "Harold Koontz",
    category: "BBA/MBA",
    description: "The core foundational textbook outlining managerial systems, executive structures, and corporate governance for BBA/MBA streams.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400",
    stream: "Business Administration",
    fullBookUrl: "https://open.umn.edu/opentextbooks/textbooks/principles-of-management",
    chapters: [
      {
        title: "Chapter 1: The Nature and Purpose of Management",
        content: `<h3>Definition of Management</h3>
<p>Management is the process of designing and maintaining an environment in which individuals, working together in groups, efficiently accomplish selected aims. This basic definition needs to be expanded:</p>
<ol>
  <li>As managers, people carry out the managerial functions of planning, organizing, staffing, leading, and controlling.</li>
  <li>Management applies to any kind of organization.</li>
  <li>It applies to managers at all organizational levels.</li>
  <li>The aim of all managers is the same: to create a surplus value (efficiency and output).</li>
</ol>`,
        quiz: [
          {
            question: "Which of the following is NOT one of the traditional functions of management?",
            options: ["Planning", "Organizing", "Compiling", "Leading"],
            answerIndex: 2
          }
        ]
      }
    ]
  },
  {
    name: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    description: "A handbook of agile software craftsmanship. Learn how to write clean code, refactor code legacy, and architect professional applications.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400",
    stream: "Computer Science",
    fullBookUrl: "https://archive.org/details/clean-code-a-handbook-of-agile-software-craftsmanship-by-robert-c.-martin/mode/2up",
    chapters: [
      {
        title: "Chapter 1: Clean Code Principles",
        content: `<h3>The Art of Clean Coding</h3>
<p>Writing clean code is like painting a picture. Most of us know when a picture is painted well and when it is painted poorly. But being able to recognize good art does not mean we know how to paint. Writing clean code requires the disciplined use of myriad little techniques applied through a hard-won sense of craftsmanship.</p>
<p>Clean code is simple, direct, and reads like well-written prose. It never obscures the designer's intent, but rather is full of crisp abstractions and straightforward lines of control.</p>`,
        quiz: [
          {
            question: "According to Bjarne Stroustrup, clean code should do how many things well?",
            options: ["Many things", "Two things", "One thing", "Zero things"],
            answerIndex: 2
          }
        ]
      }
    ]
  },
  {
    name: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    description: "A landmark book explaining structure, origin, development, and eventual fate of the universe in a reader-friendly scientific way.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400",
    stream: "Science",
    fullBookUrl: "https://archive.org/details/abriefhistoryoftime00hawk/mode/2up",
    chapters: [
      {
        title: "Chapter 1: Our Picture of the Universe",
        content: `<h3>Cosmological Models</h3>
<p>Most people nowadays would find the picture of our universe as an infinite tower of tortoises rather ridiculous, but why do we think we know better? What do we know about the universe, and how do we know it? Where did the universe come from, and where is it going?</p>
<p>Our picture of the universe is built on mathematical models and observations, beginning with the geocentric Ptolemaic model and evolving into Newton's gravity, and finally Einstein's General Relativity.</p>`,
        quiz: [
          {
            question: "Who formulated the Theory of General Relativity which revolutionized cosmology?",
            options: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Edwin Hubble"],
            answerIndex: 1
          }
        ]
      }
    ]
  },
  {
    name: "Introduction to Psychology",
    author: "Dr. Sarah Miller",
    category: "Psychology",
    description: "An entry textbook exploring human behaviors, cognitive thinking, brain functions, memory retention, and psychological anomalies.",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=400",
    stream: "Psychology",
    fullBookUrl: "https://openstax.org/details/books/introduction-psychology",
    chapters: [
      {
        title: "Chapter 1: What is Psychology?",
        content: `<h3>Understanding Behavioral Science</h3>
<p>Psychology is the scientific study of the mind and behavior. Psychologists study cognitive processes, brain biology, social dynamics, and psychological disorders to map human experiences.</p>`,
        quiz: [
          {
            question: "The word psychology originates from which Greek term meaning 'life' or 'soul'?",
            options: ["Logos", "Bios", "Psyche", "Soma"],
            answerIndex: 2
          }
        ]
      }
    ]
  },
  {
    name: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    description: "A beautiful inspiring fable about following your dreams, listening to your heart, and reading the omens along life's journey.",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
    stream: "Fiction",
    fullBookUrl: "https://archive.org/details/the-alchemist-paulo-coelho/mode/2up",
    chapters: [
      {
        title: "Chapter 1: The Sycamore Church",
        content: `<h3>Santiago's Journey</h3>
<p>Santiago used the book he had just finished reading as a pillow. He told himself that he had to start reading thicker books: they lasted longer and made more comfortable pillows. Little did he know his dreams would lead him across the Sahara desert in search of his Personal Legend.</p>`,
        quiz: [
          {
            question: "What is the name of the shepherd boy protagonist in The Alchemist?",
            options: ["Melchizedek", "Santiago", "Fatima", "Coelho"],
            answerIndex: 1
          }
        ]
      }
    ]
  },
  {
    name: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "Self Improvement",
    description: "What the rich teach their kids about money that the poor and middle class do not! Overthrow your corporate bounds.",
    image: "https://images.unsplash.com/photo-1592188657297-c6473609e988?auto=format&fit=crop&q=80&w=400",
    stream: "Self Improvement",
    fullBookUrl: "https://archive.org/details/rich-dad-poor-dad-pdfdrive/mode/2up",
    chapters: [
      {
        title: "Chapter 1: The Rich Don't Work for Money",
        content: `<h3>Financial Intelligence</h3>
<p>The poor and the middle class work for money. The rich have money work for them. Financial literacy is the ultimate skill. If you want to be rich, you must understand assets versus liabilities.</p>
<p>An asset puts money in my pocket. A liability takes money out of my pocket. It is as simple as that. Most people buy liabilities and think they are assets (such as a large mortgage).</p>`,
        quiz: [
          {
            question: "According to Robert Kiyosaki, what is an asset?",
            options: ["Something that takes money out of your pocket", "A large bank loan", "Something that puts money in your pocket", "A liability"],
            answerIndex: 2
          }
        ]
      }
    ]
  },
  {
    name: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Self Improvement",
    description: "Timeless lessons on wealth, greed, and happiness. Doing well with money isn't necessarily about what you know. It's about how you behave.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400",
    stream: "Self Improvement",
    fullBookUrl: "https://archive.org/details/thepsychologyofmoney/mode/2up",
    chapters: [
      {
        title: "Chapter 1: No One's Crazy",
        content: `<h3>Financial Perspectives</h3>
<p>Your personal experiences with money make up maybe 0.00000001% of what's happened in the world, but rules about 80% of how you think the world works. Therefore, no one makes financial decisions in a vacuum. Everyone acts based on their unique history.</p>`,
        quiz: [
          {
            question: "Morgan Housel argues that doing well with money is mostly about what?",
            options: ["What you know", "How you behave", "High IQ", "Inheriting fortunes"],
            answerIndex: 1
          }
        ]
      }
    ]
  },
  {
    name: "1984",
    author: "George Orwell",
    category: "Fiction",
    description: "The classic dystopian masterpiece analyzing surveillance state, thought-policing, absolute authority, and modern propaganda.",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
    stream: "Fiction",
    fullBookUrl: "https://archive.org/details/1984-george-orwell/mode/2up",
    chapters: [
      {
        title: "Chapter 1: Big Brother is Watching You",
        content: `<h3>Winston Smith</h3>
<p>It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions.</p>`,
        quiz: [
          {
            question: "What is the slogan written on the posters in Winston Smith's apartment building?",
            options: ["War is Peace", "Freedom is Slavery", "Big Brother is Watching You", "Ignorance is Strength"],
            answerIndex: 2
          }
        ]
      }
    ]
  },
  {
    name: "Think and Grow Rich",
    author: "Napoleon Hill",
    category: "Self Improvement",
    description: "The landmark success manual. Outlines the 13 principles of personal achievement and the power of psychological desires.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400",
    stream: "Self Improvement",
    fullBookUrl: "https://archive.org/details/think-and-grow-rich-napoleon-hill/mode/2up",
    chapters: [
      {
        title: "Chapter 1: The Power of Thought",
        content: `<h3>Desire is the Starting Point</h3>
<p>Thoughts are things, and powerful things at that, when they are mixed with definiteness of purpose, persistence, and a burning desire for their translation into riches or other material objects.</p>`,
        quiz: [
          {
            question: "What is the starting point of all achievement according to Napoleon Hill?",
            options: ["Money", "Education", "Desire", "Luck"],
            answerIndex: 2
          }
        ]
      }
    ]
  },
  {
    name: "Atomic Habits",
    author: "James Clear",
    category: "Self Improvement",
    description: "An easy and proven way to build good habits and break bad ones. Learn the science of how small actions compound into massive growth.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400",
    stream: "Self Improvement",
    fullBookUrl: "https://archive.org/details/atomic-habits-james-clear/mode/2up",
    chapters: [
      {
        title: "Chapter 1: The Surprising Power of Tiny Changes",
        content: `<h3>The 1% Better Principle</h3>
<p>If you can get 1 percent better each day for one year, you'll end up thirty-seven times better by the time you're done. Habits are the compound interest of self-improvement.</p>`,
        quiz: [
          {
            question: "How many times better do you get in one year if you improve by 1% daily?",
            options: ["10 times", "37 times", "5 times", "100 times"],
            answerIndex: 1
          }
        ]
      }
    ]
  }
];
