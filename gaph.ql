src/
├─ assets/                # Static files (images, fonts, icons, svgs)
│   ├─ images/
│   ├─ icons/
│   └─ styles/            # Global SCSS/CSS or theme files
│
├─ components/            # Reusable presentational components (atomic design)
│   ├─ ui/                # Smallest reusable UI (Button, Input, Modal…)
│   ├─ layout/            # Layout pieces (Header, Sidebar, Footer)
│   ├─ data-display/      # Cards, Tables, Charts
│   ├─ form/              # Form controls (SearchBar, Dropdown, FilterPanel)
│   └─ feedback/          # Alerts, Toasts, Loaders, Skeletons
│
├─ features/              # Each “domain” or page is isolated & self-contained
│   ├─ auth/              # login, logout, register
│   │   ├─ api/
│   │   ├─ components/
│   │   ├─ hooks/
│   │   └─ pages/         # <LoginPage/>, <SignupPage/>
│   │
│   ├─ home/
│   │   ├─ components/    # Feed, LeftSidebar, RightWidgets
│   │   ├─ hooks/
│   │   └─ pages/
│   │
│   ├─ followers/
│   │   ├─ components/    # FollowersList, FollowButton
│   │   └─ pages/
│   │
│   ├─ people/
│   │   ├─ components/    # PeopleList, ProfileCard
│   │   └─ pages/
│   │
│   ├─ gallery/
│   │   ├─ components/    # GalleryGrid, UploadModal
│   │   └─ pages/
│   │
│   ├─ chat/
│   │   ├─ components/    # ChatWindow, MessageList, MessageInput
│   │   ├─ hooks/         # useChatSocket, useMessages
│   │   └─ pages/
│   │
│   ├─ notifications/
│   │   ├─ components/    # NotificationItem, NotificationList
│   │   └─ pages/
│   │
│   ├─ guidelines/
│   │   └─ pages/         # Guidelines table & filtering
│   │
│   ├─ weather/
│   │   ├─ components/    # WeatherWidget, ForecastChart
│   │   └─ pages/
│   │
│   ├─ drug-search/
│   │   ├─ components/    # DrugTable, SearchFilters
│   │   └─ pages/
│   │
│   ├─ market-price/
│   │   ├─ components/    # PriceTable, FilterPanel
│   │   └─ pages/
│   │
│   ├─ seed-market/
│   │   ├─ components/    # SeedList, PurchaseModal
│   │   └─ pages/
│   │
│   └─ feed/
│       ├─ components/    # PostCard, PostEditor
│       └─ pages/
│
├─ hooks/                 # Global reusable hooks (useAuth, useWindowSize, useFetch)
│
├─ lib/                   # Configs & singletons (firebase.ts, axiosInstance.ts, socket.ts)
│
├─ context/               # React Context providers (AuthContext, ThemeContext)
│
├─ services/              # API calls grouped by domain
│   ├─ authService.ts
│   ├─ weatherService.ts
│   ├─ chatService.ts
│   └─ ...
│
├─ store/                 # Redux / Zustand / Recoil stores
│   ├─ slices/            # e.g., userSlice, chatSlice
│   └─ index.ts
│
├─ routes/                # Route definitions & guards
│   └─ AppRouter.tsx
│
├─ utils/                 # Pure utility functions & helpers (formatDate, debounce)
│
├─ types/                 # Global TypeScript types/interfaces
│
└─ App.tsx