import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, BookOpen, Search } from "lucide-react";
import Image from "next/image";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const courses = await prisma.course.findMany({
    where: searchParams.search
      ? {
          OR: [
            { title: { contains: searchParams.search, mode: "insensitive" } },
            { description: { contains: searchParams.search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">All Courses</h1>
          <p className="text-gray-500 mt-1">Explore our premium learning programs</p>
        </div>
        <form className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              name="search"
              placeholder="Search courses..."
              defaultValue={searchParams.search}
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500">No courses found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden">
                <div className="relative h-48 bg-gray-200">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <BookOpen className="h-12 w-12" />
                    </div>
                  )}
                  {course.featured && (
                    <Badge className="absolute top-3 right-3 bg-pild-secondary text-black">Featured</Badge>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-pild-primary transition-colors">
                    {course.title}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration || "Self-paced"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-pild-primary">
                      PKR {course.fee.toLocaleString()}
                    </span>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}