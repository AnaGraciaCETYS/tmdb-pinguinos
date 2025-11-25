# Movie Streaming App (Netflix-like)

A modern movie streaming web application built with Vue 3, featuring TMDB API integration and Firebase authentication.

## Features

- Browse popular, top-rated, now playing, and upcoming movies
- Search movies
- User authentication with Firebase
- Responsive design
- Modern UI/UX

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management for Vue
- **Firebase** - Authentication and database
- **Axios** - HTTP client for API requests
- **TMDB API** - The Movie Database API

## Project Structure

```
src/
├── components/     # Reusable Vue components
├── views/          # Page components (routes)
├── stores/         # Pinia stores (state management)
├── services/       # API services (TMDB, Firebase)
├── composables/    # Vue composables (reusable logic)
├── utils/          # Utility functions
├── config/         # Configuration files (Firebase, etc.)
└── assets/         # Static assets (CSS, images)
```

## Setup Instructions

### 1. Install Dependencies

```sh
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory (use `env.example` as a template):

```env
# TMDB API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Get API Keys

- **TMDB API**: Get your API key from [TMDB](https://www.themoviedb.org/settings/api)
- **Firebase**: Create a project at [Firebase Console](https://console.firebase.google.com/) and get your config

### 4. Run Development Server

```sh
npm run dev
```

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
