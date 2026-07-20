# Draft Buddy

A WhatsApp-style PWA for storing drafts such as movie names, shopping lists, locations to visit, etc.

## Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable Email/Password authentication.
3. Create a Firestore database (start in test mode for development).
4. Copy your Firebase config and add to a `.env` file in the root of the project (use `.env.example` as a template).

## Install dependencies

```bash
npm install
```

## Run the development server

```bash
npm run dev
```

## Build for production

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```
