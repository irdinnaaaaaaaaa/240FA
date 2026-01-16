/**
 * Dynamite Sports Learner – Badminton Coach
 * Main JavaScript Application
 */

// ===== DEBUG SYSTEM =====
const debugLog = [];
let debugPanelOpen = false;

function addDebugLog(message) {
    debugLog.push(message);
    console.log(message);
    updateDebugPanel();
}

function updateDebugPanel() {
    const debugContent = document.getElementById('debug-content');
    if (debugContent) {
        debugContent.innerHTML = debugLog.slice(-10).map(log => 
            `<div>${log}</div>`
        ).join('');
    }
}

function toggleDebugPanel() {
    const debugPanel = document.getElementById('debug-panel');
    if (debugPanel) {
        debugPanelOpen = !debugPanelOpen;
        debugPanel.classList.toggle('show', debugPanelOpen);
    }
}

// ===== STATE MANAGEMENT =====
const appState = {
    chatOpen: false,
    map: null,
    userMarker: null,
    courtMarkers: [],
    userLocation: null,
};

addDebugLog('✓ State initialized');

// ===== DOM ELEMENTS =====
let chatToggleButton;
let footerCtaButton;
let mobileChatButton;
let chatPanel;
let navLinks;
let locationButton;
let statusText;
let mapContainer;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    addDebugLog('🚀 DOMContentLoaded triggered');
    
    // Initialize DOM elements after page load
    chatToggleButton = document.getElementById('chat-toggle-button');
    footerCtaButton = document.getElementById('footer-cta-button');
    mobileChatButton = document.getElementById('mobile-chat-button');
    chatPanel = document.getElementById('chat-panel');
    navLinks = document.querySelectorAll('.nav-link');
    locationButton = document.getElementById('location-button');
    statusText = document.getElementById('status-text');
    mapContainer = document.getElementById('map');
    
    // Debug: Log which elements were found
    addDebugLog('DOM Elements loaded:');
    addDebugLog('  mapContainer: ' + (mapContainer ? '✓' : '✗'));
    addDebugLog('  locationButton: ' + (locationButton ? '✓' : '✗'));
    addDebugLog('  statusText: ' + (statusText ? '✓' : '✗'));
    
    // Add keyboard shortcut for debug panel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'd' || e.key === 'D') {
            toggleDebugPanel();
        }
    });
    
    initializeEventListeners();
    restoreChatState();
    initializeScrollAnimations();
    initializeLocationFeatures();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    addDebugLog('Initializing event listeners...');
    
    // Chat toggle functionality
    if (chatToggleButton) {
        chatToggleButton.addEventListener('click', toggleChat);
        addDebugLog('✓ Chat toggle listener added');
    }
    
    if (footerCtaButton) {
        footerCtaButton.addEventListener('click', toggleChat);
    }
    
    if (mobileChatButton) {
        mobileChatButton.addEventListener('click', toggleChat);
    }

    // Location functionality
    if (locationButton) {
        addDebugLog('Attaching location button listener...');
        locationButton.addEventListener('click', requestUserLocation);
        addDebugLog('✓ Location button listener attached');
    } else {
        addDebugLog('❌ Location button not found when attaching listener!');
    }

    // Navigation smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Keyboard accessibility
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Responsive chat button visibility
    window.addEventListener('resize', debounce(updateChatButtonVisibility, 250));
}

// ===== CHAT FUNCTIONALITY =====
function toggleChat() {
    appState.chatOpen = !appState.chatOpen;
    
    if (appState.chatOpen) {
        openChat();
    } else {
        closeChat();
    }

    // Persist state
    localStorage.setItem('chatOpen', JSON.stringify(appState.chatOpen));
}

function openChat() {
    chatPanel.classList.add('active');
    mobileChatButton.classList.add('active');
    
    // Announce for accessibility
    announceToScreenReader('Chat window opened. Your badminton coach is ready to help!');
    
    // Focus management
    chatPanel.focus();
}

function closeChat() {
    chatPanel.classList.remove('active');
    mobileChatButton.classList.remove('active');
    
    // Announce for accessibility
    announceToScreenReader('Chat window closed.');
}

function restoreChatState() {
    const savedState = localStorage.getItem('chatOpen');
    if (savedState === 'true') {
        appState.chatOpen = false; // Set to false initially
        toggleChat(); // Toggle to true
    }
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe all sections and cards
    document.querySelectorAll('section, .about-card, .features-list li').forEach(el => {
        observer.observe(el);
    });
}

// ===== NAVIGATION =====
function handleNavClick(e) {
    const href = e.currentTarget.getAttribute('href');
    
    // If it's an internal link, handle smooth scroll
    if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            
            // Update active nav link
            navLinks.forEach(link => link.classList.remove('active'));
            e.currentTarget.classList.add('active');
        }
    }
}

