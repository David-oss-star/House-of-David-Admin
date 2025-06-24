import json
import os

# Define the base directory for your data files
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')

def load_json_data(filename):
    """Loads data from a specified JSON file."""
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        # Create an empty file if it doesn't exist
        with open(filepath, 'w') as f:
            json.dump([], f)
        return []
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        # Handle case where the file is empty or corrupted JSON
        print(f"Warning: {filename} is empty or corrupted. Initializing as empty list.")
        return []

def save_json_data(filename, data):
    """Saves data to a specified JSON file."""
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=4)

def ensure_data_files_exist():
    """Ensures all necessary data JSON files exist."""
    files = [
        'orders.json', 'customers.json', 'ingredients.json',
        'bundles.json', 'add_ons.json', 'delivery_agents.json'
    ]
    for filename in files:
        filepath = os.path.join(DATA_DIR, filename)
        if not os.path.exists(filepath):
            with open(filepath, 'w') as f:
                json.dump([], f)
            print(f"Created empty data file: {filename}")

