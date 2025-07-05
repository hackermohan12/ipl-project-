// Global variables
const RAPIDAPI_KEY = '339b964454mshaa4ef3a00388890p177e47jsn8d7b91a3cff0'; // Your RapidAPI Key
const RAPIDAPI_HOST = 'cricbuzz-cricket.p.rapidapi.com';
const LIVE_STREAM_URL = 'https://yosintv2.github.io/tv/alpha?mid=england-vs-india';
let iplSchedule = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Set up mobile menu toggle
    setupMobileMenu();
    
    // Set up search functionality
    setupSearch();
    
    // Set up login modal
    setupLoginModal();
    
    // Set up blog filtering
    setupBlogFiltering();
    
    // Fetch live scores
    fetchLiveScores();
    
    // Generate and display IPL schedule
    generateIPLSchedule();
    
    // Set up modal functionality
    setupModals();
});

// Set up mobile menu toggle
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
        
        // Handle dropdown toggles on mobile
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const parent = toggle.parentElement;
                    parent.classList.toggle('active');
                }
            });
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('nav a:not(.dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    }
}

// Set up search functionality
function setupSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchContainer = document.querySelector('.search-container');
    const searchClose = document.querySelector('.search-close');
    const searchForm = document.querySelector('.search-form');
    
    if (searchToggle && searchContainer && searchClose) {
        searchToggle.addEventListener('click', () => {
            searchContainer.classList.toggle('active');
            if (searchContainer.classList.contains('active')) {
                searchContainer.querySelector('input').focus();
            }
        });
        
        searchClose.addEventListener('click', () => {
            searchContainer.classList.remove('active');
        });
        
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = searchForm.querySelector('input').value.trim();
            if (searchTerm) {
                alert(`Searching for: ${searchTerm}`);
                // Implement actual search functionality here
                searchForm.reset();
                searchContainer.classList.remove('active');
            }
        });
    }
}

// Set up login modal
function setupLoginModal() {
    const loginBtn = document.querySelector('.login-btn');
    const loginModal = document.getElementById('loginModal');
    const loginClose = document.querySelector('.login-close');
    const loginTabs = document.querySelectorAll('.login-tab');
    const loginForms = document.querySelectorAll('.login-form-container');
    
    if (loginBtn && loginModal && loginClose) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
        });
        
        loginClose.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
        
        window.addEventListener('click', (event) => {
            if (event.target === loginModal) {
                loginModal.style.display = 'none';
            }
        });
        
        // Handle tab switching
        loginTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                
                // Update active tab
                loginTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding form
                loginForms.forEach(form => form.classList.remove('active'));
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
        
        // Handle form submissions
        const loginForm = document.querySelector('.login-form');
        const registerForm = document.querySelector('.register-form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                
                // Implement actual login functionality here
                console.log('Login attempt:', { email, password });
                alert('Login functionality would be implemented here.');
                loginModal.style.display = 'none';
            });
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('register-name').value;
                const email = document.getElementById('register-email').value;
                const password = document.getElementById('register-password').value;
                const confirmPassword = document.getElementById('register-confirm-password').value;
                
                if (password !== confirmPassword) {
                    alert('Passwords do not match!');
                    return;
                }
                
                // Implement actual registration functionality here
                console.log('Registration attempt:', { name, email, password });
                alert('Registration functionality would be implemented here.');
                loginModal.style.display = 'none';
            });
        }
    }
}

// Set up blog filtering
function setupBlogFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (filterButtons.length && blogCards.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter blog cards
                blogCards.forEach(card => {
                    const categories = card.getAttribute('data-category').split(' ');
                    
                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Handle pagination (for demo purposes)
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    
    if (paginationButtons.length) {
        paginationButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!button.classList.contains('next')) {
                    paginationButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                }
            });
        });
    }
}

