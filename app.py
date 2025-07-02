from flask import Flask, request, jsonify, render_template
import os
from datetime import datetime, timedelta
import json
import uuid

# Import modules
from modules import customers, orders, inventory, deliveries, reports

app = Flask(__name__)

# Define the path to the data directory
DATA_DIR = 'data'

# Ensure the data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# Define file paths for all data types
CUSTOMERS_FILE = os.path.join(DATA_DIR, 'customers.json')
ORDERS_FILE = os.path.join(DATA_DIR, 'orders.json')
INGREDIENTS_FILE = os.path.join(DATA_DIR, 'ingredients.json')
BUNDLES_FILE = os.path.join(DATA_DIR, 'bundles.json')
ADD_ONS_FILE = os.path.join(DATA_DIR, 'add_ons.json')
AGENTS_FILE = os.path.join(DATA_DIR, 'agents.json')

# Initialize data files if they don't exist
for filepath in [CUSTOMERS_FILE, ORDERS_FILE, INGREDIENTS_FILE, BUNDLES_FILE, ADD_ONS_FILE, AGENTS_FILE]:
    if not os.path.exists(filepath):
        with open(filepath, 'w') as f:
            json.dump([], f) # Write an empty JSON array

@app.route('/')
def index():
    """Serve the main HTML page."""
    return render_template('index.html')

# --- API Endpoints for Customers ---

@app.route('/api/customers/', methods=['GET', 'POST'])
def handle_customers():
    if request.method == 'GET':
        all_customers = customers.get_all_customers()
        return jsonify(all_customers)
    elif request.method == 'POST':
        customer_data = request.json
        if not customer_data or not all(k in customer_data for k in ['name', 'whatsapp_number', 'delivery_address']):
            return jsonify({"error": "Missing customer data"}), 400
        new_customer = customers.add_customer(customer_data)
        return jsonify(new_customer), 201

