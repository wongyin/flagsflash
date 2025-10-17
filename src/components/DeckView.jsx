import React, { useState } from 'react';
import Card from './Card.jsx';

const DeckView = ({ cards, allTags, onEditTags, selectedTags, handleTagToggle, correctAnswers, specialTags }) => {
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    
    const filteredCards = cards.filter(card => {
        if (selectedTags.length === 0) return true;

        const isCorrect = correctAnswers.includes(card.id);
        const regularTags = selectedTags.filter(t => !Object.values(specialTags).includes(t));

        if (selectedTags.includes(specialTags.CORRECT) && !isCorrect) return false;
        if (selectedTags.includes(specialTags.INCORRECT) && isCorrect) return false;
        
        return regularTags.every(tag => card.tags.includes(tag));
    });

    return (
        <div>
            <div className="text-center mb-4">
                <button
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
                >
                    {isFilterVisible ? 'Hide Filters' : 'Filter by Tags'}
                </button>
            </div>

            {isFilterVisible && (
                <div className="mb-6 border-t border-b border-gray-200 dark:border-gray-700 py-4">
                    <h3 className="font-semibold mb-2 text-center">Select tags to filter deck:</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                        {allTags.map(tag => (
                            <button 
                                key={tag}
                                onClick={() => handleTagToggle(tag)}
                                className={`tag-filter-btn px-3 py-1 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer ${selectedTags.includes(tag) ? 'selected' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredCards.map(card => (
                    <Card 
                        key={card.id} 
                        card={card} 
                        onEditTags={onEditTags} 
                        isCorrect={correctAnswers.includes(card.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default DeckView;