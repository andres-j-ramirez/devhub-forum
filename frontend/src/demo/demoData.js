const KEY = "devhub_demo_state_v1";

function nowMinus(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export function newId() {
  return (Date.now().toString(36) + Math.random().toString(36).slice(2)).toUpperCase();
}

function ph(title) {
  const t = encodeURIComponent(title);
  return `https://placehold.co/1024x480/png?text=${t}`;
}

function samplePosts() {
  return [
    {
      id: "p1",
      title: "Welcome to DevHub (Demo)",
      excerpt: "This is a static demo running on GitHub Pages.",
      content: "Welcome! Browse posts, like, and add comments. Use the Reset button to restore the seed.",
      image: ph("DevHub Demo"),
      articleUrl: "https://github.com/andres-j-ramirez/devhub-forum",
      createdAt: nowMinus(1),
      category: "Tech News",
      likes: 15,
      liked: false,
      comments: []
    },
    {
      id: "p2",
      title: "Top DevOps Tools: Docker, Kubernetes, Terraform",
      excerpt: "Essential tools for cloud-native apps.",
      content: "A tour through modern DevOps tooling and why each matters.",
      image: ph("DevOps • Docker • K8s • Terraform"),
      articleUrl: "https://www.env0.com/blog/top-devops-tools-for-infrastructure-automation",
      createdAt: nowMinus(2),
      category: "Cloud",
      likes: 8,
      liked: false,
      comments: [{ id: "c21", author: "Alice", text: "Great overview!" }]
    },
    {
      id: "p3",
      title: "The Future of AI: Trends to Watch",
      excerpt: "Emerging trends in AI to keep an eye on.",
      content: "Foundation models, agents, and responsible AI in practice.",
      image: ph("AI • Trends"),
      articleUrl: "https://sloanreview.mit.edu/article/five-trends-in-ai-and-data-science-for-2025/",
      createdAt: nowMinus(3),
      category: "Tech News",
      likes: 30,
      liked: false,
      comments: [{ id: "c31", author: "Bob", text: "Exciting times!" }]
    },
    {
      id: "p4",
      title: "Securing Cloud Environments in 2025",
      excerpt: "Key strategies to protect cloud systems from evolving threats.",
      content: "Identity first, least privilege, and runtime protection.",
      image: ph("Cloud Security"),
      articleUrl: "https://www.charterglobal.com/cloud-security-best-practices/",
      createdAt: nowMinus(4),
      category: "Cloud",
      likes: 18,
      liked: false,
      comments: []
    },
    {
      id: "p5",
      title: "Containerization Best Practices",
      excerpt: "Tips for effective Docker usage.",
      content: "Small images, SBOMs, static scans, and runtime policies.",
      image: ph("Docker • Containers"),
      articleUrl: "https://www.tenable.com/blog/mastering-containerization-key-strategies-and-best-practices",
      createdAt: nowMinus(5),
      category: "Cloud",
      likes: 22,
      liked: false,
      comments: []
    },
    {
      id: "p6",
      title: "Breaking into Software Engineering",
      excerpt: "A practical guide to landing your first role.",
      content: "Projects > courses. Ship things. Tell the story.",
      image: ph("Software Engineering"),
      articleUrl: "https://github.com/npmaile/blog/blob/main/posts/2.%20How%20to%20get%20into%20software.md",
      createdAt: nowMinus(6),
      category: "Software Engineering",
      likes: 12,
      liked: false,
      comments: [{ id: "c61", author: "Carol", text: "Bookmarked!" }]
    },
    {
      id: "p7",
      title: "Database Scaling in the Cloud",
      excerpt: "Techniques for scaling databases as demand grows.",
      content: "Sharding vs read replicas, caching, and profilers.",
      image: ph("Cloud Databases • Scaling"),
      articleUrl: "https://karandeepsingh.ca/posts/leveraging-devops-cloud-database-scaling/",
      createdAt: nowMinus(7),
      category: "Cloud",
      likes: 14,
      liked: false,
      comments: []
    },
    {
      id: "p8",
      title: "CI/CD Tips for Small Teams",
      excerpt: "Keep pipelines fast, observable, and boring.",
      content: "Cache well, fail fast, parallelize, and protect main.",
      image: ph("CI/CD • Pipelines"),
      articleUrl: "https://martinfowler.com/bliki/ContinuousDelivery.html",
      createdAt: nowMinus(8),
      category: "Software Engineering",
      likes: 11,
      liked: false,
      comments: []
    }
  ];
}

function initialState() {
  return {
    user: {
      username: "andresramirez",
      avatar: "https://i.pravatar.cc/150?img=12",
      bio: "Cloud-native engineer. I build and ship things.",
      comments: []
    },
    posts: samplePosts()
  };
}

export function readDemo() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeDemo(nextState) {
  localStorage.setItem(KEY, JSON.stringify(nextState));
}

export function seedDemoIfNeeded() {
  if (!readDemo()) writeDemo(initialState());
}

export function resetDemo() {
  writeDemo(initialState());
}
