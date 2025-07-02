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

def _save_all_orders(orders):
    save_json_data('orders.json', orders)

def _get_all_bundles():
    return load_json_data('bundles.json')

def _get_all_add_ons():
    return load_json_data('add_ons.json')

# --- API Endpoints: Customers ---

@customers_bp.route('/', methods=['GET'])
def get_customers():
    """
    Retrieves all customers with aggregated order data.
    Use Case: Displaying customer directory, customer relationship management.
    """
    customers = _get_all_customers()
    orders = _get_all_orders()

    customer_data = []
    for customer in customers:
        customer_orders = [o for o in orders if o['customer_id'] == customer['id']]
        total_orders_count = len(customer_orders)
        
        last_order_date = None
        if customer_orders:
            # Sort orders by timestamp to find the latest
            customer_orders.sort(key=lambda x: x.get('order_received_timestamp', ''), reverse=True)
            last_order_date = customer_orders[0].get('order_received_timestamp')

        customer_data.append({
            'id': customer['id'],
            'name': customer['name'],
            'whatsapp_number': customer.get('whatsapp_number', 'N/A'),
            'delivery_address': customer.get('delivery_address', 'N/A'),
            'email': customer.get('email', ''), # Added email
            'discounts': customer.get('discounts', ''), # Added discounts
            'special_message': customer.get('special_message', ''), # Added special_message
            'total_orders_count': total_orders_count,
            'last_order_date': last_order_date
        })
    return jsonify(customer_data)

@customers_bp.route('/<string:customer_id>', methods=['GET'])
def get_customer(customer_id):
    """
    Retrieves a single customer by ID.
    Use Case: Viewing detailed customer profile.
    """
    customers = _get_all_customers()
    customer = next((c for c in customers if c['id'] == customer_id), None)
    if customer:
        return jsonify(customer)
    return jsonify({'error': 'Customer not found'}), 404

@customers_bp.route('/', methods=['POST'])
def add_customer():
    """
    Adds a new customer.
    Use Case: New customer registration.
    Expected Request Body:
    {
        "name": "Jane Doe",
        "whatsapp_number": "+23277123456",
        "delivery_address": "123 Main St, Freetown",
        "email": "jane@example.com", // Optional
        "discounts": "10% off first order", // Optional
        "special_message": "Likes extra spicy food" // Optional
    }
    """
    new_customer_data = request.json
    customers = _get_all_customers()

    if not all(k in new_customer_data for k in ['name', 'whatsapp_number', 'delivery_address']):
        return jsonify({'error': 'Missing required customer fields (name, whatsapp_number, delivery_address)'}), 400

    # Basic validation for WhatsApp number format (optional, can be more robust)
    if not new_customer_data['whatsapp_number'].strip().replace(" ", "").startswith('+232'):
        return jsonify({'error': 'WhatsApp number must start with +232 and include country code'}), 400

    new_customer_data['id'] = str(uuid.uuid4())
    new_customer_data['email'] = new_customer_data.get('email', '')
    new_customer_data['discounts'] = new_customer_data.get('discounts', '')
    new_customer_data['special_message'] = new_customer_data.get('special_message', '')

    customers.append(new_customer_data)
    _save_all_customers(customers)
    return jsonify(new_customer_data), 201

@customers_bp.route('/<string:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    """
    Updates an existing customer's details.
    Use Case: Updating contact info, adding loyalty notes.
    Expected Request Body:
    {
        "name": "Jane A. Doe",
        "email": "jane.doe@example.com"
    }
    """
    updated_data = request.json
    customers = _get_all_customers()
    
    for i, customer in enumerate(customers):
        if customer['id'] == customer_id:
            for key, value in updated_data.items():
                if key in ['name', 'whatsapp_number', 'delivery_address', 'email', 'discounts', 'special_message']:
                    customer[key] = value
            customers[i] = customer
            _save_all_customers(customers)
            return jsonify(customer)
    return jsonify({'error': 'Customer not found'}), 404

@customers_bp.route('/<string:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    """
    Deletes a customer and all associated orders.
    Use Case: Customer requests data removal.
    """
    customers = _get_all_customers()
    orders = _get_all_orders()

    customer_found = False
    updated_customers = [c for c in customers if c['id'] != customer_id]
    if len(updated_customers) < len(customers): # Customer was found and removed
        customer_found = True
        _save_all_customers(updated_customers)

        # Remove all orders associated with this customer
        updated_orders = [o for o in orders if o['customer_id'] != customer_id]
        _save_all_orders(updated_orders)
    
    if customer_found:
        return jsonify({'message': f'Customer {customer_id} and all associated orders deleted successfully'}), 200
    return jsonify({'error': 'Customer not found'}), 404


@customers_bp.route('/<string:customer_id>/orders', methods=['GET'])
def get_customer_orders_route(customer_id): # Renamed to avoid conflict with data function
    """
    Retrieves all orders placed by a specific customer.
    Use Case: Reviewing a customer's purchase history.
    """
    orders = _get_all_orders()
    bundles = _get_all_bundles()
    add_ons_list = _get_all_add_ons()

    customer_orders = [o for o in orders if o.get('customer_id') == customer_id]
    
    enriched_orders = []
    for order in customer_orders:
        order_copy = order.copy()
        
        # Get bundle name
        bundle = next((b for b in bundles if b['id'] == order.get('bundle_id')), None)
        order_copy['bundle_name'] = bundle['name'] if bundle else 'Unknown Bundle'

        # Get add-on names
        add_on_names = []
        for ao_id in order.get('add_ons', []):
            add_on = next((ao for ao in add_ons_list if ao['id'] == ao_id), None)
            if add_on:
                add_on_names.append(add_on['name'])
        order_copy['add_ons_names'] = add_on_names
        
        enriched_orders.append(order_copy)
    
    # Sort by order received timestamp (newest first)
    sorted_orders = sorted(
        enriched_orders, 
        key=lambda x: datetime.fromisoformat(x['order_received_timestamp']) if x.get('order_received_timestamp') else datetime.min, 
        reverse=True
    )
    return jsonify(sorted_orders)
