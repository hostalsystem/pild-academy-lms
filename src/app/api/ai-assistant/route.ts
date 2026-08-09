import { NextResponse } from "next/server";

function getAssistantResponse(message: string): string {
  const text = message.toLowerCase().trim();

  // Greetings
  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey") ||
    text.includes("salam") ||
    text.includes("assalam")
  ) {
    return "Hello! Welcome to PILD Academy. I am your PILD Academy Assistant. How can I help you today?";
  }

  // About PILD Academy
  if (
    text.includes("what is pild") ||
    text.includes("about pild") ||
    text.includes("tell me about pild") ||
    text.includes("what is pild academy")
  ) {
    return "PILD Academy is an educational platform focused on practical learning, professional skills, courses, learning resources, certificates, and career development.";
  }

  // Courses
  if (
    text.includes("course") ||
    text.includes("courses") ||
    text.includes("what do you teach") ||
    text.includes("what can i learn")
  ) {
    return "You can explore all available courses from the Courses section of the website. Open the Courses page to see the available programs, course details, duration, and enrollment options.";
  }

  // Enrollment
  if (
    text.includes("enroll") ||
    text.includes("enrollment") ||
    text.includes("join course") ||
    text.includes("join a course")
  ) {
    return "To enroll, open the Courses section, select the course you are interested in, review the course information, and then use the enrollment option available on the course page.";
  }

  // Registration
  if (
    text.includes("register") ||
    text.includes("registration") ||
    text.includes("create account") ||
    text.includes("sign up")
  ) {
    return "You can create your PILD Academy account by selecting Get Started or Register from the website navigation.";
  }

  // Login
  if (
    text.includes("login") ||
    text.includes("log in") ||
    text.includes("sign in")
  ) {
    return "You can sign in to your PILD Academy account using the Sign In option in the website navigation.";
  }

  // Instructor
  if (
    text.includes("instructor") ||
    text.includes("instructors") ||
    text.includes("teacher") ||
    text.includes("teachers")
  ) {
    return "You can meet the PILD Academy instructors by opening the Instructors section from the website navigation.";
  }

  // Certificates
  if (
    text.includes("certificate") ||
    text.includes("certificates") ||
    text.includes("certification")
  ) {
    return "PILD Academy provides certificates for eligible completed courses. Open the relevant course information to learn about its certificate details.";
  }

  // Payment
  if (
    text.includes("payment") ||
    text.includes("pay") ||
    text.includes("fee") ||
    text.includes("price") ||
    text.includes("cost")
  ) {
    return "Course pricing and payment information are shown on the individual course page. Open the course you are interested in to view its current enrollment information.";
  }

  // Student dashboard
  if (
    text.includes("dashboard") ||
    text.includes("student dashboard")
  ) {
    return "After signing in, you can access your student dashboard to manage your learning activities and account information.";
  }

  // Contact
  if (
    text.includes("contact") ||
    text.includes("support") ||
    text.includes("help") ||
    text.includes("problem")
  ) {
    return "If you need assistance, please use the Contact section of the website to get in touch with PILD Academy support.";
  }

  // Website navigation
  if (
    text.includes("where") ||
    text.includes("find") ||
    text.includes("how to")
  ) {
    return "I can help you navigate PILD Academy. You can use the main navigation to access Home, Courses, Instructors, About, Sign In, and Get Started.";
  }

  // Mobile
  if (
    text.includes("mobile") ||
    text.includes("phone") ||
    text.includes("android") ||
    text.includes("iphone")
  ) {
    return "PILD Academy is designed to be accessible on both desktop and mobile devices. You can use your phone browser to access the website.";
  }

  // General learning questions
  if (
    text.includes("learn") ||
    text.includes("learning") ||
    text.includes("study")
  ) {
    return "PILD Academy is focused on practical and career-oriented learning. Explore the Courses section to find a program that matches your learning goals.";
  }

  // Thank you
  if (
    text.includes("thank") ||
    text.includes("thanks")
  ) {
    return "You're welcome! I am always happy to help. If you have another question about PILD Academy, just ask.";
  }

  // Goodbye
  if (
    text.includes("bye") ||
    text.includes("goodbye")
  ) {
    return "Goodbye! Thank you for visiting PILD Academy. Keep learning, growing, and succeeding!";
  }

  // Default response
  return "I can help you with PILD Academy courses, enrollment, instructors, certificates, registration, login, website navigation, and general academy information. What would you like to know?";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message = body?.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "Please provide a valid message.",
        },
        {
          status: 400,
        }
      );
    }

    const answer = getAssistantResponse(message);

    return NextResponse.json({
      answer,
    });
  } catch (error) {
    console.error("AI Assistant Error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}