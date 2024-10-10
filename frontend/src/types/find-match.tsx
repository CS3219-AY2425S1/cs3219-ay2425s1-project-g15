// eslint-disable no-invalid-page-export

export enum QuestionDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export enum QuestionLanguages {
  PYTHON = "python",
  JAVASCRIPT = "javascript",
}

export enum QuestionTopics {
  HASH_TABLE = "Hash Table",
  MONOTONIC_STACK = "Monotonic Stack",
  ORDERED_SET = "Ordered Set",
  MONOTONIC_QUEUE = "Monotonic Queue",
  REJECTION_SAMPLING = "Rejection Sampling",
  NUMBER_THEORY = "Number Theory",
  BREADTH_FIRST_SEARCH = "Breadth-First Search",
  SIMULATION = "Simulation",
  GRAPH = "Graph",
  PREFIX_SUM = "Prefix Sum",
  BICONNECTED_COMPONENT = "Biconnected Component",
  UNION_FIND = "Union Find",
  TWO_POINTERS = "Two Pointers",
  RECURSION = "Recursion",
  BRAINTEASER = "Brainteaser",
  BINARY_SEARCH = "Binary Search",
  STACK = "Stack",
  ENUMERATION = "Enumeration",
  GAME_THEORY = "Game Theory",
  LINKED_LIST = "Linked List",
  COMBINATORICS = "Combinatorics",
  PROBABILITY_STATISTICS = "Probability and Statistics",
  QUEUE = "Queue",
  DIVIDE_AND_CONQUER = "Divide and Conquer",
  MATRIX = "Matrix",
  BIT_MANIPULATION = "Bit Manipulation",
  BUCKET_SORT = "Bucket Sort",
  MERGE_SORT = "Merge Sort",
  ROLLING_HASH = "Rolling Hash",
  INTERACTIVE = "Interactive",
  COUNTING_SORT = "Counting Sort",
  SORTING = "Sorting",
  BITMASK = "Bitmask",
  DOUBLY_LINKED_LIST = "Doubly-Linked List",
  STRING = "String",
  STRONGLY_CONNECTED_COMPONENT = "Strongly Connected Component",
  MEMOIZATION = "Memoization",
  TRIE = "Trie",
  DEPTH_FIRST_SEARCH = "Depth-First Search",
  RANDOMIZED = "Randomized",
  SUFFIX_ARRAY = "Suffix Array",
  ARRAY = "Array",
  DESIGN = "Design",
  RADIX_SORT = "Radix Sort",
  TOPOLOGICAL_SORT = "Topological Sort",
  SLIDING_WINDOW = "Sliding Window",
  EULERIAN_CIRCUIT = "Eulerian Circuit",
  TREE = "Tree",
  SEGMENT_TREE = "Segment Tree",
  COUNTING = "Counting",
  BACKTRACKING = "Backtracking",
  MATH = "Math",
  HEAP_PRIORITY_QUEUE = "Heap (Priority Queue)",
  STRING_MATCHING = "String Matching",
  GEOMETRY = "Geometry",
  HASH_FUNCTION = "Hash Function",
  BINARY_INDEXED_TREE = "Binary Indexed Tree",
  LINE_SWEEP = "Line Sweep",
  QUICKSELECT = "Quickselect",
  MINIMUM_SPANNING_TREE = "Minimum Spanning Tree",
  SHORTEST_PATH = "Shortest Path",
  GREEDY = "Greedy",
  DYNAMIC_PROGRAMMING = "Dynamic Programming",
  BINARY_SEARCH_TREE = "Binary Search Tree",
  BINARY_TREE = "Binary Tree",
  HASH_SUM = "Hash Sum",
}

export interface QuestionMinified {
  questionid: string;
  title: string;
  complexity: string;
}

export interface NewQuestionData {
  title: string;
  description: string;
  category: string[];
  complexity: string;
}

export interface QuestionFull extends NewQuestionData {
  questionId: string;
}
