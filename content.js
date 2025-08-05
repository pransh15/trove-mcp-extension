// Simplified content extraction that actually works
function extractPageContent() {
    try {
      console.log('Content script: Extracting page content...');
      
      // Get basic page info
      const title = document.title || '';
      const url = window.location.href;
      
      // Extract main content
      let content = '';
      
      // Try different content selectors
      const contentSelectors = [
        'main',
        'article', 
        '[role="main"]',
        '.content',
        '.post-content',
        '.entry-content',
        '#content'
      ];
      
      for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element && element.innerText) {
          content = element.innerText;
          break;
        }
      }
      
      // Fallback to body content
      if (!content) {
        content = document.body.innerText || document.body.textContent || '';
      }
      
      // Clean up content
      content = content
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim()
        .slice(0, 50000); // Limit to 50KB
      
      // Extract headings
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .map(h => ({
          level: parseInt(h.tagName.charAt(1)),
          text: (h.innerText || h.textContent || '').trim()
        }))
        .filter(h => h.text.length > 0 && h.text.length < 200)
        .slice(0, 20);
      
      // Extract meta description
      const metaDescription = document.querySelector('meta[name="description"]')?.content || '';
      const ogDescription = document.querySelector('meta[property="og:description"]')?.content || '';
      const description = metaDescription || ogDescription;
      
      // Extract some relevant links
      const links = Array.from(document.querySelectorAll('a[href]'))
        .map(a => ({
          text: (a.innerText || a.textContent || '').trim(),
          href: a.href
        }))
        .filter(link => 
          link.text.length > 3 && 
          link.text.length < 100 &&
          link.href.startsWith('http')
        )
        .slice(0, 20);
      
      // Calculate basic metrics
      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
      const readingTime = Math.ceil(wordCount / 200);
      
      const result = {
        title: title,
        url: url,
        content: content,
        headings: headings,
        links: links,
        meta: {
          description: description,
          extractedAt: new Date().toISOString(),
          wordCount: wordCount,
          readingTime: readingTime,
          domain: window.location.hostname,
          language: document.documentElement.lang || 'en',
          extractionMethod: 'content-script-v1'
        }
      };
      
      console.log('Content script: Extraction successful', {
        title: result.title,
        contentLength: result.content.length,
        wordCount: result.meta.wordCount,
        headings: result.headings.length
      });
      
      return result;
      
    } catch (error) {
      console.error('Content script: Extraction failed', error);
      
      // Return minimal fallback data
      return {
        title: document.title || '',
        url: window.location.href,
        content: '',
        headings: [],
        links: [],
        meta: {
          extractedAt: new Date().toISOString(),
          wordCount: 0,
          readingTime: 0,
          extractionMethod: 'fallback-error'
        }
      };
    }
  }
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script: Received message', request);
    
    if (request.action === 'extractContent') {
      try {
        const content = extractPageContent();
        console.log('Content script: Sending response', content);
        sendResponse({ success: true, content: content });
      } catch (error) {
        console.error('Content script: Error processing request', error);
        sendResponse({ success: false, error: error.message });
      }
    }
    
    return true; // Keep message channel open for async response
  });
  
  // Log that content script is loaded
  console.log('Content script loaded successfully');