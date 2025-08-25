// --- DOM ELEMENTS ---
const playerCountInput = document.getElementById('player-count');
const playerCountDisplay = document.getElementById('player-count-display');
const decreasePlayersBtn = document.getElementById('decrease-players');
const increasePlayersBtn = document.getElementById('increase-players');
const playerInputsContainer = document.getElementById('player-inputs');
const startGameBtn = document.getElementById('start-game-btn');

const screens = {
    setup: document.getElementById('setup-screen'),
    game: document.getElementById('game-screen'),
    passDevice: document.getElementById('pass-device-screen'),
    reveal: document.getElementById('reveal-screen'),
    mainPhase: document.getElementById('main-phase-screen'),
    buffer: document.getElementById('buffer-screen'),
    voteResults: document.getElementById('vote-results-screen'),
    weaselReveal: document.getElementById('weasel-reveal-screen'),
    weaselGuess: document.getElementById('weasel-guess-screen'),
    scoring: document.getElementById('scoring-screen'),
    gameOver: document.getElementById('game-over-screen')
};

const gameInfo = {
    roundCounter: document.getElementById('round-counter'),
    playerScores: document.getElementById('player-scores'),
    passToPlayerName: document.getElementById('pass-to-player-name'),
    showRoleBtn: document.getElementById('show-role-btn'),
    revealRoleTitle: document.getElementById('reveal-role-title'),
    revealInstruction: document.getElementById('reveal-instruction'),
    revealWordGrid: document.getElementById('reveal-word-grid'),
    roleRevealedBtn: document.getElementById('role-revealed-btn'),
    phaseTitle: document.getElementById('phase-title'),
    phaseInstruction: document.getElementById('phase-instruction'),
    actionInputArea: document.getElementById('action-input-area'),
    submitActionBtn: document.getElementById('submit-action-btn'),
    mainWordGrid: document.getElementById('main-word-grid'),
    scoringSummary: document.getElementById('scoring-summary'),
    nextRoundBtn: document.getElementById('next-round-btn'),
    gameOverTitle: document.getElementById('game-over-title'),
    winnerAnnouncement: document.getElementById('winner-announcement'),
    playAgainBtn: document.getElementById('play-again-btn'),
    continueBufferBtn: document.getElementById('continue-buffer-btn'),
    voteResultsContent: document.getElementById('vote-results-content'),
    continueAfterVotesBtn: document.getElementById('continue-after-votes-btn'),
    weaselRevealContent: document.getElementById('weasel-reveal-content'),
    continueToGuessBtn: document.getElementById('continue-to-guess-btn'),
    weaselGuessTitle: document.getElementById('weasel-guess-title'),
    weaselGuessInstruction: document.getElementById('weasel-guess-instruction'),
    weaselGuessGrid: document.getElementById('weasel-guess-grid'),
    submitWeaselGuessBtn: document.getElementById('submit-weasel-guess-btn')
};

// --- GAME STATE ---
let gameState = {};
let timerInterval = null;
let currentTimerSeconds = 0;

