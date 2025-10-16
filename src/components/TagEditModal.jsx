import React, { useState, useEffect } from 'react';

const TagEditModal = ({ card, isOpen, onClose, onSave }) => {
    const [tags, setTags] = useState('');

    useEffect(() => {
        if (card) {
            setTags(card.tags.join(', '));
        }
    }, [card]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(card, tags);
        onClose();
    };
    
    const handleKeyUp = (e) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Tags</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl leading-none cursor-pointer">&times;</button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Enter tags separated by commas.</p>
                <input 
                    type="text" 
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    onKeyUp={handleKeyUp}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                />
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold cursor-pointer">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold cursor-pointer">Save</button>
                </div>
            </div>
        </div>
    );
};

export default TagEditModal;

