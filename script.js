document.addEventListener('DOMContentLoaded', () => {

    // 1. Controle da Navbar Solid
    const navbar = document.getElementById('navbar');
    const isCatalogPage = window.location.pathname.includes('catalogo.html');
    
    if (!isCatalogPage) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
    }

    // 2. Menu Hamburguer (Navegação Mobile)
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 3. Observer para Animações ao Rolar a Página
    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => scrollObserver.observe(el));

    // ==========================================
    // LÓGICA DO CATÁLOGO DE PRODUTOS B2B
    // ==========================================
    const searchInput = document.getElementById('search-input');
    const filterFab = document.getElementById('filter-fab');
    const filterType = document.getElementById('filter-type');
    const parts = document.querySelectorAll('.product-card');
    const noResults = document.getElementById('no-results');

    // Captura filtro que vem da Home Page pela URL
    const urlParams = new URLSearchParams(window.location.search);
    const fabricanteURL = urlParams.get('fab');
    if (filterFab && fabricanteURL && fabricanteURL !== 'todos') {
        filterFab.value = fabricanteURL;
    }

    // Função de Filtragem
    function runFilters() {
        if (!searchInput) return;

        const term = searchInput.value.toLowerCase();
        const fab = filterFab.value;
        const type = filterType.value;
        let visibleCount = 0;

        parts.forEach(part => {
            const name = part.getAttribute('data-name').toLowerCase();
            const partFab = part.getAttribute('data-fab');
            const partType = part.getAttribute('data-type');

            const matchSearch = name.includes(term);
            const matchFab = (fab === 'todos' || partFab === fab);
            const matchType = (type === 'todos' || partType === type);

            if (matchSearch && matchFab && matchType) {
                part.style.display = 'flex'; // Mantém o flex do card
                visibleCount++;
            } else {
                part.style.display = 'none';
            }
        });

        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    // Event Listeners dos Filtros
    if (searchInput) {
        searchInput.addEventListener('input', runFilters);
        filterFab.addEventListener('change', runFilters);
        filterType.addEventListener('change', runFilters);
        runFilters(); // Roda ao carregar para pegar o filtro da URL
    }

    // ==========================================
    // MENU LATERAL MOBILE (FILTROS OFF-CANVAS)
    // ==========================================
    const btnToggleFilters = document.getElementById('btn-toggle-filters');
    const sidebarFilters = document.getElementById('sidebar-filters');
    const closeFilters = document.getElementById('close-filters');

    if (btnToggleFilters && sidebarFilters) {
        btnToggleFilters.addEventListener('click', () => {
            sidebarFilters.classList.add('active');
        });
        
        closeFilters.addEventListener('click', () => {
            sidebarFilters.classList.remove('active');
        });
    }

    // ==========================================
    // MODAL DE SOLICITAÇÃO DE COTAÇÃO
    // ==========================================
    const modal = document.getElementById('quote-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalPartName = document.getElementById('modal-part-name');
    const partInput = document.getElementById('part-input');
    const quoteForm = document.getElementById('quote-form');

    // Função para abrir modal (Pega dados do Card Pai)
    function openModal(partName, fabName) {
        modalPartName.textContent = `${partName} (${fabName})`;
        partInput.value = `${partName} - ${fabName}`;
        modal.classList.add('active');
    }

    // Fechar Modal
    if (closeModal) {
        closeModal.addEventListener('click', () => modal.classList.remove('active'));
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    // Atrelar clique dos botões CTA de cada peça
    document.querySelectorAll('.trigger-modal').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Se clicou direto no card ou no botão dentro do card, pega os dados do card (.product-card)
            const card = this.closest('.product-card') || this;
            const pName = card.getAttribute('data-name');
            const pFab = card.getAttribute('data-fab');
            openModal(pName, pFab);
        });
    });

    // Submissão do Formulário
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = quoteForm.querySelector('button');
            const originalText = btn.textContent;
            
            // Feedback de UX (Loading State)
            btn.textContent = 'Processando...';
            btn.style.opacity = '0.7';
            
            setTimeout(() => {
                alert(`Sucesso! Sua solicitação para: \n"${partInput.value}" \nFoi enviada para o time Separi.\nEntraremos em contato via telefone ou e-mail.`);
                modal.classList.remove('active');
                quoteForm.reset();
                btn.textContent = originalText;
                btn.style.opacity = '1';
            }, 1000);
        });
    }
});