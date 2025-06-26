from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
from modules.utils import load_json_data, save_json_data

inventory_bp = Blueprint('inventory', __name__, url_prefix='/api/inventory')

# --- Helper functions for data access within this module ---
def _get_all_ingredients():
    return load_json_data('ingredients.json')

def _save_all_ingredients(ingredients):
    save_json_data('ingredients.json', ingredients)

def _get_all_bundles():
    return load_json_data('bundles.json')

def _save_all_bundles(bundles):
    save_json_data('bundles.json', bundles)

def _get_all_add_ons():
    return load_json_data('add_ons.json')

def _save_all_add_ons(add_ons):
    save_json_data('add_ons.json', add_ons)

def _get_all_orders():
    return load_json_data('orders.json')

def _get_customer_name(customer_id):
    """Looks up customer name from customers.json."""
    customers = load_json_data('customers.json')
    customer = next((c for c in customers if c['id'] == customer_id), None)
    return customer['name'] if customer else 'Unknown Customer'


# --- API Endpoints: Ingredients ---

@inventory_bp.route('/ingredients', methods=['GET'])
def get_ingredients():
    """
    Retrieves all raw ingredients with their current stock levels.
    Use Case: Procurement officer checking stock, inventory overview.
    """
    ingredients = _get_all_ingredients()
    return jsonify(ingredients)

@inventory_bp.route('/ingredients', methods=['POST'])
def add_ingredient():
    """
    Adds a new raw ingredient.
    Use Case: Expanding inventory, adding new types of produce.
    Expected Request Body:
    {
        "name": "Onions",
        "unit": "kg",
        "current_stock": 50,
        "reorder_point": 10,
        "last_cost_per_unit": 200,
        "supplier": "Local Farm" // Optional
    }
    """
    new_ingredient_data = request.json
    ingredients = _get_all_ingredients()

    if not all(k in new_ingredient_data for k in ['name', 'unit', 'current_stock']):
        return jsonify({'error': 'Missing required ingredient fields (name, unit, current_stock)'}), 400
    
    # Check for duplicate ingredient name (case-insensitive)
    if any(i['name'].lower() == new_ingredient_data['name'].lower() for i in ingredients):
        return jsonify({'error': 'Ingredient with this name already exists'}), 409


    new_ingredient_data['id'] = str(uuid.uuid4())
    new_ingredient_data['reorder_point'] = new_ingredient_data.get('reorder_point', 0)
    new_ingredient_data['last_cost_per_unit'] = new_ingredient_data.get('last_cost_per_unit', 0.0)
    new_ingredient_data['supplier'] = new_ingredient_data.get('supplier', '')


    ingredients.append(new_ingredient_data)
    _save_all_ingredients(ingredients)
    return jsonify(new_ingredient_data), 201

@inventory_bp.route('/ingredients/<string:ingredient_id>', methods=['PUT'])
def update_ingredient(ingredient_id):
    """
    Updates an ingredient's details or stock level.
    Use Case: After procurement (adding stock), after bundle packing (deducting stock).
    Expected Request Body:
    {
        "current_stock": 70,
        "last_cost_per_unit": 210
    }
    """
    updated_data = request.json
    ingredients = _get_all_ingredients()
    
    for i, ingredient in enumerate(ingredients):
        if ingredient['id'] == ingredient_id:
            for key, value in updated_data.items():
                ingredient[key] = value
            ingredients[i] = ingredient
            _save_all_ingredients(ingredients)
            return jsonify(ingredient)
    return jsonify({'error': 'Ingredient not found'}), 404

@inventory_bp.route('/ingredients/low-stock', methods=['GET'])
def get_low_stock_ingredients():
    """
    Retrieves ingredients whose current stock is below their reorder point.
    Use Case: Alerts for procurement officer to reorder.
    """
    ingredients = _get_all_ingredients()
    low_stock = [ing for ing in ingredients if ing.get('reorder_point') is not None and ing['current_stock'] <= ing['reorder_point']]
    return jsonify(low_stock)

