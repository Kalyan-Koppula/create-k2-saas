import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { DocumentationPage } from './pages/Documentation';
import { PostsPage } from './pages/Posts';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <header className="border-b">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-6">
                <Link
                  to="/"
                  className="font-medium text-foreground hover:text-foreground/80"
                >
                  Documentation
                </Link>
                <Link
                  to="/posts"
                  className="font-medium text-foreground hover:text-foreground/80"
                >
                  Posts
                </Link>
              </div>
              <a
                href="https://github.com/Kalyan-Koppula/k2-sass"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                View on GitHub ↗
              </a>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<DocumentationPage />} />
            <Route path="/posts" element={<PostsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
