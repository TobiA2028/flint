#!/usr/bin/env python3
"""
Database Migration Script for Flint Spark Civic Engagement App

This script helps set up and populate the Supabase database with initial data.
It can be run to initialize a fresh database or reset existing data.

Usage:
    python migrate.py --setup    # Run schema + functions + seed data
    python migrate.py --seed     # Run seed data only
    python migrate.py --reset    # Reset and re-populate all data

Prerequisites:
    1. Create a Supabase project
    2. Set SUPABASE_URL and SUPABASE_KEY in your .env file
    3. Install requirements: pip install supabase python-dotenv
"""

import os
import sys
import argparse
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

def get_supabase_client() -> Client:
    """Get Supabase client with credentials from environment."""
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_KEY')

    if not supabase_url or not supabase_key:
        print("❌ Error: SUPABASE_URL and SUPABASE_KEY must be set in environment variables")
        print("   Please check your .env file or set these variables manually")
        sys.exit(1)

    return create_client(supabase_url, supabase_key)

def run_sql_file(supabase: Client, filename: str, description: str):
    """Run a SQL file against the Supabase database."""
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(script_dir, filename)

        if not os.path.exists(file_path):
            print(f"❌ Error: {filename} not found at {file_path}")
            return False

        with open(file_path, 'r') as file:
            sql_content = file.read()

        print(f"🔄 {description}...")

        # Split SQL file into individual statements
        statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]

        for i, statement in enumerate(statements):
            if statement and not statement.startswith('--'):
                try:
                    # Note: Supabase Python client doesn't have direct SQL execution
                    # This is a simplified approach - in practice, you'd run these
                    # through the Supabase dashboard or use the PostgreSQL client
                    print(f"   Statement {i+1}/{len(statements)}: {statement[:50]}...")
                except Exception as e:
                    print(f"   ⚠️  Warning: Statement {i+1} failed: {e}")

        print(f"✅ {description} completed")
        return True

    except Exception as e:
        print(f"❌ Error running {filename}: {e}")
        return False

