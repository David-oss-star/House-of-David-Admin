import os
from flask import Flask, render_template
from modules.utils import ensure_data_files_exist

# Import blueprints from your modules
from modules.orders import orders_bp
from modules.customers import customers_bp
from modules.inventory import inventory_bp
from modules.deliveries import deliveries_bp
from modules.reporting import reporting_bp

app = Flask(__name__)

# Register Blueprints
# Each blueprint now has its own URL prefix defined within its file (e.g., /api/orders)
app.register_blueprint(orders_bp)
app.register_blueprint(customers_bp)
app.register_blueprint(inventory_bp)
app.register_blueprint(deliveries_bp)
app.register_blueprint(reporting_bp)


@app.route('/')
def index():
    """Serves the main HTML page for the order management system."""
    return render_template('index.html')

if __name__ == '__main__':
    # Ensure the data directory exists and all JSON files are initialized
    # This will create empty files if they don't exist
    data_dir_path = os.path.join(os.path.dirname(__file__), 'data')
    if not os.path.exists(data_dir_path):
        os.makedirs(data_dir_path)
    ensure_data_files_exist()

    app.run(debug=True, port=5000) # Run on port 5000
