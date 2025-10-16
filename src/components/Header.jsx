import React from 'react';

const SunIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const Header = ({ theme, toggleTheme }) => (
    <header className="relative text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Flag Flashcards</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Learn the flags of the world. Click a card to flip it!</p>
        <button onClick={toggleTheme} className="absolute top-0 right-0 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
    </header>
);

export default Header;
