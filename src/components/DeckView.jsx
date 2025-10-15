import React, { useState } from 'react';
import Card from './Card';

const DeckView = ({ cards, allTags, onEditTags }) => {
    const [selectedTag, setSelectedTag] = useState('all');
    
    const filteredCards = selectedTag === 'all'
        ? cards
        : cards.filter(card => card.tags.includes(selectedTag));

    return (
        <div>
            <div className="mb-6 flex justify-center">
                <select 
                    value={selectedTag}
                    onChange={e => setSelectedTag(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Tags</option>
                    {allTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredCards.map(card => (
                    <Card key={card.id} card={card} onEditTags={onEditTags} />
                ))}
            </div>
        </div>
    );
};

export default DeckView;
