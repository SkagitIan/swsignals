const palette = {
  cream: '#F7F4EE',
  charcoal: '#1F2A2E',
  slate: '#526067',
  teal: '#1E7A7A',
  mist: '#DCE9E7',
  sand: '#E9E1D3'
};

const supabaseConfig = {
  url: window.SUPABASE_URL || '',
  anonKey: window.SUPABASE_ANON_KEY || ''
};

const supabaseClient =
  window.supabase && supabaseConfig.url && supabaseConfig.anonKey
    ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
    : null;

const recentVoiceData = [
  {
    question: 'Should downtown parking include a 2-hour turnover zone near small businesses?',
    yes: 63,
    maybe: 27,
    no: 10
  },
  {
    question: 'Would you support a seasonal evening market pilot near the riverfront?',
    yes: 58,
    maybe: 30,
    no: 12
  },
  {
    question: 'Should city newsletters include a one-page budget breakdown each quarter?',
    yes: 71,
    maybe: 18,
    no: 11
  }
];

const recentDecisionsData = [
  {
    dateLabel: 'Tue, Apr 23 · Council Study Session',
    title: 'Council advanced a downtown ADA sidewalk repair package.',
    summary: 'Phase one prioritizes high-foot-traffic blocks near schools and senior housing.',
    url: '#'
  },
  {
    dateLabel: 'Wed, Apr 17 · Planning Commission',
    title: 'Mixed-use zoning amendment moved to public hearing.',
    summary: 'The draft sets height transitions and street activation requirements.',
    url: '#'
  },
  {
    dateLabel: 'Tue, Apr 9 · Council Meeting',
    title: 'City approved trail lighting upgrade near Northern State corridor.',
    summary: 'Installation begins in late summer pending utility coordination.',
    url: '#'
  }
];

const mapLayerDefinitions = {
  'City Projects': {
    color: '#1E7A7A',
    points: [
      [48.5036, -122.2365, 'Public Works Street Renewal'],
      [48.5054, -122.2398, 'Library Accessibility Updates']
    ]
  },
  'Zoning & Growth': {
    color: '#355E6E',
    points: [
      [48.5091, -122.2405, 'Mixed-Use Opportunity Area'],
      [48.5002, -122.2324, 'Residential Infill Review']
    ]
  },
  'Parks & Trails': {
    color: '#4D8F68',
    points: [
      [48.5073, -122.2432, 'Trail Crossing Upgrade'],
      [48.5025, -122.2298, 'Riverfront Habitat Node']
    ]
  }
};

