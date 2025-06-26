from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
# Import save_json_data directly from modules.utils
from modules.utils import load_json_data, save_json_data

orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

# --- Helper functions for data access within this module ---
def _get_all_orders():
    return load_json_data('orders.json')

# We don't need _save_all_orders here directly if we're just updating it from utils
# def _save_all_orders(orders):
#     save_json_data('orders.json', orders)

def _get_all_customers():
    return load_json_data('customers.json')

# This helper is no longer needed; we directly use save_json_data from utils
# def _save_all_customers(customers):
#     save_json_data('customers.json', customers)

def _get_all_bundles():
    return load_json_data('bundles.json')

def _get_all_add_ons():
    return load_json_data('add_ons.json')

# Helper to get customer details by ID
def _get_customer_details(customer_id):
    customers = _get_all_customers()
    return next((c for c in customers if c['id'] == customer_id), None)

# Helper to get bundle name by ID
def _get_bundle_name(bundle_id):
    bundles = _get_all_bundles()
    bundle = next((b for b in bundles if b['id'] == bundle_id), None)
    return bundle['name'] if bundle else 'Unknown Bundle'

# Helper to get add-on name by ID
def _get_addon_name(addon_id):
    add_ons = _get_all_add_ons()
    add_on = next((ao for ao in add_ons if ao['id'] == addon_id), None)
    return add_on['name'] if add_on else 'Unknown Add-on'


@orders_bp.route('/', methods=['GET'])
def get_orders():
    """
    Retrieves all orders.
    Enriches order data with customer name, whatsapp_number, and delivery_address.
    Use Case: Displaying all orders in a table, filtering, searching.
    """
    orders = _get_all_orders()
    
    enriched_orders = []
    for order in orders:
        customer = _get_customer_details(order['customer_id'])
        
        # Create a copy to add customer details without modifying the original order object
        # which is directly from JSON data
        enriched_order = order.copy()
        
        if customer:
            enriched_order['customer_name'] = customer.get('name', 'Unknown Customer')
            enriched_order['whatsapp_number'] = customer.get('whatsapp_number', 'N/A')
            enriched_order['delivery_address'] = customer.get('delivery_address', 'N/A')
        else:
            # Fallback if customer not found (shouldn't happen with proper data integrity)
            enriched_order['customer_name'] = 'Unknown Customer (ID: ' + order['customer_id'][:8] + '...)'
            enriched_order['whatsapp_number'] = 'N/A'
            enriched_order['delivery_address'] = 'N/A'

        enriched_orders.append(enriched_order)

    # Sort orders by order_received_timestamp in descending order (newest first)
    sorted_orders = sorted(
        enriched_orders,
        key=lambda x: datetime.fromisoformat(x['order_received_timestamp']) if x.get('order_received_timestamp') else datetime.min,
        reverse=True
    )
    return jsonify(sorted_orders)


@orders_bp.route('/<string:order_id>', methods=['GET'])
def get_order(order_id):
    """
    Retrieves a specific order by ID.
    """
    orders = _get_all_orders()
    order = next((o for o in orders if o['id'] == order_id), None)
    if order:
        return jsonify(order)
    return jsonify({'error': 'Order not found'}), 404

@orders_bp.route('/', methods=['POST'])
def add_order():
    """
    Adds a new order.
    Updates customer's total_orders_count and last_order_date.
    """
    new_order_data = request.json
    orders = _get_all_orders()
    customers = _get_all_customers() # Get current customer data

    required_fields = ['customer_id', 'bundle_id', 'total_price', 'payment_status']
    if not all(field in new_order_data for field in required_fields):
        return jsonify({'error': 'Missing required order fields'}), 400

    new_order_data['id'] = str(uuid.uuid4())
    new_order_data['order_received_timestamp'] = datetime.now().isoformat()
    new_order_data['order_status'] = 'New' # Default status
    new_order_data['delivery_agent_id'] = None # No agent assigned by default
    new_order_data['delivery_timestamp'] = None # No delivery time by default

    orders.append(new_order_data)
    save_json_data('orders.json', orders) # Use save_json_data from utils

    # Update customer's order count and last order date
    for i, customer in enumerate(customers):
        if customer['id'] == new_order_data['customer_id']:
            customer['total_orders_count'] = customer.get('total_orders_count', 0) + 1
            customer['last_order_date'] = datetime.now().isoformat().split('T')[0] # Store date only
            save_json_data('customers.json', customers) # Use save_json_data from utils
            break

    return jsonify(new_order_data), 201

@orders_bp.route('/<string:order_id>', methods=['PUT'])
def update_order(order_id):
    """
    Updates an existing order's details (e.g., status, agent assignment).
    Automatically sets delivery_timestamp if status becomes 'Delivered'.
    """
    updated_data = request.json
    orders = _get_all_orders()
    
    for i, order in enumerate(orders):
        if order['id'] == order_id:
            # Handle delivery_timestamp automatically
            if 'order_status' in updated_data and updated_data['order_status'] == 'Delivered' and not order.get('delivery_timestamp'):
                order['delivery_timestamp'] = datetime.now().isoformat()
            
            for key, value in updated_data.items():
                order[key] = value
            
            orders[i] = order
            save_json_data('orders.json', orders) # Use save_json_data from utils
            return jsonify(order)
    return jsonify({'error': 'Order not found'}), 404

@orders_bp.route('/<string:order_id>', methods=['DELETE'])
def delete_order(order_id):
    """
    Deletes an order.
    Considers updating customer's total_orders_count and last_order_date
    (though decrementing count and finding previous last_order_date can be complex;
    for simplicity, we'll just remove the order).
    """
    orders = _get_all_orders()
    initial_len = len(orders)
    orders = [o for o in orders if o['id'] != order_id]
    if len(orders) < initial_len:
        save_json_data('orders.json', orders) # Use save_json_data from utils
        return jsonify({'message': 'Order deleted successfully'}), 200
    return jsonify({'error': 'Order not found'}), 404

