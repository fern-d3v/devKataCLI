// API helper functions for devKataCLI
import https from 'https';

// Make HTTPS GET requests with proper headers to avoid bot detection
function httpsGet(url, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const options = {
            timeout,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        };
        
        const request = https.get(url, options, (response) => {
            let data = '';
            
            response.setEncoding('utf8');
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                    return;
                }
                
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (error) {
                    reject(new Error('Failed to parse JSON response'));
                }
            });
        });
        
        request.on('timeout', () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
        
        request.on('error', (error) => {
            reject(error);
        });
    });
}

// Fetch articles from Dev.to API by tag
export async function fetchDevToArticles(tags) {
    try {
        const tag = Array.isArray(tags) ? tags[0] : tags;
        const url = `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=100`;
        
        const articles = await httpsGet(url);
        
        return {
            success: true,
            articles: articles,
            count: articles.length
        };
    } catch (error) {
        console.error('Error fetching Dev.to articles:', error.message);
        return {
            success: false,
            articles: [],
            count: 0,
            error: error.message
        };
    }
}

// Fetch repositories from GitHub API
export async function fetchGitHubRepos(query) {
    try {
        let searchQuery;
        if (query.includes(' ') || query.includes(':')) {
            searchQuery = `${query} stars:>1000`;
        } else {
            searchQuery = `language:${query} stars:>1000`;
        }
        
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=100`;
        const response = await httpsGet(url);
        
        return {
            success: true,
            repos: response.items || [],
            count: response.items ? response.items.length : 0
        };
    } catch (error) {
        console.error('Error fetching GitHub repos:', error.message);
        return {
            success: false,
            repos: [],
            count: 0,
            error: error.message
        };
    }
}

// Get a random item from an array
export function getRandomItem(array) {
    if (!array || array.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};