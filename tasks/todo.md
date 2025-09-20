# Ballot Measure Card Positioning Fix - Todo List

## Tasks

- [x] 1. Add showStar prop to BallotMeasureCard component 
- [x] 2. Conditionally render star button based on showStar prop
- [x] 3. Move STATE tag from top-left to top-right position in OfficeMappingScreen
- [x] 4. Update STATE tag styling to match OfficeCard level tags
- [x] 5. Pass showStar=false to BallotMeasureCard in OfficeMappingScreen

## Review Section

### Summary of Changes Made
Successfully fixed ballot measure card positioning and removed stars on OfficeMappingScreen:

1. **BallotMeasureCard Component Updates** (`src/components/BallotMeasureCard.tsx`):
   - Added optional `showStar?: boolean` prop with default value `true`
   - Conditionally render star button based on `showStar` prop
   - Adjusted title padding: `pr-12` when star is shown, `pr-0` when hidden
   - Maintains backward compatibility for other screens using the component

2. **STATE Tag Positioning Fix** (`src/screens/OfficeMappingScreen.tsx`):
   - Moved STATE tag from top-left (`top-4 left-4`) to top-right (`top-4 right-4`)
   - Now matches the exact position of level tags on OfficeCard components
   - Updated styling to match OfficeCard level tags:
     - Background: `bg-civic/10` (instead of `bg-accent`)
     - Text color: `text-civic` (instead of `text-accent-foreground`)
     - Same padding, border radius, and font styling

3. **Display-Only Mode** (`src/screens/OfficeMappingScreen.tsx`):
   - Passed `showStar={false}` to BallotMeasureCard components
   - Removes star button completely from ballot measure cards on this screen
   - Cards are now truly display-only as intended

### Impact
- **Visual Consistency**: STATE tags now align perfectly with OfficeCard level tags
- **Cleaner UI**: No distracting star buttons on display-only ballot measure cards
- **Component Flexibility**: BallotMeasureCard can now be used in both interactive and display-only modes
- **Design Harmony**: All level/type tags use consistent civic color scheme and positioning

### Files Modified
- `src/components/BallotMeasureCard.tsx` (added showStar prop)
- `src/screens/OfficeMappingScreen.tsx` (fixed positioning and styling)
- `tasks/todo.md` (this planning document)

**Status**: ✅ All tasks completed successfully