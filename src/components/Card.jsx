import React, { useState } from 'react';

const CheckmarkIcon = () => (
    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Card = ({ card, onEditTags, isCorrect }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-1 perspective-[1000px] h-64 flex flex-col">
            <div 
                className={`relative w-full h-full flag-card ${isFlipped ? 'is-flipped' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* Front Face */}
                <div className="card-face flex items-center justify-center">
                    {isCorrect && (
                        <div className="absolute top-2 right-2 bg-white rounded-full p-0.5">
                            <CheckmarkIcon />
                        </div>
                    )}
                    <img src={card.flagUrl} alt={`Flag of ${card.name}`} className="max-h-full max-w-full h-auto w-auto rounded-md border border-gray-200 shadow-md" />
                </div>
                {/* Back Face */}
                <div className="card-face card-back bg-gray-800 text-white rounded-lg p-4 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-xl text-center mb-2">{card.name}</h3>
                        <div className="tags-display flex flex-wrap gap-2 justify-center">
                            {card.tags.map(tag => (
                                <span key={tag} className="tag bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">{tag}</span>
                            ))}
                        </div>
                    </div>
                    <button 
                        className="edit-tags-btn text-sm text-blue-300 hover:text-blue-100 self-center mt-2 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent card from flipping
                            onEditTags(card);
                        }}
                    >
                        Edit Tags
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;