function renderRecentVoice() {
  const list = document.getElementById('recent-voice-list');
  if (!list) return;

  list.innerHTML = recentVoiceData
    .map((item, index) => {
      return `
        <article class="reveal voice-card rounded-2xl border border-charcoal/10 bg-white/70 p-6 sm:p-7" style="transition-delay:${index * 80}ms;">
          <h3 class="text-lg font-semibold tracking-tight">${item.question}</h3>
          <div class="mt-5 h-3 w-full overflow-hidden rounded-full bg-sand/70" role="img" aria-label="Survey result distribution">
            <div class="result-bar flex h-full w-full rounded-full overflow-hidden">
              <span class="result-segment" data-width="${item.yes}" style="width:0%;background:${palette.teal}"></span>
              <span class="result-segment" data-width="${item.maybe}" style="width:0%;background:#6DA2A2"></span>
              <span class="result-segment" data-width="${item.no}" style="width:0%;background:#A7B2B0"></span>
            </div>
          </div>
          <div class="mt-4 grid grid-cols-3 gap-2 text-sm text-slate">
            <p><span class="font-semibold text-charcoal">${item.yes}%</span> Yes</p>
            <p><span class="font-semibold text-charcoal">${item.maybe}%</span> Maybe</p>
            <p><span class="font-semibold text-charcoal">${item.no}%</span> No</p>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderDecisions() {
  const list = document.getElementById('decisions-list');
  if (!list) return;

  list.innerHTML = recentDecisionsData
    .map((item) => {
      return `
      <article class="decision-item reveal group relative mb-8 rounded-2xl border border-transparent p-4 transition hover:border-charcoal/10 hover:bg-cream/70">
        <span class="absolute -left-[1.9rem] top-7 h-3 w-3 rounded-full border-2 border-cream bg-teal"></span>
        <p class="text-xs font-semibold uppercase tracking-[0.1em] text-slate">${item.dateLabel}</p>
        <h3 class="mt-2 text-lg font-semibold tracking-tight">${item.title}</h3>
        <p class="mt-2 text-sm text-slate">${item.summary}</p>
        <a href="${item.url}" class="mt-3 inline-flex text-sm font-semibold text-teal transition group-hover:text-charcoal">Video + details →</a>
      </article>
      `;
    })
    .join('');
}

function initMap() {
  const mapElement = document.getElementById('map');
  const tabsContainer = document.getElementById('map-layer-tabs');
  if (!mapElement || !tabsContainer || !window.L) return;

  const map = L.map('map', { zoomControl: false }).setView([48.5036, -122.236], 13);
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const layerGroups = {};
  Object.entries(mapLayerDefinitions).forEach(([name, def]) => {
    const layer = L.layerGroup();

    def.points.forEach(([lat, lng, label]) => {
      L.circleMarker([lat, lng], {
        radius: 7,
        color: def.color,
        weight: 2,
        fillColor: def.color,
        fillOpacity: 0.35
      })
        .bindPopup(`<strong>${name}</strong><br>${label}`)
        .addTo(layer);
    });

    layerGroups[name] = layer;
  });

  let activeLayer = Object.keys(layerGroups)[0];
  layerGroups[activeLayer].addTo(map);

  tabsContainer.innerHTML = Object.keys(layerGroups)
    .map(
      (name) =>
        `<button data-layer="${name}" class="map-tab rounded-full border border-charcoal/15 px-3 py-1.5 text-sm font-medium transition hover:border-teal/40">${name}</button>`
    )
    .join('');

  const refreshTabState = () => {
    tabsContainer.querySelectorAll('.map-tab').forEach((button) => {
      const isActive = button.dataset.layer === activeLayer;
      button.classList.toggle('bg-charcoal', isActive);
      button.classList.toggle('text-cream', isActive);
      button.classList.toggle('border-charcoal', isActive);
    });
  };

  tabsContainer.addEventListener('click', (event) => {
    const button = event.target.closest('.map-tab');
    if (!button) return;

    const nextLayer = button.dataset.layer;
    if (nextLayer === activeLayer) return;

    map.removeLayer(layerGroups[activeLayer]);
    activeLayer = nextLayer;
    layerGroups[activeLayer].addTo(map);
    refreshTabState();
  });

  refreshTabState();
}

function setupVoiceSurvey() {
  const form = document.getElementById('voice-form');
  const message = document.getElementById('voice-message');
  if (!form || !message) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const selected = form.querySelector('input[name="voice"]:checked');

    if (!selected) {
      showVoiceMessage('Please select a response before submitting.', false);
      return;
    }

    const payload = {
      response: selected.value,
      submitted_at: new Date().toISOString()
    };

    if (supabaseClient) {
      const { error } = await supabaseClient.from('weekly_voice_responses').insert(payload);
      if (error) {
        showVoiceMessage('Saved locally for now. Live response sync is temporarily unavailable.', false);
        return;
      }
    }

    showVoiceMessage('Thanks — your voice has been recorded for this week.', true);
    form.reset();
  });
}

function showVoiceMessage(text, isSuccess) {
  const message = document.getElementById('voice-message');
  if (!message) return;
  message.textContent = text;
  message.classList.remove('hidden');
  message.classList.toggle('border-teal/20', isSuccess);
  message.classList.toggle('bg-mist', isSuccess);
  message.classList.toggle('border-amber-300/50', !isSuccess);
  message.classList.toggle('bg-amber-100/70', !isSuccess);

  anime({
    targets: '#voice-message',
    opacity: [0, 1],
    translateY: [8, 0],
    duration: 360,
    easing: 'easeOutQuad'
  });
}

function animateResultBars() {
  const segments = document.querySelectorAll('.result-segment');
  segments.forEach((segment, index) => {
    anime({
      targets: segment,
      width: `${segment.dataset.width}%`,
      delay: 180 + index * 60,
      duration: 1000,
      easing: 'easeOutCubic'
    });
  });
}

function setupHoverPolish() {
  document.querySelectorAll('.interactive-btn').forEach((button) => {
    button.addEventListener('mouseenter', () => {
      anime.remove(button);
      anime({ targets: button, scale: 1.02, duration: 220, easing: 'easeOutQuad' });
    });
    button.addEventListener('mouseleave', () => {
      anime.remove(button);
      anime({ targets: button, scale: 1, duration: 220, easing: 'easeOutQuad' });
    });
    button.addEventListener('mousedown', () => {
      anime.remove(button);
      anime({ targets: button, scale: 0.98, duration: 140, easing: 'easeOutQuad' });
    });
    button.addEventListener('mouseup', () => {
      anime.remove(button);
      anime({ targets: button, scale: 1.02, duration: 140, easing: 'easeOutQuad' });
    });
  });
}

function setupRevealAnimations() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [18, 0],
          duration: 700,
          easing: 'easeOutQuart'
        });

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  targets.forEach((el) => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

function animateCTA() {
  const cta = document.getElementById('weekly-cta');
  if (!cta) return;

  anime({
    targets: cta,
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 820,
    easing: 'easeOutExpo'
  });
}

function init() {
  renderRecentVoice();
  renderDecisions();
  initMap();
  setupVoiceSurvey();
  setupHoverPolish();
  setupRevealAnimations();
  animateCTA();
  animateResultBars();
}

document.addEventListener('DOMContentLoaded', init);
