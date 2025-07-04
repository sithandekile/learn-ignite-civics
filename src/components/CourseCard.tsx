
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Trophy, Play, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useEffect } from 'react';
import type { User } from '@supabase/supabase-js';

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  lessons: number;
  difficulty: string;
  image: string;
  points: number;
  requiresPremium?: boolean;
}

interface CourseCardProps {
  course: Course;
  userSubscriptionTier?: string | null;
  onAccessRestricted?: () => void;
  user?: User | null;
}

const CourseCard = ({ course, userSubscriptionTier, onAccessRestricted, user }: CourseCardProps) => {
  const navigate = useNavigate();
  const { courseProgresses, fetchCourseProgress, initializeCourseProgress } = useUserProgress(user);

  useEffect(() => {
    if (user) {
      fetchCourseProgress(course.id);
    }
  }, [user, course.id]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const hasAccess = () => {
    if (course.difficulty === 'Beginner') return true;
    if (!userSubscriptionTier) return false;
    if (course.difficulty === 'Intermediate' && (userSubscriptionTier === 'Premium' || userSubscriptionTier === 'Enterprise')) return true;
    if (course.difficulty === 'Advanced' && userSubscriptionTier === 'Enterprise') return true;
    return false;
  };

  const isAccessible = hasAccess();
  const courseProgress = courseProgresses[course.id];
  const actualProgress = courseProgress?.progressPercentage || 0;
  const actualScore = courseProgress?.courseScore || 0;

  const handleContinueClick = async () => {
    console.log('Start Course button clicked for course:', course.id);
    
    if (!isAccessible) {
      console.log('Access restricted for course:', course.id);
      onAccessRestricted?.();
      return;
    }

    if (!user) {
      console.log('User not authenticated');
      return;
    }

    try {
      // Initialize course progress if it doesn't exist
      if (!courseProgress) {
        console.log('Initializing course progress for course:', course.id);
        await initializeCourseProgress(course.id, course.lessons);
      }

      // Navigate to lessons page
      console.log('Navigating to lessons page for course:', course.id);
      navigate(`/lessons/${course.id}`);
    } catch (error) {
      console.error('Error handling course start:', error);
    }
  };

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-sky-950 border-sky-800 text-white overflow-hidden ${!isAccessible ? 'opacity-60' : ''}`}>
      <div className="relative">
        <div className="h-32 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
          <span className="text-4xl">{course.image}</span>
          {!isAccessible && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Lock className="h-8 w-8 text-white" />
            </div>
          )}
        </div>
        <Badge 
          variant="outline" 
          className={`absolute top-3 right-3 ${getDifficultyColor(course.difficulty)}`}
        >
          {course.difficulty}
        </Badge>
        {!isAccessible && (
          <Badge className="absolute top-3 left-3 bg-red-600 text-white">
            Premium Required
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
          {course.title}
        </CardTitle>
        <CardDescription className="text-sky-200 leading-relaxed">
          {course.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-sky-300">Progress</span>
            <span className="font-semibold text-orange-400">{isAccessible ? actualProgress : 0}%</span>
          </div>
          <Progress value={isAccessible ? actualProgress : 0} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between text-sm text-sky-300">
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.lessons} lessons</span>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="h-4 w-4 text-orange-400" />
            <span className="text-orange-400 font-semibold">
              {isAccessible && user ? actualScore : course.points} pts
            </span>
          </div>
        </div>
        
        <Button 
          onClick={handleContinueClick}
          className={`w-full ${isAccessible ? 'bg-orange-700 hover:bg-orange-800' : 'bg-gray-600 hover:bg-gray-700'} text-white group-hover:shadow-lg transition-all duration-300`}
          size="lg"
        >
          {!isAccessible ? (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Upgrade to Access
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              {actualProgress > 0 ? 'Continue Learning' : 'Start Course'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