const WORD_LISTS = {
    "Famous Landmarks": ["Eiffel Tower", "Statue of Liberty", "Great Wall", "Colosseum", "Taj Mahal", "Machu Picchu", "Pyramids of Giza", "Sydney Opera House", "Big Ben", "Christ the Redeemer", "Acropolis", "Stonehenge", "Mount Rushmore", "Burj Khalifa", "Petra", "Angkor Wat", "St. Basil's Cathedral", "Golden Gate Bridge"],
    "Movie Titles": ["The Godfather", "Pulp Fiction", "Forrest Gump", "The Matrix", "Inception", "Titanic", "Jurassic Park", "Star Wars", "The Avengers", "Jaws", "E.T.", "Back to the Future", "The Lion King", "Finding Nemo", "Toy Story", "Casablanca", "Psycho", "The Wizard of Oz"],
    "Types of Fruit": ["Apple", "Banana", "Orange", "Strawberry", "Grape", "Watermelon", "Pineapple", "Mango", "Peach", "Cherry", "Blueberry", "Raspberry", "Kiwi", "Lemon", "Avocado", "Pomegranate", "Coconut", "Pear"],
    "Animals": ["Lion", "Tiger", "Elephant", "Giraffe", "Zebra", "Kangaroo", "Penguin", "Dolphin", "Shark", "Eagle", "Owl", "Bear", "Wolf", "Fox", "Monkey", "Gorilla", "Hippo", "Crocodile"],
    "Entertainment & Media": ["Film", "Cinema", "Podcast", "Sitcom", "Standup", "Musical", "Trailer", "Binge", "Sequel", "Animated", "Director", "Soundtrack", "Ratings", "Episode", "Premiere", "Documentary", "Studio", "Karaoke"],
    "Nature & Science": ["Volcano", "Coral", "Meteor", "Gravity", "Photosynthesis", "Galaxy", "Fungus", "Tornado", "Magnetism", "Oasis", "Condensation", "Eclipse", "Glacier", "Neuron", "Plateau", "Mangrove", "Chlorophyll", "Fossil"],
    "Sports & Activities": ["Cycling", "Archery", "Skateboard", "Marathon", "Curling", "Gymnastics", "Kayaking", "Yoga", "Climbing", "Darts", "Surfing", "Triathlon", "Boxing", "Pilates", "Fencing", "Baseball", "Soccer", "Cricket"],
    "History & Culture": ["Renaissance", "Dynasty", "Monarch", "Colosseum", "Architecture", "Pharaoh", "Treaty", "Revolution", "Folklore", "Mythology", "Expedition", "Artifact", "Empire", "Constitution", "Siege", "Pilgrimage", "Heritage", "Tradition"],
    "Technology & Modern Life": ["Encryption", "Algorithm", "Blockchain", "Drone", "Smartphone", "Cloud", "App", "Wearable", "Bandwidth", "Router", "WiFi", "Virtual Reality", "Cookie", "Firmware", "Hashtag", "Biometric", "Autopilot", "Nanobot"],
    "Travel & Geography": ["Archipelago", "Peninsula", "Savannah", "Harbor", "Highway", "Canyon", "Desert", "Lagoon", "Capital", "Route", "Tourist", "Cruise", "Backpacking", "Passport", "Itinerary", "Baggage", "Monument", "Border"],
    "Arts & Creative": ["Watercolor", "Sculpture", "Mosaic", "Graffiti", "Collage", "Origami", "Improv", "Chorus", "Sonnet", "Abstract", "Portrait", "Gallery", "Easel", "Stencil", "Ballet", "Opera", "Clay", "Drama"],
    "Actors": ["Leonardo DiCaprio", "Tom Hanks", "Denzel Washington", "Brad Pitt", "Robert Downey Jr.", "Will Smith", "Johnny Depp", "George Clooney", "Matthew McConaughey", "Chris Evans", "Hugh Jackman", "Keanu Reeves", "Ryan Gosling", "Samuel L. Jackson", "Joaquin Phoenix", "Eddie Murphy", "Tom Cruise", "Daniel Day-Lewis"],
    "Actresses": ["Meryl Streep", "Scarlett Johansson", "Natalie Portman", "Julia Roberts", "Angelina Jolie", "Emma Stone", "Jennifer Lawrence", "Sandra Bullock", "Kate Winslet", "Anne Hathaway", "Nicole Kidman", "Charlize Theron", "Reese Witherspoon", "Viola Davis", "Halle Berry", "Michelle Williams", "Emma Watson", "Keira Knightley"],
    "Singers": ["Beyoncé", "Taylor Swift", "Ed Sheeran", "Adele", "Bruno Mars", "Rihanna", "Justin Bieber", "Lady Gaga", "Ariana Grande", "Elton John", "Shawn Mendes", "Billie Eilish", "Drake", "Sam Smith", "Post Malone", "P!nk", "Katy Perry", "John Legend"],
    "Bands": ["The Beatles", "Queen", "Coldplay", "Fleetwood Mac", "Nirvana", "Imagine Dragons", "Metallica", "U2", "Radiohead", "The Rolling Stones", "Red Hot Chili Peppers", "Maroon 5", "Foo Fighters", "Linkin Park", "The Who", "Pink Floyd", "Green Day", "Arctic Monkeys"],
    "Countries": ["United States", "Canada", "Mexico", "Brazil", "United Kingdom", "France", "Germany", "Italy", "Spain", "Japan", "China", "India", "Australia", "Russia", "South Africa", "Egypt", "Argentina", "Sweden"],
    "Cities": ["New York", "London", "Paris", "Tokyo", "Sydney", "Los Angeles", "Rome", "Berlin", "Toronto", "Dubai", "Barcelona", "Mumbai", "Chicago", "Shanghai", "Buenos Aires", "Cape Town", "Moscow", "Amsterdam"],
    "Mythical Creatures": ["Dragon", "Unicorn", "Phoenix", "Mermaid", "Centaur", "Griffin", "Troll", "Fairy", "Goblin", "Kraken", "Cyclops", "Yeti", "Elf", "Werewolf", "Vampire", "Gnome", "Hydra", "Basilisk"],
    "Musical Instruments": ["Piano", "Violin", "Guitar", "Trumpet", "Drums", "Saxophone", "Flute", "Cello", "Clarinet", "Harp", "Trombone", "Accordion", "Banjo", "Oboe", "Mandolin", "Synthesizer", "Tuba", "Xylophone"],
    "Clothing & Fashion": ["T-shirt", "Jeans", "Blazer", "Sneakers", "Scarf", "Fedora", "Dress", "Skirt", "Suit", "Hoodie", "Sandals", "Necklace", "Bracelet", "Sunglasses", "Boots", "Tie", "Gloves", "Jacket"],
    "Occupations": ["Teacher", "Doctor", "Engineer", "Chef", "Pilot", "Artist", "Carpenter", "Farmer", "Lawyer", "Nurse", "Firefighter", "Police Officer", "Scientist", "Musician", "Architect", "Plumber", "Dentist", "Journalist"],
    "Toys & Games": ["Lego", "Yo-yo", "Rubik's Cube", "Teddy Bear", "Jigsaw Puzzle", "Frisbee", "Kite", "Play-Doh", "Action Figure", "Doll", "Marbles", "Hot Wheels", "Etch-a-Sketch", "Slinky", "Chess Set", "Card Deck", "Nerf Gun", "Dominoes"],
    "Food & Drink": ["Pizza", "Burger", "Sushi", "Pasta", "Salad", "Ice Cream", "Chocolate", "Coffee", "Tea", "Juice", "Bread", "Cheese", "Soup", "Steak", "Tacos", "Curry", "Donut", "Pancakes"],
    "Hobbies & Interests": ["Gardening", "Photography", "Cooking", "Reading", "Fishing", "Hiking", "Painting", "Writing", "Knitting", "Birdwatching", "Traveling", "Gaming", "Cycling", "Collecting", "Dancing", "Camping", "DIY Projects", "Music"],
    "Superheroes": ["Superman", "Batman", "Wonder Woman", "Spider-Man", "Iron Man", "Captain America", "Black Panther", "Thor", "Hulk", "Flash", "Green Lantern", "Doctor Strange", "Black Widow", "Hawkeye", "Aquaman", "Cyborg", "Wolverine", "Daredevil"],
    "Fairy Tale Characters": ["Cinderella", "Snow White", "Sleeping Beauty", "Little Red Riding Hood", "Rapunzel", "Hansel", "Gretel", "Peter Pan", "Tinker Bell", "Pinocchio", "Aladdin", "Jasmine", "Prince Charming", "The Beast", "Rumpelstiltskin", "Goldilocks", "Three Little Pigs", "Puss in Boots"],
    "Dessert Types": ["Ice Cream", "Brownie", "Cheesecake", "Cupcake", "Pudding", "Tiramisu", "Donut", "Macaron", "Eclair", "Pavlova", "Sorbet", "Mousse", "Custard", "Cookie", "Apple Pie", "Baklava", "Churros", "Trifle"],"Vehicles": ["Car", "Bus", "Train", "Bicycle", "Motorcycle", "Airplane", "Helicopter", "Boat", "Submarine", "Truck", "Tractor", "Scooter", "Hot Air Balloon", "Spaceship", "Skateboard", "Segway", "Van", "Cable Car"],
    "Emotions": ["Happy", "Sad", "Angry", "Excited", "Scared", "Confused", "Surprised", "Jealous", "Embarrassed", "Proud", "Lonely", "Bored", "Relaxed", "Nervous", "Hopeful", "Disappointed", "Grateful", "Curious"],
    "Elements & Materials": ["Water", "Fire", "Earth", "Air", "Metal", "Wood", "Glass", "Plastic", "Stone", "Sand", "Clay", "Steel", "Cotton", "Wool", "Rubber", "Paper", "Leather", "Ice"],
    "Holidays": ["Christmas", "Halloween", "Thanksgiving", "Easter", "Valentine's Day", "New Year's", "Hanukkah", "Diwali", "Ramadan", "Chinese New Year", "Independence Day", "St. Patrick's Day", "Labor Day", "Mother's Day", "Father's Day", "Passover", "Carnival", "Oktoberfest"],
    "Jobs in Fiction": ["Wizard", "Detective", "Pirate", "Knight", "Superhero", "Vampire Hunter", "Spy", "Archaeologist", "Cowboy", "Princess", "Alien", "Scientist", "Treasure Hunter", "Time Traveler", "Robot", "Ghostbuster", "Explorer", "Villain"],
    "Kitchen Items": ["Fork", "Spoon", "Knife", "Plate", "Cup", "Bowl", "Pan", "Pot", "Whisk", "Spatula", "Tongs", "Blender", "Oven", "Microwave", "Toaster", "Grater", "Colander", "Cutting Board"],
    "Planets & Space": ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Sun", "Moon", "Comet", "Asteroid", "Meteor", "Black Hole", "Nebula", "Supernova", "Galaxy"],
};

// --- GAME LOGIC ---

function initializeGame() {
    const playerCount = parseInt(playerCountInput.value);
    const playerNames = Array.from(document.querySelectorAll('#player-inputs input')).map(input => input.value || `Player ${parseInt(input.dataset.index) + 1}`);

    gameState = {
        players: playerNames.map(name => ({
            name: name,
            score: 10,
            rabbitPoints: 0,
            isRabbit: false,
            bet: 0,
            vote: null, // index of voted player
        })),
        currentRound: 0,
        maxRounds: 10,
        phase: 'setup', // setup, reveal, clue1, wager, clue2, verdict, scoring
        currentPlayerIndex: 0,
        startingPlayerIndex: 0, // Track who goes first each round
        wordGrid: [],
        secretWord: '',
        rabbitIndex: -1,
        rabbitGuess: '',
        votes: {},
        recentThemes: [], // Track last 5 themes to avoid repetition
    };
    
    startNewRound();
}

