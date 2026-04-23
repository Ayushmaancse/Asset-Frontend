# Asset Tracker

### 1. What is this?
This is a minimalist CRUD (Create, Read, Update, Delete) dashboard built for Asset Tracking. It allows team members to track animation assets, toggle their approval status, and view a live system diagnostic report.

### 2. Steps to Setup
To run this project on your machine, follow these simple steps:

1.  **Extract the files** into a folder.
2.  **Open your terminal** and navigate to that folder.
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Run the application**:
    ```bash
    npm run dev
    ```
5.  **Open your browser** and go to `http://localhost:3000`.

*Note: Make sure your Flask backend is running on port 5002.*

### 3. About the APIs
The dashboard communicates with a Flask backend at `http://127.0.0.1:5002` using these professional REST endpoints:

*   **GET `/api/assets`**: Fetches the list of all animation assets.
*   **POST `/api/assets`**: Used to add a new asset to the tracker.
*   **PUT `/api/assets/<id>`**: Used to toggle the status (Pending/Approved) of an asset.
*   **DELETE `/api/assets/<id>`**: Used to permanently remove an asset record.
*   **GET `/api/run-tests`**: Fetches the diagnostic "Test Case Data" (Arguments & Outcomes).

### 4. How the Architecture Looks
I have kept the architecture "Surgical and Clean." 
*   **Next.js (App Router)**: I use the latest standard of Next.js (`src/app`) to ensure the project is modern and high-performance.
*   **Single-Page Logic**: All the core logic is kept in `page.tsx`. This makes the entire flow extremely easy to read in one scroll without jumping between different files.
*   **Client-Side State**: I use React Hooks (`useState`, `useEffect`) to handle data updates instantly without refreshing the page.

### 5. Design Patterns & Tradeoffs
*   **Pattern: "Surgical Backend Alignment"**
    *   Instead of using heavy libraries, I wrote raw `fetch` calls. This gives me 100% control over how I handle your specific backend data keys (`Arguments`, `Outcome`).
*   **Tradeoff: Inline Styles vs. CSS Modules**
    *   I chose **Inline Styles** inside `page.tsx` instead of using a separate CSS file. 
    *   **Why?** It ensures a faster "Blank Look" setup and guarantees that the dashboard renders exactly as I intended, without any external CSS files getting lost or cached.
*   **Tradeoff: Single File vs. Folders**
    *   I chose to keep the code in one file rather than splitting it into multiple component folders.
    *   **Why?** For a simple CRUD app, "Folder-wise" structure is often over-engineering. Keeping it in one clean file makes the logic much more transparent and easier to understand in one glance.
