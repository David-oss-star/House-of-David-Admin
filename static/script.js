document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const ordersTableBody = document.querySelector('#ordersTable tbody');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const agentFilter = document.getElementById('agentFilter');
    const noOrdersMessage = document.getElementById('noOrdersMessage');

    let allOrders = []; // Store all orders to facilitate filtering without refetching

    // Function to fetch orders from the backend API
    async function fetchOrders() {
        try {
            const response = await fetch('/api/orders');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allOrders = await response.json();
            renderOrders(allOrders); // Render all orders initially
        } catch (error) {
            console.error('Error fetching orders:', error);
            ordersTableBody.innerHTML = '<tr><td colspan="12" style="text-align: center; color: red;">Failed to load orders. Please try again.</td></tr>';
        }
    }

    // Function to render orders in the table
    function renderOrders(ordersToRender) {
        ordersTableBody.innerHTML = ''; // Clear existing rows
        if (ordersToRender.length === 0) {
            noOrdersMessage.style.display = 'block';
            ordersTableBody.style.display = 'none'; // Hide table body if no orders
            return;
        } else {
            noOrdersMessage.style.display = 'none';
            ordersTableBody.style.display = 'table-row-group'; // Show table body
        }

        ordersToRender.forEach(order => {
            const row = ordersTableBody.insertRow();
            row.dataset.orderId = order.id; // Store order ID on the row

            // Format timestamps for display
            const orderTime = order.order_received_timestamp ? new Date(order.order_received_timestamp).toLocaleString() : 'N/A';
            const deliveryTime = order.delivery_timestamp ? new Date(order.delivery_timestamp).toLocaleString() : 'N/A';

            row.innerHTML = `
                <td>${order.id.substring(0, 8)}...</td>
                <td>${order.customer_name}</td>
                <td>${order.whatsapp_number}</td>
                <td>${order.delivery_address}</td>
                <td>${order.bundle_type || 'N/A'}</td>
                <td>${order.add_ons || 'None'}</td>
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
                    </select>
                </td>
                <td>
                    <input type="text" class="agent-input" data-order-id="${order.id}" value="${order.delivery_agent_id || ''}" placeholder="Agent ID">
                </td>
                <td>${orderTime}</td>
                <td>${deliveryTime}</td>
                <td>
                    <button class="btn btn-danger delete-btn" data-order-id="${order.id}">Delete</button>
                </td>
            `;
            // Add class to the row based on status for easier identification/styling if needed
            row.classList.add(`status-${order.order_status.replace(/\s/g, '_')}`);
        });

        // Add event listeners to newly rendered status selects and agent inputs
        addEventListenersToOrderActions();
    }

    // Add order submission handler
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newOrder = {
            customer_name: document.getElementById('customerName').value,
            whatsapp_number: document.getElementById('whatsappNumber').value,
            delivery_address: document.getElementById('deliveryAddress').value,
            bundle_type: document.getElementById('bundleType').value,
            add_ons: document.getElementById('addOns').value,
            total_price: parseFloat(document.getElementById('totalPrice').value),
            payment_status: document.getElementById('paymentStatus').value
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Clear form and re-fetch orders to update the table
            orderForm.reset();
            fetchOrders();
            alert('Order added successfully!'); // Using alert for simplicity, replace with custom modal in production
        } catch (error) {
            console.error('Error adding order:', error);
            alert('Failed to add order. Please check console for details.');
        }
    });

    // Function to add event listeners for status change and agent ID input
    function addEventListenersToOrderActions() {
        // Status select change listener
        document.querySelectorAll('.status-select').forEach(select => {
            select.removeEventListener('change', handleStatusChange); // Prevent duplicate listeners
            select.addEventListener('change', handleStatusChange);
        });

        // Agent input blur listener (when input loses focus)
        document.querySelectorAll('.agent-input').forEach(input => {
            input.removeEventListener('blur', handleAgentIdChange); // Prevent duplicate listeners
            input.addEventListener('blur', handleAgentIdChange);
        });

        // Delete button click listener
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.removeEventListener('click', handleDeleteOrder); // Prevent duplicate listeners
            button.addEventListener('click', handleDeleteOrder);
        });
    }

    async function handleStatusChange(event) {
        const orderId = event.target.dataset.orderId;
        const newStatus = event.target.value;
        const confirmUpdate = confirm(`Are you sure you want to change the status of order ${orderId.substring(0, 8)}... to "${newStatus}"?`);
        
        if (!confirmUpdate) {
            // Revert dropdown to previous value if canceled
            fetchOrders(); // Easiest way to revert for now
            return;
        }

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ order_status: newStatus })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Update local data and re-render
            const updatedOrder = await response.json();
            const index = allOrders.findIndex(order => order.id === orderId);
            if (index !== -1) {
                allOrders[index] = updatedOrder;
            }
            applyFilters(); // Re-apply filters to update display without full refresh
            alert(`Order ${orderId.substring(0, 8)}... status updated to "${newStatus}"!`);
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status. Please try again.');
            fetchOrders(); // Re-fetch on error to ensure data consistency
        }
    }

    async function handleAgentIdChange(event) {
        const orderId = event.target.dataset.orderId;
        const newAgentId = event.target.value.trim(); // Trim whitespace

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ delivery_agent_id: newAgentId })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedOrder = await response.json();
            const index = allOrders.findIndex(order => order.id === orderId);
            if (index !== -1) {
                allOrders[index] = updatedOrder;
            }
            applyFilters(); // Re-apply filters to update display
            alert(`Order ${orderId.substring(0, 8)}... agent ID updated!`);
        } catch (error) {
            console.error('Error updating agent ID:', error);
            alert('Failed to update agent ID. Please try again.');
            fetchOrders(); // Re-fetch on error
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Remove the order from local data and re-render
            allOrders = allOrders.filter(order => order.id !== orderId);
            applyFilters(); // Re-apply filters to update display
            alert(`Order ${orderId.substring(0, 8)}... deleted successfully!`);
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete order. Please try again.');
            fetchOrders(); // Re-fetch on error
        }
    }

    // Filtering logic
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

        const selectedAgent = agentFilter.value.toLowerCase();
        if (selectedAgent) {
            filteredOrders = filteredOrders.filter(order =>
                (order.delivery_agent_id || '').toLowerCase().includes(selectedAgent)
            );
        }

        renderOrders(filteredOrders);
    }

    // Event listeners for filter changes
    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    agentFilter.addEventListener('input', applyFilters);

    // Initial fetch of orders when the page loads
    fetchOrders();
});
