import json
import os
from datetime import datetime
import uuid

# Define the path to the data files
DATA_DIR = 'data'
CUSTOMERS_FILE = os.path.join(DATA_DIR, 'customers.json')
ORDERS_FILE = os.path.join(DATA_DIR, 'orders.json')

# Ensure the data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# --- Helper Functions for Data Loading/Saving ---

def _load_data(filepath):
    """Loads data from a JSON file."""
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def _save_data(filepath, data):
    """Saves data to a JSON file."""
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=4)

# --- Customer Functions ---

def get_all_customers():
    """
    Retrieves all customers and dynamically calculates their total orders
    and last order date.
    """
    customers = _load_data(CUSTOMERS_FILE)
    orders = _load_data(ORDERS_FILE)
    
    customer_orders_map = {}
    for order in orders:
        customer_id = order.get('customer_id')
        if customer_id not in customer_orders_map:
            customer_orders_map[customer_id] = []
        customer_orders_map[customer_id].append(order)

    for customer in customers:
        customer_id = customer['id']
        customer_orders = customer_orders_map.get(customer_id, [])
        
        customer['total_orders_count'] = len(customer_orders)
        
        # Calculate last_order_date
        if customer_orders:
            latest_order = max(
                customer_orders, 
                key=lambda o: datetime.fromisoformat(o['order_received_timestamp'])
            )
            customer['last_order_date'] = latest_order['order_received_timestamp'].split('T')[0] # Just date part
        else:
            customer['last_order_date'] = None
            
    return customers

def get_customer(customer_id):
    """
    Retrieves a single customer by ID and dynamically calculates their
    total orders and last order date.
    """
    customers = _load_data(CUSTOMERS_FILE)
    customer = next((c for c in customers if c['id'] == customer_id), None)
    
    if customer:
        orders = _load_data(ORDERS_FILE)
        customer_orders = [o for o in orders if o.get('customer_id') == customer_id]
        
        customer['total_orders_count'] = len(customer_orders)
        
        if customer_orders:
            latest_order = max(
                customer_orders, 
                key=lambda o: datetime.fromisoformat(o['order_received_timestamp'])
            )
            customer['last_order_date'] = latest_order['order_received_timestamp'].split('T')[0]
        else:
            customer['last_order_date'] = None
            
    return customer

def add_customer(customer_data):
    """Adds a new customer."""
    customers = _load_data(CUSTOMERS_FILE)
    new_customer = {
        'id': str(uuid.uuid4()),
        'name': customer_data['name'],
        'whatsapp_number': customer_data['whatsapp_number'],
        'delivery_address': customer_data['delivery_address'],
        'email': customer_data.get('email'),
        'discounts': customer_data.get('discounts', ''),
        'special_message': customer_data.get('special_message', ''),
        'created_at': datetime.now().isoformat(),
        # total_orders_count and last_order_date will be calculated dynamically on retrieval
    }
    customers.append(new_customer)
    _save_data(CUSTOMERS_FILE, customers)
    return new_customer

def update_customer(customer_id, updated_data):
    """Updates an existing customer's information."""
    customers = _load_data(CUSTOMERS_FILE)
    for i, customer in enumerate(customers):
        if customer['id'] == customer_id:
            # Update only allowed fields
            customer['name'] = updated_data.get('name', customer['name'])
            customer['whatsapp_number'] = updated_data.get('whatsapp_number', customer['whatsapp_number'])
            customer['delivery_address'] = updated_data.get('delivery_address', customer['delivery_address'])
            customer['email'] = updated_data.get('email', customer['email'])
            customer['discounts'] = updated_data.get('discounts', customer['discounts'])
            customer['special_message'] = updated_data.get('special_message', customer['special_message'])
            _save_data(CUSTOMERS_FILE, customers)
            return customer
    return None

def delete_customer(customer_id):
    """
    Deletes a customer and all their associated orders.
    Returns True if successful, False otherwise.
    """
    customers = _load_data(CUSTOMERS_FILE)
    original_len_customers = len(customers)
    customers = [c for c in customers if c['id'] != customer_id]
    
    if len(customers) == original_len_customers:
        return False # Customer not found

    _save_data(CUSTOMERS_FILE, customers)

    # Also delete associated orders
    orders = _load_data(ORDERS_FILE)
    orders = [o for o in orders if o.get('customer_id') != customer_id]
    _save_data(ORDERS_FILE, orders)
    
    return True

def get_customer_orders(customer_id):
    """Retrieves all orders for a specific customer."""
    orders = _load_data(ORDERS_FILE)
    bundles = _load_data(os.path.join(DATA_DIR, 'bundles.json'))
    add_ons = _load_data(os.path.join(DATA_DIR, 'add_ons.json'))

    customer_orders = [o for o in orders if o.get('customer_id') == customer_id]

    # Enhance order data with bundle and add-on names for display
    for order in customer_orders:
        bundle_name = next((b['name'] for b in bundles if b['id'] == order.get('bundle_id')), 'Unknown Bundle')
        order['bundle_name'] = bundle_name
        
        addon_names = []
        for addon_id in order.get('add_ons', []):
            addon_name = next((ao['name'] for ao in add_ons if ao['id'] == addon_id), None)
            if addon_name:
                addon_names.append(addon_name)
        order['add_ons_names'] = addon_names
        
    return customer_orders
