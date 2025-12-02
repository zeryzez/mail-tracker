async function fetchStats() {
    const tableBody = document.getElementById('tableBody');
    const loading = document.getElementById('loading');

    loading.style.display = 'block';
    tableBody.innerHTML = '';

    const secret = prompt("Enter admin password:");

    try {

        const response = await fetch(`/api/stats?secret=${secret}`);

        if (response.status === 401) {
            loading.textContent = "⛔ Incorrect password!";
            return;
        }

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

        loading.style.display = 'none';

        if (data.length === 0) {
            loading.textContent = "No opens recorded yet.";
            loading.style.display = 'block';
            return;
        }

        data.forEach(row => {
            const dateFr = new Date(row.opened_at).toLocaleString('fr-FR');
            const device = row.user_agent.includes('Mobile') ? '📱 Mobile' : '💻 Desktop';

            const emailDisplay = row.recipient_email ? row.recipient_email : '<em>Inconnu (Lien manuel)</em>';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.id}</td> <td>${emailDisplay}</td>
                <td>
                    <span style="color:${statusColor}; font-weight:bold;">${statusIcon}</span>
                </td>
                <td>${row.opened_at ? new Date(row.opened_at).toLocaleString() : '-'}</td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (error) {
        loading.textContent = "Error loading data.";
        console.error(error);
    }
}

fetchStats();