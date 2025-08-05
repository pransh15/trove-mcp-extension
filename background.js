// Cross-browser compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Trove MCP Server Configuration
const TROVE_SERVER_URL = 'https://f753516b850a142422840bc1.fp.dev';

// Handle keyboard shortcut
browserAPI.commands.onCommand.addListener(async (command) => {
  if (command === 'save-link') {
    const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    
    if (currentTab) {
      if (typeof browser !== 'undefined') {
        browserAPI.browserAction.openPopup();
      } else {
        browserAPI.action.openPopup();
      }
    }
  }
});

// Handle messages from popup
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background: Received message', request.action);
  
  if (request.action === 'saveLink') {
    saveToTrove(request)
      .then(result => {
        console.log('Background: Save successful', result);
        sendResponse({ success: true, data: result });
      })
      .catch(error => {
        console.error('Background: Save failed', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Keep message channel open for async response
  }
});

// Function to save link to Trove
async function saveToTrove(linkData) {
  try {
    console.log('Background: Saving to Trove...', {
      url: linkData.url,
      title: linkData.title,
      contentLength: linkData.content?.length || 0,
      tags: linkData.tags
    });
    
    const payload = {
      url: linkData.url,
      tags: linkData.tags || [],
      content: linkData.content,
      headings: linkData.headings,
      links: linkData.links,
      meta: linkData.meta
    };
    
    const response = await fetch(`${TROVE_SERVER_URL}/api/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    console.log('Background: Server response status', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Background: Server error response', errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Background: Server response data', result);
    
    // Show success notification
    browserAPI.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-48.png',
      title: 'Trove Link Saver',
      message: `✅ Saved: ${linkData.title}`,
      priority: 1
    });
    
    return result;
    
  } catch (error) {
    console.error('Background: Error saving to Trove:', error);
    
    // Show error notification
    browserAPI.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-48.png',
      title: 'Trove Link Saver - Error',
      message: `❌ Failed to save: ${error.message}`,
      priority: 2
    });
    
    throw error;
  }
}

// Handle extension installation
browserAPI.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    browserAPI.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-48.png',
      title: 'Trove Link Saver Installed!',
      message: '🎉 Use Cmd+Shift+S to save links with AI tagging',
      priority: 1
    });
  }
});

console.log('Background script loaded successfully');