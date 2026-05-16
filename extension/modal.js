function openModal(clickedElement, rmpData) {
    console.log('openModal fired', clickedElement);
    const existingModal = document.getElementById('niner-registration-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const courseData = parseCourseRow(clickedElement);
    console.log(courseData);

    const overlay = document.createElement('div');
    overlay.id = 'niner-registration-modal';
    overlay.className = 'niner-modal-overlay';

    const modalContainer = document.createElement('div');
    modalContainer.className = 'niner-modal-container';

    const header = document.createElement('div');
    header.className = 'niner-modal-header';
    header.innerHTML = `
        <div class="niner-modal-title">
            <span class="niner-modal-prof">${clickedElement.textContent.trim().replace('↗', '').trim()}</span>
            <span class="niner-modal-course">${courseData.subject} ${courseData.courseNumber} - ${courseData.title} · ${courseData.credits} Credits</span>
        </div>
        <button class ="niner-modal-close">✕</button>
    `;

    const body = document.createElement('div');
    body.className = 'niner-modal-body';

    const rightCol = document.createElement('div');
    rightCol.className = 'niner-modal-right';

    const rmpUrl = rmpData
        ? `https://www.ratemyprofessors.com/professor/${rmpData.legacyId}`
        : `https://www.ratemyprofessors.com/search/professors/1253?q=${encodeURIComponent(clickedElement.textContent.trim().replace('↗', '').trim())}`;

    rightCol.innerHTML = `
        <a class="niner-btn" href="${rmpUrl}" target="_blank">RateMyProfessors →</a>
    <a class="niner-btn" href="https://coursicle.com/uncc/courses/${courseData.subject}${courseData.courseNumber}/" target="_blank">Coursicle →</a>
    `;
    
    body.appendChild(rightCol);
    
    modalContainer.appendChild(header);
    modalContainer.appendChild(body);
    overlay.appendChild(modalContainer);
    document.body.appendChild(overlay);

    header.querySelector('.niner-modal-close').addEventListener('click', () => overlay.remove());

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            overlay.remove();
        }
    });
} 

function parseCourseRow(clickedElement) {
    const row = clickedElement.closest('tr');
    console.log('row found:', row);
    if (!row) {
        return null;
    }

    const subject =  row.querySelector('[xe-field="subject"]')?.textContent?.trim() || '';
    const courseNumber = row.querySelector('[xe-field="courseNumber"]')?.textContent?.trim() || '';
    const section = row.querySelector('[xe-field="sequenceNumber"]')?.textContent?.trim() || '';
    const crn = row.querySelector('[xe-field="courseReferenceNumber"]')?.textContent?.trim() || '';
    const title = row.querySelector('[xe-field="courseTitle"] a')?.textContent?.trim() || '';
    const credits = row.querySelector('[xe-field="creditHours"]')?.textContent?.trim() || '';

    const meetings = [];
    const meetingElements = row.querySelectorAll('[xe-field="meetingTime"] .meeting');

    meetingElements.forEach(el => {
        const days = [...el.querySelectorAll('.ui-state-highlight')]
            .map(d => d.getAttribute('data-name'));

        const scheduleSpan = el.querySelector('.meeting-schedule > span:not(.ui-pillbox)');
        const time = scheduleSpan ? scheduleSpan.textContent.trim().replace(/\s+/g, ' ') : '';

        const tooltipRows = [...el.querySelectorAll('.tooltip-row')];

        const building = tooltipRows.find(r => r.textContent.includes('Building'))
            ?.textContent.replace('Building:', '').trim() || '';
        
        const room = tooltipRows.find(r => r.textContent.includes('Room'))
            ?.textContent.replace('Room:', '').trim() || '';

        const startDate = tooltipRows.find(r => r.textContent.includes('Start Date'))
            ?.textContent.replace('Start Date:', '').trim() || '';

        const endDate = tooltipRows.find(r => r.textContent.includes('End Date'))
            ?.textContent.replace('End Date:', '').trim() || '';
        
            if (days.length > 0) {
                meetings.push({ days, time, building, room, startDate, endDate});
            }
    });

    return {
        subject,
        courseNumber,
        section,
        crn,
        title,
        credits,
        meetings
    };
}