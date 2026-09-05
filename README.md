# RepoLens

### AI-Powered GitHub Repository Intelligence Platform

RepoLens is a full-stack web application designed to analyze GitHub repositories and transform repository data into actionable engineering insights.

It evaluates repository health, development activity, community engagement, documentation quality, and potential risks, while using AI to generate intelligent recommendations for improving project quality.

---

## Overview

Understanding the health and quality of a GitHub repository often requires reviewing multiple metrics and manually interpreting repository activity.

**RepoLens simplifies this process by providing a centralized analysis dashboard that combines GitHub data, repository metrics, and AI-powered insights.**

---

## Core Features

* **Repository Health Analysis** — Evaluates the overall health and quality of a repository.
* **Activity Analysis** — Analyzes repository development and contribution activity.
* **Community Insights** — Evaluates contributors and collaboration-related metrics.
* **Risk Analysis** — Identifies potential repository risks and areas requiring attention.
* **README Evaluation** — Assesses the quality and completeness of repository documentation.
* **Language Analysis** — Visualizes programming language distribution.
* **AI-Powered Recommendations** — Generates intelligent, actionable suggestions using AI.
* **Analysis History** — Stores and retrieves previous repository analysis results.
* **User Authentication** — Provides secure registration, login, and protected application routes.
* **Interactive Dashboard** — Presents repository insights through structured metrics and visualizations.

---

## Technology Stack

| Layer          | Technologies                                     |
| -------------- | ------------------------------------------------ |
| Frontend       | React.js, JavaScript, Bootstrap, Recharts, Axios |
| Backend        | Node.js, Express.js                              |
| Database       | MongoDB, MongoDB Atlas                           |
| APIs           | GitHub REST API                                  |
| AI             | OpenAI API                                       |
| Authentication | Token-based Authentication                       |
| Development    | Git, GitHub, VS Code, Postman                    |

---

## System Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │   Analysis Dashboard│
                    └──────────┬──────────┘
                               │
                              API
                               │
                    ┌──────────▼──────────┐
                    │    Node.js /        │
                    │    Express Server   │
                    └───────┬─────┬───────┘
                            │     │
                ┌───────────┘     └────────────┐
                ▼                              ▼
       ┌────────────────┐             ┌────────────────┐
       │   GitHub API   │             │   OpenAI API   │
       └────────────────┘             └────────────────┘
                │                              │
                └──────────────┬───────────────┘
                               ▼
                    ┌─────────────────────┐
                    │       MongoDB       │
                    │ Analysis & User Data│
                    └─────────────────────┘
```

---

## Repository Analysis

RepoLens generates insights using multiple repository indicators:

| Metric                | Purpose                            |
| --------------------- | ---------------------------------- |
| Health Score          | Overall repository health          |
| Activity Score        | Development activity               |
| Community Score       | Collaboration and engagement       |
| Risk Score            | Potential repository risks         |
| README Score          | Documentation quality              |
| AI Insights           | AI-generated recommendations       |
| Language Distribution | Technology usage                   |
| Contributor Analysis  | Contribution information           |
| Overall Grade         | Consolidated repository evaluation |

---

## AI-Powered Analysis

RepoLens integrates AI to convert repository metrics into developer-friendly recommendations.

The AI layer can provide insights related to:

* Repository quality
* Documentation improvements
* Development practices
* Potential risks
* Project maintainability
* Recommended improvements

This allows developers to move beyond raw GitHub statistics and obtain **actionable engineering insights**.

---

## Project Structure

```text
RepoLens/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

* Node.js
* npm
* MongoDB or MongoDB Atlas
* Git

### Clone

```bash
git clone https://github.com/sakshishirole09/RepoLens.git
cd RepoLens
```

### Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GITHUB_TOKEN=your_github_token
OPENAI_API_KEY=your_openai_api_key
```

Start the server:

```bash
npm start
```

### Frontend

Open a new terminal:

```bash
cd client
npm install
npm start
```

> **Security:** Never commit `.env` files, API keys, database credentials, or other secrets to the repository.

---

## Future Scope

* Automated code quality analysis
* Security vulnerability detection
* Pull Request analysis
* AI-powered automated code review
* Repository comparison
* GitHub Actions integration
* Continuous repository monitoring
* Advanced repository reporting
* Enhanced AI-based developer recommendations

---

## Screenshots

Add application screenshots here to demonstrate:

* Dashboard
* Repository analysis
* AI insights
* Analysis history
* Authentication screens

---

## Author

**Sakshi Shirole**

MSc Computer Science | Full-Stack Web Developer

**Technical Interests:**
React.js · Node.js · Express.js · MongoDB · PHP · CodeIgniter · AI

---

## License

This project is developed for educational and portfolio purposes.
