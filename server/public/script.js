
let currentPage = 1;
const itemsPerPage = 10
let adminSecret = null
async function fetchStats(page = 1) {
    const tableBody = document.getElementById('tableBody');
    const loading = document.getElementById('loading');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageIndicator = document.getElementById('pageIndicator');

    if (!adminSecret) {
        adminSecret = prompt("Enter admin password:");
        if (!adminSecret) return
    }

    loading.style.display = 'block';
    tableBody.innerHTML = ''
    currentPage = page;

    try {

        const response = await fetch(`/api/stats?secret=${adminSecret}&page=${page}&limit=${itemsPerPage}`);

        if (response.status === 401) {
            alert("⛔ Incorrect admin password.");
            adminSecret = null
            loading.textContent = "No Acces";
            return;
        }

        const json = await response.json();
        const data = json.data;
        const total = json.total

        loading.style.display = 'none';

        if (!data || data.length === 0) {
            loading.textContent = "No Data";
            loading.style.display = 'block';
            return;
        }


        const totalPages = Math.ceil(total / itemsPerPage);
        pageIndicator.textContent = `(Page ${currentPage} / ${totalPages})`;


        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage >= totalPages;


        data.forEach(row => {
            const isOpened = row.status === 'opened' || row.opened_at !== null;


            const dateSent = row.sent_at ? new Date(row.sent_at).toLocaleString('fr-FR') : '-';
            const dateOpened = row.opened_at ? new Date(row.opened_at).toLocaleString('fr-FR') : '<span style="color:#ccc; font-style:italic;">Pending...</span>';
            const emailDisplay = row.recipient_email ? row.recipient_email : '<em style="color:#999">Unknown</em>';


            const statusBg = isOpened ? '#ecfdf5' : '#fffbeb';
            const statusIcon = isOpened ? '✅' : '⏳';
            const statusBorder = isOpened ? '#059669' : '#d97706';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${emailDisplay} <br> <small style="color:#ccc">${row.id.substring(0, 6)}...</small></td>
                <td>
                    <span class="badge" style="background-color:${statusBg}; color:${statusBorder}; border: 1px solid ${statusBorder}">
                        ${statusIcon} ${row.status}
                    </span>
                </td>
                <td>${dateSent}</td>
                <td>${dateOpened}</td>
                <td>
                    <button class="delete-btn" onclick="deleteMail('${row.id}')">🗑️</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (error) {
        loading.textContent = "Loading error.";
        loading.style.display = 'block';
        console.error("Error:", error);
    }
}
function changePage(direction) {
    const newPage = currentPage + direction;
    if (newPage > 0) {
        fetchStats(newPage);
    }
}
async function deleteMail(id) {
    if (!confirm("Do you really want to delete this history entry?")) return;

    try {
        const response = await fetch(`/api/delete?secret=${adminSecret}&id=${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {

            fetchStats(currentPage);
        } else {
            alert("Erreur lors de la suppression");
        }
    } catch (e) {
        console.error(e);
        alert("Erreur réseau");
    }
}
fetchStats();