function startNewRound() {
    gameState.currentRound++;
    if (gameState.currentRound > gameState.maxRounds) {
        endGame("Max rounds reached.");
        return;
    }

    // Reset round-specific data
    gameState.players.forEach(p => {
        p.isRabbit = false;
        p.bet = 0;
        p.vote = null;
    });
    gameState.rabbitGuess = '';
    gameState.votes = {};

    // Randomly select starting player for this round
    gameState.startingPlayerIndex = Math.floor(Math.random() * gameState.players.length);
    
    // Assign rabbit role (completely independent of turn order)
    gameState.rabbitIndex = Math.floor(Math.random() * gameState.players.length);
    gameState.players[gameState.rabbitIndex].isRabbit = true;

    // Select theme avoiding recent ones
    const allThemes = Object.keys(WORD_LISTS);
    const availableThemes = allThemes.filter(theme => !gameState.recentThemes.includes(theme));
    
    // If all themes have been used recently (shouldn't happen with 5-round tracking), reset the recent themes
    const themesToChooseFrom = availableThemes.length > 0 ? availableThemes : allThemes;
    const randomTheme = themesToChooseFrom[Math.floor(Math.random() * themesToChooseFrom.length)];
    
    // Update recent themes list
    gameState.recentThemes.push(randomTheme);
    if (gameState.recentThemes.length > 5) {
        gameState.recentThemes.shift();
    }
    
    const words = [...WORD_LISTS[randomTheme]];
    gameState.wordGrid = words;
    gameState.secretWord = words[Math.floor(Math.random() * words.length)];

    // Start with the randomly selected starting player
    gameState.currentPlayerIndex = gameState.startingPlayerIndex;
    gameState.phase = 'reveal';
    updateUI();
}

function nextPlayer() {
    // Move to next player in clockwise order
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    
    // Check if we've completed a full round of players
    if (gameState.currentPlayerIndex === gameState.startingPlayerIndex) {
        // Reset to starting player and advance phase
        gameState.currentPlayerIndex = gameState.startingPlayerIndex;
        advancePhase();
    }
    updateUI();
}

function advancePhase() {
    const phaseOrder = ['reveal', 'transition-clue1', 'clue1', 'wager', 'transition-clue2', 'clue2', 'verdict', 'voteResults', 'weaselReveal', 'weaselGuess', 'scoring'];
    const currentPhaseIndex = phaseOrder.indexOf(gameState.phase);
    if (currentPhaseIndex !== -1 && currentPhaseIndex < phaseOrder.length - 1) {
        gameState.phase = phaseOrder[currentPhaseIndex + 1];
        
        // Add transition screens before private phases
        if (gameState.phase === 'wager' || gameState.phase === 'verdict') {
            gameState.phase = `transition-${gameState.phase}`;
        }
    }
}

function handleSubmitAction() {
    const player = gameState.players[gameState.currentPlayerIndex];
    
    switch(gameState.phase) {
        case 'transition-clue1':
        case 'transition-clue2':
            const actualPhase = gameState.phase.replace('transition-', '');
            gameState.phase = actualPhase;
            updateUI();
            return;
        case 'clue1':
        case 'clue2':
            break;
        case 'wager':
            // Require a bet to be selected
            if (player.bet === 0) {
                alert("Please select a bet amount first!");
                return;
            }
            break;
        case 'verdict':
            const selectedVote = document.querySelector('.vote-option.selected-vote');
            if (!selectedVote) { alert("Please vote for a player."); return; }
            player.vote = parseInt(selectedVote.dataset.index);
            break;
    }
    
    // For private phases, check if we need to show buffer or advance
    if (gameState.phase === 'wager' || gameState.phase === 'verdict') {
        // Check if this is the last player
        const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
        if (nextPlayerIndex === gameState.startingPlayerIndex) {
            // All players have completed this phase, advance to next phase
            gameState.currentPlayerIndex = gameState.startingPlayerIndex;
            advancePhase();
            updateUI();
        } else {
            // Show buffer screen for next player
            gameState.phase = 'buffer';
            updateUI();
        }
        return;
    }
    
    // For public phases, just go to next player
    nextPlayer();
}

function continueFromBuffer() {
    // Determine which private phase we were in by checking what the previous player just completed
    const currentPhase = gameState.phase; // Should be 'buffer'
    
    // Move to next player
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    
    // Determine which phase to continue with based on completion status
    const playersWithBets = gameState.players.filter(p => p.bet > 0).length;
    const playersWithVotes = gameState.players.filter(p => p.vote !== null).length;
    
    // If we're in the middle of wagering phase
    if (playersWithBets > 0 && playersWithBets < gameState.players.length) {
        gameState.phase = 'wager';
    }
    // If we're in the middle of voting phase  
    else if (playersWithVotes > 0 && playersWithVotes < gameState.players.length) {
        gameState.phase = 'verdict';
    }
    // This shouldn't happen if logic is correct
    else {
        console.error("Buffer state error - couldn't determine phase");
        gameState.currentPlayerIndex = gameState.startingPlayerIndex;
        advancePhase();
    }
    
    updateUI();
}

function showVoteResults() {
    // Calculate vote results
    const voteCounts = {};
    gameState.players.forEach(p => {
        if (p.vote !== null) {
            voteCounts[p.vote] = (voteCounts[p.vote] || 0) + 1;
        }
    });
    
    let maxVotes = 0;
    let accusedIndex = -1;
    let tiedPlayers = [];

    // First pass: find maximum votes
    for (const playerIndex in voteCounts) {
        if (voteCounts[playerIndex] > maxVotes) {
            maxVotes = voteCounts[playerIndex];
        }
    }

    // Second pass: find all players with maximum votes
    for (const playerIndex in voteCounts) {
        if (voteCounts[playerIndex] === maxVotes) {
            tiedPlayers.push(parseInt(playerIndex));
        }
    }

    // Handle tie scenario
    if (tiedPlayers.length > 1) {
        showTiebreakerScreen(tiedPlayers);
        return; // Exit early, don't proceed to normal results
    } else if (tiedPlayers.length === 1) {
        accusedIndex = tiedPlayers[0];
    }
    
    // Display results with improved design
    let resultsHTML = '';
    
    // Header with thematic text
    resultsHTML += `<div style="text-align: center; margin-bottom: var(--spacing-xl);">`;
    resultsHTML += `<p style="color: var(--text-secondary); font-size: 16px; margin-bottom: var(--spacing-md);">The pack has spoken... let's see who they suspect</p>`;
    resultsHTML += `</div>`;
    
    // Vote breakdown in a clean list
    resultsHTML += `<div style="background: var(--background-tertiary); border-radius: var(--border-radius-lg); padding: var(--spacing-xl); margin-bottom: var(--spacing-xl);">`;
    resultsHTML += `<h3 style="text-align: center; margin-bottom: var(--spacing-lg); color: var(--text-secondary); font-size: 18px;">Individual Votes</h3>`;
    resultsHTML += `<div style="display: grid; gap: var(--spacing-sm);">`;
    
    gameState.players.forEach((player, index) => {
        const votedFor = player.vote !== null ? gameState.players[player.vote].name : 'No vote cast';
        resultsHTML += `<div style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-md) var(--spacing-lg); background: var(--background-primary); border-radius: var(--border-radius-md); border: 1px solid var(--border-light);">`;
        resultsHTML += `<span style="font-weight: 600; color: var(--text-primary);">${player.name}</span>`;
        resultsHTML += `<span style="color: var(--text-secondary);">voted for <strong style="color: var(--primary-color);">${votedFor}</strong></span>`;
        resultsHTML += `</div>`;
    });
    resultsHTML += `</div>`;
    resultsHTML += `</div>`;
    
    // Final verdict section
    resultsHTML += `<div style="text-align: center;">`;
    if (accusedIndex !== -1) {
        const accusedPlayer = gameState.players[accusedIndex];
        resultsHTML += `<div style="background: var(--primary-color); color: var(--text-on-primary); padding: var(--spacing-xl); border-radius: var(--border-radius-lg); margin-bottom: var(--spacing-lg);">`;
        resultsHTML += `<h3 style="margin-bottom: var(--spacing-sm); font-size: 20px; color: var(--text-on-primary);">🎯 The Pack's Verdict</h3>`;
        resultsHTML += `<p style="font-size: 18px; font-weight: 600;">${accusedPlayer.name}</p>`;
        resultsHTML += `<p style="font-size: 14px; opacity: 0.9; margin-top: var(--spacing-xs);">${maxVotes} vote${maxVotes !== 1 ? 's' : ''} against them</p>`;
        resultsHTML += `</div>`;
        resultsHTML += `<p style="color: var(--text-secondary); font-style: italic;">The foxes have made their choice. But was their hunt successful?</p>`;
    } else {
        resultsHTML += `<div style="background: var(--warning-color); color: var(--text-on-color); padding: var(--spacing-xl); border-radius: var(--border-radius-lg); margin-bottom: var(--spacing-lg);">`;
        resultsHTML += `<h3 style="margin-bottom: var(--spacing-sm); font-size: 20px;">⚠️ No Clear Target</h3>`;
        resultsHTML += `<p style="font-size: 16px;">The pack couldn't agree on a suspect!</p>`;
        resultsHTML += `</div>`;
        resultsHTML += `<p style="color: var(--text-secondary); font-style: italic;">Confusion in the den... the rabbit may have escaped in the chaos.</p>`;
    }
    resultsHTML += `</div>`;
    
    gameInfo.voteResultsContent.innerHTML = resultsHTML;
    gameState.accusedIndex = accusedIndex;
}

