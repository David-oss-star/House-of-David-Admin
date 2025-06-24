from flask import Blueprint, request, jsonify
import uuid
from modules.utils import load_json_data, save_json_data

customers_bp = Blueprint('customers', __name__, url_prefix='/api/customers')

# --- Helper functions for data access within this module ---
def _get_all_customers():
    return load_json_data('customers.json')

def _save_all_customers(customers):
    save_json_data('customers.json', customers)

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
        "email": "john.doe@example.com" // Optional
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

    customers.append(new_customer_data)
    _save_all_customers(customers)
    return jsonify(new_customer_data), 201

@customers_bp.route('/<string:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    """
    Updates an existing customer's details.
    Use Case: Customer changes address, updating preferences.
    Expected Request Body:
    {
        "delivery_address": "New Address, Freetown"
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

