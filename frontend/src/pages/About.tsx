import { Target, Eye, Workflow } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
      <section className="bg-gradient-to-br from-purple-600/10 via-transparent to-teal-500/10 dark:from-gray-900 dark:via-purple-950/30 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
              About Us
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Revolutionizing event planning with AI-powered matching and seamless coordination
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white dark:bg-dark-card backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-3xl p-8 hover:shadow-xl hover:scale-105 transition-all">
              <div className="inline-flex p-4 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl mb-6 shadow-lg shadow-purple-500/20">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To democratize access to professional event planning services by connecting clients with
                the perfect planners through intelligent AI matching, making every event memorable and
                stress-free.
              </p>
            </div>

            <div className="bg-white dark:bg-dark-card backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-3xl p-8 hover:shadow-xl hover:scale-105 transition-all">
              <div className="inline-flex p-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-6 shadow-lg shadow-teal-500/20">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To become the leading global platform where every event, big or small, is planned to
                perfection with the help of AI technology and a network of talented professionals.
              </p>
            </div>

            <div className="bg-white dark:bg-dark-card backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-3xl p-8 hover:shadow-xl hover:scale-105 transition-all">
              <div className="inline-flex p-4 bg-gradient-to-br from-purple-600 to-teal-500 rounded-2xl mb-6 shadow-lg shadow-purple-500/20">
                <Workflow className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Workflow</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We streamline event planning through AI-powered matching, real-time collaboration tools,
                and transparent communication, ensuring every detail is handled with precision.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-dark-card backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-3xl p-12 shadow-xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">How We Work</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tell Us Your Vision</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Share your event details, preferences, and budget. Our AI analyzes your requirements to
                    understand your unique needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Matching</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our AI matches you with the most suitable event planners based on expertise, style,
                    availability, and past client reviews.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Collaborate Seamlessly</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Work directly with your chosen planner through our platform. Track progress, share ideas,
                    and make decisions in real-time.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Enjoy Your Perfect Event</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Relax and enjoy your event while your planner handles every detail. Leave a review to help
                    others find the perfect match.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-purple-600 to-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Join Our Growing Community</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Over 10,000 successful events planned and counting. Be part of the revolution in event planning.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="opacity-90">Events Planned</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="opacity-90">Verified Planners</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="opacity-90">Cities Covered</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4.9</div>
              <div className="opacity-90">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
