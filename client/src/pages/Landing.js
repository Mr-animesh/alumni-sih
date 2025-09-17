import React from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import alumni from "../assets/alumni.jpg";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  TrendingUp,
  Shield,
  Globe,
  Heart,
  GraduationCap,
  UserCheck,
  Building
} from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: Users,
      title: "Alumni Directory",
      description: "Centralized database to manage and connect with alumni across different graduation years."
    },
    {
      icon: Calendar,
      title: "Event Management", 
      description: "Organize reunions, networking events, and professional meetups with ease."
    },
    {
      icon: TrendingUp,
      title: "Career Tracking",
      description: "Monitor alumni career progression and create mentorship opportunities."
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Privacy-focused system ensuring alumni data security and controlled access."
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Connect alumni worldwide and build a strong professional community."
    },
    {
      icon: Heart,
      title: "Donation Management",
      description: "Streamline fundraising efforts and track alumni contributions effectively."
    }
  ];

  const beneficiaries = [
    {
      icon: GraduationCap,
      title: "Alumni",
      description: "Stay connected with alma mater and fellow graduates"
    },
    {
      icon: UserCheck,
      title: "Current Students",
      description: "Access mentorship and internship opportunities"
    },
    {
      icon: Building,
      title: "Institutions",
      description: "Strengthen relationships and enhance credibility"
    }
  ];

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-hero opacity-10 bg-red-200" />
        <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ">
            <div className="space-y-8 ">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Connect Your
                  <span className="text-primary text-blue-600"> Alumni</span> Network
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  A comprehensive platform to manage alumni relationships, foster connections, 
                  and build lasting institutional bonds for educational excellence.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:from-purple-500 hover:to-blue-500 hover:scale-105 transition-transform duration-300 ease-in-out">
                    Get Started
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:from-orange-500 hover:to-red-500 hover:scale-105 transition-transform duration-300 ease-in-out">
                  Learn More
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-700 rounded-full" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-700 rounded-full" />
                  <span>Easy to Use</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-700 rounded-full" />
                  <span>Scalable</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-20 blur-xl" />
              <img 
                src={alumni} 
                alt="Alumni graduation ceremony"
                className="relative rounded-2xl shadow-large w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Powerful Features for Alumni Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to build and maintain strong alumni relationships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-blue-500" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Beneficiaries Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Who Benefits?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform creates value for all stakeholders in the educational ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {beneficiaries.map((beneficiary, index) => {
              const Icon = beneficiary.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{beneficiary.title}</h3>
                  <p className="text-muted-foreground">{beneficiary.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">
              Ready to Strengthen Your Alumni Network?
            </h2>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Join educational institutions worldwide in building stronger alumni relationships
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg shadow-lg hover:from-teal-500 hover:to-green-500 hover:scale-105 transition-transform duration-300 ease-in-out">
                  Start Your Journey
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:from-pink-500 hover:to-indigo-500 hover:scale-105 transition-transform duration-300 ease-in-out">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;