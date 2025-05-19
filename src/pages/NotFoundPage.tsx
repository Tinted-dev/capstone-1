import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/common/Button';

function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">Page Not Found</h2>
        
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-10">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <Button size="lg">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;