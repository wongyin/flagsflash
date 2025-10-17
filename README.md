# Flag Flashcards

![Flag Flashcards Main Graphic](public/favicon.png)

A fun and interactive web application to help you learn and memorize country flags from around the world. Test your knowledge in quiz mode or browse through the flag deck at your own pace. Customize tags, filter by regions, colors, or track your learning progress with "Correctly Answered" flags!

## ✨ Features

* **Extensive Flag Deck:** Browse through a comprehensive collection of country flags from the REST Countries API.
* **Interactive Flashcards:** Click any flag card to flip it and reveal the country's name and associated tags.
* **Quiz Mode:** Test your knowledge! Guess the country name based on its flag and get instant feedback.
* **Progress Tracking:** Flags you answer correctly in Quiz Mode are marked with a green checkmark on the card's front face. This progress is saved locally in your browser.
* **Customizable Tags:**
    * Each flag comes with predefined tags (e.g., region, subregion, flag colors, patterns like "stripes" or "cross").
    * Edit tags for any flag directly from its card's back face. Your custom tags are saved locally.
* **Dynamic Filtering:**
    * Filter the deck or quiz questions by selecting multiple tags (e.g., "Europe", "red", "star").
    * Special filter options: "Correctly Answered" and "Not Yet Answered" flags, allowing you to focus on what you need to learn.
* **Dark Mode / Light Mode:** Toggle between themes for comfortable viewing in any environment. Your preferred theme is saved locally.
* **Responsive Design:** Enjoy a seamless experience on various devices, from desktops to mobile phones.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm (Node Package Manager) installed on your system.

* [Node.js (includes npm)](https://nodejs.org/en/download/)

### Installation

1.  **Clone the repository (or set up the files):**
    If you're starting from scratch, create a new React project (e.g., using Vite or Create React App) and then place the provided files into their respective locations.

    For example, with Vite:
    ```bash
    npm create vite@latest flag-flashcards -- --template react
    cd flag-flashcards
    # Delete src/App.css, src/assets/react.svg, etc. if you want a clean slate
    ```
    Then, ensure your project structure matches:
    ```
    flag-flashcards/
    ├── public/
    │   └── favicon.ico  # Your favicon
    ├── src/
    │   ├── assets/
    │   │   └── images/
    │   │       └── logo.png       # Your logo image
    │   │       └── main-graphic.png # Your main graphic image
    │   ├── components/
    │   │   ├── Card.jsx
    │   │   ├── DeckView.jsx
    │   │   ├── Header.jsx
    │   │   ├── Loader.jsx
    │   │   ├── QuizView.jsx
    │   │   └── TagEditModal.jsx
    │   ├── constants.js
    │   └── App.jsx
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js # Ensure this file exists for Tailwind
    └── vite.config.js   # Or create-react-app's config files
    ```
    *(Note: This project assumes Tailwind CSS is configured. Ensure `tailwind.config.js`, `postcss.config.js`, and Tailwind directives in your CSS (e.g., `index.css`) are set up correctly.)*

2.  **Install dependencies:**
    Navigate into your project directory and install all required Node.js packages, including Tailwind CSS.

    ```bash
    cd flag-flashcards
    npm install
    ```

3.  **Add Favicon to `public/index.html`:**
    Ensure your `public/index.html` file includes a link to your favicon within the `<head>` section:
    ```html
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    ```
    (Adjust `favicon.ico` to `favicon.png` if you're using the PNG format).

### Running the application

To run the application in development mode:

```bash
npm run dev
# or npm start if you are using Create React App