function showWeaselReveal() {
    const rabbit = gameState.players[gameState.rabbitIndex];
    const accusedIndex = gameState.accusedIndex;
    const catchSuccess = accusedIndex === gameState.rabbitIndex;
    
    let revealHTML = '';
    
    if (accusedIndex !== -1) {
        const accusedPlayer = gameState.players[accusedIndex];
        
        // Two-column reveal layout
        revealHTML += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-xl); margin-bottom: var(--spacing-2xl);">`;
        
        // Left column - The Accusation
        revealHTML += `<div style="background: var(--background-tertiary); border-radius: var(--border-radius-lg); padding: var(--spacing-xl); border: 1px solid var(--border-light);">`;
        revealHTML += `<div style="text-align: center;">`;
        revealHTML += `<div style="font-size: 32px; margin-bottom: var(--spacing-md);">🎯</div>`;
        revealHTML += `<h4 style="color: var(--text-secondary); font-size: 14px; margin-bottom: var(--spacing-sm); text-transform: uppercase; letter-spacing: 0.5px;">The Pack Accused</h4>`;
        revealHTML += `<p style="font-size: 20px; font-weight: 700; color: var(--primary-color); margin-bottom: var(--spacing-xs);">${accusedPlayer.name}</p>`;
        revealHTML += `<p style="font-size: 12px; color: var(--text-tertiary);">Based on the voting</p>`;
        revealHTML += `</div>`;
        revealHTML += `</div>`;
        
        // Right column - The Truth
        revealHTML += `<div style="background: var(--background-tertiary); border-radius: var(--border-radius-lg); padding: var(--spacing-xl); border: 1px solid var(--border-light);">`;
        revealHTML += `<div style="text-align: center;">`;
        revealHTML += `<div style="font-size: 32px; margin-bottom: var(--spacing-md);">🐰</div>`;
        revealHTML += `<h4 style="color: var(--text-secondary); font-size: 14px; margin-bottom: var(--spacing-sm); text-transform: uppercase; letter-spacing: 0.5px;">The Real Rabbit</h4>`;
        revealHTML += `<p style="font-size: 20px; font-weight: 700; color: var(--secondary-color); margin-bottom: var(--spacing-xs);">${rabbit.name}</p>`;
        revealHTML += `<p style="font-size: 12px; color: var(--text-tertiary);">The actual infiltrator</p>`;
        revealHTML += `</div>`;
        revealHTML += `</div>`;
        
        revealHTML += `</div>`; // End grid
        
        // Result banner
        if (catchSuccess) {
            revealHTML += `<div style="background: linear-gradient(135deg, var(--accent-color), var(--accent-light)); color: var(--text-on-color); padding: var(--spacing-xl); border-radius: var(--border-radius-lg); text-align: center; margin-bottom: var(--spacing-xl); box-shadow: var(--shadow-medium);">`;
            revealHTML += `<div style="font-size: 24px; margin-bottom: var(--spacing-sm);">🎉</div>`;
            revealHTML += `<h3 style="font-size: 18px; font-weight: 700; margin-bottom: var(--spacing-xs);">Hunt Successful!</h3>`;
            revealHTML += `<p style="opacity: 0.9;">The foxes successfully identified and caught the rabbit</p>`;
            revealHTML += `</div>`;
        } else {
            revealHTML += `<div style="background: linear-gradient(135deg, var(--warning-color), var(--warning-light)); color: var(--text-on-color); padding: var(--spacing-xl); border-radius: var(--border-radius-lg); text-align: center; margin-bottom: var(--spacing-xl); box-shadow: var(--shadow-medium);">`;
            revealHTML += `<div style="font-size: 24px; margin-bottom: var(--spacing-sm);">💨</div>`;
            revealHTML += `<h3 style="font-size: 18px; font-weight: 700; margin-bottom: var(--spacing-xs);">Rabbit Escaped!</h3>`;
            revealHTML += `<p style="opacity: 0.9;">The rabbit slipped through the fox pack's grasp</p>`;
            revealHTML += `</div>`;
        }
        
    } else {
        // No clear vote scenario
        revealHTML += `<div style="text-align: center; margin-bottom: var(--spacing-2xl);">`;
        revealHTML += `<div style="background: var(--background-tertiary); border-radius: var(--border-radius-lg); padding: var(--spacing-2xl); border: 1px solid var(--border-light); margin-bottom: var(--spacing-xl);">`;
        revealHTML += `<div style="font-size: 48px; margin-bottom: var(--spacing-lg);">🤷‍♂️</div>`;
        revealHTML += `<h4 style="color: var(--text-secondary); font-size: 14px; margin-bottom: var(--spacing-sm); text-transform: uppercase; letter-spacing: 0.5px;">Voting Confusion</h4>`;
        revealHTML += `<p style="font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: var(--spacing-md);">No Clear Majority</p>`;
        revealHTML += `<p style="color: var(--text-secondary);">The pack couldn't agree on a suspect</p>`;
        revealHTML += `</div>`;
        
        // Reveal the actual rabbit
        revealHTML += `<div style="background: var(--background-tertiary); border-radius: var(--border-radius-lg); padding: var(--spacing-xl); border: 1px solid var(--border-light); margin-bottom: var(--spacing-xl);">`;
        revealHTML += `<div style="font-size: 32px; margin-bottom: var(--spacing-md);">🐰</div>`;
        revealHTML += `<h4 style="color: var(--text-secondary); font-size: 14px; margin-bottom: var(--spacing-sm); text-transform: uppercase; letter-spacing: 0.5px;">The Real Rabbit Was</h4>`;
        revealHTML += `<p style="font-size: 24px; font-weight: 700; color: var(--secondary-color);">${rabbit.name}</p>`;
        revealHTML += `</div>`;
        revealHTML += `</div>`;
        
        // Result banner for confusion scenario
        revealHTML += `<div style="background: linear-gradient(135deg, var(--warning-color), var(--warning-light)); color: var(--text-on-color); padding: var(--spacing-xl); border-radius: var(--border-radius-lg); text-align: center; margin-bottom: var(--spacing-xl); box-shadow: var(--shadow-medium);">`;
        revealHTML += `<div style="font-size: 24px; margin-bottom: var(--spacing-sm);">😵‍💫</div>`;
        revealHTML += `<h3 style="font-size: 18px; font-weight: 700; margin-bottom: var(--spacing-xs);">Chaos in the Den!</h3>`;
        revealHTML += `<p style="opacity: 0.9;">The rabbit escaped due to voting confusion</p>`;
        revealHTML += `</div>`;
    }
    
    // Bottom explanatory text
    revealHTML += `<div style="text-align: center; padding: var(--spacing-lg); background: var(--background-secondary); border-radius: var(--border-radius-md); border: 1px solid var(--border-light);">`;
    revealHTML += `<p style="color: var(--text-secondary); font-size: 14px; font-style: italic;">`;
    revealHTML += `Now let's see if the rabbit can guess the secret word...`;
    revealHTML += `</p>`;
    revealHTML += `</div>`;
    
    gameInfo.weaselRevealContent.innerHTML = revealHTML;
}

