function openModal(clickedElement, rmpData) {
    const existingModal = document.getElementById('niner-registration-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const courseData = parseCourseRow(clickedElement);

    const profName = clickedElement.textContent.trim().replace('↗', '').trim();

    const overlay = document.createElement('div');
    overlay.id = 'niner-registration-modal';
    overlay.className = 'niner-modal-overlay';

    const modalContainer = document.createElement('div');
    modalContainer.className = 'niner-modal-container';

    const meetingLines = courseData.meetings.map(m => {
        const days = m.days.map(d => d.slice(0,3)).join('/');
        return `<span class="niner-modal-meeting">${days} ${m.time} · ${m.building} ${m.room}</span>`;
    }).join('');

    const rmpUrl = rmpData
        ? `https://www.ratemyprofessors.com/professor/${rmpData.legacyId}`
        : `https://www.ratemyprofessors.com/search/professors/1253?q=${encodeURIComponent(clickedElement.textContent.trim().replace('↗', '').trim())}`;

    modalContainer.innerHTML = `
        <div class="niner-topbar">
            <button class="niner-settings-btn">⚙</button>
            <button class="niner-close-btn">✕</button>
        </div>

        <div class="niner-header">
            <div class="niner-prof">${profName}</div>
            <div class="niner-course">${courseData.subject} ${courseData.courseNumber}  ·  ${courseData.credits} Credits</div>
            ${meetingLines}
        </div>

        <div class="niner-divider"></div>

        <div class="niner-grade-section">
            <div class="niner-section-label">Grade Distribution</div>
            <div class="niner-grade-placeholder">Coming soon</div>
        </div>

        <div class="niner-divider"></div>

        <div class="niner-links">
            <a class="niner-link" href="${rmpUrl}" target="_blank">RateMyProfessors ↗</a>
            <a class="niner-link niner-link-coursicle" href="https://www.coursicle.com/uncc/courses/${courseData.subject}/${courseData.courseNumber}/" target="_blank">Coursicle ↗</a>
        </div>

        <div class="niner-divider"></div>

        <div class="niner-tray">
            <button class="niner-tray-add">+ Add</button>
            <div class="niner-tray-courses">
                <span class="niner-tray-empty">Add courses to build your schedule</span>
            </div>
            <div class="niner-tray-actions">
                <button class="niner-tray-btn niner-tray-undo">↩</button>
                <button class="niner-tray-btn niner-tray-export">⬇ .ics</button>
            </div>
        </div>

        <div class="niner-credit">© 2026 ninersoftware</div>    
    `;

    overlay.appendChild(modalContainer);
    document.body.appendChild(overlay);


    modalContainer.querySelector('.niner-close-btn').addEventListener('click', () => overlay.remove());

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