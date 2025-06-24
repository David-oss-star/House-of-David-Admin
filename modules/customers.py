from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
from modules.utils import load_json_data, save_json_data

customers_bp = Blueprint('customers', __name__, url_prefix='/api/customers')

# --- Helper functions for data access within this module ---
def _get_all_customers():
    return load_json_data('customers.json')

def _save_all_customers(customers):
    save_json_data('customers.json', customers)

def _get_all_orders():
    return load_json_data('orders.json')

def _get_all_bundles():
    return load_json_data('bundles.json')

def _get_all_add_ons():
    return load_json_data('add_ons.json')

def _get_customer_name(customer_id):
    """Looks up customer name from customers.json."""
    customers = load_json_data('customers.json')
    customer = next((c for c in customers if c['id'] == customer_id), None)
    return customer['name'] if customer else 'Unknown Customer'

def _get_bundle_name(bundle_id):
    """Looks up bundle name from bundles.json."""
    bundles = load_json_data('bundles.json')
    bundle = next((b for b in bundles if b['id'] == bundle_id), None)
    return bundle['name'] if bundle else 'N/A Bundle'

def _get_addon_name(addon_id):
    """Looks up add-on name from add_ons.json."""
    add_ons = load_json_data('add_ons.json')
    add_on = next((ao for ao in add_ons if ao['id'] == addon_id), None)
    return add_on['name'] if add_on else 'N/A Add-on'


# --- API Endpoints ---

@customers_bp.route('/', methods=['GET'])
def get_customers():
    """
    Retrieves all customer profiles.
    Use Case: Admin viewing customer list, searching for a customer.
    """
    customers = _get_all_customers()
    return jsonify(customers)

@customers_bp.route('/<string:customer_id>', methods=['GET'])
def get_customer(customer_id):
    """
    Retrieves a specific customer profile by ID.
    Use Case: Viewing detailed customer information.
    """
    customers = _get_all_customers()
    customer = next((c for c in customers if c['id'] == customer_id), None)
    if customer:
        return jsonify(customer)
    return jsonify({'error': 'Customer not found'}), 404

@customers_bp.route('/', methods=['POST'])
def add_customer():
    """
    Adds a new customer profile.
    Use Case: Registering a new customer when they place their first order.
    Expected Request Body:
    {
        "name": "John Doe",
        "whatsapp_number": "+23277123456",
        "delivery_address": "123 Main St, Freetown",
        "email": "john.doe@example.com", // Optional
        "discounts": "Loyalty 5%", // Optional
        "special_message": "Loves extra spice" // Optional
    }
    """
    new_customer_data = request.json
    customers = _get_all_customers()

    # Basic validation
    if not all(k in new_customer_data for k in ['name', 'whatsapp_number', 'delivery_address']):
        return jsonify({'error': 'Missing required customer fields'}), 400
    
    # Check for duplicate WhatsApp number
    if any(c['whatsapp_number'] == new_customer_data['whatsapp_number'] for c in customers):
        return jsonify({'error': 'Customer with this WhatsApp number already exists'}), 409 # Conflict

    new_customer_data['id'] = str(uuid.uuid4())
    new_customer_data['total_orders_count'] = 0 # Initialize
    new_customer_data['last_order_date'] = '' # Initialize
    new_customer_data['discounts'] = new_customer_data.get('discounts', '') # Initialize new fields
    new_customer_data['special_message'] = new_customer_data.get('special_message', '') # Initialize new fields

    customers.append(new_customer_data)
    _save_all_customers(customers)
    return jsonify(new_customer_data), 201

@customers_bp.route('/<string:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    """
    Updates an existing customer's details, including new fields like discounts and special messages.
    Use Case: Customer changes address, updating preferences, adding discount info.
    Expected Request Body:
    {
        "delivery_address": "New Address, Freetown",
        "discounts": "Holiday Special 10%",
        "special_message": "Always call before delivery"
    }
    """
    updated_data = request.json
    customers = _get_all_customers()
    
    for i, customer in enumerate(customers):
        if customer['id'] == customer_id:
            for key, value in updated_data.items():
                customer[key] = value
            customers[i] = customer
            _save_all_customers(customers)
            return jsonify(customer)
    return jsonify({'error': 'Customer not found'}), 404

@customers_bp.route('/<string:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    """
    Deletes a customer profile.
    Use Case: Removing inactive or requested customer data (handle with care due to linked orders).
    """
    customers = _get_all_customers()
    initial_len = len(customers)
    customers = [c for c in customers if c['id'] != customer_id]
    if len(customers) < initial_len:
        _save_all_customers(customers)
        return jsonify({'message': 'Customer deleted successfully'}), 200
    return jsonify({'error': 'Customer not found'}), 404

@customers_bp.route('/<string:customer_id>/orders', methods=['GET'])
def get_customer_orders(customer_id):
    """
    Retrieves all orders for a specific customer.
    Use Case: Viewing a customer's purchase history.
    """
    all_orders = _get_all_orders()
    customer_orders = [o for o in all_orders if o['customer_id'] == customer_id]

    # Enrich order details with bundle and add-on names for better display
    enriched_orders = []
    for order in customer_orders:
        order_copy = order.copy()
        order_copy['bundle_name'] = _get_bundle_name(order['bundle_id'])
        order_copy['add_ons_names'] = [_get_addon_name(aid) for aid in order.get('add_ons', [])]
        enriched_orders.append(order_copy)
    
    # Sort by order received timestamp (newest first)
    sorted_orders = sorted(
        enriched_orders, 
        key=lambda x: datetime.fromisoformat(x['order_received_timestamp']) if x.get('order_received_timestamp') else datetime.min, 
        reverse=True
    )
    return jsonify(sorted_orders)