function setupWeaselGuess() {
    const rabbit = gameState.players[gameState.rabbitIndex];
    gameInfo.weaselGuessTitle.textContent = `🐰 ${rabbit.name}'s Final Guess`;
    gameInfo.weaselGuessInstruction.textContent = `${rabbit.name} (the Rabbit) must now guess the secret word. Everyone can watch!`;
    
    gameInfo.weaselGuessGrid.innerHTML = gameState.wordGrid.map(word => 
        `<div class="word-cell guessable" data-word="${word}">${word}</div>`
    ).join('');
    
    // Add click handlers for rabbit guess
    document.querySelectorAll('#weasel-guess-grid .word-cell').forEach(cell => {
        cell.addEventListener('click', handleWeaselGuessSelection);
    });
    
    gameInfo.submitWeaselGuessBtn.style.display = 'none';
}

function handleWeaselGuessSelection(e) {
    document.querySelectorAll('#weasel-guess-grid .word-cell').forEach(cell => {
        cell.classList.remove('selected-guess');
    });
    e.target.classList.add('selected-guess');
    gameState.rabbitGuess = e.target.dataset.word;
    gameInfo.submitWeaselGuessBtn.style.display = 'block';
}

function submitWeaselGuess() {
    if (!gameState.rabbitGuess) {
        alert("Please select a word first!");
        return;
    }
    
    gameState.phase = 'scoring';
    updateUI();
}

function calculateScores() {
    // Use the stored accused index from vote results
    const catchSuccess = gameState.accusedIndex === gameState.rabbitIndex;

    // Determine Guess Success
    const guessSuccess = gameState.rabbitGuess && gameState.rabbitGuess.toLowerCase() === gameState.secretWord.toLowerCase();
    
    const rabbit = gameState.players[gameState.rabbitIndex];
    const foxes = gameState.players.filter(p => !p.isRabbit);
    
    const changes = gameState.players.map(p => ({ name: p.name, change: 0, oldScore: p.score }));

    let outcomeKey;
    
    // Scenario 1: Only Foxes win (Catch Success, Guess Failure)
    if (catchSuccess && !guessSuccess) {
        outcomeKey = "fox-win";
        // Foxes: Win 2x their stake for successful catch bet
        foxes.forEach(p => {
            const winnings = p.bet * 2;
            p.score += winnings;
            changes[gameState.players.indexOf(p)].change = winnings;
        });
        // Rabbit: Loses their failed guess bet
        rabbit.score -= rabbit.bet;
        changes[gameState.rabbitIndex].change = -rabbit.bet;
    }
    // Scenario 2: Only Rabbit wins (Catch Failure, Guess Success)
    else if (!catchSuccess && guessSuccess) {
        outcomeKey = "rabbit-win";
        // Rabbit: Wins 3x their stake for successful guess bet
        const rabbitWinnings = rabbit.bet * 3;
        rabbit.score += rabbitWinnings;
        rabbit.rabbitPoints += rabbitWinnings;
        changes[gameState.rabbitIndex].change = rabbitWinnings;

        // Foxes: Lose their failed catch bets
        foxes.forEach(p => {
            const foxIndex = gameState.players.indexOf(p);
            p.score -= p.bet;
            changes[foxIndex].change = -p.bet;
        });
    }
    // Scenario 3: Both sides win - Push (Catch Success, Guess Success)
    else if (catchSuccess && guessSuccess) {
        outcomeKey = "contested-win";
        // Everyone gets back exactly what they wagered (1x) - net change is 0
        // No score changes needed since everyone "pushes"
        gameState.players.forEach((p, i) => {
            changes[i].change = 0;
        });
    }
    // Scenario 4: Both sides lose (Catch Failure, Guess Failure)
    else { // !catchSuccess && !guessSuccess
        outcomeKey = "total-failure";
        // Everyone loses their bet
        gameState.players.forEach((p, i) => {
            p.score -= p.bet;
            changes[i].change = -p.bet;
        });
    }
    
    displayScoringSummary(outcomeKey, { catchSuccess, guessSuccess }, changes);
    checkEndConditions();
}

function checkEndConditions() {
    let gameOver = false;
    let reason = "";
    
    const highScorer = gameState.players.find(p => p.score >= 25);
    if (highScorer) {
        gameOver = true;
        reason = `${highScorer.name} reached 25 🥕 carrots!`;
    }
    
    const bankruptPlayer = gameState.players.find(p => p.score <= 0);
    if (bankruptPlayer) {
        gameOver = true;
        reason = `${bankruptPlayer.name} ran out of 🥕 carrots!`;
    }

    if (gameOver) {
        endGame(reason);
    }
}

function endGame(reason) {
    gameState.phase = 'gameOver';
    
    let winners = [...gameState.players].sort((a, b) => b.score - a.score);
    let topScore = winners[0].score;
    let tiedWinners = winners.filter(p => p.score === topScore);
    
    let winner;
    if (tiedWinners.length > 1) {
        tiedWinners.sort((a, b) => b.rabbitPoints - a.rabbitPoints);
        winner = tiedWinners[0];
    } else {
        winner = winners[0];
    }
    
    gameInfo.winnerAnnouncement.innerHTML = `
        ${reason}<br>
        <strong>The winner is ${winner.name} with ${Math.round(winner.score)} 🥕 carrots!</strong>
    `;
    updateUI();
}

