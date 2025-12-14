import { Search, Star, Calendar, Users, TrendingUp, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const topPlanners = [
  { id: 1, name: 'Priya Sharma', specialty: 'Wedding Planner', rating: 4.9, reviews: 120, image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&w=200' },
  { id: 2, name: 'Rajesh Kumar', specialty: 'Corporate Events', rating: 4.8, reviews: 95, image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&w=200' },
  { id: 3, name: 'Ananya Patel', specialty: 'Birthday Parties', rating: 4.9, reviews: 150, image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&w=200' },
  { id: 4, name: 'Vikram Singh', specialty: 'Destination Events', rating: 4.7, reviews: 88, image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&w=200' },
];

const pastEvents = [
  'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&w=800',
  'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&w=800',
  'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?auto=compress&w=800',
  'https://images.pexels.com/photos/1309240/pexels-photo-1309240.jpeg?auto=compress&w=800',
  'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&w=800',
];

const features = [
  { icon: Search, title: 'Smart Matching', description: 'AI-powered algorithm matches you with the perfect event planner for your needs' },
  { icon: Calendar, title: 'Easy Scheduling', description: 'Manage all your event details and timelines in one intuitive platform' },
  { icon: Users, title: 'Verified Planners', description: 'Connect with thoroughly vetted and experienced event planning professionals' },
  { icon: TrendingUp, title: 'Real-time Updates', description: 'Stay informed with instant notifications and live event progress tracking' },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % pastEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + pastEvents.length) % pastEvents.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-teal-500/10 dark:from-purple-600/20 dark:to-teal-500/20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-teal-500 text-white rounded-full text-sm font-medium shadow-lg shadow-purple-500/30">
              AI-Powered Event Planning
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
            Where Every Event Becomes an <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-500">Adventure</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create memorable experiences that leave a lasting impression with our professional event planning platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-500 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all shadow-lg shadow-purple-500/20">
              Find Planners
            </button>
            <button className="px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all">
              Plan an Event
            </button>
          </div>
        </div>
      </section>

      {/* Top Planners Section */}
      <section className="py-20 bg-white dark:bg-gray-900/50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Top Event Planners
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Meet our verified professionals ready to make your event unforgettable</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topPlanners.map((planner) => (
              <div
                key={planner.id}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={planner.image}
                    alt={planner.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-white dark:ring-gray-700 group-hover:ring-teal-500 transition-all"
                  />
                  <div className="absolute bottom-0 right-1/2 translate-x-8 translate-y-[-10px]">
                    <CheckCircle className="w-6 h-6 text-teal-500 bg-white dark:bg-gray-800 rounded-full" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">{planner.name}</h3>
                <p className="text-teal-600 dark:text-teal-400 text-center mb-3 font-medium">{planner.specialty}</p>
                <div className="flex items-center justify-center space-x-2 bg-white dark:bg-gray-900/50 py-2 rounded-lg">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">{planner.rating}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">({planner.reviews})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events Gallery */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Past Events Gallery
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Explore stunning events planned through our platform</p>
          </div>

          <div className="relative max-w-5xl mx-auto group">
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={pastEvents[currentSlide]}
                alt={`Event ${currentSlide + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-sm font-medium uppercase tracking-wider mb-2 text-teal-400">Featured Event</p>
                <h3 className="text-3xl font-bold">Summer Gala 2024</h3>
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700 p-3 rounded-full hover:scale-110 transition-all shadow-lg"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700 p-3 rounded-full hover:scale-110 transition-all shadow-lg"
            >
              <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>

            <div className="flex justify-center mt-8 space-x-2">
              {pastEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-teal-500 w-8' : 'bg-gray-300 dark:bg-gray-700 w-2'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-900/50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Simple steps to your perfect event</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-all text-center group"
              >
                <div className="inline-flex p-4 bg-gradient-to-br from-purple-600 to-teal-500 rounded-2xl mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <CheckCircle className="w-16 h-16 text-teal-500 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4 text-white">Ready to Get Started?</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                Join thousands of satisfied clients who have created unforgettable events with our platform
              </p>
              <button className="px-10 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all">
                Start Planning Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

