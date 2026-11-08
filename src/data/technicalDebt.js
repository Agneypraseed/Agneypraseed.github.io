// Reading backlog. Each book has an id, title, author, and optional notes.
const technicalDebt = [
    {
        id: "mathematics-for-machine-learning",
        title: "Mathematics for Machine Learning",
        author: "Marc Peter Deisenroth, A. Aldo Faisal, Cheng Soon Ong",
    },
    {
        id: "practical-linear-algebra-for-data-science",
        title: "Practical Linear Algebra for Data Science",
        author: "Mike X Cohen",
    },
    {
        id: "algebra",
        title: "Algebra",
        author: "Serge Lang",
    },
    {
        id: "convex-optimization",
        title: "Convex Optimization",
        author: "Stephen Boyd, Lieven Vandenberghe",
    },
    {
        id: "optimization-for-machine-learning",
        title: "Optimization for Machine Learning",
        author: "Suvrit Sra, Sebastian Nowozin, Stephen J. Wright",
    },
    {
        id: "linear-programming-chvatal",
        title: "Linear Programming",
        author: "Vašek Chvátal",
    },
    {
        id: "linear-programming-foundations-and-extensions",
        title: "Linear Programming: Foundations and Extensions",
        author: "Robert J. Vanderbei",
    },
    {
        id: "neural-networks-a-systematic-introduction",
        title: "Neural Networks: A Systematic Introduction",
        author: "Raúl Rojas",
    },
    {
        id: "reinforcement-learning-an-introduction",
        title: "Reinforcement Learning: An Introduction",
        author: "Richard S. Sutton, Andrew G. Barto",
        notes: "Reinforcement learning, Markov decision processes, Bellman equations, dynamic programming, Monte Carlo methods, temporal-difference learning, Q-learning, and policy gradients.",
    },
    {
        id: "programming-massively-parallel-processors",
        title: "Programming Massively Parallel Processors: A Hands-on Approach",
        author: "David B. Kirk, Wen-mei W. Hwu, Izzat El Hajj",
    },
    {
        id: "a-first-course-on-data-structures-in-python",
        title: "A First Course on Data Structures in Python",
        author: "Donald R. Sheehy",
    },
    {
        id: "open-data-structures",
        title: "Open Data Structures",
        author: "Pat Morin",
    },
    {
        id: "data-structures-the-fun-way",
        title: "Data Structures the Fun Way",
        author: "Jeremy Kubica",
    },
    {
        id: "building-blocks-for-theoretical-computer-science",
        title: "Building Blocks for Theoretical Computer Science",
        author: "Margaret Fleck",
    },
    {
        id: "mathematics-for-computer-science",
        title: "Mathematics for Computer Science",
        author: "Eric Lehman, F. Thomson Leighton, Albert R. Meyer",
    },
    {
        id: "structure-and-interpretation-of-computer-programs",
        title: "Structure and Interpretation of Computer Programs",
        author: "Harold Abelson, Gerald Jay Sussman, Julie Sussman",
    },
    {
        id: "computer-systems-a-programmers-perspective",
        title: "Computer Systems: A Programmer's Perspective",
        author: "Randal E. Bryant, David R. O'Hallaron",
    },
    {
        id: "operating-systems-three-easy-pieces",
        title: "Operating Systems: Three Easy Pieces",
        author: "Remzi H. Arpaci-Dusseau, Andrea C. Arpaci-Dusseau",
    },
    {
        id: "fundamentals-of-software-engineering",
        title: "Fundamentals of Software Engineering",
        author: "Carlo Ghezzi, Mehdi Jazayeri, Dino Mandrioli",
    },
    {
        id: "system-design-the-big-archive",
        title: "System Design: The Big Archive",
        author: "ByteByteGo",
    },
    {
        id: "the-visual-display-of-quantitative-information",
        title: "The Visual Display of Quantitative Information",
        author: "Edward R. Tufte",
    },
    {
        id: "data-analysis-for-politics-and-policy",
        title: "Data Analysis for Politics and Policy",
        author: "Edward R. Tufte",
    },
    {
        id: "probability-for-computer-scientists",
        title: "Probability for Computer Scientists",
        author: "Chris Piech",
    },
    {
        id: "algorithms",
        title: "Algorithms",
        author: "Jeff Erickson",
    },
    {
        id: "linear-algebra-done-right",
        title: "Linear Algebra Done Right",
        author: "Sheldon Axler",
        notes: "Linear algebra, vector spaces, linear maps, eigenvalues, eigenvectors, and invariant subspaces.",
    },
    {
        id: "learning-from-data",
        title: "Learning From Data",
        author: "Yaser S. Abu-Mostafa, Malik Magdon-Ismail, and Hsuan-Tien Lin",
        notes: "Machine learning theory, PAC learning, generalization, Hoeffding's inequality, VC dimension, and overfitting.",
    },
    {
        id: "understanding-machine-learning",
        title: "Understanding Machine Learning: From Theory to Algorithms",
        author: "Shai Shalev-Shwartz and Shai Ben-David",
        notes: "Theoretical machine learning, empirical risk minimization, generalization bounds, PAC learning, VC theory, convex learning, and neural networks.",
    },
    {
        id: "perceptrons",
        title: "Perceptrons: An Introduction to Computational Geometry",
        author: "Marvin Minsky and Seymour Papert",
        notes: "Perceptrons, linear separability, computational geometry, Boolean functions, and limitations of single-layer neural networks.",
    },
    {
        id: "concrete-mathematics",
        title: "Concrete Mathematics: A Foundation for Computer Science",
        author: "Ronald L. Graham, Donald E. Knuth, and Oren Patashnik",
    },
    {
        id: "generative-deep-learning",
        title: "Generative Deep Learning (2nd Edition)",
        author: "David Foster",
        notes: "Generative AI, variational autoencoders, GANs, transformers, diffusion models, and practical deep learning.",
    },
];

