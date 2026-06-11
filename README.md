# 🍕 MavMunch - Find Free Food at UTA

A web application that helps UTA students discover free food events on campus by parsing MavEngage's discovery API and displaying them in a beautiful, easy-to-use interface.

## Features

 **Core Features:**
- **Real-time Event Discovery** - Automatically fetches free food events from MavEngage for the next 60 days
- **Smart Filtering** - Filter events by organization with event counts
- **Flexible Sorting** - Sort by date (soonest/latest), organization name, or event name
- **Time-Based Grouping** - Events automatically grouped by Today, Tomorrow, This Week, This Month, and Later (when sorted by date)
- **Days Until Badge** - Shows "Today", "Tomorrow", or "In X days" for each event
- **Responsive Design** - Beautiful, mobile-first design that works on all devices
- **Direct Links** - One-click access to full event details on MavEngage
- **Dark Mode** - Toggle between light and dark themes
- **Disclaimer Modal** - First-time visitor notice about event accuracy
- **Pizza Cursor** - Custom 🍕 cursor that follows your mouse (rotated 180°)

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React useState/useEffect
- **Deployment:** Vercel
- **API:** MavEngage Discovery API
- **Database:** Firebase (for submitted events)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Clone or download the project files**

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
├── app/                    # Pages and layout
│   ├── globals.css         # Global styles & pizza cursor
│   ├── layout.tsx          # Root layout with ThemeProvider
│   └── page.tsx            # Main page component
├── components/             # React components
│   ├── DisclaimerModal.tsx # First-time visitor disclaimer
│   ├── EmptyState.tsx      # Empty state illustration
│   ├── EventCard.tsx       # Individual event card
│   ├── EventList.tsx       # Time-grouped event list
│   ├── FeaturedEvents.tsx  # "Happening Soon" alert
│   ├── FilterBar.tsx       # Organization filter (top overlay)
│   ├── FloatingFoodBackground.tsx # (deprecated - returns null)
│   ├── Header.tsx          # App header with logo
│   ├── Leaderboard.tsx     # Most active orgs leaderboard
│   ├── LoadingSkeleton.tsx # Loading state skeleton
│   ├── SearchBar.tsx       # Search input
│   ├── SortControls.tsx    # Sort option buttons
│   └── ThemeProvider.tsx   # Dark/light mode context
├── lib/                    # Utilities and API
│   ├── api.ts              # MavEngage API calls
│   ├── dateUtils.ts        # Date grouping utilities
│   ├── firebaseService.ts  # Firebase integration
│   ├── firebaseTypes.ts    # TypeScript types for Firebase
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Helper functions
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.ts      # Tailwind configuration
└── README.md               # This file
```

## Design System

### Colors
- **UTA Orange:** `#f97316` - Primary actions, accents
- **UTA Blue:** `#3e84f6` - Secondary accents, alternating cards
- **Neutral Grays:** Warm gray palette for text and backgrounds

### Key UI Elements
- **Event Cards:** Horizontal list layout with colored left border (orange/blue alternating)
- **Time Badges:** Show "Today", "Tomorrow", or "In X days"
- **Filter Dropdown:** Full-width overlay at top of screen
- **Section Dividers:** Sticky headers for time groups (Today, Tomorrow, etc.)

## Environment Variables

No environment variables required for basic operation! This MVP works directly with public APIs.

Optional: Set up Firebase for submitted events feature.

## Testing Checklist

- [x] Events load correctly from API
- [x] Filter by organization works
- [x] Sort options work correctly
- [x] Time grouping appears only when sorted by date
- [x] Days until badge displays correctly
- [x] Dark mode toggle works
- [x] Disclaimer modal shows on first visit
- [x] Responsive on mobile, tablet, desktop
- [x] Links open correctly
- [x] Empty state displays when needed
- [x] Error handling in place
- [x] Date range is 60 days from current time

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

## Changelog

### Recent Updates
- **Removed:** Sticky note card design, pastel colors, food emoji backgrounds
- **Added:** Time-based event grouping, days until badges, pizza cursor, dark mode
- **Changed:** New blue color (#3e84f6), list-style cards, top-positioned filter dropdown
- **Improved:** Better mobile responsiveness, more neutral UI elements

## Future Features

-  **Map View** - Show event locations on an interactive map
-  **Notifications** - Email alerts for new events from favorite orgs
-  **User Accounts** - Save favorite organizations
-  **PWA** - Install as a mobile app

## License

Created for UTA students. Built with ❤️ by ACM @ UTA.

## Support

For issues or questions, check the code comments and documentation files provided.

---

**Ready to find some free food?**

Happy eating!
