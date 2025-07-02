
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const PricingSection = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$9.99',
      period: '/month',
      description: 'Perfect for individual learners',
      features: [
        'Access to basic courses',
        'Progress tracking',
        'Basic gamification',
        'Community forum access',
        'Mobile app access'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19.99',
      period: '/month',
      description: 'Best for serious civic engagement',
      features: [
        'All Basic features',
        'Advanced AI tutoring',
        'Personalized learning paths',
        'Premium course content',
        'Priority support',
        'Certificates of completion',
        'Exclusive webinars'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$49.99',
      period: '/month',
      description: 'For schools and organizations',
      features: [
        'All Premium features',
        'Custom branding',
        'Analytics dashboard',
        'Bulk user management',
        'API access',
        'Dedicated support',
        'Custom integrations'
      ],
      popular: false
    }
  ];

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to subscribe",
          variant: "destructive"
        });
        return;
      }

      // Here you would integrate with Stripe
      // For now, we'll show a placeholder
      toast({
        title: "Coming Soon!",
        description: "Stripe integration will be available soon. Stay tuned!",
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-sky-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Learning Path</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock your civic potential with our comprehensive learning platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative bg-sky-950 border-sky-800 text-white ${
                plan.popular ? 'ring-2 ring-orange-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-700 hover:bg-orange-800">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-orange-400">{plan.price}</span>
                  <span className="text-sky-300">{plan.period}</span>
                </div>
                <CardDescription className="text-sky-200 mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
                      <span className="text-sky-100">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-orange-700 hover:bg-orange-800' 
                      : 'bg-sky-800 hover:bg-sky-700'
                  }`}
                >
                  {loading === plan.id ? 'Processing...' : 'Get Started'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
