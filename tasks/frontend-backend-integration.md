# Frontend-Backend Integration Plan

## Overview
This document outlines the step-by-step process to connect the React frontend with the Flask backend, enabling real-time issue tracking and social proof functionality.

## Current State Analysis

### Backend Status ✅ READY
- Flask API running on `http://localhost:5000`
- Three endpoints implemented:
  - `GET /api/issues/frequencies` - Returns current issue counts
  - `POST /api/issues/increment` - Increments selected issues
  - `POST /api/issues/reset` - Resets to demo data
- CORS configured for frontend communication
- Data persistence working with duplicate prevention

### Frontend Status 🔄 NEEDS INTEGRATION
- React app running on `http://localhost:8080`
- Uses static data from `src/data/issues.ts`
- Mock data in `SocialProofScreen`
- No API calls implemented yet
- User selections stored only in localStorage

---

## Integration Learning Path

### Phase 1: API Foundation 🎯 CURRENT PHASE
**Learning Focus**: HTTP clients, TypeScript interfaces, error handling

#### Task 1.1: Create API Service Layer
- [ ] Create `src/lib/api.ts` file
- [ ] Define TypeScript interfaces for API responses
- [ ] Implement HTTP client with error handling
- [ ] Add environment configuration for API URLs
- [ ] Test basic connectivity

**Learning Objectives**:
- Understand separation of concerns (API logic vs component logic)
- Learn TypeScript interface design for API responses
- Practice async/await and Promise handling
- Implement proper error boundaries

**TODO for Student**:
```typescript
// You will learn to:
// 1. Structure API calls in a reusable way
// 2. Handle network errors gracefully
// 3. Type API responses properly
// 4. Create a clean interface between frontend and backend
```

#### Task 1.2: Add Loading and Error States
- [ ] Create loading state patterns
- [ ] Design error message components
- [ ] Implement retry mechanisms
- [ ] Add success feedback patterns

---

### Phase 2: Issue Selection Integration 🔄 PLANNED
**Learning Focus**: User interactions, form submission, state management

#### Task 2.1: Update Issue Selection Flow
- [ ] Modify `IssueSelectionScreen.tsx` to call backend
- [ ] Generate unique session IDs for users
- [ ] Add loading states during API calls
- [ ] Handle success and error scenarios
- [ ] Update user feedback messages

**Learning Objectives**:
- Connect user actions to backend API calls
- Understand session management concepts
- Practice state management during async operations
- Learn user experience patterns for loading states

**TODO for Student**:
```typescript
// You will learn to:
// 1. Integrate form submissions with API calls
// 2. Manage loading states in React components
// 3. Handle user feedback and error messages
// 4. Generate and track user sessions
```

#### Task 2.2: Session Management
- [ ] Implement session ID generation
- [ ] Store session data in localStorage
- [ ] Handle session persistence across page reloads
- [ ] Prevent duplicate submissions

---

### Phase 3: Social Proof Integration 🔄 PLANNED
**Learning Focus**: Data fetching, real-time updates, dynamic content

#### Task 3.1: Replace Mock Data with Real API
- [ ] Update `SocialProofScreen.tsx` to fetch real data
- [ ] Call `/api/issues/frequencies` endpoint
- [ ] Transform API data for component display
- [ ] Handle loading states for data fetching
- [ ] Add refresh capabilities

**Learning Objectives**:
- Replace static data with dynamic API data
- Transform backend data for frontend display
- Implement data refresh patterns
- Handle real-time data updates

**TODO for Student**:
```typescript
// You will learn to:
// 1. Fetch data from APIs on component mount
// 2. Transform backend data for frontend needs
// 3. Update UI based on real community data
// 4. Handle data refresh and updates
```

#### Task 3.2: Real-time Data Updates
- [ ] Add data refresh functionality
- [ ] Implement polling for live updates
- [ ] Update counts when new users select issues
- [ ] Add visual feedback for data changes

---

### Phase 4: Advanced Integration Features 🔄 PLANNED
**Learning Focus**: Optimization, caching, advanced patterns

#### Task 4.1: Data Caching and Optimization
- [ ] Implement simple caching for API responses
- [ ] Add request deduplication
- [ ] Optimize re-fetch strategies
- [ ] Handle background updates

#### Task 4.2: Error Recovery and Retry Logic
- [ ] Add automatic retry for failed requests
- [ ] Implement offline detection
- [ ] Add fallback data strategies
- [ ] Create error boundary components

---

## API Integration Specifications

### API Client Interface
```typescript
// This is what you'll build in src/lib/api.ts

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

interface IssueFrequencies {
  frequencies: Record<string, number>;
  total_users: number;
}

interface IncrementRequest {
  issueIds: string[];
  userId?: string;
}

class ApiClient {
  // TODO: Implement these methods
  async getIssueFrequencies(): Promise<ApiResponse<IssueFrequencies>>
  async incrementIssues(data: IncrementRequest): Promise<ApiResponse<any>>
  async resetIssues(): Promise<ApiResponse<any>>
}
```

