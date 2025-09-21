-- ============================================================================
-- Seed Data for Flint Spark Civic Engagement App
-- ============================================================================
-- This script populates the database with demo data migrated from data_store.py

-- ============================================================================
-- CLEAR EXISTING DATA (for development/testing)
-- ============================================================================
TRUNCATE TABLE candidates, ballot_measures, offices, issues, user_completions, email_signups CASCADE;

-- ============================================================================
-- ISSUES DATA
-- ============================================================================
INSERT INTO issues (id, name, icon, description, count, related_offices, related_measures) VALUES
('housing', 'Housing', 'Home', 'Affordable housing, rent control, and homeownership programs', 1247, '{"city-council"}', '{"measure-housing-1"}'),
('education', 'Education', 'GraduationCap', 'School funding, curriculum, and educational opportunities', 982, '{"school-board"}', '{"measure-edu-1"}'),
('healthcare', 'Healthcare', 'Heart', 'Healthcare access, costs, and public health initiatives', 1156, '{"county-commissioner"}', '{"measure-healthcare-1"}'),
('environment', 'Environment', 'Leaf', 'Climate change, pollution, and environmental protection', 891, '{"mayor","transit-board"}', '{"measure-env-1","measure-trans-1"}'),
('transportation', 'Transportation', 'Car', 'Public transit, roads, and transportation infrastructure', 743, '{"transit-board"}', '{"measure-trans-1"}'),
('safety', 'Public Safety', 'Shield', 'Police reform, crime prevention, and community safety', 1089, '{"sheriff","mayor"}', '{"measure-safety-1","measure-immigration-1"}'),
('economy', 'Economy', 'DollarSign', 'Jobs, minimum wage, and economic development', 1298, '{"city-council","mayor"}', '{"measure-env-1","measure-housing-1","measure-tax-1"}'),
('infrastructure', 'Infrastructure', 'Construction', 'Roads, bridges, water systems, and public facilities', 567, '{"city-council","transit-board"}', '{"measure-edu-1","measure-trans-1","measure-tax-1"}'),
('immigration', 'Immigration', 'Users', 'Immigration policy and immigrant services', 432, '{"city-council-general"}', '{"measure-immigration-1"}'),
('taxes', 'Taxes', 'Calculator', 'Tax policy, rates, and government spending', 789, '{"city-council-general"}', '{"measure-tax-1"}'),
('rights', 'Civil Rights', 'Scale', 'Equality, discrimination, and civil liberties', 923, '{"sheriff"}', '{"measure-safety-1","measure-immigration-1"}'),
('seniors', 'Senior Services', 'UserCheck', 'Elder care, social security, and senior programs', 445, '{"county-commissioner"}', '{"measure-healthcare-1"}');

-- ============================================================================
-- OFFICES DATA
-- ============================================================================
INSERT INTO offices (id, name, description, explanation, level, related_issues) VALUES
('city-council', 'City Council', 'District Representative', 'City Council members vote on zoning laws, affordable housing projects, and rent control policies that directly affect housing costs in your neighborhood.', 'local', '{"housing","economy","infrastructure"}'),
('school-board', 'School Board', 'District Trustee', 'School Board members decide on curriculum, teacher hiring, school funding allocation, and policies that shape your local schools.', 'local', '{"education"}'),
('county-commissioner', 'County Commissioner', 'Public Health District', 'County Commissioners oversee public health departments, mental health services, and healthcare access programs in your area.', 'local', '{"healthcare","seniors"}'),
('mayor', 'Mayor', 'City Executive', 'The Mayor sets environmental policy priorities, oversees sustainability initiatives, and can influence green infrastructure projects.', 'local', '{"environment","safety","economy"}'),
('transit-board', 'Transit Authority Board', 'Transportation District', 'Transit Board members make decisions about bus routes, subway expansions, bike lanes, and public transportation funding.', 'local', '{"transportation","environment","infrastructure"}'),
('sheriff', 'County Sheriff', 'Law Enforcement', 'The Sheriff oversees county law enforcement, jail operations, and community policing strategies that affect public safety.', 'local', '{"safety","rights"}'),
('city-council-general', 'City Council', 'At-Large Representative', 'City Council members vote on policies and budgets that affect various community issues.', 'local', '{"immigration","taxes"}');

