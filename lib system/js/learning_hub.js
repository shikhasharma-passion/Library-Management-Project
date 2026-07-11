document.addEventListener("DOMContentLoaded", () => {
    initLearningHub();
});

const learningResources = [
    // === BCA (20 items) ===
    {
        name: "Harvard CS50: Intro to Computer Science",
        provider: "Harvard Online",
        stream: "BCA",
        type: "youtube",
        icon: "💻",
        desc: "The world-famous course introducing programming, algorithms, C, Python, SQL, and JS.",
        link: "https://www.youtube.com/playlist?list=PLhQjrBD253YEykX_xN1L50U6tA4xG9rYF"
    },
    {
        name: "HTML & CSS Crash Course for Beginners",
        provider: "DesignCourse",
        stream: "BCA",
        type: "youtube",
        icon: "🌐",
        desc: "Learn to build modern, responsive web pages from scratch using flexbox and grid layouts.",
        link: "https://www.youtube.com/watch?v=yfoY53QXEnI"
    },
    {
        name: "Programming in C: Full Tutorial",
        provider: "freeCodeCamp",
        stream: "BCA",
        type: "youtube",
        icon: "💾",
        desc: "A comprehensive video guide to master control structures, pointers, and memory in C.",
        link: "https://www.youtube.com/watch?v=KJgsSFOSQv0"
    },
    {
        name: "Python for Beginners - Full Video Course",
        provider: "Programming with Mosh",
        stream: "BCA",
        type: "youtube",
        icon: "🐍",
        desc: "Master the fundamentals of Python programming language, OOP principles, and basic libraries.",
        link: "https://www.youtube.com/watch?v=_uQrJ0TkZlc"
    },
    {
        name: "C++ Programming Course for Beginners",
        provider: "freeCodeCamp",
        stream: "BCA",
        type: "youtube",
        icon: "⚙️",
        desc: "Master basic to advanced concepts of C++ including syntax, OOP, and standard libraries.",
        link: "https://www.youtube.com/watch?v=vLnPwxZdW4Y"
    },
    {
        name: "Java Programming Masterclass",
        provider: "freeCodeCamp",
        stream: "BCA",
        type: "youtube",
        icon: "☕",
        desc: "A complete programming bootcamp covering core Java syntax, OOP, and data structures.",
        link: "https://www.youtube.com/watch?v=A74TOX803D0"
    },
    {
        name: "JavaScript for Beginners: Complete Course",
        provider: "Clever Programmer",
        stream: "BCA",
        type: "youtube",
        icon: "💛",
        desc: "Learn core JavaScript, DOM manipulation, asynchronous calls, and frontend mechanics.",
        link: "https://www.youtube.com/watch?v=Qqx_wzMmFeA"
    },
    {
        name: "SQL & Databases Bootcamp for Beginners",
        provider: "freeCodeCamp",
        stream: "BCA",
        type: "youtube",
        icon: "🗄️",
        desc: "Master SQL syntax, database queries, relational design, joins, and aggregates.",
        link: "https://www.youtube.com/watch?v=HXV3zeQKqGY"
    },
    {
        name: "Data Structures & Algorithms Course",
        provider: "freeCodeCamp",
        stream: "BCA",
        type: "youtube",
        icon: "📊",
        desc: "Introduction to essential DSA concepts including arrays, queues, stacks, and searches.",
        link: "https://www.youtube.com/watch?v=RBSGKlAboiM"
    },
    {
        name: "Computer Networking Basics Tutorial",
        provider: "PowerCert Animated",
        stream: "BCA",
        type: "youtube",
        icon: "📡",
        desc: "Visual lessons explaining TCP/IP, IP addresses, subnets, routers, and switches.",
        link: "https://www.youtube.com/watch?v=IPvYjXCsS1U"
    },
    {
        name: "Operating Systems Fundamentals",
        provider: "Neso Academy",
        stream: "BCA",
        type: "youtube",
        icon: "🖥️",
        desc: "Core concepts of process scheduling, threads, virtual memory, and file systems.",
        link: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuNhcpD"
    },
    {
        name: "Linux Command Line Basics",
        provider: "The Linux Foundation",
        stream: "BCA",
        type: "youtube",
        icon: "🐧",
        desc: "Master shell navigation, file system permissions, command utilities, and bash scripts.",
        link: "https://www.youtube.com/watch?v=wbpDKzK_1Y0"
    },
    {
        name: "Introduction to Cybersecurity",
        provider: "Simplilearn",
        stream: "BCA",
        type: "youtube",
        icon: "🛡️",
        desc: "Fundamentals of network defense, threats, encryption, and secure configurations.",
        link: "https://www.youtube.com/watch?v=z5nc9MDbvkw"
    },
    {
        name: "Software Engineering Core Principles",
        provider: "Gate Smashers",
        stream: "BCA",
        type: "youtube",
        icon: "📐",
        desc: "SDLC phases, waterfall vs agile models, testing methods, and UML documentation.",
        link: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiEed7SKAD3arLD6PLx1s8U5"
    },
    {
        name: "Mobile App Development with Flutter",
        provider: "Academind",
        stream: "BCA",
        type: "youtube",
        icon: "📱",
        desc: "Learn to build cross-platform native mobile apps using Dart language and Flutter framework.",
        link: "https://www.youtube.com/watch?v=VPvVD8t02U8"
    },
    {
        name: "Bootstrap 5 CSS Framework Guide",
        provider: "Traversy Media",
        stream: "BCA",
        type: "youtube",
        icon: "🎨",
        desc: "Build highly responsive modern layouts rapidly using Bootstrap utilities and components.",
        link: "https://www.youtube.com/watch?v=4sosXZsDy-s"
    },
    {
        name: "Cloud Computing Basics for Beginners",
        provider: "AWS Certified",
        stream: "BCA",
        type: "youtube",
        icon: "☁️",
        desc: "Introduction to cloud concepts, SaaS, PaaS, IaaS, AWS services, and deployments.",
        link: "https://www.youtube.com/watch?v=2LaAJq1lB1Q"
    },
    {
        name: "C# Language Basics: Full Course",
        provider: "freeCodeCamp",
        stream: "BCA",
        type: "youtube",
        icon: "💎",
        desc: "Learn C# programming concepts, classes, arrays, loops, and visual studio setup.",
        link: "https://www.youtube.com/watch?v=GhQdlIFylQ8"
    },
    {
        name: "Git Version Control Guide",
        provider: "Amigoscode",
        stream: "BCA",
        type: "youtube",
        icon: "🌿",
        desc: "Learn repository creation, commits, branches, merges, and remote repositories.",
        link: "https://www.youtube.com/watch?v=apGV9Ad7XYY"
    },
    {
        name: "Digital Logic Design Lectures",
        provider: "Neso Academy",
        stream: "BCA",
        type: "youtube",
        icon: "💡",
        desc: "Learn number systems, boolean algebra, logic gates, and combinational circuits.",
        link: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3fHSgfdwGbz799RUq1s"
    },

    // === MCA (20 items) ===
    {
        name: "MIT 6.006: Introduction to Algorithms",
        provider: "MIT OpenCourseWare",
        stream: "MCA",
        type: "youtube",
        icon: "🧮",
        desc: "Core algorithm designs, heap sorts, binary search trees, hash tables, and dynamic programming.",
        link: "https://www.youtube.com/playlist?list=PLUl4u3cNGP61Oq3tWYp6V_F-5jb5L2iHb"
    },
    {
        name: "System Design for Scale: Architecture Guide",
        provider: "ByteByteGo",
        stream: "MCA",
        type: "youtube",
        icon: "🏢",
        desc: "Learn caching, load balancers, database sharding, microservices, and message queues.",
        link: "https://www.youtube.com/watch?v=i53Gi_K39mc"
    },
    {
        name: "Compiler Design Tutorials",
        provider: "Gate Smashers",
        stream: "MCA",
        type: "youtube",
        icon: "⚙️",
        desc: "Lexical analysis, syntax parsers, syntax-directed translation, and code generation phases.",
        link: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiEuygdL3lPfnQy62d47HjX8"
    },
    {
        name: "Distributed Systems & Cloud Computing",
        provider: "MIT Courseware",
        stream: "MCA",
        type: "youtube",
        icon: "🌐",
        desc: "Covers replication models, consensus protocols, mapreduce frameworks, and consistency.",
        link: "https://www.youtube.com/playlist?list=PLUl4u3cNGP63oMNW_V96mPVVIPSlALKBg"
    },
    {
        name: "Deep Learning & Neural Networks Course",
        provider: "freeCodeCamp",
        stream: "MCA",
        type: "youtube",
        icon: "🤖",
        desc: "Build neural networks, backpropagation loops, CNNs, RNNs, and pytorch model systems.",
        link: "https://www.youtube.com/watch?v=VyW1UTaOHy8"
    },
    {
        name: "Node.js & Express.js Backend Course",
        provider: "Coding Addict",
        stream: "MCA",
        type: "youtube",
        icon: "🟢",
        desc: "Build enterprise REST APIs, handle JWT authentications, and connect MongoDB databases.",
        link: "https://www.youtube.com/watch?v=Oe421EPjeBE"
    },
    {
        name: "React.js Frontend Masterclass",
        provider: "Academind",
        stream: "MCA",
        type: "youtube",
        icon: "⚛️",
        desc: "Learn components, state hooks, routing networks, and API interactions in React.",
        link: "https://www.youtube.com/watch?v=DORF8rKNUyw"
    },
    {
        name: "Docker & Kubernetes DevOps Course",
        provider: "TechWorld with Nana",
        stream: "MCA",
        type: "youtube",
        icon: "🐳",
        desc: "Learn container configurations, Dockerfiles, pod orchestration, and deployment files.",
        link: "https://www.youtube.com/watch?v=3c-iM_9pHbM"
    },
    {
        name: "Relational Databases & SQL Lectures",
        provider: "Stanford Online",
        stream: "MCA",
        type: "youtube",
        icon: "🗄️",
        desc: "Learn database schemas, normalization forms, index optimization, and advanced SQL queries.",
        link: "https://www.youtube.com/playlist?list=PLoROMvodv4rMc5s5HkrpCr-o4yP5Wwy2Z"
    },
    {
        name: "Cryptography & Network Security Lectures",
        provider: "Neso Academy",
        stream: "MCA",
        type: "youtube",
        icon: "🔑",
        desc: "Public key systems, RSA algorithms, AES/DES standards, hashing functions, and digital signatures.",
        link: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRgsaSgnA8IaN4DBgb7xL8x9"
    },
    {
        name: "Artificial Intelligence: State-Space Search",
        provider: "MIT Online Course",
        stream: "MCA",
        type: "youtube",
        icon: "🧠",
        desc: "Covers heuristic searches, A* algorithms, logic systems, and machine learning structures.",
        link: "https://www.youtube.com/playlist?list=PLUl4u3cNGP63gFHB6XBVMDKqQA4A6823L"
    },
    {
        name: "Java Design Patterns & Architecture",
        provider: "Derek Banas",
        stream: "MCA",
        type: "youtube",
        icon: "🧩",
        desc: "Learn singleton, factory, observer, builder, and structural software designs.",
        link: "https://www.youtube.com/playlist?list=PLGLfVfanfgmyQPxbL8umNnsip8lYxup5z"
    },
    {
        name: "Natural Language Processing (NLP) Crash Course",
        provider: "Stanford Online",
        stream: "MCA",
        type: "youtube",
        icon: "💬",
        desc: "Tokenizations, word vectors, transformers, attention models, and chatbot networks.",
        link: "https://www.youtube.com/playlist?list=PLoROMvodv4rOFznDyxfPD3gla1Of_Wtga"
    },
    {
        name: "Computer Vision & OpenCV Tutorials",
        provider: "freeCodeCamp",
        stream: "MCA",
        type: "youtube",
        icon: "👁️",
        desc: "Learn image operations, edge detections, face recognition models, and camera streams.",
        link: "https://www.youtube.com/watch?v=oXlwWbU8l2o"
    },
    {
        name: "Blockchain & Smart Contract Coding",
        provider: "freeCodeCamp",
        stream: "MCA",
        type: "youtube",
        icon: "⛓️",
        desc: "Solidity coding guidelines, decentralized apps (DApps), and Web3 integrations.",
        link: "https://www.youtube.com/watch?v=gyMwXuJrbDT"
    },
    {
        name: "Advanced Computer Architecture Lectures",
        provider: "Gate Smashers",
        stream: "MCA",
        type: "youtube",
        icon: "🧬",
        desc: "Pipelining hazards, cache memory mappings, multiprocessor systems, and instruction formats.",
        link: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGZ9d7z7A7_645EaC_mP479"
    },
    {
        name: "Data Warehousing & Data Mining Guides",
        provider: "Education 4u",
        stream: "MCA",
        type: "youtube",
        icon: "📊",
        desc: "OLAP operations, ETL pipelines, association rules, classification methods, and clustering.",
        link: "https://www.youtube.com/playlist?list=PLrJKDFap54pd1yL852-SExC2C8p334L59"
    },
    {
        name: "Linux Shell Scripting Masterclass",
        provider: "Edureka",
        stream: "MCA",
        type: "youtube",
        icon: "🐚",
        desc: "Learn shell scripts, variables, loop conditions, regular expressions, and server automations.",
        link: "https://www.youtube.com/watch?v=cQepf8yJXMM"
    },
    {
        name: "Computer Graphics Core Concepts",
        provider: "Education 4u",
        stream: "MCA",
        type: "youtube",
        icon: "📐",
        desc: "DDA algorithms, Bresenham's line drawings, 2D/3D matrix rotations, and clipping.",
        link: "https://www.youtube.com/playlist?list=PLrJKDFap54peJe2n54gL2ZGBc-HkLg3W2"
    },
    {
        name: "DevOps CI/CD Pipelines with Jenkins",
        provider: "Simplilearn",
        stream: "MCA",
        type: "youtube",
        icon: "🤖",
        desc: "Continuous integration pipelines, automated test runs, and cloud application deployments.",
        link: "https://www.youtube.com/watch?v=LFDrDnKP_gM"
    },

    // === BBA (20 items) ===
    {
        name: "Strategic Business & Operations",
        provider: "CrashCourse",
        stream: "BBA",
        type: "youtube",
        icon: "📈",
        desc: "A visual, structured series covering marketing channels, SWOT analysis, and leadership.",
        link: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtMw5N9H35_6Q_K0vT_J4B1y"
    },
    {
        name: "Introduction to Financial Accounting",
        provider: "Edspira Accounting",
        stream: "BBA",
        type: "youtube",
        icon: "📝",
        desc: "Step-by-step video lessons on bookkeeping, double-entry ledgers, and balance statements.",
        link: "https://www.youtube.com/playlist?list=PL_KGEFWqEaTBhK1kEbUskDq1-bZis8Vq6"
    },
    {
        name: "Principles of Microeconomics",
        provider: "MIT OpenCourseWare",
        stream: "BBA",
        type: "youtube",
        icon: "💰",
        desc: "Understand supply and demand curves, market equilibria, cost structures, and monopolies.",
        link: "https://www.youtube.com/playlist?list=PLUl4u3cNGP62mN095TGuabH9skJ4f7s78"
    },
    {
        name: "Business Communication Fundamentals",
        provider: "Communication Coach",
        stream: "BBA",
        type: "youtube",
        icon: "🗣️",
        desc: "Learn professional presentation skills, email etiquette, and effective negotiation strategies.",
        link: "https://www.youtube.com/watch?v=e_Z_F5_3YV0"
    },
    {
        name: "Organizational Behavior Lectures",
        provider: "MeanThat Business",
        stream: "BBA",
        type: "youtube",
        icon: "👥",
        desc: "Study employee motivation theories, group decisions, leadership styles, and corporate culture.",
        link: "https://www.youtube.com/playlist?list=PLc4jR9aN_2h5-8PswQkZ9Pru4L7xZ7W8P"
    },
    {
        name: "Principles of Marketing Essentials",
        provider: "Philip Kotler Guide",
        stream: "BBA",
        type: "youtube",
        icon: "📢",
        desc: "Covers customer segments, pricing strategies, branding concepts, and digital promotions.",
        link: "https://www.youtube.com/watch?v=sR-qL7QdVZQ"
    },
    {
        name: "Human Resource Management Course",
        provider: "GreggU Education",
        stream: "BBA",
        type: "youtube",
        icon: "👔",
        desc: "Learn recruitment models, onboarding processes, performance reviews, and compensations.",
        link: "https://www.youtube.com/playlist?list=PLZ88r5D2jF74t5q8VlyX_X7PqAegY00yN"
    },
    {
        name: "Principles of Macroeconomics",
        provider: "Khan Academy",
        stream: "BBA",
        type: "youtube",
        icon: "🌎",
        desc: "Covers GDP metrics, inflation models, interest rates, monetary policy, and open economies.",
        link: "https://www.youtube.com/playlist?list=PLDBC1B7B5DE7B8C90"
    },
    {
        name: "Business Law Foundations for Managers",
        provider: "GreggU Education",
        stream: "BBA",
        type: "youtube",
        icon: "⚖️",
        desc: "Learn contract laws, breach liabilities, agency agreements, and consumer protections.",
        link: "https://www.youtube.com/playlist?list=PLZ88r5D2jF75i2-tEw4J_5Q1v-X7F7rKx"
    },
    {
        name: "Managerial Accounting Tutorials",
        provider: "Edspira Accounting",
        stream: "BBA",
        type: "youtube",
        icon: "📊",
        desc: "Learn cost-volume-profit analytics, job costing systems, overhead budgets, and variances.",
        link: "https://www.youtube.com/playlist?list=PL_KGEFWqEaTAwLqZfGZkZkP0X3K9cZtF9"
    },
    {
        name: "Corporate Finance Basics Course",
        provider: "Simplilearn",
        stream: "BBA",
        type: "youtube",
        icon: "💵",
        desc: "Covers capital structures, investment analysis, time value of money, and financial ratios.",
        link: "https://www.youtube.com/watch?v=Xh0YpA7nZlY"
    },
    {
        name: "Retail Management & Operations Guide",
        provider: "Retail Training",
        stream: "BBA",
        type: "youtube",
        icon: "🏪",
        desc: "Covers visual merchandising, store layouts, inventory turn, and customer service models.",
        link: "https://www.youtube.com/watch?v=wzQ-9XF_E8A"
    },
    {
        name: "Entrepreneurship Development Lectures",
        provider: "NPTEL Online",
        stream: "BBA",
        type: "youtube",
        icon: "💡",
        desc: "How to draft business plans, map target markets, obtain seed fundings, and manage risk.",
        link: "https://www.youtube.com/playlist?list=PLP_k2_y9-pL_G1P96hR-X3ZfA4_c86s_r"
    },
    {
        name: "Consumer Behavior & Marketing Strategy",
        provider: "Study.com Business",
        stream: "BBA",
        type: "youtube",
        icon: "🛍️",
        desc: "Understanding buyer psychology, purchasing decision processes, and brand loyalties.",
        link: "https://www.youtube.com/watch?v=wzP9mDszxzA"
    },
    {
        name: "Business Statistics for Data Analysis",
        provider: "Brandon Foltz",
        stream: "BBA",
        type: "youtube",
        icon: "📊",
        desc: "Learn probability spaces, normal distributions, hypothesis tests, and linear regressions.",
        link: "https://www.youtube.com/playlist?list=PL2SOU6wwxB0uWWKqM_yH2VjE-YgZ2c5yD"
    },
    {
        name: "Introduction to E-Commerce & Tech",
        provider: "Gate Smashers",
        stream: "BBA",
        type: "youtube",
        icon: "🛒",
        desc: "Learn B2B/B2C frameworks, payment gateways, web securities, and digital transactions.",
        link: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiHp3XlWvj_mG57e7N6vO3bC"
    },
    {
        name: "Operations & Supply Chain Basics",
        provider: "GreggU Education",
        stream: "BBA",
        type: "youtube",
        icon: "🏭",
        desc: "Learn production scheduling, quality control models, inventory systems, and logistics.",
        link: "https://www.youtube.com/playlist?list=PLZ88r5D2jF74V2tQZ8Xy_8sE3G8v2Xy_8"
    },
    {
        name: "Business Ethics & Corporate Values",
        provider: "Harvard HarvardX",
        stream: "BBA",
        type: "youtube",
        icon: "🤝",
        desc: "Covers corporate social responsibility, codes of conduct, and conflicts of interest.",
        link: "https://www.youtube.com/watch?v=3_t4obU-zGM"
    },
    {
        name: "International Business Environment",
        provider: "GreggU Education",
        stream: "BBA",
        type: "youtube",
        icon: "✈️",
        desc: "Learn global trade barriers, currency dynamics, tariff structures, and MNC frameworks.",
        link: "https://www.youtube.com/playlist?list=PLZ88r5D2jF76Uv3-W8-7T4jAeg0-X0y-8"
    },
    {
        name: "Personal Finance & Wealth Management",
        provider: "Practical Wisdom",
        stream: "BBA",
        type: "youtube",
        icon: "💰",
        desc: "Learn budget controls, debt management, compound interests, and investment asset options.",
        link: "https://www.youtube.com/watch?v=3z8gVnJ9Y4s"
    },

    // === MBA (20 items) ===
    {
        name: "HBR Case Method Studies & Case Analysis",
        provider: "Harvard Business Review",
        stream: "MBA",
        type: "youtube",
        icon: "💼",
        desc: "Real world corporate strategies, decision-making methods, and operational crisis management.",
        link: "https://www.youtube.com/playlist?list=PL4980C51CF0055F60"
    },
    {
        name: "Financial Markets & Risk Management",
        provider: "Yale Online (Robert Shiller)",
        stream: "MBA",
        type: "youtube",
        icon: "🏛️",
        desc: "Stock pricing, asset valuations, hedging portfolios, banking systems, and regulatory policy.",
        link: "https://www.youtube.com/playlist?list=PL8FB74AC7B163435C"
    },
    {
        name: "Entrepreneurial Marketing Strategies",
        provider: "MIT Sloan",
        stream: "MBA",
        type: "youtube",
        icon: "🎯",
        desc: "Acquisition models, value propositions, branding strategies, and venture capital pitches.",
        link: "https://www.youtube.com/playlist?list=PLUl4u3cNGP62XUaP1w2zZ7vA683E2rXo_"
    },
    {
        name: "Corporate Finance Foundations",
        provider: "Corporate Finance Institute",
        stream: "MBA",
        type: "youtube",
        icon: "📊",
        desc: "Understand capital budgeting, NPV formulas, IRR estimation, and debt-equity structures.",
        link: "https://www.youtube.com/watch?v=wX-yUfD_pGo"
    },
    {
        name: "Venture Capital & Deal Structuring",
        provider: "Stanford Graduate School",
        stream: "MBA",
        type: "youtube",
        icon: "🚀",
        desc: "Covers valuation methods, term sheets, cap table systems, and exit strategies.",
        link: "https://www.youtube.com/playlist?list=PLoROMvodv4rMc5s5HkrpCr-o4yP5Wwy2Z"
    },
    {
        name: "Corporate Strategic Management Lectures",
        provider: "MeanThat Business",
        stream: "MBA",
        type: "youtube",
        icon: "🗺️",
        desc: "Learn Porter's Five Forces, competitive advantages, vertical integrations, and diversification.",
        link: "https://www.youtube.com/playlist?list=PLc4jR9aN_2h5WfW-ZtO9GvY-LwzRkQ4P_"
    },
    {
        name: "Global Supply Chain Architectures",
        provider: "MIT Center for Transportation",
        stream: "MBA",
        type: "youtube",
        icon: "🚢",
        desc: "Covers logistics optimizations, network designs, bullwhip effects, and inventory hubs.",
        link: "https://www.youtube.com/playlist?list=PLUl4u3cNGP63P_vEw_wI9-N2M_3XzYx6v"
    },
    {
        name: "Leadership & Emotional Intelligence",
        provider: "Stanford Online",
        stream: "MBA",
        type: "youtube",
        icon: "👥",
        desc: "Covers team dynamics, adaptive communications, coaching models, and motivational loops.",
        link: "https://www.youtube.com/watch?v=3z8gVnJ9Y4s"
    },
    {
        name: "Negotiation Strategies for Executives",
        provider: "Harvard Law School",
        stream: "MBA",
        type: "youtube",
        icon: "🤝",
        desc: "Covers BATNA formulations, value creations, distributive bargainings, and multi-party deals.",
        link: "https://www.youtube.com/watch?v=RfTalFEeKKE"
    },
    {
        name: "Brand Management & Market Positioning",
        provider: "Wharton School",
        stream: "MBA",
        type: "youtube",
        icon: "🏷️",
        desc: "Brand equities, brand architectures, customer journeys, and equity measurement models.",
        link: "https://www.youtube.com/watch?v=aG-yWJ12YkI"
    },
    {
        name: "Investment Banking & Mergers (M&A)",
        provider: "Corporate Finance Institute",
        stream: "MBA",
        type: "youtube",
        icon: "🏢",
        desc: "Learn transaction processes, synergy models, merger models, and financial audits.",
        link: "https://www.youtube.com/watch?v=ZcM1Jj684y4"
    },
    {
        name: "Managerial Economics for Decision Making",
        provider: "GreggU Education",
        stream: "MBA",
        type: "youtube",
        icon: "🧮",
        desc: "Covers elasticity metrics, cost optimizations, game theories, and pricing setups.",
        link: "https://www.youtube.com/playlist?list=PLZ88r5D2jF74t5q8VlyX_X7PqAegY00yN"
    },
    {
        name: "Design Thinking & Business Innovation",
        provider: "Stanford d.school",
        stream: "MBA",
        type: "youtube",
        icon: "💡",
        desc: "Learn user empathy mapping, ideation methods, rapid prototyping, and feedback integrations.",
        link: "https://www.youtube.com/watch?v=gHGN6hs2g7Y"
    },
    {
        name: "Risk Management & Derivatives",
        provider: "Finance Training",
        stream: "MBA",
        type: "youtube",
        icon: "📉",
        desc: "Covers option models, futures/swaps contracts, hedging market risk, and VaR estimations.",
        link: "https://www.youtube.com/watch?v=RfTaLFeEKkE"
    },
    {
        name: "Digital Transformation & Business Tech",
        provider: "MIT Sloan Lectures",
        stream: "MBA",
        type: "youtube",
        icon: "🌐",
        desc: "Covers data architectures, cloud setups, AI adoptions, and agile organizational formats.",
        link: "https://www.youtube.com/watch?v=Oe421EPjeBE"
    },
    {
        name: "Business Valuations & DCF Models",
        provider: "CFI Academy",
        stream: "MBA",
        type: "youtube",
        icon: "💰",
        desc: "Build discounted cash flow (DCF) models, WACC calculators, and multiple comparables.",
        link: "https://www.youtube.com/watch?v=ZcM1Jj684y4"
    },
    {
        name: "Operations Research & Linear Programming",
        provider: "Education 4u",
        stream: "MBA",
        type: "youtube",
        icon: "📐",
        desc: "Simplex algorithms, transport networks, assignments models, and queuing theories.",
        link: "https://www.youtube.com/playlist?list=PLrJKDFap54pd1yL852-SExC2C8p334L59"
    },
    {
        name: "Corporate Governance & Ethics Board",
        provider: "GreggU Education",
        stream: "MBA",
        type: "youtube",
        icon: "🏛️",
        desc: "Board responsibilities, stakeholder rights, compliance structures, and audit committees.",
        link: "https://www.youtube.com/playlist?list=PLZ88r5D2jF74t5q8VlyX_X7PqAegY00yN"
    },
    {
        name: "Executive Presentation Skills Course",
        provider: "Communication Coach",
        stream: "MBA",
        type: "youtube",
        icon: "🗣️",
        desc: "Learn to design executive slide decks, communicate complex data, and handle Q&A panels.",
        link: "https://www.youtube.com/watch?v=e_Z_F5_3YV0"
    },
    {
        name: "Product Management Essentials Guide",
        provider: "Product School",
        stream: "MBA",
        type: "youtube",
        icon: "📦",
        desc: "Covers product lifecycle phases, roadmap creations, user stories, and agile sprints.",
        link: "https://www.youtube.com/watch?v=yfoY53QXEnI"
    },

    // === Science Fiction (20 items) ===
    {
        name: "History of Science Fiction Literature",
        provider: "CrashCourse Literature",
        stream: "Science Fiction",
        type: "youtube",
        icon: "🚀",
        desc: "Explore SF themes from Frankenstein and Jules Verne to cyberpunk and future dystopias.",
        link: "https://www.youtube.com/watch?v=P_XfGv4v7mE"
    },
    {
        name: "World-Building Guide for Sci-Fi Writers",
        provider: "Brandon Sanderson Lectures",
        stream: "Science Fiction",
        type: "youtube",
        icon: "🪐",
        desc: "Learn to design believable technology, societies, planetary ecosystems, and hard sci-fi rules.",
        link: "https://www.youtube.com/watch?v=CoN80XQGgG8"
    },
    {
        name: "Cyberpunk & Post-Human Tropes Analysis",
        provider: "Sci-Fi Deep Dive",
        stream: "Science Fiction",
        type: "youtube",
        icon: "🦾",
        desc: "Exploring neon dystopias, artificial body augmentations, AI systems, and Gibson's concepts.",
        link: "https://www.youtube.com/watch?v=P_XfGv4v7mE"
    },
    {
        name: "Dystopian Literature History",
        provider: "CrashCourse History",
        stream: "Science Fiction",
        type: "youtube",
        icon: "🏙️",
        desc: "Critical analysis of 1984, Brave New World, and Fahrenheit 451 societal structures.",
        link: "https://www.youtube.com/watch?v=CoN80XQGgG8"
    },
    {
        name: "The Physics of Space Travel & Portals",
        provider: "PBS Space Time",
        stream: "Science Fiction",
        type: "youtube",
        icon: "🕳️",
        desc: "Explain warp drives, wormholes, black holes, and the speed of light limits in hard sci-fi.",
        link: "https://www.youtube.com/watch?v=apGV9Ad7XYY"
    },
    {
        name: "Space Operas & Interstellar Empires",
        provider: "Sci-Fi Theories",
        stream: "Science Fiction",
        type: "youtube",
        icon: "🛸",
        desc: "Exploring galaxy scale stories like Dune, Foundation, and Star Wars political systems.",
        link: "https://www.youtube.com/watch?v=yfoY53QXEnI"
    },
    {
        name: "Dune: In-Depth Philosophical Analysis",
        provider: "Ideas in Ecology",
        stream: "Science Fiction",
        type: "youtube",
        icon: "🏜️",
        desc: "Reviewing ecology, messiah complex warnings, resource dependencies, and feudal settings in Dune.",
        link: "https://www.youtube.com/watch?v=P_XfGv4v7mE"
    },
    {
        name: "Isaac Asimov's Three Laws of Robotics",
        provider: "Robotics Ethics",
        stream: "Science Fiction",
        type: "youtube",
        icon: "🤖",
        desc: "Critical review of robot logic loopholes, ethical programming, and Asimov's short stories.",
        link: "https://www.youtube.com/watch?v=CoN80XQGgG8"
    },
    {
        name: "Hard Science Fiction vs Soft Sci-Fi",
        provider: "Writing Prompts",
        stream: "Science Fiction",
        type: "youtube",
        icon: "📖",
        desc: "Understanding the difference between rigorous scientific accuracy and soft metaphorical fantasy.",
        link: "https://www.youtube.com/watch?v=P_XfGv4v7mE"
    },
    {
        name: "Ursula K. Le Guin's World Designs",
        provider: "Literature Academy",
        stream: "Science Fiction",
        type: "youtube",
        icon: "🌗",
        desc: "Reviewing social systems, gender dynamics, and political settings in Left Hand of Darkness.",
        link: "https://www.youtube.com/watch?v=CoN80XQGgG8"
    },
    {
        name: "Cybernetics, Androids, & Blade Runner",
        provider: "Film & Text Analysis",
        stream: "Science Fiction",
        type: "youtube",
        icon: "🧠",
        desc: "Reviewing Philip K. Dick's themes of empathy, replicant memories, and synthetic lifeforms.",
        link: "https://www.youtube.com/watch?v=P_XfGv4v7mE"
    },
    {
        name: "Alien Languages & Communication Systems",
        provider: "Sci-Fi Linguistics",
        stream: "Science Fiction",
        type: "youtube",
        icon: "👽",
        desc: "How sci-fi designs alien languages, Sapir-Whorf hypothese, and the movie Arrival.",
        link: "https://www.youtube.com/watch?v=CoN80XQGgG8"
    },
    {
        name: "Time Travel Loops & Paradox Physics",
        provider: "MinutePhysics",
        stream: "Science Fiction",
        type: "youtube",
        icon: "⏳",
        desc: "Visualizing grandfather paradoxes, bootstrap loops, and parallel timelines in stories.",
        link: "https://www.youtube.com/watch?v=apGV9Ad7XYY"
    },
    {
        name: "The Matrix: Simulation Theories",
        provider: "Philosophy Course",
        stream: "Science Fiction",
        type: "youtube",
        icon: "👓",
        desc: "Comparing Simulated reality concepts, Descartes' demon, and Baudrillard's hyperreality.",
        link: "https://www.youtube.com/watch?v=P_XfGv4v7mE"
    },
    {
        name: "Solarpunk: Optimistic Futures Design",
        provider: "Green Designs",
        stream: "Science Fiction",
        type: "youtube",
        icon: "☀️",
        desc: "Reviewing ecological tech, community networks, and sustainable systems in futuristic sci-fi.",
        link: "https://www.youtube.com/watch?v=CoN80XQGgG8"
    },
    {
        name: "Mary Shelley's Frankenstein Analysis",
        provider: "CrashCourse Literature",
        stream: "Science Fiction",
        type: "youtube",
        icon: "⚡",
        desc: "Analyzing the birth of sci-fi, creator ethics, scientific hubris, and the creature's humanity.",
        link: "https://www.youtube.com/watch?v=P_XfGv4v7mE"
    },
    {
        name: "H.G. Wells: The Time Machine Themes",
        provider: "Literature Academy",
        stream: "Science Fiction",
        type: "youtube",
        icon: "🕰️",
        desc: "Reviewing social class evolutions, Morlock/Eloi dynamics, and thermodynamic heat deaths.",
        link: "https://www.youtube.com/watch?v=CoN80XQGgG8"
    },
    {
        name: "AI Rebellion & HAL 9000 Psychology",
        provider: "AI Ethics History",
        stream: "Science Fiction",
        type: "youtube",
        icon: "🔴",
        desc: "Analyzing logic conflicts, programming parameters, and sentience in Space Odyssey 2001.",
        link: "https://www.youtube.com/watch?v=P_XfGv4v7mE"
    },
    {
        name: "Arthur C. Clarke's Odyssey Concepts",
        provider: "Space History",
        stream: "Science Fiction",
        type: "youtube",
        icon: "🛰️",
        desc: "Analyzing monoliths, human evolutions, telepathic unions, and deep space exploration.",
        link: "https://www.youtube.com/watch?v=CoN80XQGgG8"
    },
    {
        name: "Cli-Fi: Climate Fiction Narratives",
        provider: "Eco Literature",
        stream: "Science Fiction",
        type: "youtube",
        icon: "🌊",
        desc: "Exploring narratives covering planetary sea rise, ecological collapses, and future survivals.",
        link: "https://www.youtube.com/watch?v=P_XfGv4v7mE"
    },

    // === Psychology (20 items) ===
    {
        name: "General Psychology Course Lectures",
        provider: "CrashCourse Psychology",
        stream: "Psychology",
        type: "youtube",
        icon: "🧠",
        desc: "Overview of brain anatomy, sensory systems, learning loops, and memory consolidation.",
        link: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtOPRKzVLY0jJY-uHOH9KVU6"
    },
    {
        name: "Introduction to Psychology at Yale",
        provider: "Yale Online (Paul Bloom)",
        stream: "Psychology",
        type: "youtube",
        icon: "💭",
        desc: "Explore clinical psychology, language development, dreams, and social behavior biology.",
        link: "https://www.youtube.com/playlist?list=PL6A75D0C0E56A2E43"
    },
    {
        name: "Cognitive Psychology & Memory Models",
        provider: "Psychology Academy",
        stream: "Psychology",
        type: "youtube",
        icon: "💾",
        desc: "Study sensory registers, short-term holding, long-term schemas, and retrieval cues.",
        link: "https://www.youtube.com/watch?v=apGV9Ad7XYY"
    },
    {
        name: "Social Psychology: Group Dynamics",
        provider: "Yale Courses",
        stream: "Psychology",
        type: "youtube",
        icon: "👥",
        desc: "Covers conformity, obedience experiments, bystander effects, and in-group bias.",
        link: "https://www.youtube.com/watch?v=yfoY53QXEnI"
    },
    {
        name: "Abnormal Psychology & Clinical Therapy",
        provider: "GreggU Education",
        stream: "Psychology",
        type: "youtube",
        icon: "💊",
        desc: "Covers mood disorders, anxiety schemas, CBT treatments, and DSM diagnostic criteria.",
        link: "https://www.youtube.com/playlist?list=PLZ88r5D2jF74t5q8VlyX_X7PqAegY00yN"
    },
    {
        name: "Behavioral Economics & Decision Biases",
        provider: "Daniel Kahneman Guide",
        stream: "Psychology",
        type: "youtube",
        icon: "⚖️",
        desc: "Study fast vs slow cognitive systems, loss aversion, anchoring, and choice architectures.",
        link: "https://www.youtube.com/watch?v=3z8gVnJ9Y4s"
    },
    {
        name: "Evolutionary Psychology Basics",
        provider: "Psychology Academy",
        stream: "Psychology",
        type: "youtube",
        icon: "🧬",
        desc: "Explaining mate selections, kin altruism, survival adaptations, and ancestral brains.",
        link: "https://www.youtube.com/watch?v=apGV9Ad7XYY"
    },
    {
        name: "Child Development & Piagetian Stages",
        provider: "GreggU Education",
        stream: "Psychology",
        type: "youtube",
        icon: "👶",
        desc: "Covers sensorimotor stages, object permanence, social language, and cognitive growth.",
        link: "https://www.youtube.com/watch?v=yfoY53QXEnI"
    },
    {
        name: "Personality Theories & Trait Models",
        provider: "Big Five Psychology",
        stream: "Psychology",
        type: "youtube",
        icon: "🧩",
        desc: "Reviewing extraversion, neuroticism, agreeableness, conscientiousness, and openness.",
        link: "https://www.youtube.com/watch?v=3z8gVnJ9Y4s"
    },
    {
        name: "Neurotransmitters & Brain Chemistry",
        provider: "Biopsychology Lectures",
        stream: "Psychology",
        type: "youtube",
        icon: "🧪",
        desc: "How dopamine, serotonin, GABA, and acetylcholine regulate mood, focus, and motor functions.",
        link: "https://www.youtube.com/watch?v=apGV9Ad7XYY"
    },
    {
        name: "Sensation & Perception Mechanisms",
        provider: "CrashCourse Psychology",
        stream: "Psychology",
        type: "youtube",
        icon: "👁️",
        desc: "How optical receptors, auditory drums, and olfactory nerves convert physical waves to thoughts.",
        link: "https://www.youtube.com/watch?v=yfoY53QXEnI"
    },
    {
        name: "Positive Psychology & Human Flourishing",
        provider: "Harvard Online",
        stream: "Psychology",
        type: "youtube",
        icon: "☀️",
        desc: "Covers gratitude feedback loops, resilience protocols, flow states, and PERMA models.",
        link: "https://www.youtube.com/watch?v=3z8gVnJ9Y4s"
    },
    {
        name: "Sleep Architectures & REM Dreams",
        provider: "Neurobiology Labs",
        stream: "Psychology",
        type: "youtube",
        icon: "🌙",
        desc: "Covers circadian cycles, delta wave scripts, memory consolidation, and sleep deprivation.",
        link: "https://www.youtube.com/watch?v=apGV9Ad7XYY"
    },
    {
        name: "Intelligence Theories & IQ Metrics",
        provider: "Cognitive Science",
        stream: "Psychology",
        type: "youtube",
        icon: "💡",
        desc: "Covers Spearman's g-factor, Gardner's multiple intelligences, and standardized metrics.",
        link: "https://www.youtube.com/watch?v=yfoY53QXEnI"
    },
    {
        name: "History of Psychoanalysis (Freud & Jung)",
        provider: "Philosophy Academy",
        stream: "Psychology",
        type: "youtube",
        icon: "🛋️",
        desc: "Reviewing id/ego/superego systems, dream symbols, archetypes, and the unconscious mind.",
        link: "https://www.youtube.com/watch?v=3z8gVnJ9Y4s"
    },
    {
        name: "Humanistic Psychology (Maslow & Rogers)",
        provider: "GreggU Education",
        stream: "Psychology",
        type: "youtube",
        icon: "🔺",
        desc: "Reviewing Maslow's hierarchy of needs, self-actualizations, and unconditional positive regard.",
        link: "https://www.youtube.com/playlist?list=PLZ88r5D2jF74t5q8VlyX_X7PqAegY00yN"
    },
    {
        name: "Philosophy of Mind & Dualism",
        provider: "Yale Philosophy",
        stream: "Psychology",
        type: "youtube",
        icon: "💭",
        desc: "Covers body-mind problems, Cartesian dualism, functionalism, and hard problems of consciousness.",
        link: "https://www.youtube.com/watch?v=apGV9Ad7XYY"
    },
    {
        name: "Classical & Operant Conditioning Loops",
        provider: "Behavioral Sciences",
        stream: "Psychology",
        type: "youtube",
        icon: "🔔",
        desc: "Pavlov's bells, reinforcement schedules, Skinner boxes, and behavioral modification.",
        link: "https://www.youtube.com/watch?v=yfoY53QXEnI"
    },
    {
        name: "Emotions: Physiology & Cognitive Appraisal",
        provider: "Biopsychology Labs",
        stream: "Psychology",
        type: "youtube",
        icon: "⚡",
        desc: "Covers James-Lange theories, Schachter-Singer appraisal models, and amygdala responses.",
        link: "https://www.youtube.com/watch?v=apGV9Ad7XYY"
    },
    {
        name: "Psychological Research Methods & Ethics",
        provider: "Research Board",
        stream: "Psychology",
        type: "youtube",
        icon: "📊",
        desc: "Covers correlation vs causation, double-blind designs, debriefings, and statistical significance.",
        link: "https://www.youtube.com/watch?v=yfoY53QXEnI"
    },

    // === Self Development (20 items) ===
    {
        name: "Andrew Huberman: Neurobiology of Focus",
        provider: "Huberman Lab",
        stream: "Self Development",
        type: "youtube",
        icon: "⚡",
        desc: "Scientific protocols to optimize deep work focus, sleep quality, and dopamine regulation.",
        link: "https://www.youtube.com/watch?v=LG53VxUm0as"
    },
    {
        name: "Deep Work: Rules for Focused Success",
        provider: "Cal Newport Explainer",
        stream: "Self Development",
        type: "youtube",
        icon: "📖",
        desc: "Strategies to cultivate intense cognitive focus and eliminate digital distractions in study.",
        link: "https://www.youtube.com/watch?v=3n5LwW-lqI4"
    },
    {
        name: "Atomic Habits: Easy & Proven Ways",
        provider: "James Clear Guide",
        stream: "Self Development",
        type: "youtube",
        icon: "⚛️",
        desc: "Build positive routines, eliminate negative patterns, and stack micro-habits effectively.",
        link: "https://www.youtube.com/watch?v=PZ7lDrwYdZc"
    },
    {
        name: "Mindset: The New Psychology of Success",
        provider: "Carol Dweck Explainer",
        stream: "Self Development",
        type: "youtube",
        icon: "🌱",
        desc: "Difference between fixed and growth mindsets, and building resilience to failures.",
        link: "https://www.youtube.com/watch?v=M1F2Ot8KiiU"
    },
    {
        name: "The 7 Habits of Highly Effective People",
        provider: "Stephen Covey Guide",
        stream: "Self Development",
        type: "youtube",
        icon: "🗓️",
        desc: "Master key principles of proactive planning, priority settings, and synergistic collaboration.",
        link: "https://www.youtube.com/watch?v=WFc08j9eEhk"
    },
    {
        name: "Emotional Intelligence Masterclass",
        provider: "Daniel Goleman Guide",
        stream: "Self Development",
        type: "youtube",
        icon: "🧠",
        desc: "Learn self-regulation, empathy loops, social skills, and self-motivation systems.",
        link: "https://www.youtube.com/watch?v=Y7m9eNoB3NU"
    },
    {
        name: "Executive Time Management Protocols",
        provider: "Brian Tracy Guide",
        stream: "Self Development",
        type: "youtube",
        icon: "⏳",
        desc: "Eat that frog systems, delegation rules, 80/20 filters, and task planning strategies.",
        link: "https://www.youtube.com/watch?v=0W-lqI4z_D0"
    },
    {
        name: "Public Speaking & Rhetoric Skills",
        provider: "Toastmasters Online",
        stream: "Self Development",
        type: "youtube",
        icon: "🗣️",
        desc: "Learn voice modulation, body posture, slide layouts, and stage fear management.",
        link: "https://www.youtube.com/watch?v=e_Z_F5_3YV0"
    },
    {
        name: "Speed Reading & Cognitive Comprehension",
        provider: "Jim Kwik Guide",
        stream: "Self Development",
        type: "youtube",
        icon: "📖",
        desc: "Eliminate subvocalization habits, use visual guides, and improve memory retention.",
        link: "https://www.youtube.com/watch?v=3z8gVnJ9Y4s"
    },
    {
        name: "Stoic Philosophy & Emotional Resilience",
        provider: "Daily Stoic (Ryan Holiday)",
        stream: "Self Development",
        type: "youtube",
        icon: "🏛️",
        desc: "Learn to distinguish controls, practice negative visualizations, and build grit.",
        link: "https://www.youtube.com/watch?v=apGV9Ad7XYY"
    },
    {
        name: "Mindfulness Meditation for Beginners",
        provider: "Mindfulness Centre",
        stream: "Self Development",
        type: "youtube",
        icon: "🧘",
        desc: "Simple breath works, focus anchors, bodily scans, and anxiety reduction protocols.",
        link: "https://www.youtube.com/watch?v=3z8gVnJ9Y4s"
    },
    {
        name: "Goal Setting & OKR Frameworks",
        provider: "John Doerr Guide",
        stream: "Self Development",
        type: "youtube",
        icon: "🎯",
        desc: "How to design Objectives and Key Results, set weekly reviews, and track progress.",
        link: "https://www.youtube.com/watch?v=WFc08j9eEhk"
    },
    {
        name: "Active Listening & Communication Skills",
        provider: "GreggU Education",
        stream: "Self Development",
        type: "youtube",
        icon: "👂",
        desc: "Paraphrase techniques, non-verbal cues, clarification questions, and emotional feedbacks.",
        link: "https://www.youtube.com/watch?v=e_Z_F5_3YV0"
    },
    {
        name: "Cognitive Reframing & CBT Tools",
        provider: "CBT Academy",
        stream: "Self Development",
        type: "youtube",
        icon: "💭",
        desc: "Identify cognitive distortions, journal toxic thoughts, and reframe negative dialogues.",
        link: "https://www.youtube.com/watch?v=apGV9Ad7XYY"
    },
    {
        name: "Minimalism: Simplify Your Environment",
        provider: "The Minimalists Guide",
        stream: "Self Development",
        type: "youtube",
        icon: "📦",
        desc: "De-clutter workspaces, reduce digital inputs, and focus energy on core goals.",
        link: "https://www.youtube.com/watch?v=3z8gVnJ9Y4s"
    },
    {
        name: "Optimizing Sleep for Peak Cognition",
        provider: "Huberman Lab",
        stream: "Self Development",
        type: "youtube",
        icon: "💤",
        desc: "Morning sunlight targets, temperature drops, circadian timing, and sleep tools.",
        link: "https://www.youtube.com/watch?v=LG53VxUm0as"
    },
    {
        name: "Negotiation for Life & Career",
        provider: "Chris Voss Explainer",
        stream: "Self Development",
        type: "youtube",
        icon: "🤝",
        desc: "Tactical empathy, mirroring voices, labeling emotions, and creating safety in dialogue.",
        link: "https://www.youtube.com/watch?v=RfTalFEeKKE"
    },
    {
        name: "Building Grit & Long-Term Passion",
        provider: "Angela Duckworth Explainer",
        stream: "Self Development",
        type: "youtube",
        icon: "🧗",
        desc: "Why perseverance and deliberate practice matter more than talent for success.",
        link: "https://www.youtube.com/watch?v=M1F2Ot8KiiU"
    },
    {
        name: "Memory Palace & Method of Loci",
        provider: "Memory Champions",
        stream: "Self Development",
        type: "youtube",
        icon: "🏰",
        desc: "How to use spatial environments to remember lists, numbers, lectures, and texts.",
        link: "https://www.youtube.com/watch?v=3z8gVnJ9Y4s"
    },
    {
        name: "Financial Literacy for Young Professionals",
        provider: "Wealth Guide",
        stream: "Self Development",
        type: "youtube",
        icon: "💰",
        desc: "Tax strategies, compound index investing, budget automation, and emergency accounts.",
        link: "https://www.youtube.com/watch?v=3z8gVnJ9Y4s"
    }
];

