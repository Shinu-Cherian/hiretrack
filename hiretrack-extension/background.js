const BASE_URL = 'https://hiretrack-gw0m.onrender.com';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'API_POST') {
    handleApiPost(request.endpoint, request.payload)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }
});

async function handleApiPost(endpoint, payload) {
  try {
    // 1. Fetch CSRF token first
    const csrfRes = await fetch(`${BASE_URL}/get-csrf/`, { method: 'GET' });
    const csrfData = await csrfRes.json();
    
    // 2. Make the actual API request using the token
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfData.csrfToken,
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new Error('NOT_LOGGED_IN');
      }
      throw new Error(`API returned ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    throw err;
  }
}