function startTimer(seconds) {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    currentTimerSeconds = seconds;
    const timerContainer = document.getElementById('timer-container');
    const timerDisplay = document.getElementById('timer-display');
    const timerLabel = document.getElementById('timer-label');
    
    // Show timer
    timerContainer.classList.add('active');
    
    // Update display
    function updateTimerDisplay() {
        const minutes = Math.floor(currentTimerSeconds / 60);
        const seconds = currentTimerSeconds % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Add warning style when under 6 seconds
        if (currentTimerSeconds <= 5) {
            timerDisplay.classList.add('warning');
        } else {
            timerDisplay.classList.remove('warning');
        }
        
        timerLabel.textContent = 'Time Remaining';
    }
    
    // Initial display
    updateTimerDisplay();
    
    // Start countdown
    timerInterval = setInterval(() => {
        currentTimerSeconds--;
        updateTimerDisplay();
        
        if (currentTimerSeconds <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = '0:00';
            timerLabel.textContent = 'Time Up!';
            timerDisplay.classList.add('warning');
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    const timerContainer = document.getElementById('timer-container');
    timerContainer.classList.remove('active');
}

// --- UI UPDATING ---

function switchScreen(activeScreen) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    if (screens[activeScreen]) {
        screens[activeScreen].classList.add('active');
    }
}

function updateUI() {
    if (gameState.phase === 'setup') {
        switchScreen('setup');
        document.body.classList.remove('in-game');
        return;
    }
    
    switchScreen('game');
    document.body.classList.add('in-game');
    gameInfo.roundCounter.textContent = `R${gameState.currentRound}/${gameState.maxRounds}`;
    
    // Create score display with two lines: name and carrot count
    gameInfo.playerScores.innerHTML = gameState.players.map(p => {
        const score = Math.round(p.score);
        const name = p.name.length > 8 ? p.name.substring(0, 8) + '…' : p.name;
        const scoreText = `${name}\n${score}🥕`;
        return `<li class="${p.isRabbit && (gameState.phase === 'scoring' || gameState.phase === 'gameOver') ? 'weasel-score' : ''}">${scoreText}</li>`;
    }).join('');

    Object.values(screens).forEach(s => {
        if (s.parentElement === document.getElementById('game-phase-container')) s.classList.remove('active');
    });
    
    const player = gameState.players[gameState.currentPlayerIndex];
    
    switch(gameState.phase) {
        case 'reveal':
            screens.passDevice.classList.add('active');
            gameInfo.passToPlayerName.textContent = `🔄 Pass to ${player.name}`;
            break;
        
        case 'transition-wager':
        case 'transition-verdict':
            screens.passDevice.classList.add('active');
            const phaseType = gameState.phase.replace('transition-', '');
            const phaseNames = { wager: 'Wagering', verdict: 'Voting' };
            gameInfo.passToPlayerName.textContent = `${phaseNames[phaseType]}: Pass to ${player.name}`;
            break;
            
        case 'transition-clue1':
                        case 'clue1':
        case 'wager':
        case 'transition-clue2':
        case 'clue2':
        case 'verdict':
            screens.mainPhase.classList.add('active');
            setupMainPhaseScreen();
            break;
            
        case 'buffer':
            screens.buffer.classList.add('active');
            // Update buffer screen with next player info
            const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
            const nextPlayer = gameState.players[nextPlayerIndex];
            document.querySelector('#buffer-screen h2').textContent = `🔄 Pass to ${nextPlayer.name}`;
            document.querySelector('#buffer-screen p').textContent = `Please hand the device to ${nextPlayer.name} and ensure the previous player looks away.`;
            break;
            
        case 'voteResults':
            screens.voteResults.classList.add('active');
            showVoteResults();
            break;
            
        case 'weaselReveal':
            screens.weaselReveal.classList.add('active');
            showWeaselReveal();
            break;
            
        case 'weaselGuess':
            screens.weaselGuess.classList.add('active');
            setupWeaselGuess();
            break;
            
        case 'scoring':
            screens.scoring.classList.add('active');
            calculateScores();
            break;

        case 'gameOver':
            screens.gameOver.classList.add('active');
            break;
    }
}

function showRevealScreen() {
    switchScreen('game');
    screens.reveal.classList.add('active');
    const player = gameState.players[gameState.currentPlayerIndex];
    gameInfo.revealRoleTitle.textContent = player.isRabbit ? "You are the RABBIT 🐰" : "You are a FOX 🦊";
    gameInfo.revealInstruction.textContent = player.isRabbit 
        ? "You DON'T know the secret word. Blend in and try to figure it out from the clues!"
        : "Your pack's secret word is highlighted below. Give clues to help your fellow Foxes find the Rabbit without giving the word away!";
    gameInfo.revealWordGrid.innerHTML = gameState.wordGrid.map(word => 
        `<div class="word-cell ${!player.isRabbit && word === gameState.secretWord ? 'secret' : ''}">${word}</div>`
    ).join('');

    // --- TIMER FOR EACH PLAYER IN REVEAL PHASE ---
    if (gameState.phase === 'reveal') {
        if (gameInfo.roleRevealedBtn) {
            gameInfo.roleRevealedBtn.disabled = true;
            let timerDisplay = document.getElementById('reveal-timer');
            if (!timerDisplay) {
                timerDisplay = document.createElement('div');
                timerDisplay.id = 'reveal-timer';
                timerDisplay.style.fontSize = '20px';
                timerDisplay.style.fontWeight = 'bold';
                timerDisplay.style.margin = '16px 0';
                gameInfo.revealInstruction.parentNode.insertBefore(timerDisplay, gameInfo.revealInstruction.nextSibling);
            }
            let secondsLeft = 10;
            timerDisplay.textContent = `Read the clues... (${secondsLeft}s)`;
            timerInterval = setInterval(() => {
                secondsLeft--;
                timerDisplay.textContent = `Read the clues... (${secondsLeft}s)`;
                if (secondsLeft <= 0) {
                    clearInterval(timerInterval);
                    timerDisplay.textContent = '';
                    gameInfo.roleRevealedBtn.disabled = false;
                }
            }, 1000);
        }
    } else {
        if (gameInfo.roleRevealedBtn) {
            gameInfo.roleRevealedBtn.disabled = false;
        }
        let timerDisplay = document.getElementById('reveal-timer');
        if (timerDisplay) timerDisplay.textContent = '';
    }
}

function setupMainPhaseScreen() {
    const player = gameState.players[gameState.currentPlayerIndex];
    let title = '', instruction = '', inputHTML = '', buttonText = 'Submit';
    
    // Stop any existing timer first
    stopTimer();
    
    switch(gameState.phase) {
        case 'transition-clue1':
            title = `Get Ready for First Clue: ${player.name}'s Turn`;
            instruction = "Prepare your BROAD clue. When you are ready, press 'Begin' and you'll have 20 seconds to give your clue.";
            inputHTML = ``;
            buttonText = "Begin";
            break;
        case 'clue1':
            title = `First Clue: ${player.name}'s Turn`;
            instruction = "Give your BROAD clue out loud to the group. You have 20 seconds. When you are finished, press 'Continue'.";
            inputHTML = ``;
            buttonText = "Continue";
            // Start 20-second timer for clue phase
            setTimeout(() => startTimer(20), 100);
            break;
        case 'wager':
            title = `Wager: ${player.name}'s Turn`;
            if (player.isRabbit) {
                instruction = `You are the Rabbit. Bet on your ability to guess the secret word. Your current score: ${Math.round(player.score)} 🥕 carrots`;
            } else {
                instruction = `You are a Fox. Bet on your pack's ability to catch the Rabbit. Your current score: ${Math.round(player.score)} 🥕 carrots`;
            }
            inputHTML = `
                <div class="wager-buttons">
                    <button class="wager-btn" data-amount="1">
                        <span class="wager-amount">1 🥕</span>
                        <span class="wager-label">Carrot</span>
                    </button>
                    <button class="wager-btn" data-amount="2">
                        <span class="wager-amount">2 🥕</span>
                        <span class="wager-label">Carrots</span>
                    </button>
                    <button class="wager-btn" data-amount="3">
                        <span class="wager-amount">3 🥕</span>
                        <span class="wager-label">Carrots</span>
                    </button>
                </div>
                <div class="wager-explanation" id="wager-explanation">
                    <div>Select your bet amount to see potential winnings</div>
                </div>
            `;
            buttonText = "Submit Bet";
            break;
                        case 'transition-clue2':
            title = `Get Ready for Second Clue: ${player.name}'s Turn`;
            instruction = "Prepare your second clue. When you are ready, press 'Begin' and you'll have 20 seconds to give your clue.";
            inputHTML = ``;
            buttonText = "Begin";
            break;
        case 'clue2':
            title = `Second Clue: ${player.name}'s Turn`;
            instruction = "Give your second clue out loud to the group. You have 20 seconds. When you are finished, press 'Continue'.";
            inputHTML = ``;
            buttonText = "Continue";
            // Start 20-second timer for clue phase
            setTimeout(() => startTimer(20), 100);
            break;
        case 'verdict':
            title = `Verdict: ${player.name}'s Turn`;
            instruction = "All clues have been given. Now, vote for who you think the Rabbit is.";
            inputHTML = `<ul id="vote-options">` + gameState.players
                .map((p, i) => `<li class="vote-option" data-index="${i}">${p.name}</li>`)
                .join('') + `</ul>`;
            buttonText = "Submit Vote";
            break;
    }
    
    gameInfo.phaseTitle.textContent = title;
    gameInfo.phaseInstruction.textContent = instruction;
    gameInfo.actionInputArea.innerHTML = inputHTML;
    gameInfo.submitActionBtn.textContent = buttonText;
    
    gameInfo.mainWordGrid.innerHTML = gameState.wordGrid.map(word => 
        `<div class="word-cell">${word}</div>`
    ).join('');
    
    if (gameState.phase === 'verdict') {
        document.querySelectorAll('.vote-option').forEach(opt => opt.addEventListener('click', handleVoteSelection));
    } else if (gameState.phase === 'wager') {
        // Add event listeners for wager buttons
        document.querySelectorAll('.wager-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove selection from all buttons
                document.querySelectorAll('.wager-btn').forEach(b => b.classList.remove('selected-wager'));
                
                // Add selection to clicked button
                btn.classList.add('selected-wager');
                // Set the player's bet based on the button clicked
                const betAmount = parseInt(btn.dataset.amount);
                gameState.players[gameState.currentPlayerIndex].bet = betAmount;
                
                // Update wager explanation
                updateWagerExplanation(betAmount, player.isRabbit);
            });
        });
    }
}

