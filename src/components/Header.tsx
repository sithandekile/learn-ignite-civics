
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, BarChart3, Award, LogOut, LogIn } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onAuthAction: () => void;
}

const Header = ({ activeTab, setActiveTab, user, onAuthAction }: HeaderProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'achievements', label: 'Achievements', icon: Award }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CivicAI</h1>
              <p className="text-sm text-gray-600">Learn. Engage. Lead.</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 ${
                    activeTab === item.id 
                      ? 'bg-orange-700 hover:bg-orange-800 text-white' 
                      : 'text-gray-600 hover:text-orange-700 hover:bg-orange-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-3">
            {user && (
              <Badge variant="outline" className="hidden sm:flex items-center space-x-1 border-orange-200 text-orange-700">
                <Trophy className="h-3 w-3" />
                <span>1,250 pts</span>
              </Badge>
            )}
            
            <Button
              onClick={onAuthAction}
              variant="outline"
              className="flex items-center space-x-2 border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              {user ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              <span className="hidden sm:inline">
                {user ? 'Sign Out' : 'Sign In'}
              </span>
            </Button>
            
            {user && (
              <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex justify-around mt-4 border-t border-gray-200 pt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 h-auto p-2 ${
                  activeTab === item.id 
                    ? 'text-orange-700 bg-orange-50' 
                    : 'text-gray-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
