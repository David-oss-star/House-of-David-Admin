from flask import Blueprint, request, jsonify
import uuid
from modules.utils import load_json_data, save_json_data

deliveries_bp = Blueprint('deliveries', __name__, url_prefix='/api/deliveries')

# --- Helper functions for data access within this module ---
def _get_all_agents():
    return load_json_data('delivery_agents.json')

def _save_all_agents(agents):
    save_json_data('delivery_agents.json', agents)

# --- API Endpoints ---

@deliveries_bp.route('/agents', methods=['GET'])
def get_agents():
    """
    Retrieves all delivery agents.
    Use Case: Operations manager viewing available agents, assigning orders.
    """
    agents = _get_all_agents()
    return jsonify(agents)

@deliveries_bp.route('/agents', methods=['POST'])
def add_agent():
    """
    Registers a new delivery agent.
    Use Case: Onboarding new delivery personnel.
    Expected Request Body:
    {
        "name": "Agent David",
        "phone_number": "+23278901234",
        "is_available": true
    }
    """
    new_agent_data = request.json
    agents = _get_all_agents()

    if not all(k in new_agent_data for k in ['name', 'phone_number']):
        return jsonify({'error': 'Missing required agent fields'}), 400
    
    if any(a['phone_number'] == new_agent_data['phone_number'] for a in agents):
        return jsonify({'error': 'Agent with this phone number already exists'}), 409

    new_agent_data['id'] = str(uuid.uuid4())
    new_agent_data['total_deliveries_completed'] = 0
    new_agent_data['total_earnings'] = 0.0

    agents.append(new_agent_data)
    _save_all_agents(agents)
    return jsonify(new_agent_data), 201

@deliveries_bp.route('/agents/<string:agent_id>', methods=['PUT'])
def update_agent(agent_id):
    """
    Updates an agent's details or availability.
    Use Case: Agent going offline/online, updating contact info.
    Expected Request Body:
    {
        "is_available": false
    }
    """
    updated_data = request.json
    agents = _get_all_agents()
    
    for i, agent in enumerate(agents):
        if agent['id'] == agent_id:
            for key, value in updated_data.items():
                agent[key] = value
            agents[i] = agent
            _save_all_agents(agents)
            return jsonify(agent)
    return jsonify({'error': 'Agent not found'}), 404

@deliveries_bp.route('/agents/<string:agent_id>/orders', methods=['GET'])
def get_agent_assigned_orders(agent_id):
    """
    Retrieves all orders currently assigned to a specific agent.
    Use Case: Agent checking their assignments for the day.
    """
    orders = load_json_data('orders.json')
    assigned_orders = [o for o in orders if o.get('delivery_agent_id') == agent_id and o['order_status'] not in ['Delivered', 'Cancelled']]
    return jsonify(assigned_orders)
