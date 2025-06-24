document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const customerIdSelect = document.getElementById('customerId');
    const addCustomerBtn = document.getElementById('addCustomerBtn');
    const newCustomerFields = document.getElementById('newCustomerFields');
    const newCustomerNameInput = document.getElementById('newCustomerName');
    const newWhatsappNumberInput = document.getElementById('newWhatsappNumber');
    const newDeliveryAddressInput = document.getElementById('newDeliveryAddress');
    const bundleIdSelect = document.getElementById('bundleId');
    const addOnsIdsSelect = document.getElementById('addOnsIds');
    const totalPriceInput = document.getElementById('totalPrice');
    const paymentStatusSelect = document.getElementById('paymentStatus');

    const ordersTableBody = document.querySelector('#ordersTable tbody');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const agentFilterSelect = document.getElementById('agentFilter');
    const noOrdersMessage = document.getElementById('noOrdersMessage');

    const ingredientsTableBody = document.querySelector('#ingredientsTable tbody');

    const generateDailySummaryBtn = document.getElementById('generateDailySummary');
    const dailySummaryOutput = document.getElementById('dailySummaryOutput');
    const generateSalesByBundleBtn = document.getElementById('generateSalesByBundle');
    const salesByBundleOutput = document.getElementById('salesByBundleOutput');
    const generateAgentPerformanceBtn = document.getElementById('generateAgentPerformance');
    const agentPerformanceOutput = document.getElementById('agentPerformanceOutput');

    // Navigation elements
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    let allOrders = []; // Cached full order data
    let allCustomers = []; // Cached full customer data
    let allBundles = []; // Cached full bundle data
    let allAddOns = []; // Cached full add-on data
    let allAgents = []; // Cached full agent data
    let allIngredients = []; // Cached full ingredient data

    // --- Helper Functions ---

    function showMessage(message, type = 'info') {
        const msgDiv = document.createElement('div');
        msgDiv.className = `alert ${type}`; // Add styling based on type (info, success, error)
        msgDiv.textContent = message;
        // Find existing alerts and remove them to avoid stacking too many
        document.querySelectorAll('.alert').forEach(alert => alert.remove());
        document.body.prepend(msgDiv); // Add to top of body
        setTimeout(() => msgDiv.remove(), 5000); // Remove after 5 seconds
    }

    // Function to fetch and populate dropdowns (Customers, Bundles, Add-ons, Agents)
    async function populateFormDropdowns() {
        try {
            // Fetch Customers
            const customerResponse = await fetch('/api/customers/');
            allCustomers = await customerResponse.json();
            customerIdSelect.innerHTML = '<option value="">Select Existing Customer</option>';
            allCustomers.forEach(customer => {
                const option = document.createElement('option');
                option.value = customer.id;
                option.textContent = `${customer.name} (${customer.whatsapp_number})`;
                customerIdSelect.appendChild(option);
            });

            // Fetch Bundles
            const bundleResponse = await fetch('/api/inventory/bundles');
            allBundles = await bundleResponse.json();
            bundleIdSelect.innerHTML = '<option value="">Select Bundle</option>';
            allBundles.forEach(bundle => {
                const option = document.createElement('option');
                option.value = bundle.id;
                option.textContent = `${bundle.name} (Le ${bundle.base_price.toLocaleString()})`;
                bundleIdSelect.appendChild(option);
            });

            // Fetch Add-ons
            const addOnResponse = await fetch('/api/inventory/add-ons');
            allAddOns = await addOnResponse.json();
            addOnsIdsSelect.innerHTML = ''; // Clear previous options
            allAddOns.forEach(addOn => {
                const option = document.createElement('option');
                option.value = addOn.id;
                option.textContent = `${addOn.name} (Le ${addOn.price.toLocaleString()})`;
                addOnsIdsSelect.appendChild(option);
            });

            // Fetch Agents for Filter and Assignment
            const agentResponse = await fetch('/api/deliveries/agents');
            allAgents = await agentResponse.json();
            agentFilterSelect.innerHTML = '<option value="All">All Agents</option>';
            allAgents.forEach(agent => {
                const option = document.createElement('option');
                option.value = agent.id;
                option.textContent = agent.name;
                agentFilterSelect.appendChild(option);
            });

        } catch (error) {
            console.error('Error populating dropdowns:', error);
            showMessage('Failed to load form options. Check console.', 'error');
        }
    }

    // Function to fetch and render orders
    async function fetchAndRenderOrders() {
        try {
            const response = await fetch('/api/orders/');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allOrders = await response.json();
            applyFilters(); // Apply current filters
        } catch (error) {
            console.error('Error fetching orders:', error);
            ordersTableBody.innerHTML = '<tr><td colspan="13" style="text-align: center; color: red;">Failed to load orders. Please try again.</td></tr>';
            noOrdersMessage.style.display = 'none'; // Hide if error
        }
    }

    // Function to render orders in the table based on filtered data
    function renderOrders(ordersToRender) {
        ordersTableBody.innerHTML = '';
        if (ordersToRender.length === 0) {
            noOrdersMessage.style.display = 'block';
            ordersTableBody.style.display = 'none';
            return;
        } else {
            noOrdersMessage.style.display = 'none';
            ordersTableBody.style.display = 'table-row-group';
        }

        ordersToRender.forEach(order => {
            const row = ordersTableBody.insertRow();
            row.dataset.orderId = order.id;

            const orderTime = order.order_received_timestamp ? new Date(order.order_received_timestamp).toLocaleString() : 'N/A';
            const deliveryTime = order.delivery_timestamp ? new Date(order.delivery_timestamp).toLocaleString() : 'N/A';
            
            // Get bundle and add-on names for display
            const bundleName = allBundles.find(b => b.id === order.bundle_id)?.name || 'N/A';
            const addOnsNames = (order.add_ons || [])
                .map(id => allAddOns.find(ao => ao.id === id)?.name)
                .filter(name => name) // Remove undefined names
                .join(', ') || 'None';

            row.innerHTML = `
                <td>${order.id.substring(0, 8)}...</td>
                <td>${order.customer_name}</td>
                <td>${order.whatsapp_number}</td>
                <td>${order.delivery_address}</td>
                <td>${bundleName}</td>
                <td>${addOnsNames}</td>
                <td>Le ${parseFloat(order.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td><span class="status-badge status-${order.payment_status.replace(/\s/g, '_')}">${order.payment_status}</span></td>
                <td>
                    <select class="status-select status-${order.order_status.replace(/\s/g, '_')}" data-order-id="${order.id}">
                        <option value="New" ${order.order_status === 'New' ? 'selected' : ''}>New</option>
                        <option value="Confirmed" ${order.order_status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="Preparing" ${order.order_status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                        <option value="Packed" ${order.order_status === 'Packed' ? 'selected' : ''}>Packed</option>
                        <option value="Out for Delivery" ${order.order_status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
                        <option value="Delivered" ${order.order_status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Cancelled" ${order.order_status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <select class="agent-select" data-order-id="${order.id}">
                        <option value="">Unassigned</option>
                        ${allAgents.map(agent => `<option value="${agent.id}" ${order.delivery_agent_id === agent.id ? 'selected' : ''}>${agent.name}</option>`).join('')}
                    </select>
                </td>
                <td>${orderTime}</td>
                <td>${deliveryTime}</td>
                <td>
                    <button class="btn btn-danger delete-btn" data-order-id="${order.id}">Delete</button>
                </td>
            `;
            row.classList.add(`status-${order.order_status.replace(/\s/g, '_')}`);
        });

        addEventListenersToOrderActions();
    }

    // --- Form Event Listeners ---

    // Toggle New Customer Fields
    addCustomerBtn.addEventListener('click', () => {
        const isHidden = newCustomerFields.style.display === 'none';
        newCustomerFields.style.display = isHidden ? 'block' : 'none';
        newCustomerNameInput.required = isHidden;
        newWhatsappNumberInput.required = isHidden;
        newDeliveryAddressInput.required = isHidden;
        if (!isHidden) {
            customerIdSelect.value = ""; // Deselect existing customer if adding new
            customerIdSelect.required = false;
        } else {
            customerIdSelect.required = true;
        }
    });


    // Add Order Submission
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let customerId;
        // Check if new customer fields are visible
        const isAddingNewCustomer = newCustomerFields.style.display === 'block';

        if (isAddingNewCustomer) {
            // Create new customer first
            const newCustomer = {
                name: newCustomerNameInput.value.trim(),
                whatsapp_number: newWhatsappNumberInput.value.trim(),
                delivery_address: newDeliveryAddressInput.value.trim()
            };

            if (!newCustomer.name || !newCustomer.whatsapp_number || !newCustomer.delivery_address) {
                showMessage('Please fill in all new customer fields.', 'error');
                return;
            }

            try {
                const response = await fetch('/api/customers/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCustomer)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }
                const createdCustomer = await response.json();
                customerId = createdCustomer.id;
                showMessage(`New customer "${createdCustomer.name}" added!`, 'success');
                await populateFormDropdowns(); // Refresh customer dropdown
            } catch (error) {
                console.error('Error adding new customer:', error);
                showMessage(`Failed to add new customer: ${error.message}`, 'error');
                return; // Stop if customer creation fails
            }
        } else {
            customerId = customerIdSelect.value;
            if (!customerId) {
                showMessage('Please select an existing customer or add a new one.', 'error');
                return;
            }
        }

        const selectedAddOns = Array.from(addOnsIdsSelect.selectedOptions).map(option => option.value);

        const newOrder = {
            customer_id: customerId,
            bundle_id: bundleIdSelect.value,
            add_ons: selectedAddOns,
            total_price: parseFloat(totalPriceInput.value),
            payment_status: paymentStatusSelect.value
        };

        try {
            const response = await fetch('/api/orders/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            orderForm.reset();
            // Reset new customer fields visibility and required attributes
            newCustomerFields.style.display = 'none';
            newCustomerNameInput.required = false;
            newWhatsappNumberInput.required = false;
            newDeliveryAddressInput.required = false;
            customerIdSelect.required = true; // Ensure select is required again

            showMessage('Order added successfully!', 'success');
            fetchAndRenderOrders(); // Refresh order list
            // Optionally switch to the orders list tab after adding
            switchTab('orders-list-section');
        } catch (error) {
            console.error('Error adding order:', error);
            showMessage(`Failed to add order: ${error.message}`, 'error');
        }
    });

    // --- Order Table Actions ---

    function addEventListenersToOrderActions() {
        document.querySelectorAll('.status-select').forEach(select => {
            select.removeEventListener('change', handleStatusChange);
            select.addEventListener('change', handleStatusChange);
        });

        document.querySelectorAll('.agent-select').forEach(select => {
            select.removeEventListener('change', handleAgentAssignment);
            select.addEventListener('change', handleAgentAssignment);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.removeEventListener('click', handleDeleteOrder);
            button.addEventListener('click', handleDeleteOrder);
        });
    }

    async function handleStatusChange(event) {
        const orderId = event.target.dataset.orderId;
        const newStatus = event.target.value;
        const confirmUpdate = confirm(`Are you sure you want to change the status of order ${orderId.substring(0, 8)}... to "${newStatus}"?`);
        
        if (!confirmUpdate) {
            fetchAndRenderOrders(); // Revert dropdown
            return;
        }

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_status: newStatus })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            showMessage(`Order ${orderId.substring(0, 8)}... status updated to "${newStatus}"!`, 'success');
            fetchAndRenderOrders(); // Re-render for updated data including timestamp
        } catch (error) {
            console.error('Error updating order status:', error);
            showMessage(`Failed to update order status: ${error.message}`, 'error');
            fetchAndRenderOrders(); // Re-fetch on error to ensure data consistency
        }
    }

    async function handleAgentAssignment(event) {
        const orderId = event.target.dataset.orderId;
        const newAgentId = event.target.value; // Can be empty string for "Unassigned"

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delivery_agent_id: newAgentId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            showMessage(`Order ${orderId.substring(0, 8)}... agent updated!`, 'success');
            fetchAndRenderOrders(); // Re-render to show updated agent name
        } catch (error) {
            console.error('Error assigning agent:', error);
            showMessage(`Failed to assign agent: ${error.message}`, 'error');
            fetchAndRenderOrders();
        }
    }

    async function handleDeleteOrder(event) {
        const orderId = event.target.dataset.orderId;
        const confirmDelete = confirm(`Are you sure you want to DELETE order ${orderId.substring(0, 8)}...? This action cannot be undone.`);

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            showMessage(`Order ${orderId.substring(0, 8)}... deleted successfully!`, 'success');
            fetchAndRenderOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
            showMessage(`Failed to delete order: ${error.message}`, 'error');
            fetchAndRenderOrders();
        }
    }

    // --- Filtering Logic ---
    function applyFilters() {
        let filteredOrders = allOrders;

        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredOrders = filteredOrders.filter(order =>
                order.customer_name.toLowerCase().includes(searchTerm) ||
                order.whatsapp_number.toLowerCase().includes(searchTerm) ||
                order.delivery_address.toLowerCase().includes(searchTerm)
            );
        }

        const selectedStatus = statusFilter.value;
        if (selectedStatus !== 'All') {
            filteredOrders = filteredOrders.filter(order =>
                order.order_status === selectedStatus
            );
        }

        const selectedAgentId = agentFilterSelect.value;
        if (selectedAgentId !== 'All') {
            filteredOrders = filteredOrders.filter(order =>
                order.delivery_agent_id === selectedAgentId
            );
        }

        renderOrders(filteredOrders);
    }

    // Event listeners for filter changes
    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    agentFilterSelect.addEventListener('change', applyFilters);

    // --- Inventory Display ---
    async function fetchAndRenderIngredients() {
        try {
            const response = await fetch('/api/inventory/ingredients');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allIngredients = await response.json(); // Cache ingredients
            renderIngredients(allIngredients);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            ingredientsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Failed to load ingredients.</td></tr>';
        }
    }

    function renderIngredients(ingredientsToRender) {
        ingredientsTableBody.innerHTML = '';
        if (ingredientsToRender.length === 0) {
            ingredientsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No ingredients found.</td></tr>';
            return;
        }

        ingredientsToRender.forEach(ing => {
            const row = ingredientsTableBody.insertRow();
            const statusClass = ing.current_stock <= ing.reorder_point ? 'status-low-stock' : 'status-sufficient-stock';
            const statusText = ing.current_stock <= ing.reorder_point ? 'LOW' : 'OK';

            row.innerHTML = `
                <td>${ing.name}</td>
                <td>${ing.current_stock}</td>
                <td>${ing.unit}</td>
                <td>${ing.reorder_point || 'N/A'}</td>
                <td class="${statusClass}">${statusText}</td>
            `;
        });
    }

    // --- Reporting ---
    async function generateReport(endpoint, outputElementId) {
        const outputElement = document.getElementById(outputElementId);
        outputElement.innerHTML = '<p>Generating report...</p>';
        try {
            const response = await fetch(`/api/reports/${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const reportData = await response.json();
            outputElement.innerHTML = formatReportOutput(reportData, endpoint);
            outputElement.style.display = 'block'; // Ensure it's visible
        } catch (error) {
            console.error(`Error generating ${endpoint} report:`, error);
            outputElement.innerHTML = `<p style="color: red;">Failed to generate report: ${error.message}</p>`;
        }
    }

    function formatReportOutput(data, endpoint) {
        let html = '<div class="report-data">';
        if (endpoint === 'daily-summary') {
            html += `<h3>Daily Summary for ${data.date}</h3>`;
            html += `<p>Total Orders Received: <strong>${data.total_orders_received}</strong></p>`;
            html += `<p>Delivered Orders: <strong>${data.delivered_orders_count}</strong></p>`;
            html += `<p>Total Revenue (Delivered/Paid): <strong>Le ${data.total_revenue_for_delivered_paid_orders.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>`;
        } else if (endpoint === 'sales-by-bundle') {
            html += `<h3>Top Selling Bundles (Last ${data.period_days} Days)</h3>`;
            if (data.sales_by_bundle.length === 0) {
                html += '<p>No sales data for this period.</p>';
            } else {
                html += '<ul>';
                data.sales_by_bundle.forEach(item => {
                    html += `<li>${item.bundle_name}: ${item.orders_count} orders</li>`;
                });
                html += '</ul>';
            }
        } else if (endpoint === 'agent-performance') {
            html += `<h3>Agent Performance (Last ${data.period_days} Days)</h3>`;
            if (data.length === 0) {
                html += '<p>No agent performance data for this period.</p>';
            } else {
                html += '<ul>';
                data.forEach(agent => {
                    html += `<li>${agent.agent_name}: ${agent.total_deliveries} deliveries (Avg. Time: ${agent.average_delivery_time_minutes} mins)</li>`;
                });
                html += '</ul>';
            }
        }
        html += '</div>';
        return html;
    }

    generateDailySummaryBtn.addEventListener('click', () => generateReport('daily-summary', 'dailySummaryOutput'));
    generateSalesByBundleBtn.addEventListener('click', () => generateReport('sales-by-bundle', 'salesByBundleOutput'));
    generateAgentPerformanceBtn.addEventListener('click', () => generateReport('agent-performance', 'agentPerformanceOutput'));


    // --- Navigation Logic ---
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Remove 'active' class from all links and 'hidden' from all sections
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(section => section.classList.add('hidden'));

            // Add 'active' class to the clicked link
            event.target.classList.add('active');

            // Show the target section
            const targetId = event.target.dataset.target;
            document.getElementById(targetId).classList.remove('hidden');

            // Optionally, trigger data refresh for the active tab if needed
            if (targetId === 'orders-list-section') {
                fetchAndRenderOrders();
            } else if (targetId === 'inventory-section') {
                fetchAndRenderIngredients();
            }
            // Reports typically generate on demand, so no immediate refresh here
            // Add Order form dropdowns are populated on initial load
        });
    });

    // Function to programmatically switch tabs
    function switchTab(targetId) {
        navLinks.forEach(link => {
            if (link.dataset.target === targetId) {
                link.click(); // Simulate a click on the desired tab
            }
        });
    }


    // --- Initial Load ---
    populateFormDropdowns();
    fetchAndRenderOrders(); // Initial load for default tab
    // Other sections will be loaded when their tabs are clicked
});
