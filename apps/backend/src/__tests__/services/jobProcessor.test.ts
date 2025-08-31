import { processJobs, clearAllJobs } from '../../services/jobProcessor';
import { createClient } from '@supabase/supabase-js';
import { scrapeWebsite } from '../../services/scraper';

// Mock environment variables
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_KEY = 'test-key';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    rpc: jest.fn().mockResolvedValue({ data: [], error: null }),
    functions: {
      invoke: jest.fn().mockResolvedValue({ data: { embedding: [0.1, 0.2, 0.3] }, error: null }),
    },
  }),
}));

// Mock scraper
jest.mock('../../services/scraper', () => ({
  scrapeWebsite: jest.fn().mockResolvedValue({ 
    content: 'This is scraped content', 
    language: 'en' 
  }),
}));

// Mock logger
jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}));

describe('jobProcessor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processJobs', () => {
    it('should process pending jobs', async () => {
      // Mock Supabase to return a pending job
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        rpc: jest.fn().mockResolvedValue({ data: [], error: null }),
        functions: {
          invoke: jest.fn().mockResolvedValue({ data: { embedding: [0.1, 0.2, 0.3] }, error: null }),
        },
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      // Mock jobs response
      mockSupabase.limit.mockResolvedValueOnce({
        data: [{ id: 'job-1', bot_id: 'bot-1' }],
        error: null,
      });

      // Mock bot response
      mockSupabase.select.mockResolvedValueOnce({
        single: jest.fn().mockResolvedValueOnce({
          data: { 
            id: 'bot-1', 
            name: 'Test Bot', 
            website_url: 'https://example.com',
            configuration_details: {}
          },
          error: null,
        }),
      });

      await processJobs();

      expect(createClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'test-key'
      );
      
      expect(mockSupabase.from).toHaveBeenCalledWith('jobs');
    });

    it('should handle no pending jobs', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      await processJobs();

      expect(mockSupabase.from).toHaveBeenCalledWith('jobs');
    });
  });

  describe('clearAllJobs', () => {
    it('should clear all jobs', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        neq: jest.fn().mockReturnThis(),
      };

      (createClient as jest.Mock).mockReturnValue(mockSupabase);

      await clearAllJobs();

      expect(mockSupabase.from).toHaveBeenCalledWith('jobs');
      expect(mockSupabase.neq).toHaveBeenCalledWith('id', '00000000-0000-0000-0000-000000000000');
    });
  });
});