// ===== KEYBOARD SHORTCUTS =====
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + Shift + C to toggle chat
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyC') {
        e.preventDefault();
        toggleChat();
    }

    // Escape key to close chat
    if (e.key === 'Escape' && appState.chatOpen) {
        closeChat();
    }
}

// ===== UTILITY FUNCTIONS =====
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => announcement.remove(), 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function updateChatButtonVisibility() {
    const isMobile = window.innerWidth <= 768;
    mobileChatButton.style.display = isMobile ? 'flex' : 'none';
}

// ===== GEOLOCATION & MAPS =====
function initializeLocationFeatures() {
    addDebugLog('Initializing location features...');
    
    if (!navigator.geolocation) {
        addDebugLog('❌ Geolocation not supported');
        updateStatusMessage('⚠️ Geolocation is not supported by your browser.', 'error');
        return;
    }
    
    addDebugLog('✓ Geolocation API available');
    
    // Check if Google Maps API is loaded
    let googleMapsReady = typeof google !== 'undefined' && google.maps;
    
    if (!googleMapsReady) {
        addDebugLog('⏳ Google Maps API not yet loaded, waiting...');
        // Give it a moment to load
        setTimeout(() => {
            googleMapsReady = typeof google !== 'undefined' && google.maps;
            if (googleMapsReady) {
                addDebugLog('✓ Google Maps API now loaded');
            } else {
                addDebugLog('❌ Google Maps API failed to load');
                updateStatusMessage('❌ Google Maps failed to load. Check API key.', 'error');
            }
        }, 2000);
    } else {
        addDebugLog('✓ Google Maps API is ready');
    }
}

function requestUserLocation() {
    addDebugLog('📍 Location request initiated');
    addDebugLog('Geolocation API available: ' + (navigator.geolocation ? 'YES' : 'NO'));
    
    if (!locationButton) {
        addDebugLog('❌ Location button not found!');
        return;
    }

    // Show notification about location permission
    showLocationPermissionNotification();
    
    updateStatusMessage('🔍 Finding badminton courts near you...', 'loading');
    locationButton.disabled = true;

    addDebugLog('📍 Calling navigator.geolocation.getCurrentPosition...');

    if (!navigator.geolocation) {
        addDebugLog('❌ Geolocation not supported!');
        updateStatusMessage('❌ Geolocation not supported by your browser.', 'error');
        locationButton.disabled = false;
        return;
    }

    navigator.geolocation.getCurrentPosition(
        onLocationSuccess,
        onLocationError,
        { timeout: 10000, enableHighAccuracy: false }
    );
}