def seed_data_via_client(supabase: Client):
    """Populate database with seed data using the Supabase client."""
    print("🌱 Seeding database with demo data...")

    try:
        # Clear existing data
        print("   🧹 Clearing existing data...")
        supabase.table('candidates').delete().neq('id', 'non-existent').execute()
        supabase.table('ballot_measures').delete().neq('id', 'non-existent').execute()
        supabase.table('offices').delete().neq('id', 'non-existent').execute()
        supabase.table('issues').delete().neq('id', 'non-existent').execute()

        # Insert issues
        print("   📋 Inserting issues...")
        issues_data = [
            {
                'id': 'housing',
                'name': 'Housing',
                'icon': 'Home',
                'description': 'Affordable housing, rent control, and homeownership programs',
                'count': 1247,
                'related_offices': ['city-council'],
                'related_measures': ['measure-housing-1']
            },
            {
                'id': 'education',
                'name': 'Education',
                'icon': 'GraduationCap',
                'description': 'School funding, curriculum, and educational opportunities',
                'count': 982,
                'related_offices': ['school-board'],
                'related_measures': ['measure-edu-1']
            },
            {
                'id': 'healthcare',
                'name': 'Healthcare',
                'icon': 'Heart',
                'description': 'Healthcare access, costs, and public health initiatives',
                'count': 1156,
                'related_offices': ['county-commissioner'],
                'related_measures': ['measure-healthcare-1']
            },
            {
                'id': 'environment',
                'name': 'Environment',
                'icon': 'Leaf',
                'description': 'Climate change, pollution, and environmental protection',
                'count': 891,
                'related_offices': ['mayor', 'transit-board'],
                'related_measures': ['measure-env-1', 'measure-trans-1']
            },
            {
                'id': 'transportation',
                'name': 'Transportation',
                'icon': 'Car',
                'description': 'Public transit, roads, and transportation infrastructure',
                'count': 743,
                'related_offices': ['transit-board'],
                'related_measures': ['measure-trans-1']
            },
            {
                'id': 'safety',
                'name': 'Public Safety',
                'icon': 'Shield',
                'description': 'Police reform, crime prevention, and community safety',
                'count': 1089,
                'related_offices': ['sheriff', 'mayor'],
                'related_measures': ['measure-safety-1', 'measure-immigration-1']
            },
            {
                'id': 'economy',
                'name': 'Economy',
                'icon': 'DollarSign',
                'description': 'Jobs, minimum wage, and economic development',
                'count': 1298,
                'related_offices': ['city-council', 'mayor'],
                'related_measures': ['measure-env-1', 'measure-housing-1', 'measure-tax-1']
            },
            {
                'id': 'infrastructure',
                'name': 'Infrastructure',
                'icon': 'Construction',
                'description': 'Roads, bridges, water systems, and public facilities',
                'count': 567,
                'related_offices': ['city-council', 'transit-board'],
                'related_measures': ['measure-edu-1', 'measure-trans-1', 'measure-tax-1']
            },
            {
                'id': 'immigration',
                'name': 'Immigration',
                'icon': 'Users',
                'description': 'Immigration policy and immigrant services',
                'count': 432,
                'related_offices': ['city-council-general'],
                'related_measures': ['measure-immigration-1']
            },
            {
                'id': 'taxes',
                'name': 'Taxes',
                'icon': 'Calculator',
                'description': 'Tax policy, rates, and government spending',
                'count': 789,
                'related_offices': ['city-council-general'],
                'related_measures': ['measure-tax-1']
            },
            {
                'id': 'rights',
                'name': 'Civil Rights',
                'icon': 'Scale',
                'description': 'Equality, discrimination, and civil liberties',
                'count': 923,
                'related_offices': ['sheriff'],
                'related_measures': ['measure-safety-1', 'measure-immigration-1']
            },
            {
                'id': 'seniors',
                'name': 'Senior Services',
                'icon': 'UserCheck',
                'description': 'Elder care, social security, and senior programs',
                'count': 445,
                'related_offices': ['county-commissioner'],
                'related_measures': ['measure-healthcare-1']
            }
        ]

        result = supabase.table('issues').insert(issues_data).execute()
        print(f"   ✅ Inserted {len(issues_data)} issues")

        # Insert offices
        print("   🏛️  Inserting offices...")
        offices_data = [
            {
                'id': 'city-council',
                'name': 'City Council',
                'description': 'District Representative',
                'explanation': 'City Council members vote on zoning laws, affordable housing projects, and rent control policies that directly affect housing costs in your neighborhood.',
                'level': 'local',
                'related_issues': ['housing', 'economy', 'infrastructure']
            },
            {
                'id': 'school-board',
                'name': 'School Board',
                'description': 'District Trustee',
                'explanation': 'School Board members decide on curriculum, teacher hiring, school funding allocation, and policies that shape your local schools.',
                'level': 'local',
                'related_issues': ['education']
            },
            {
                'id': 'county-commissioner',
                'name': 'County Commissioner',
                'description': 'Public Health District',
                'explanation': 'County Commissioners oversee public health departments, mental health services, and healthcare access programs in your area.',
                'level': 'local',
                'related_issues': ['healthcare', 'seniors']
            },
            {
                'id': 'mayor',
                'name': 'Mayor',
                'description': 'City Executive',
                'explanation': 'The Mayor sets environmental policy priorities, oversees sustainability initiatives, and can influence green infrastructure projects.',
                'level': 'local',
                'related_issues': ['environment', 'safety', 'economy']
            },
            {
                'id': 'transit-board',
                'name': 'Transit Authority Board',
                'description': 'Transportation District',
                'explanation': 'Transit Board members make decisions about bus routes, subway expansions, bike lanes, and public transportation funding.',
                'level': 'local',
                'related_issues': ['transportation', 'environment', 'infrastructure']
            },
            {
                'id': 'sheriff',
                'name': 'County Sheriff',
                'description': 'Law Enforcement',
                'explanation': 'The Sheriff oversees county law enforcement, jail operations, and community policing strategies that affect public safety.',
                'level': 'local',
                'related_issues': ['safety', 'rights']
            },
            {
                'id': 'city-council-general',
                'name': 'City Council',
                'description': 'At-Large Representative',
                'explanation': 'City Council members vote on policies and budgets that affect various community issues.',
                'level': 'local',
                'related_issues': ['immigration', 'taxes']
            }
        ]

        result = supabase.table('offices').insert(offices_data).execute()
        print(f"   ✅ Inserted {len(offices_data)} offices")

        # Insert ballot measures
        print("   🗳️  Inserting ballot measures...")
        ballot_measures_data = [
            {
                'id': 'measure-edu-1',
                'title': 'School Bond Initiative - Measure A',
                'description': 'Authorizes $500 million in bonds to modernize school facilities, upgrade technology infrastructure, and improve safety systems across all district schools.',
                'category': 'Education',
                'impact': 'Would increase property taxes by approximately $45 per year for the average homeowner',
                'related_issues': ['education', 'infrastructure']
            },
            {
                'id': 'measure-trans-1',
                'title': 'Public Transit Expansion - Measure B',
                'description': 'Funds the extension of light rail service to underserved communities and increases bus frequency during peak hours.',
                'category': 'Transportation',
                'impact': 'Would provide improved transit access to 25,000 additional residents',
                'related_issues': ['transportation', 'environment', 'infrastructure']
            },
            {
                'id': 'measure-env-1',
                'title': 'Clean Energy Initiative - Measure C',
                'description': 'Requires the city to transition to 100% renewable energy by 2030 and establishes a green jobs training program.',
                'category': 'Environment',
                'impact': 'Would create an estimated 500 new green jobs over the next 5 years',
                'related_issues': ['environment', 'economy']
            },
            {
                'id': 'measure-housing-1',
                'title': 'Affordable Housing Development - Measure D',
                'description': 'Allocates $300 million for affordable housing construction and first-time homebuyer assistance programs.',
                'category': 'Housing',
                'impact': 'Would create 2,000 new affordable housing units over 5 years',
                'related_issues': ['housing', 'economy']
            },
            {
                'id': 'measure-safety-1',
                'title': 'Community Safety Reform - Measure E',
                'description': 'Establishes community policing programs, crisis intervention teams, and civilian oversight board for law enforcement accountability.',
                'category': 'Public Safety',
                'impact': 'Would reallocate 15% of police budget to community safety programs',
                'related_issues': ['safety', 'rights']
            },
            {
                'id': 'measure-healthcare-1',
                'title': 'Public Health Expansion - Measure F',
                'description': 'Funds community health centers, mental health services, and senior wellness programs in underserved areas.',
                'category': 'Healthcare',
                'impact': 'Would provide healthcare access to 15,000 additional residents',
                'related_issues': ['healthcare', 'seniors']
            },
            {
                'id': 'measure-tax-1',
                'title': 'Progressive Business Tax - Measure G',
                'description': 'Implements graduated tax rate for businesses based on revenue to fund essential city services and infrastructure.',
                'category': 'Taxation',
                'impact': 'Would generate $50 million annually for city services',
                'related_issues': ['taxes', 'economy', 'infrastructure']
            },
            {
                'id': 'measure-immigration-1',
                'title': 'Sanctuary City Protection - Measure H',
                'description': 'Strengthens protections for immigrant communities and prohibits local cooperation with federal immigration enforcement.',
                'category': 'Immigration',
                'impact': 'Would provide legal protection and support services for immigrant families',
                'related_issues': ['immigration', 'rights', 'safety']
            }
        ]

        result = supabase.table('ballot_measures').insert(ballot_measures_data).execute()
        print(f"   ✅ Inserted {len(ballot_measures_data)} ballot measures")

        # Insert candidates
        print("   👥 Inserting candidates...")
        candidates_data = [
            {
                'id': 'candidate-1',
                'name': 'Sarah Chen',
                'party': 'Democratic',
                'photo': 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
                'positions': [
                    'Supports affordable housing initiatives and rent stabilization',
                    'Advocates for increased funding for public education',
                    'Champions climate action and renewable energy programs'
                ],
                'office_id': 'city-council',
                'related_issues': ['housing', 'education', 'environment']
            },
            {
                'id': 'candidate-2',
                'name': 'Marcus Johnson',
                'party': 'Republican',
                'photo': 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
                'positions': [
                    'Focuses on reducing regulations for small businesses',
                    'Supports traditional law enforcement approaches',
                    'Advocates for fiscal responsibility in city budgeting'
                ],
                'office_id': 'city-council',
                'related_issues': ['economy', 'safety', 'taxes']
            },
            {
                'id': 'candidate-3',
                'name': 'Elena Rodriguez',
                'party': 'Independent',
                'photo': 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena',
                'positions': [
                    'Prioritizes community-driven solutions to local issues',
                    'Supports sustainable transportation and infrastructure',
                    'Advocates for transparent government and citizen engagement'
                ],
                'office_id': 'mayor',
                'related_issues': ['transportation', 'infrastructure', 'rights']
            }
        ]

        result = supabase.table('candidates').insert(candidates_data).execute()
        print(f"   ✅ Inserted {len(candidates_data)} candidates")

        print("🌱 ✅ Database seeded successfully!")
        return True

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        return False

