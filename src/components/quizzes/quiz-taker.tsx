"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  Send,
  Trophy,
  Target,
  RotateCcw,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
  marks: number;
  order: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  timeLimit: number | null;
  passingScore: number;
  totalMarks: number;
  course: { title: string };
  questions: Question[];
}

interface Attempt {
  id: string;
  score: number;
  totalMarks: number;
  percentage: number;
  status: string;
  answers: Record<string, string | number>;
  completedAt: Date | null;
}

interface QuizTakerProps {
  quiz: Quiz;
  initialAttempt: Attempt | null;
  isCompleted: boolean;
}

export function QuizTaker({ quiz, initialAttempt, isCompleted }: QuizTakerProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : 0);
  const [submitted, setSubmitted] = useState(isCompleted);
  const [result, setResult] = useState<Attempt | null>(initialAttempt);
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(isCompleted);

  // Timer
  useEffect(() => {
    if (submitted || !quiz.timeLimit || showResults) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted, quiz.timeLimit, showResults]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = useCallback(async () => {
    if (submitted) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.attempt);
        setSubmitted(true);
        setShowResults(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }, [answers, quiz.id, submitted]);

  const currentQuestion = quiz.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz.questions.length;
  const progressPercent = (answeredCount / totalQuestions) * 100;

  // Results view
  if (showResults && result) {
    const isPassed = result.status === "PASSED";
    return (
      <div className="space-y-6">
        <Link
          href="/quizzes"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pild-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Link>

        <Card className="overflow-hidden">
          <CardContent className="p-8 text-center">
            <div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4",
                isPassed ? "bg-green-100" : "bg-red-100"
              )}
            >
              {isPassed ? (
                <Trophy className="h-10 w-10 text-green-600" />
              ) : (
                <AlertCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isPassed ? "Congratulations!" : "Quiz Completed"}
            </h2>
            <p className="text-gray-500 mb-6">
              {isPassed
                ? "You passed the quiz!"
                : "You didn't reach the passing score. Review and try again."}
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500">Score</p>
                <p className="text-xl font-bold text-gray-900">
                  {result.score}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-xl font-bold text-gray-900">
                  {result.totalMarks}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500">Percentage</p>
                <p
                  className={cn(
                    "text-xl font-bold",
                    isPassed ? "text-green-600" : "text-red-600"
                  )}
                >
                  {Math.round(result.percentage)}%
                </p>
              </div>
            </div>

            <Progress
              value={result.percentage}
              className="h-3 max-w-md mx-auto mb-6"
            />

            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setSubmitted(false);
                  setAnswers({});
                  setCurrentIndex(0);
                  setTimeLeft(quiz.timeLimit ? quiz.timeLimit * 60 : 0);
                }}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Retake Quiz
              </Button>
              <Link href="/quizzes">
                <Button className="bg-pild-primary gap-2">
                  <CheckCircle className="h-4 w-4" />
                  All Quizzes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Review Answers */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Review Answers
          </h3>
          {quiz.questions.map((q, idx) => {
            const userAnswer = result.answers?.[q.id];
            const isCorrect = String(userAnswer) === q.correctAnswer;
            const correctIndex = parseInt(q.correctAnswer);

            return (
              <Card key={q.id} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <span
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                        isCorrect
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{q.question}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {q.marks} marks
                      </p>
                    </div>
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                    )}
                  </div>

                  <div className="space-y-2 ml-10">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = String(userAnswer) === String(optIdx);
                      const isCorrectOpt = optIdx === correctIndex;

                      return (
                        <div
                          key={optIdx}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg text-sm border",
                            isCorrectOpt
                              ? "bg-green-50 border-green-200 text-green-800"
                              : isSelected && !isCorrectOpt
                              ? "bg-red-50 border-red-200 text-red-800"
                              : "bg-gray-50 border-gray-100 text-gray-600"
                          )}
                        >
                          <span
                            className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shrink-0",
                              isCorrectOpt
                                ? "border-green-500 text-green-600"
                                : isSelected && !isCorrectOpt
                                ? "border-red-500 text-red-600"
                                : "border-gray-300 text-gray-400"
                            )}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                          {isCorrectOpt && (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-auto shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="mt-4 ml-10 bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                      <span className="font-medium">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Quiz taking view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/quizzes"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pild-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        {quiz.timeLimit && (
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-medium",
              timeLeft < 60
                ? "bg-red-50 text-red-600"
                : "bg-gray-100 text-gray-700"
            )}
          >
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">{quiz.course.title}</p>
        <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            {totalQuestions} Questions
          </span>
          <span className="flex items-center gap-1">
            <Target className="h-3.5 w-3.5" />
            {quiz.totalMarks} Marks
          </span>
          <span className="flex items-center gap-1">
            <Trophy className="h-3.5 w-3.5 text-pild-secondary" />
            Pass: {quiz.passingScore}%
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span>{answeredCount} answered</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Question */}
      {currentQuestion && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="bg-pild-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                {currentIndex + 1}
              </span>
              <div className="flex-1">
                <p className="text-lg font-medium text-gray-900 leading-relaxed">
                  {currentQuestion.question}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {currentQuestion.marks} marks
                </p>
              </div>
            </div>

            <div className="space-y-2 ml-11">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected =
                  answers[currentQuestion.id] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() =>
                      handleSelect(currentQuestion.id, optIdx)
                    }
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-lg text-left text-sm border transition-all",
                      isSelected
                        ? "bg-blue-50 border-pild-primary text-pild-primary ring-1 ring-pild-primary"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                    )}
                  >
                    <span
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                        isSelected
                          ? "border-pild-primary bg-pild-primary text-white"
                          : "border-gray-300 text-gray-400"
                      )}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-pild-primary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        {currentIndex < totalQuestions - 1 ? (
          <Button
            onClick={() =>
              setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))
            }
            className="bg-pild-primary gap-2"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitting || answeredCount === 0}
            className="bg-green-600 hover:bg-green-700 gap-2"
          >
            {submitting ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Quiz
              </>
            )}
          </Button>
        )}
      </div>

      {/* Question Navigator */}
      <div className="flex flex-wrap gap-2 justify-center">
        {quiz.questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "w-10 h-10 rounded-lg text-sm font-medium transition-all border",
                isCurrent
                  ? "bg-pild-primary text-white border-pild-primary"
                  : isAnswered
                  ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              )}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}