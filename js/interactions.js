/* ==========================================================================
   ATELIER INTERACTIONS & MONOGRAPHIC LOGIC
   Filtering, Modal Studies, Material Inspector, Dispatch Forms
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProjectFilters();
  initMonographModals();
  initCommissionModal();
  initMaterialSwatches();
  initDispatchForms();
});

/* --------------------------------------------------------------------------
   Project Category Filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectItems = document.querySelectorAll('.project-item');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Update active state
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      const filter = pill.dataset.filter;

      projectItems.forEach(item => {
        const itemCategory = item.dataset.category;
        if (filter === 'all' || itemCategory === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'translateY(12px)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 40);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Spatial Monograph Dossier Data & Modal
   -------------------------------------------------------------------------- */
const monographData = {
  palazzo: {
    title: 'Palazzo Castiglione Restoration',
    category: 'Historic Adaptive Reuse / Lombardy, Italy — 2024',
    image: 'images/palazzo.jpg',
    description: 'A delicate dialogue between 18th-century classical Lombard architecture and contemporary monolithic interventions. Preserving centuries of lime plaster patination while carving modern spatial flow with monumental travertine bathtubs, brushed bronze hardware, and soft acoustic velvet drapery.',
    specs: [
      { key: 'Lead Architect', value: 'V. Marceau & Y. Kataria' },
      { key: 'Core Stone', value: 'Roman Tufa & Monolithic Travertine' },
      { key: 'Metalwork', value: 'Patinated Hand-Brushed Brass' },
      { key: 'Gross Footprint', value: '1,540 m² across 3 levels' },
      { key: 'Status', value: 'Realized & Commissioned 2024' },
      { key: 'Acoustic Strategy', value: 'Natural lime dampening & raw wool carpets' }
    ]
  },
  maison: {
    title: 'Maison de Cèdre',
    category: 'Minimalist Residential / Normandy, France — 2022',
    image: 'images/maison.jpg',
    description: 'Sunk silently against 15 ancient cedar groves in Normandy. The architecture celebrates elemental seclusion. A low-profile horizontal silhouette crafted from charred yakisugi wood and volcanic basalt slabs that visually dissolves into the mist and moss-covered granite surroundings.',
    specs: [
      { key: 'Topography', value: 'Deep pine depression with reflection pools' },
      { key: 'Structural Frame', value: 'Dark charred timber & basalt slabs' },
      { key: 'Glazing', value: 'Low-iron museum thermal panoramic panes' },
      { key: 'Total Area', value: '480 m² living footprint' },
      { key: 'Energy Model', value: 'Passive solar & geothermal rainwater loop' }
    ]
  },
  gallery: {
    title: 'Gallery Solarium & Archive',
    category: 'Museum & Heritage / Basel Downs, Switzerland — 2023',
    image: 'images/gallery.jpg',
    description: 'An architectural sanctuary designed for contemplative art appreciation. The dual-skin skylight diffuses harsh alpine light into a steady, shadowless luminous atmosphere that illuminates monolithic stone sculptures and preserves fragile archival manuscripts.',
    specs: [
      { key: 'Curatorial Focus', value: 'Lithic Sculptures & Rare Monograph Folios' },
      { key: 'Materiality', value: 'White Oak Joinery & Honed Quartzite' },
      { key: 'Total Footprint', value: '920 m² Gallery & Conservation Vaults' },
      { key: 'Luminance Control', value: 'Automated micro-louvered solarium ceiling' }
    ]
  },
  bruma: {
    title: 'The Bruma Hillside Estate',
    category: 'Landscape Architecture / Douro Valley, Portugal — 2023',
    image: 'images/bruma.jpg',
    description: 'Carved directly into the steep schist terraces of Portugal’s UNESCO-listed Douro Valley. The estate descends five levels following natural contours, utilizing subterranean thermal mass and native dry-stone masonry to achieve effortless off-grid climatic stability.',
    specs: [
      { key: 'Elevation', value: '410m Above Sea Level' },
      { key: 'Thermal Performance', value: 'Passive Geo-Thermal Zero-Carbon' },
      { key: 'Living Wing', value: '640 m²' },
      { key: 'Agrarian Scope', value: 'Schist wine caves & 12-hectare olive terraces' }
    ]
  }
};