// Fetch live cricket scores using Cricbuzz API
async function fetchLiveScores() {
    const scoreCardsContainer = document.getElementById('scoreCards');
    scoreCardsContainer.innerHTML = '<div class="loading">Loading live scores...</div>';
    
    try {
        const response = await fetch('https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live', {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        });

        const data = await response.json();
        
        // Clear loading message
        scoreCardsContainer.innerHTML = '';
        
        // Check if there are live matches
        if (data.typeMatches && data.typeMatches.length > 0) {
            let matchesFound = false;
            
            // Loop through match types (international, league, etc.)
            data.typeMatches.forEach(matchType => {
                if (matchType.seriesMatches && matchType.seriesMatches.length > 0) {
                    // Loop through series
                    matchType.seriesMatches.forEach(seriesMatch => {
                        if (seriesMatch.seriesAdWrapper && seriesMatch.seriesAdWrapper.matches) {
                            // Loop through matches in the series
                            seriesMatch.seriesAdWrapper.matches.forEach(match => {
                                if (match.matchInfo) {
                                    matchesFound = true;
                                    const matchInfo = match.matchInfo;
                                    const scoreCard = document.createElement('div');
                                    scoreCard.className = 'score-card';
                                    
                                    // Get team names
                                    const team1Name = matchInfo.team1.teamName || matchInfo.team1.teamSName;
                                    const team2Name = matchInfo.team2.teamName || matchInfo.team2.teamSName;
                                    
                                    // Get scores if available
                                    let team1Score = 'Yet to bat';
                                    let team1Overs = '';
                                    let team2Score = 'Yet to bat';
                                    let team2Overs = '';
                                    
                                    if (match.matchScore) {
                                        if (match.matchScore.team1Score) {
                                            const t1Score = match.matchScore.team1Score;
                                            team1Score = `${t1Score.inngs1 ? t1Score.inngs1.runs + '/' + t1Score.inngs1.wickets : ''}`;
                                            team1Overs = `${t1Score.inngs1 ? t1Score.inngs1.overs : ''}`;
                                        }
                                        
                                        if (match.matchScore.team2Score) {
                                            const t2Score = match.matchScore.team2Score;
                                            team2Score = `${t2Score.inngs1 ? t2Score.inngs1.runs + '/' + t2Score.inngs1.wickets : ''}`;
                                            team2Overs = `${t2Score.inngs1 ? t2Score.inngs1.overs : ''}`;
                                        }
                                    }
                                    
                                    // Get match status
                                    const matchStatus = matchInfo.status || 'Live';
                                    
                                    scoreCard.innerHTML = `
                                        <div class="score-card-header">
                                            <h3>${team1Name} vs ${team2Name}</h3>
                                            <p>${matchInfo.venueInfo ? matchInfo.venueInfo.ground : 'Venue not available'}</p>
                                        </div>
                                        <div class="score-card-body">
                                            <div class="team">
                                                <span class="team-name">${team1Name}</span>
                                                <span class="team-score">${team1Score} ${team1Overs ? `(${team1Overs})` : ''}</span>
                                            </div>
                                            <div class="team">
                                                <span class="team-name">${team2Name}</span>
                                                <span class="team-score">${team2Score} ${team2Overs ? `(${team2Overs})` : ''}</span>
                                            </div>
                                            <div class="match-status">${matchStatus}</div>
                                            <div style="text-align: center; margin-top: 1rem;">
                                                <button class="watch-btn" onclick="openLiveStream('${team1Name} vs ${team2Name}')">Watch Live</button>
                                            </div>
                                        </div>
                                    `;
                                    scoreCardsContainer.appendChild(scoreCard);
                                }
                            });
                        }
                    });
                }
            });
            
            if (!matchesFound) {
                scoreCardsContainer.innerHTML = `
                    <div class="no-matches">
                        <p>No live matches at the moment. Check back later!</p>
                    </div>
                `;
            }
        } else {
            scoreCardsContainer.innerHTML = `
                <div class="no-matches">
                    <p>No live matches at the moment. Check back later!</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching live scores:', error);
        scoreCardsContainer.innerHTML = `
            <div class="error">
                <p>Failed to load live scores. Please try again later.</p>
            </div>
        `;
    }
}

// Fetch match details using Cricbuzz API
async function fetchMatchDetails(matchId) {
    try {
        const response = await fetch(`https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        });

        return await response.json();
    } catch (error) {
        console.error('Error fetching match details:', error);
        return null;
    }
}

