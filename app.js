(function(){

    function ready(fn){
        if(document.readyState === 'loading'){
            document.addEventListener('DOMContentLoaded', fn, {once:true});
        } else { fn(); }
    }

    function inRange(price, filter){
        switch(filter){
            case 'less15': return price < 15;
            case '15-30':  return price >= 15 && price <= 30;
            case 'more30': return price > 30;
            case 'all':
            case '':       return true;
            default:       return true;
        }
    }

    function renderCards(container, books){
        container.innerHTML = '';
        const frag = document.createDocumentFragment();
        books.forEach(b => {
            const art = document.createElement('article');
            art.className = 'book-item';
            art.id = String(b.id);
            art.dataset.price = String(b.price);

            const imgWrap = document.createElement('div');
            imgWrap.className = 'book-img-container';
            const img = document.createElement('img');
            img.alt = `${b.title} — cover`;
            img.src = b.imageUrl;
            imgWrap.appendChild(img);

            const descr = document.createElement('div');
            descr.className = 'book-item__descr';

            const h2 = document.createElement('h2');
            h2.className = 'book-item__name';
            h2.textContent = b.title;

            const author = document.createElement('p');
            author.className = 'book-item__author';
            author.textContent = b.author;

            const footer = document.createElement('div');
            footer.className = 'book-item_footer';

            const price = document.createElement('p');
            price.className = 'book-item__price';
            price.textContent = `${b.price.toFixed(2)} USD`;

            const link = document.createElement('a');
            link.className = 'btn btn-light btn-outline-dark btn-view';
            link.href = b.detailsUrl;
            link.setAttribute('role','button');
            link.textContent = 'View';

            footer.append(price, link);
            descr.append(h2, author, footer);
            art.append(imgWrap, descr);
            frag.appendChild(art);
        });
        container.appendChild(frag);
    }

    ready(function(){
        const input  = document.getElementById('bookSearch');
        const select = document.getElementById('priceFilter');
        const container = document.querySelector('.book-list-container');
        const empty = document.querySelector('.empty-state');

        if(!container){ console.error('No .book-list-container found'); return; }

        let ALL = [];
        function applyFilters(){
            const q  = (input?.value || '').trim().toLowerCase();
            const pf = (select?.value || '').trim();
            const filtered = ALL.filter(b => {
                const byName = !q || b.title.toLowerCase().includes(q);
                const byPrice = inRange(Number(b.price), pf);
                return byName && byPrice;
            });
            renderCards(container, filtered);
            if(empty) empty.hidden = filtered.length !== 0;
        }

        function init(data){
            ALL = Array.isArray(data) ? data : [];
            renderCards(container, ALL);
            if(input)  input.addEventListener('input', applyFilters);
            if(select) select.addEventListener('change', applyFilters);
            applyFilters();
        }


        fetch('books.json', {cache:'no-store'})
            .then(r => r.ok ? r.json() : Promise.reject(new Error('HTTP '+r.status)))
            .then(init)
            .catch(err => { console.warn('Using fallback data:', err);; });
    });
})();