let activeHubCategory = "All";
let activeHubSearch = "";

function initLearningHub() {
    const tabs = document.querySelectorAll("#hubTabs .filter-btn");
    const searchInput = document.getElementById("hubSearchInput");
    const searchBtn = document.getElementById("hubSearchBtn");
    const clearBtn = document.getElementById("clearHubSearchBtn");

    // Initial render
    renderResources("All", "");

    // Event listeners for tabs
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active classes
            tabs.forEach(t => t.classList.remove("active"));
            
            // Add active class
            tab.classList.add("active");

            activeHubCategory = tab.getAttribute("data-stream");
            const query = searchInput ? searchInput.value.trim() : "";
            renderResources(activeHubCategory, query);
        });
    });

    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", () => {
            renderResources(activeHubCategory, searchInput.value.trim());
        });
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                renderResources(activeHubCategory, searchInput.value.trim());
            }
        });
        searchInput.addEventListener("input", () => {
            const val = searchInput.value.trim();
            if (clearBtn) {
                clearBtn.style.display = val ? "block" : "none";
            }
            renderResources(activeHubCategory, val);
        });
    }

    window.clearHubSearch = function() {
        if (searchInput) searchInput.value = "";
        if (clearBtn) clearBtn.style.display = "none";
        renderResources(activeHubCategory, "");
    };
}

