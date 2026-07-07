document.addEventListener('DOMContentLoaded', () => {
    const versionElement = document.getElementById('app-version');
    if (!versionElement) return;

    fetch('https://cosmostrak-backend.onrender.com/api/version')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la versión');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.version) {
                versionElement.textContent = `v${data.version}`;
            }
        })
        .catch(error => {
            console.error('Error fetching version:', error);
            // Si hay error, simplemente no mostramos nada para no afectar la UI
        });
});
