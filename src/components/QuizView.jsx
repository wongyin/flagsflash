import React, { useState, useEffect, useCallback, useRef } from 'react';

const QuizView = ({ cards, allTags, selectedTags, handleTagToggle }) => {
    const [quizDeck, setQuizDeck] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [attempted, setAttempted] = useState(0);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const inputRef = useRef(null);

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const startQuiz = useCallback(() => {
        let filteredCards = cards;
        if (selectedTags.length > 0) {
            filteredCards = cards.filter(card => selectedTags.every(tag => card.tags.includes(tag)));
        }
        
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
    }, [cards, selectedTags]);

    useEffect(() => {
        startQuiz();
    }, [startQuiz]);

    const nextQuestion = useCallback(() => {
        if (currentQuestionIndex < quizDeck.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setFeedback('Quiz complete! Restarting...');
            setTimeout(startQuiz, 2000);
            return;
        }
        setIsAnswered(false);
        setFeedback('');
        setAnswer('');
    }, [currentQuestionIndex, quizDeck.length, startQuiz]);

    const checkAnswer = () => {
        if (!answer || !quizDeck[currentQuestionIndex]) return;
        const correctAnswer = quizDeck[currentQuestionIndex].name;
        if (answer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
            setFeedback('Correct!');
            setScore(s => s + 1);
        } else {
            setFeedback(`Wrong! It was ${correctAnswer}`);
        }
        setAttempted(a => a + 1);
        setIsAnswered(true);
    };
    
    useEffect(() => {
        const handleGlobalEnter = (e) => {
            if (e.key === 'Enter' && isAnswered) {
                nextQuestion();
            }
        };
        document.addEventListener('keyup', handleGlobalEnter);
        return () => {
            document.removeEventListener('keyup', handleGlobalEnter);
        };
    }, [isAnswered, nextQuestion]);

    useEffect(() => {
        if (inputRef.current && !isAnswered) {
            inputRef.current.focus();
        }
    }, [currentQuestionIndex, isAnswered]);


    const handleInputKeyUp = (e) => {
        if (e.key === 'Enter' && !isAnswered) {
            e.stopPropagation(); // Prevent the global listener from firing
            checkAnswer();
        }
    };

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
                                onClick={() => handleTagToggle(tag)}
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
                    <input ref={inputRef} type="text" value={answer} onChange={e => setAnswer(e.target.value)} onKeyUp={handleInputKeyUp} disabled={isAnswered} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter country name..." />
                    {!isAnswered ? (
                        <button onClick={checkAnswer} className="w-full mt-4 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 cursor-pointer">Submit</button>
                    ) : (
                        <button onClick={nextQuestion} className="w-full mt-4 px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 cursor-pointer">Next Flag</button>
                    )}
                    <div className={`mt-4 h-6 text-lg font-semibold ${feedback.startsWith('Correct') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{feedback}</div>
                    <div className="mt-2 text-gray-600 dark:text-gray-400">Score: {score} / {attempted}</div>
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 p-4">No flags match the selected filters.</p>
            )}
        </div>
    );
};

export default QuizView;