function handleVoteSelection(e) {
    document.querySelectorAll('.vote-option').forEach(opt => opt.classList.remove('selected-vote'));
    e.target.classList.add('selected-vote');
}

function handleGuessSelection(e) {
    document.querySelectorAll('.word-cell.guessable').forEach(cell => cell.classList.remove('selected-guess'));
    e.target.classList.add('selected-guess');
}

function displayScoringSummary(outcomeKey, results, changes) {
    const outcomeTitles = {
        "fox-win": "🦊 Foxes Win!",
        "rabbit-win": "🐰 Rabbit Wins!",
        "contested-win": "🤝 Push - Both Sides Win!",
        "total-failure": "💥 Total Failure!"
    };

    const outcomeDescriptions = {
        "fox-win": "The Foxes caught the Rabbit, and the Rabbit failed to guess the word. <strong>Foxes win 2× their catch bets!</strong>",
        "rabbit-win": "The Rabbit escaped detection and guessed the secret word! <strong>The Rabbit wins 3× their guess bet!</strong>",
        "contested-win": "The Foxes caught the Rabbit, but the Rabbit ALSO guessed the word correctly. <strong>Everyone pushes and gets back their original bet (1×).</strong>",
        "total-failure": "The Foxes failed to catch the Rabbit, AND the Rabbit failed to guess the word. <strong>Everyone loses their bets!</strong>"
    };

    // Generate outcome images
    const outcomeImages = {
        "fox-win": `<div class="outcome-image"><img src="assets/bunnycatch.png" alt="Bunny Caught"></div>`,
        "rabbit-win": `<div class="outcome-image"><img src="assets/bunnyrun.png" alt="Bunny Escaped"></div>`,
        "contested-win": `<div class="outcome-image"><img src="assets/bunnyfoxwin.png" alt="Both Sides Win"></div>`,
        "total-failure": `<div class="outcome-image"><img src="assets/bunnyfoxlose.png" alt="Both Sides Lose"></div>`
    };

    // Generate score changes
    const scoreChanges = changes.map(c => {
        const change = Math.round(c.change * 100) / 100;
        const changeClass = change > 0 ? 'gain' : (change < 0 ? 'loss' : 'neutral');
        const sign = change > 0 ? '+' : '';
        return `
            <li>
                <span class="player-name">${c.name}</span>
                <div class="score-change-details">
                    <span class="score-change ${changeClass}">${sign}${change} 🥕</span>
                    <span class="score-transition">${Math.round(c.oldScore)} → ${Math.round(c.oldScore + change)}</span>
                </div>
            </li>
        `;
    }).join('');

    const rabbit = gameState.players[gameState.rabbitIndex];
    
    gameInfo.scoringSummary.innerHTML = `
        <div class="scoring-header">
            <div class="outcome-banner ${outcomeKey}">${outcomeTitles[outcomeKey]}</div>
            ${outcomeImages[outcomeKey] || ''}
        </div>
        
        <div class="round-summary">
            <h3>Round Summary</h3>
            <div class="summary-grid">
                <div class="summary-item">
                    <h4>Secret Word</h4>
                    <div class="value">${gameState.secretWord}</div>
                </div>
                <div class="summary-item">
                    <h4>The Rabbit</h4>
                    <div class="value">${rabbit.name}</div>
                </div>
                <div class="summary-item">
                    <h4>Catch Attempt</h4>
                    <div class="result ${results.catchSuccess ? 'success' : 'failure'}">
                        ${results.catchSuccess ? 'SUCCESS' : 'FAILURE'}
                    </div>
                </div>
                <div class="summary-item">
                    <h4>Rabbit's Guess</h4>
                    <div class="result ${results.guessSuccess ? 'success' : 'failure'}">
                        ${results.guessSuccess ? 'SUCCESS' : 'FAILURE'}
                    </div>
                    <div class="value">"${gameState.rabbitGuess || 'No Guess Made'}"</div>
                </div>
            </div>
            <div class="outcome-description">
                ${outcomeDescriptions[outcomeKey]}
            </div>
        </div>
        
        <div class="score-changes-section">
            <h3>Score Changes</h3>
            <ul id="player-score-changes">
                ${scoreChanges}
            </ul>
        </div>
    `;
}