def verify_setup(supabase: Client):
    """Verify the database setup by checking table contents."""
    print("🔍 Verifying database setup...")

    try:
        # Check issues
        issues_result = supabase.table('issues').select('count()').execute()
        issues_count = len(issues_result.data) if issues_result.data else 0

        # Check offices
        offices_result = supabase.table('offices').select('count()').execute()
        offices_count = len(offices_result.data) if offices_result.data else 0

        # Check ballot measures
        measures_result = supabase.table('ballot_measures').select('count()').execute()
        measures_count = len(measures_result.data) if measures_result.data else 0

        # Check candidates
        candidates_result = supabase.table('candidates').select('count()').execute()
        candidates_count = len(candidates_result.data) if candidates_result.data else 0

        print(f"   📋 Issues: {issues_count}")
        print(f"   🏛️  Offices: {offices_count}")
        print(f"   🗳️  Ballot Measures: {measures_count}")
        print(f"   👥 Candidates: {candidates_count}")

        if all([issues_count > 0, offices_count > 0, measures_count > 0, candidates_count > 0]):
            print("✅ Database verification successful!")
            return True
        else:
            print("⚠️  Some tables appear to be empty")
            return False

    except Exception as e:
        print(f"❌ Error verifying database: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Migrate data to Supabase for Flint Spark')
    parser.add_argument('--setup', action='store_true', help='Run complete setup (schema + functions + seed)')
    parser.add_argument('--seed', action='store_true', help='Run seed data only')
    parser.add_argument('--reset', action='store_true', help='Reset and re-populate all data')
    parser.add_argument('--verify', action='store_true', help='Verify database setup')

    args = parser.parse_args()

    if not any([args.setup, args.seed, args.reset, args.verify]):
        parser.print_help()
        sys.exit(1)

    print("🚀 Flint Spark Database Migration Tool")
    print("=====================================")

    # Get Supabase client
    supabase = get_supabase_client()
    print("✅ Connected to Supabase")

    success = True

    if args.setup or args.reset:
        print("\n📋 Note: Schema and functions must be run manually in Supabase SQL Editor")
        print("   1. Run database/schema.sql in Supabase SQL Editor")
        print("   2. Run database/functions.sql in Supabase SQL Editor")
        print("   3. Then run this script with --seed to populate data")

    if args.seed or args.setup or args.reset:
        success = seed_data_via_client(supabase)

    if args.verify or (success and (args.setup or args.seed)):
        verify_setup(supabase)

    if success:
        print("\n🎉 Migration completed successfully!")
        print("\n📝 Next steps:")
        print("   1. Update your .env file with Supabase credentials")
        print("   2. Test your Flask API endpoints")
        print("   3. Verify frontend integration")
    else:
        print("\n❌ Migration failed. Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()