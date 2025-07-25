# PlanMyDay AI Scheduler

<!-- <p align="center">
  <img src="https://raw.githubusercontent.com/spriha27/PlanMyDay/main/public/planmyday-demo.png" alt="PlanMyDay Application Demo" width="700"/>
</p> -->

**PlanMyDay** is a full-stack web application that acts as an intelligent, AI-powered daily schedule planner. It provides a guided, multi-step user experience to generate, refine, and finalize a complete daily schedule. Users specify a time range and list their tasks, and the AI constructs a detailed, logical plan that can be edited and exported.

This project was born out of my need to be able to schedule my day around my classes, tech networking events, internship, my office hours as part of my job for being a course manager for undergrads, my assignments, capstone project, homework etc., etc. This tool helped me to visualise my day and decide my priorities based on the commitments I had for the day.

**Live Application:** [**https://planmyday-z9r3.onrender.com/**](https://planmyday-z9r3.onrender.com/) *(Note: Free-tier backend may take 30-60 seconds to "wake up" on the first request.)*

---

## Key Features

-   **Guided Schedule Generation:** A step-by-step process asks for the user's active time range and a list of tasks, ensuring structured and relevant input for the AI.
-   **Intelligent AI Planning:** Leverages OpenAI's `gpt-4o-mini` to not only schedule user-defined tasks but also to logically fill empty time slots, creating a balanced and complete full-day plan.
-   **Conversational Refinement:** After the initial schedule is generated, users can make major revisions through a chat-like interface (e.g., "replace my morning study block with a trip to the gym").
-   **Detailed Manual Editor:** A dedicated editor allows users to make fine-grained adjustments to the AI-generated schedule, including changing event titles, descriptions, and exact start/end times.
-   **.ics Export:** The finalized schedule can be downloaded as an `.ics` file, which is a universal calendar format compatible with Google Calendar, Apple Calendar, and Outlook.
-   **Modern & Responsive UI:** Built with React and styled with Tailwind CSS, featuring a sleek, dark, "galaxy" theme that is fully responsive.

---

## Tech Stack

This application follows a modern, decoupled full-stack architecture.

-   **Frontend:**
    -   **Framework:** React (bootstrapped with Vite)
    -   **Language:** TypeScript
    -   **Styling:** Tailwind CSS
    -   **Icons:** Lucide React

-   **Backend:**
    -   **Framework:** Express.js on Node.js
    -   **Language:** TypeScript
    -   **AI Integration:** Official `openai` Node.js library

-   **Deployment & Hosting:**
    -   **Provider:** Render
    -   **Backend:** Deployed as a Node.js Web Service.
    -   **Frontend:** Deployed as a Static Site, served via Render's CDN.

---

## Getting Started

To run this project locally, you will need Node.js and npm installed.

### 1. Clone the Repository

```bash
git clone https://github.com/YourUsername/planmyday-app.git
cd planmyday-app
```

### 2. Install Dependencies
Install the required packages for both the frontend and backend.

```bash
npm install
```

### 3. Set Up Environment Variables
You need an OpenAI API key to use the AI features.
- Create a new file named .env in the root of the project folder.
- Add your OpenAI API key to this file:

```bash
# .env
OPENAI_API_KEY=sk-YourSecretOpenAIApiKeyGoesHere
```

### 3. Run the Application
This project requires two terminal windows to run both the backend server and the frontend development server simultaneously.
- **Terminal 1: Start the Backend Server**
This command starts the Express server using nodemon, which will automatically restart on file changes.
    ```bash
    npm run serve:watch
    ```
  You should see the output: [server]: Server is running at http://localhost:8080

- **Terminal 2: Start the Frontend Server**
This command starts the Vite development server for the React app.

  ```bash
  npm run dev
  ```
You can now access the application in your browser at http://localhost:5173.

---

## Deployment

This project is deployed on **Render** using its free tier, with the frontend and backend managed as two separate services.

-   **Backend (Web Service):**
    -   **Repository:** The GitHub repo is connected to a "Web Service" on Render.
    -   **Build Command:** `npm install && npm run build:server`
    -   **Start Command:** `npm start`
    -   **Environment:** The `OPENAI_API_KEY` is set as a secret environment variable in the Render dashboard. The server is configured to use the `PORT` variable provided by Render.

-   **Frontend (Static Site):**
    -   **Repository:** The same GitHub repo is connected to a "Static Site" on Render.
    -   **Build Command:** `npm run build`
    -   **Publish Directory:** `dist`
    -   **Configuration:** The frontend is configured to make API calls to the live backend URL (`https://planmyday-backend.onrender.com`).

Changes pushed to the `main` branch on GitHub automatically trigger new deployments for both services on Render.

---

## Future Enhancements

-   [ ] **Direct Calendar Sync:** Implement OAuth to allow users to connect their Google or Outlook calendars directly, enabling two-way sync of events.
-   [ ] **User Accounts & Saved Schedules:** Add authentication (e.g., using Clerk, Supabase, or Auth0) to allow users to save, view, and edit past and future schedules.
-   [ ] **Task Prioritization:** Allow users to assign priority levels to tasks (e.g., High, Medium, Low), and instruct the AI to schedule high-priority items during peak productivity hours.
-   [ ] **Recurring Events:** Add the ability for users to specify recurring events (e.g., "Go to the gym every Monday, Wednesday, Friday at 8am").
-   [ ] **Mobile Application:** Develop a native or cross-platform mobile app (e.g., using React Native) for a better on-the-go experience.
-   [ ] **Template-based Scheduling:** Allow users to save a schedule as a template (e.g., "My Ideal Workday") and apply it to a new day.
