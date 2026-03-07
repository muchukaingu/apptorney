# Apptorney SwiftUI App — Design Document

## Goal

Build a new SwiftUI-based version of the Apptorney iOS app with full feature parity, zero external dependencies, and modern Apple APIs. Lives at `ios-app-swiftui/` alongside the existing UIKit app as a trial.

## Decisions

| Decision | Choice |
|----------|--------|
| Location | `ios-app-swiftui/` at monorepo root |
| Min iOS | 16.0 |
| Architecture | MVVM with ObservableObject |
| Dependencies | Zero — all native Apple APIs |
| Networking | URLSession actor with async/await |
| Token storage | Keychain (security upgrade from UserDefaults) |
| Navigation | Hamburger side menu + NavigationStack |
| Scope | Full feature parity including AI chat |
| StoreKit | StoreKit 2 (modern async API) |

## Dependency Replacement

| CocoaPod | Native Replacement |
|----------|-------------------|
| Alamofire | URLSession + async/await via APIClient actor |
| SwiftyJSON | Codable + JSONDecoder |
| SkyFloatingLabelTextField | Custom FloatingTextField SwiftUI view |
| Windless | .redacted(reason: .placeholder) + ShimmerModifier |
| paper-onboarding | TabView with .tabViewStyle(.page) |
| PhoneNumberKit | Dropped — simple TextField with .phonePad keyboard |
| MaterialComponents/Snackbar | Custom SnackbarModifier ViewModifier |
| CryptoSwift | CryptoKit |

## Project Structure

```
ios-app-swiftui/apptorney/
├── apptorney.xcodeproj
├── App/
│   ├── ApptorneyApp.swift          # @main entry point
│   ├── AppState.swift              # Top-level observable (auth, update, onboarding)
│   └── RootView.swift              # Switches between app flows
├── Core/
│   ├── Networking/
│   │   ├── APIClient.swift         # URLSession actor, async/await
│   │   ├── Endpoint.swift          # API endpoint definitions
│   │   └── AppError.swift          # Unified error enum
│   ├── Auth/
│   │   └── AuthManager.swift       # ObservableObject, token management
│   └── Storage/
│       └── KeychainService.swift   # Keychain wrapper for tokens
├── Features/
│   ├── Auth/
│   │   ├── Views/                  # LoginView, RegisterView, VerifyView
│   │   └── ViewModels/             # LoginViewModel, RegisterViewModel, VerifyViewModel
│   ├── Home/
│   │   ├── Views/                  # HomeView, HomeDetailView
│   │   └── ViewModels/             # HomeViewModel
│   ├── Chat/
│   │   ├── Views/                  # ChatView, ChatMessageView, ChatSidebarView
│   │   └── ViewModels/             # ChatViewModel
│   ├── Cases/
│   │   ├── Views/                  # CasesListView, CaseDetailView, CaseFilterView
│   │   └── ViewModels/             # CasesViewModel
│   ├── Legislations/
│   │   ├── Views/                  # LegislationsListView, LegislationDetailView, LegislationFilterView
│   │   └── ViewModels/             # LegislationsViewModel
│   ├── Search/
│   │   ├── Views/                  # GlobalSearchView
│   │   └── ViewModels/             # SearchViewModel
│   ├── Settings/
│   │   ├── Views/                  # SettingsView, ProfileView
│   │   └── ViewModels/             # SettingsViewModel
│   └── Subscription/
│       ├── Views/                  # SubscriptionView, PaymentOptionsView, CardEntryView
│       └── ViewModels/             # SubscriptionViewModel
├── Models/
│   ├── User.swift
│   ├── Case.swift
│   ├── Legislation.swift
│   ├── LegislationPart.swift
│   ├── HomeItem.swift
│   ├── ChatMessage.swift
│   ├── ChatThread.swift
│   ├── Subscription.swift
│   ├── Citation.swift
│   └── SupportingModels.swift      # Party, Court, AreaOfLaw, Division, etc.
└── Shared/
    ├── Components/
    │   ├── FloatingTextField.swift
    │   ├── SnackbarModifier.swift
    │   ├── ShimmerModifier.swift
    │   ├── SideMenuContainer.swift
    │   └── OnboardingPageView.swift
    └── Extensions/
        ├── Color+App.swift
        ├── View+Navigation.swift
        ├── String+Validation.swift
        └── Date+Formatting.swift
```

## Architecture

### App Entry & Routing

```
RootView (switches on AppState)
  ├── UpdateRequiredView      (force update check failed)
  ├── OnboardingView          (first launch)
  ├── AuthFlow                (login/register/verify)
  └── MainView                (authenticated)
```

### Navigation

Hamburger side menu (replaces SWRevealViewController):
- Custom SideMenuContainer with gesture-driven slide
- Content slides right, menu slides in from left
- Dimmed overlay on content when open

```
MainView
  ├── SideMenuView
  │     ├── Home
  │     ├── Cases
  │     ├── Legislations
  │     ├── Search
  │     ├── Settings
  │     └── Logout
  └── ContentArea (NavigationStack per selection)
```

### Core Networking: APIClient

Actor wrapping URLSession:
- Base URL + standard headers (X-IBM-Client-ID, X-IBM-Client-Secret, Bearer token)
- Generic `request<T: Decodable>(_ endpoint:) async throws -> T`
- Auto 401 interception → token refresh via /auth/refresh → retry
- Thread-safe by design (actor)

### Core Auth: AuthManager

ObservableObject injected via .environmentObject():
- Tokens in Keychain via KeychainService
- Exposes isAuthenticated, currentUser
- Handles full OTP flow: email → send code → verify → persist

### Data Flow

```
View → ViewModel.method()
         ↓
     APIClient.request<T>()
         ↓
     URLSession async/await
         ↓
     JSONDecoder → Codable struct
         ↓
     @Published property updated
         ↓
     View re-renders
```

### Error Handling

AppError enum:
- .networkError(URLError)
- .apiError(statusCode: Int, message: String)
- .authExpired
- .decodingError

ViewModels expose @Published error, views use .snackbar() modifier.

### State Storage

| State | Storage | Mechanism |
|-------|---------|-----------|
| Auth tokens | Keychain | KeychainService |
| User profile | Memory | AuthManager.currentUser |
| Onboarding/login flags | UserDefaults | @AppStorage |
| API data | Memory | ViewModel @Published |
| Chat threads | Memory + API | ChatViewModel |

## Feature Details

### Auth
- NavigationStack with path-based routing
- Login ↔ Register switching, both navigate to Verify on success
- FloatingTextField custom component for all text inputs

### Home
- ScrollView + LazyVStack with horizontal card sections
- Bookmarks, What's New, Trending sections
- Skeleton loading via .redacted() + shimmer

### Chat
- Streaming AI responses via URLSession.AsyncBytes
- Messages list with auto-scroll
- Sidebar drawer for thread history
- Input bar with send button

### Cases
- .searchable() with debounced async search
- Filter by area of law, by year
- Detail view: scrollable sections for facts, ruling, judgment, references

### Legislations
- .searchable() with debounced search
- Filter by volume, year, type
- DisclosureGroup for collapsible parts/sections

### Search
- Global search across cases and legislations
- .searchable() modifier on NavigationStack

### Settings
- Native Form with Section groups
- Profile info, preferences, subscription status, logout

### Subscription
- StoreKit 2 async API (Product, Transaction)
- Payment options: Corporate, Card, Bank Transfer, Mobile Money, IAP
- Receipt validation via async/await
