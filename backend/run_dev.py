#!/usr/bin/env python3
"""
Development server runner for Flint Spark Backend.

This script makes it easy to start the development server with the right
configuration and provides helpful debugging information.

Usage:
    python run_dev.py

Learning objectives:
- Understand development vs production server setup
- Learn about logging and debugging tools
- Practice environment configuration
"""

import os
import sys
from app import create_app
from config import get_config, print_config_info

def setup_development_environment():
    """
    Set up the development environment with helpful debugging tools.
    """
    # Set environment variables for development
    os.environ['FLASK_ENV'] = 'development'
    os.environ['FLASK_DEBUG'] = '1'

    # TODO: Add any other development-specific setup
    # Examples:
    # - Enable detailed logging
    # - Set up development database
    # - Configure development email settings

def print_startup_info():
    """
    Print helpful information when the server starts.
    """
    print("=" * 60)
    print("🚀 FLINT SPARK BACKEND - DEVELOPMENT SERVER")
    print("=" * 60)
    print()
    print("📡 Server Information:")
    print("   URL: http://localhost:5000")
    print("   Health Check: http://localhost:5000")
    print("   API Base: http://localhost:5000/api")
    print()
    print("🔗 API Endpoints:")
    print("   GET  /api/issues/frequencies  - Get issue frequency data")
    print("   POST /api/issues/increment    - Increment issue counts")
    print("   POST /api/issues/reset        - Reset data to demo values")
    print()
    print("🔧 Development Tools:")
    print("   Debug Mode: Enabled (auto-reload on code changes)")
    print("   CORS: Configured for React frontend")
    print("   Logging: Enabled for request monitoring")
    print()
    print("💡 Quick Start:")
    print("   1. Make sure your React app is running on port 8080")
    print("   2. Test the health check: curl http://localhost:5000")
    print("   3. Check the browser console for CORS errors")
    print()
    print("📚 Learning Tips:")
    print("   - Watch the terminal for request logs")
    print("   - Use browser dev tools to inspect API calls")
    print("   - Try the endpoints with curl or Postman")
    print("   - Check app.py and data_store.py for TODOs")
    print()
    print("=" * 60)
    print()

def check_requirements():
    """
    Check if all required dependencies are installed.
    """
    try:
        import flask
        import flask_cors
        print("✅ All required packages are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing required package: {e}")
        print("💡 Try running: pip install -r requirements.txt")
        return False

def main():
    """
    Main function to start the development server.
    """
    # Check requirements first
    if not check_requirements():
        sys.exit(1)

    # Set up development environment
    setup_development_environment()

    # Get development configuration
    config = get_config('development')

    # Print startup information
    print_startup_info()

    # Print configuration details
    print_config_info(config)

    # Create and configure the Flask app
    app = create_app()
    app.config.from_object(config)

    try:
        # Start the development server
        print("🔄 Starting server... (Press Ctrl+C to stop)")
        print()

        app.run(
            host='127.0.0.1',      # localhost only for security
            port=5001,             # using 5001 to avoid macOS AirPlay conflict
            debug=True,            # enable debug mode
            use_reloader=True,     # auto-reload on code changes
            use_debugger=True,     # enable interactive debugger
            threaded=True          # handle multiple requests
        )

    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Server error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()