// Order within each subject is a suggested route, not a requirement to finish
// every book before starting another subject. Preserve all user-supplied notes.
const readingGroups = [
    {
        id: "mathematical-foundations",
        title: "Mathematical foundations",
        bookIds: [
            "building-blocks-for-theoretical-computer-science",
            "mathematics-for-computer-science",
            "practical-linear-algebra-for-data-science",
            "linear-algebra-done-right",
            "probability-for-computer-scientists",
            "mathematics-for-machine-learning",
            "concrete-mathematics",
            "algebra",
        ],
    },
    {
        id: "programming-and-algorithms",
        title: "Programming, data structures & algorithms",
        bookIds: [
            "structure-and-interpretation-of-computer-programs",
            "a-first-course-on-data-structures-in-python",
            "data-structures-the-fun-way",
            "open-data-structures",
            "algorithms",
        ],
    },
    {
        id: "systems-and-software",
        title: "Computer systems & software engineering",
        bookIds: [
            "computer-systems-a-programmers-perspective",
            "operating-systems-three-easy-pieces",
            "fundamentals-of-software-engineering",
            "system-design-the-big-archive",
            "programming-massively-parallel-processors",
        ],
    },
    {
        id: "machine-learning-foundations",
        title: "Machine-learning foundations",
        bookIds: [
            "learning-from-data",
            "understanding-machine-learning",
        ],
    },
    {
        id: "optimization",
        title: "Optimization",
        bookIds: [
            "linear-programming-chvatal",
            "linear-programming-foundations-and-extensions",
            "convex-optimization",
            "optimization-for-machine-learning",
        ],
    },
    {
        id: "neural-networks-and-reinforcement-learning",
        title: "Neural networks, generative models & reinforcement learning",
        bookIds: [
            "neural-networks-a-systematic-introduction",
            "perceptrons",
            "generative-deep-learning",
            "reinforcement-learning-an-introduction",
        ],
    },
    {
        id: "data-analysis-and-visualization",
        title: "Data analysis & visualization",
        bookIds: [
            "data-analysis-for-politics-and-policy",
            "the-visual-display-of-quantitative-information",
        ],
    },
];

export const technicalDebtGroups = readingGroups.map(({ bookIds, ...group }) => ({
    ...group,
    books: bookIds.map((id) => technicalDebt.find((book) => book.id === id)),
}));

export const toReadBooks = [
    {
        id: "the-way-of-the-superior-man",
        title: "The Way of the Superior Man",
        author: "David Deida",
    },
    {
        id: "lust-for-life",
        title: "Lust for Life",
        author: "Irving Stone",
    },
    {
        id: "surely-youre-joking-mr-feynman",
        title: "Surely You're Joking, Mr. Feynman!",
        author: "Richard P. Feynman",
    },
    {
        id: "zero-to-one",
        title: "Zero to One: Notes on Startups, or How to Build the Future",
        author: "Peter Thiel and Blake Masters",
    },
    {
        id: "the-infinity-machine",
        title: "The Infinity Machine: Demis Hassabis, DeepMind and the Quest for Superintelligence",
        author: "Sebastian Mallaby",
    },
    {
        id: "the-hitchhikers-guide-to-the-galaxy",
        title: "The Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
    },
    {
        id: "six-easy-pieces",
        title: "Six Easy Pieces",
        author: "Richard P. Feynman",
    },
    {
        id: "the-metamorphosis",
        title: "The Metamorphosis",
        author: "Franz Kafka",
    },
];

export default technicalDebtGroups.flatMap((group) => group.books);
