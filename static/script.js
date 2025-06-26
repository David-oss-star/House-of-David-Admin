document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const customerIdSelect = document.getElementById('customerId');
    const toggleNewCustomerFieldsBtn = document.getElementById('toggleNewCustomerFieldsBtn');
    const newCustomerFields = document.getElementById('newCustomerFields');
    const newCustomerNameInput = document.getElementById('newCustomerName');
    const newWhatsappNumberInput = document.getElementById('newWhatsappNumber');
    const newDeliveryAddressInput = document.getElementById('newDeliveryAddress');
    const saveNewCustomerBtn = document.getElementById('saveNewCustomerBtn');
    const bundleIdSelect = document.getElementById('bundleId');
    const addOnsContainer = document.getElementById('addOnsContainer');
    const totalPriceInput = document.getElementById('totalPrice');
    const paymentStatusSelect = document.getElementById('paymentStatus');

    const ordersTableBody = document.querySelector('#ordersTable tbody');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const agentFilterSelect = document.getElementById('agentFilter');
    const noOrdersMessage = document.getElementById('noOrdersMessage');

    const customersTableBody = document.querySelector('#customersTable tbody');
    const customerSearchInput = document.getElementById('customerSearchInput');
    const noCustomersMessage = document.getElementById('noCustomersMessage');

    // New inventory tables
    const ingredientsTableBody = document.querySelector('#ingredientsTable tbody');
    const bundlesTableBody = document.querySelector('#bundlesTable tbody');
    const addOnsTableBody = document.querySelector('#addOnsTable tbody');

    const generateDailySummaryBtn = document.getElementById('generateDailySummary');
    const dailySummaryOutput = document.getElementById('dailySummaryOutput');
    const generateSalesByBundleBtn = document.getElementById('generateSalesByBundle');
    const salesByBundleOutput = document.getElementById('salesByBundleOutput');
    const generateAgentPerformanceBtn = document.getElementById('generateAgentPerformance');
    const agentPerformanceOutput = document.getElementById('agentPerformanceOutput');

    const grandTotalSalesElement = document.getElementById('grandTotalSales');
    const totalOrdersAllTimeElement = document.getElementById('totalOrdersAllTime');
    const totalCustomersElement = document.getElementById('totalCustomers');

    // Customer Details Modal elements
    const customerDetailsModal = document.getElementById('customerDetailsModal');
    const modalCloseButton = customerDetailsModal.querySelector('.close-button');
    const modalCustomerName = document.getElementById('modalCustomerName');
    const modalCustomerWhatsapp = document.getElementById('modalCustomerWhatsapp');
    const modalCustomerAddress = document.getElementById('modalCustomerAddress');
    const modalCustomerEmail = document.getElementById('modalCustomerEmail');
    const modalCustomerTotalOrders = document.getElementById('modalCustomerTotalOrders');
    const modalCustomerLastOrder = document.getElementById('modalCustomerLastOrder');
    const modalCustomerDiscounts = document.getElementById('modalCustomerDiscounts');
    const modalCustomerSpecialMessage = document.getElementById('modalCustomerSpecialMessage');
    const saveCustomerDetailsBtn = document.getElementById('saveCustomerDetailsBtn');
    const modalCustomerOrdersTableBody = document.querySelector('#modalCustomerOrdersTable tbody');
    const noCustomerOrdersMessage = document.getElementById('noCustomerOrdersMessage');

    // Product Details Modal elements (new)
    const productDetailsModal = document.getElementById('productDetailsModal');
    const productModalCloseButton = document.getElementById('productModalCloseButton');
    const productModalTitle = document.getElementById('productModalTitle');
    const modalProductName = document.getElementById('modalProductName');
    const modalProductId = document.getElementById('modalProductId');
    const productBasePriceP = document.getElementById('productBasePriceP'); // For bundles
    const modalProductBasePrice = document.getElementById('modalProductBasePrice');
    const productPriceP = document.getElementById('productPriceP'); // For add-ons
    const modalProductPrice = document.getElementById('modalProductPrice');
    const productUnitP = document.getElementById('productUnitP'); // For add-ons
    const modalProductUnit = document.getElementById('modalProductUnit');
    const productDescriptionP = document.getElementById('productDescriptionP'); // For bundles
    const modalProductDescription = document.getElementById('modalProductDescription');
    const modalProductActive = document.getElementById('modalProductActive');

    const modalEditProductName = document.getElementById('modalEditProductName');
    const editProductBasePriceGroup = document.getElementById('editProductBasePriceGroup');
    const modalEditProductBasePrice = document.getElementById('modalEditProductBasePrice');
    const editProductPriceGroup = document.getElementById('editProductPriceGroup');
    const modalEditProductPrice = document.getElementById('modalEditProductPrice');
    const editProductUnitGroup = document.getElementById('editProductUnitGroup');
    const modalEditProductUnit = document.getElementById('modalEditProductUnit');
    const editProductDescriptionGroup = document.getElementById('editProductDescriptionGroup');
    const modalEditProductDescription = document.getElementById('modalEditProductDescription');
    const modalEditProductActive = document.getElementById('modalEditProductActive');
    const saveProductDetailsBtn = document.getElementById('saveProductDetailsBtn');
    const modalProductOrdersTableBody = document.querySelector('#modalProductOrdersTable tbody');
    const noProductOrdersMessage = document.getElementById('noProductOrdersMessage');
    const bundleRecipeTitle = document.getElementById('bundleRecipeTitle');
    const modalProductRecipe = document.getElementById('modalProductRecipe');

    let currentModalCustomerId = null; // Store the ID of the customer currently open in the customer modal
    let currentModalProductId = null; // Store the ID of the product currently open in the product modal
    let currentModalProductType = null; // 'bundle' or 'addon'

    // Navigation elements
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    let allOrders = [];
    let allCustomers = [];
    let allBundles = [];
    let allAddOns = [];
    let allAgents = [];
    let allIngredients = [];

    // --- Helper Functions ---

    function showMessage(message, type = 'info') {
        const msgDiv = document.createElement('div');
        msgDiv.className = `alert ${type}`;
        msgDiv.textContent = message;
        document.querySelectorAll('.alert').forEach(alert => alert.remove());
        document.body.prepend(msgDiv);
        setTimeout(() => msgDiv.remove(), 5000);
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

            // Fetch Bundles (re-fetch to ensure latest data for forms)
            const bundleResponse = await fetch('/api/inventory/bundles');
            allBundles = await bundleResponse.json();
            bundleIdSelect.innerHTML = '<option value="">Select Bundle</option>';
            allBundles.forEach(bundle => {
                const option = document.createElement('option');
                option.value = bundle.id;
                option.textContent = `${bundle.name} (Le ${bundle.base_price.toLocaleString()})`;
                bundleIdSelect.appendChild(option);
            });
            bundleIdSelect.removeEventListener('change', calculateTotalPrice);
            bundleIdSelect.addEventListener('change', calculateTotalPrice);


            // Fetch Add-ons and create checkboxes (re-fetch to ensure latest data for forms)
            const addOnResponse = await fetch('/api/inventory/add-ons');
            allAddOns = await addOnResponse.json();
            addOnsContainer.innerHTML = '';
            if (allAddOns.length === 0) {
                addOnsContainer.innerHTML = '<p class="no-addons-message">No add-ons available.</p>';
            } else {
                allAddOns.forEach(addOn => {
                    const addOnDiv = document.createElement('div');
                    addOnDiv.classList.add('addon-item');
                    addOnDiv.innerHTML = `
                        <label>
                            <input type="checkbox" name="addon" value="${addOn.id}" data-price="${addOn.price}">
                            ${addOn.name} (Le ${addOn.price.toLocaleString()})
                        </label>
                    `;
                    addOnsContainer.appendChild(addOnDiv);
                });
                addOnsContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.removeEventListener('change', calculateTotalPrice);
                    checkbox.addEventListener('change', calculateTotalPrice);
                });
            }
            calculateTotalPrice();

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

    // Function to calculate and display total price
    function calculateTotalPrice() {
        let total = 0;
        const selectedBundleId = bundleIdSelect.value;
        if (selectedBundleId) {
            const bundle = allBundles.find(b => b.id === selectedBundleId);
            if (bundle) {
                total += bundle.base_price;
            }
        }

        addOnsContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            total += parseFloat(checkbox.dataset.price);
        });

        totalPriceInput.value = total.toFixed(2);
    }


    // Function to fetch and render orders
    async function fetchAndRenderOrders() {
        try {
            const response = await fetch('/api/orders/');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allOrders = await response.json();
            applyFilters();
        } catch (error) {
            console.error('Error fetching orders:', error);
            ordersTableBody.innerHTML = '<tr><td colspan="13" style="text-align: center; color: red;">Failed to load orders. Please try again.</td></tr>';
            noOrdersMessage.style.display = 'none';
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
            
            const bundleName = allBundles.find(b => b.id === order.bundle_id)?.name || 'N/A';
            const addOnsNames = (order.add_ons || [])
                .map(id => allAddOns.find(ao => ao.id === id)?.name)
                .filter(name => name)
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

    // Toggle New Customer Fields visibility
    toggleNewCustomerFieldsBtn.addEventListener('click', () => {
        const isHidden = newCustomerFields.style.display === 'none';
        newCustomerFields.style.display = isHidden ? 'block' : 'none';
        newCustomerNameInput.required = isHidden;
        newWhatsappNumberInput.required = isHidden;
        newDeliveryAddressInput.required = isHidden;
        
        if (isHidden) {
            customerIdSelect.value = ""; 
            customerIdSelect.required = false;
        } else {
            customerIdSelect.required = true;
            newCustomerNameInput.value = '';
            newWhatsappNumberInput.value = '';
            newDeliveryAddressInput.value = '';
        }
    });

    // Handle saving a new customer
    saveNewCustomerBtn.addEventListener('click', async () => {
        const newCustomer = {
            name: newCustomerNameInput.value.trim(),
            whatsapp_number: newWhatsappNumberInput.value.trim(),
            delivery_address: newDeliveryAddressInput.value.trim()
        };

        if (!newCustomer.name || !newCustomer.whatsapp_number || !newCustomer.delivery_address) {
            showMessage('Please fill in all new customer details before saving.', 'error');
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
            showMessage(`New customer "${createdCustomer.name}" saved!`, 'success');
            
            await populateFormDropdowns(); // Re-populate to include new customer in dropdown
            customerIdSelect.value = createdCustomer.id; // Auto-select new customer
            
            newCustomerFields.style.display = 'none'; // Hide new customer fields after saving
            newCustomerNameInput.value = ''; // Clear fields
            newWhatsappNumberInput.value = '';
            newDeliveryAddressInput.value = '';
            newCustomerNameInput.required = false;
            newWhatsappNumberInput.required = false;
            newDeliveryAddressInput.required = false;
            customerIdSelect.required = true;

            fetchAndRenderCustomers(); // Refresh the main customer list
        } catch (error) {
            console.error('Error saving new customer:', error);
            showMessage(`Failed to save new customer: ${error.message}`, 'error');
        }
    });


    // Add Order Submission
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const customerId = customerIdSelect.value;
        if (!customerId) {
            showMessage('Please select an existing customer or save a new one first.', 'error');
            return;
        }

        const selectedAddOns = Array.from(addOnsContainer.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

        const newOrder = {
            customer_id: customerId,
            bundle_id: bundleIdSelect.value,
            add_ons: selectedAddOns,
            total_price: parseFloat(totalPriceInput.value),
            payment_status: paymentStatusSelect.value
        };

        if (!newOrder.bundle_id) {
            showMessage('Please select a bundle type.', 'error');
            return;
        }

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
            addOnsContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
            calculateTotalPrice();
            
            newCustomerFields.style.display = 'none';
            newCustomerNameInput.required = false;
            newWhatsappNumberInput.required = false;
            newDeliveryAddressInput.required = false;
            customerIdSelect.required = true;

            showMessage('Order added successfully!', 'success');
            fetchAndRenderOrders();
            switchTab('orders-list-section');
            fetchAndRenderDashboardMetrics();
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
            fetchAndRenderOrders();
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
            fetchAndRenderOrders();
            fetchAndRenderDashboardMetrics();
        } catch (error) {
            console.error('Error updating order status:', error);
            showMessage(`Failed to update order status: ${error.message}`, 'error');
            fetchAndRenderOrders();
        }
    }

    async function handleAgentAssignment(event) {
        const orderId = event.target.dataset.orderId;
        const newAgentId = event.target.value;

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
            fetchAndRenderOrders();
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
            fetchAndRenderDashboardMetrics();
        } catch (error) {
            console.error('Error deleting order:', error);
            showMessage(`Failed to delete order: ${error.message}`, 'error');
            fetchAndRenderOrders();
        }
    }

    // --- Filtering Logic (Orders) ---
    function applyFilters() {
        let filteredOrders = allOrders;

        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            // Updated to use the enriched customer data directly from the order object
            filteredOrders = filteredOrders.filter(order =>
                (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm)) ||
                (order.whatsapp_number && order.whatsapp_number.toLowerCase().includes(searchTerm)) ||
                (order.delivery_address && order.delivery_address.toLowerCase().includes(searchTerm))
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

    // Event listeners for filter changes (Orders)
    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    agentFilterSelect.addEventListener('change', applyFilters);


    // --- Customers Display ---
    async function fetchAndRenderCustomers() {
        try {
            const response = await fetch('/api/customers/');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allCustomers = await response.json();
            applyCustomerFilters();
        } catch (error) {
            console.error('Error fetching customers:', error);
            customersTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: red;">Failed to load customers.</td></tr>';
            noCustomersMessage.style.display = 'none';
        }
    }

    function renderCustomers(customersToRender) {
        customersTableBody.innerHTML = '';
        if (customersToRender.length === 0) {
            noCustomersMessage.style.display = 'block';
            customersTableBody.style.display = 'none';
            return;
        } else {
            noCustomersMessage.style.display = 'none';
            customersTableBody.style.display = 'table-row-group';
        }

        customersToRender.forEach(customer => {
            const row = customersTableBody.insertRow();
            row.innerHTML = `
                <td>${customer.id.substring(0, 8)}...</td>
                <td>${customer.name}</td>
                <td>${customer.whatsapp_number}</td>
                <td>${customer.delivery_address}</td>
                <td>${customer.email || 'N/A'}</td>
                <td>${customer.total_orders_count || 0}</td>
                <td>${customer.last_order_date || 'N/A'}</td>
                <td>
                    <button class="btn primary small-btn view-customer-details-btn" data-customer-id="${customer.id}">View Details</button>
                    <button class="btn btn-danger small-btn delete-customer-btn" data-customer-id="${customer.id}">Delete</button>
                </td>
            `;
        });
        document.querySelectorAll('.view-customer-details-btn').forEach(button => {
            button.removeEventListener('click', openCustomerDetailsModal);
            button.addEventListener('click', openCustomerDetailsModal);
        });
    }

    // Filtering logic for Customers
    function applyCustomerFilters() {
        let filteredCustomers = allCustomers;
        const searchTerm = customerSearchInput.value.toLowerCase();
        if (searchTerm) {
            filteredCustomers = filteredCustomers.filter(customer =>
                customer.name.toLowerCase().includes(searchTerm) ||
                customer.whatsapp_number.toLowerCase().includes(searchTerm)
            );
        }
        renderCustomers(filteredCustomers);
    }

    customerSearchInput.addEventListener('input', applyCustomerFilters);


    // --- Customer Details Modal Logic ---
    async function openCustomerDetailsModal(event) {
        currentModalCustomerId = event.target.dataset.customerId;
        if (!currentModalCustomerId) return;

        try {
            const customerResponse = await fetch(`/api/customers/${currentModalCustomerId}`);
            if (!customerResponse.ok) throw new Error('Customer not found');
            const customer = await customerResponse.json();

            const ordersResponse = await fetch(`/api/customers/${currentModalCustomerId}/orders`);
            if (!ordersResponse.ok) throw new Error('Customer orders not found');
            const customerOrders = await ordersResponse.json();

            populateCustomerDetailsModal(customer, customerOrders);
            customerDetailsModal.classList.remove('hidden');
        } catch (error) {
            console.error('Error opening customer details:', error);
            showMessage(`Failed to load customer details: ${error.message}`, 'error');
        }
    }

    function closeCustomerDetailsModal() {
        customerDetailsModal.classList.add('hidden');
        currentModalCustomerId = null;
    }

    function populateCustomerDetailsModal(customer, orders) {
        modalCustomerName.textContent = customer.name;
        modalCustomerWhatsapp.textContent = customer.whatsapp_number;
        modalCustomerAddress.textContent = customer.delivery_address;
        modalCustomerEmail.textContent = customer.email || 'N/A';
        modalCustomerTotalOrders.textContent = customer.total_orders_count || 0;
        modalCustomerLastOrder.textContent = customer.last_order_date || 'N/A';

        modalCustomerDiscounts.value = customer.discounts || '';
        modalCustomerSpecialMessage.value = customer.special_message || '';

        renderCustomerOrdersHistory(orders);
    }

    function renderCustomerOrdersHistory(orders) {
        modalCustomerOrdersTableBody.innerHTML = '';
        if (orders.length === 0) {
            noCustomerOrdersMessage.style.display = 'block';
            modalCustomerOrdersTableBody.style.display = 'none';
            return;
        } else {
            noCustomerOrdersMessage.style.display = 'none';
            modalCustomerOrdersTableBody.style.display = 'table-row-group';
        }

        orders.forEach(order => {
            const row = modalCustomerOrdersTableBody.insertRow();
            const orderTime = order.order_received_timestamp ? new Date(order.order_received_timestamp).toLocaleString() : 'N/A';
            const addOnsDisplay = order.add_ons_names.length > 0 ? order.add_ons_names.join(', ') : 'None';

            row.innerHTML = `
                <td>${order.id.substring(0, 8)}...</td>
                <td>${orderTime}</td>
                <td>${order.bundle_name}</td>
                <td>${addOnsDisplay}</td>
                <td>Le ${parseFloat(order.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td><span class="status-badge status-${order.order_status.replace(/\s/g, '_')}">${order.order_status}</span></td>
            `;
        });
    }

    async function saveCustomerDetails() {
        if (!currentModalCustomerId) return;

        const updatedData = {
            discounts: modalCustomerDiscounts.value.trim(),
            special_message: modalCustomerSpecialMessage.value.trim()
        };

        try {
            const response = await fetch(`/api/customers/${currentModalCustomerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            showMessage('Customer details updated successfully!', 'success');
            fetchAndRenderCustomers(); 
            closeCustomerDetailsModal();
        } catch (error) {
            console.error('Error saving customer details:', error);
            showMessage(`Failed to save customer details: ${error.message}`, 'error');
        }
    }

    // Attach modal event listeners
    modalCloseButton.addEventListener('click', closeCustomerDetailsModal);
    window.addEventListener('click', (event) => {
        if (event.target === customerDetailsModal) {
            closeCustomerDetailsModal();
        }
    });
    saveCustomerDetailsBtn.addEventListener('click', saveCustomerDetails);


    // --- Inventory Display ---
    async function fetchAndRenderInventory() {
        try {
            const ingredientsResponse = await fetch('/api/inventory/ingredients');
            if (!ingredientsResponse.ok) throw new Error('Failed to load ingredients.');
            allIngredients = await ingredientsResponse.json();
            renderIngredients(allIngredients);

            const bundlesResponse = await fetch('/api/inventory/bundles');
            if (!bundlesResponse.ok) throw new Error('Failed to load bundles.');
            allBundles = await bundlesResponse.json(); // Update global allBundles
            renderBundles(allBundles);

            const addOnsResponse = await fetch('/api/inventory/add-ons');
            if (!addOnsResponse.ok) throw new Error('Failed to load add-ons.');
            allAddOns = await addOnsResponse.json(); // Update global allAddOns
            renderAddOns(allAddOns);

        } catch (error) {
            console.error('Error fetching inventory:', error);
            showMessage(`Failed to load inventory data: ${error.message}`, 'error');
            // Clear tables on error
            ingredientsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Failed to load ingredients.</td></tr>';
            bundlesTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Failed to load bundles.</td></tr>';
            addOnsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Failed to load add-ons.</td></tr>';
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

    function renderBundles(bundlesToRender) {
        bundlesTableBody.innerHTML = '';
        if (bundlesToRender.length === 0) {
            bundlesTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No bundles found.</td></tr>';
            return;
        }

        bundlesToRender.forEach(bundle => {
            const row = bundlesTableBody.insertRow();
            const activeStatus = bundle.is_active ? 'Yes' : 'No';
            const activeClass = bundle.is_active ? 'status-sufficient-stock' : 'status-low-stock';

            row.innerHTML = `
                <td>${bundle.name}</td>
                <td>Le ${parseFloat(bundle.base_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>${bundle.description || 'N/A'}</td>
                <td><span class="${activeClass}">${activeStatus}</span></td>
                <td>
                    <button class="btn primary small-btn view-product-details-btn" data-product-id="${bundle.id}" data-product-type="bundle">View Details</button>
                </td>
            `;
        });
        document.querySelectorAll('.view-product-details-btn[data-product-type="bundle"]').forEach(button => {
            button.removeEventListener('click', openProductDetailsModal);
            button.addEventListener('click', openProductDetailsModal);
        });
    }

    function renderAddOns(addOnsToRender) {
        addOnsTableBody.innerHTML = '';
        if (addOnsToRender.length === 0) {
            addOnsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No add-ons found.</td></tr>';
            return;
        }

        addOnsToRender.forEach(addOn => {
            const row = addOnsTableBody.insertRow();
            const activeStatus = addOn.is_active ? 'Yes' : 'No';
            const activeClass = addOn.is_active ? 'status-sufficient-stock' : 'status-low-stock';

            row.innerHTML = `
                <td>${addOn.name}</td>
                <td>Le ${parseFloat(addOn.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>${addOn.unit || 'N/A'}</td>
                <td><span class="${activeClass}">${activeStatus}</span></td>
                <td>
                    <button class="btn primary small-btn view-product-details-btn" data-product-id="${addOn.id}" data-product-type="addon">View Details</button>
                </td>
            `;
        });
        document.querySelectorAll('.view-product-details-btn[data-product-type="addon"]').forEach(button => {
            button.removeEventListener('click', openProductDetailsModal);
            button.addEventListener('click', openProductDetailsModal);
        });
    }


    // --- Product Details Modal Logic ---
    async function openProductDetailsModal(event) {
        currentModalProductId = event.target.dataset.productId;
        currentModalProductType = event.target.dataset.productType; // 'bundle' or 'addon'
        if (!currentModalProductId || !currentModalProductType) return;

        // Determine the correct path segment ('bundles' or 'add-ons')
        const pathSegment = currentModalProductType === 'addon' ? 'add-ons' : currentModalProductType + 's';

        try {
            const productResponse = await fetch(`/api/inventory/${pathSegment}/${currentModalProductId}`);
            if (!productResponse.ok) throw new Error(`${currentModalProductType} not found`);
            const product = await productResponse.json();

            const ordersResponse = await fetch(`/api/inventory/${pathSegment}/${currentModalProductId}/orders`);
            if (!ordersResponse.ok) throw new Error(`${currentModalProductType} orders not found`);
            const productOrders = await ordersResponse.json();

            populateProductDetailsModal(product, productOrders, currentModalProductType);
            productDetailsModal.classList.remove('hidden'); // Show the modal
        } catch (error) {
            console.error(`Error opening ${currentModalProductType} details:`, error);
            showMessage(`Failed to load ${currentModalProductType} details: ${error.message}`, 'error');
        }
    }

    function closeProductDetailsModal() {
        productDetailsModal.classList.add('hidden');
        currentModalProductId = null;
        currentModalProductType = null;
    }

    function populateProductDetailsModal(product, orders, type) {
        productModalTitle.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Details`;
        modalProductName.textContent = product.name;
        modalProductId.textContent = product.id.substring(0, 8) + '...';

        // Hide/show fields based on type
        productBasePriceP.style.display = 'none';
        productPriceP.style.display = 'none';
        productUnitP.style.display = 'none';
        productDescriptionP.style.display = 'none';
        bundleRecipeTitle.style.display = 'none';
        modalProductRecipe.style.display = 'none';

        editProductBasePriceGroup.style.display = 'none';
        editProductPriceGroup.style.display = 'none';
        editProductUnitGroup.style.display = 'none';
        editProductDescriptionGroup.style.display = 'none';

        modalEditProductName.value = product.name;
        modalEditProductActive.checked = product.is_active || false; // Default to false if undefined

        if (type === 'bundle') {
            productBasePriceP.style.display = 'block';
            modalProductBasePrice.textContent = `Le ${parseFloat(product.base_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            productDescriptionP.style.display = 'block';
            modalProductDescription.textContent = product.description || 'N/A';
            
            editProductBasePriceGroup.style.display = 'block';
            modalEditProductBasePrice.value = product.base_price;
            editProductDescriptionGroup.style.display = 'block';
            modalEditProductDescription.value = product.description || '';

            // Display recipe
            bundleRecipeTitle.style.display = 'block';
            modalProductRecipe.style.display = 'block';
            modalProductRecipe.innerHTML = ''; // Clear previous recipe
            if (product.recipe && product.recipe.length > 0) {
                const ul = document.createElement('ul');
                product.recipe.forEach(item => {
                    // Need to look up ingredient name using its ID
                    const ingredient = allIngredients.find(ing => ing.id === item.ingredient_id);
                    const ingredientName = ingredient ? ingredient.name : 'Unknown Ingredient';
                    const li = document.createElement('li');
                    li.textContent = `${ingredientName}: ${item.quantity} ${item.unit}`;
                    ul.appendChild(li);
                });
                modalProductRecipe.appendChild(ul);
            } else {
                modalProductRecipe.innerHTML = '<p>No recipe defined.</p>';
            }

        } else if (type === 'addon') {
            productPriceP.style.display = 'block';
            modalProductPrice.textContent = `Le ${parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            productUnitP.style.display = 'block';
            modalProductUnit.textContent = product.unit || 'N/A';

            editProductPriceGroup.style.display = 'block';
            modalEditProductPrice.value = product.price;
            editProductUnitGroup.style.display = 'block';
            modalEditProductUnit.value = product.unit || '';
        }

        renderProductOrdersHistory(orders, type);
    }

    function renderProductOrdersHistory(orders, type) {
        modalProductOrdersTableBody.innerHTML = '';
        if (orders.length === 0) {
            noProductOrdersMessage.style.display = 'block';
            modalProductOrdersTableBody.style.display = 'none';
            return;
        } else {
            noProductOrdersMessage.style.display = 'none';
            modalProductOrdersTableBody.style.display = 'table-row-group';
        }

        orders.forEach(order => {
            const row = modalProductOrdersTableBody.insertRow();
            const orderTime = order.order_received_timestamp ? new Date(order.order_received_timestamp).toLocaleString() : 'N/A';

            row.innerHTML = `
                <td>${order.id.substring(0, 8)}...</td>
                <td>${orderTime}</td>
                <td>${order.customer_name}</td>
                <td>Le ${parseFloat(order.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td><span class="status-badge status-${order.order_status.replace(/\s/g, '_')}">${order.order_status}</span></td>
            `;
        });
    }

    async function saveProductDetails() {
        if (!currentModalProductId || !currentModalProductType) return;

        const updatedData = {
            name: modalEditProductName.value.trim(),
            is_active: modalEditProductActive.checked
        };

        if (currentModalProductType === 'bundle') {
            updatedData.base_price = parseFloat(modalEditProductBasePrice.value);
            updatedData.description = modalEditProductDescription.value.trim();
        } else if (currentModalProductType === 'addon') {
            updatedData.price = parseFloat(modalEditProductPrice.value);
            updatedData.unit = modalEditProductUnit.value.trim();
        }

        // Determine the correct path segment ('bundles' or 'add-ons')
        const pathSegment = currentModalProductType === 'addon' ? 'add-ons' : currentModalProductType + 's';

        try {
            const response = await fetch(`/api/inventory/${pathSegment}/${currentModalProductId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            showMessage(`${currentModalProductType.charAt(0).toUpperCase() + currentModalProductType.slice(1)} details updated successfully!`, 'success');
            fetchAndRenderInventory(); // Re-render inventory tables to show updates
            closeProductDetailsModal();
            populateFormDropdowns(); // Re-populate order form dropdowns in case prices/names changed
        } catch (error) {
            console.error(`Error saving ${currentModalProductType} details:`, error);
            showMessage(`Failed to save ${currentModalProductType} details: ${error.message}`, 'error');
        }
    }

    // Attach product modal event listeners
    productModalCloseButton.addEventListener('click', closeProductDetailsModal);
    window.addEventListener('click', (event) => {
        if (event.target === productDetailsModal) {
            closeProductDetailsModal();
        }
    });
    saveProductDetailsBtn.addEventListener('click', saveProductDetails);


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
            outputElement.style.display = 'block';
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


    // --- Dashboard Metrics ---
    async function fetchAndRenderDashboardMetrics() {
        try {
            const response = await fetch('/api/reports/grand-total-sales');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            grandTotalSalesElement.textContent = `Le ${data.grand_total_sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            totalOrdersAllTimeElement.textContent = data.total_orders_all_time.toLocaleString();
            totalCustomersElement.textContent = data.total_customers_registered.toLocaleString();
        } catch (error) {
            console.error('Error fetching dashboard metrics:', error);
            grandTotalSalesElement.textContent = 'Error';
            totalOrdersAllTimeElement.textContent = 'Error';
            totalCustomersElement.textContent = 'Error';
            showMessage('Failed to load dashboard metrics.', 'error');
        }
    }


    // --- Navigation Logic ---
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(section => section.classList.add('hidden'));

            event.target.classList.add('active');

            const targetId = event.target.dataset.target;
            document.getElementById(targetId).classList.remove('hidden');

            if (targetId === 'orders-list-section') {
                fetchAndRenderOrders();
            } else if (targetId === 'customers-list-section') {
                fetchAndRenderCustomers();
            } else if (targetId === 'inventory-section') {
                fetchAndRenderInventory();
            } else if (targetId === 'add-order-section') {
                populateFormDropdowns();
                calculateTotalPrice();
                newCustomerFields.style.display = 'none';
                newCustomerNameInput.required = false;
                newWhatsappNumberInput.required = false;
                newDeliveryAddressInput.required = false;
                customerIdSelect.required = true;
            } else if (targetId === 'dashboard-section') {
                fetchAndRenderDashboardMetrics();
            }
        });
    });

    // Function to programmatically switch tabs
    function switchTab(targetId) {
        navLinks.forEach(link => {
            if (link.dataset.target === targetId) {
                link.click();
            }
        });
    }

    // --- Initial Load ---
    document.querySelector('.nav-link[data-target="dashboard-section"]').click();
});
