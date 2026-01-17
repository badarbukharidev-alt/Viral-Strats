import React from 'react';
import { Button } from './Button';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                ViralStrats
              </span>
            </div>
            <a 
              href="https://whatsapp.com/channel/0029Vb7FVyy6BIEdCN9BXh1C" 
              target="_blank" 
              rel="noreferrer"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors hidden sm:block"
            >
              Join the Community
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative pt-16 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto animate-slide-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-8">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
                AI-Powered Analytics
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8">
                Master the Art of <br/>
                <span className="text-indigo-600">Viral Content</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Analyze top-performing videos, extract hidden metadata, and generate 
                winning strategies in seconds using our advanced AI engine.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button onClick={onStart} className="text-lg px-8 py-4">
                  Launch Tool <i className="fa-solid fa-rocket ml-2"></i>
                </Button>
                <a 
                  href="https://whatsapp.com/channel/0029Vb7FVyy6BIEdCN9BXh1C" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="whatsapp" className="w-full sm:w-auto text-lg px-8 py-4">
                    Join WhatsApp Channel <i className="fa-brands fa-whatsapp ml-2"></i>
                  </Button>
                </a>
              </div>
              
              <p className="mt-6 text-sm text-gray-400">
                Made by <span className="font-semibold text-gray-600">Badar Bukhari</span>
              </p>
            </div>
          </div>
          
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none opacity-40">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              <FeatureCard 
                icon="fa-magnifying-glass"
                title="Deep Search"
                description="Scrape real-time YouTube data to find trending videos in your niche instantly."
              />
              <FeatureCard 
                icon="fa-microchip"
                title="AI Analysis"
                description="Our AI breaks down titles, tags, and stats to understand why a video went viral."
              />
              <FeatureCard 
                icon="fa-lightbulb"
                title="Smart Strategy"
                description="Get generated hooks, titles, and SEO keywords tailored to beat the competition."
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 mb-4">
            &copy; {new Date().getFullYear()} ViralStrats. All rights reserved.
          </p>
          <div className="flex justify-center items-center gap-2 text-sm text-gray-600">
             <span>Made with <i className="fa-solid fa-heart text-red-500 mx-1"></i> by</span>
             <span className="font-semibold text-indigo-600">Badar Bukhari</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{icon: string, title: string, description: string}> = ({ icon, title, description }) => (
  <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow duration-300 text-center group">
    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
      <i className={`fa-solid ${icon} text-2xl text-indigo-600`}></i>
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);
