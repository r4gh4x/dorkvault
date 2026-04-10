$(document).ready(function() {

    // Load dorks from file into textarea
    $('#dorks-file').on('change', function() {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#dorks-list').val(e.target.result);
        };
        reader.readAsText(file);
    });

    $('#generate-links-btn').on('click', function() {
        const searchEngine = $('#search-engine').val();
        const dorkFormat = $('input[name="dork-format"]:checked').val();
        const singleDork = $('#dork').val().trim();
        const dorksListText = $('#dorks-list').val().trim();
        const targetsFile = $('#targets-file')[0].files[0];

        // Determine dorks to use: file dorks take priority over single dork
        let dorks = [];
        if (dorksListText) {
            dorks = dorksListText.split('\n').filter(d => d.trim() !== '');
        } else if (singleDork) {
            dorks = [singleDork];
        }

        if (dorks.length === 0) {
            alert('Please enter a dork or load a dorks file.');
            return;
        }

        if (!targetsFile) {
            alert('Please select a targets file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const targets = e.target.result.split('\n').filter(target => target.trim() !== '');
            const resultList = $('#result-list');
            resultList.empty();

            targets.forEach(target => {
                let currentTarget = target.trim();

                dorks.forEach(dork => {
                    let currentDork = dork.trim();

                    let formattedDork;
                    if (dorkFormat === 'site:target') {
                        formattedDork = `site:${currentTarget} ${currentDork}`;
                    } else {
                        formattedDork = `"${currentTarget}" ${currentDork}`;
                    }

                    let searchUrl;

                    switch (searchEngine) {
                        case 'google':
                            searchUrl = `https://www.google.com/search?q=${encodeURIComponent(formattedDork)}`;
                            break;
                        case 'bing':
                            searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(formattedDork)}`;
                            break;
                        case 'yahoo':
                            searchUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(formattedDork)}`;
                            break;
                    }

                    const resultCard = `
                        <div class="result-card">
                            <a href="${searchUrl}" target="_blank">${formattedDork}</a>
                        </div>
                    `;
                    resultList.append(resultCard);
                });
            });
        };
        reader.readAsText(targetsFile);
    });

    // Make the entire card clickable
    $('#result-list').on('click', '.result-card', function(e) {
        const link = $(this).find('a');
        const href = link.attr('href');
        
        // If the user clicked the link text itself, standard browser behavior works.
        // If they clicked the empty space in the card, we open it manually.
        if (!$(e.target).is('a')) {
            window.open(href, '_blank');
        }

        // Add tick mark
        if ($(this).find('.visited-indicator').length === 0) {
            $(this).append('<span class="visited-indicator">✔</span>');
        }
    });
});