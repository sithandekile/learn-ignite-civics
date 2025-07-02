
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, BookOpen, Target, Clock, TrendingUp, Award } from 'lucide-react';

interface Achievement {
  name: string;
  description: string;
  earned: boolean;
  icon: string;
}

interface DashboardProps {
  achievements: Achievement[];
}

const Dashboard = ({ achievements }: DashboardProps) => {
  const stats = [
    { label: "Courses Completed", value: "3", icon: BookOpen, color: "text-orange-700" },
    { label: "Total Points", value: "1,250", icon: Trophy, color: "text-orange-700" },
    { label: "Learning Streak", value: "12 days", icon: Target, color: "text-sky-400" },
    { label: "Study Time", value: "24h", icon: Clock, color: "text-sky-400" }
  ];

  const recentActivity = [
    { course: "Constitutional Foundations", action: "Completed Lesson 8", time: "2 hours ago" },
    { course: "Voting Rights & Democracy", action: "Started new module", time: "1 day ago" },
    { course: "Civil Rights Movement", action: "Earned 50 points", time: "2 days ago" },
    { course: "Local Government", action: "Completed final quiz", time: "3 days ago" }
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Thande!</h1>
          <p className="text-xl text-orange-100">Ready to continue your civic education journey?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <Icon className={`h-8 w-8 mx-auto ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-orange-100">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Learning Progress */}
          <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <TrendingUp className="h-5 w-5 text-orange-300" />
                <span>Learning Progress</span>
              </CardTitle>
              <CardDescription className="text-orange-100">Track your progress across all courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Constitutional Foundations</span>
                  <span className="text-orange-300 font-semibold">85%</span>
                </div>
                <Progress value={85} className="h-3" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Voting Rights & Democracy</span>
                  <span className="text-orange-300 font-semibold">62%</span>
                </div>
                <Progress value={62} className="h-3" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Civil Rights Movement</span>
                  <span className="text-orange-300 font-semibold">40%</span>
                </div>
                <Progress value={40} className="h-3" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Local Government</span>
                  <span className="text-orange-300 font-semibold">95%</span>
                </div>
                <Progress value={95} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Award className="h-5 w-5 text-orange-300" />
                <span>Recent Achievements</span>
              </CardTitle>
              <CardDescription className="text-orange-100">Your latest accomplishments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.filter(a => a.earned).map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg border border-white/20">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{achievement.name}</div>
                    <div className="text-sm text-orange-100">{achievement.description}</div>
                  </div>
                  <Badge className="bg-orange-600 hover:bg-orange-700 text-white">New!</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 hover:shadow-lg transition-shadow duration-300 bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Clock className="h-5 w-5 text-orange-300" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription className="text-orange-100">Your learning activity over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                  <div>
                    <div className="font-semibold text-white">{activity.course}</div>
                    <div className="text-sm text-orange-100">{activity.action}</div>
                  </div>
                  <div className="text-sm text-orange-200">{activity.time}</div>
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
