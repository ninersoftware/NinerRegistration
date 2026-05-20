function getRatingColor(rating) {
    if (rating >= 4.0) {
        return '#2ca25f';
    } else if (rating >= 3.0) {
        return '#e9a400';
    } else {
        return '#de2d26';
    }
}

function injectOverview(cell, data, originalName) {
    const overview = document.createElement('div');
    overview.className = 'professor-container';
    const ratingColor = getRatingColor(data.avgRating);
    const lastReview = data.lastRating
        ? new Date(data.lastRating.replace(' +0000 UTC', 'Z').replace(' ', 'T')).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : null;
    const wouldTakeAgain = data.wouldTakeAgainPercent === -1
        ? "N/A"
        : `${Math.round(data.wouldTakeAgainPercent)}%`;
    const lowRatings = data.numRatings < 10;
    overview.innerHTML = `
    <a class="professor-name" style="cursor: pointer;">
        <span class="rating-dot" style="background:${ratingColor}"></span>    
        ${originalName} ↗
    </a>
    <div class="professor-stats">
        <div class ="professor-header">
            <span class="professor-full-name"><strong>${data.firstName} ${data.lastName}</strong></span>
        </div>
        <div class="professor-row">
            <div class="rating-box" style="background:${ratingColor}">
                <span class="rating-number">${data.avgRating}</span>
                <span class="rating-label">/ 5 </span>
            </div>
            <div class ="rating-details">
                <span>Difficulty: <strong>${data.avgDifficulty}</strong></span>
                <span><strong>${wouldTakeAgain}</strong> would take again</span>
                <span><strong>${data.numRatings}</strong> ratings</span>
            </div>
        </div>
        ${lowRatings ? `<span class="low-ratings-warning"><strong>⚠️ Low rating count</strong></span>` : ''}
        ${lastReview ? `<span class="last-review"><strong>Last reviewed: <em>${lastReview}</em></strong></span>` : ''}
    </div>
    `;
    cell.innerHTML = '';
    cell.appendChild(overview);

    chrome.storage.local.get('ninerTheme', (result) => {
    const theme = result.ninerTheme || 'white';
    const stats = overview.querySelector('.professor-stats');
    const fullName = stats.querySelector('.professor-full-name');
    const details = stats.querySelectorAll('.rating-details span');
    const header = stats.querySelector('.professor-header');
    const lastReview = stats.querySelector('.last-review');

    if (theme === 'dark') {
        stats.style.background = '#101820';
        stats.style.color = '#ffffff';
        if (fullName) fullName.style.color = '#ffffff';
        if (header) header.style.borderBottomColor = 'rgba(255,255,255,0.15)';
        details.forEach(s => s.style.color = '#ffffff');
        if (lastReview) lastReview.style.color = 'rgba(255,255,255,0.6)';
    } else if (theme === 'green') {
        stats.style.background = '#046A38';
        stats.style.color = '#ffffff';
        if (fullName) fullName.style.color = '#ffffff';
        if (header) header.style.borderBottomColor = 'rgba(255,255,255,0.15)';
        details.forEach(s => s.style.color = '#ffffff');
        if (lastReview) lastReview.style.color = 'rgba(255,255,255,0.6)';
    } else { // White theme
        stats.style.background = '#ffffff';
        stats.style.color = '#000000';
        stats.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
        if (fullName) fullName.style.color = '#000000';
        if (header) header.style.borderBottomColor = 'rgba(0,0,0,0.1)';
        details.forEach(s => s.style.color = '#000000');
        if (lastReview) lastReview.style.color = 'rgba(0,0,0,0.6)';
    }
});

    const link = overview.querySelector('.professor-name');
    link.style.setProperty('color', '#2e6da4', 'important');

    link.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(event.target, data);
    });


    overview.addEventListener('mouseenter', () => {
        const stats = overview.querySelector('.professor-stats');
        const rect = overview.getBoundingClientRect();

        stats.style.position = 'fixed';
        stats.style.top = (rect.top - 100) + 'px';
        stats.style.left = (rect.right + 5) + 'px';

        if (rect.right + 220 > window.innerWidth) {
            stats.style.left = (rect.left - 225) + 'px';
        }

        if (rect.top < 0) {
            stats.style.top = rect.bottom + 'px';
        }
});
}

