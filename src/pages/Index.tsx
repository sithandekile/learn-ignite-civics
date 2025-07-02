import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Trophy, Users, Brain, Star, Award, Target, MessageCircle, Play, ChevronRight, LogOut } from 'lucide-react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Dashboard from '@/components/Dashboard';
import CourseCard from '@/components/CourseCard';
import ChatBot from '@/components/ChatBot';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import type { User } from '@supabase/supabase-js';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showChat, setShowChat] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const courses = [
    {
      id: 1,
      title: "Constitutional Foundations",
      description: "Explore the fundamental principles of constitutional democracy",
      progress: 75,
      lessons: 12,
      difficulty: "Beginner",
      image: "🏛️",
      points: 150
    },
    {
      id: 2,
      title: "Voting Rights & Democracy",
      description: "Understanding electoral systems and democratic participation",
      progress: 45,
      lessons: 8,
      difficulty: "Intermediate",
      image: "🗳️",
      points: 200
    },
    {
      id: 3,
      title: "Civil Rights Movement",
      description: "The struggle for equality and social justice in America",
      progress: 20,
      lessons: 15,
      difficulty: "Advanced",
      image: "✊",
      points: 300
    },
    {
      id: 4,
      title: "Local Government",
      description: "How city and county governments impact daily life",
      progress: 90,
      lessons: 6,
      difficulty: "Beginner",
      image: "🏛️",
      points: 120
    }
  ];

  const achievements = [
    { name: "First Steps", description: "Complete your first lesson", earned: true, icon: "🎯" },
    { name: "Constitution Expert", description: "Master constitutional principles", earned: true, icon: "📜" },
    { name: "Democracy Champion", description: "Complete voting rights course", earned: false, icon: "🏆" },
    { name: "Civic Leader", description: "Reach 1000 points", earned: false, icon: "⭐" }
  ];

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleAuthAction = () => {
    if (user) {
      handleSignOut();
    } else {
      navigate('/auth');
    }
  };

  // Get background class based on active tab
  const getBackgroundClass = () => {
    return "min-h-screen bg-gradient-to-br from-orange-700 to-orange-800";
  };

  return (
    <div className={getBackgroundClass()}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} user={user} onAuthAction={handleAuthAction} />
      
      {activeTab === 'home' && (
        <>
          <Hero setActiveTab={setActiveTab} user={user} />
          <Features />
          <PricingSection />
          <Footer />
        </>
      )}

      {activeTab === 'dashboard' && (
        <>
          <Dashboard achievements={achievements} />
          <Footer />
        </>
      )}

      {activeTab === 'courses' && (
        <>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">Civic Education Courses</h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Explore our comprehensive curriculum designed to build engaged, informed citizens
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
          <Footer />
        </>
      )}

      {activeTab === 'achievements' && (
        <>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">Your Achievements</h1>
              <p className="text-xl text-orange-100">Track your progress and celebrate your learning milestones</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className={`transition-all duration-300 hover:shadow-lg ${achievement.earned ? 'bg-sky-950 border-sky-800' : 'bg-gray-100 opacity-60'}`}>
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <CardTitle className={achievement.earned ? 'text-white' : 'text-gray-500'}>
                      {achievement.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className={achievement.earned ? 'text-sky-200' : 'text-gray-600'}>{achievement.description}</p>
                    {achievement.earned && (
                      <Badge className="mt-3 bg-orange-700 hover:bg-orange-800">Earned!</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Footer />
        </>
      )}

      {/* AI Chat Assistant */}
      <ChatBot isOpen={showChat} onToggle={() => setShowChat(!showChat)} />
      
      {/* Floating Chat Button */}
      <Button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-orange-700 hover:bg-orange-800 shadow-lg z-40"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Index;
