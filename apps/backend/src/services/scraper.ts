import axios from 'axios';
import * as cheerio from 'cheerio';
import { franc } from 'franc';
import logger from '../utils/logger';

export async function scrapeWebsite(url: string): Promise<{ content: string; language: string }> {
  try {
    logger.info(`Starting to scrape ${url}`);
    
    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      logger.warn(`Invalid URL provided: ${url}`);
      throw new Error('Invalid URL provided');
    }

    // 1. Fetch the HTML of the page with appropriate headers
    const { data, status, headers } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MindwiseBot/1.0; +http://mindwise-demo.pages.dev)'
      },
      timeout: 15000, // 15 second timeout
      maxRedirects: 5
    });

    logger.info(`Received response with status ${status} and content type ${headers['content-type']}`);

    // 2. Check if the content is HTML
    if (!headers['content-type']?.includes('text/html')) {
      logger.warn(`URL does not point to an HTML page: ${url}`);
      throw new Error('URL does not point to an HTML page');
    }

    // 3. Load the HTML into cheerio
    const $ = cheerio.load(data);

    // 4. Remove unwanted elements
    $('script, style, nav, footer, header, aside, .advertisement, .ads, .sidebar, .nav, .menu').remove();

    // 5. Focus on main content areas if they exist
    let content;
    if ($('main').length > 0) {
      content = $('main');
    } else if ($('article').length > 0) {
      content = $('article');
    } else if ($('.content').length > 0) {
      content = $('.content');
    } else if ($('#content').length > 0) {
      content = $('#content');
    } else {
      content = $('body');
    }

    // 6. Get the text content
    let pageText = content.text();

    // 7. Clean up the text: remove extra whitespace and newlines
    pageText = pageText.replace(/\s\s+/g, ' ').replace(/\n\s*\n/g, '\n').trim();

    // 8. Limit content length to prevent overflow
    if (pageText.length > 100000) {
      pageText = pageText.substring(0, 100000);
      logger.info(`Content truncated to 100,000 characters`);
    }

    // 9. Detect language of the content
    const detectedLanguage = franc(pageText, { minLength: 3 });
    const languageCode = detectedLanguage === 'und' ? 'en' : detectedLanguage;
    
    logger.info(`Successfully scraped ${url}. Found ${pageText.length} characters of text in language: ${languageCode}`);

    return { content: pageText, language: languageCode };

  } catch (error: any) {
    logger.error(`Error scraping website ${url}: ${error.message}`, { error });
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout while trying to scrape the website');
    }
    if (error.code === 'ENOTFOUND') {
      throw new Error('Website not found. Please check the URL and try again');
    }
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Connection refused. The website may be down or blocking requests');
    }
    throw new Error(`Failed to scrape the website: ${error.message}`);
  }
}