### Component Integration Points

#### IssueSelectionScreen Changes
```typescript
// Current: Static selection with localStorage only
const handleContinue = () => {
  // Just moves to next screen
  onContinue();
};

// After integration: API call + localStorage
const handleContinue = async () => {
  setLoading(true);
  try {
    // TODO: Call backend API to increment selected issues
    // TODO: Generate session ID for user tracking
    // TODO: Handle success/error states
    onContinue();
  } catch (error) {
    // TODO: Show error message to user
  } finally {
    setLoading(false);
  }
};
```

#### SocialProofScreen Changes
```typescript
// Current: Random mock data
const mockStats = {
  totalPeople: Math.floor(Math.random() * 5000) + 1000,
  // ... more mock data
};

// After integration: Real API data
const [socialProofData, setSocialProofData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  // TODO: Fetch real issue frequencies from backend
  // TODO: Transform data for display
  // TODO: Handle loading and error states
}, []);
```

---

## Testing Strategy

### Manual Testing Checklist
- [ ] Both servers running (React on 8080, Flask on 5000)
- [ ] CORS working (no browser console errors)
- [ ] Issue selection saves to backend
- [ ] Social proof shows real data
- [ ] Data persists across browser refreshes
- [ ] Error handling works (test with backend offline)
- [ ] Loading states display properly
- [ ] Success feedback shows to users

### Integration Test Scenarios
1. **Happy Path**: User selects issues → data saves → social proof updates
2. **Error Handling**: Backend offline → graceful error messages
3. **Session Management**: Multiple tabs → no duplicate counting
4. **Data Consistency**: Refresh page → data still accurate
5. **Network Issues**: Slow connection → loading states work

---

## Learning Checkpoints

### After Phase 1 - You Should Understand:
- [ ] How to structure API calls in React applications
- [ ] TypeScript interfaces for API responses
- [ ] Error handling patterns for HTTP requests
- [ ] Environment configuration for different backends

### After Phase 2 - You Should Understand:
- [ ] Connecting user interactions to backend APIs
- [ ] Session management and user tracking
- [ ] Loading states and user feedback patterns
- [ ] Form submission with async operations

### After Phase 3 - You Should Understand:
- [ ] Data fetching patterns in React
- [ ] Transforming backend data for frontend display
- [ ] Real-time data updates and refresh patterns
- [ ] Dynamic content based on API responses

### After Phase 4 - You Should Understand:
- [ ] Performance optimization for API calls
- [ ] Caching strategies and request deduplication
- [ ] Advanced error recovery patterns
- [ ] Production-ready frontend-backend integration

---

## File Structure After Integration

```
src/
├── lib/
│   ├── api.ts                 # API client and interfaces
│   └── utils.ts              # Existing utilities
├── hooks/
│   ├── useAppState.ts        # Existing state management
│   ├── useApi.ts             # New: API hooks (optional)
│   └── useSession.ts         # New: Session management
├── screens/
│   ├── IssueSelectionScreen.tsx  # Modified: API integration
│   ├── SocialProofScreen.tsx     # Modified: Real data
│   └── ...                   # Other screens
├── components/
│   ├── LoadingSpinner.tsx    # New: Loading states
│   ├── ErrorMessage.tsx      # New: Error handling
│   └── ...                   # Existing components
└── data/
    └── issues.ts             # Modified: Dynamic data
```

---

## Common Challenges and Solutions

### Challenge 1: CORS Errors
**Problem**: Browser blocks requests to backend
**Solution**: Backend CORS is configured, but verify URLs match exactly
**Learning**: Understand same-origin policy and CORS headers

### Challenge 2: Async State Management
**Problem**: Components re-render during API calls
**Solution**: Proper loading states and useEffect dependencies
**Learning**: React lifecycle and async state patterns

### Challenge 3: Error Handling
**Problem**: Network failures break the user experience
**Solution**: Try-catch blocks with user-friendly error messages
**Learning**: Graceful degradation and error boundaries

### Challenge 4: Data Synchronization
**Problem**: Frontend and backend data get out of sync
**Solution**: Consistent data refresh and update patterns
**Learning**: State synchronization between client and server

---

## Success Metrics

### Technical Success
- [ ] All API calls work without CORS errors
- [ ] Data saves to backend and persists
- [ ] Error states handled gracefully
- [ ] Loading states provide good UX
- [ ] No JavaScript console errors

### User Experience Success
- [ ] Selecting issues feels responsive
- [ ] Social proof numbers look realistic and update
- [ ] Error messages are helpful, not technical
- [ ] Loading states don't feel slow
- [ ] Data persists across sessions

### Learning Success
- [ ] Student understands API integration patterns
- [ ] Student can debug frontend-backend communication
- [ ] Student knows how to handle async operations in React
- [ ] Student can implement error handling independently
- [ ] Student understands the full data flow from UI to database

---

*This integration plan provides a comprehensive learning path from basic API connectivity to production-ready frontend-backend communication, with detailed TODO sections for hands-on learning.*