function showTiebreakerScreen(tiedPlayers) {
    // Calculate vote counts for display
    const voteCounts = {};
    gameState.players.forEach(p => {
        if (p.vote !== null) {
            voteCounts[p.vote] = (voteCounts[p.vote] || 0) + 1;
        }
    });
    
    let html = `
        <div class="tiebreaker-screen">
            <div style="text-align: center; margin-bottom: var(--spacing-xl);">
                <div style="font-size: 48px; margin-bottom: var(--spacing-md);">🪨📄✂️</div>
                <h2 style="color: var(--warning-color); margin-bottom: var(--spacing-lg);">Tiebreaker Required!</h2>
            </div>
            
            <div style="background: var(--background-tertiary); border-radius: var(--border-radius-lg); padding: var(--spacing-xl); margin-bottom: var(--spacing-xl); border: 1px solid var(--border-light);">
                <p style="text-align: center; margin-bottom: var(--spacing-md); font-size: 16px;">The following players are tied with <strong>${voteCounts[tiedPlayers[0]]}</strong> vote${voteCounts[tiedPlayers[0]] !== 1 ? 's' : ''} each:</p>
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: var(--spacing-md); justify-content: center;">
                    ${tiedPlayers.map(index => 
                        `<li style="background: var(--primary-color); color: var(--text-on-primary); padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--border-radius-md); font-weight: 600;">${gameState.players[index].name}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div style="text-align: center; margin-bottom: var(--spacing-xl);">
                <p style="font-size: 18px; font-weight: 600; margin-bottom: var(--spacing-sm);">🎲 Resolution Required</p>
                <p style="color: var(--text-secondary); margin-bottom: var(--spacing-lg);">These players should play <strong>Rock-Paper-Scissors</strong> outside the game to determine who gets accused.</p>
                <p style="font-weight: 600; color: var(--text-primary);">Click the <strong>loser</strong> below:</p>
            </div>
            
            <div class="tiebreaker-buttons" style="display: grid; gap: var(--spacing-md); max-width: 400px; margin: 0 auto;">
                ${tiedPlayers.map(index => 
                    `<button onclick="selectTiebreakerWinner(${index})" class="tiebreaker-btn" style="background: var(--accent-color); color: var(--text-on-color); border: none; padding: var(--spacing-lg); border-radius: var(--border-radius-md); font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
                        😞 ${gameState.players[index].name} Lost RPS
                    </button>`
                ).join('')}
            </div>
        </div>
    `;
    
    gameInfo.voteResultsContent.innerHTML = html;
}

function selectTiebreakerWinner(winnerIndex) {
    gameState.accusedIndex = winnerIndex;
    
    // Show the tiebreaker result and then proceed to normal vote results display
    let resultsHTML = '';
    
    resultsHTML += `<div style="text-align: center; margin-bottom: var(--spacing-xl);">`;
    resultsHTML += `<div style="background: var(--accent-color); color: var(--text-on-primary); padding: var(--spacing-xl); border-radius: var(--border-radius-lg); margin-bottom: var(--spacing-lg);">`;
    resultsHTML += `<div style="font-size: 24px; margin-bottom: var(--spacing-sm);">🎲</div>`;
    resultsHTML += `<h3 style="font-size: 18px; font-weight: 700; margin-bottom: var(--spacing-xs);">Tiebreaker Resolved!</h3>`;
    resultsHTML += `<p style="opacity: 0.9;">${gameState.players[winnerIndex].name} lost Rock-Paper-Scissors</p>`;
    resultsHTML += `</div>`;
    resultsHTML += `</div>`;
    
    resultsHTML += `<div style="background: var(--primary-color); color: var(--text-on-primary); padding: var(--spacing-xl); border-radius: var(--border-radius-lg); text-align: center; margin-bottom: var(--spacing-xl); box-shadow: var(--shadow-medium);">`;
    resultsHTML += `<h3 style="margin-bottom: var(--spacing-sm); font-size: 20px; color: var(--text-on-primary);">🎯 The Pack's Final Verdict</h3>`;
    resultsHTML += `<p style="font-size: 18px; font-weight: 600;">${gameState.players[winnerIndex].name}</p>`;
    resultsHTML += `<p style="font-size: 14px; opacity: 0.9; margin-top: var(--spacing-xs);">Accused after losing the tiebreaker</p>`;
    resultsHTML += `</div>`;
    
    resultsHTML += `<div style="text-align: center; padding: var(--spacing-lg); background: var(--background-secondary); border-radius: var(--border-radius-md); border: 1px solid var(--border-light);">`;
    resultsHTML += `<p style="color: var(--text-secondary); font-size: 14px; font-style: italic;">`;
    resultsHTML += `The foxes have made their choice through fair competition. But was their hunt successful?`;
    resultsHTML += `</p>`;
    resultsHTML += `</div>`;
    
    gameInfo.voteResultsContent.innerHTML = resultsHTML;
}

// --- EVENT LISTENERS ---
// Update player input UI
function updatePlayerInputs() {
    const count = parseInt(playerCountInput.value);
    playerInputsContainer.innerHTML = '';
    
    // Update counter buttons state
    decreasePlayersBtn.disabled = count <= 4;
    increasePlayersBtn.disabled = count >= 10;
    
    // Create player input fields with a cleaner design
    for (let i = 0; i < count; i++) {
        playerInputsContainer.innerHTML += `
            <div class="player-input-group">
                <input type="text" placeholder="Player ${i + 1} Name" data-index="${i}">
            </div>
        `;
    }
}

// Bind events for player count buttons
decreasePlayersBtn.addEventListener('click', () => {
    const currentValue = parseInt(playerCountInput.value);
    if (currentValue > 4) {
        playerCountInput.value = currentValue - 1;
        playerCountDisplay.textContent = currentValue - 1;
        updatePlayerInputs();
    }
});

increasePlayersBtn.addEventListener('click', () => {
    const currentValue = parseInt(playerCountInput.value);
    if (currentValue < 10) {
        playerCountInput.value = currentValue + 1;
        playerCountDisplay.textContent = currentValue + 1;
        updatePlayerInputs();
    }
});

// Initialize the player inputs on load
document.addEventListener('touchstart', function() {}, {passive: true});
document.addEventListener('DOMContentLoaded', updatePlayerInputs);

// Replace the existing player count input change handler
playerCountInput.addEventListener('change', () => {
    const count = parseInt(playerCountInput.value);
    playerInputsContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        playerInputsContainer.innerHTML += `
            <div class="player-input-group">
                <input type="text" placeholder="Player ${i + 1} Name" data-index="${i}">
            </div>
        `;
    }
});

startGameBtn.addEventListener('click', initializeGame);

gameInfo.showRoleBtn.addEventListener('click', () => {
    if (gameState.phase === 'reveal') {
        showRevealScreen();
    } else if (gameState.phase === 'transition-wager') {
        gameState.phase = 'wager';
        updateUI();
    } else if (gameState.phase === 'transition-verdict') {
        gameState.phase = 'verdict';
        updateUI();
    }
});

gameInfo.roleRevealedBtn.addEventListener('click', () => {
    screens.reveal.classList.remove('active');
    nextPlayer();
});

gameInfo.submitActionBtn.addEventListener('click', handleSubmitAction);
gameInfo.nextRoundBtn.addEventListener('click', startNewRound);
gameInfo.playAgainBtn.addEventListener('click', () => location.reload());
gameInfo.continueBufferBtn.addEventListener('click', continueFromBuffer);

gameInfo.continueAfterVotesBtn.addEventListener('click', () => {
    gameState.phase = 'weaselReveal';
    updateUI();
});

gameInfo.continueToGuessBtn.addEventListener('click', () => {
    gameState.phase = 'weaselGuess';
    updateUI();
});

gameInfo.submitWeaselGuessBtn.addEventListener('click', submitWeaselGuess);

function updateWagerExplanation(betAmount, isRabbit) {
    const explanationDiv = document.getElementById('wager-explanation');
    if (!explanationDiv) return;
    
    let explanationHTML;
    
    if (isRabbit) {
        const winAmount = betAmount * 3;
        explanationHTML = `
            <div>As the Rabbit, if you successfully guess the secret word AND avoid detection:</div>
            <div class="potential-winnings">You could win ${winAmount} 🥕 carrots! (3× your bet)</div>
            <div style="margin-top: var(--spacing-sm); font-size: 12px; opacity: 0.7;">
                If caught OR if you guess wrong, you lose your ${betAmount} 🥕 bet
            </div>
        `;
    } else {
        const winAmount = betAmount * 2;
        explanationHTML = `
            <div>As a Fox, if your pack successfully catches the Rabbit AND they guess wrong:</div>
            <div class="potential-winnings">You could win ${winAmount} 🥕 carrots! (2× your bet)</div>
            <div style="margin-top: var(--spacing-sm); font-size: 12px; opacity: 0.7;">
                If the Rabbit escapes OR guesses correctly, you lose your ${betAmount} 🥕 bet
            </div>
        `;
    }
    
    explanationDiv.innerHTML = explanationHTML;
}

// --- INITIALIZE ---
playerCountInput.dispatchEvent(new Event('change'));