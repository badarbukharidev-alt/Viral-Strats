import { SearchResponse, VideoDetails } from '../types';

const SEARCH_API_BASE = 'https://yt-scrapper.fakcloud.tech';
const AI_API_BASE = 'https://chat-gpt.fak-official.workers.dev';

export const searchVideos = async (query: string): Promise<SearchResponse> => {
  try {
    const response = await fetch(`${SEARCH_API_BASE}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to fetch search results');
    return await response.json();
  } catch (error) {
    console.error("Search API Error:", error);
    throw error;
  }
};

export const getVideoDetails = async (videoId: string): Promise<VideoDetails> => {
  try {
    const response = await fetch(`${SEARCH_API_BASE}/details?id=${videoId}`);
    if (!response.ok) throw new Error('Failed to fetch video details');
    return await response.json();
  } catch (error) {
    console.error("Details API Error:", error);
    throw error;
  }
};

export interface GeneratedContent {
  seoTitle: string;
  description: string;
  keywords: string;
  veoScript: string;
  raw: string;
}

export const generateContentPackage = async (videoDetails: VideoDetails): Promise<GeneratedContent> => {
  try {
    const prompt = `Act as a Viral Content Strategist. Based on this title: [${videoDetails.title}] and tags: [${videoDetails.tags.join(', ')}], generate a comprehensive content package.
    
    You MUST use the following delimiters exactly to separate sections:

    ===SEO_TITLE===
    (Write 1 highly optimized viral title. You MUST include #shorts and 2-3 relevant hashtags at the end)

    ===DESCRIPTION===
    (Write a compelling description including what the video is about, keywords, and hashtags)

    ===KEYWORDS===
    (Provide 20 high-ranking keywords, separated by commas. Do NOT use a numbered list. Example: keyword1, keyword2, keyword3)

    ===VEO_SCRIPT===
    (Write a professional 8-second Veo 3 AI video script for a hook. Include Scene details and Visual Prompts. Do NOT include Voiceover/Audio instructions unless it is absolutely critical for the content's context)
    `;

    const response = await fetch(`${AI_API_BASE}/?q=${encodeURIComponent(prompt)}`);
    if (!response.ok) throw new Error('Failed to generate content');
    
    const text = await response.text();
    
    // Simple parsing logic
    const seoTitleMatch = text.match(/===SEO_TITLE===([\s\S]*?)===DESCRIPTION===/);
    const descriptionMatch = text.match(/===DESCRIPTION===([\s\S]*?)===KEYWORDS===/);
    const keywordsMatch = text.match(/===KEYWORDS===([\s\S]*?)===VEO_SCRIPT===/);
    const veoScriptMatch = text.match(/===VEO_SCRIPT===([\s\S]*?)$/);

    // Clean up keywords to ensure they are comma separated if AI messed up
    let rawKeywords = keywordsMatch ? keywordsMatch[1].trim() : "keyword1, keyword2";
    // Replace newlines with commas if they exist and aren't followed by commas
    if (!rawKeywords.includes(',')) {
        rawKeywords = rawKeywords.replace(/\n/g, ', ');
    }

    return {
      seoTitle: seoTitleMatch ? seoTitleMatch[1].trim() : "Generated Title",
      description: descriptionMatch ? descriptionMatch[1].trim() : "Generated Description",
      keywords: rawKeywords,
      veoScript: veoScriptMatch ? veoScriptMatch[1].trim() : text, 
      raw: text
    };
  } catch (error) {
    console.error("AI API Error:", error);
    throw error;
  }
};
