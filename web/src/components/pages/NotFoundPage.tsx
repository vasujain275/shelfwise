import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="max-w-md p-8 text-center bg-white rounded-lg shadow-lg">
        <img
          src="/shelfwise.png"
          alt="ShelfWise Logo"
          className="w-32 h-32 mx-auto mb-6"
        />
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-gray-600">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 mt-6 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Home className="w-4 h-4 mr-2" />
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
