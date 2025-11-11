// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initCards();
    initPopup();
    loadContent();
});

// Initialize navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to current link
            this.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));
            
            // Show selected section
            const targetSection = this.getAttribute('data-section');
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

// Initialize cards
function initCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const userName = this.getAttribute('data-user');
            const section = this.closest('.section');
            const sectionId = section.id;
            
            // Display user content in the selected section
            displayUserContent(userName, sectionId);
        });
    });
}

// Initialize popup
function initPopup() {
    const popup = document.getElementById('popup');
    const closeBtn = document.querySelector('.close-btn');
    
    // Close popup
    closeBtn.addEventListener('click', closePopup);
    
    // Close popup when clicking outside content
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            closePopup();
        }
    });
    
    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePopup();
        }
    });
}

// Load content from database
async function loadContent() {
    try {
        console.log('Loading content from Firebase...');
        const querySnapshot = await getDocs(collection(db, 'content'));
        
        // Store content in global variable for later use
        window.contentData = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            window.contentData.push({ 
                id: doc.id, 
                ...data,
                // Handle dates
                timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
            });
        });
        
        console.log('Content loaded successfully:', window.contentData.length, 'items');
        
    } catch (error) {
        console.error('Error loading content:', error);
        window.contentData = [];
    }
}

// Display user content in popup
async function displayUserContent(userName, sectionId) {
    // Load content first if not loaded
    if (!window.contentData) {
        await loadContent();
    }
    
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const contentList = document.getElementById('popup-content-list');
    
    // Set popup title
    popupTitle.textContent = `${userName}'s ${getSectionDisplayName(sectionId)}`;
    
    // Display loading message
    contentList.innerHTML = '<div class="loading-message">Loading content...</div>';
    
    // Show popup
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Display actual content
    displayContent(userName, sectionId, contentList);
}

// Display actual content
function displayContent(userName, sectionId, contentList) {
    if (!window.contentData || window.contentData.length === 0) {
        contentList.innerHTML = '<div class="no-content-message">No content available at the moment.</div>';
        return;
    }
    
    // Filter content by user and section
    const userContent = window.contentData.filter(item => 
        item.user === userName && item.section === sectionId
    );
    
    if (userContent.length === 0) {
        contentList.innerHTML = `
            <div class="no-content-message">
                <p>No content available for ${userName} in this section yet.</p>
                <p style="margin-top: 10px; font-size: 0.9rem; color: #888;">
                    Add content from the "Manage Content" page!
                </p>
            </div>
        `;
        return;
    }
    
    // Sort content by date (newest first)
    userContent.sort((a, b) => b.timestamp - a.timestamp);
    
    // Display content
    contentList.innerHTML = userContent.map(item => `
        <div class="content-item">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <small>Added on: ${formatDate(item.timestamp)}</small>
        </div>
    `).join('');
}

// Close popup
function closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get section display name
function getSectionDisplayName(sectionId) {
    const sections = {
        'movies': 'Movies',
        'games': 'Games',
        'programs': 'Programs'
    };
    return sections[sectionId] || sectionId;
}

// Add manual refresh button
function addRefreshButton() {
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '🔄 Refresh Content';
    refreshBtn.className = 'refresh-btn';
    refreshBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(255,255,255,0.1);
        color: white;
        border: none;
        padding: 12px 18px;
        border-radius: 25px;
        cursor: pointer;
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        transition: all 0.3s ease;
    `;
    
    refreshBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(255,255,255,0.2)';
        this.style.transform = 'translateY(-2px)';
    });
    
    refreshBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255,255,255,0.1)';
        this.style.transform = 'translateY(0)';
    });
    
    refreshBtn.addEventListener('click', async () => {
        refreshBtn.textContent = '🔄 Refreshing...';
        refreshBtn.disabled = true;
        
        await loadContent();
        
        refreshBtn.textContent = '🔄 Refresh Content';
        refreshBtn.disabled = false;
        
        // Show refresh confirmation
        showTempMessage('Content refreshed successfully!');
    });
    
    document.body.appendChild(refreshBtn);
}

// Show temporary message
function showTempMessage(message) {
    const tempMsg = document.createElement('div');
    tempMsg.textContent = message;
    tempMsg.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 20px;
        background: rgba(76, 175, 80, 0.9);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 1000;
        font-size: 14px;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(tempMsg);
    
    setTimeout(() => {
        tempMsg.remove();
    }, 2000);
}

// Add refresh button on load
document.addEventListener('DOMContentLoaded', addRefreshButton);

// جعل الدوال متاحة عالمياً
window.loadContent = loadContent;
window.displayUserContent = displayUserContent;