function injectNotFound(cell, name) {
    const overview = document.createElement('div');
    overview.className = 'professor-container'
    overview.innerHTML = `
    <span class ="professor-name-plain">
        <span class="rating-dot" style="background:#666"></span>
        ${name} ↗
    </span>
    <div class= "professor-stats">
        <div class="professor-header">
            <span class="professor-full-name"><strong>${name}</strong></span>
        </div>
        <div class="rating-box" style="background:#666">
            <span class="rating-number">N/A</span>
        </div>
        <div class="rating-details">
            <span>Click name to search on RMP</span>
        </div>
    </div>
    `;
    cell.innerHTML = '';
    cell.appendChild(overview);

    chrome.storage.local.get('ninerTheme', (result) => {
    const theme = result.ninerTheme || 'white';
    const stats = overview.querySelector('.professor-stats');
    const fullName = stats.querySelector('.professor-full-name');
    const details = stats.querySelectorAll('.rating-details span');
    const header = stats.querySelector('.professor-header');
    const lastReview = stats.querySelector('.last-review');

    if (theme === 'dark') {
        stats.style.background = '#101820';
        stats.style.color = '#ffffff';
        if (fullName) fullName.style.color = '#ffffff';
        if (header) header.style.borderBottomColor = 'rgba(255,255,255,0.15)';
        details.forEach(s => s.style.color = '#ffffff');
        if (lastReview) lastReview.style.color = 'rgba(255,255,255,0.6)';
    } else if (theme === 'green') {
        stats.style.background = '#046A38';
        stats.style.color = '#ffffff';
        if (fullName) fullName.style.color = '#ffffff';
        if (header) header.style.borderBottomColor = 'rgba(255,255,255,0.15)';
        details.forEach(s => s.style.color = '#ffffff');
        if (lastReview) lastReview.style.color = 'rgba(255,255,255,0.6)';
    } else { // White theme
        stats.style.background = '#ffffff';
        stats.style.color = '#000000';
        stats.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
        if (fullName) fullName.style.color = '#000000';
        if (header) header.style.borderBottomColor = 'rgba(0,0,0,0.1)';
        details.forEach(s => s.style.color = '#000000');
        if (lastReview) lastReview.style.color = 'rgba(0,0,0,0.6)';
    }
});

    overview.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(event.target, null);
    });


    overview.addEventListener('mouseenter', () => {
        const stats = overview.querySelector('.professor-stats');
        const rect = overview.getBoundingClientRect();

        stats.style.position = 'fixed';
        stats.style.top = (rect.top - 100) + 'px';
        stats.style.left = (rect.right + 5) + 'px';

        if (rect.right + 220 > window.innerWidth) {
            stats.style.left = (rect.left - 225) + 'px';
        }

        if (rect.top < 0) {
            stats.style.top = rect.bottom + 'px';
        }
});
}

const observer = new MutationObserver(() => {
    const cells = document.querySelectorAll('[xe-field="instructor"]');
    cells.forEach(cell => {
        if (cell.dataset.ninerProcessed) return;
        cell.dataset.ninerProcessed = "true";
        const anchors = cell.querySelectorAll('a.email');
        if (anchors.length > 0) {
            cell.innerHTML = '';
            anchors.forEach(anchor => {
                const name = anchor.textContent.trim();
                const wrapper = document.createElement('div');
                wrapper.textContent = '...';
                cell.appendChild(wrapper);
                try {
                    chrome.runtime.sendMessage({ professorName: name }, (response) => {
                        if (response && response.success) {
                            injectOverview(wrapper, response.data, name);
                        } else {
                            injectNotFound(wrapper, name);
                        }
                    });
                } catch(e) {
                    wrapper.textContent = name;
                    cell.dataset.ninerProcessed ="";
                }
            })
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.ninerTheme) {
        const theme = changes.ninerTheme.newValue || 'white';
        document.querySelectorAll('.professor-stats').forEach(stats => {
            const fullName = stats.querySelector('.professor-full-name');
            const details = stats.querySelectorAll('.rating-details span');
            const header = stats.querySelector('.professor-header');
            const lastReview = stats.querySelector('.last-review');

            if (theme === 'dark') {
                stats.style.background = '#101820';
                stats.style.color = '#ffffff';
                stats.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
                if (fullName) fullName.style.color = '#ffffff';
                if (header) header.style.borderBottomColor = 'rgba(255,255,255,0.15)';
                details.forEach(s => s.style.color = '#ffffff');
                if (lastReview) lastReview.style.color = 'rgba(255,255,255,0.6)';
            } else if (theme === 'green') {
                stats.style.background = '#046A38';
                stats.style.color = '#ffffff';
                stats.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
                if (fullName) fullName.style.color = '#ffffff';
                if (header) header.style.borderBottomColor = 'rgba(255,255,255,0.15)';
                details.forEach(s => s.style.color = '#ffffff');
                if (lastReview) lastReview.style.color = 'rgba(255,255,255,0.6)';
            } else { // White theme
                stats.style.background = '#ffffff';
                stats.style.color = '#000000';
                stats.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                if (fullName) fullName.style.color = '#000000';
                if (header) header.style.borderBottomColor = 'rgba(0,0,0,0.1)';
                details.forEach(s => s.style.color = '#000000');
                if (lastReview) lastReview.style.color = 'rgba(0,0,0,0.6)';
            }
        });
    }
});