function initMonographModals() {
  const modal = document.getElementById('monograph-modal');
  const modalBody = document.getElementById('monograph-modal-body');
  const closeBtn = document.getElementById('modal-close-btn');
  const triggers = document.querySelectorAll('.open-monograph-trigger');

  function openMonograph(projectId) {
    const data = monographData[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      <div class="project-category-tag">${data.category}</div>
      <h2 id="modal-project-title" style="font-size: 2.4rem; margin-bottom: 1rem; color: var(--text-ink);">${data.title}</h2>
      
      <div class="img-frame" style="aspect-ratio: 16/9; margin-bottom: 1.5rem; border-radius: 4px;">
        <img src="${data.image}" alt="${data.title}">
      </div>

      <p style="font-size: 1rem; line-height: 1.8; color: var(--text-secondary); margin-bottom: 1.75rem;">
        ${data.description}
      </p>

      <h4 style="font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">
        Technical & Spatial Dossier
      </h4>

      <div class="specs-mini-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 2rem;">
        ${data.specs.map(s => `
          <div class="spec-mini-item">
            <div class="spec-k">${s.key}</div>
            <div class="spec-v">${s.value}</div>
          </div>
        `).join('')}
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <button class="btn btn-burgundy" onclick="triggerCommissionForProject('${data.title}')">
          <span>Inquire Regarding Similar Program</span>
          <span class="arrow">→</span>
        </button>
        <button class="btn btn-cream" onclick="closeModal()">
          <span>Return to Folio</span>
        </button>
      </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  window.closeModal = function() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const proj = btn.dataset.project;
      openMonograph(proj);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   Commission & Colloquy Modal
   -------------------------------------------------------------------------- */
function initCommissionModal() {
  const modal = document.getElementById('inquiry-modal');
  const closeBtn = document.getElementById('inquiry-close-btn');
  const openBtns = [
    document.getElementById('open-commission-btn'),
    document.getElementById('colloquy-btn'),
    document.getElementById('monograph-request-btn')
  ].filter(Boolean);

  function openInquiry(prefillTopic) {
    if (prefillTopic) {
      const notesField = document.getElementById('patron-notes');
      if (notesField) notesField.value = `Regarding Architectural Program: ${prefillTopic}`;
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeInquiry() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.triggerCommissionForProject = function(projectTitle) {
    window.closeModal();
    setTimeout(() => {
      openInquiry(projectTitle);
    }, 250);
  };

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openInquiry();
    });
  });

  closeBtn.addEventListener('click', closeInquiry);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeInquiry();
  });

  const form = document.getElementById('colloquy-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('patron-name').value;
      closeInquiry();
      form.reset();
      showToast(`Thank you, ${name}. Your commission inquiry has been privately transmitted to the atelier partners.`);
    });
  }
}

/* --------------------------------------------------------------------------
   Material Swatches Tactile Inspector
   -------------------------------------------------------------------------- */
function initMaterialSwatches() {
  const swatches = document.querySelectorAll('.swatch-card');
  const materialDescriptions = {
    travertine: 'Roman Travertine: Honed from Tivoli quarries. Micro-cavities create organic acoustic absorption and tactile mineral warmth.',
    brass: 'Patinated Brass: Unlacquered alloy that absorbs ambient temperature and patinates gradually with human touch and weather.',
    yakisugi: 'Charred Yakisugi: Shou Sugi Ban surface carbonization yielding insect resistance and velvety charcoal light absorption.',
    velvet: 'Burgundy Velvet: Heritage Lyon loom woven textile providing 0.7 NRC acoustic dampening in stone sanctuaries.',
    bronze: 'Poured Cast Bronze: Molten bronze cast in sand beds, providing extreme tensile permanence and architectural weight.'
  };

  swatches.forEach(card => {
    card.addEventListener('click', () => {
      const type = card.dataset.swatch;
      if (materialDescriptions[type]) {
        showToast(materialDescriptions[type]);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Dispatch Newsletter & Toast Notice
   -------------------------------------------------------------------------- */
function initDispatchForms() {
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const email = input.value;
      input.value = '';
      showToast(`Your dispatch request for ${email} has been entered into the monograph gazette registry.`);
    });
  }
}

function showToast(message) {
  const toast = document.getElementById('toast-notice');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
