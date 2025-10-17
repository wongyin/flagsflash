import React, { useState, useEffect, useCallback, useRef } from 'react';

const QuizView = ({ cards, allTags, selectedTags, handleTagToggle, onCorrectAnswer, correctAnswers, specialTags }) => {
    // --- Quiz State ---
    const [quizDeck, setQuizDeck] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [attempted, setAttempted] = useState(0);
    
    // --- UI State ---
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    
    // --- Refs for DOM elements ---
    const inputRef = useRef(null);
    const actionButtonRef = useRef(null); 

    // --- State to force quiz re-initialization (e.g., when filters change) ---
    const [quizTriggerKey, setQuizTriggerKey] = useState(0); 

    // --- Refs to hold latest props stably for callbacks without triggering re-renders ---
    const cardsRef = useRef(cards);
    const selectedTagsRef = useRef(selectedTags);
    const correctAnswersRef = useRef(correctAnswers);
    const specialTagsRef = useRef(specialTags);

    // Effect to keep refs updated with latest props.
    // This runs on every render where these props might have changed.
    useEffect(() => { 
        cardsRef.current = cards; 
        selectedTagsRef.current = selectedTags;
        correctAnswersRef.current = correctAnswers;
        specialTagsRef.current = specialTags;
    }, [cards, selectedTags, correctAnswers, specialTags]);
    // --- End Refs Update ---

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    /**
     * Creates and sets a new quiz deck based on current filters and resets quiz progress.
     * This function's reference is stable, allowing it to be a dependency for other effects
     * without causing unintended re-runs based on its internal data dependencies.
     */
    const createNewQuizDeck = useCallback(() => {
        const currentCards = cardsRef.current;
        const currentSelectedTags = selectedTagsRef.current;
        const currentCorrectAnswers = correctAnswersRef.current;
        const currentSpecialTags = specialTagsRef.current;

        const regularTags = currentSelectedTags.filter(t => !Object.values(currentSpecialTags).includes(t));
        
        let filteredCards = currentCards.filter(card => {
            const isCardCorrectlyAnswered = currentCorrectAnswers.includes(card.id); 
            if (currentSelectedTags.includes(currentSpecialTags.CORRECT) && !isCardCorrectlyAnswered) return false;
            if (currentSelectedTags.includes(currentSpecialTags.INCORRECT) && isCardCorrectlyAnswered) return false;
            return regularTags.every(tag => card.tags.includes(tag));
        });
        
        if (filteredCards.length > 0) {
            setQuizDeck(shuffleArray(filteredCards));
            setCurrentQuestionIndex(0);
        } else {
            setQuizDeck([]);
            setCurrentQuestionIndex(-1);
        }

        setScore(0);
        setAttempted(0);
        setIsAnswered(false); 
        setFeedback('');
        setAnswer('');
    }, []); // Empty dependency array: this function's reference is stable

    /**
     * Effect to initialize the quiz deck on component mount or when filters explicitly change.
     * This is the controlled trigger for `createNewQuizDeck`.
     */
    useEffect(() => {
        if (cards.length > 0) {
            createNewQuizDeck();
        }
    }, [cards.length, quizTriggerKey, createNewQuizDeck]); 

    /**
     * Handles toggling a tag and explicitly restarts the quiz to apply new filters.
     */
    const handleTagToggleAndRestart = useCallback((tag) => {
        handleTagToggle(tag); 
        setQuizTriggerKey(prev => prev + 1); // Increment key to trigger `createNewQuizDeck`
    }, [handleTagToggle]);

    /**
     * Advances to the next question or restarts the quiz if at the end.
     */
    const goToNextQuestion = useCallback(() => {
        if (currentQuestionIndex < quizDeck.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setFeedback('Quiz complete! Restarting...');
            setTimeout(() => {
                setQuizTriggerKey(prev => prev + 1); // Trigger full quiz restart
            }, 2000); 
            return;
        }
        setIsAnswered(false); 
        setFeedback('');
        setAnswer('');
    }, [currentQuestionIndex, quizDeck.length, setQuizTriggerKey]); 

    /**
     * Checks the user's answer against the current card's name.
     */
    const checkAnswer = useCallback(() => {
        if (!answer.trim() || isAnswered || !quizDeck[currentQuestionIndex]) {
            return;
        }
        
        const currentCard = quizDeck[currentQuestionIndex];
        const correctAnswer = currentCard.name;
        
        let correctGuess = answer.trim().toLowerCase() === correctAnswer.toLowerCase();

        if (correctGuess) {
            setFeedback('Correct!');
            setScore(s => s + 1);
            onCorrectAnswer(currentCard.id); // Updates parent state, but won't reset QuizView.
            setAttempted(a => a + 1);
            setIsAnswered(true); 
        } else {
            setFeedback(`Wrong! It was ${correctAnswer}`);
            setAttempted(a => a + 1);
            setIsAnswered(true); 
        }
    }, [answer, isAnswered, quizDeck, currentQuestionIndex, onCorrectAnswer]);
    
    /**
     * Manages focus between input and action button based on quiz state.
     */
    useEffect(() => {
        if (quizDeck.length === 0 || currentQuestionIndex === -1) return;

        const timer = setTimeout(() => {
            if (isAnswered && actionButtonRef.current) {
                actionButtonRef.current.focus();
            } else if (!isAnswered && inputRef.current) {
                inputRef.current.focus();
            }
        }, 50); 
        return () => clearTimeout(timer);
    }, [isAnswered, currentQuestionIndex, quizDeck.length]);

    /**
     * Handles 'Enter' key press on the input field for submitting answer.
     */
    const handleInputKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            if (!isAnswered) { 
                checkAnswer();
            }
        }
    }, [isAnswered, checkAnswer]);

    /**
     * Handles 'Enter' key press on the action button for advancing.
     */
    const handleActionButtonKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isAnswered) { 
                goToNextQuestion();
            }
        }
    }, [isAnswered, goToNextQuestion]);

    const currentCard = quizDeck[currentQuestionIndex];

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Quiz Time!</h2>
            
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
                    <h3 className="font-semibold mb-2 text-center">Select tags to filter quiz:</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                        {allTags.map(tag => (
                            <button 
                                key={tag}
                                onClick={() => handleTagToggleAndRestart(tag)} 
                                className={`tag-filter-btn px-3 py-1 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer ${selectedTags.includes(tag) ? 'selected' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {currentCard ? (
                <div className="text-center">
                    <div className="bg-gray-200 dark:bg-gray-700 h-48 flex items-center justify-center rounded-lg mb-4 shadow-inner">
                        <img src={currentCard.flagUrl} alt="Country Flag" className="max-h-full max-w-full h-auto w-auto border-4 border-white rounded shadow-md" />
                    </div>
                    <input 
                        ref={inputRef} 
                        type="text" 
                        value={answer} 
                        onChange={e => setAnswer(e.target.value)} 
                        onKeyDown={handleInputKeyDown} 
                        disabled={isAnswered} 
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="Enter country name..." 
                    />
                    <button 
                        ref={actionButtonRef} 
                        onClick={isAnswered ? goToNextQuestion : checkAnswer} 
                        onKeyDown={handleActionButtonKeyDown} 
                        className={`w-full mt-4 px-6 py-3 font-bold rounded-lg shadow-md cursor-pointer ${!isAnswered ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                    >
                        {!isAnswered ? 'Submit' : 'Next Flag'}
                    </button>
                    <div className={`mt-4 h-6 text-lg font-semibold ${feedback.startsWith('Correct') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{feedback}</div>
                    <div className="mt-2 text-gray-600 dark:text-gray-400">Score: {score} / {attempted}</div>
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 p-4">
                    {cards.length === 0 ? "Loading flags..." : "No flags match the selected filters. Adjust your tags or restart the quiz."}
                </p>
            )}
        </div>
    );
};

export default QuizView;