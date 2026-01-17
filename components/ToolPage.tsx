import React, { useState } from 'react';
import { Button } from './Button';
import { searchVideos, getVideoDetails, generateContentPackage, GeneratedContent } from '../services/api';
import { VideoSearchResult, VideoDetails } from '../types';

export const ToolPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<VideoSearchResult[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoDetails | null>(null);
  
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [step, setStep] = useState<'search' | 'results' | 'analysis'>('search');
  const [error, setError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await searchVideos(query);
      setResults(data.results || []);
      setStep('results');
      setSelectedVideo(null);
      setGeneratedContent(null);
    } catch (err) {
      setError('Failed to fetch search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async (video: VideoSearchResult) => {
    setAnalyzingId(video.id);
    setError(null);
    try {
      // 1. Get Details
      const details = await getVideoDetails(video.id);
      setSelectedVideo(details);
      
      // 2. Generate Full Content Package
      const content = await generateContentPackage(details);
      setGeneratedContent(content);
      
      setStep('analysis');
    } catch (err) {
      setError('Failed to generate content. The API might be busy.');
    } finally {
      setAnalyzingId(null);
    }
  };

  const resetSearch = () => {
    setStep('search');
    setQuery('');
    setResults([]);
    setGeneratedContent(null);
  };

  const backToResults = () => {
    setStep('results');
    setGeneratedContent(null);
    setSelectedVideo(null);
  };

  const copyToClipboard = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const formatViews = (viewStr: string) => {
    if (!viewStr) return '0';
    // If it already has K or M, assume it is formatted
    if (/[KMkm]/.test(viewStr)) return viewStr;
    
    // Extract numeric part only
    const numStr = viewStr.replace(/[^0-9]/g, '');
    const num = parseInt(numStr);
    
    if (isNaN(num)) return viewStr;
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Tool Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-500 hover:text-indigo-600 transition-colors">
              <i className="fa-solid fa-arrow-left text-lg"></i>
            </button>
            <h1 className="font-bold text-lg text-slate-800">
              {step === 'search' && 'Dashboard'}
              {step === 'results' && `Results for "${query}"`}
              {step === 'analysis' && 'Generated Content Package'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs text-gray-500 hidden sm:inline">Made by Badar Bukhari</span>
             <a href="https://whatsapp.com/channel/0029Vb7FVyy6BIEdCN9BXh1C" target="_blank" rel="noreferrer" className="bg-[#25D366] text-white p-2 rounded-full hover:bg-[#128C7E] transition-colors">
               <i className="fa-brands fa-whatsapp"></i>
             </a>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fa-solid fa-circle-exclamation text-red-500"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {step === 'search' && (
          <div className="max-w-2xl mx-auto mt-20 text-center animate-slide-up">
            <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <i className="fa-solid fa-wand-magic-sparkles text-3xl text-indigo-600"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What do you want to analyze?</h2>
            <p className="text-slate-500 mb-8">Enter a keyword, topic, or niche to find viral opportunities.</p>
            
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'AI ASMR', 'Minecraft Speedrun', 'Tech Reviews'"
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none shadow-sm transition-all"
                disabled={loading}
              />
              <button 
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Search'}
              </button>
            </form>
          </div>
        )}

        {step === 'results' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-500">Found {results.length} videos</p>
              <button onClick={resetSearch} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                New Search
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((video) => (
                <div key={video.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col relative group">
                  
                  {/* Loading Overlay */}
                  {analyzingId === video.id && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-4 animate-fade-in rounded-xl">
                      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                      <p className="font-semibold text-indigo-900">Generating Strategy...</p>
                      <p className="text-sm text-indigo-600/80">Analyzing viral patterns</p>
                    </div>
                  )}

                  <div className="relative aspect-video bg-gray-200">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2" title={video.title}>
                      {video.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-1">{video.channel}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                      <span><i className="fa-solid fa-eye mr-1"></i> {formatViews(video.views)}</span>
                      <span>•</span>
                      <span>{video.published}</span>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Button 
                        onClick={() => handleGenerateContent(video)} 
                        disabled={analyzingId !== null}
                        fullWidth
                        className="text-sm py-2"
                      >
                        {analyzingId === video.id ? (
                          <>
                            <i className="fa-solid fa-spinner fa-spin mr-2"></i> Analyzing...
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Generate Content
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'analysis' && selectedVideo && generatedContent && (
          <div className="animate-fade-in max-w-7xl mx-auto pb-12">
            <button onClick={backToResults} className="mb-6 text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-2">
              <i className="fa-solid fa-arrow-left"></i> Back to results
            </button>

            {/* Source Video Details Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-80 flex-shrink-0">
                <div className="aspect-video rounded-xl overflow-hidden shadow-md relative">
                  <img 
                    src={`https://i.ytimg.com/vi/${selectedVideo.id}/hqdefault.jpg`}
                    alt={selectedVideo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-grow flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
                   <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold text-xs border border-indigo-100">
                     <i className="fa-solid fa-bolt mr-1"></i> Analyzed Source
                   </span>
                   <span className="text-gray-400">|</span>
                   <span className="text-gray-500"><i className="fa-regular fa-calendar mr-1"></i> {selectedVideo.stats.date}</span>
                   <span className="text-gray-400">|</span>
                   <span className="text-gray-500"><i className="fa-solid fa-eye mr-1"></i> {selectedVideo.stats.views} views</span>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-2 leading-snug">
                  {selectedVideo.title}
                </h2>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <span className="font-semibold text-slate-700">{selectedVideo.channel.name}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                   {selectedVideo.tags?.slice(0, 5).map(tag => (
                     <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                       #{tag}
                     </span>
                   ))}
                </div>
              </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 1. SEO Title - Full Width */}
              <div className="lg:col-span-3 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 shadow-lg overflow-hidden">
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <i className="fa-solid fa-heading"></i> SEO Optimized Title
                  </h3>
                  <button 
                    onClick={() => copyToClipboard(generatedContent.seoTitle, 'title')}
                    className="text-indigo-100 hover:text-white text-sm bg-indigo-700/50 hover:bg-indigo-700 px-3 py-1 rounded transition-colors"
                  >
                    {copiedSection === 'title' ? <><i className="fa-solid fa-check mr-1"></i> Copied</> : <><i className="fa-regular fa-copy mr-1"></i> Copy Title</>}
                  </button>
                </div>
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-slate-800">{generatedContent.seoTitle}</h2>
                </div>
              </div>

              {/* 2. Description - 2/3 Width */}
              <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 shadow-lg overflow-hidden flex flex-col">
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <i className="fa-solid fa-align-left"></i> Description & Hashtags
                  </h3>
                  <button 
                    onClick={() => copyToClipboard(generatedContent.description, 'desc')}
                    className="text-indigo-100 hover:text-white text-sm bg-indigo-700/50 hover:bg-indigo-700 px-3 py-1 rounded transition-colors"
                  >
                    {copiedSection === 'desc' ? <><i className="fa-solid fa-check mr-1"></i> Copied</> : <><i className="fa-regular fa-copy mr-1"></i> Copy</>}
                  </button>
                </div>
                <div className="p-8 prose prose-indigo max-w-none flex-grow">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {generatedContent.description}
                  </div>
                </div>
              </div>

              {/* 3. Keywords - 1/3 Width */}
              <div className="lg:col-span-1 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 shadow-lg overflow-hidden flex flex-col">
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <i className="fa-solid fa-tags"></i> Keywords
                  </h3>
                  <button 
                    onClick={() => copyToClipboard(generatedContent.keywords, 'keywords')}
                    className="text-indigo-100 hover:text-white text-sm bg-indigo-700/50 hover:bg-indigo-700 px-3 py-1 rounded transition-colors"
                  >
                    {copiedSection === 'keywords' ? <i className="fa-solid fa-check"></i> : <i className="fa-regular fa-copy"></i>}
                  </button>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="bg-white border border-indigo-100 rounded-lg p-4 text-slate-600 font-mono text-sm leading-relaxed shadow-inner flex-grow overflow-y-auto max-h-[300px]">
                    {generatedContent.keywords}
                  </div>
                  <p className="mt-3 text-xs text-gray-400 text-center">Comma-separated for easy pasting</p>
                </div>
              </div>

              {/* 4. Veo 3 Script - Full Width */}
              <div className="lg:col-span-3 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden text-white">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span className="bg-white text-indigo-700 px-2 py-0.5 rounded text-sm font-extrabold">VEO 3</span>
                    8s AI Video Script (Hook)
                  </h3>
                  <button 
                    onClick={() => copyToClipboard(generatedContent.veoScript, 'script')}
                    className="text-white/80 hover:text-white text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors"
                  >
                    {copiedSection === 'script' ? <><i className="fa-solid fa-check mr-1"></i> Copied</> : <><i className="fa-regular fa-copy mr-1"></i> Copy Script</>}
                  </button>
                </div>
                <div className="p-8 prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed font-medium font-mono text-slate-200">
                    {generatedContent.veoScript}
                  </div>
                </div>
                <div className="bg-black/20 px-6 py-4 border-t border-white/10 flex justify-center">
                    <a href="https://whatsapp.com/channel/0029Vb7FVyy6BIEdCN9BXh1C" target="_blank" rel="noreferrer">
                        <Button variant="whatsapp" className="text-sm py-2 px-6 shadow-none">
                            <i className="fa-brands fa-whatsapp mr-2"></i> Join Channel for More Tools
                        </Button>
                    </a>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};