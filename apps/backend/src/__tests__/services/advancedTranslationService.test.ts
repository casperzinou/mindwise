import { detectLanguage, translateText, getWebsiteLanguage, getLocalizedGreeting } from '../../services/advancedTranslationService';
import { createClient } from '@supabase/supabase-js';

// Mock franc module
jest.mock('franc', () => ({
  franc: jest.fn().mockReturnValue('en'),
}));

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
  }),
}));

// Mock logger
jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}));

describe('advancedTranslationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('detectLanguage', () => {
    it('should detect language of text', async () => {
      const text = 'Hello, how are you?';
      const result = await detectLanguage(text);
      
      // franc will detect this as English
      expect(result).toBe('en');
    });

    it('should default to English for unknown language', async () => {
      // Mock franc to return 'und' for unknown language
      const francModule = require('franc');
      francModule.franc.mockReturnValueOnce('und');
      
      const text = '12345';
      const result = await detectLanguage(text);
      
      expect(result).toBe('en');
    });
  });

  describe('translateText', () => {
    it('should return original text when source and target languages are the same', async () => {
      const text = 'Hello';
      const result = await translateText(text, 'en', 'en');
      
      expect(result).toBe(text);
    });

    it('should provide mock translation for different languages', async () => {
      const text = 'Hello';
      const result = await translateText(text, 'en', 'fr');
      
      expect(result).toContain('[Translated from English to French]');
      expect(result).toContain(text);
    });
  });

  describe('getWebsiteLanguage', () => {
    it('should return default language when bot not found', async () => {
      (createClient as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
      });

      const result = await getWebsiteLanguage('non-existent-bot-id');
      
      expect(result).toBe('en');
    });
  });

  describe('getLocalizedGreeting', () => {
    it('should return English greeting by default', () => {
      const result = getLocalizedGreeting('en');
      
      expect(result).toBe("Hello! I'm your AI assistant. How can I help you today?");
    });

    it('should return French greeting when requested', () => {
      const result = getLocalizedGreeting('fr');
      
      expect(result).toBe("Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?");
    });

    it('should return English greeting for unknown language', () => {
      const result = getLocalizedGreeting('unknown');
      
      expect(result).toBe("Hello! I'm your AI assistant. How can I help you today?");
    });
  });
});