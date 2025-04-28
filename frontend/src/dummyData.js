export const dummyArticles = [
  {
    _id: "1",
    title: "Dummy Tech Article: AI Breakthrough",
    description: "A simulated breakthrough in artificial intelligence.",
    content: "This is the full content of the dummy AI article. It discusses simulated advancements and potential impacts.",
    category: "technology",
    imageUrl: "/placeholder.jpg", // Use a generic placeholder
    author: "AI Author",
    tags: ["dummy", "ai", "tech"],
    isFeatured: true,
    views: 150,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Dummy Sports News: Championship Final",
    description: "A recap of a fictional championship game.",
    content: "The dummy championship final was intense. Team A won against Team B in the last second. This is placeholder text.",
    category: "sports",
    imageUrl: "/placeholder.jpg",
    author: "Sporty Bot",
    tags: ["dummy", "sports", "final"],
    isFeatured: false,
    views: 200,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "Dummy Business Update: Market Trends",
    description: "An overview of fictional market trends.",
    content: "The dummy market is showing trends towards virtual goods. This content is generated for testing purposes.",
    category: "business",
    imageUrl: "/placeholder.jpg",
    author: "Econo Bot",
    tags: ["dummy", "business", "market"],
    isFeatured: false,
    views: 95,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    title: "Dummy Politics: New Policy Announced",
    description: "Details on a fictional government policy.",
    content: "A new dummy policy regarding digital infrastructure was announced today. More details are simulated here.",
    category: "politics",
    imageUrl: "/placeholder.jpg",
    author: "Gov Bot",
    tags: ["dummy", "politics", "policy"],
    isFeatured: false,
    views: 110,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "5",
    title: "Dummy Entertainment: Movie Premiere Buzz",
    description: "Fictional buzz surrounding a new blockbuster movie.",
    content: "The premiere of 'Galaxy Quest X' generated significant buzz. Critics are giving simulated rave reviews.",
    category: "entertainment",
    imageUrl: "/placeholder.jpg",
    author: "Holly Wood",
    tags: ["dummy", "movie", "entertainment"],
    isFeatured: false,
    views: 350,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "6",
    title: "Dummy Health: New Fitness Trend",
    description: "Exploring a fictional fitness craze.",
    content: "Underwater basket weaving is the latest simulated fitness trend taking the dummy nation by storm.",
    category: "health",
    imageUrl: "/placeholder.jpg",
    author: "Healthy Bot",
    tags: ["dummy", "health", "fitness"],
    isFeatured: false,
    views: 80,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "7",
    title: "Dummy Science: Mars Rover Discovery",
    description: "A simulated discovery made by a Mars rover.",
    content: "The dummy rover 'Curiosity II' has found evidence of simulated ancient water on Mars.",
    category: "science",
    imageUrl: "/placeholder.jpg",
    author: "Space Cadet",
    tags: ["dummy", "science", "space", "mars"],
    isFeatured: false,
    views: 180,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(), // 6 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "8",
    title: "Another Dummy Tech Article",
    description: "More simulated news from the tech world.",
    content: "Quantum computing simulation reaches a new milestone.",
    category: "technology",
    imageUrl: "/placeholder.jpg",
    author: "Tech Guru",
    tags: ["dummy", "tech", "quantum"],
    isFeatured: false,
    views: 120,
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(), // 1.5 days ago
    updatedAt: new Date().toISOString(),
  },
  // Add more dummy articles as needed for different categories/scenarios
];

export const dummyComments = [
  {
    _id: "c1",
    articleId: "1",
    authorName: "Commenter One",
    content: "Interesting dummy article!",
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    _id: "c2",
    articleId: "1",
    authorName: "Commenter Two",
    content: "This is just placeholder text.",
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    _id: "c3",
    articleId: "2",
    authorName: "Sports Fan",
    content: "What a fictional game!",
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
  },
  {
    _id: "c4",
    articleId: "3",
    authorName: "Business Analyst",
    content: "Interesting dummy trends.",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    _id: "c5",
    articleId: "5",
    authorName: "Movie Buff",
    content: "Can't wait for this fictional movie!",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
  },
];

// Update dummyStats calculation to reflect changes
export const dummyStats = {
  totalArticles: dummyArticles.length,
  totalViews: dummyArticles.reduce((sum, article) => sum + (article.views || 0), 0), // Ensure views exist
  totalComments: dummyComments.length,
};