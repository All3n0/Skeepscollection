'use client';
import { CheckCircle, Users, Award, Clock } from "lucide-react";
import { useEffect, useState, useRef } from "react";

type AboutProps = {
  id?: string;
};

const About = ({ id }: AboutProps = {}) => {
  const [counters, setCounters] = useState({
    happyCustomers: 0,
    itemsPrinted: 0,
    averageTurnaround: 0,
    satisfactionRate: 0
  });

  const [countersStarted, setCountersStarted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted) {
            setCountersStarted(true);
            startCounters();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [countersStarted]);

  const startCounters = () => {
    // Animate Happy Customers counter (1000+)
    animateCounter('happyCustomers', 1000, 2000, 50);
    
    // Animate Items Printed counter (5000+)
    setTimeout(() => {
      animateCounter('itemsPrinted', 5000, 1800, 100);
    }, 300);
    
    // Animate Average Turnaround counter (24h)
    setTimeout(() => {
      animateCounter('averageTurnaround', 24, 1200, 2);
    }, 600);
    
    // Animate Satisfaction Rate counter (100%)
    setTimeout(() => {
      animateCounter('satisfactionRate', 100, 1500, 5);
    }, 900);
  };

  const animateCounter = (key: keyof typeof counters, target: number, duration: number, steps: number) => {
    let startTime: number;
    let animationFrameId: number;

    const updateCounter = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentValue = Math.floor(easeOutQuart * target);
      
      setCounters(prev => ({
        ...prev,
        [key]: currentValue
      }));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        // Ensure final value is exactly the target
        setCounters(prev => ({
          ...prev,
          [key]: target
        }));
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  };

  const features = [
    {
      icon: CheckCircle,
      title: "Quality Guaranteed",
      description: "Premium materials and printing techniques ensure long-lasting, vibrant designs."
    },
    {
      icon: Clock,
      title: "Fast Turnaround",
      description: "Most orders completed within 24-48 hours without compromising quality."
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Experienced designers and production specialists dedicated to your vision."
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized for excellence in custom apparel and customer satisfaction."
    }
  ];

  return (
    <section id={id} className="py-20 bg-white text-black overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-4xl text-black md:text-5xl font-bold mb-6 animate-fade-in-up">
              Crafting Your
              <span className="block text-red-600">Vision Into Reality</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed animate-fade-in-up delay-100">
              At Skeeps Collection, we believe that great apparel tells a story. Founded with a passion 
              for quality and creativity, we've been helping individuals and businesses bring 
              their ideas to life through custom t-shirts, hoodies, and bags.
            </p>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed animate-fade-in-up delay-200">
              From small personal projects to large corporate orders, we treat every customer 
              with the same dedication to excellence. Our state-of-the-art printing technology 
              combined with premium materials ensures your custom apparel looks great and lasts long.
            </p>

            {/* Stats with animated counters */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="animate-fade-in-up delay-300">
                <div className="text-3xl font-bold text-red-600 mb-1 flex items-center">
                  <span className="font-mono tabular-nums min-w-[3.5ch] text-left">
                    {counters.happyCustomers}+
                  </span>
                  {counters.happyCustomers >= 1000 && (
                    <span className="ml-2 text-green-500 text-xl animate-checkmark">✓</span>
                  )}
                </div>
                <div className="text-muted-foreground font-semibold">Happy Customers</div>
                <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-300"
                    style={{ width: `${(counters.happyCustomers / 1000) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="animate-fade-in-up delay-400">
                <div className="text-3xl font-bold text-red-600 mb-1 flex items-center">
                  <span className="font-mono tabular-nums min-w-[3.5ch] text-left">
                    {counters.itemsPrinted}+
                  </span>
                  {counters.itemsPrinted >= 5000 && (
                    <span className="ml-2 text-green-500 text-xl animate-checkmark">✓</span>
                  )}
                </div>
                <div className="text-muted-foreground font-semibold">Items Printed</div>
                <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-300"
                    style={{ width: `${(counters.itemsPrinted / 5000) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="animate-fade-in-up delay-500">
                <div className="text-3xl font-bold text-red-600 mb-1 flex items-center">
                  <span className="font-mono tabular-nums min-w-[3.5ch] text-left">
                    {counters.averageTurnaround}h
                  </span>
                  {counters.averageTurnaround >= 24 && (
                    <span className="ml-2 text-green-500 text-xl animate-checkmark">✓</span>
                  )}
                </div>
                <div className="text-muted-foreground font-semibold">Average Turnaround</div>
                <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-300"
                    style={{ width: `${(counters.averageTurnaround / 24) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="animate-fade-in-up delay-600">
                <div className="text-3xl font-bold text-red-600 mb-1 flex items-center">
                  <span className="font-mono tabular-nums min-w-[3.5ch] text-left">
                    {counters.satisfactionRate}%
                  </span>
                  {counters.satisfactionRate >= 100 && (
                    <span className="ml-2 text-green-500 text-xl animate-checkmark">✓</span>
                  )}
                </div>
                <div className="text-muted-foreground font-semibold">Satisfaction Rate</div>
                <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-300"
                    style={{ width: `${counters.satisfactionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-card p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-[0_4px_20px_rgba(220,38,38,0.3)] transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${700 + index * 100}ms` }}
              >
                <feature.icon className="h-12 w-12 text-red-600 mb-4" />
                <h3 className="text-lg font-bold text-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-20 text-center animate-fade-in-up delay-1000">
          <div className="bg-red-50 rounded-2xl p-12 border border-primary/10 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-3xl font-bold text-black mb-6">Our Mission</h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              "To empower creativity and self-expression through high-quality custom apparel. 
              We believe everyone deserves to wear their story, and we're here to make it happen 
              with exceptional quality, speed, and service."
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes checkmark {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          70% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-checkmark {
          animation: checkmark 0.4s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-400 {
          animation-delay: 400ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-600 {
          animation-delay: 600ms;
        }

        .delay-700 {
          animation-delay: 700ms;
        }

        .delay-800 {
          animation-delay: 800ms;
        }

        .delay-900 {
          animation-delay: 900ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </section>
  );
};

export default About;