@app.route('/api/customers/<customer_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_customer(customer_id):
    if request.method == 'GET':
        customer = customers.get_customer(customer_id)
        if customer:
            return jsonify(customer)
        return jsonify({"error": "Customer not found"}), 404
    elif request.method == 'PUT':
        updated_data = request.json
        customer = customers.update_customer(customer_id, updated_data)
        if customer:
            return jsonify(customer)
        return jsonify({"error": "Customer not found"}), 404
    elif request.method == 'DELETE':
        if customers.delete_customer(customer_id):
            return jsonify({"message": "Customer and associated orders deleted"}), 200
        return jsonify({"error": "Customer not found"}), 404

@app.route('/api/customers/<customer_id>/orders', methods=['GET'])
def get_customer_orders_api(customer_id):
    customer_orders = customers.get_customer_orders(customer_id)
    return jsonify(customer_orders)

# --- API Endpoints for Orders ---

@app.route('/api/orders/', methods=['GET', 'POST'])
def handle_orders():
    if request.method == 'GET':
        all_orders = orders.get_all_orders()
        return jsonify(all_orders)
    elif request.method == 'POST':
        order_data = request.json
        if not order_data or not all(k in order_data for k in ['customer_id', 'bundle_id', 'total_price', 'payment_status']):
            return jsonify({"error": "Missing order data"}), 400
        
        # Validate customer and bundle exist
        customer = customers.get_customer(order_data['customer_id'])
        if not customer:
            return jsonify({"error": "Customer not found"}), 404
        
        bundle = inventory.get_bundle(order_data['bundle_id'])
        if not bundle:
            return jsonify({"error": "Bundle not found"}), 404

        # Validate add-ons exist if provided
        if 'add_ons' in order_data and order_data['add_ons']:
            for addon_id in order_data['add_ons']:
                if not inventory.get_add_on(addon_id):
                    return jsonify({"error": f"Add-on with ID {addon_id} not found"}), 404

        new_order = orders.add_order(order_data)
        return jsonify(new_order), 201

@app.route('/api/orders/<order_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_order(order_id):
    if request.method == 'GET':
        order = orders.get_order(order_id)
        if order:
            return jsonify(order)
        return jsonify({"error": "Order not found"}), 404
    elif request.method == 'PUT':
        updated_data = request.json
        order_obj = orders.update_order(order_id, updated_data)
        if order_obj:
            return jsonify(order_obj)
        return jsonify({"error": "Order not found"}), 404
    elif request.method == 'DELETE':
        if orders.delete_order(order_id):
            return jsonify({"message": "Order deleted"}), 200
        return jsonify({"error": "Order not found"}), 404

# --- API Endpoints for Inventory (Ingredients, Bundles, Add-ons) ---

@app.route('/api/inventory/ingredients', methods=['GET', 'POST'])
def handle_ingredients():
    if request.method == 'GET':
        return jsonify(inventory.get_all_ingredients())
    elif request.method == 'POST':
        ingredient_data = request.json
        if not ingredient_data or not all(k in ingredient_data for k in ['name', 'unit', 'current_stock']):
            return jsonify({"error": "Missing ingredient data"}), 400
        new_ingredient = inventory.add_ingredient(ingredient_data)
        return jsonify(new_ingredient), 201

@app.route('/api/inventory/ingredients/<item_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_ingredient(item_id):
    if request.method == 'GET':
        item = inventory.get_ingredient(item_id)
        if item:
            return jsonify(item)
        return jsonify({"error": "Ingredient not found"}), 404
    elif request.method == 'PUT':
        updated_data = request.json
        item = inventory.update_ingredient(item_id, updated_data)
        if item:
            return jsonify(item)
        return jsonify({"error": "Ingredient not found"}), 404
    elif request.method == 'DELETE':
        if inventory.delete_ingredient(item_id):
            return jsonify({"message": "Ingredient deleted"}), 200
        return jsonify({"error": "Ingredient not found"}), 404

@app.route('/api/inventory/ingredients/<item_id>/stock', methods=['PUT'])
def update_ingredient_stock(item_id):
    data = request.json
    quantity_change = data.get('quantity_change')
    unit_cost = data.get('unit_cost') # Optional, for restock
    if quantity_change is None:
        return jsonify({"error": "Missing quantity_change"}), 400
    
    updated_ingredient = inventory.update_ingredient_stock(item_id, quantity_change, unit_cost)
    if updated_ingredient:
        return jsonify(updated_ingredient)
    return jsonify({"error": "Ingredient not found or stock update failed"}), 404

@app.route('/api/inventory/bundles', methods=['GET', 'POST'])
def handle_bundles():
    if request.method == 'GET':
        return jsonify(inventory.get_all_bundles())
    elif request.method == 'POST':
        bundle_data = request.json
        if not bundle_data or not all(k in bundle_data for k in ['name', 'base_price', 'description', 'recipe']):
            return jsonify({"error": "Missing bundle data"}), 400
        if not isinstance(bundle_data['recipe'], list):
            return jsonify({"error": "Recipe must be a list"}), 400
        
        # Validate ingredients in recipe
        for item in bundle_data['recipe']:
            if not all(k in item for k in ['ingredient_id', 'quantity', 'unit']):
                return jsonify({"error": "Recipe item missing ingredient_id, quantity, or unit"}), 400
            if not inventory.get_ingredient(item['ingredient_id']):
                return jsonify({"error": f"Ingredient with ID {item['ingredient_id']} not found in recipe"}), 404

        new_bundle = inventory.add_bundle(bundle_data)
        return jsonify(new_bundle), 201

@app.route('/api/inventory/bundles/<item_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_bundle(item_id):
    if request.method == 'GET':
        item = inventory.get_bundle(item_id)
        if item:
            return jsonify(item)
        return jsonify({"error": "Bundle not found"}), 404
    elif request.method == 'PUT':
        updated_data = request.json
        item = inventory.update_bundle(item_id, updated_data)
        if item:
            return jsonify(item)
        return jsonify({"error": "Bundle not found"}), 404
    elif request.method == 'DELETE':
        if inventory.delete_bundle(item_id):
            return jsonify({"message": "Bundle deleted"}), 200
        return jsonify({"error": "Bundle not found"}), 404

@app.route('/api/inventory/bundles/<bundle_id>/orders', methods=['GET'])
def get_bundle_orders_api(bundle_id):
    bundle_orders = inventory.get_bundle_orders(bundle_id)
    return jsonify(bundle_orders)

@app.route('/api/inventory/add-ons', methods=['GET', 'POST'])
def handle_add_ons():
    if request.method == 'GET':
        return jsonify(inventory.get_all_add_ons())
    elif request.method == 'POST':
        addon_data = request.json
        if not addon_data or not all(k in addon_data for k in ['name', 'price', 'unit', 'current_stock']):
            return jsonify({"error": "Missing add-on data"}), 400
        new_addon = inventory.add_add_on(addon_data)
        return jsonify(new_addon), 201

@app.route('/api/inventory/add-ons/<item_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_add_on(item_id):
    if request.method == 'GET':
        item = inventory.get_add_on(item_id)
        if item:
            return jsonify(item)
        return jsonify({"error": "Add-on not found"}), 404
    elif request.method == 'PUT':
        updated_data = request.json
        item = inventory.update_add_on(item_id, updated_data)
        if item:
            return jsonify(item)
        return jsonify({"error": "Add-on not found"}), 404
    elif request.method == 'DELETE':
        if inventory.delete_add_on(item_id):
            return jsonify({"message": "Add-on deleted"}), 200
        return jsonify({"error": "Add-on not found"}), 404

@app.route('/api/inventory/add-ons/<item_id>/stock', methods=['PUT'])
def update_add_on_stock(item_id):
    data = request.json
    quantity_change = data.get('quantity_change')
    unit_cost = data.get('unit_cost') # Optional, for restock
    if quantity_change is None:
        return jsonify({"error": "Missing quantity_change"}), 400
    
    updated_addon = inventory.update_add_on_stock(item_id, quantity_change, unit_cost)
    if updated_addon:
        return jsonify(updated_addon)
    return jsonify({"error": "Add-on not found or stock update failed"}), 404

@app.route('/api/inventory/add-ons/<addon_id>/orders', methods=['GET'])
def get_addon_orders_api(addon_id):
    addon_orders = inventory.get_addon_orders(addon_id)
    return jsonify(addon_orders)


# --- API Endpoints for Deliveries (Agents) ---

@app.route('/api/deliveries/agents', methods=['GET', 'POST'])
def handle_agents():
    if request.method == 'GET':
        return jsonify(deliveries.get_all_agents())
    elif request.method == 'POST':
        agent_data = request.json
        if not agent_data or not all(k in agent_data for k in ['name', 'phone_number']):
            return jsonify({"error": "Missing agent data"}), 400
        new_agent = deliveries.add_agent(agent_data)
        return jsonify(new_agent), 201

@app.route('/api/deliveries/agents/<agent_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_agent(agent_id):
    if request.method == 'GET':
        agent = deliveries.get_agent(agent_id)
        if agent:
            return jsonify(agent)
        return jsonify({"error": "Agent not found"}), 404
    elif request.method == 'PUT':
        updated_data = request.json
        agent = deliveries.update_agent(agent_id, updated_data)
        if agent:
            return jsonify(agent)
        return jsonify({"error": "Agent not found"}), 404
    elif request.method == 'DELETE':
        if deliveries.delete_agent(agent_id):
            return jsonify({"message": "Agent deleted"}), 200
        return jsonify({"error": "Agent not found"}), 404

# --- API Endpoints for Reports ---

@app.route('/api/reports/daily-summary', methods=['GET'])
def get_daily_summary_report():
    report = reports.generate_daily_summary()
    return jsonify(report)

@app.route('/api/reports/sales-by-bundle', methods=['GET'])
def get_sales_by_bundle_report():
    report = reports.generate_sales_by_bundle()
    return jsonify(report)

@app.route('/api/reports/agent-performance', methods=['GET'])
def get_agent_performance_report():
    report = reports.generate_agent_performance()
    return jsonify(report)

@app.route('/api/reports/grand-total-sales', methods=['GET'])
def get_grand_total_sales_report():
    all_orders = orders.get_all_orders()
    total_sales = sum(order['total_price'] for order in all_orders if order['payment_status'] == 'Paid' or order['order_status'] == 'Delivered')
    total_orders = len(all_orders)
    total_customers = len(customers.get_all_customers()) # Use the customer module's function
    
    return jsonify({
        "grand_total_sales": total_sales,
        "total_orders_all_time": total_orders,
        "total_customers_registered": total_customers
    })

if __name__ == '__main__':
    app.run(debug=True)

