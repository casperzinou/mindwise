import * as cheerio from 'npm:cheerio@1.0.0-rc.12'

// This is the same scraper logic from our main backend
export async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    const data = await response.text()
    const $ = cheerio.load(data)
    $('script, style, nav, footer, header').remove()
    let pageText = $('body').text()
    pageText = pageText.replace(/\s\s+/g, ' ').replace(/\n\s*\n/g, '\n').trim()
    return pageText
  } catch (error) {
    throw new Error(`Failed to scrape ${url}: ${error.message}`)
  }
}