function openModal() {
    const existingModal = document.getElementById('niner-registration-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const overlay = document.createElement('div');
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

function parseCourseRow(clickedElement) {
    const row = clickedElement.closest('tr');
    if (!row) {
        return null;
    }

    const subject;
    const courseNumber;
    const section;
    const crn;
    const title;
    const credits;

    const meetings;
    const meetingElements;
}