import json
import os
from datetime import datetime, timedelta

# Define the path to the data files
DATA_DIR = 'data'
ORDERS_FILE = os.path.join(DATA_DIR, 'orders.json')
BUNDLES_FILE = os.path.join(DATA_DIR, 'bundles.json')
AGENTS_FILE = os.path.join(DATA_DIR, 'agents.json')

# --- Helper Functions for Data Loading ---

def _load_data(filepath):
    """Loads data from a JSON file."""
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def generate_daily_summary():
    """Generates a daily summary report."""
    orders = _load_data(ORDERS_FILE)
    
    today = datetime.now().date()
    
    total_orders_received = 0
    delivered_orders_count = 0
    total_revenue_for_delivered_paid_orders = 0.0

    for order in orders:
        order_date_str = order.get('order_received_timestamp', '').split('T')[0]
        try:
            order_date = datetime.fromisoformat(order_date_str).date()
        except ValueError:
            continue # Skip orders with invalid date formats

        if order_date == today:
            total_orders_received += 1
            
            if order.get('order_status') == 'Delivered':
                delivered_orders_count += 1
                # Sum revenue only for delivered orders that are also paid
                if order.get('payment_status') == 'Paid':
                    total_revenue_for_delivered_paid_orders += order.get('total_price', 0.0)
            elif order.get('payment_status') == 'Paid' and order.get('order_status') != 'Cancelled':
                # Also include paid orders that are not yet delivered but not cancelled
                total_revenue_for_delivered_paid_orders += order.get('total_price', 0.0)

    return {
        "date": today.isoformat(),
        "total_orders_received": total_orders_received,
        "delivered_orders_count": delivered_orders_count,
        "total_revenue_for_delivered_paid_orders": round(total_revenue_for_delivered_paid_orders, 2)
    }

def generate_sales_by_bundle(period_days=30):
    """Generates a report of sales by bundle for a given period."""
    orders = _load_data(ORDERS_FILE)
    bundles = _load_data(BUNDLES_FILE)
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=period_days)

    bundle_sales = {} # {bundle_id: count}
    bundle_names = {b['id']: b['name'] for b in bundles}

    for order in orders:
        order_timestamp_str = order.get('order_received_timestamp')
        if not order_timestamp_str:
            continue
        
        try:
            order_dt = datetime.fromisoformat(order_timestamp_str)
        except ValueError:
            continue

        if start_date <= order_dt <= end_date:
            bundle_id = order.get('bundle_id')
            if bundle_id:
                bundle_sales[bundle_id] = bundle_sales.get(bundle_id, 0) + 1
    
    # Convert to list of dicts with bundle names
    report_data = []
    for bundle_id, count in bundle_sales.items():
        report_data.append({
            "bundle_id": bundle_id,
            "bundle_name": bundle_names.get(bundle_id, "Unknown Bundle"),
            "orders_count": count
        })
    
    # Sort by orders_count descending
    report_data.sort(key=lambda x: x['orders_count'], reverse=True)

    return {
        "period_days": period_days,
        "sales_by_bundle": report_data
    }

def generate_agent_performance(period_days=30):
    """Generates a report of agent performance for a given period."""
    orders = _load_data(ORDERS_FILE)
    agents = _load_data(AGENTS_FILE)

    end_date = datetime.now()
    start_date = end_date - timedelta(days=period_days)

    agent_performance = {} # {agent_id: {total_deliveries: X, total_delivery_time: Y, deliveries: []}}
    agent_names = {a['id']: a['name'] for a in agents}

    for order in orders:
        delivery_agent_id = order.get('delivery_agent_id')
        order_received_timestamp_str = order.get('order_received_timestamp')
        delivery_timestamp_str = order.get('delivery_timestamp')
        order_status = order.get('order_status')

        if not delivery_agent_id or not order_received_timestamp_str or not delivery_timestamp_str or order_status != 'Delivered':
            continue

        try:
            order_received_dt = datetime.fromisoformat(order_received_timestamp_str)
            delivery_dt = datetime.fromisoformat(delivery_timestamp_str)
        except ValueError:
            continue

        if start_date <= order_received_dt <= end_date and start_date <= delivery_dt <= end_date:
            delivery_time = (delivery_dt - order_received_dt).total_seconds() / 60 # in minutes

            if delivery_agent_id not in agent_performance:
                agent_performance[delivery_agent_id] = {
                    "total_deliveries": 0,
                    "total_delivery_time": 0, # in minutes
                    "deliveries": []
                }
            
            agent_performance[delivery_agent_id]["total_deliveries"] += 1
            agent_performance[delivery_agent_id]["total_delivery_time"] += delivery_time
            agent_performance[delivery_agent_id]["deliveries"].append(order['id']) # Store order ID for reference

    report_data = []
    for agent_id, data in agent_performance.items():
        avg_delivery_time = data["total_delivery_time"] / data["total_deliveries"] if data["total_deliveries"] > 0 else 0
        report_data.append({
            "agent_id": agent_id,
            "agent_name": agent_names.get(agent_id, "Unknown Agent"),
            "total_deliveries": data["total_deliveries"],
            "average_delivery_time_minutes": round(avg_delivery_time, 2)
        })
    
    # Sort by total_deliveries descending
    report_data.sort(key=lambda x: x['total_deliveries'], reverse=True)

    return report_data
