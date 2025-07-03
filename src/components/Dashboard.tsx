
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, BookOpen, Target, Clock, TrendingUp, Award } from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useEffect } from 'react';
import type { User } from '@supabase/supabase-js';

interface Achievement {
  name: string;
  description: string;
  earned: boolean;
  icon: string;
}

interface DashboardProps {
  achievements: Achievement[];
  user?: User | null;
}

const Dashboard = ({ achievements, user }: DashboardProps) => {
  const { totalScore, courseProgresses, fetchCourseProgress } = useUserProgress(user);

  // Sample courses to display progress for
  const sampleCourses = [
    { id: 1, title: "Constitutional Foundations", totalLessons: 12 },
    { id: 2, title: "Voting Rights & Democracy", totalLessons: 8 },
    { id: 3, title: "Civil Rights Movement", totalLessons: 15 },
    { id: 4, title: "Local Government", totalLessons: 6 }
  ];

  useEffect(() => {
    if (user) {
      sampleCourses.forEach(course => {
        fetchCourseProgress(course.id);
      });
    }
  }, [user]);

  // Calculate total completed courses
  const completedCourses = Object.values(courseProgresses).filter(progress => progress.courseCompleted).length;
  
  // Calculate average progress across all courses
  const totalProgressSum = Object.values(courseProgresses).reduce((sum, progress) => sum + progress.progressPercentage, 0);
  const averageProgress = Object.keys(courseProgresses).length > 0 ? Math.round(totalProgressSum / Object.keys(courseProgresses).length) : 0;

  const stats = [
    { label: "Courses Completed", value: completedCourses.toString(), icon: BookOpen, color: "text-orange-700" },
    { label: "Total Points", value: totalScore.toLocaleString(), icon: Trophy, color: "text-orange-700" },
    { label: "Average Progress", value: `${averageProgress}%`, icon: Target, color: "text-sky-700" },
    { label: "Study Time", value: "24h", icon: Clock, color: "text-sky-700" }
  ];

  const recentActivity = [
    { course: "Constitutional Foundations", action: "Completed Lesson 8", time: "2 hours ago" },
    { course: "Voting Rights & Democracy", action: "Started new module", time: "1 day ago" },
    { course: "Civil Rights Movement", action: "Earned 50 points", time: "2 days ago" },
    { course: "Local Government", action: "Completed final quiz", time: "3 days ago" }
  ];

  return (
    <div className="min-h-screen bg-wheat">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-xl text-gray-700">Ready to continue your civic education journey?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 bg-sky-950 ">
                <CardHeader className="pb-2">
                  <Icon className={`h-8 w-8 mx-auto ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-orange-500">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Learning Progress */}
          <Card className="hover:shadow-lg transition-shadow duration-300 bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <TrendingUp className="h-5 w-5 text-orange-700" />
                <span>Learning Progress</span>
              </CardTitle>
              <CardDescription className="text-gray-600">Track your progress across all courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {sampleCourses.map((course) => {
                const progress = courseProgresses[course.id];
                const progressPercentage = progress?.progressPercentage || 0;
                
                return (
                  <div key={course.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{course.title}</span>
                      <span className="text-orange-700 font-semibold">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="hover:shadow-lg transition-shadow duration-300 bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <Award className="h-5 w-5 text-orange-700" />
                <span>Recent Achievements</span>
              </CardTitle>
              <CardDescription className="text-gray-600">Your latest accomplishments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.filter(a => a.earned).map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{achievement.name}</div>
                    <div className="text-sm text-gray-600">{achievement.description}</div>
                  </div>
                  <Badge className="bg-orange-700 hover:bg-orange-800 text-white">New!</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 hover:shadow-lg transition-shadow duration-300 bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Clock className="h-5 w-5 text-orange-700" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Your learning activity over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div>
                    <div className="font-semibold text-gray-900">{activity.course}</div>
                    <div className="text-sm text-gray-600">{activity.action}</div>
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
