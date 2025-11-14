Cashflow AI – Options Strategy Backtester
Engineer Trial Assignment – Submission by Anthony Saad

Cashflow AI is a modern, lightweight options-trading backtesting platform built with ASP.NET Core 9.0 and React 19 + TypeScript.
It allows users to create and backtest strategies like credit spreads, iron condors, and single-leg options using historical SPX options data.

The goal of this project was to deliver a clean, professional, and production-ready experience for reviewing options strategies.

✨ Features
**Strategy Support

-Credit Spreads (Call/Put)

-Iron Condors (4-leg strategy)

-Single-leg options

-Strategy-aware validation

-Dynamic and flexible leg builder

**Backtesting Engine

-Historical SPX options price simulation

**Daily P/L calculation

-Intrinsic value at expiry

-Performance summary across the full period

**Performance Metrics

-Net Profit/Loss

-Return on Risk

-Win Rate

-Max Drawdown

-Best/Worst Day

-Total Winning vs Losing Days

**Frontend UI

-Tailwind CSS modern design

-Recharts visualizations

-Real-time profit/loss chart

-Responsive grid layout

-Smooth loading and error states

🛠 Tech Stack

**Backend

-ASP.NET Core 9.0 Web API

-C# 12

-CSV-based in-memory data store

-Swagger/OpenAPI documentation

-CORS enabled for local development

**Frontend

-React 19

-TypeScript 5.9

-Vite 7

-Tailwind CSS

-Recharts

Native Fetch API

### 📁 Project Structure

```bash
CashflowAi/
├── CashflowAi-Backend/
│   ├── Controllers/        — API endpoints
│   ├── Services/           — Backtesting + validation logic
│   ├── Models/             — Strategy, Leg, etc.
│   ├── Dtos/               — Request/response DTOs
│   ├── Data/               — CSV data loader
│   ├── Helpers/            — Pricing logic
│   ├── wwwroot/data/       — SPX historical data
│   └── Program.cs
│
└── CashflowAi-Frontend/
    ├── components/         — Strategy builder + results UI
    ├── types.ts            — TypeScript interfaces
    ├── api.ts              — API integration
    ├── App.tsx             — Main app
    ├── index.css           — Global styling
    └── Vite/Tailwind config
```



🚀 Getting Started
Prerequisites

Backend:

.NET 9 SDK

Visual Studio 2022, Rider, or VS Code

Frontend:

Node.js 18+

npm 9+

⚙️ Backend Setup

Navigate to backend folder:
cd CashflowAi-Backend

Run the project:
dotnet run

Backend runs on:
https://localhost:7279

Verify:

Swagger: https://localhost:7279/swagger

Health check: https://localhost:7279/health

💻 Frontend Setup

Navigate to frontend folder:
cd CashflowAi-Frontend

Install dependencies:
npm install

Start the development server:
npm run dev

App opens at:
http://localhost:5173

📧 Contact

For questions or feedback:
Email: Anthonyy.saadd@gmail.com

Subject: Engineer Work Trial – Anthony Saad

Built using ASP.NET Core, React, and TypeScript