# --- API Endpoints: Bundles (Products) ---

@inventory_bp.route('/bundles', methods=['GET'])
def get_bundles():
    """
    Retrieves all defined meal bundles.
    Use Case: Displaying available bundles to customers, admin managing bundle offerings.
    """
    bundles = _get_all_bundles()
    return jsonify(bundles)

@inventory_bp.route('/bundles/<string:bundle_id>', methods=['GET'])
def get_bundle(bundle_id):
    """
    Retrieves a specific bundle by its ID.
    Use Case: Viewing detailed bundle information.
    """
    bundles = _get_all_bundles()
    bundle = next((b for b in bundles if b['id'] == bundle_id), None)
    if bundle:
        return jsonify(bundle)
    return jsonify({'error': 'Bundle not found'}), 404

@inventory_bp.route('/bundles', methods=['POST'])
def add_bundle():
    """
    Adds a new meal bundle.
    Expected Request Body:
    {
        "name": "New Veggie Delight",
        "base_price": 75.00,
        "description": "A delicious vegetarian meal.",
        "is_active": true,
        "recipe": [
            {"ingredient_id": "uuid_carrot", "quantity": 0.5, "unit": "kg"},
            {"ingredient_id": "uuid_potato", "quantity": 1.0, "unit": "kg"}
        ]
    }
    """
    new_bundle_data = request.json
    bundles = _get_all_bundles()

    if not all(k in new_bundle_data for k in ['name', 'base_price', 'description']):
        return jsonify({'error': 'Missing required bundle fields (name, base_price, description)'}), 400
    
    # Check for duplicate bundle name (case-insensitive)
    if any(b['name'].lower() == new_bundle_data['name'].lower() for b in bundles):
        return jsonify({'error': 'Bundle with this name already exists'}), 409

    new_bundle_data['id'] = str(uuid.uuid4())
    new_bundle_data['is_active'] = new_bundle_data.get('is_active', True) # Default to active
    new_bundle_data['recipe'] = new_bundle_data.get('recipe', []) # Default to empty list

    bundles.append(new_bundle_data)
    _save_all_bundles(bundles)
    return jsonify(new_bundle_data), 201


@inventory_bp.route('/bundles/<string:bundle_id>', methods=['PUT'])
def update_bundle(bundle_id):
    """
    Updates an existing bundle's details.
    Use Case: Changing price, description, activating/deactivating bundle, updating recipe.
    Expected Request Body:
    {
        "name": "New Gravy Bundle",
        "base_price": 110.00,
        "is_active": false,
        "recipe": [
            {"ingredient_id": "uuid_onion", "quantity": 0.6, "unit": "kg"}
        ]
    }
    """
    updated_data = request.json
    bundles = _get_all_bundles()
    
    for i, bundle in enumerate(bundles):
        if bundle['id'] == bundle_id:
            for key, value in updated_data.items():
                # For recipe, replace entirely or merge as needed; here, simple replace
                if key == 'recipe' and not isinstance(value, list):
                    return jsonify({'error': 'Recipe must be a list of ingredient objects'}), 400
                bundle[key] = value
            bundles[i] = bundle
            _save_all_bundles(bundles)
            return jsonify(bundle)
    return jsonify({'error': 'Bundle not found'}), 404

@inventory_bp.route('/bundles/<string:bundle_id>/orders', methods=['GET'])
def get_bundle_orders(bundle_id):
    """
    Retrieves all orders that contain a specific bundle.
    Use Case: Seeing popularity of a bundle, impact of changing its recipe/price.
    """
    all_orders = _get_all_orders()
    orders_with_bundle = [o for o in all_orders if o.get('bundle_id') == bundle_id]
    
    # Enrich orders with customer name for better display
    enriched_orders = []
    for order in orders_with_bundle:
        order_copy = order.copy()
        order_copy['customer_name'] = _get_customer_name(order['customer_id'])
        enriched_orders.append(order_copy)
    
    # Sort by order received timestamp (newest first)
    sorted_orders = sorted(
        enriched_orders, 
        key=lambda x: datetime.fromisoformat(x['order_received_timestamp']) if x.get('order_received_timestamp') else datetime.min, 
        reverse=True
    )
    return jsonify(sorted_orders)


