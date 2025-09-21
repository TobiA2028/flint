# Flask Backend Implementation - Learning Project

## Overview
This project adds a Flask backend to the Flint Spark civic engagement app to handle dynamic issue frequency tracking. The goal is to learn backend development concepts while implementing real social proof functionality.

## Learning Objectives
- Understand HTTP APIs and RESTful design
- Learn Flask framework fundamentals
- Practice CORS configuration for frontend-backend communication
- Implement request validation and error handling
- Experience full-stack development workflow

## Project Structure
```
flint-spark-civic/
├── src/                    # React frontend (existing)
├── backend/               # Flask backend (new)
│   ├── app.py            # Main Flask application
│   ├── requirements.txt  # Python dependencies
│   ├── data_store.py     # In-memory database simulation
│   └── config.py         # Configuration settings
└── tasks/                # Project documentation
```

---

## Phase 1: Flask Backend Setup ⏳

### Goals
- Set up Python environment and Flask application
- Understand Flask app structure and CORS
- Create in-memory data storage system

### Tasks
- [ ] Create backend directory structure
- [ ] Set up Python virtual environment
- [ ] Install Flask and dependencies
- [ ] Create Flask application skeleton
- [ ] Configure CORS for React frontend
- [ ] Implement in-memory data storage
- [ ] Add development server configuration

### Learning Focus
- Flask application factory pattern
- CORS (Cross-Origin Resource Sharing) concepts
- Python virtual environments and package management
- In-memory data structures for rapid prototyping

---

## Phase 2: API Endpoints Implementation

### Goals
- Design RESTful API endpoints
- Implement request validation
- Handle JSON serialization/deserialization

### API Design
```
POST /api/issues/increment
Body: {"issueIds": ["housing", "education", "healthcare"]}
Response: {"success": true, "message": "Counts updated"}

GET /api/issues/frequencies
Response: {
  "frequencies": {
    "housing": 1247,
    "education": 982,
    "healthcare": 1156
  }
}

POST /api/issues/reset
Response: {"success": true, "message": "All counts reset"}
```

### Tasks
- [ ] Implement POST /api/issues/increment endpoint
- [ ] Implement GET /api/issues/frequencies endpoint
- [ ] Implement POST /api/issues/reset endpoint
- [ ] Add request validation and error handling
- [ ] Test endpoints with Postman or curl

### Learning Focus
- HTTP methods (GET vs POST)
- JSON request/response handling
- Input validation and error responses
- API testing tools

---

## Phase 3: Frontend API Integration

### Goals
- Replace mock data with real API calls
- Implement loading states and error handling
- Practice async JavaScript patterns

### Tasks
- [ ] Create API client service (`src/lib/apiClient.ts`)
- [ ] Update IssueSelectionScreen to call backend
- [ ] Update SocialProofScreen to fetch real data
- [ ] Add loading states and error handling
- [ ] Remove localStorage mock data

### Learning Focus
- Fetch API and async/await patterns
- Error handling in React components
- Loading states and user experience
- API client abstraction patterns

---

## Phase 4: Development Workflow

### Goals
- Set up efficient development environment
- Configure concurrent frontend/backend development
- Implement debugging and logging

### Tasks
- [ ] Add npm scripts for concurrent development
- [ ] Configure development proxy or CORS
- [ ] Add backend logging and request monitoring
- [ ] Create development documentation
- [ ] Test complete user flow

### Learning Focus
- Development environment setup
- Debugging full-stack applications
- Development vs production configurations
- Developer tooling and productivity

---

## Phase 5: Enhancement & Production Readiness

### Goals
- Add production considerations
- Implement advanced features
- Prepare for potential database migration

### Tasks
- [ ] Add environment configuration
- [ ] Implement data persistence options
- [ ] Add API rate limiting
- [ ] Create deployment documentation
- [ ] Plan database migration path

### Learning Focus
- Environment configuration management
- Production vs development differences
- Performance considerations
- Scalability planning

---

## Getting Started

### Prerequisites
- Python 3.8+ installed
- Node.js and npm (for React frontend)
- Basic command line familiarity

### Quick Start
1. Navigate to project root
2. Create backend directory: `mkdir backend && cd backend`
3. Follow Phase 1 implementation steps
4. Test with React frontend

---

## Resources

### Flask Documentation
- [Flask Quickstart](https://flask.palletsprojects.com/quickstart/)
- [Flask-CORS Documentation](https://flask-cors.readthedocs.io/)

### HTTP/API Concepts
- [RESTful API Design](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)

### Development Tools
- [Postman](https://www.postman.com/) - API testing
- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)

---

## Notes

### Current Implementation Status
- **Phase 1**: ⏳ In Progress
- **Phase 2**: ⏸️ Pending
- **Phase 3**: ⏸️ Pending
- **Phase 4**: ⏸️ Pending
- **Phase 5**: ⏸️ Pending

### Key Decisions
- Using in-memory storage for simplicity and learning
- Flask chosen for Python ecosystem familiarity
- RESTful API design for industry-standard patterns
- Gradual implementation for step-by-step learning

### Migration Path
This implementation is designed to be easily migrated to:
- SQLite database (simple file-based)
- PostgreSQL (production database)
- Cloud solutions (Supabase, Firebase)

---

*Created for HouHack2025 - Learning-focused backend development*