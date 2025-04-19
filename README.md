# Quizzz

## AI-Powered Quiz Generation

Quizzz is a Next.js application that leverages AI to generate custom quiz questions. Users can input a prompt, and the AI will render quiz content, providing an efficient and interactive way to create educational or engaging content.

## Demo

![Quizzz App Preview](https://github.com/yourusername/quizzz-nexjs/raw/main/public/app-preview.png)

*AI-powered quiz generation with a clean, modern interface*


## Features

- AI-generated quiz questions
- Internationalization support
- Firebase integration for authentication and data storage
- Modern UI with Tailwind CSS
- Mobile-responsive design

## Tech Stack

- [Next.js 15](https://nextjs.org/) with App Router
- [React 19](https://react.dev/)
- [Firebase](https://firebase.google.com/) for backend and authentication
- [TailwindCSS 4](https://tailwindcss.com/) for styling
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Next-intl](https://next-intl-docs.vercel.app/) for internationalization

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quizzz-nexjs.git
   cd quizzz-nexjs
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Copy the example environment file and configure your environment variables:
   ```bash
   cp .env-exam .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

The application can be deployed to Vercel or using Docker with Fly.io:

### Vercel Deployment

Deploy directly to Vercel:
```bash
npx vercel
```

### Docker Deployment

1. Build Docker image:
   ```bash
   docker build -t quizzz-nexjs .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 quizzz-nexjs
   ```

## License

[MIT](LICENSE)
