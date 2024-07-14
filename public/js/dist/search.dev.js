/*

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const resultsDiv = document.getElementById('results');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const paginationDiv = document.getElementById('pagination');

    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const keyword = document.getElementById('keyword').value;
        if (!keyword) {
            alert('검색어를 입력해 주세요.');
            return;
        }

        await searchKeyword(keyword, 1);
    });

    async function searchKeyword(keyword, pageNo) {
        resultsDiv.innerHTML = '';
        paginationDiv.innerHTML = '';
        loadingSpinner.style.display = 'block';

        try {
            const response = await fetch('/search-keyword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keyword: keyword, pageNo: pageNo })
            });

            if (response.ok) {
                const data = await response.json();
                displayResults(data.response.body.items.item, data.response.body.totalCount);
            } else {
                resultsDiv.innerHTML = 'Error fetching data';
            }
        } catch (error) {
            console.error('Error:', error);
            resultsDiv.innerHTML = 'Error fetching data';
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    function displayResults(items, totalCount) {
        if (items.length > 0) {
            const list = document.createElement('ul');
            items.forEach(item => {
                const listItem = document.createElement('li');
                listItem.dataset.contentid = item.contentid;

                const img = document.createElement('img');
                img.src = item.firstimage || 'images/default-image.jpg';
                img.alt = item.title || 'No title';
                img.style.width = '100px';
                img.style.height = '100px';

                const itemInfo = document.createElement('div');
                itemInfo.className = 'item-info';
                const title = document.createElement('h3');
                title.textContent = item.title || 'No title';
                const addr = document.createElement('p');
                addr.textContent = item.addr1 || 'No address available';
                const description = document.createElement('p');
                description.textContent = item.overview || 'No description available';

                itemInfo.appendChild(title);
                itemInfo.appendChild(addr);
                itemInfo.appendChild(description);

                listItem.appendChild(img);
                listItem.appendChild(itemInfo);
                listItem.addEventListener('click', () => {
                    window.location.href = `details.html?contentId=${item.contentid}`;
                });

                list.appendChild(listItem);
            });
            resultsDiv.appendChild(list);
            displayPagination(totalCount);
        } else {
            resultsDiv.innerHTML = 'No results found';
        }
    }

    function displayPagination(totalCount) {
        const totalPages = Math.ceil(totalCount / 5);
        const maxPagesToShow = 5;
        let startPage = currentPage - Math.floor(maxPagesToShow / 2);
        startPage = Math.max(startPage, 1);
        let endPage = startPage + maxPagesToShow - 1;
        endPage = Math.min(endPage, totalPages);

        if (startPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.innerHTML = '&laquo;';
            prevButton.className = 'arrow';
            prevButton.addEventListener('click', () => {
                currentPage = startPage - 1;
                searchKeyword(currentKeyword, currentPage);
            });
            paginationDiv.appendChild(prevButton);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                searchKeyword(currentKeyword, currentPage);
            });
            if (i === currentPage) {
                pageButton.style.backgroundColor = '#0056b3';
            }
            paginationDiv.appendChild(pageButton);
        }

        if (endPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.innerHTML = '&raquo;';
            nextButton.className = 'arrow';
            nextButton.addEventListener('click', () => {
                currentPage = endPage + 1;
                searchKeyword(currentKeyword, currentPage);
            });
            paginationDiv.appendChild(nextButton);
        }
    }
});

*/
"use strict";
//# sourceMappingURL=search.dev.js.map
