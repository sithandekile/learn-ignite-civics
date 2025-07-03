
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, CheckCircle, ArrowLeft, Clock, Trophy } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { User } from '@supabase/supabase-js';

const Lessons = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [currentLesson, setCurrentLesson] = useState(0);

  // Sample lessons data - in a real app, this would come from your database
  const courseLessons = {
    '1': [
      { id: 1, title: "Introduction to the Constitution", duration: "15 min", completed: false },
      { id: 2, title: "The Bill of Rights", duration: "20 min", completed: false },
      { id: 3, title: "Separation of Powers", duration: "18 min", completed: false },
      { id: 4, title: "Federalism Explained", duration: "22 min", completed: false },
      { id: 5, title: "Constitutional Amendments", duration: "25 min", completed: false }
    ],
    '2': [
      { id: 1, title: "History of Voting Rights", duration: "18 min", completed: false },
      { id: 2, title: "Electoral Systems", duration: "20 min", completed: false },
      { id: 3, title: "Voting Laws and Regulations", duration: "22 min", completed: false },
      { id: 4, title: "Civic Participation", duration: "15 min", completed: false }
    ],
    '3': [
      { id: 1, title: "Origins of Civil Rights Movement", duration: "25 min", completed: false },
      { id: 2, title: "Key Figures and Leaders", duration: "30 min", completed: false },
      { id: 3, title: "Major Events and Milestones", duration: "28 min", completed: false },
      { id: 4, title: "Legal Victories", duration: "22 min", completed: false },
      { id: 5, title: "Modern Civil Rights", duration: "20 min", completed: false }
    ],
    '4': [
      { id: 1, title: "City Government Structure", duration: "12 min", completed: false },
      { id: 2, title: "County Administration", duration: "15 min", completed: false },
      { id: 3, title: "Local Services", duration: "18 min", completed: false },
      { id: 4, title: "Community Engagement", duration: "20 min", completed: false }
    ]
  };

  const courseInfo = {
    '1': { title: "Constitutional Foundations", points: 150 },
    '2': { title: "Voting Rights & Democracy", points: 200 },
    '3': { title: "Civil Rights Movement", points: 300 },
    '4': { title: "Local Government", points: 120 }
  };

  const lessons = courseLessons[courseId as keyof typeof courseLessons] || [];
  const course = courseInfo[courseId as keyof typeof courseInfo];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

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

  const handleLessonClick = (lessonIndex: number) => {
    setCurrentLesson(lessonIndex);
    toast({
      title: "Lesson Started",
      description: `Starting "${lessons[lessonIndex].title}"`,
    });
  };

  const handleBackToCourses = () => {
    navigate('/', { state: { activeTab: 'courses' } });
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-wheat">
        <Header activeTab="courses" setActiveTab={() => {}} user={user} onAuthAction={handleAuthAction} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <Button onClick={handleBackToCourses}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wheat">
      <Header activeTab="courses" setActiveTab={() => {}} user={user} onAuthAction={handleAuthAction} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={handleBackToCourses}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-lg text-gray-600">Complete all lessons to earn {course.points} points</p>
            </div>
            <Badge className="bg-orange-700 text-white px-4 py-2 text-lg">
              <Trophy className="mr-2 h-4 w-4" />
              {course.points} pts
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lessons List */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-orange-700" />
                  <span>Course Lessons</span>
                </CardTitle>
                <CardDescription>Click on any lesson to start learning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      currentLesson === index 
                        ? 'bg-orange-50 border-orange-300' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => handleLessonClick(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-sm text-gray-500">{lesson.duration}</span>
                        </div>
                      </div>
                      {lesson.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Play className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {lessons[currentLesson]?.title || "Select a Lesson"}
                </CardTitle>
                {lessons[currentLesson] && (
                  <CardDescription className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Duration: {lessons[currentLesson].duration}</span>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {lessons[currentLesson] ? (
                  <div className="space-y-6">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Play className="h-16 w-16 mx-auto mb-4 text-orange-700" />
                        <p className="text-lg font-semibold">Video Content</p>
                        <p className="text-sm">Interactive lesson content would be displayed here</p>
                      </div>
                    </div>
                    
                    <div className="prose max-w-none">
                      <h3>Lesson Overview</h3>
                      <p className="text-gray-600">
                        This is where the detailed lesson content would appear. In a full implementation, 
                        this would include interactive elements, videos, quizzes, and comprehensive 
                        educational materials about {lessons[currentLesson].title.toLowerCase()}.
                      </p>
                      
                      <h4>Key Learning Objectives:</h4>
                      <ul className="text-gray-600">
                        <li>Understand the fundamental concepts</li>
                        <li>Apply knowledge through practical examples</li>
                        <li>Complete interactive exercises</li>
                        <li>Pass the lesson quiz</li>
                      </ul>
                    </div>

                    <div className="flex justify-between">
                      <Button 
                        variant="outline"
                        disabled={currentLesson === 0}
                        onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                      >
                        Previous Lesson
                      </Button>
                      
                      <Button 
                        className="bg-orange-700 hover:bg-orange-800"
                        disabled={currentLesson === lessons.length - 1}
                        onClick={() => setCurrentLesson(Math.min(lessons.length - 1, currentLesson + 1))}
                      >
                        Next Lesson
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">Select a lesson from the left to start learning</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Lessons;