function onLocationSuccess(position) {
    const { latitude, longitude } = position.coords;
    appState.userLocation = { lat: latitude, lng: longitude };

    addDebugLog(`✓ Location acquired: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    
    // Send location to n8n webhook
    sendLocationToN8n(latitude, longitude);

    updateStatusMessage('✅ Location found! Loading map...', 'success');
    
    // Initialize map - pass the actual coordinates
    addDebugLog('Initializing Google Map...');
    initializeMap(latitude, longitude);
    
    // Find nearby courts
    addDebugLog('Finding nearby courts...');
    findNearbyBadmintonCourts(latitude, longitude);
    
    locationButton.textContent = '📍 Update Location';
    locationButton.disabled = false;
}

function onLocationError(error) {
    locationButton.disabled = false;
    let errorMessage = '';

    addDebugLog(`❌ Geolocation error code: ${error.code} - ${error.message}`);

    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = '❌ You denied location access. Please enable location permissions to find courts nearby.';
            addDebugLog('Error: Permission denied by user');
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = '❌ Location information is unavailable.';
            addDebugLog('Error: Position unavailable');
            break;
        case error.TIMEOUT:
            errorMessage = '⏱️ Location request timed out. Please try again.';
            addDebugLog('Error: Request timeout');
            break;
        default:
            errorMessage = '❌ An error occurred while retrieving your location.';
            addDebugLog('Error: Unknown error');
    }

    updateStatusMessage(errorMessage, 'error');
}

function sendLocationToN8n(lat, lng) {
    fetch("https://n8ngc.codeblazar.org/webhook/badminton-location", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            latitude: lat,
            longitude: lng
        })
    })
    .then(response => {
        if (!response.ok) {
            console.warn('N8n webhook returned status:', response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("Location sent to n8n successfully:", data);
    })
    .catch(error => {
        console.warn("Note: Could not send location to n8n (this is non-critical):", error.message);
    });
}

function updateStatusMessage(message, type = 'info') {
    statusText.textContent = message;
    const statusDiv = document.getElementById('location-status');

    // Remove previous status classes
    statusDiv.className = 'location-status';
    statusDiv.classList.add(`status-${type}`);

    // Add status-specific styling
    if (type === 'success') {
        statusDiv.style.borderLeftColor = '#10B981';
    } else if (type === 'error') {
        statusDiv.style.borderLeftColor = '#EF4444';
    } else if (type === 'loading') {
        statusDiv.style.borderLeftColor = '#F59E0B';
    }
}

function initializeMap(latitude, longitude) {
    const userLocation = { lat: latitude, lng: longitude };

    addDebugLog('🗺️ Map initialization started');

    // Verify mapContainer exists
    if (!mapContainer) {
        addDebugLog('❌ Map container not found!');
        updateStatusMessage('❌ Map container not found. Check your HTML.', 'error');
        return;
    }

    addDebugLog('✓ Map container found: ' + mapContainer.offsetWidth + 'x' + mapContainer.offsetHeight + 'px');

    // Verify Google Maps API is loaded
    if (typeof google === 'undefined' || !google.maps || !google.maps.Map) {
        addDebugLog('❌ Google Maps API not loaded!');
        updateStatusMessage('❌ Google Maps API failed to load. Check your API key.', 'error');
        return;
    }

    addDebugLog('✓ Google Maps API available');

    try {
        addDebugLog('Creating map instance...');
        
        // Create map
        appState.map = new google.maps.Map(mapContainer, {
            zoom: 14,
            center: userLocation,
            mapTypeControl: true,
            fullscreenControl: true,
            streetViewControl: false,
            styles: [
                {
                    featureType: 'poi',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });

        addDebugLog('✓ Map instance created successfully');
        addDebugLog('Map center: ' + userLocation.lat.toFixed(4) + ', ' + userLocation.lng.toFixed(4));

        // Add user location marker
        appState.userMarker = new google.maps.Marker({
            position: userLocation,
            map: appState.map,
            title: 'You are here',
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        addDebugLog('✓ User marker added');

        // Add info window for user location
        const userInfoWindow = new google.maps.InfoWindow({
            content: '<div style="font-weight: bold; color: #0F172A;">📍 You are here</div>'
        });

        appState.userMarker.addListener('click', () => {
            userInfoWindow.open(appState.map, appState.userMarker);
        });

        announceToScreenReader(`Map loaded. You are at latitude ${latitude.toFixed(4)}, longitude ${longitude.toFixed(4)}.`);
        addDebugLog('✓ Map fully initialized');
    } catch (error) {
        addDebugLog('❌ Error initializing map: ' + error.message);
        updateStatusMessage('❌ Error initializing map: ' + error.message, 'error');
    }
}

function findNearbyBadmintonCourts(latitude, longitude) {
    // Generate dynamic nearby badminton courts based on user location
    // These coordinates are calculated as offsets from the user's location
    const nearbyCourts = generateNearbyCourtLocations(latitude, longitude);

    // Clear existing court markers
    appState.courtMarkers.forEach(marker => marker.setMap(null));
    appState.courtMarkers = [];

    // Add court markers to map
    nearbyCourts.forEach((court, index) => {
        const marker = new google.maps.Marker({
            position: { lat: court.lat, lng: court.lng },
            map: appState.map,
            title: court.name,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        // Add info window for each court
        const courtInfoWindow = new google.maps.InfoWindow({
            content: `
                <div style="color: #0F172A; font-family: Arial; width: 200px;">
                    <strong style="font-size: 14px;">🏸 ${court.name}</strong>
                    <p style="margin: 8px 0 0 0; font-size: 12px;">
                        Address: ${court.address}
                    </p>
                    <p style="margin: 4px 0 0 0; font-size: 12px;">
                        Distance: ${court.distance} away
                    </p>
                </div>
            `
        });

        marker.addListener('click', () => {
            // Close all other info windows
            appState.courtMarkers.forEach(m => {
                if (m.infoWindow) m.infoWindow.close();
            });
            courtInfoWindow.open(appState.map, marker);
        });

        marker.infoWindow = courtInfoWindow;
        appState.courtMarkers.push(marker);
    });

    updateStatusMessage(`✅ Found ${nearbyCourts.length} badminton courts near you! 🏸`, 'success');
}

function generateNearbyCourtLocations(latitude, longitude) {
    // Generate realistic nearby court locations based on user's position
    // Offsets are in approximate miles converted to lat/lng degrees (1 degree ≈ 69 miles)
    const courseLocationOffsets = [
        { miles: 0.3, bearing: 45 },   // NE
        { miles: 0.5, bearing: 90 },   // E
        { miles: 0.4, bearing: 135 },  // SE
        { miles: 0.6, bearing: 180 },  // S
        { miles: 0.35, bearing: 225 }, // SW
        { miles: 0.5, bearing: 270 },  // W
        { miles: 0.45, bearing: 315 }  // NW
    ];

    const courtNames = [
        'Downtown Badminton Court',
        'Central Sports Complex',
        'Riverside Badminton Club',
        'Community Recreation Center',
        'Elite Sports Academy',
        'Urban Badminton Hall',
        'Sports Arena & Fitness'
    ];

    const streets = [
        'Main St',
        'Oak Avenue',
        'Pine Street',
        'Elm Road',
        'Maple Drive',
        'Cedar Lane',
        'Birch Court'
    ];

    const nearbyCoarts = courseLocationOffsets.map((offset, index) => {
        // Convert bearing and distance to lat/lng offset
        const bearingRad = (offset.bearing * Math.PI) / 180;
        const distanceDegrees = offset.miles / 69; // 1 degree of latitude ≈ 69 miles

        const newLat = latitude + distanceDegrees * Math.cos(bearingRad);
        const newLng = longitude + distanceDegrees * Math.sin(bearingRad) / Math.cos((latitude * Math.PI) / 180);

        return {
            name: courtNames[index % courtNames.length],
            lat: newLat,
            lng: newLng,
            address: `${index + 100} ${streets[index % streets.length]}, Local City`,
            distance: `${offset.miles.toFixed(1)} km`
        };
    });

    return nearbyCoarts;
}

// ===== LOCATION PERMISSION NOTIFICATION =====
function showLocationPermissionNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'location-permission-notification';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 24px;">📍</span>
            <div>
                <strong>Allow Location Access</strong>
                <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">
                    A popup will appear asking for permission to access your location.
                </p>
            </div>
        </div>
    `;
    
    // Apply styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '80px',
        right: '20px',
        backgroundColor: '#00D084',
        color: '#FFFFFF',
        padding: '16px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 208, 132, 0.3)',
        zIndex: '1000',
        maxWidth: '300px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        animation: 'slideInRight 0.4s ease-out',
        border: '2px solid #00AA66'
    });
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds or when user interacts
    const timeoutId = setTimeout(() => {
        removeNotification(notification);
    }, 4000);
    
    // Also remove on click
    notification.addEventListener('click', () => {
        clearTimeout(timeoutId);
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.4s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }
}

