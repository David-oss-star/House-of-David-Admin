import json
import os
from flask import Flask, request, jsonify, render_template
from datetime import datetime
import uuid # For generating unique order IDs

app = Flask(__name__)

# Define the path to your data file
DATA_FILE = 'data.json'

def load_orders():
    """Loads order data from the JSON file."""
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        # Handle case where the file is empty or corrupted
        return []

def save_orders(orders):
    """Saves order data to the JSON file."""
    with open(DATA_FILE, 'w') as f:
        json.dump(orders, f, indent=4)

@app.route('/')
def index():
    """Serves the main HTML page for the order management system."""
    return render_template('index.html')

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """API endpoint to retrieve all orders."""
    orders = load_orders()
    return jsonify(orders)

@app.route('/api/orders', methods=['POST'])
def add_order():
    """
    API endpoint to add a new order.
    Expects JSON data with order details.
    """
    new_order_data = request.json
    orders = load_orders()

    # Generate a unique ID for the new order
    new_order_data['id'] = str(uuid.uuid4())
    # Record the timestamp when the order was received
    new_order_data['order_received_timestamp'] = datetime.now().isoformat()
    # Set default status and empty agent/delivery info
    new_order_data['order_status'] = 'New'
    new_order_data['delivery_agent_id'] = ''
    new_order_data['delivery_timestamp'] = ''

    orders.append(new_order_data)
    save_orders(orders)
    return jsonify(new_order_data), 201 # Return 201 Created status

@app.route('/api/orders/<string:order_id>', methods=['PUT'])
def update_order(order_id):
    """
    API endpoint to update an existing order.
    Expects JSON data with fields to update.
    """
    updated_data = request.json
    orders = load_orders()
    
    for i, order in enumerate(orders):
        if order['id'] == order_id:
            # Update only provided fields
            for key, value in updated_data.items():
                order[key] = value
            
            # If status is set to 'Delivered', record delivery timestamp
            if order.get('order_status') == 'Delivered' and not order.get('delivery_timestamp'):
                order['delivery_timestamp'] = datetime.now().isoformat()
            
            orders[i] = order
            save_orders(orders)
            return jsonify(order)
    return jsonify({'error': 'Order not found'}), 404

@app.route('/api/orders/<string:order_id>', methods=['DELETE'])
def delete_order(order_id):
    """API endpoint to delete an order."""
    orders = load_orders()
    initial_len = len(orders)
    orders = [order for order in orders if order['id'] != order_id]
    if len(orders) < initial_len:
        save_orders(orders)
        return jsonify({'message': 'Order deleted successfully'}), 200
    return jsonify({'error': 'Order not found'}), 404

if __name__ == '__main__':
    # Create an empty data.json file if it doesn't exist
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            f.write('[]')
    
    app.run(debug=True, port=5010) # Run in debug mode for development (auto-reloads on changes)