function openModal() {
    const existingModal = document.getElementById('niner-registration-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const overlay = document.createElementNS('div');
    overlay.id = 'niner-registration-modal';
    overlay.className = 'niner-modal-overlay';

    const modalContainer = document.createElement('div');
    modalContainer.className = 'niner-modal-container';

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            overlay.remove();
        }
    });

    overlay.appendChild(modalContainer);
    document.body.appendChild(overlay);
} 