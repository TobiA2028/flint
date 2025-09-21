# Backend Setup Instructions

## Step 1: Create Virtual Environment

A virtual environment keeps your Python dependencies isolated from your system Python installation.

```bash
# Navigate to the backend directory
cd backend

# Create virtual environment (choose one method)
python3 -m venv venv        # macOS/Linux
python -m venv venv         # Windows

# Activate virtual environment
source venv/bin/activate    # macOS/Linux
venv\Scripts\activate       # Windows

# You should see (venv) in your terminal prompt when activated
```

## Step 2: Install Dependencies

```bash
# Make sure your virtual environment is activated (you see (venv) in prompt)
pip install -r requirements.txt

# Verify installation
pip list
```

## Step 3: Run the Flask Application

```bash
# Make sure you're in the backend directory with venv activated
python app.py

# You should see output like:
# * Running on http://127.0.0.1:5000
```

## Development Workflow

```bash
# When you start working:
cd backend
source venv/bin/activate    # Activate virtual environment
python app.py              # Run Flask server

# When you're done:
deactivate                  # Deactivate virtual environment
```

## Troubleshooting

### Virtual Environment Issues
- Make sure you're in the `backend` directory when creating the venv
- On some systems, use `python3` instead of `python`
- If activation doesn't work, check your shell (bash vs zsh vs fish)

### Package Installation Issues
- Make sure virtual environment is activated (see `(venv)` in prompt)
- Try upgrading pip: `pip install --upgrade pip`
- On macOS, you might need Xcode command line tools: `xcode-select --install`

### Port Issues
- If port 5000 is busy, Flask will suggest an alternative
- You can specify a different port in the app.py file