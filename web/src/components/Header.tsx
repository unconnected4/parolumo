import { Link, useLocation } from 'react-router';
import { BookOpen, Search, Bookmark, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCards } from '../hooks/useCards';

export function Header() {
  const location = useLocation();
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();
  const { cards } = useCards();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
            <span>Paralumo</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Link>

          <Link
            to="/my-words"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/my-words'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>My Words</span>
            {cards.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs font-semibold bg-indigo-600 text-white">
                {cards.length}
              </span>
            )}
          </Link>
        </nav>

        {/* Auth / Session indicator (P19, P20) */}
        <div className="flex items-center gap-2 text-sm">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1.5 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full text-xs">
                <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate max-w-[140px] font-medium">{user?.email}</span>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                disabled={isLoggingOut}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