-- ============================================================================
-- BALLOT MEASURES DATA
-- ============================================================================
INSERT INTO ballot_measures (id, title, description, category, impact, related_issues) VALUES
('measure-edu-1', 'School Bond Initiative - Measure A', 'Authorizes $500 million in bonds to modernize school facilities, upgrade technology infrastructure, and improve safety systems across all district schools.', 'Education', 'Would increase property taxes by approximately $45 per year for the average homeowner', '{"education","infrastructure"}'),
('measure-trans-1', 'Public Transit Expansion - Measure B', 'Funds the extension of light rail service to underserved communities and increases bus frequency during peak hours.', 'Transportation', 'Would provide improved transit access to 25,000 additional residents', '{"transportation","environment","infrastructure"}'),
('measure-env-1', 'Clean Energy Initiative - Measure C', 'Requires the city to transition to 100% renewable energy by 2030 and establishes a green jobs training program.', 'Environment', 'Would create an estimated 500 new green jobs over the next 5 years', '{"environment","economy"}'),
('measure-housing-1', 'Affordable Housing Development - Measure D', 'Allocates $300 million for affordable housing construction and first-time homebuyer assistance programs.', 'Housing', 'Would create 2,000 new affordable housing units over 5 years', '{"housing","economy"}'),
('measure-safety-1', 'Community Safety Reform - Measure E', 'Establishes community policing programs, crisis intervention teams, and civilian oversight board for law enforcement accountability.', 'Public Safety', 'Would reallocate 15% of police budget to community safety programs', '{"safety","rights"}'),
('measure-healthcare-1', 'Public Health Expansion - Measure F', 'Funds community health centers, mental health services, and senior wellness programs in underserved areas.', 'Healthcare', 'Would provide healthcare access to 15,000 additional residents', '{"healthcare","seniors"}'),
('measure-tax-1', 'Progressive Business Tax - Measure G', 'Implements graduated tax rate for businesses based on revenue to fund essential city services and infrastructure.', 'Taxation', 'Would generate $50 million annually for city services', '{"taxes","economy","infrastructure"}'),
('measure-immigration-1', 'Sanctuary City Protection - Measure H', 'Strengthens protections for immigrant communities and prohibits local cooperation with federal immigration enforcement.', 'Immigration', 'Would provide legal protection and support services for immigrant families', '{"immigration","rights","safety"}');

-- ============================================================================
-- CANDIDATES DATA
-- ============================================================================
INSERT INTO candidates (id, name, party, photo, positions, office_id, related_issues) VALUES
('candidate-1', 'Sarah Chen', 'Democratic', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
 '{"Supports affordable housing initiatives and rent stabilization","Advocates for increased funding for public education","Champions climate action and renewable energy programs"}',
 'city-council', '{"housing","education","environment"}'),
('candidate-2', 'Marcus Johnson', 'Republican', 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
 '{"Focuses on reducing regulations for small businesses","Supports traditional law enforcement approaches","Advocates for fiscal responsibility in city budgeting"}',
 'city-council', '{"economy","safety","taxes"}'),
('candidate-3', 'Elena Rodriguez', 'Independent', 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena',
 '{"Prioritizes community-driven solutions to local issues","Supports sustainable transportation and infrastructure","Advocates for transparent government and citizen engagement"}',
 'mayor', '{"transportation","infrastructure","rights"}');

-- ============================================================================
-- VERIFY DATA INSERTION
-- ============================================================================
-- Count records to verify successful insertion
SELECT 'Issues' as table_name, COUNT(*) as record_count FROM issues
UNION ALL
SELECT 'Offices' as table_name, COUNT(*) as record_count FROM offices
UNION ALL
SELECT 'Ballot Measures' as table_name, COUNT(*) as record_count FROM ballot_measures
UNION ALL
SELECT 'Candidates' as table_name, COUNT(*) as record_count FROM candidates;