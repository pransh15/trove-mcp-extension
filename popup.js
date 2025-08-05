// Cross-browser compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

let extractedContent = null;

// Extract content when popup opens
async function extractContent() {
  try {
    const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    
    console.log('Extracting content from tab:', currentTab.url);
    
    // Try to send message to content script
    try {
      const response = await browserAPI.tabs.sendMessage(currentTab.id, { action: 'extractContent' });
      
      if (response && response.success) {
        extractedContent = response.content;
        console.log('Content extracted successfully:', extractedContent);
        updateUI(extractedContent);
      } else {
        console.log('Content script response failed, using fallback');
        useFallbackExtraction(currentTab);
      }
    } catch (error) {
      console.log('Content script not available, using fallback:', error);
      useFallbackExtraction(currentTab);
    }
  } catch (error) {
    console.error('Error extracting content:', error);
    useFallbackExtraction();
  }
}

function useFallbackExtraction(tab) {
  // Fallback to basic tab info
  extractedContent = {
    title: tab?.title || 'Unknown Title',
    url: tab?.url || window.location?.href || '',
    content: '',
    headings: [],
    links: [],
    meta: { 
      extractedAt: new Date().toISOString(),
      wordCount: 0,
      readingTime: 0,
      extractionMethod: 'fallback'
    }
  };
  
  console.log('Using fallback extraction:', extractedContent);
  updateUI(extractedContent);
}

function updateUI(content) {
  console.log('Updating UI with content:', content);
  
  // Update URL preview
  const urlPreview = document.getElementById('urlPreview');
  if (urlPreview) {
    urlPreview.textContent = content.url || 'No URL';
  }
  
  // Update content preview
  const contentPreview = document.getElementById('contentPreview');
  if (contentPreview) {
    const preview = content.content ? 
      content.content.slice(0, 200) + '...' : 
      'Content will be extracted automatically when saved';
    contentPreview.textContent = preview;
  }
  
  // Update word count info
  const wordCount = document.getElementById('wordCount');
  if (wordCount) {
    const words = content.meta?.wordCount || 0;
    const time = content.meta?.readingTime || 0;
    wordCount.textContent = `${words} words • ${time} min read`;
  }
  
  // Clear the loading state
  const loadingElement = document.getElementById('loading');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
  
  // Show the form
  const formElement = document.getElementById('mainForm');
  if (formElement) {
    formElement.style.display = 'block';
  }
  
  console.log('UI updated successfully');
}

// Initialize when popup opens
document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup loaded, extracting content...');
  extractContent();
});

// Handle tag suggestions
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tag-suggestion').forEach(button => {
    button.addEventListener('click', () => {
      const tag = button.dataset.tag;
      const tagsInput = document.getElementById('tags');
      const currentTags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t);
      
      if (!currentTags.includes(tag)) {
        currentTags.push(tag);
        tagsInput.value = currentTags.join(', ');
      }
    });
  });
});

// Handle save button
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveBtn').addEventListener('click', async () => {
    const saveBtn = document.getElementById('saveBtn');
    const status = document.getElementById('status');
    
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    status.style.display = 'none';
    
    try {
      if (!extractedContent) {
        throw new Error('No content available to save');
      }
      
      const tagsInput = document.getElementById('tags').value;
      const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);
      
      console.log('Saving link with data:', { ...extractedContent, tags });
      
      // Send message to background script with content
      const response = await browserAPI.runtime.sendMessage({
        action: 'saveLink',
        url: extractedContent.url,
        title: extractedContent.title,
        content: extractedContent.content,
        headings: extractedContent.headings,
        links: extractedContent.links,
        meta: extractedContent.meta,
        tags: tags
      });
      
      if (response.success) {
        status.className = 'status success';
        status.textContent = `✅ Link saved successfully!`;
        status.style.display = 'block';
        
        // Close popup after 2 seconds
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        throw new Error(response.error || 'Failed to save link');
      }
      
    } catch (error) {
      console.error('Save error:', error);
      status.className = 'status error';
      status.textContent = `❌ Error: ${error.message}`;
      status.style.display = 'block';
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Link';
    }
  });
});

// Handle cancel button
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('cancelBtn').addEventListener('click', () => {
    window.close();
  });
});

// Handle Enter key in tags input
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tags').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('saveBtn').click();
    }
  });
});