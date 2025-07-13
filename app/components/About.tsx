import { CheckCircle, Users, Award, Clock } from "lucide-react";

const About = () => {
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
    <section id="about" className="py-20 bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-4xl text-black md:text-5xl font-bold  mb-6">
              Crafting Your
              <span className="block text-red-600">Vision Into Reality</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              At Skeeps Collection, we believe that great apparel tells a story. Founded with a passion 
              for quality and creativity, we've been helping individuals and businesses bring 
              their ideas to life through custom t-shirts, hoodies, and bags.
            </p>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              From small personal projects to large corporate orders, we treat every customer 
              with the same dedication to excellence. Our state-of-the-art printing technology 
              combined with premium materials ensures your custom apparel looks great and lasts long.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <div className="text-3xl font-bold text-red-600 mb-1">1000+</div>
                <div className="text-muted-foreground font-semibold">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600 mb-1">5000+</div>
                <div className="text-muted-foreground font-semibold">Items Printed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600 mb-1">24h</div>
                <div className="text-muted-foreground font-semibold">Average Turnaround</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600 mb-1">100%</div>
                <div className="text-muted-foreground font-semibold">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
className="bg-gradient-card p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-[0_4px_20px_rgba(220,38,38,0.3)] transition-all duration-300"
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
        <div className="mt-20 text-center">
          <div className="bg-red-50 rounded-2xl p-12 border border-primary/10">
            <h3 className="text-3xl font-bold text-black mb-6">Our Mission</h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              "To empower creativity and self-expression through high-quality custom apparel. 
              We believe everyone deserves to wear their story, and we're here to make it happen 
              with exceptional quality, speed, and service."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;