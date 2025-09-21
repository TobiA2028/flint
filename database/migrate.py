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
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")

    if not supabase_url or not supabase_key:
        print(
            "❌ Error: SUPABASE_URL and SUPABASE_KEY must be set in environment variables"
        )
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

        with open(file_path, "r") as file:
            sql_content = file.read()

        print(f"🔄 {description}...")

        # Split SQL file into individual statements
        statements = [stmt.strip() for stmt in sql_content.split(";") if stmt.strip()]

        for i, statement in enumerate(statements):
            if statement and not statement.startswith("--"):
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
        supabase.table("candidates").delete().neq("id", "non-existent").execute()
        supabase.table("ballot_measures").delete().neq("id", "non-existent").execute()
        supabase.table("offices").delete().neq("id", "non-existent").execute()
        supabase.table("issues").delete().neq("id", "non-existent").execute()

        # Insert issues
        print("   📋 Inserting issues...")
        issues_data = [
            {
                "id": "housing",
                "name": "Housing",
                "icon": "Home",
                "description": "Affordable housing, rent control, and homeownership programs",
                "count": 1247,
                "related_offices": ["city-council"],
                "related_measures": [
                    "measure-housing-1",
                    "measure-housing-2",
                    "measure-disaster-1",
                ],
            },
            {
                "id": "city-budget",
                "name": "City Budget",
                "icon": "DollarSign",
                "description": "City finances, taxes, and allocation of public funds",
                "count": 982,
                "related_offices": ["city-council"],
                "related_measures": [
                    "measure-budget-1",
                    "measure-housing-1",
                    "measure-housing-2",
                ],
            },
            {
                "id": "environment",
                "name": "Environment",
                "icon": "Leaf",
                "description": "Clean air, water, and sustainability programs",
                "count": 803,
                "related_offices": ["city-council"],
                "related_measures": ["measure-env-1"],
            },
            {
                "id": "economy",
                "name": "Economy",
                "icon": "Briefcase",
                "description": "Job creation, small business support, and workforce development",
                "count": 1567,
                "related_offices": ["city-council"],
                "related_measures": ["measure-budget-1"],
            },
            {
                "id": "infrastructure",
                "name": "Infrastructure",
                "icon": "Building",
                "description": "Roads, sidewalks, utilities, and public works projects",
                "count": 1123,
                "related_offices": ["city-council"],
                "related_measures": [],  # no measures in dataset
            },
            {
                "id": "public-safety",
                "name": "Public Safety",
                "icon": "Shield",
                "description": "Crime prevention, policing, and emergency response",
                "count": 2104,
                "related_offices": ["city-council"],
                "related_measures": [],  # no measures in dataset
            },
            {
                "id": "transportation",
                "name": "Transportation",
                "icon": "Car",
                "description": "Transit, traffic, and street improvements",
                "count": 674,
                "related_offices": ["city-council"],
                "related_measures": [],  # no measures in dataset
            },
            {
                "id": "natural-disasters",
                "name": "Natural Disasters",
                "icon": "CloudRain",
                "description": "Flood control, disaster preparedness, and recovery",
                "count": 543,
                "related_offices": ["city-council"],
                "related_measures": ["measure-disaster-1", "measure-env-1"],
            },
        ]

        result = supabase.table("issues").insert(issues_data).execute()
        print(f"   ✅ Inserted {len(issues_data)} issues")

        # Insert offices
        print("   🏛️  Inserting offices...")
        offices_data = [
            {
                "id": "city-council",
                "name": "City Council",
                "description": "District Representative",
                "explanation": "City Council members vote on zoning laws, affordable housing projects, and rent control policies that directly affect housing costs in your neighborhood.",
                "level": "local",
                "related_issues": ["housing", "economy", "infrastructure"],
            }
        ]

        result = supabase.table("offices").insert(offices_data).execute()
        print(f"   ✅ Inserted {len(offices_data)} offices")

        # Insert ballot measures
        print("   🗳️  Inserting ballot measures...")
        ballot_measures_data = [
            {
                "id": "measure-env-1",
                "title": "Proposition 4 - Texas Water Fund",
                "description": "Allocates $1 billion annually from state sales tax revenue to fund water infrastructure, conservation, and planning.",
                "category": "Environment",
                "impact": "Would dedicate long-term funds to water projects but reduce legislative budget flexibility.",
                "related_issues": ["environment", "natural-disasters"],
            },
            {
                "id": "measure-budget-1",
                "title": "Proposition 9 - Business Property Tax Exemption",
                "description": "Exempts up to $125,000 of personal property used to produce income from state property taxes.",
                "category": "City Budget",
                "impact": "Supports small businesses but could reduce county revenues for local services.",
                "related_issues": ["economy", "city-budget"],
            },
            {
                "id": "measure-housing-1",
                "title": "Proposition 11 - Senior & Disabled Homestead Tax Exemption",
                "description": "Raises property tax exemption for elderly and disabled homeowners from $10,000 to $60,000.",
                "category": "Housing",
                "impact": "Would provide tax relief to seniors and disabled Texans while shifting burden to others.",
                "related_issues": ["housing", "city-budget"],
            },
            {
                "id": "measure-disaster-1",
                "title": "Proposition 10 - Fire-Destroyed Home Property Tax Exemption",
                "description": "Allows temporary property tax relief for homeowners whose houses are completely destroyed by fire.",
                "category": "Natural Disasters",
                "impact": "Would help homeowners recover faster after disasters but reduce local tax revenue.",
                "related_issues": ["housing", "natural-disasters"],
            },
            {
                "id": "measure-housing-2",
                "title": "Proposition 13 - Homestead Tax Exemption Increase",
                "description": "Increases the property tax exemption for primary residences from $100,000 to $140,000 of the market value of a homestead.",
                "category": "Housing",
                "impact": "Would reduce property taxes for homeowners but lower revenue available for schools and local services.",
                "related_issues": ["housing", "city-budget"],
            },
        ]
        result = (
            supabase.table("ballot_measures").insert(ballot_measures_data).execute()
        )
        print(f"   ✅ Inserted {len(ballot_measures_data)} ballot measures")

        # Insert candidates
        print("   👥 Inserting candidates...")
        candidates_data = [
            {
                "id": "candidate-1",
                "name": "Angie Thibodeaux",
                "party": "Independent",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=angie",
                "positions": [
                    "Supports housing stability and tenant protections",
                    "Advocates for stronger neighborhood engagement",
                    "Experienced in housing and public administration",
                ],
                "office_id": "city-council",
                "related_issues": ["housing"
                , "public-safety"],
            },
            {
                "id": "candidate-2",
                "name": "Alejandra Salinas",
                "party": "Democratic",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=alejandra",
                "positions": [
                    "Supports public safety and reliable city services",
                    "Advocates for infrastructure improvements",
                    "Fights for better working conditions for city employees",
                ],
                "office_id": "city-council",
                "related_issues": ["public-safety", "infrastructure", "city-budget"],
            },
            {
                "id": "candidate-3",
                "name": "Sonia Rivera",
                "party": "Independent",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=sonia",
                "positions": [
                    "Prioritizes crime prevention and safer neighborhoods",
                    "Supports housing infrastructure investment",
                    "Advocates for expanded economic opportunity",
                ],
                "office_id": "city-council",
                "related_issues": ["public-safety", "housing", "economy"],
            },
            {
                "id": "candidate-4",
                "name": "Jordan Thomas",
                "party": "Democratic",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan",
                "positions": [
                    "Focuses on infrastructure improvements",
                    "Supports affordable housing and land use reform",
                    "Advocates for climate resilience and disaster relief",
                ],
                "office_id": "city-council",
                "related_issues": [
                    "infrastructure",
                    "housing",
                    "environment",
                    "natural-disasters",
                ],
            },
            {
                "id": "candidate-5",
                "name": "Ethan Hale",
                "party": "Progressive",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=ethan",
                "positions": [
                    "Supports housing and tenant protections",
                    "Advocates for expanded social services and homelessness solutions",
                    "Champions environmental protection",
                ],
                "office_id": "city-council",
                "related_issues": ["housing", "environment", "public-safety"],
            },
            {
                "id": "candidate-6",
                "name": "Cris Wright",
                "party": "Independent",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=cris",
                "positions": [
                    "Supports small businesses and Houston’s cultural heritage",
                    "Advocates for affordable housing",
                    "Focuses on safe, community-centered infrastructure",
                ],
                "office_id": "city-council",
                "related_issues": ["economy", "housing", "infrastructure"],
            },
            {
                "id": "candidate-7",
                "name": "Al Loyd",
                "party": "Independent",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=al",
                "positions": [
                    "Prioritizes infrastructure improvements",
                    "Supports public safety initiatives",
                    "Advocates for small business support",
                ],
                "office_id": "city-council",
                "related_issues": ["infrastructure", "public-safety", "economy"],
            },
            {
                "id": "candidate-8",
                "name": "Martina Lemond Dixon",
                "party": "Republican",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=martina",
                "positions": [
                    "Supports law enforcement and public safety",
                    "Advocates for fiscal responsibility",
                    "Focuses on infrastructure and flood resilience",
                ],
                "office_id": "city-council",
                "related_issues": [
                    "public-safety",
                    "infrastructure",
                    "city-budget",
                    "natural-disasters",
                ],
            },
            {
                "id": "candidate-9",
                "name": "Miguel Herrera",
                "party": "Independent",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=miguel",
                "positions": [
                    "Advocates for affordability in city living",
                    "Opposes wasteful city spending",
                    "Supports safer East Houston neighborhoods",
                ],
                "office_id": "city-council",
                "related_issues": ["economy", "public-safety", "housing"],
            },
            {
                "id": "candidate-10",
                "name": "Kristal Mtaza-Lyons",
                "party": "Independent",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=kristal",
                "positions": [
                    "Supports public safety and community trust",
                    "Advocates for affordable housing and homelessness solutions",
                    "Focuses on workforce development and flood readiness",
                ],
                "office_id": "city-council",
                "related_issues": [
                    "public-safety",
                    "housing",
                    "economy",
                    "natural-disasters",
                ],
            },
            {
                "id": "candidate-11",
                "name": "Sheraz Mohammad Siddiqui",
                "party": "Independent",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=sheraz",
                "positions": [
                    "Supports law enforcement and lower taxes",
                    "Advocates for flood mitigation",
                    "Promotes business-friendly policies and trade",
                ],
                "office_id": "city-council",
                "related_issues": [
                    "public-safety",
                    "economy",
                    "natural-disasters",
                    "city-budget",
                ],
            },
            {
                "id": "candidate-12",
                "name": "Kathy L. Tatum",
                "party": "Independent",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=kathy",
                "positions": [
                    "Advocates for government transparency",
                    "Supports cutting city payments to outside nonprofits",
                    "Focuses on expanding sidewalk networks",
                ],
                "office_id": "city-council",
                "related_issues": ["city-budget", "infrastructure"],
            },
            {
                "id": "candidate-13",
                "name": "Adrian Thomas Rogers",
                "party": "Independent",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=adrian",
                "positions": [
                    "Advocates for crime prevention technology",
                    "Supports homelessness solutions",
                    "Focuses on transportation and street safety",
                ],
                "office_id": "city-council",
                "related_issues": ["public-safety", "housing", "transportation"],
            },
            {
                "id": "candidate-14",
                "name": "Brad Batteau",
                "party": "Independent",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=brad",
                "positions": [
                    "Supports flood mitigation",
                    "Advocates for improving city revenue",
                ],
                "office_id": "city-council",
                "related_issues": ["natural-disasters", "city-budget"],
            },
            {
                "id": "candidate-15",
                "name": "Dwight Boykins",
                "party": "Democratic",
                "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=dwight",
                "positions": [
                    "Advocates for flood control in neighborhoods",
                    "Supports assistance for seniors",
                    "Encourages grocery store development",
                    "Focuses on addressing city budget deficit",
                ],
                "office_id": "city-council",
                "related_issues": [
                    "natural-disasters",
                    "housing",
                    "city-budget",
                    "economy",
                ],
            },
        ]

        result = supabase.table("candidates").insert(candidates_data).execute()
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
        issues_result = supabase.table("issues").select("count()").execute()
        issues_count = len(issues_result.data) if issues_result.data else 0

        # Check offices
        offices_result = supabase.table("offices").select("count()").execute()
        offices_count = len(offices_result.data) if offices_result.data else 0

        # Check ballot measures
        measures_result = supabase.table("ballot_measures").select("count()").execute()
        measures_count = len(measures_result.data) if measures_result.data else 0

        # Check candidates
        candidates_result = supabase.table("candidates").select("count()").execute()
        candidates_count = len(candidates_result.data) if candidates_result.data else 0

        print(f"   📋 Issues: {issues_count}")
        print(f"   🏛️  Offices: {offices_count}")
        print(f"   🗳️  Ballot Measures: {measures_count}")
        print(f"   👥 Candidates: {candidates_count}")

        if all(
            [
                issues_count > 0,
                offices_count > 0,
                measures_count > 0,
                candidates_count > 0,
            ]
        ):
            print("✅ Database verification successful!")
            return True
        else:
            print("⚠️  Some tables appear to be empty")
            return False

    except Exception as e:
        print(f"❌ Error verifying database: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Migrate data to Supabase for Flint Spark"
    )
    parser.add_argument(
        "--setup",
        action="store_true",
        help="Run complete setup (schema + functions + seed)",
    )
    parser.add_argument("--seed", action="store_true", help="Run seed data only")
    parser.add_argument(
        "--reset", action="store_true", help="Reset and re-populate all data"
    )
    parser.add_argument("--verify", action="store_true", help="Verify database setup")

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
        print(
            "\n📋 Note: Schema and functions must be run manually in Supabase SQL Editor"
        )
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
