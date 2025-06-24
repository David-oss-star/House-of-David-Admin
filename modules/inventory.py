from flask import Blueprint, request, jsonify
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
        "last_cost_per_unit": 200
    }
    """
    new_ingredient_data = request.json
    ingredients = _get_all_ingredients()

    if not all(k in new_ingredient_data for k in ['name', 'unit', 'current_stock']):
        return jsonify({'error': 'Missing required ingredient fields'}), 400

    new_ingredient_data['id'] = str(uuid.uuid4())
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

@inventory_bp.route('/bundles', methods=['POST'])
def add_bundle():
    """
    Adds a new meal bundle definition.
    Use Case: Creating new meal options for customers.
    Expected Request Body:
    {
        "name": "Gravy Bundle",
        "base_price": 100.00,
        "description": "All ingredients for delicious gravy.",
        "is_active": true,
        "recipe": [ // This would link to ingredient IDs and quantities
            {"ingredient_id": "uuid_onion", "quantity": 0.5, "unit": "kg"},
            {"ingredient_id": "uuid_tomato_paste", "quantity": 1, "unit": "can"}
        ]
    }
    """
    new_bundle_data = request.json
    bundles = _get_all_bundles()

    if not all(k in new_bundle_data for k in ['name', 'base_price', 'description']):
        return jsonify({'error': 'Missing required bundle fields'}), 400

    new_bundle_data['id'] = str(uuid.uuid4())
    bundles.append(new_bundle_data)
    _save_all_bundles(bundles)
    return jsonify(new_bundle_data), 201

# --- API Endpoints: Add-ons ---

@inventory_bp.route('/add-ons', methods=['GET'])
def get_add_ons():
    """
    Retrieves all available add-ons.
    Use Case: Displaying customisation options to customers.
    """
    add_ons = _get_all_add_ons()
    return jsonify(add_ons)

@inventory_bp.route('/add-ons', methods=['POST'])
def add_add_on():
    """
    Adds a new add-on definition.
    Use Case: Introducing new premium add-ons like chicken, crab.
    Expected Request Body:
    {
        "name": "Chicken (whole)",
        "price": 50.00,
        "unit": "piece",
        "is_active": true
    }
    """
    new_add_on_data = request.json
    add_ons = _get_all_add_ons()

    if not all(k in new_add_on_data for k in ['name', 'price', 'unit']):
        return jsonify({'error': 'Missing required add-on fields'}), 400

    new_add_on_data['id'] = str(uuid.uuid4())
    add_ons.append(new_add_on_data)
    _save_all_add_ons(add_ons)
    return jsonify(new_add_on_data), 201