// Generate IPL schedule
function generateIPLSchedule() {
    // Generate IPL 2025 schedule data with Cricbuzz match IDs
    iplSchedule = [
        {
            id: 1,
            date: "March 22, 2025",
            teams: "Chennai Super Kings vs Mumbai Indians",
            venue: "M.A. Chidambaram Stadium, Chennai",
            time: "7:30 PM",
            cricbuzzId: "66242"
        },
        {
            id: 2,
            date: "March 23, 2025",
            teams: "Royal Challengers Bangalore vs Punjab Kings",
            venue: "M. Chinnaswamy Stadium, Bangalore",
            time: "3:30 PM",
            cricbuzzId: "66243"
        },
        {
            id: 3,
            date: "March 23, 2025",
            teams: "Kolkata Knight Riders vs Sunrisers Hyderabad",
            venue: "Eden Gardens, Kolkata",
            time: "7:30 PM",
            cricbuzzId: "66244"
        },
        {
            id: 4,
            date: "March 24, 2025",
            teams: "Rajasthan Royals vs Delhi Capitals",
            venue: "Sawai Mansingh Stadium, Jaipur",
            time: "7:30 PM",
            cricbuzzId: "66245"
        },
        {
            id: 5,
            date: "March 25, 2025",
            teams: "Gujarat Titans vs Lucknow Super Giants",
            venue: "Narendra Modi Stadium, Ahmedabad",
            time: "7:30 PM",
            cricbuzzId: "66246"
        },
        {
            id: 6,
            date: "March 26, 2025",
            teams: "Mumbai Indians vs Royal Challengers Bangalore",
            venue: "Wankhede Stadium, Mumbai",
            time: "7:30 PM",
            cricbuzzId: "66247"
        },
        {
            id: 7,
            date: "March 27, 2025",
            teams: "Chennai Super Kings vs Kolkata Knight Riders",
            venue: "M.A. Chidambaram Stadium, Chennai",
            time: "7:30 PM",
            cricbuzzId: "66248"
        },
        {
            id: 8,
            date: "March 28, 2025",
            teams: "Punjab Kings vs Delhi Capitals",
            venue: "IS Bindra Stadium, Mohali",
            time: "7:30 PM",
            cricbuzzId: "66249"
        },
        {
            id: 9,
            date: "March 29, 2025",
            teams: "Sunrisers Hyderabad vs Gujarat Titans",
            venue: "Rajiv Gandhi International Stadium, Hyderabad",
            time: "3:30 PM",
            cricbuzzId: "66250"
        },
        {
            id: 10,
            date: "March 29, 2025",
            teams: "Rajasthan Royals vs Lucknow Super Giants",
            venue: "Sawai Mansingh Stadium, Jaipur",
            time: "7:30 PM",
            cricbuzzId: "66251"
        },
        {
            id: 11,
            date: "March 30, 2025",
            teams: "Mumbai Indians vs Chennai Super Kings",
            venue: "Wankhede Stadium, Mumbai",
            time: "3:30 PM",
            cricbuzzId: "66252"
        },
        {
            id: 12,
            date: "March 30, 2025",
            teams: "Royal Challengers Bangalore vs Kolkata Knight Riders",
            venue: "M. Chinnaswamy Stadium, Bangalore",
            time: "7:30 PM",
            cricbuzzId: "66253"
        },
        {
            id: 13,
            date: "March 31, 2025",
            teams: "Delhi Capitals vs Sunrisers Hyderabad",
            venue: "Arun Jaitley Stadium, Delhi",
            time: "7:30 PM",
            cricbuzzId: "66254"
        },
        {
            id: 14,
            date: "April 1, 2025",
            teams: "Punjab Kings vs Gujarat Titans",
            venue: "IS Bindra Stadium, Mohali",
            time: "7:30 PM",
            cricbuzzId: "66255"
        },
        {
            id: 15,
            date: "April 2, 2025",
            teams: "Lucknow Super Giants vs Chennai Super Kings",
            venue: "Ekana Cricket Stadium, Lucknow",
            time: "7:30 PM",
            cricbuzzId: "66256"
        },
        {
            id: 16,
            date: "April 3, 2025",
            teams: "Rajasthan Royals vs Mumbai Indians",
            venue: "Sawai Mansingh Stadium, Jaipur",
            time: "7:30 PM",
            cricbuzzId: "66257"
        },
        {
            id: 17,
            date: "April 4, 2025",
            teams: "Kolkata Knight Riders vs Delhi Capitals",
            venue: "Eden Gardens, Kolkata",
            time: "7:30 PM",
            cricbuzzId: "66258"
        },
        {
            id: 18,
            date: "April 5, 2025",
            teams: "Royal Challengers Bangalore vs Sunrisers Hyderabad",
            venue: "M. Chinnaswamy Stadium, Bangalore",
            time: "3:30 PM",
            cricbuzzId: "66259"
        },
        {
            id: 19,
            date: "April 5, 2025",
            teams: "Gujarat Titans vs Chennai Super Kings",
            venue: "Narendra Modi Stadium, Ahmedabad",
            time: "7:30 PM",
            cricbuzzId: "66260"
        },
        {
            id: 20,
            date: "April 6, 2025",
            teams: "Mumbai Indians vs Punjab Kings",
            venue: "Wankhede Stadium, Mumbai",
            time: "3:30 PM",
            cricbuzzId: "66261"
        },
        // Add more matches to complete the IPL schedule
        {
            id: 21,
            date: "April 6, 2025",
            teams: "Lucknow Super Giants vs Kolkata Knight Riders",
            venue: "Ekana Cricket Stadium, Lucknow",
            time: "7:30 PM",
            cricbuzzId: "66262"
        },
        {
            id: 22,
            date: "April 7, 2025",
            teams: "Rajasthan Royals vs Royal Challengers Bangalore",
            venue: "Sawai Mansingh Stadium, Jaipur",
            time: "7:30 PM",
            cricbuzzId: "66263"
        },
        {
            id: 23,
            date: "April 8, 2025",
            teams: "Delhi Capitals vs Gujarat Titans",
            venue: "Arun Jaitley Stadium, Delhi",
            time: "7:30 PM",
            cricbuzzId: "66264"
        },
        {
            id: 24,
            date: "April 9, 2025",
            teams: "Sunrisers Hyderabad vs Chennai Super Kings",
            venue: "Rajiv Gandhi International Stadium, Hyderabad",
            time: "7:30 PM",
            cricbuzzId: "66265"
        },
        {
            id: 25,
            date: "April 10, 2025",
            teams: "Punjab Kings vs Lucknow Super Giants",
            venue: "IS Bindra Stadium, Mohali",
            time: "7:30 PM",
            cricbuzzId: "66266"
        },
        {
            id: 26,
            date: "April 11, 2025",
            teams: "Kolkata Knight Riders vs Mumbai Indians",
            venue: "Eden Gardens, Kolkata",
            time: "7:30 PM",
            cricbuzzId: "66267"
        },
        {
            id: 27,
            date: "April 12, 2025",
            teams: "Royal Challengers Bangalore vs Delhi Capitals",
            venue: "M. Chinnaswamy Stadium, Bangalore",
            time: "3:30 PM",
            cricbuzzId: "66268"
        },
        {
            id: 28,
            date: "April 12, 2025",
            teams: "Rajasthan Royals vs Gujarat Titans",
            venue: "Sawai Mansingh Stadium, Jaipur",
            time: "7:30 PM",
            cricbuzzId: "66269"
        },
        {
            id: 29,
            date: "April 13, 2025",
            teams: "Chennai Super Kings vs Punjab Kings",
            venue: "M.A. Chidambaram Stadium, Chennai",
            time: "3:30 PM",
            cricbuzzId: "66270"
        },
        {
            id: 30,
            date: "April 13, 2025",
            teams: "Sunrisers Hyderabad vs Lucknow Super Giants",
            venue: "Rajiv Gandhi International Stadium, Hyderabad",
            time: "7:30 PM",
            cricbuzzId: "66271"
        },
        {
            id: 31,
            date: "April 14, 2025",
            teams: "Mumbai Indians vs Delhi Capitals",
            venue: "Wankhede Stadium, Mumbai",
            time: "7:30 PM",
            cricbuzzId: "66272"
        },
        {
            id: 32,
            date: "April 15, 2025",
            teams: "Kolkata Knight Riders vs Gujarat Titans",
            venue: "Eden Gardens, Kolkata",
            time: "7:30 PM",
            cricbuzzId: "66273"
        },
        {
            id: 33,
            date: "April 16, 2025",
            teams: "Royal Challengers Bangalore vs Chennai Super Kings",
            venue: "M. Chinnaswamy Stadium, Bangalore",
            time: "7:30 PM",
            cricbuzzId: "66274"
        },
        {
            id: 34,
            date: "April 17, 2025",
            teams: "Punjab Kings vs Rajasthan Royals",
            venue: "IS Bindra Stadium, Mohali",
            time: "7:30 PM",
            cricbuzzId: "66275"
        },
        {
            id: 35,
            date: "April 18, 2025",
            teams: "Lucknow Super Giants vs Mumbai Indians",
            venue: "Ekana Cricket Stadium, Lucknow",
            time: "7:30 PM",
            cricbuzzId: "66276"
        },
        {
            id: 36,
            date: "April 19, 2025",
            teams: "Delhi Capitals vs Chennai Super Kings",
            venue: "Arun Jaitley Stadium, Delhi",
            time: "3:30 PM",
            cricbuzzId: "66277"
        },
        {
            id: 37,
            date: "April 19, 2025",
            teams: "Sunrisers Hyderabad vs Kolkata Knight Riders",
            venue: "Rajiv Gandhi International Stadium, Hyderabad",
            time: "7:30 PM",
            cricbuzzId: "66278"
        },
        {
            id: 38,
            date: "April 20, 2025",
            teams: "Gujarat Titans vs Royal Challengers Bangalore",
            venue: "Narendra Modi Stadium, Ahmedabad",
            time: "3:30 PM",
            cricbuzzId: "66279"
        },
        {
            id: 39,
            date: "April 20, 2025",
            teams: "Rajasthan Royals vs Punjab Kings",
            venue: "Sawai Mansingh Stadium, Jaipur",
            time: "7:30 PM",
            cricbuzzId: "66280"
        },
        {
            id: 40,
            date: "April 21, 2025",
            teams: "Mumbai Indians vs Sunrisers Hyderabad",
            venue: "Wankhede Stadium, Mumbai",
            time: "7:30 PM",
            cricbuzzId: "66281"
        },
        {
            id: 41,
            date: "April 22, 2025",
            teams: "Delhi Capitals vs Lucknow Super Giants",
            venue: "Arun Jaitley Stadium, Delhi",
            time: "7:30 PM",
            cricbuzzId: "66282"
        },
        {
            id: 42,
            date: "April 23, 2025",
            teams: "Kolkata Knight Riders vs Punjab Kings",
            venue: "Eden Gardens, Kolkata",
            time: "7:30 PM",
            cricbuzzId: "66283"
        },
        {
            id: 43,
            date: "April 24, 2025",
            teams: "Royal Challengers Bangalore vs Gujarat Titans",
            venue: "M. Chinnaswamy Stadium, Bangalore",
            time: "7:30 PM",
            cricbuzzId: "66284"
        },
        {
            id: 44,
            date: "April 25, 2025",
            teams: "Chennai Super Kings vs Rajasthan Royals",
            venue: "M.A. Chidambaram Stadium, Chennai",
            time: "7:30 PM",
            cricbuzzId: "66285"
        },
        {
            id: 45,
            date: "April 26, 2025",
            teams: "Lucknow Super Giants vs Delhi Capitals",
            venue: "Ekana Cricket Stadium, Lucknow",
            time: "3:30 PM",
            cricbuzzId: "66286"
        },
        {
            id: 46,
            date: "April 26, 2025",
            teams: "Sunrisers Hyderabad vs Punjab Kings",
            venue: "Rajiv Gandhi International Stadium, Hyderabad",
            time: "7:30 PM",
            cricbuzzId: "66287"
        },
        {
            id: 47,
            date: "April 27, 2025",
            teams: "Mumbai Indians vs Gujarat Titans",
            venue: "Wankhede Stadium, Mumbai",
            time: "3:30 PM",
            cricbuzzId: "66288"
        },
        {
            id: 48,
            date: "April 27, 2025",
            teams: "Kolkata Knight Riders vs Rajasthan Royals",
            venue: "Eden Gardens, Kolkata",
            time: "7:30 PM",
            cricbuzzId: "66289"
        },
        {
            id: 49,
            date: "April 28, 2025",
            teams: "Royal Challengers Bangalore vs Lucknow Super Giants",
            venue: "M. Chinnaswamy Stadium, Bangalore",
            time: "7:30 PM",
            cricbuzzId: "66290"
        },
        {
            id: 50,
            date: "April 29, 2025",
            teams: "Chennai Super Kings vs Delhi Capitals",
            venue: "M.A. Chidambaram Stadium, Chennai",
            time: "7:30 PM",
            cricbuzzId: "66291"
        },
        {
            id: 51,
            date: "April 30, 2025",
            teams: "Gujarat Titans vs Sunrisers Hyderabad",
            venue: "Narendra Modi Stadium, Ahmedabad",
            time: "7:30 PM",
            cricbuzzId: "66292"
        },
        {
            id: 52,
            date: "May 1, 2025",
            teams: "Punjab Kings vs Mumbai Indians",
            venue: "IS Bindra Stadium, Mohali",
            time: "7:30 PM",
            cricbuzzId: "66293"
        },
        {
            id: 53,
            date: "May 2, 2025",
            teams: "Rajasthan Royals vs Sunrisers Hyderabad",
            venue: "Sawai Mansingh Stadium, Jaipur",
            time: "7:30 PM",
            cricbuzzId: "66294"
        },
        {
            id: 54,
            date: "May 3, 2025",
            teams: "Delhi Capitals vs Kolkata Knight Riders",
            venue: "Arun Jaitley Stadium, Delhi",
            time: "3:30 PM",
            cricbuzzId: "66295"
        },
        {
            id: 55,
            date: "May 3, 2025",
            teams: "Lucknow Super Giants vs Gujarat Titans",
            venue: "Ekana Cricket Stadium, Lucknow",
            time: "7:30 PM",
            cricbuzzId: "66296"
        },
        {
            id: 56,
            date: "May 4, 2025",
            teams: "Chennai Super Kings vs Mumbai Indians",
            venue: "M.A. Chidambaram Stadium, Chennai",
            time: "3:30 PM",
            cricbuzzId: "66297"
        },
        {
            id: 57,
            date: "May 4, 2025",
            teams: "Royal Challengers Bangalore vs Punjab Kings",
            venue: "M. Chinnaswamy Stadium, Bangalore",
            time: "7:30 PM",
            cricbuzzId: "66298"
        },
        {
            id: 58,
            date: "May 5, 2025",
            teams: "Kolkata Knight Riders vs Lucknow Super Giants",
            venue: "Eden Gardens, Kolkata",
            time: "7:30 PM",
            cricbuzzId: "66299"
        },
        {
            id: 59,
            date: "May 6, 2025",
            teams: "Sunrisers Hyderabad vs Rajasthan Royals",
            venue: "Rajiv Gandhi International Stadium, Hyderabad",
            time: "7:30 PM",
            cricbuzzId: "66300"
        },
        {
            id: 60,
            date: "May 7, 2025",
            teams: "Delhi Capitals vs Royal Challengers Bangalore",
            venue: "Arun Jaitley Stadium, Delhi",
            time: "7:30 PM",
            cricbuzzId: "66301"
        },
        {
            id: 61,
            date: "May 8, 2025",
            teams: "Gujarat Titans vs Kolkata Knight Riders",
            venue: "Narendra Modi Stadium, Ahmedabad",
            time: "7:30 PM",
            cricbuzzId: "66302"
        },
        {
            id: 62,
            date: "May 9, 2025",
            teams: "Mumbai Indians vs Rajasthan Royals",
            venue: "Wankhede Stadium, Mumbai",
            time: "7:30 PM",
            cricbuzzId: "66303"
        },
        {
            id: 63,
            date: "May 10, 2025",
            teams: "Punjab Kings vs Chennai Super Kings",
            venue: "IS Bindra Stadium, Mohali",
            time: "3:30 PM",
            cricbuzzId: "66304"
        },
        {
            id: 64,
            date: "May 10, 2025",
            teams: "Lucknow Super Giants vs Sunrisers Hyderabad",
            venue: "Ekana Cricket Stadium, Lucknow",
            time: "7:30 PM",
            cricbuzzId: "66305"
        },
        {
            id: 65,
            date: "May 11, 2025",
            teams: "Royal Challengers Bangalore vs Mumbai Indians",
            venue: "M. Chinnaswamy Stadium, Bangalore",
            time: "3:30 PM",
            cricbuzzId: "66306"
        },
        {
            id: 66,
            date: "May 11, 2025",
            teams: "Delhi Capitals vs Punjab Kings",
            venue: "Arun Jaitley Stadium, Delhi",
            time: "7:30 PM",
            cricbuzzId: "66307"
        },
        {
            id: 67,
            date: "May 12, 2025",
            teams: "Kolkata Knight Riders vs Chennai Super Kings",
            venue: "Eden Gardens, Kolkata",
            time: "7:30 PM",
            cricbuzzId: "66308"
        },
        {
            id: 68,
            date: "May 13, 2025",
            teams: "Rajasthan Royals vs Lucknow Super Giants",
            venue: "Sawai Mansingh Stadium, Jaipur",
            time: "7:30 PM",
            cricbuzzId: "66309"
        },
        {
            id: 69,
            date: "May 14, 2025",
            teams: "Sunrisers Hyderabad vs Royal Challengers Bangalore",
            venue: "Rajiv Gandhi International Stadium, Hyderabad",
            time: "7:30 PM",
            cricbuzzId: "66310"
        },
        {
            id: 70,
            date: "May 15, 2025",
            teams: "Gujarat Titans vs Delhi Capitals",
            venue: "Narendra Modi Stadium, Ahmedabad",
            time: "7:30 PM",
            cricbuzzId: "66311"
        },
        // Playoffs
        {
            id: 71,
            date: "May 18, 2025",
            teams: "TBD vs TBD (Qualifier 1)",
            venue: "M.A. Chidambaram Stadium, Chennai",
            time: "7:30 PM",
            cricbuzzId: "66312"
        },
        {
            id: 72,
            date: "May 19, 2025",
            teams: "TBD vs TBD (Eliminator)",
            venue: "Narendra Modi Stadium, Ahmedabad",
            time: "7:30 PM",
            cricbuzzId: "66313"
        },
        {
            id: 73,
            date: "May 21, 2025",
            teams: "TBD vs TBD (Qualifier 2)",
            venue: "Wankhede Stadium, Mumbai",
            time: "7:30 PM",
            cricbuzzId: "66314"
        },
        {
            id: 74,
            date: "May 24, 2025",
            teams: "TBD vs TBD (Final)",
            venue: "Narendra Modi Stadium, Ahmedabad",
            time: "7:30 PM",
            cricbuzzId: "66315"
        }
    ];
    
    // Display the schedule in the table
    const scheduleBody = document.getElementById('scheduleBody');
    
    iplSchedule.forEach(match => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Match">${match.id}</td>
            <td data-label="Date">${match.date}</td>
            <td data-label="Teams">${match.teams}</td>
            <td data-label="Venue">${match.venue}</td>
            <td data-label="Time">${match.time}</td>
            <td data-label="Details">
                <button class="view-btn" data-match-id="${match.id}">View Details</button>
            </td>
            <td data-label="Live Stream">
                <button class="watch-btn" data-match-id="${match.id}">Watch Live</button>
            </td>
        `;
        scheduleBody.appendChild(row);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', () => {
            const matchId = parseInt(button.getAttribute('data-match-id'));
            showMatchDetails(matchId);
        });
    });
    
    // Add event listeners to watch buttons
    document.querySelectorAll('.watch-btn').forEach(button => {
        button.addEventListener('click', () => {
            const matchId = parseInt(button.getAttribute('data-match-id'));
            const match = iplSchedule.find(m => m.id === matchId);
            if (match) {
                openLiveStream(match.teams);
            }
        });
    });
}

// Show match details in modal
async function showMatchDetails(matchId) {
    const match = iplSchedule.find(m => m.id === matchId);
    if (!match) return;
    
    const modal = document.getElementById('matchModal');
    const modalTitle = document.getElementById('modalTitle');
    const matchFrame = document.getElementById('matchFrame');
    
    modalTitle.textContent = `${match.teams} - ${match.date}`;
    
    // Show loading state
    matchFrame.src = '';
    document.getElementById('modalContent').innerHTML = '<div class="loading">Loading match details...</div>';
    
    modal.style.display = 'block';
    
    // Fetch match details from Cricbuzz API
    if (match.cricbuzzId) {
        fetchMatchDetails(match.cricbuzzId).then(data => {
            if (data) {
                // Set the iframe source to Cricbuzz match page
                matchFrame.src = `https://www.cricbuzz.com/live-cricket-scorecard/${match.cricbuzzId}`;
                document.getElementById('modalContent').innerHTML = '';
                document.getElementById('modalContent').appendChild(matchFrame);
            } else {
                document.getElementById('modalContent').innerHTML = '<p>Failed to load match details. Please try again later.</p>';
            }
        });
    } else {
        matchFrame.src = `https://www.cricbuzz.com/cricket-schedule/upcoming-series/ipl-2025`;
        document.getElementById('modalContent').innerHTML = '';
        document.getElementById('modalContent').appendChild(matchFrame);
    }
}

