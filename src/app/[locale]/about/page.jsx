import { UserCircle, Code, MessageSquareHeart, Globe, Award, Coffee, Users, Heart, BarChart } from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  // Team members
  const teamMembers = [
    {
      id: 1,
      name: 'Devfun Watcher',
      role: 'Founder & Lead Developer',
      bio: 'Passionate developer dedicated to building tools that empower learning communities worldwide.',
      image: '/images/team/devfun-watcher-avatar.webp' // Replace with actual image path
    },
    {
      id: 2,
      name: 'Artificial Intelligence',
      role: 'UX Designer',
      bio: 'Focused on creating intuitive, accessible interfaces that make learning enjoyable for everyone.',
      // image: '/images/team/maya.jpg' // Replace with actual image path
    },
    {
      id: 3,
      name: 'Artificial Intelligence',
      role: 'AI Specialist',
      bio: 'Working to ensure our AI tools are both powerful and responsible in educational contexts.',
      // image: '/images/team/jamal.jpg' // Replace with actual image path
    }
  ];
  
  // Values
  const values = [
    { 
      icon: <Heart className="h-8 w-8 text-purple-500" />, 
      title: 'Community First',
      description: 'We build for the community, with the community. Every feature is designed to foster learning and collaboration.'
    },
    { 
      icon: <Code className="h-8 w-8 text-blue-500" />, 
      title: 'Open Innovation',
      description: 'We believe in transparent development that welcomes contributions and feedback from our user community.'
    },
    { 
      icon: <Users className="h-8 w-8 text-green-500" />, 
      title: 'Inclusive Education',
      description: 'Our tools are designed to make education more accessible, engaging, and effective for diverse learners.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute inset-0 bg-pattern rotate-3 scale-110" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Quizzz</h1>
          <p className="max-w-2xl mx-auto text-lg opacity-90">
            A recently built project by Devfun, created with a passion for community development.
          </p>
        </div>
      </section>

      {/* Mission section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-8">
              At Devfun, we believe in the power of education to transform lives and communities.
              Quizzz was built to democratize access to quality educational tools, allowing
              teachers and students to create, share, and learn through intelligently designed quizzes.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                For Educators
              </span>
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                For Students
              </span>
              <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                For Communities
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Values section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Core Values
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">{value.title}</h3>
                <p className="text-gray-600 text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            The Devfun Team
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div 
                key={member.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-center"
              >
                <div className="mb-4 mx-auto w-24 h-24 relative">
                  {member.image && (
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="rounded-full object-cover w-full h-full"
                    />
                  )}

                  {/* Fallback icon if image isn't available */}
                  {!member.image && (
                    <UserCircle className="w-full h-full text-gray-300" />
                  )}
                  

                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-blue-600 mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Project Timeline
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    April 2025
                  </span>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">Project Inception</h3>
                  <p className="text-gray-600">
                    Devfun identified the need for better quiz tools in community education settings,
                    and the first prototype of Quizzz was born.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    April 2025
                  </span>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">Beta Launch</h3>
                  <p className="text-gray-600">
                    After intensive development and community testing, we released our beta version
                    to select educational partners for feedback and refinement.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    April 2025
                  </span>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">Public Release</h3>
                  <p className="text-gray-600">
                    Quizzz was officially launched to the public, featuring AI-powered quiz generation,
                    multilingual support, and a community-centered approach to educational tools.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    April 20, 2025
                  </span>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">Cloud Deployment</h3>
                  <p className="text-gray-600">
                    Successfully deployed Quizzz to Fly.io cloud platform, enabling global scaling,
                    improved reliability, and faster response times for users worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community section - New */}
      <section className="py-16 bg-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Building For Community
          </h2>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
            <p className="text-lg text-center mb-8">
              "We believe that the best educational tools are built with community input and serve community needs. 
              Our motto - <span className="font-bold text-indigo-600">Community Development</span> - guides everything we do."
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <BarChart className="h-10 w-10 mx-auto mb-3 text-indigo-500" />
                <h3 className="font-semibold mb-2">Data-Driven</h3>
                <p className="text-gray-600 text-sm">Our development is guided by real user needs and feedback.</p>
              </div>
              <div className="p-4">
                <Globe className="h-10 w-10 mx-auto mb-3 text-indigo-500" />
                <h3 className="font-semibold mb-2">Globally Accessible</h3>
                <p className="text-gray-600 text-sm">Tools designed for users across languages and regions.</p>
              </div>
              <div className="p-4">
                <Award className="h-10 w-10 mx-auto mb-3 text-indigo-500" />
                <h3 className="font-semibold mb-2">Quality Focused</h3>
                <p className="text-gray-600 text-sm">Committed to excellence in both code and educational content.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="max-w-2xl mx-auto mb-8 text-gray-700">
            Have ideas, questions, or want to contribute? We'd love to hear from you!
          </p>
          <a 
            href="mailto:community@devfun.com" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Coffee className="mr-2 h-5 w-5" />
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
