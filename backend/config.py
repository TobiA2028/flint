"""
Configuration settings for the Flask backend.

This module centralizes all configuration options for different environments
(development, testing, production). This is a best practice that makes it
easy to manage settings as your application grows.

Learning objectives:
- Understand configuration management patterns
- Learn about environment variables and security
- Practice separating configuration from code
"""

import os
from typing import List

class Config:
    """
    Base configuration class.

    Contains settings that are common across all environments.
    """

    # ========================================================================
    # FLASK SETTINGS
    # ========================================================================

    # Secret key for session management and security
    # In production, this should be a long, random string
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'

    # Debug mode (should be False in production)
    DEBUG = False

    # Maximum content length for uploads (16MB)
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024

    # ========================================================================
    # CORS SETTINGS
    # ========================================================================

    # TODO: Configure CORS origins properly
    # This is one of your learning tasks!

    # CORS origins (URLs that can access your API)
    # For development, you want to allow your React dev server
    CORS_ORIGINS = [
        "http://localhost:8080",    # React dev server default
        "http://127.0.0.1:8080",    # Alternative localhost format
        # TODO: Add any other origins you need
    ]

    # CORS methods (HTTP methods allowed from frontend)
    CORS_METHODS = [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"  # Important for preflight requests
    ]

    # CORS headers (which headers the frontend can send)
    CORS_ALLOW_HEADERS = [
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "X-Requested-With"
    ]

    # ========================================================================
    # API SETTINGS
    # ========================================================================

    # API version (useful for future versioning)
    API_VERSION = "v1"

    # Rate limiting (requests per minute per IP)
    RATE_LIMIT_PER_MINUTE = 100

    # Default pagination size
    DEFAULT_PAGE_SIZE = 50

    # ========================================================================
    # SUPABASE SETTINGS
    # ========================================================================

    # Supabase configuration from environment variables
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

    # Database connection string (alternative access method)
    DATABASE_URL = os.environ.get('DATABASE_URL')

    # ========================================================================
    # DATA STORE SETTINGS (Legacy - kept for migration purposes)
    # ========================================================================

    # Whether to persist data between server restarts
    PERSIST_DATA = False

    # Path to save data file (if persisting)
    DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), 'data.json')

    # Initial demo data multiplier (for realistic numbers)
    DEMO_DATA_MULTIPLIER = 100


class DevelopmentConfig(Config):
    """
    Development environment configuration.

    Used when running the app locally for development.
    """

    DEBUG = True

    # More permissive CORS for development
    CORS_ORIGINS = [
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:3000",    # In case you use port 3000
        "http://127.0.0.1:3000",
    ]

    # Development-specific settings
    PERSIST_DATA = False  # Don't persist in development (fresh data each restart)

    # Development Supabase settings
    # In development, you might use the same project or a development-specific one


class TestingConfig(Config):
    """
    Testing environment configuration.

    Used when running automated tests.
    """

    TESTING = True
    DEBUG = True

    # Use in-memory data for tests
    PERSIST_DATA = False

    # Disable CORS for tests
    CORS_ORIGINS = ["*"]


class ProductionConfig(Config):
    """
    Production environment configuration.

    Used when deploying to a production server.
    """

    DEBUG = False

    # TODO: Set production CORS origins
    # In production, you should specify exact origins, not wildcards
    CORS_ORIGINS = [
        # TODO: Add your production frontend URL here
        # "https://your-app.com",
        # "https://www.your-app.com"
    ]

    # Production-specific settings
    PERSIST_DATA = True  # Persist data in production

    # Production Supabase settings
    # In production, ensure environment variables are properly set
    # and consider using connection pooling for better performance


# ============================================================================
# CONFIGURATION FACTORY
# ============================================================================

# Map environment names to configuration classes
config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}


def get_config(config_name: str = None) -> Config:
    """
    Get configuration based on environment name.

    Args:
        config_name (str): Environment name (development, testing, production)

    Returns:
        Config: Configuration instance

    Example:
        config = get_config('development')
        app.config.from_object(config)
    """
    if config_name is None:
        # Get from environment variable or default to development
        config_name = os.environ.get('FLASK_ENV', 'development')

    return config_by_name.get(config_name, DevelopmentConfig)


# ============================================================================
# LEARNING EXERCISES
# ============================================================================

# TODO Exercise 1: CORS Configuration
# Update the CORS_ORIGINS in DevelopmentConfig to match your React app's URL
# Test by making requests from your frontend

# TODO Exercise 2: Environment Variables
# Try setting FLASK_ENV environment variable and see how it changes config
# Example: export FLASK_ENV=production

# TODO Exercise 3: Custom Settings
# Add your own configuration settings for features you want to implement
# Examples:
# - Email settings for notifications
# - Database connection strings
# - API keys for external services

# TODO Exercise 4: Security
# Research Flask security best practices and add relevant settings
# Examples:
# - Session timeout
# - CSRF protection
# - Content security policy headers


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def print_config_info(config: Config) -> None:
    """
    Print configuration information for debugging.

    Args:
        config (Config): Configuration instance to display
    """
    print("🔧 Configuration Settings:")
    print(f"   Debug Mode: {config.DEBUG}")
    print(f"   CORS Origins: {config.CORS_ORIGINS}")
    print(f"   API Version: {config.API_VERSION}")
    print(f"   Persist Data: {config.PERSIST_DATA}")
    print("---")


if __name__ == "__main__":
    """
    Test configuration loading.

    Run this file to see how different configurations work:
    python config.py
    """
    print("🧪 Testing Configuration System...")

    # Test different environments
    for env_name in ['development', 'testing', 'production']:
        print(f"\n📋 {env_name.upper()} Configuration:")
        config = get_config(env_name)
        print_config_info(config)

    print("🎉 Configuration testing complete!")