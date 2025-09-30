import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { franc } from 'franc';

// Load environment variables
dotenv.config();

// Supported languages mapping
const SUPPORTED_LANGUAGES: { [key: string]: string } = {
  'en': 'English',
  'ar': 'Arabic',
  'fr': 'French',
  'es': 'Spanish',
  'de': 'German',
  'ja': 'Japanese',
  'zh': 'Chinese',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'hi': 'Hindi',
  'it': 'Italian',
  'ko': 'Korean',
  'tr': 'Turkish',
  'nl': 'Dutch',
  'pl': 'Polish'
};

// Function to get Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL and Service Key must be provided');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

// Function to detect language of text
export async function detectLanguage(text: string): Promise<string> {
  // For now, we'll use a simple approach
  // In production, you would use Google Translate API or similar
  try {
    const detectedLang = franc(text, { minLength: 3 });
    return detectedLang === 'und' ? 'en' : detectedLang;
  } catch (error) {
    console.error('[translation-service]: Error detecting language:', error);
    return 'en'; // Default to English
  }
}

// Function to translate text
export async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  // Validate languages
  if (!SUPPORTED_LANGUAGES[sourceLang]) {
    console.warn(`[translation-service]: Unsupported source language: ${sourceLang}, defaulting to English`);
    sourceLang = 'en';
  }
  
  if (!SUPPORTED_LANGUAGES[targetLang]) {
    console.warn(`[translation-service]: Unsupported target language: ${targetLang}, defaulting to English`);
    targetLang = 'en';
  }
  
  // If source and target are the same, return original text
  if (sourceLang === targetLang) {
    return text;
  }
  
  // For development/testing, we'll use simple mock translations
  // In production, you would integrate with Google Translate API, DeepL, etc.
  console.log(`[translation-service]: Translating from ${SUPPORTED_LANGUAGES[sourceLang]} to ${SUPPORTED_LANGUAGES[targetLang]}`);
  
  // Mock translation for demonstration
  // In a real implementation, you would call the translation API here
  return `[Translated from ${SUPPORTED_LANGUAGES[sourceLang]} to ${SUPPORTED_LANGUAGES[targetLang]}]: ${text}`;
}

// Function to get website language
export async function getWebsiteLanguage(botId: string): Promise<string> {
  try {
    const supabase = getSupabaseClient();
    
    const { data: bot, error } = await supabase
      .from('chatbots')
      .select('configuration_details')
      .eq('id', botId)
      .single();
    
    if (error || !bot) {
      console.error(`[translation-service]: Error fetching bot language:`, error?.message);
      return 'en'; // Default to English
    }
    
    // Ensure we always return a string
    const websiteLanguage = bot.configuration_details?.website_language || 'en';
    console.log(`[translation-service]: Website language for bot ${botId}: ${websiteLanguage}`);
    
    return websiteLanguage;
  } catch (error) {
    console.error(`[translation-service]: Error getting website language:`, error);
    return 'en'; // Default to English
  }
}

// Function to get localized greeting
export function getLocalizedGreeting(language: string): string {
  const greetings: { [key: string]: string } = {
    'en': 'Hello! I\'m your AI assistant. How can I help you today?',
    'ar': 'مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟',
    'fr': 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
    'es': '¡Hola! Soy tu asistente de IA. ¿Cómo puedo ayudarte hoy?',
    'de': 'Hallo! Ich bin Ihr KI-Assistent. Wie kann ich Ihnen heute helfen?',
    'ja': 'こんにちは！私はあなたのAIアシスタントです。今日はどのようにお手伝いできますか？',
    'zh': '你好！我是你的AI助手。今天我如何帮助你？',
    'pt': 'Olá! Sou seu assistente de IA. Como posso ajudá-lo hoje?',
    'ru': 'Привет! Я ваш ИИ-ассистент. Как я могу вам помочь сегодня?',
    'hi': 'नमस्ते! मैं आपका एआई सहायक हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ?',
    'it': 'Ciao! Sono il tuo assistente AI. Come posso aiutarti oggi?',
    'ko': '안녕하세요! 저는 당신의 AI 어시스턴트입니다. 오늘 어떻게 도와드릴까요?',
    'tr': 'Merhaba! Ben yapay zeka asistanınızım. Bugün size nasıl yardımcı olabilirim?',
    'nl': 'Hallo! Ik ben je AI-assistent. Hoe kan ik je vandaag helpen?',
    'pl': 'Cześć! Jestem Twoim asystentem AI. Jak mogę Ci dzisiaj pomóc?'
  };
  
  // Ensure we always return a string by using a type assertion
  const greeting = greetings[language];
  if (greeting !== undefined) {
    return greeting;
  }
  return greetings['en'] as string;
}

// Export the supported languages
export { SUPPORTED_LANGUAGES };