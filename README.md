House of David - Order Management System 👑
Project Overview
The "House of David" Order Management System is a lightweight, web-based application designed to help small businesses efficiently manage customer orders, track inventory, monitor delivery agent performance, and generate essential sales reports. Built with Flask for the backend and pure HTML, CSS, and JavaScript for the frontend, it provides a user-friendly interface for daily operations.

Features
Dashboard: Get a quick overview of grand total sales, total orders, and registered customers.

Order Management:

View all orders with detailed information (customer, bundle, add-ons, price, status, agent, timestamps).

Filter and search orders by customer name, WhatsApp number, address, order status, and delivery agent.

Update order status (New, Confirmed, Preparing, Packed, Out for Delivery, Delivered, Cancelled).

Assign delivery agents to orders.

Delete orders.

Customer Management:

Maintain a directory of all customers with contact details and delivery addresses.

Add new customers.

Edit existing customer details (name, WhatsApp, address, email, discounts, special messages).

View a customer's complete order history.

Delete customers (and their associated orders).

Inventory Management:

Track raw ingredients, meal bundles (products), and add-ons.

Add new ingredients, bundles, and add-ons.

Update stock levels for ingredients and add-ons (restock/consumption).

View detailed information for bundles and add-ons, including their order history.

Define recipes for bundles (ingredients and quantities).

Delivery Agent Management:

Manage a list of delivery agents.

Add and update agent details.

Reporting:

Generate daily summaries of orders, delivered orders, and revenue for a selected date.

View sales performance by bundle over a specified period.

Analyze delivery agent performance (total deliveries, average delivery time).

Data Persistence: All application data (customers, orders, inventory, agents) is stored in local JSON files, making it easy to inspect and manage directly.

Technologies Used
Backend:

Python 3

Flask (Web Framework)

Frontend:

HTML5

CSS3

JavaScript (Vanilla JS for dynamic content and interactions)

Data Storage:

JSON files (for simplicity and local persistence)

Setup and Installation
Follow these steps to set up and run the application on your local machine.

Prerequisites
Python 3.x installed on your system.

pip (Python package installer)

Steps
Clone the Repository (if you haven't already):

git clone <your-repository-url>
cd House\ Of\ David # Or whatever your project folder is named

Create a Virtual Environment (Recommended):
This isolates your project dependencies from other Python projects.

python3 -m venv venv

Activate the Virtual Environment:

On macOS/Linux:

source venv/bin/activate

On Windows (Command Prompt):

venv\Scripts\activate.bat

On Windows (PowerShell):

.\venv\Scripts\Activate.ps1

You should see (venv) at the beginning of your terminal prompt, indicating the virtual environment is active.

Install Required Python Packages:

pip install Flask

Ensure Data Directory and Files Exist:
The application expects a data/ directory at the root level of your project, containing several JSON files (customers.json, orders.json, ingredients.json, bundles.json, add_ons.json, agents.json). The app.py script automatically creates these files as empty JSON arrays if they don't exist on startup.

To verify, check that your project structure looks something like this:

House Of David/
├── app.py
├── static/
│ └── style.css
│ └── script.js
├── templates/
│ └── index.html
├── modules/
│ ├── **init**.py
│ ├── customers.py
│ ├── orders.py
│ ├── inventory.py
│ ├── deliveries.py
│ ├── reporting.py
│ └── utils.py
└── data/
├── customers.json
├── orders.json
├── ingredients.json
├── bundles.json
├── add_ons.json
└── agents.json

Running the Application
Once the setup is complete and your virtual environment is active:

Run the Flask Application:

python app.py

You should see output indicating that the Flask development server is running, typically on http://127.0.0.1:5000/.

Access the Application:
Open your web browser and navigate to:

http://127.0.0.1:5000/

Usage
Navigation: Use the navigation links at the top to switch between Dashboard, Orders, Customers, Inventory, and Reports sections.

Adding Data: Start by adding customers and inventory items (ingredients, bundles, add-ons) before creating orders.

Interacting with Tables: Most tables allow searching/filtering and provide action buttons (e.g., "View Details", "Update Stock", "Delete").

Reports: In the "Reports" section, use the date picker for the daily summary to select a specific date for the report.

Future Enhancements (Ideas)
User Authentication: Implement login/logout functionality for secure access.

Database Integration: Migrate from JSON files to a proper database (e.g., SQLite, PostgreSQL) for more robust data management and scalability.

Advanced Reporting: Add more complex reports (e.g., monthly sales trends, ingredient consumption reports).

Notifications: Implement low stock alerts or new order notifications.

Delivery Tracking: Integrate with mapping services for real-time delivery tracking.

Frontend Framework: Consider using a modern JavaScript framework (React, Vue, Angular) for a more dynamic and maintainable frontend.

Error Handling & Validation: Enhance client-side and server-side validation for all forms and API endpoints.

License
This project is licensed under the MIT License - see the LICENSE.md file for details (if you have one, otherwise you can create one or remove this section).
