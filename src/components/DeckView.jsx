import React, { useState } from 'react';
import Card from './Card.jsx';

const DeckView = ({ cards, allTags, onEditTags, selectedTags, handleTagToggle }) => {
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    
    const filteredCards = selectedTags.length === 0
        ? cards
        : cards.filter(card => selectedTags.every(tag => card.tags.includes(tag)));

    return (
        <div>
            <div className="text-center mb-4">
                <button
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                                className={`tag-filter-btn px-3 py-1 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 ${selectedTags.includes(tag) ? 'selected' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredCards.map(card => (
                    <Card key={card.id} card={card} onEditTags={onEditTags} />
                ))}
            </div>
        </div>
    );
};

export default DeckView;

