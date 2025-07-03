
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Trophy, Play, Lock } from 'lucide-react';

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
}

const CourseCard = ({ course, userSubscriptionTier, onAccessRestricted }: CourseCardProps) => {
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

  const handleContinueClick = () => {
    if (!isAccessible) {
      onAccessRestricted?.();
      return;
    }
    // Navigate to lessons - this would typically use react-router
    console.log(`Navigating to lessons for course ${course.id}`);
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
            <span className="font-semibold text-orange-400">{isAccessible ? course.progress : 0}%</span>
          </div>
          <Progress value={isAccessible ? course.progress : 0} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between text-sm text-sky-300">
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.lessons} lessons</span>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="h-4 w-4 text-orange-400" />
            <span className="text-orange-400 font-semibold">{course.points} pts</span>
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
              {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
