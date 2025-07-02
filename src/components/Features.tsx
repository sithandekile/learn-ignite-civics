
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Target, Users, Trophy, BookOpen, MessageCircle } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Personalization",
      description: "Adaptive learning algorithms that adjust to your pace and learning style for optimal knowledge retention.",
      color: "text-orange-700"
    },
    {
      icon: Trophy,
      title: "Gamified Experience",
      description: "Earn points, unlock achievements, and compete on leaderboards while mastering civic concepts.",
      color: "text-orange-700"
    },
    {
      icon: Target,
      title: "Interactive Simulations",
      description: "Practice real-world civic scenarios through immersive simulations and case studies.",
      color: "text-sky-700"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Connect with peers, join study groups, and participate in civic discussions and debates.",
      color: "text-sky-700"
    },
    {
      icon: BookOpen,
      title: "Comprehensive Curriculum",
      description: "From constitutional law to local government, cover all essential civic education topics.",
      color: "text-orange-700"
    },
    {
      icon: MessageCircle,
      title: "24/7 AI Tutor",
      description: "Get instant help and explanations from our intelligent tutoring system anytime you need it.",
      color: "text-sky-700"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose CivicAI?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of civic education with cutting-edge technology and proven pedagogical methods
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${
                    feature.color === 'text-orange-700' 
                      ? 'from-orange-100 to-orange-200' 
                      : 'from-sky-100 to-sky-200'
                  } mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
