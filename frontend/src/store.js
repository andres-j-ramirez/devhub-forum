// src/store.js

export const store = {
  // Sample feed posts remain the same:
  feed: [
    {
      _id: "1",
      title: "Breaking into Software Engineering",
      excerpt: "A guide to starting your career in software engineering.",
      content: "Full content for post 1...",
      image: "https://picsum.photos/seed/post1/600/400",
      articleUrl: "http://github.com/npmaile/blog/blob/main/posts/2.%20How%20to%20get%20into%20software.md",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Software Engineering",
      likes: 12,
      liked: false,
      comments: [
        { _id: "c1", author: "Alice", text: "Great guide!" }
      ],
      newComment: "",
      showComments: false
    },
    {
      _id: "2",
      title: "A Beginner’s Guide to Cloud Infrastructure",
      excerpt: "An introduction to the basics of cloud infrastructure.",
      content: "Full content for post 2...",
      image: "https://picsum.photos/seed/post2/600/400",
      articleUrl: "https://www.ibm.com/think/topics/cloud-computing",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Cloud",
      likes: 25,
      liked: false,
      comments: [
        { _id: "c2", author: "Bob", text: "Very informative!" }
      ],
      newComment: "",
      showComments: false
    },
    {
      _id: "3",
      title: "The Future of AI: Trends to Watch",
      excerpt: "Exploring emerging trends in artificial intelligence.",
      content: "Full content for post 3...",
      image: "https://picsum.photos/seed/post3/600/400",
      articleUrl: "https://sloanreview.mit.edu/article/five-trends-in-ai-and-data-science-for-2025/",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Tech News",
      likes: 30,
      liked: false,
      comments: [
        { _id: "c3", author: "Carol", text: "Exciting future!" }
      ],
      newComment: "",
      showComments: false
    },
    {
      _id: "4",
      title: "Top DevOps Tools: Docker, Kubernetes, Terraform",
      excerpt: "An overview of essential DevOps tools for building and managing cloud-native apps.",
      content: "Full content for post 4...",
      image: "https://picsum.photos/seed/post4/600/400",
      articleUrl: "https://www.env0.com/blog/top-devops-tools-for-infrastructure-automation#:~:text=Some%20of%20the%20most%20popular,Kubernetes%2C%20Terraform%2C%20and%20Prometheus.",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Cloud",
      likes: 15,
      liked: false,
      comments: [],
      newComment: "",
      showComments: false
    },
    {
      _id: "5",
      title: "Securing Cloud Environments in 2025",
      excerpt: "Learn key strategies to protect your cloud systems from evolving cyber threats.",
      content: "Full content for post 5...",
      image: "https://picsum.photos/seed/post5/600/400",
      articleUrl: "https://www.charterglobal.com/cloud-security-best-practices/",
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Cloud",
      likes: 18,
      liked: false,
      comments: [],
      newComment: "",
      showComments: false
    },
    {
      _id: "6",
      title: "Containerization Best Practices for Modern Applications",
      excerpt: "Tips and best practices for using Docker and container technologies effectively.",
      content: "Full content for post 6...",
      image: "https://picsum.photos/seed/post6/600/400",
      articleUrl: "https://www.tenable.com/blog/mastering-containerization-key-strategies-and-best-practices",
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Cloud",
      likes: 22,
      liked: false,
      comments: [],
      newComment: "",
      showComments: false
    },
    {
      _id: "7",
      title: "Strategies for Database Scaling in the Cloud",
      excerpt: "Explore techniques for scaling your databases to meet growing demand in cloud environments.",
      content: "Full content for post 7...",
      image: "https://picsum.photos/seed/post7/600/400",
      articleUrl: "https://karandeepsingh.ca/posts/leveraging-devops-cloud-database-scaling/",
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Cloud",
      likes: 14,
      liked: false,
      comments: [
        { _id: "c4", author: "Frank", text: "Very informative!" }
      ],
      newComment: "",
      showComments: false
    }
  ],

  // Pre-populated user data with filler posts and comments
  user: {
    username: "John Doe",
    avatar: "https://picsum.photos/seed/avatar123/200/200",
    bio: "Full-stack developer and DevOps enthusiast.",
    posts: [
      {
        title: "My First Post",
        content: "This is the content of my first post."
      },
      {
        title: "My Second Post",
        content: "Hello from my second post!"
      }
    ],
    comments: [
      {
        text: "Nice article!",
        postTitle: "Breaking into Software Engineering"
      },
      {
        text: "I totally agree with your points.",
        postTitle: "The Future of AI: Trends to Watch"
      }
    ]
  }
};
