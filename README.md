# Ticket Raising Platform - HelpDesk

A modern, responsive help desk and ticket management application built with Next.js, Genkit for AI features, and ShadCN for the user interface. This platform allows users to create, manage, and track support tickets through a clean and intuitive dashboard.

**Live Demo:** [Link to your deployed website here](https://your-website-link.com)

---

## Project Overview

This application provides a complete solution for managing support requests. It features a statistical dashboard, a comprehensive ticket list with filtering, a Kanban-style board to visualize workflow, and an AI-powered assistant to suggest the correct department when a new ticket is created.

---

## Key Features

- **Interactive Dashboard:** Get a quick overview of key metrics like total tickets, open tickets, in-progress tickets, and resolved tickets.
- **AI-Powered Department Suggestion:** When creating a ticket, an AI agent analyzes the problem description to suggest the most appropriate department, streamlining the routing process.
- **Comprehensive Ticket Management:** View all tickets in a filterable and searchable list. Update priority and status directly from the list view.
- **Workflow Board:** Visualize ticket progression with a drag-and-drop Kanban-style board, showing tickets categorized by status (Open, In-Progress, Resolved, Closed).
- **Detailed Ticket View:** Click on any ticket to see a full modal view with its description, history, and a section to add comments and updates.
- **Responsive Design:** A clean, modern UI built with ShadCN and Tailwind CSS that works seamlessly across desktop and mobile devices.

---

## Screenshots

All screenshots are stored in the `public/screenshots` directory and are referenced below:

### Dashboard
![Dashboard View](/screenshots/Dashboard.png)
*The main dashboard provides at-a-glance statistics and a list of recent tickets.*

### Workflow Board
![Workflow Board](/screenshots/Workflow-Board.png)
*A Kanban-style board to visualize and manage the ticket lifecycle.*

### All Tickets Page
![All Tickets Page](/screenshots/All-Tickets-Page.png)
*Search, filter, and manage all support tickets from a centralized list.*

### Create Ticket Page
![Create Ticket Page](/screenshots/Create-Ticket-Page.png)
*An intuitive form for creating new tickets, complete with an AI suggestion feature.*

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **AI/Generative:** [Google's Genkit](https://firebase.google.com/docs/genkit)
- **State Management:** React Context API
- **Form Handling:** React Hook Form with Zod for validation

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/your-repository-name.git
   ```
2. **Navigate to the project directory:**
   ```sh
   cd your-repository-name
   ```
3. **Install NPM packages:**
   ```sh
   npm install
   ```
4. **Set up environment variables:**
   - Create a `.env` file in the root of your project.
   - You will need to add your Google AI API key for Genkit to work.
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   ```

### Running the Application

1. **Start the development server:**
   ```sh
   npm run dev
   ```
2. **Open your browser** and navigate to [http://localhost:9002](http://localhost:9002).

---

## Future Plannings

This project has a solid foundation, but there are many exciting features that could be added in the future:

- **User Authentication & Roles:** Implement a full sign-up/sign-in system with different user roles (e.g., admin, agent, client) to control permissions.
- **Advanced Analytics:** Create a dedicated analytics page with charts and graphs to track ticket resolution times, agent performance, and common issue categories.
- **Email Notifications:** Integrate an email service to automatically notify users and agents of ticket updates, comments, and status changes.
- **AI-Powered Ticket Summarization:** Add a feature to generate concise AI summaries for long ticket threads to help agents quickly get up to speed.
- **Knowledge Base:** Build an integrated knowledge base or FAQ section where agents can create articles for common problems, reducing the number of new tickets.
- **Full-Featured Dark Mode:** Implement a theme toggle to switch between light and dark modes.

---
Crafted with code & music �� by Rabi Kiran 🤍
