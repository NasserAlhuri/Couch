# Couch Challenge

A real-time multiplayer team buzzer trivia game.

## Files

```
index.html       ← Landing page
host.html        ← Host screen (game master)
player.html      ← Player buzzer (accessed via QR/link)
api/pusher.js    ← Vercel serverless function (Pusher relay)
```

## Setup

### 1. Create a free Pusher account

1. Go to [pusher.com](https://pusher.com) and sign up free
2. Create a new **Channels** app
3. Note your: **App ID**, **Key**, **Secret**, **Cluster**

### 2. Add environment variables in Vercel

In your Vercel project → Settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `PUSHER_APP_ID` | Your Pusher App ID |
| `PUSHER_KEY` | Your Pusher Key |
| `PUSHER_SECRET` | Your Pusher Secret |
| `PUSHER_CLUSTER` | Your Pusher Cluster (e.g. `eu`) |

### 3. Deploy to Vercel

Push this repo to GitHub, connect to Vercel, deploy. Done.

### 4. Start a game

1. Open `yourdomain.vercel.app/host` on a laptop/TV
2. Enter your **Pusher Key** and **Cluster** in the config screen
3. For the endpoint field enter: `https://yourdomain.vercel.app/api/pusher`
4. Set up teams and questions
5. Click **Start Game**
6. Show players the QR code — they scan, enter their name, get a buzzer!

## How it works

- Host and players connect to the same Pusher channel (`game-XXXXXX`)
- When a player buzzes, their phone POSTs to `/api/pusher` which signs and forwards the event to Pusher
- Pusher broadcasts it to the host in real time
- Host sees the answer, judges correct/wrong, game state updates for all players

## Free tier limits

Pusher free tier: 200 connections, 200k messages/day — plenty for a party game.
