import { scrapeWebsite } from '../../services/scraper';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Mock axios and cheerio
jest.mock('axios');
jest.mock('cheerio');
jest.mock('franc', () => ({
  franc: jest.fn().mockReturnValue('en'),
}));

// Mock logger
jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}));

describe('scraperService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('scrapeWebsite', () => {
    it('should scrape website content and detect language', async () => {
      // Mock axios response
      (axios.get as jest.Mock).mockResolvedValue({
        data: '<html><body><h1>Hello World</h1><p>This is a test</p></body></html>',
        status: 200,
        headers: { 'content-type': 'text/html' },
      });

      // Mock cheerio
      const mockLoad = jest.fn().mockReturnValue({
        remove: jest.fn(),
        text: jest.fn().mockReturnValue('Hello World This is a test'),
      });
      (cheerio.load as jest.Mock).mockImplementation(() => mockLoad);

      const result = await scrapeWebsite('https://example.com');

      expect(axios.get).toHaveBeenCalledWith('https://example.com', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MindwiseBot/1.0; +http://mindwise-demo.pages.dev)',
        },
        timeout: 15000,
        maxRedirects: 5,
      });

      expect(result.content).toContain('Hello World');
      expect(result.language).toBeDefined();
    });

    it('should throw error for invalid URL', async () => {
      await expect(scrapeWebsite('invalid-url')).rejects.toThrow('Invalid URL provided');
    });

    it('should throw error for non-HTML content', async () => {
      (axios.get as jest.Mock).mockResolvedValue({
        data: 'not html content',
        status: 200,
        headers: { 'content-type': 'application/json' },
      });

      await expect(scrapeWebsite('https://example.com')).rejects.toThrow('URL does not point to an HTML page');
    });
  });
});