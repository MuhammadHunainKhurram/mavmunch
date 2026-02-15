# 🍕 MavMunch - Find Free Food at UTA

A web application that helps UTA students discover free food events on campus by parsing MavEngage's discovery API.

## Features

✨ **Core Features:**
- **Real-time Event Discovery** - Automatically fetches free food events from MavEngage for the next 30 days
- **Smart Filtering** - Filter events by organization with event counts
- **Flexible Sorting** - Sort by date (soonest/latest), organization name, or event name
- **Responsive Design** - Beautiful, mobile-first design that works on all devices
- **Direct Links** - One-click access to full event details on MavEngage

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **API:** MavEngage Discovery API

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## Build & Deploy

### Local Build

```bash
npm run build
npm start
```

### Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Deploy (automatic)

3. **Custom Domain (Optional)**
   - In Vercel project settings, add your domain
   - Update DNS records as instructed

## API Details

### MavEngage Discovery API

**Endpoint:** `https://mavengage.uta.edu/api/discovery/event/search`

**Query Parameters:**
- `endsAfter` - ISO 8601 datetime (start date)
- `orderByField` - 'startsOn' or 'endsOn'
- `orderByDirection` - 'ascending' or 'descending'
- `status` - 'Approved'
- `take` - Number of results (default: 200)
- `benefitNames[0]` - 'FreeFood' (filters for free food only)

## File Structure

```
mavmunch/
├── app/                 # Pages and layout
├── components/          # React components
├── lib/                 # Utilities and API
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.ts   # Tailwind configuration
└── README.md            # This file
```

## Environment Variables

No environment variables required! This MVP works directly with public APIs.

## Testing Checklist

- [x] Events load correctly from API
- [x] Filter by organization works
- [x] Sort options work correctly
- [x] Responsive on mobile, tablet, desktop
- [x] Links open correctly
- [x] Empty state displays when needed
- [x] Error handling in place
- [x] Date range is 30 days from current time

## Troubleshooting

### Events not loading?
- Check your internet connection
- Verify MavEngage API is accessible
- Check browser console for errors

### Styling looks wrong?
- Make sure Tailwind CSS is properly installed
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### Build issues?
- Delete `node_modules` and `.next`
- Run `npm install` again
- Try `npm run build`

## Future Features

- 🗺️ **Map View** - Show event locations on an interactive map
- 📊 **Leaderboard** - Track which organizations host the most free food events
- 📅 **Calendar View** - Alternative calendar-based event display
- 🔔 **Notifications** - Email/SMS alerts for new events
- 👤 **User Accounts** - Save favorite organizations and personalized recommendations

## License

Created for UTA students. Built with ❤️.

## Support

For issues or questions, check the code comments and documentation files provided.

---

**Ready to find some free food?** 🍕

```bash
npm run dev
```

Happy eating! 🎉