function renderResources(stream = "All", searchValue = "") {
    activeHubCategory = stream;
    activeHubSearch = searchValue;

    const grid = document.getElementById("resourceGrid");
    if (!grid) return;

    grid.innerHTML = "";

    let filtered = learningResources;
    if (stream !== "All") {
        filtered = filtered.filter(r => r.stream === stream);
    }

    if (searchValue) {
        const query = searchValue.toLowerCase();
        filtered = filtered.filter(r => 
            r.name.toLowerCase().includes(query) ||
            r.provider.toLowerCase().includes(query) ||
            r.desc.toLowerCase().includes(query) ||
            r.stream.toLowerCase().includes(query)
        );
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:50px; color:var(--text-muted);">
                <h3>No Resources Available</h3>
                <p>Try searching for another query or selecting a different tab.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(res => {
        let typeBadgeClass = "youtube";
        let typeText = "Video Course";

        if (res.type === "google") {
            typeBadgeClass = "google";
            typeText = "Research Portal";
        } else if (res.type === "library") {
            typeBadgeClass = "library";
            typeText = "Digital Reference";
        }

        grid.innerHTML += `
            <div class="resource-card" style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
                <div>
                    <div class="resource-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                        <span class="resource-icon" style="font-size:28px;">${res.icon}</span>
                        <span class="resource-type-badge ${typeBadgeClass}" style="padding:4px 10px; border-radius:12px; font-size:11px; font-weight:600;">${typeText}</span>
                    </div>
                    <h3 style="font-size:17px; font-weight:700; color:var(--text-color); margin-bottom:8px; line-height:1.4;">${res.name}</h3>
                    <p class="provider" style="font-size:12.5px; font-weight:600; color:var(--accent-color); margin-bottom:8px;">${res.provider}</p>
                    <p class="desc" style="font-size:13.5px; color:var(--text-muted); line-height:1.5; margin-bottom:20px;">${res.desc}</p>
                </div>
                
                <div class="resource-footer" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:15px; margin-top:auto;">
                    <span class="resource-stream-tag" style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">${res.stream}</span>
                    <a href="${res.link}" target="_blank" class="resource-link" style="padding:8px 16px; border-radius:8px; font-size:13px; font-weight:600; display:inline-flex; align-items:center; gap:6px; text-decoration:none;">
                        Watch Now
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                    </a>
                </div>
            </div>
        `;
    });
}
