# Demographics Screen Button Refactor - Todo List

## Tasks

- [x] 1. Update age groups data (expand to 6 ranges: 18-24, 25-34, 35-44, 45-54, 55-64, 65+)
- [x] 2. Update community roles data (match design: Parent, Student, Business Owner, etc.)
- [x] 3. Convert community roles from Badge to button components
- [x] 4. Change community roles layout to 2-column grid
- [x] 5. Update ZIP code input styling to match button border radius
- [x] 6. Remove unused useState import to fix TypeScript warning

## Review Section

### Summary of Changes Made
Successfully refactored the Demographics Screen to match the provided design:

1. **Age Groups Updated** (`DemographicsScreen.tsx`):
   - Expanded from 5 to 6 age ranges: `18-24, 25-34, 35-44, 45-54, 55-64, 65+`
   - Maintains existing 3-column grid layout for clean 3x2 display
   - Keeps current button styling with rounded-xl borders

2. **Community Roles Refactored**:
   - Updated data to match design: `Parent, Student, Business Owner, Renter, Homeowner, Commuter, Retiree, First-time Voter, Community Volunteer`
   - Converted from Badge components to button components for consistency
   - Changed layout from flex-wrap to 2-column grid (`grid-cols-2`)
   - Applied same styling as age group buttons with multi-select functionality
   - Updated section title to "Which describes you? (Select all that apply)"

3. **ZIP Code Input Styling**:
   - Added `rounded-xl` class to match button border radius
   - Maintained all existing functionality and layout

4. **Code Cleanup**:
   - Removed unused `useState` import
   - Removed unused `Badge` import
   - Fixed TypeScript warnings

### Impact
- Consistent visual design language across all form sections
- Clean grid layouts matching the provided design
- Improved user experience with consistent button styling
- Better responsive layout for community roles

### Files Modified
- `src/screens/DemographicsScreen.tsx` (main component updates)
- `tasks/todo.md` (this planning document)

**Status**: ✅ All tasks completed successfully