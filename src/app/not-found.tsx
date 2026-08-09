import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-pild-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-gray-500">The page you are looking for does not exist.</p>
        <Link href="/">
          <Button className="bg-pild-primary">
            <Home className="mr-2 h-4 w-4" /> Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
