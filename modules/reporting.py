from flask import Blueprint, jsonify, request
from modules.utils import load_json_data
from datetime import datetime, timedelta

reporting_bp = Blueprint('reporting', __name__, url_prefix='/api/reports')

# --- Helper functions for data aggregation ---
def _get_all_orders():
    return load_json_data('orders.json')

def _get_all_customers():
    return load_json_data('customers.json')

def _get_all_bundles():
    return load_json_data('bundles.json')

def _get_all_add_ons():
    return load_json_data('add_ons.json')

def _get_all_agents():
    return load_json_data('delivery_agents.json')


@reporting_bp.route('/daily-summary', methods=['GET'])
def daily_summary():
    """
    Provides a summary of orders for a given day (defaults to today).
    Use Case: Daily operational review, quick check on daily performance.
    Optional Query Parameters: 'date' (YYYY-MM-DD)
    """
    date_str = request.args.get('date')
    if date_str:
        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400
    else:
        target_date = datetime.now().date()

    orders = _get_all_orders()
    daily_orders = [
        o for o in orders 
        if o.get('order_received_timestamp') and datetime.fromisoformat(o['order_received_timestamp']).date() == target_date
    ]

    total_orders = len(daily_orders)
    total_revenue = sum(o.get('total_price', 0) for o in daily_orders if o['order_status'] == 'Delivered' or o['payment_status'] == 'Paid')
    delivered_orders_count = sum(1 for o in daily_orders if o['order_status'] == 'Delivered')

    return jsonify({
        'date': target_date.isoformat(),
        'total_orders_received': total_orders,
        'total_revenue_for_delivered_paid_orders': total_revenue,
        'delivered_orders_count': delivered_orders_count
    })

@reporting_bp.route('/sales-by-bundle', methods=['GET'])
def sales_by_bundle():
    """
    Shows sales performance for each bundle type over a period (defaults to last 30 days).
    Use Case: Identifying best-selling bundles for marketing and procurement planning.
    Optional Query Parameters: 'days' (integer, for last N days)
    """
    days = int(request.args.get('days', 30))
    start_date = datetime.now() - timedelta(days=days)

    orders = _get_all_orders()
    bundles = _get_all_bundles()
    bundle_names = {b['id']: b['name'] for b in bundles}

    sales_data = {} # {bundle_name: count}

    for order in orders:
        if order.get('order_received_timestamp') and datetime.fromisoformat(order['order_received_timestamp']) >= start_date:
            bundle_id = order.get('bundle_id') # Assuming one bundle per order for simplicity
            if bundle_id:
                name = bundle_names.get(bundle_id, 'Unknown Bundle')
                sales_data[name] = sales_data.get(name, 0) + 1
    
    # Convert to list of dicts for easier consumption
    sorted_sales = sorted([{'bundle_name': k, 'orders_count': v} for k, v in sales_data.items()], key=lambda x: x['orders_count'], reverse=True)
    
    return jsonify({
        'period_days': days,
        'start_date': start_date.isoformat(),
        'end_date': datetime.now().isoformat(),
        'sales_by_bundle': sorted_sales
    })

@reporting_bp.route('/agent-performance', methods=['GET'])
def agent_performance():
    """
    Reports on delivery agent performance (e.g., total deliveries, average delivery time).
    Use Case: Evaluating agent efficiency, commission calculation.
    Optional Query Parameters: 'days' (integer, for last N days)
    """
    days = int(request.args.get('days', 30))
    start_date = datetime.now() - timedelta(days=days)

    orders = _get_all_orders()
    agents = _get_all_agents()
    agent_names = {a['id']: a['name'] for a in agents}

    agent_performance_data = {} # {agent_id: {total_deliveries: X, total_delivery_time_seconds: Y}}

    for order in orders:
        agent_id = order.get('delivery_agent_id')
        order_received = order.get('order_received_timestamp')
        delivery_completed = order.get('delivery_timestamp')
        
        if agent_id and order['order_status'] == 'Delivered' and order_received and delivery_completed:
            order_rec_dt = datetime.fromisoformat(order_received)
            del_comp_dt = datetime.fromisoformat(delivery_completed)

            if order_rec_dt >= start_date: # Only count orders within the period
                if agent_id not in agent_performance_data:
                    agent_performance_data[agent_id] = {'total_deliveries': 0, 'total_delivery_time_seconds': 0}
                
                agent_performance_data[agent_id]['total_deliveries'] += 1
                time_diff = (del_comp_dt - order_rec_dt).total_seconds()
                agent_performance_data[agent_id]['total_delivery_time_seconds'] += time_diff
    
    results = []
    for agent_id, data in agent_performance_data.items():
        avg_time_sec = data['total_delivery_time_seconds'] / data['total_deliveries'] if data['total_deliveries'] > 0 else 0
        avg_time_minutes = round(avg_time_sec / 60, 2)
        results.append({
            'agent_id': agent_id,
            'agent_name': agent_names.get(agent_id, 'Unknown Agent'),
            'total_deliveries': data['total_deliveries'],
            'average_delivery_time_minutes': avg_time_minutes
        })

    return jsonify(sorted(results, key=lambda x: x['total_deliveries'], reverse=True))


@reporting_bp.route('/grand-total-sales', methods=['GET'])
def grand_total_sales():
    """
    Calculates the grand total sales (revenue) from all delivered or paid orders across all time.
    Use Case: High-level business performance metric for the dashboard.
    """
    orders = _get_all_orders()
    total_sales = sum(o.get('total_price', 0) for o in orders if o['order_status'] == 'Delivered' or o['payment_status'] == 'Paid')
    total_orders_count = len(orders)
    customers = _get_all_customers()
    total_customers_count = len(customers)

    return jsonify({
        'grand_total_sales': total_sales,
        'total_orders_all_time': total_orders_count,
        'total_customers_registered': total_customers_count
    })
