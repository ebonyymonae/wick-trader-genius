
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
      <div className="glass-panel p-12 max-w-md w-full text-center space-y-6 animate-fade-in">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400">The page you're looking for doesn't exist</p>
        <div className="h-1 w-20 bg-primary/30 mx-auto rounded-full"></div>
        <p className="text-neutral-500">We couldn't find the page you were looking for. Please check the URL or return to the home page.</p>
        <Button asChild className="mt-4 px-8 animate-pulse-subtle">
          <a href="/">Return Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
