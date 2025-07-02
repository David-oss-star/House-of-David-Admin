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

    // Inventory tables
    const ingredientsTableBody = document.querySelector('#ingredientsTable tbody');
    const bundlesTableBody = document.querySelector('#bundlesTable tbody');
    const addOnsTableBody = document.querySelector('#addOnsTable tbody');

    // Inventory add elements
    const toggleAddInventoryFormBtn = document.getElementById('toggleAddInventoryFormBtn');
    const addInventoryFormContainer = document.getElementById('addInventoryFormContainer');
    const inventoryItemTypeSelect = document.getElementById('inventoryItemType');
    const addIngredientForm = document.getElementById('addIngredientForm');
    const addBundleForm = document.getElementById('addBundleForm');
    const addAddOnForm = document.getElementById('addAddOnForm');

    const newIngredientNameInput = document.getElementById('newIngredientName');
    const newIngredientUnitInput = document.getElementById('newIngredientUnit');
    const newIngredientCurrentStockInput = document.getElementById('newIngredientCurrentStock');
    const newIngredientReorderPointInput = document.getElementById('newIngredientReorderPoint');
    const newIngredientLastCostInput = document.getElementById('newIngredientLastCost');
    const newIngredientSupplierInput = document.getElementById('newIngredientSupplier');

    const newBundleNameInput = document.getElementById('newBundleName');
    const newBundleBasePriceInput = document.getElementById('newBundleBasePrice');
    const newBundleDescriptionInput = document.getElementById('newBundleDescription');
    const newBundleIsActiveCheckbox = document.getElementById('newBundleIsActive');
    const bundleRecipeInputsContainer = document.getElementById('bundleRecipeInputs');
    const recipeIngredientSelect = document.getElementById('recipeIngredientSelect');
    const recipeQuantityInput = document.getElementById('recipeQuantity');
    const recipeUnitInput = document.getElementById('recipeUnit');
    const addRecipeItemBtn = document.getElementById('addRecipeItemBtn');
    let currentBundleRecipe = []; // Stores recipe items for the new bundle form

    const newAddOnNameInput = document.getElementById('newAddOnName');
    const newAddOnPriceInput = document.getElementById('newAddOnPrice');
    const newAddOnUnitInput = document.getElementById('newAddOnUnit');
    const newAddOnCurrentStockInput = document.getElementById('newAddOnCurrentStock');
    const newAddOnUnitCostInput = document.getElementById('newAddOnUnitCost');
    const newAddOnReorderPointInput = document.getElementById('newAddOnReorderPoint');
    const newAddOnIsActiveCheckbox = document.getElementById('newAddOnIsActive');


    // Reports elements
    const reportToggleButtons = document.querySelectorAll('.report-toggle-btn');
    const dailySummaryOutput = document.getElementById('dailySummaryOutput');
    const salesByBundleOutput = document.getElementById('salesByBundleOutput');
    const agentPerformanceOutput = document.getElementById('agentPerformanceOutput');
    const dailySummaryDateInput = document.getElementById('dailySummaryDateInput'); // NEW: Date input for daily summary

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

    // Editable customer fields in modal
    const modalEditCustomerName = document.getElementById('modalEditCustomerName');
    const modalEditCustomerWhatsapp = document.getElementById('modalEditCustomerWhatsapp');
    const modalEditCustomerAddress = document.getElementById('modalEditCustomerAddress');
    const modalEditCustomerEmail = document.getElementById('modalEditCustomerEmail');


    // Product Details Modal elements
    const productDetailsModal = document.getElementById('productDetailsModal');
    const productModalCloseButton = document.getElementById('productModalCloseButton');
    const productModalTitle = document.getElementById('productModalTitle');
    const modalProductName = document.getElementById('modalProductName');
    const modalProductId = document.getElementById('modalProductId');
    const productBasePriceP = document.getElementById('productBasePriceP');
    const modalProductBasePrice = document.getElementById('modalProductBasePrice');
    const productPriceP = document.getElementById('productPriceP');
    const modalProductPrice = document.getElementById('modalProductPrice');
    const productUnitP = document.getElementById('productUnitP');
    const modalProductUnit = document.getElementById('modalProductUnit');
    const productDescriptionP = document.getElementById('productDescriptionP');
    const modalProductDescription = document.getElementById('modalProductDescription');
    const modalProductCurrentStockP = document.getElementById('modalProductCurrentStock');
    const modalProductUnitCostP = document.getElementById('modalProductUnitCost');
    const modalProductTotalValueP = document.getElementById('modalProductTotalValue');
    const modalProductReorderPointP = document.getElementById('modalProductReorderPoint');
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
    const editProductCurrentStockGroup = document.getElementById('editProductCurrentStockGroup');
    const modalEditProductCurrentStock = document.getElementById('modalEditProductCurrentStock');
    const editProductUnitCostGroup = document.getElementById('editProductUnitCostGroup');
    const modalEditProductUnitCost = document.getElementById('modalEditProductUnitCost');
    const editProductReorderPointGroup = document.getElementById('editProductReorderPointGroup');
    const modalEditProductReorderPoint = document.getElementById('modalEditProductReorderPoint');
    const modalEditProductActive = document.getElementById('modalEditProductActive');
    const saveProductDetailsBtn = document.getElementById('saveProductDetailsBtn');
    const modalProductOrdersTableBody = document.querySelector('#modalProductOrdersTable tbody');
    const noProductOrdersMessage = document.getElementById('noProductOrdersMessage');
    const bundleRecipeTitle = document.getElementById('bundleRecipeTitle');
    const modalProductRecipe = document.getElementById('modalProductRecipe');

    // Stock Update Modal elements
    const stockUpdateModal = document.getElementById('stockUpdateModal');
    const stockModalCloseButton = document.getElementById('stockModalCloseButton');
    const stockModalTitle = document.getElementById('stockModalTitle');
    const stockModalItemName = document.getElementById('stockModalItemName');
    const stockModalCurrentStock = document.getElementById('stockModalCurrentStock');
    const stockModalUnit = document.getElementById('stockModalUnit');
    const stockModalUnitCostP = document.getElementById('stockModalUnitCostP');
    const stockModalUnitCost = document.getElementById('stockModalUnitCost');
    const stockModalTotalValueP = document.getElementById('stockModalTotalValueP');
    const stockModalTotalValue = document.getElementById('stockModalTotalValue');
    const stockAdjustmentTypeSelect = document.getElementById('stockAdjustmentType');
    const stockQuantityChangeInput = document.getElementById('stockQuantityChange');
    const newUnitCostGroup = document.getElementById('newUnitCostGroup');
    const newUnitCostInput = document.getElementById('newUnitCost');
    const estimatedRestockValueNote = document.getElementById('estimatedRestockValueNote');
    const estimatedRestockValue = document.getElementById('estimatedRestockValue');
    const saveStockUpdateBtn = document.getElementById('saveStockUpdateBtn');

    let currentModalCustomerId = null;
    let currentModalProductId = null;
    let currentModalProductType = null; // 'bundle' or 'addon' for Product Details Modal
    let currentStockItem = null; // Stores the ingredient/addon object currently open in stock modal
    let currentStockModalType = null; // Stores 'ingredient' or 'addon' specifically for the Stock Update Modal

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
        // Remove existing alerts to prevent clutter
        document.querySelectorAll('.alert').forEach(alert => alert.remove());
        document.body.prepend(msgDiv);
        // The CSS animation handles the fade out, so no need for JS timeout for removal
    }

    // Function to fetch and populate dropdowns (Customers, Bundles, Add-ons, Agents, Ingredients for recipe)
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

            // Fetch Bundles (re-fetch to ensure latest data for forms and main tables)
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


            // Fetch Add-ons and create checkboxes (re-fetch to ensure latest data for forms and main tables)
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

            // Fetch Ingredients for Recipe Selector (NEW)
            const ingredientResponse = await fetch('/api/inventory/ingredients');
            allIngredients = await ingredientResponse.json(); // Update global allIngredients
            recipeIngredientSelect.innerHTML = '<option value="">Select Ingredient</option>';
            allIngredients.forEach(ingredient => {
                const option = document.createElement('option');
                option.value = ingredient.id;
                option.textContent = `${ingredient.name} (${ingredient.unit})`;
                recipeIngredientSelect.appendChild(option);
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
            const addOnsNames = (order.add_ons_names || []) // Use add_ons_names directly from backend
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
                <td class="table-actions">
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
            fetchAndRenderOrders(); // Revert selection if cancelled
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
            fetchAndRenderOrders(); // Revert selection on error
        }
    }

    async function handleAgentAssignment(event) {
        const orderId = event.target.dataset.orderId;
        const newAgentId = event.target.value; // This will be agent ID or empty string ""

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delivery_agent_id: newAgentId || null }) // Send null if empty string
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
                <td class="table-actions">
                    <button class="btn primary small-btn view-customer-details-btn" data-customer-id="${customer.id}">View Details</button>
                    <button class="btn btn-danger small-btn delete-customer-btn" data-customer-id="${customer.id}">Delete</button>
                </td>
            `;
        });
        document.querySelectorAll('.view-customer-details-btn').forEach(button => {
            button.removeEventListener('click', openCustomerDetailsModal);
            button.addEventListener('click', openCustomerDetailsModal);
        });
        document.querySelectorAll('.delete-customer-btn').forEach(button => {
            button.removeEventListener('click', handleDeleteCustomer); // Remove any old listeners
            button.addEventListener('click', handleDeleteCustomer);
        });
    }

    async function handleDeleteCustomer(event) {
        const customerId = event.target.dataset.customerId;
        // Find the customer's name for the confirmation message
        const customerRow = event.target.closest('tr');
        const customerName = customerRow ? customerRow.querySelector('td:nth-child(2)').textContent : 'this customer'; // Assuming name is in the second column

        const confirmDelete = confirm(`Are you sure you want to DELETE customer "${customerName}" and ALL their associated orders? This action cannot be undone.`);

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`/api/customers/${customerId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            showMessage(`Customer "${customerName}" and all associated orders deleted successfully!`, 'success');
            fetchAndRenderCustomers(); // Refresh customer list
            fetchAndRenderOrders(); // Refresh order list as well
            fetchAndRenderDashboardMetrics(); // Refresh dashboard metrics
        } catch (error) {
            console.error('Error deleting customer:', error);
            showMessage(`Failed to delete customer: ${error.message}`, 'error');
        }
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
        // Display fields (read-only for quick view)
        modalCustomerName.textContent = customer.name;
        modalCustomerWhatsapp.textContent = customer.whatsapp_number;
        modalCustomerAddress.textContent = customer.delivery_address;
        modalCustomerEmail.textContent = customer.email || 'N/A';
        modalCustomerTotalOrders.textContent = customer.total_orders_count || 0;
        modalCustomerLastOrder.textContent = customer.last_order_date || 'N/A';

        // Editable fields
        modalEditCustomerName.value = customer.name || '';
        modalEditCustomerWhatsapp.value = customer.whatsapp_number || '';
        modalEditCustomerAddress.value = customer.delivery_address || '';
        modalEditCustomerEmail.value = customer.email || '';
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
            name: modalEditCustomerName.value.trim(),
            whatsapp_number: modalEditCustomerWhatsapp.value.trim(),
            delivery_address: modalEditCustomerAddress.value.trim(),
            email: modalEditCustomerEmail.value.trim(),
            discounts: modalCustomerDiscounts.value.trim(),
            special_message: modalCustomerSpecialMessage.value.trim()
        };

        // Basic validation for WhatsApp number format (optional, can be more robust)
        if (updatedData.whatsapp_number && !updatedData.whatsapp_number.startsWith('+232')) {
            showMessage('WhatsApp number must start with +232 and include country code.', 'error');
            return;
        }

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


    // --- Inventory Display & Add New Item Logic ---
    async function fetchAndRenderInventory() {
        try {
            // Re-fetch allIngredients to ensure recipe dropdown is up-to-date
            const ingredientsResponse = await fetch('/api/inventory/ingredients');
            if (!ingredientsResponse.ok) throw new Error('Failed to load ingredients.');
            allIngredients = await ingredientsResponse.json();
            renderIngredients(allIngredients);

            // Populate recipe ingredient select
            recipeIngredientSelect.innerHTML = '<option value="">Select Ingredient</option>';
            allIngredients.forEach(ingredient => {
                const option = document.createElement('option');
                option.value = ingredient.id;
                option.textContent = `${ingredient.name} (${ingredient.unit})`;
                recipeIngredientSelect.appendChild(option);
            });


            const bundlesResponse = await fetch('/api/inventory/bundles');
            if (!bundlesResponse.ok) throw new Error('Failed to load bundles.');
            allBundles = await bundlesResponse.json();
            renderBundles(allBundles);

            const addOnsResponse = await fetch('/api/inventory/add-ons');
            if (!addOnsResponse.ok) throw new Error('Failed to load add-ons.');
            allAddOns = await addOnsResponse.json();
            renderAddOns(allAddOns);

        } catch (error) {
            console.error('Error fetching inventory:', error);
            showMessage(`Failed to load inventory data: ${error.message}`, 'error');
            ingredientsTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Failed to load ingredients.</td></tr>'; // Updated colspan
            bundlesTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Failed to load bundles.</td></tr>';
            addOnsTableBody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: red;">Failed to load add-ons.</td></tr>'; // Updated colspan
        }
    }

    function renderIngredients(ingredientsToRender) {
        ingredientsTableBody.innerHTML = '';
        if (ingredientsToRender.length === 0) {
            ingredientsTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No ingredients found.</td></tr>'; // Updated colspan
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
                <td class="table-actions">
                    <button class="btn secondary small-btn update-stock-btn" data-item-id="${ing.id}" data-item-type="ingredient">Update Stock</button>
                </td>
            `;
        });
        document.querySelectorAll('.update-stock-btn[data-item-type="ingredient"]').forEach(button => {
            button.removeEventListener('click', openStockUpdateModal);
            button.addEventListener('click', openStockUpdateModal);
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
                <td class="table-actions">
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
            addOnsTableBody.innerHTML = '<tr><td colspan="10" style="text-align: center;">No add-ons found.</td></tr>'; // Updated colspan
            return;
        }

        addOnsToRender.forEach(addOn => {
            const row = addOnsTableBody.insertRow();
            const activeStatus = addOn.is_active ? 'Yes' : 'No';
            const activeClass = addOn.is_active ? 'status-sufficient-stock' : 'status-low-stock';
            const stockStatusClass = (addOn.current_stock !== undefined && addOn.reorder_point !== undefined && addOn.current_stock <= addOn.reorder_point) ? 'status-low-stock' : 'status-sufficient-stock';
            const stockStatusText = (addOn.current_stock !== undefined && addOn.reorder_point !== undefined && addOn.current_stock <= addOn.reorder_point) ? 'LOW' : 'OK';
            const totalValue = (addOn.current_stock || 0) * (addOn.unit_cost || 0);

            row.innerHTML = `
                <td>${addOn.name}</td>
                <td>Le ${parseFloat(addOn.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>${addOn.unit || 'N/A'}</td>
                <td>${addOn.current_stock !== undefined ? addOn.current_stock : 'N/A'}</td>
                <td>Le ${parseFloat(addOn.unit_cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>Le ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>${addOn.reorder_point !== undefined ? addOn.reorder_point : 'N/A'}</td>
                <td class="${stockStatusClass}">${stockStatusText}</td>
                <td><span class="${activeClass}">${activeStatus}</span></td>
                <td class="table-actions">
                    <button class="btn primary small-btn view-product-details-btn" data-product-id="${addOn.id}" data-product-type="addon">View Details</button>
                    <button class="btn secondary small-btn update-stock-btn" data-item-id="${addOn.id}" data-item-type="addon">Update Stock</button>
                </td>
            `;
        });
        document.querySelectorAll('.view-product-details-btn[data-product-type="addon"]').forEach(button => {
            button.removeEventListener('click', openProductDetailsModal);
            button.addEventListener('click', openProductDetailsModal);
        });
        document.querySelectorAll('.update-stock-btn[data-item-type="addon"]').forEach(button => {
            button.removeEventListener('click', openStockUpdateModal);
            button.addEventListener('click', openStockUpdateModal);
        });
    }

    // Toggle "Add New Inventory Item" form visibility
    toggleAddInventoryFormBtn.addEventListener('click', () => {
        const isHidden = addInventoryFormContainer.style.display === 'none';
        addInventoryFormContainer.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
            // Reset form selections and hide all sub-forms when opening
            inventoryItemTypeSelect.value = '';
            hideAllInventoryAddForms();
        }
    });

    // Handle selection of inventory item type to add
    inventoryItemTypeSelect.addEventListener('change', (event) => {
        hideAllInventoryAddForms(); // Hide all forms first
        const selectedType = event.target.value;
        if (selectedType === 'ingredient') {
            addIngredientForm.classList.remove('hidden');
        } else if (selectedType === 'bundle') {
            addBundleForm.classList.remove('hidden');
            currentBundleRecipe = []; // Reset recipe for new bundle
            renderBundleRecipeItems();
        } else if (selectedType === 'addon') {
            addAddOnForm.classList.remove('hidden');
        }
    });

    function hideAllInventoryAddForms() {
        addIngredientForm.classList.add('hidden');
        addBundleForm.classList.add('hidden');
        addAddOnForm.classList.add('hidden');
    }

    // Add Ingredient Form Submission
    addIngredientForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newIngredient = {
            name: newIngredientNameInput.value.trim(),
            unit: newIngredientUnitInput.value.trim(),
            current_stock: parseFloat(newIngredientCurrentStockInput.value),
            reorder_point: parseFloat(newIngredientReorderPointInput.value) || 0,
            last_cost_per_unit: parseFloat(newIngredientLastCostInput.value) || 0,
            supplier: newIngredientSupplierInput.value.trim()
        };

        if (!newIngredient.name || !newIngredient.unit || isNaN(newIngredient.current_stock)) {
            showMessage('Please fill in required ingredient fields: Name, Unit, Current Stock.', 'error');
            return;
        }

        try {
            const response = await fetch('/api/inventory/ingredients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newIngredient)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            showMessage('Ingredient added successfully!', 'success');
            addIngredientForm.reset();
            fetchAndRenderInventory(); // Refresh ingredients table
            populateFormDropdowns(); // Re-populate global dropdowns if needed (like for bundle recipe)
        } catch (error) {
            console.error('Error adding ingredient:', error);
            showMessage(`Failed to add ingredient: ${error.message}`, 'error');
        }
    });

    // Bundle Recipe Management (dynamic adding/removing)
    addRecipeItemBtn.addEventListener('click', () => {
        const selectedIngredientId = recipeIngredientSelect.value;
        const quantity = parseFloat(recipeQuantityInput.value);
        const unit = recipeUnitInput.value.trim();

        if (!selectedIngredientId || isNaN(quantity) || quantity <= 0 || !unit) {
            showMessage('Please select an ingredient, enter a valid quantity, and unit for the recipe item.', 'error');
            return;
        }

        const ingredient = allIngredients.find(ing => ing.id === selectedIngredientId);
        if (!ingredient) {
            showMessage('Selected ingredient not found.', 'error');
            return;
        }

        // Check if ingredient already in recipe
        const existingItem = currentBundleRecipe.find(item => item.ingredient_id === selectedIngredientId);
        if (existingItem) {
            showMessage('This ingredient is already in the recipe. Edit the existing one or remove it first.', 'warning');
            return;
        }

        currentBundleRecipe.push({
            ingredient_id: selectedIngredientId,
            name: ingredient.name, // Store name for display purposes
            quantity: quantity,
            unit: unit
        });

        renderBundleRecipeItems();
        recipeIngredientSelect.value = ''; // Clear inputs
        recipeQuantityInput.value = '0';
        recipeUnitInput.value = '';
    });

    function renderBundleRecipeItems() {
        bundleRecipeInputsContainer.innerHTML = '';
        if (currentBundleRecipe.length === 0) {
            bundleRecipeInputsContainer.innerHTML = '<p class="no-recipe-items">No ingredients added yet.</p>';
            return;
        }

        currentBundleRecipe.forEach((item, index) => {
            const recipeItemDiv = document.createElement('div');
            recipeItemDiv.classList.add('recipe-item-row');
            recipeItemDiv.innerHTML = `
                <span>${item.name}: ${item.quantity} ${item.unit}</span>
                <button type="button" class="remove-recipe-item-btn" data-index="${index}">&times;</button>
            `;
            bundleRecipeInputsContainer.appendChild(recipeItemDiv);
        });

        bundleRecipeInputsContainer.querySelectorAll('.remove-recipe-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const indexToRemove = parseInt(e.target.dataset.index);
                currentBundleRecipe.splice(indexToRemove, 1);
                renderBundleRecipeItems();
            });
        });
    }

    // Add Bundle Form Submission
    addBundleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newBundle = {
            name: newBundleNameInput.value.trim(),
            base_price: parseFloat(newBundleBasePriceInput.value),
            description: newBundleDescriptionInput.value.trim(),
            is_active: newBundleIsActiveCheckbox.checked,
            recipe: currentBundleRecipe.map(item => ({ // Send only necessary data for recipe
                ingredient_id: item.ingredient_id,
                quantity: item.quantity,
                unit: item.unit
            }))
        };

        if (!newBundle.name || isNaN(newBundle.base_price) || newBundle.base_price <= 0 || !newBundle.description) {
            showMessage('Please fill in required bundle fields: Name, Base Price, Description.', 'error');
            return;
        }
        if (newBundle.recipe.length === 0) {
            showMessage('Please add at least one ingredient to the bundle recipe.', 'error');
            return;
        }

        try {
            const response = await fetch('/api/inventory/bundles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBundle)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            showMessage('Bundle added successfully!', 'success');
            addBundleForm.reset();
            currentBundleRecipe = []; // Clear recipe for next entry
            renderBundleRecipeItems();
            fetchAndRenderInventory(); // Refresh bundles table
            populateFormDropdowns(); // Re-populate global dropdowns
        } catch (error) {
            console.error('Error adding bundle:', error);
            showMessage(`Failed to add bundle: ${error.message}`, 'error');
        }
    });

    // Add Add-on Form Submission
    addAddOnForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newAddOn = {
            name: newAddOnNameInput.value.trim(),
            price: parseFloat(newAddOnPriceInput.value),
            unit: newAddOnUnitInput.value.trim(),
            is_active: newAddOnIsActiveCheckbox.checked,
            current_stock: parseFloat(newAddOnCurrentStockInput.value) || 0,
            unit_cost: parseFloat(newAddOnUnitCostInput.value) || 0,
            reorder_point: parseFloat(newAddOnReorderPointInput.value) || 0
        };

        if (!newAddOn.name || isNaN(newAddOn.price) || newAddOn.price <= 0 || !newAddOn.unit || isNaN(newAddOn.current_stock)) {
            showMessage('Please fill in required add-on fields: Name, Price, Unit, Current Stock.', 'error');
            return;
        }

        try {
            const response = await fetch('/api/inventory/add-ons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAddOn)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            showMessage('Add-on added successfully!', 'success');
            addAddOnForm.reset();
            fetchAndRenderInventory(); // Refresh add-ons table
            populateFormDropdowns(); // Re-populate global dropdowns
        } catch (error) {
            console.error('Error adding add-on:', error);
            showMessage(`Failed to add add-on: ${error.message}`, 'error');
        }
    });


    // --- Product Details Modal Logic ---
    async function openProductDetailsModal(event) {
        currentModalProductId = event.target.dataset.productId;
        currentModalProductType = event.target.dataset.productType; // 'bundle' or 'addon'
        if (!currentModalProductId || !currentModalProductType) return;

        const pathSegment = currentModalProductType === 'addon' ? 'add-ons' : currentModalProductType + 's';

        try {
            const productResponse = await fetch(`/api/inventory/${pathSegment}/${currentModalProductId}`);
            if (!productResponse.ok) throw new Error(`${currentModalProductType} not found`);
            const product = await productResponse.json();

            const ordersResponse = await fetch(`/api/inventory/${pathSegment}/${currentModalProductId}/orders`);
            if (!ordersResponse.ok) throw new Error(`${currentModalProductType} orders not found`);
            const productOrders = await ordersResponse.json();

            populateProductDetailsModal(product, productOrders, currentModalProductType);
            productDetailsModal.classList.remove('hidden');
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

        // Hide/show info display fields based on type
        productBasePriceP.style.display = 'none';
        productPriceP.style.display = 'none';
        productUnitP.style.display = 'none';
        productDescriptionP.style.display = 'none';
        modalProductCurrentStockP.style.display = 'none';
        modalProductUnitCostP.style.display = 'none';
        modalProductTotalValueP.style.display = 'none';
        modalProductReorderPointP.style.display = 'none';
        bundleRecipeTitle.style.display = 'none';
        modalProductRecipe.style.display = 'none';

        // Hide/show editable fields based on type
        editProductBasePriceGroup.style.display = 'none';
        editProductPriceGroup.style.display = 'none';
        editProductUnitGroup.style.display = 'none';
        editProductDescriptionGroup.style.display = 'none';
        editProductCurrentStockGroup.style.display = 'none';
        editProductUnitCostGroup.style.display = 'none';
        editProductReorderPointGroup.style.display = 'none';

        modalEditProductName.value = product.name;
        modalEditProductActive.checked = product.is_active || false;

        if (type === 'bundle') {
            productBasePriceP.style.display = 'block';
            modalProductBasePrice.textContent = `Le ${parseFloat(product.base_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            productDescriptionP.style.display = 'block';
            modalProductDescription.textContent = product.description || 'N/A';
            
            editProductBasePriceGroup.style.display = 'block';
            modalEditProductBasePrice.value = product.base_price;
            editProductDescriptionGroup.style.display = 'block';
            modalEditProductDescription.value = product.description || '';

            bundleRecipeTitle.style.display = 'block';
            modalProductRecipe.style.display = 'block';
            modalProductRecipe.innerHTML = '';
            if (product.recipe && product.recipe.length > 0) {
                const ul = document.createElement('ul');
                product.recipe.forEach(item => {
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

        } else if (type === 'addon' || type === 'ingredient') { // Add ingredient to shared logic
            // Display common stock fields
            modalProductCurrentStockP.style.display = 'block';
            modalProductUnitCostP.style.display = 'block';
            modalProductTotalValueP.style.display = 'block';
            modalProductReorderPointP.style.display = 'block';

            modalProductCurrentStockP.textContent = `Current Stock: ${product.current_stock !== undefined ? product.current_stock : 'N/A'}`;
            modalProductUnitCostP.textContent = `Unit Cost: Le ${parseFloat(product.unit_cost || product.last_cost_per_unit || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            const totalValue = (product.current_stock || 0) * (product.unit_cost || product.last_cost_per_unit || 0);
            modalProductTotalValueP.textContent = `Total Value: Le ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            modalProductReorderPointP.textContent = `Reorder Point: ${product.reorder_point !== undefined ? product.reorder_point : 'N/A'}`;

            // Editable fields for common stock fields
            editProductCurrentStockGroup.style.display = 'block';
            modalEditProductCurrentStock.value = product.current_stock || 0;
            editProductUnitCostGroup.style.display = 'block';
            modalEditProductUnitCost.value = product.unit_cost || product.last_cost_per_unit || 0;
            editProductReorderPointGroup.style.display = 'block';
            modalEditProductReorderPoint.value = product.reorder_point || 0;

            if (type === 'addon') {
                productPriceP.style.display = 'block';
                modalProductPrice.textContent = `Le ${parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                productUnitP.style.display = 'block';
                modalProductUnit.textContent = product.unit || 'N/A';

                editProductPriceGroup.style.display = 'block';
                modalEditProductPrice.value = product.price;
                editProductUnitGroup.style.display = 'block';
                modalEditProductUnit.value = product.unit || '';
            } else if (type === 'ingredient') {
                productUnitP.style.display = 'block';
                modalProductUnit.textContent = product.unit || 'N/A';
                // Ingredients don't have price/description fields in this modal context
                editProductUnitGroup.style.display = 'block';
                modalEditProductUnit.value = product.unit || '';
            }
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
            // Only include is_active if the product type supports it (bundles, addons)
            // Ingredients don't have this field
            ...(currentModalProductType === 'bundle' || currentModalProductType === 'addon' ? { is_active: modalEditProductActive.checked } : {})
        };

        // Common editable fields for products/ingredients
        if (currentModalProductType === 'bundle') {
            updatedData.base_price = parseFloat(modalEditProductBasePrice.value);
            updatedData.description = modalEditProductDescription.value.trim();
        } else if (currentModalProductType === 'addon') {
            updatedData.price = parseFloat(modalEditProductPrice.value);
            updatedData.unit = modalEditProductUnit.value.trim();
            updatedData.current_stock = parseFloat(modalEditProductCurrentStock.value);
            updatedData.unit_cost = parseFloat(modalEditProductUnitCost.value);
            updatedData.reorder_point = parseFloat(modalEditProductReorderPoint.value);
        } else if (currentModalProductType === 'ingredient') {
            updatedData.unit = modalEditProductUnit.value.trim();
            updatedData.current_stock = parseFloat(modalEditProductCurrentStock.value);
            updatedData.last_cost_per_unit = parseFloat(modalEditProductUnitCost.value); // Use last_cost_per_unit for ingredients
            updatedData.reorder_point = parseFloat(modalEditProductReorderPoint.value);
        }

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


    // --- Stock Update Modal Logic ---
    async function openStockUpdateModal(event) {
        const itemId = event.target.dataset.itemId;
        const itemType = event.target.dataset.itemType; // 'ingredient' or 'addon'
        if (!itemId || !itemType) return;

        currentStockItem = null; // Clear previous item
        currentStockModalType = itemType; // Store the type here

        // Find the item from our global arrays
        if (itemType === 'ingredient') {
            currentStockItem = allIngredients.find(ing => ing.id === itemId);
        } else if (itemType === 'addon') {
            currentStockItem = allAddOns.find(ao => ao.id === itemId);
        }

        if (!currentStockItem) {
            showMessage(`Could not find ${itemType} with ID ${itemId}.`, 'error');
            return;
        }

        populateStockUpdateModal(currentStockItem, currentStockModalType); // Use the new global type
        stockUpdateModal.classList.remove('hidden'); // Show the modal
    }

    function closeStockUpdateModal() {
        stockUpdateModal.classList.add('hidden');
        currentStockItem = null;
        currentStockModalType = null; // Clear the global type
        // Reset form fields
        stockAdjustmentTypeSelect.value = 'restock';
        stockQuantityChangeInput.value = '0';
        newUnitCostInput.value = '';
        newUnitCostGroup.style.display = 'block'; // Ensure it's visible by default for restock
        estimatedRestockValueNote.style.display = 'none';
        estimatedRestockValue.textContent = 'Le 0.00';
    }

    function populateStockUpdateModal(item, type) {
        stockModalTitle.textContent = `Update ${type.charAt(0).toUpperCase() + type.slice(1)} Stock`;
        stockModalItemName.textContent = item.name;
        stockModalCurrentStock.textContent = item.current_stock !== undefined ? item.current_stock : 'N/A';
        stockModalUnit.textContent = item.unit || '';

        const unitCost = item.unit_cost !== undefined ? item.unit_cost : (item.last_cost_per_unit !== undefined ? item.last_cost_per_unit : 0);
        stockModalUnitCost.textContent = `Le ${parseFloat(unitCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        const totalValue = (item.current_stock || 0) * unitCost;
        stockModalTotalValue.textContent = `Le ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        // Show/hide unit cost and total value based on item type
        // Both ingredients and add-ons now have unit_cost/last_cost_per_unit
        stockModalUnitCostP.style.display = 'block';
        stockModalTotalValueP.style.display = 'block';

        // Reset and set default for adjustment type
        stockAdjustmentTypeSelect.value = 'restock';
        stockQuantityChangeInput.value = '0';
        newUnitCostInput.value = unitCost; // Pre-fill with current unit cost
        newUnitCostGroup.style.display = 'block'; // Always show for restock by default
        estimatedRestockValueNote.style.display = 'block'; // Show estimated value by default for restock
        calculateEstimatedRestockValue(); // Initial calculation

        stockQuantityChangeInput.focus(); // Focus on quantity input for quick entry
    }

    // Event listener for adjustment type change
    stockAdjustmentTypeSelect.addEventListener('change', () => {
        const type = stockAdjustmentTypeSelect.value;
        if (type === 'restock') {
            newUnitCostGroup.style.display = 'block';
            newUnitCostInput.value = currentStockItem.unit_cost || currentStockItem.last_cost_per_unit || 0; // Pre-fill with current cost
            estimatedRestockValueNote.style.display = 'block';
            stockQuantityChangeInput.min = "0"; // Only positive quantity for restock
        } else { // consumption
            newUnitCostGroup.style.display = 'none';
            estimatedRestockValueNote.style.display = 'none';
            stockQuantityChangeInput.min = "0"; // User enters positive number for decrease
        }
        stockQuantityChangeInput.value = '0'; // Reset quantity on type change
        calculateEstimatedRestockValue(); // Recalculate
    });

    // Event listeners for quantity and unit cost changes to calculate estimated value
    stockQuantityChangeInput.addEventListener('input', calculateEstimatedRestockValue);
    newUnitCostInput.addEventListener('input', calculateEstimatedRestockValue);

    function calculateEstimatedRestockValue() {
        const quantity = parseFloat(stockQuantityChangeInput.value);
        const unitCost = parseFloat(newUnitCostInput.value);
        const adjustmentType = stockAdjustmentTypeSelect.value;

        if (adjustmentType === 'restock' && !isNaN(quantity) && quantity > 0 && !isNaN(unitCost) && unitCost >= 0) {
            const estimatedValue = quantity * unitCost;
            estimatedRestockValue.textContent = `Le ${estimatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            estimatedRestockValueNote.style.display = 'block';
        } else {
            estimatedRestockValueNote.style.display = 'none';
            estimatedRestockValue.textContent = 'Le 0.00';
        }
    }

    // Save Stock Update
    saveStockUpdateBtn.addEventListener('click', async () => {
        if (!currentStockItem || !currentStockModalType) {
            showMessage('No item selected for stock update or item type is missing.', 'error');
            return;
        }

        const quantityChange = parseFloat(stockQuantityChangeInput.value);
        if (isNaN(quantityChange) || quantityChange <= 0) {
            showMessage('Please enter a valid positive quantity for the stock adjustment.', 'error');
            return;
        }

        const adjustmentType = stockAdjustmentTypeSelect.value;
        let finalQuantityChange = quantityChange;
        let unitCostToUse = parseFloat(newUnitCostInput.value); 
        // If unitCostToUse is NaN (e.g., field was empty for restock), default to current or 0
        if (isNaN(unitCostToUse)) {
             unitCostToUse = currentStockItem.unit_cost || currentStockItem.last_cost_per_unit || 0;
        }


        if (adjustmentType === 'consumption') {
            finalQuantityChange = -quantityChange; // Make it negative for consumption
            // For consumption, we don't update the unit cost, so we don't send it.
            // Backend will use its existing unit_cost/last_cost_per_unit for internal calculations.
            unitCostToUse = undefined; // Explicitly set to undefined so it's not sent in payload

            if ((currentStockItem.current_stock || 0) + finalQuantityChange < 0) {
                showMessage('Cannot decrease stock below zero.', 'error');
                return;
            }
        }
        
        // Prepare payload
        const payload = { quantity_change: finalQuantityChange };
        if (adjustmentType === 'restock') {
            payload.unit_cost = unitCostToUse;
        }

        // Use currentStockModalType for constructing the endpoint path
        const endpointPath = currentStockModalType === 'ingredient' ? 
            `/api/inventory/ingredients/${currentStockItem.id}/stock` : 
            `/api/inventory/add-ons/${currentStockItem.id}/stock`;

        try {
            const response = await fetch(endpointPath, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const updatedItem = await response.json();
            showMessage(`${currentStockItem.name} stock updated successfully! New stock: ${updatedItem.current_stock}`, 'success');
            fetchAndRenderInventory(); // Refresh relevant tables
            closeStockUpdateModal();
        } catch (error) {
            console.error('Error updating stock:', error);
            showMessage(`Failed to update stock: ${error.message}`, 'error');
        }
    });

    // Attach stock modal event listeners
    stockModalCloseButton.addEventListener('click', closeStockUpdateModal);
    window.addEventListener('click', (event) => {
        if (event.target === stockUpdateModal) {
            closeStockUpdateModal();
        }
    });


    // --- Reporting ---
    // Function to toggle report visibility and fetch/render if hidden
    async function toggleReportDisplay(event) {
        const button = event.target;
        const targetReportId = button.dataset.targetReport;
        const outputElement = document.getElementById(targetReportId);

        if (outputElement.classList.contains('hidden')) {
            // Report is hidden, so show it and fetch data
            outputElement.innerHTML = '<p>Generating report...</p>'; // Show loading message
            try {
                // Corrected: Extract endpoint name from button ID, convert to kebab-case
                let baseEndpointName = button.id.replace('generate', ''); // e.g., "DailySummary"
                // Convert camelCase to kebab-case: insert hyphen before uppercase letters, then lowercase
                const apiEndpoint = baseEndpointName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
                
                let url = `/api/reports/${apiEndpoint}`;

                // NEW: Add date parameter for daily-summary report
                if (apiEndpoint === 'daily-summary') {
                    const selectedDate = dailySummaryDateInput.value;
                    if (selectedDate) {
                        url += `?date=${selectedDate}`;
                    }
                }

                const response = await fetch(url);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }
                const reportData = await response.json();
                console.log(`Raw report data for ${apiEndpoint}:`, reportData); // DEBUG LOG
                outputElement.innerHTML = formatReportOutput(reportData, apiEndpoint);
                outputElement.classList.remove('hidden'); // Show the content
            } catch (error) {
                console.error(`Error generating report:`, error);
                outputElement.innerHTML = `<p style="color: red;">Failed to generate report: ${error.message}</p>`;
                outputElement.classList.remove('hidden'); // Still show error to user
            }
        } else {
            // Report is visible, so hide it
            outputElement.classList.add('hidden');
            outputElement.innerHTML = ''; // Clear content when hidden
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

    // Attach event listener to all report toggle buttons
    reportToggleButtons.forEach(button => {
        button.removeEventListener('click', toggleReportDisplay); // Ensure no duplicate listeners
        button.addEventListener('click', toggleReportDisplay);
    });


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
            // First, hide ALL content sections
            contentSections.forEach(section => section.classList.add('hidden'));

            // Additionally, ensure all individual report outputs are hidden when changing tabs.
            // This prevents report content from staying visible if the Reports tab was active
            // and a report was open, then user switched away.
            dailySummaryOutput.classList.add('hidden');
            dailySummaryOutput.innerHTML = ''; // Clear content too
            salesByBundleOutput.classList.add('hidden');
            salesByBundleOutput.innerHTML = '';
            agentPerformanceOutput.classList.add('hidden');
            agentPerformanceOutput.innerHTML = '';


            // Remove active class from all nav links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to the clicked nav link
            event.target.classList.add('active');

            const targetId = event.target.dataset.target;
            document.getElementById(targetId).classList.remove('hidden');

            // Specific data fetching/rendering based on tab
            if (targetId === 'orders-list-section') {
                populateFormDropdowns(); // Ensure agents are loaded for the filter dropdown
                fetchAndRenderOrders();
            } else if (targetId === 'customers-list-section') {
                fetchAndRenderCustomers();
            } else if (targetId === 'inventory-section') {
                fetchAndRenderInventory();
            } else if (targetId === 'add-order-section') {
                populateFormDropdowns();
                calculateTotalPrice();
                // Ensure new customer fields are hidden and required attributes reset on tab switch
                newCustomerFields.style.display = 'none';
                newCustomerNameInput.required = false;
                newWhatsappNumberInput.required = false;
                newDeliveryAddressInput.required = false;
                customerIdSelect.required = true;
            } else if (targetId === 'dashboard-section') {
                fetchAndRenderDashboardMetrics();
            } else if (targetId === 'reports-section') {
                // Set default date for daily summary to today
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                const day = String(today.getDate()).padStart(2, '0');
                dailySummaryDateInput.value = `${year}-${month}-${day}`;
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
    // Ensure dropdowns are populated on initial load before any tab is clicked
    populateFormDropdowns().then(() => {
        // Then click the dashboard tab to render initial content
        document.querySelector('.nav-link[data-target="dashboard-section"]').click();
    });
});
