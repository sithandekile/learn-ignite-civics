
import { Button } from "@/components/ui/button";
import { BookOpen, Mail, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sky-950 text-sky-100 border-t border-sky-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">CivicAI</h3>
                <p className="text-sm text-sky-300">Learn. Engage. Lead.</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sky-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-sky-300 hover:text-white transition-colors">Courses</a></li>
              <li><a href="#" className="text-sky-300 hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#" className="text-sky-300 hover:text-white transition-colors">Achievements</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sky-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sky-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sky-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sky-300 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Connect</h4>
            <div className="flex space-x-3">
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-sky-300 hover:text-white hover:bg-sky-800"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-sky-300 hover:text-white hover:bg-sky-800"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-sky-300 hover:text-white hover:bg-sky-800"
              >
                <Github className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-sky-300 hover:text-white hover:bg-sky-800"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-sky-800 mt-8 pt-8 text-center">
          <p className="text-sky-300 text-sm flex items-center justify-center space-x-1">
            <span>© {currentYear} CivicAI. Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>for civic engagement.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
