import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const courses = [
    {
      title: "Full Stack Web Development",
      slug: "full-stack-web-development",
      description: "Master React, Node.js, and modern web development from scratch. Build real-world projects and deploy them to production.",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      duration: "12 weeks",
      fee: 15000,
      objectives: ["Build complete web applications", "Master React and Next.js", "Create REST APIs with Node.js", "Deploy apps to cloud"],
      skills: ["React", "Node.js", "TypeScript", "MongoDB", "Express", "Next.js"],
      requirements: ["Basic HTML/CSS knowledge", "JavaScript fundamentals", "A computer with internet"],
      outcomes: ["Build full-stack applications", "Deploy production-ready apps", "Understand database design"],
      featured: true,
      published: true,
    },
    {
      title: "Python for Data Science",
      slug: "python-data-science",
      description: "Learn Python, Pandas, NumPy, and Machine Learning fundamentals from industry experts.",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
      duration: "10 weeks",
      fee: 12000,
      objectives: ["Master Python programming", "Analyze data with Pandas", "Visualize data", "Build ML models"],
      skills: ["Python", "Pandas", "NumPy", "Matplotlib", "Scikit-learn", "Jupyter"],
      requirements: ["Basic math knowledge", "A computer with internet", "No programming experience needed"],
      outcomes: ["Analyze real datasets", "Build predictive models", "Create data visualizations"],
      featured: true,
      published: true,
    },
    {
      title: "Mobile App Development with Flutter",
      slug: "flutter-mobile-development",
      description: "Build beautiful cross-platform mobile apps with Flutter and Dart.",
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
      duration: "8 weeks",
      fee: 10000,
      objectives: ["Build iOS and Android apps", "Master Dart language", "Create beautiful UIs", "Deploy to app stores"],
      skills: ["Flutter", "Dart", "Firebase", "REST APIs", "State Management"],
      requirements: ["Basic programming knowledge", "Android Studio or VS Code", "A computer with 8GB RAM"],
      outcomes: ["Build 3 complete apps", "Publish to Play Store", "Master Flutter widgets"],
      featured: true,
      published: true,
    },
    {
      title: "UI/UX Design Masterclass",
      slug: "ui-ux-design",
      description: "Learn Figma, design principles, and create stunning user interfaces.",
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
      duration: "6 weeks",
      fee: 8000,
      objectives: ["Master Figma", "Understand design principles", "Create wireframes", "Build design systems"],
      skills: ["Figma", "UI Design", "UX Research", "Prototyping", "Design Systems"],
      requirements: ["Creativity and curiosity", "A computer that can run Figma", "No design experience needed"],
      outcomes: ["Create portfolio projects", "Build complete design systems", "Conduct user research"],
      featured: false,
      published: true,
    },
  ]

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: course,
    })
  }

  console.log(`✅ Seeded ${courses.length} courses`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })