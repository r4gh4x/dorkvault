$(document).ready(function() {
    let currentBatchIndex = 0;

    const batchControls = `
        <div class="batch-controls" style="display: flex; align-items: center; gap: 10px; font-size: 1rem;">
            <label for="batch-size" style="color: var(--text-color); font-size: 0.9rem;">Batch:</label>
            <input type="number" id="batch-size" value="10" min="1" style="width: 60px; padding: 5px; height: auto;">
            <button id="open-batch-btn" type="button" style="padding: 5px 15px; font-size: 0.9rem; margin: 0; background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);">Open</button>
        </div>
    `;

    const resultsTitle = $('.results-container .card-title');
    resultsTitle.css({
        'display': 'flex',
        'justify-content': 'space-between',
        'align-items': 'center'
    });
    resultsTitle.append(batchControls);

    $('#open-batch-btn').on('click', function() {
        const batchSize = parseInt($('#batch-size').val()) || 10;
        const allLinks = $('#result-list .result-card a');
        
        if (allLinks.length === 0) {
            alert("No results to open. Generate links first!");
            return;
        }

        if (currentBatchIndex >= allLinks.length) {
            alert("All links have been opened!");
            return;
        }

        const endIndex = Math.min(currentBatchIndex + batchSize, allLinks.length);
        const linksToOpen = allLinks.slice(currentBatchIndex, endIndex).toArray();
        
        let processedCount = 0;

        function openNext(i) {
            if (i >= linksToOpen.length) {
                currentBatchIndex += processedCount;
                return;
            }

            const linkObj = $(linksToOpen[i]);
            const linkHref = linkObj.attr('href');
            const resultCard = linkObj.closest('.result-card');
            const lazyUrl = `lazyloader.html#${linkHref}`;
            
            const a = document.createElement('a');
            a.href = lazyUrl;
            a.target = '_blank';
            a.style.display = 'none';
            document.body.appendChild(a);

            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                ctrlKey: true,
                metaKey: true
            });

            const success = a.dispatchEvent(clickEvent);
            document.body.removeChild(a);

            if (success) {
                if (resultCard.find('.visited-indicator').length === 0) {
                    resultCard.append('<span class="visited-indicator">✔</span>');
                }
                processedCount++;
            }

            setTimeout(function() {
                openNext(i + 1);
            }, 400);
        }

        openNext(0);
    });

    $('#generate-links-btn').on('click', function() {
        currentBatchIndex = 0;
    });
});
