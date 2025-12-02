async function fetchStats() {
    const tableBody = document.getElementById('tableBody');
    const loading = document.getElementById('loading');

    loading.style.display = 'block';
    tableBody.innerHTML = '';

    const secret = prompt("Enter admin password:");

    try {
        const response = await fetch(`/api/stats?secret=${secret}`);

        if (response.status === 401) {
            loading.textContent = "⛔ Incorrect password.";
            loading.style.display = 'block';
            return;
        }

        if (!response.ok) throw new Error('Network error');

        const data = await response.json();
        loading.style.display = 'none';

        if (data.length === 0) {
            loading.textContent = "No data available.";
            loading.style.display = 'block';
            return;
        }

        data.forEach(row => {
            const isOpened = row.status === 'opened' || row.opened_at !== null;

            let dateSent;
            if (row.sent_at) {
                dateSent = new Date(row.sent_at).toLocaleString('fr-FR');
            } else {
                dateSent = '-';
            }

            let dateOpened;
            if (row.opened_at) {
                dateOpened = new Date(row.opened_at).toLocaleString('fr-FR');
            } else {
                dateOpened = '<span style="color:#ccc; font-style:italic;">Pending...</span>';
            }

            const emailDisplay = row.recipient_email ? row.recipient_email : '<em style="color:#999">Unknown (Manual)</em>';

            const statusBg = isOpened ? '#ecfdf5' : '#fffbeb';
            const statusIcon = isOpened ? '✅ Opened' : '⏳ Sent';
            const statusBorder = isOpened ? '#059669' : '#d97706';

            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${emailDisplay}</td>
                <td>
                    <span class="badge" style="background-color:${statusBg}; color:${statusBorder}; border: 1px solid ${statusBorder}">
                        ${statusIcon}
                    </span>
                </td>
                <td>${dateSent}</td>
                <td>${dateOpened}</td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (error) {
        loading.textContent = "Error loading data.";
        loading.style.display = 'block';
        console.error("JS Error:", error);
    }
}

fetchStats();