import React, { useState, useEffect } from 'react';
import { API_URL, PREDEFINED_TAGS, COMMON_COLORS } from './constants.js';
import Loader from './components/Loader.jsx';
import Header from './components/Header.jsx';
import DeckView from './components/DeckView.jsx';
import QuizView from './components/QuizView.jsx';
import TagEditModal from './components/TagEditModal.jsx';

export default function App() {
    const [cards, setCards] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('deck'); // 'deck' or 'quiz'
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    const [editingCard, setEditingCard] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);

    // Theme effect
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };
    
    // Data fetching effect
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Failed to fetch country data.');
                const data = await response.json();
                const savedTags = JSON.parse(localStorage.getItem('flagFlashcardTags')) || {};

                const processedCards = data
                    .filter(country => country.name.common && country.flags.svg && country.flags.alt)
                    .map(country => {
                        const cardId = country.cca3;
                        let tags;
                        if (savedTags[cardId]) {
                            tags = savedTags[cardId];
                        } else if (PREDEFINED_TAGS[cardId]) {
                            tags = PREDEFINED_TAGS[cardId];
                        } else {
                            const defaultTags = new Set();
                            if (country.region) defaultTags.add(country.region);
                            if (country.subregion) defaultTags.add(country.subregion);
                            const flagDescription = country.flags.alt || '';
                            COMMON_COLORS.forEach(color => {
                                if (flagDescription.toLowerCase().includes(color)) defaultTags.add(color);
                            });
                            if (flagDescription.toLowerCase().includes('stripe')) defaultTags.add('stripes');
                            if (flagDescription.toLowerCase().includes('cross')) defaultTags.add('cross');
                            tags = Array.from(defaultTags);
                        }
                        return { id: cardId, name: country.name.common, flagUrl: country.flags.svg, tags };
                    });
                
                processedCards.sort((a, b) => a.name.localeCompare(b.name));
                setCards(processedCards);

                const allTagsSet = new Set();
                processedCards.forEach(card => card.tags.forEach(tag => allTagsSet.add(tag)));
                setAllTags(Array.from(allTagsSet).sort());

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCountries();
    }, []);

    const handleSaveTags = (cardToUpdate, newTagsString) => {
        const newTags = newTagsString.split(',').map(t => t.trim()).filter(Boolean);
        const updatedCards = cards.map(card => 
            card.id === cardToUpdate.id ? { ...card, tags: newTags } : card
        );
        setCards(updatedCards);

        const savedTags = JSON.parse(localStorage.getItem('flagFlashcardTags')) || {};
        savedTags[cardToUpdate.id] = newTags;
        localStorage.setItem('flagFlashcardTags', JSON.stringify(savedTags));

        const allTagsSet = new Set();
        updatedCards.forEach(card => card.tags.forEach(tag => allTagsSet.add(tag)));
        setAllTags(Array.from(allTagsSet).sort());
    };

    const handleTagToggle = (tag) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <Header theme={theme} toggleTheme={toggleTheme} />

            <div className="flex justify-center mb-8 space-x-4">
                <button onClick={() => setView('deck')} className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 cursor-pointer">Deck View</button>
                <button onClick={() => setView('quiz')} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 cursor-pointer">Quiz Mode</button>
            </div>
            
            {isLoading ? <Loader /> : (
                <>
                    {view === 'deck' && (
                        <DeckView 
                            cards={cards} 
                            allTags={allTags} 
                            onEditTags={setEditingCard} 
                            selectedTags={selectedTags}
                            handleTagToggle={handleTagToggle}
                        />
                    )}
                    {view === 'quiz' && (
                        <QuizView 
                            cards={cards} 
                            allTags={allTags} 
                            selectedTags={selectedTags}
                            handleTagToggle={handleTagToggle}
                        />
                    )}
                </>
            )}

            <TagEditModal 
                isOpen={!!editingCard}
                card={editingCard}
                onClose={() => setEditingCard(null)}
                onSave={handleSaveTags}
            />
        </div>
    );
}

