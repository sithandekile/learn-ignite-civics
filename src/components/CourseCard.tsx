
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Trophy, Play } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  lessons: number;
  difficulty: string;
  image: string;
  points: number;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
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

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
      <div className="relative">
        <div className="h-32 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
          <span className="text-4xl">{course.image}</span>
        </div>
        <Badge 
          variant="outline" 
          className={`absolute top-3 right-3 ${getDifficultyColor(course.difficulty)}`}
        >
          {course.difficulty}
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors duration-300">
          {course.title}
        </CardTitle>
        <CardDescription className="text-gray-600 leading-relaxed">
          {course.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold text-orange-700">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.lessons} lessons</span>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="h-4 w-4 text-orange-700" />
            <span className="text-orange-700 font-semibold">{course.points} pts</span>
          </div>
        </div>
        
        <Button 
          className="w-full bg-orange-700 hover:bg-orange-800 text-white group-hover:shadow-lg transition-all duration-300"
          size="lg"
        >
          <Play className="mr-2 h-4 w-4" />
          {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
