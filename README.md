# Frontend Engineer - Skill Verification Case Study

## Role
Frontend Engineer

## Title
Responsive Dashboard Application

## Brief
Build a modern, responsive dashboard application that displays data visualizations, handles user interactions, and demonstrates your proficiency in frontend development, state management, and UI/UX best practices.

## Description

### Objective
Create a production-quality dashboard application that:
- Fetches and displays data from an API
- Provides interactive data visualizations
- Implements user authentication flow
- Is fully responsive across devices
- Follows modern frontend best practices

### Technical Requirements

#### 1. Core Features
- **Authentication Pages**
  - Login page with form validation
  - Registration page
  - Protected routes (redirect to login if not authenticated)
  - Logout functionality

- **Dashboard Home**
  - Summary cards showing key metrics
  - At least 2 different chart types (line, bar, pie, etc.)
  - Data grid/table with sorting and filtering
  - Loading states and error handling

- **User Profile**
  - Display user information
  - Edit profile functionality
  - Form validation

- **Navigation**
  - Responsive sidebar or navbar
  - Active route highlighting
  - Mobile menu (hamburger menu for mobile)

#### 2. Technical Implementation

##### State Management
- Use a state management solution (Redux, Zustand, Context API, or similar)
- Manage authentication state
- Cache API responses appropriately

##### API Integration
- Use a mock API (JSON Placeholder, JSONServer, or provided API)
- Implement proper API error handling
- Show loading states during data fetching
- Handle network errors gracefully

##### Styling
- Use CSS-in-JS, CSS Modules, Tailwind CSS, or styled-components
- Responsive design (mobile-first approach)
- Consistent theming (colors, typography, spacing)
- Modern UI with attention to UX

##### Performance
- Code splitting (lazy loading routes)
- Optimize bundle size
- Memoization where appropriate
- No unnecessary re-renders

##### Form Validation
- Client-side validation
- Display validation errors clearly
- Prevent invalid form submissions

##### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management

#### 3. Technology Stack (Choose one)

**React**
- React 18+ with TypeScript
- React Router for routing
- State management library
- Chart library (Recharts, Chart.js, etc.)

**Vue**
- Vue 3 with TypeScript
- Vue Router
- Pinia or Vuex for state management
- Chart library

**Angular**
- Angular 15+ with TypeScript
- Angular Router
- RxJS for state management
- Chart library

### Data Requirements

You can use these mock APIs or create your own:
- **JSONPlaceholder** - https://jsonplaceholder.typicode.com/
- **JSON Server** - Set up your own local mock API
- **Provided API** - Use the API endpoint provided in the repository

Minimum data to display:
- Dashboard metrics (4-6 summary cards)
- Chart data (line/bar chart with 10+ data points)
- Table data (list of 20+ items with filtering)
- User profile data

### UI/UX Requirements
1. Clean, modern design
2. Intuitive navigation
3. Responsive layout (mobile, tablet, desktop)
4. Loading skeletons or spinners
5. Error states with user-friendly messages
6. Empty states (e.g., "No data available")
7. Smooth transitions and animations (subtle)

### Deliverables
1. Complete source code in GitHub repository
2. README with:
   - Setup and installation instructions
   - How to run the application
   - Technology choices explanation
   - Screenshots or GIF of the application
3. Working application (localhost instructions)
4. Pull Request with your implementation

### Evaluation Criteria
Your submission will be evaluated based on:
1. **Functionality** (25%) - All features work as specified
2. **Code Quality** (25%) - Clean, maintainable, well-structured code
3. **UI/UX Design** (20%) - Modern, intuitive, responsive design
4. **State Management** (15%) - Proper state handling and data flow
5. **Performance** (10%) - Fast, optimized, no unnecessary re-renders
6. **Documentation** (5%) - Clear README and code comments

### Time Limit
72 hours from repository access

### Getting Started
1. Accept the repository invitation
2. Clone the repository
3. Create a new branch for your implementation
4. Install dependencies and start development
5. Push your code and create a Pull Request to `main`
6. Your PR will be automatically evaluated

### Bonus Points
- Unit tests (Jest, Vitest, Cypress)
- Dark mode toggle
- Advanced filtering/search in table
- Data export functionality
- Responsive charts
- Animations and micro-interactions
- Accessibility features (WCAG AA compliance)

### Tips
- Start with the layout and navigation structure
- Mock authentication initially (localStorage JWT simulation)
- Focus on one feature at a time
- Make it work, then make it beautiful
- Test responsiveness frequently
- Commit regularly with meaningful messages
- Keep components small and focused

# Submission Instructions
1. Clone the template repository,
2. Checkout to a new branch and complete the case study requirements,
3. Push your changes and create a Pull Request to the `main` branch,
4. Your submission will be evaluated and you will receive feedback via email

Good luck! 🎨