// Open live stream in modal
function openLiveStream(matchTitle) {
    const modal = document.getElementById('liveStreamModal');
    const modalTitle = document.getElementById('liveStreamTitle');
    const liveStreamFrame = document.getElementById('liveStreamFrame');
    
    modalTitle.textContent = `Live Stream: ${matchTitle}`;
    liveStreamFrame.src = LIVE_STREAM_URL;
    
    modal.style.display = 'block';
}

// Set up modal functionality
function setupModals() {
    // Match details modal
    const matchModal = document.getElementById('matchModal');
    const matchCloseButton = document.querySelector('.close-button');
    
    if (matchCloseButton && matchModal) {
        matchCloseButton.addEventListener('click', () => {
            matchModal.style.display = 'none';
            document.getElementById('matchFrame').src = '';
        });
        
        window.addEventListener('click', (event) => {
            if (event.target === matchModal) {
                matchModal.style.display = 'none';
                document.getElementById('matchFrame').src = '';
            }
        });
    }
    
    // Live stream modal
    const liveStreamModal = document.getElementById('liveStreamModal');
    const liveStreamCloseButton = document.querySelector('.live-stream-close');
    
    if (liveStreamCloseButton && liveStreamModal) {
        liveStreamCloseButton.addEventListener('click', () => {
            liveStreamModal.style.display = 'none';
            document.getElementById('liveStreamFrame').src = '';
        });
        
        window.addEventListener('click', (event) => {
            if (event.target === liveStreamModal) {
                liveStreamModal.style.display = 'none';
                document.getElementById('liveStreamFrame').src = '';
            }
        });
    }
}

// Handle newsletter form submission
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value.trim();
            
            if (email) {
                // Implement actual newsletter subscription functionality here
                alert(`Thank you for subscribing with: ${email}`);
                newsletterForm.reset();
            }
        });
    }
});

// Refresh live scores every 2 minutes
setInterval(fetchLiveScores, 120000);
