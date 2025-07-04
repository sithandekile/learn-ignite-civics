
import { Button } from "@/components/ui/button";
import { Play, ChevronRight, Users, BookOpen, Trophy } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useEffect } from 'react';

interface HeroProps {
  setActiveTab: (tab: string) => void;
  user: User | null;
}

const Hero = ({ setActiveTab, user }: HeroProps) => {
  const { totalScore, courseProgresses, fetchCourseProgress } = useUserProgress(user);

  // Sample course data to fetch progress for
  const sampleCourses = [
    { id: 1, title: "Constitutional Law", totalLessons: 12 },
    { id: 2, title: "Voting Rights", totalLessons: 8 },
    { id: 3, title: "Local Government", totalLessons: 6 }
  ];

  useEffect(() => {
    if (user) {
      // Fetch progress for sample courses to display in hero
      sampleCourses.forEach(course => {
        fetchCourseProgress(course.id);
      });
    }
  }, [user]);

  return (
    <section className="relative py-20 overflow-hidden bg-white/95">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Master <span className="text-orange-700">Civic Education</span> with AI-Powered Learning
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Transform How You Learn Civic Education with AI-Driven Personalization
                Explore an adaptive, gamified curriculum that equips you with the tools 
                to think critically, engage meaningfully, and become an active, informed citizen.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-sky-800 hover:bg-sky-900 text-white px-8 py-3 text-lg"
                onClick={() => setActiveTab('courses')}
              >
                Start Learning
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-orange-700 text-orange-700 hover:bg-orange-50 px-8 py-3 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="h-5 w-5 text-sky-950" />
                <span>10,000+ Learners</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <BookOpen className="h-5 w-5 text-sky-950" />
                <span>50+ Courses</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Trophy className="h-5 w-5 text-sky-950" />
                <span>Gamified Learning</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-sky-950 rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Your Learning Progress</h3>
                  <div className="text-2xl">📊</div>
                </div>
                
                {user ? (
                  <>
                    {sampleCourses.map((course) => {
                      const progress = courseProgresses[course.id];
                      const progressPercentage = progress?.progressPercentage || 0;
                      
                      return (
                        <div key={course.id} className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">{course.title}</span>
                            <span className="text-orange-700 font-semibold">{progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-primary h-3 rounded-full transition-all duration-500" 
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}

                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">Total Points</span>
                        <span className="text-2xl font-bold text-orange-700">{totalScore.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Constitutional Law</span>
                        <span className="text-orange-700 font-semibold">0%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gradient-primary h-3 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Voting Rights</span>
                        <span className="text-orange-700 font-semibold">0%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gradient-primary h-3 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Local Government</span>
                        <span className="text-orange-700 font-semibold">0%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gradient-primary h-3 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">Total Points</span>
                        <span className="text-2xl font-bold text-orange-700">0</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-sky-950 rounded-full flex items-center justify-center text-white text-2xl animate-bounce">
              🏆
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-sky-950 rounded-full flex items-center justify-center text-white text-xl">
              📚
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
