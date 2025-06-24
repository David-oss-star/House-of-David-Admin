from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
from modules.utils import load_json_data, save_json_data

# Create a Blueprint for the orders module
orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

# --- Helper functions for data access within this module ---
def _get_all_orders():
    return load_json_data('orders.json')

def _save_all_orders(orders):
    save_json_data('orders.json', orders)

def _get_customer_name(customer_id):
    """Looks up customer name from customers.json."""
    customers = load_json_data('customers.json')
    customer = next((c for c in customers if c['id'] == customer_id), None)
    return customer['name'] if customer else 'Unknown Customer'

def _get_agent_name(agent_id):
    """Looks up agent name from delivery_agents.json."""
    agents = load_json_data('delivery_agents.json')
    agent = next((a for a in agents if a['id'] == agent_id), None)
    return agent['name'] if agent else 'Unassigned'

# --- API Endpoints ---

@orders_bp.route('/', methods=['GET'])
def get_orders():
    """
    Retrieves all orders.
    Use Case: Displaying all current orders in the admin dashboard.
    """
    orders = _get_all_orders()
    # Enrich orders with customer and agent names for display
    enriched_orders = []
    for order in orders:
        order_copy = order.copy()
        order_copy['customer_name'] = _get_customer_name(order['customer_id'])
        order_copy['delivery_agent_name'] = _get_agent_name(order.get('delivery_agent_id', ''))
        enriched_orders.append(order_copy)
    return jsonify(enriched_orders)

@orders_bp.route('/<string:order_id>', methods=['GET'])
def get_order(order_id):
    """
    Retrieves a specific order by its ID.
    Use Case: Viewing details of a single order.
    """
    orders = _get_all_orders()
    order = next((o for o in orders if o['id'] == order_id), None)
    if order:
        order_copy = order.copy()
        order_copy['customer_name'] = _get_customer_name(order['customer_id'])
        order_copy['delivery_agent_name'] = _get_agent_name(order.get('delivery_agent_id', ''))
        return jsonify(order_copy)
    return jsonify({'error': 'Order not found'}), 404

@orders_bp.route('/', methods=['POST'])
def add_order():
    """
    Adds a new order.
    Use Case: When an admin or customer places a new order (from WhatsApp or future customer portal).
    Expected Request Body:
    {
        "customer_id": "uuid_of_existing_customer",
        "bundle_id": "uuid_of_chosen_bundle",
        "add_ons": ["uuid_of_addon1", "uuid_of_addon2"], # List of add-on IDs
        "total_price": 150.00,
        "payment_status": "Pending", // or "Paid"
        "special_instructions": "No onions please"
    }
    """
    new_order_data = request.json
    orders = _get_all_orders()

    # Basic validation
    if not all(k in new_order_data for k in ['customer_id', 'bundle_id', 'total_price', 'payment_status']):
        return jsonify({'error': 'Missing required order fields'}), 400

    # Generate a unique ID for the new order
    new_order_data['id'] = str(uuid.uuid4())
    new_order_data['order_received_timestamp'] = datetime.now().isoformat()
    new_order_data['order_status'] = 'New' # Default status
    new_order_data['delivery_agent_id'] = new_order_data.get('delivery_agent_id', '') # Can be empty
    new_order_data['delivery_timestamp'] = '' # Empty initially

    orders.append(new_order_data)
    _save_all_orders(orders)
    return jsonify(new_order_data), 201

@orders_bp.route('/<string:order_id>', methods=['PUT'])
def update_order(order_id):
    """
    Updates an existing order's details or status.
    Use Case: Admin changing order status, assigning agent, updating price.
    Expected Request Body:
    {
        "order_status": "Packed",
        "delivery_agent_id": "uuid_of_agent",
        "total_price": 160.00
    }
    """
    updated_data = request.json
    orders = _get_all_orders()
    
    for i, order in enumerate(orders):
        if order['id'] == order_id:
            # Update only provided fields
            for key, value in updated_data.items():
                order[key] = value
            
            # If status is set to 'Delivered', record delivery timestamp
            if order.get('order_status') == 'Delivered' and not order.get('delivery_timestamp'):
                order['delivery_timestamp'] = datetime.now().isoformat()
            
            orders[i] = order
            _save_all_orders(orders)
            return jsonify(order)
    return jsonify({'error': 'Order not found'}), 404

@orders_bp.route('/<string:order_id>', methods=['DELETE'])
def delete_order(order_id):
    """
    Deletes an order.
    Use Case: Cancelling an order (e.g., customer changed mind, stock issue).
    """
    orders = _get_all_orders()
    initial_len = len(orders)
    orders = [order for order in orders if order['id'] != order_id]
    if len(orders) < initial_len:
        _save_all_orders(orders)
        return jsonify({'message': 'Order deleted successfully'}), 200
    return jsonify({'error': 'Order not found'}), 404
