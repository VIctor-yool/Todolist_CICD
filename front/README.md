# Princess Todo List

A magical princess-themed todo list application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✅ Todo CRUD operations (Create, Read, Update, Delete)
- ✅ Complete/Incomplete toggle
- ✅ Subtask support
- ✅ Drag & Drop reordering
- ✅ Optimistic UI updates
- ✅ Weekly calendar view
- ✅ Date-based filtering
- ✅ Digital clock
- ✅ Dark/Light mode toggle
- ✅ Princess-themed UI with magical colors

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Date Handling**: Day.js
- **Drag & Drop**: react-beautiful-dnd

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── todo/        # Todo-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and API client
├── store/           # Zustand state management
└── types/           # TypeScript type definitions
```

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:3001/api)

## Backend Requirements

The frontend expects a backend API with the following endpoints:

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a todo by ID
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `PUT /api/todos/reorder` - Reorder todos

## License

MIT