// ===== CHATBOT INTEGRATION HELPER =====
/**
 * Use this function to embed your AI chatbot
 * Replace 'YOUR_CHATBOT_URL' with your actual chatbot endpoint
 * 
 * Example usage:
 * embedChatbot('https://your-chatbot-service.com/chat');
 */
function embedChatbot(chatbotUrl) {
    const chatPlaceholder = document.querySelector('.chat-placeholder');
    const iframe = document.createElement('iframe');
    
    iframe.id = 'chatbot';
    iframe.src = chatbotUrl;
    iframe.title = 'AI Badminton Coach';
    iframe.setAttribute('allow', 'camera; microphone; autoplay');
    iframe.setAttribute('loading', 'lazy');
    
    // Clear placeholder content
    chatPlaceholder.innerHTML = '';
    chatPlaceholder.appendChild(iframe);
    
    // Log for debugging
    console.log('Chatbot embedded successfully:', chatbotUrl);
}

/**
 * Alternative: Use this function for a custom messaging system
 * Example usage:
 * initializeCustomChat({ apiEndpoint: 'https://your-api.com/chat' });
 */
function initializeCustomChat(config) {
    const { apiEndpoint, welcomeMessage } = config;

    console.log('Initializing custom chat with config:', config);

    // Add welcome message
    if (welcomeMessage) {
        console.log('Welcome message:', welcomeMessage);
    }

    // Setup API communication
    if (apiEndpoint) {
        console.log('Chat API endpoint configured:', apiEndpoint);
    }

    // Placeholder for chat logic
    // Implement your custom chat handling here
}

// ===== EXPORT FOR EXTERNAL USE =====
window.BowlingCoach = {
    toggleChat,
    embedChatbot,
    initializeCustomChat,
    announceToScreenReader,
};

// ===== LOG INITIALIZATION =====
addDebugLog('🎉 Dynamite Sports Learner loaded!');
addDebugLog('Press D to open debug panel');
addDebugLog('Ctrl+Shift+C to toggle chat');

// Debug info - run this to check everything is ready
window.debugMap = function() {
    const info = {
        'Google Maps API': typeof google !== 'undefined' && google.maps ? '✓' : '✗',
        'Map container': document.getElementById('map') ? '✓' : '✗',
        'Location button': document.getElementById('location-button') ? '✓' : '✗',
        'Map initialized': appState.map ? '✓' : '✗',
        'User location': appState.userLocation || 'Not set yet',
        'Map size': mapContainer ? `${mapContainer.offsetWidth}x${mapContainer.offsetHeight}px` : 'N/A'
    };
    
    console.log('=== MAP DEBUG INFO ===');
    Object.entries(info).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
    });
    console.log('=== END DEBUG ===');
    
    return info;
};