# --- API Endpoints: Add-ons ---

@inventory_bp.route('/add-ons', methods=['GET'])
def get_add_ons():
    """
    Retrieves all available add-ons.
    Use Case: Displaying customisation options to customers.
    """
    add_ons = _get_all_add_ons()
    return jsonify(add_ons)

@inventory_bp.route('/add-ons/<string:add_on_id>', methods=['GET'])
def get_add_on(add_on_id):
    """
    Retrieves a specific add-on by its ID.
    Use Case: Viewing detailed add-on information.
    """
    add_ons = _get_all_add_ons()
    add_on = next((ao for ao in add_ons if ao['id'] == add_on_id), None)
    if add_on:
        return jsonify(add_on)
    return jsonify({'error': 'Add-on not found'}), 404

@inventory_bp.route('/add-ons', methods=['POST'])
def add_add_on():
    """
    Adds a new add-on.
    Expected Request Body:
    {
        "name": "Extra Gravy",
        "price": 50.00,
        "unit": "cup", // e.g., "piece", "cup", "portion"
        "is_active": true
    }
    """
    new_add_on_data = request.json
    add_ons = _get_all_add_ons()

    if not all(k in new_add_on_data for k in ['name', 'price', 'unit']):
        return jsonify({'error': 'Missing required add-on fields (name, price, unit)'}), 400
    
    # Check for duplicate add-on name (case-insensitive)
    if any(ao['name'].lower() == new_add_on_data['name'].lower() for ao in add_ons):
        return jsonify({'error': 'Add-on with this name already exists'}), 409


    new_add_on_data['id'] = str(uuid.uuid4())
    new_add_on_data['is_active'] = new_add_on_data.get('is_active', True) # Default to active

    add_ons.append(new_add_on_data)
    _save_all_add_ons(add_ons)
    return jsonify(new_add_on_data), 201

@inventory_bp.route('/add-ons/<string:add_on_id>', methods=['PUT'])
def update_add_on(add_on_id):
    """
    Updates an existing add-on's details.
    Use Case: Changing price, activating/deactivating add-on.
    Expected Request Body:
    {
        "price": 60.00,
        "is_active": false
    }
    """
    updated_data = request.json
    add_ons = _get_all_add_ons()
    
    for i, add_on in enumerate(add_ons):
        if add_on['id'] == add_on_id:
            for key, value in updated_data.items():
                add_on[key] = value
            add_ons[i] = add_on
            _save_all_add_ons(add_ons)
            return jsonify(add_on)
    return jsonify({'error': 'Add-on not found'}), 404

@inventory_bp.route('/add-ons/<string:add_on_id>/orders', methods=['GET'])
def get_addon_orders(add_on_id):
    """
    Retrieves all orders that contain a specific add-on.
    Use Case: Seeing popularity of an add-on, impact of changing its price.
    """
    all_orders = _get_all_orders()
    orders_with_addon = [o for o in all_orders if add_on_id in o.get('add_ons', [])]
    
    # Enrich orders with customer name for better display
    enriched_orders = []
    for order in orders_with_addon:
        order_copy = order.copy()
        order_copy['customer_name'] = _get_customer_name(order['customer_id'])
        enriched_orders.append(order_copy)
    
    # Sort by order received timestamp (newest first)
    sorted_orders = sorted(
        enriched_orders, 
        key=lambda x: datetime.fromisoformat(x['order_received_timestamp']) if x.get('order_received_timestamp') else datetime.min, 
        reverse=True
    )
    return jsonify(sorted_orders)

