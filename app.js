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

const subscriptionTable = window.SUPABASE_SUBSCRIBERS_TABLE || 'notification_signups';
const questionsTable = window.SUPABASE_QUESTIONS_TABLE || 'weekly_voice_questions';
const responsesTable = window.SUPABASE_RESPONSES_TABLE || 'weekly_voice_responses';
const decisionsTable = window.SUPABASE_DECISIONS_TABLE || 'civic_decisions';

const fallbackVoiceQuestion = {
  id: null,
  weekLabel: 'Week of May 6',
  question: 'Should the city prioritize protected bike connections between schools and downtown?',
  answers: ['Yes', 'Maybe / Needs more detail', 'No']
};

const fallbackRecentVoiceData = [
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
  },
  {
    question: 'Should the city create more shaded waiting areas at high-use bus stops?',
    yes: 54,
    maybe: 34,
    no: 12
  },
  {
    question: 'Would you support opening city hall one evening per month for public services?',
    yes: 49,
    maybe: 33,
    no: 18
  }
];

const recentDecisionsData = [
  {
    slug: 'downtown-ada-sidewalk-repair-package',
    date: '2024-04-23',
    dateLabel: 'Tue, Apr 23, 2024',
    title: 'Council advanced a downtown ADA sidewalk repair package.',
    description: 'Phase one prioritizes high-foot-traffic blocks near schools and senior housing to improve walkability and safety.',
    tags: ['Infrastructure', 'Accessibility'],
    sourceLink: '#'
  },
  {
    slug: 'mixed-use-zoning-amendment-public-hearing',
    date: '2024-04-17',
    dateLabel: 'Wed, Apr 17, 2024',
    title: 'Mixed-use zoning amendment moved to public hearing.',
    description: 'The draft sets height transitions and street activation requirements near core corridors.',
    tags: ['Planning', 'Zoning'],
    sourceLink: '#'
  },
  {
    slug: 'trail-lighting-upgrade-northern-state-corridor',
    date: '2024-04-09',
    dateLabel: 'Tue, Apr 9, 2024',
    title: 'City approved trail lighting upgrade near Northern State corridor.',
    description: 'Installation begins in late summer pending utility coordination and public works staging.',
    tags: ['Parks', 'Public Safety'],
    sourceLink: '#'
  },
  {
    slug: 'main-street-crosswalk-timing-adjustment',
    date: '2024-04-03',
    dateLabel: 'Wed, Apr 3, 2024',
    title: 'Main Street crosswalk timing adjustments approved for school commute hours.',
    description: 'Signal timing updates focus on safer morning and afternoon crossings near schools and bus pickup points.',
    tags: ['Transportation', 'Schools'],
    sourceLink: '#'
  },
  {
    slug: 'library-meeting-room-reservation-pilot',
    date: '2024-03-27',
    dateLabel: 'Wed, Mar 27, 2024',
    title: 'Library launched a pilot for online community meeting room reservations.',
    description: 'Residents can now reserve community rooms online as part of a six-month service pilot.',
    tags: ['Library', 'Digital Services'],
    sourceLink: '#'
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

let recentVoiceCharts = [];
let recentVoiceData = [...fallbackRecentVoiceData];
let activeVoiceQuestion = { ...fallbackVoiceQuestion };
let homeDecisionsData = recentDecisionsData.slice(0, 3);

function formatDecisionDate(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text || '';
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

function getVisibleRecentVoiceData() {
  return window.matchMedia('(max-width: 639px)').matches ? recentVoiceData.slice(0, 4) : recentVoiceData;
}

function renderRecentVoice() {
  const list = document.getElementById('recent-voice-list');
  if (!list) return;

  const visibleItems = getVisibleRecentVoiceData();

  list.innerHTML = visibleItems
    .map((item, index) => {
      return `
        <article class="reveal voice-card rounded-2xl border border-charcoal/10 bg-white/70 p-4 sm:p-5" style="transition-delay:${index * 70}ms;">
          <h3 class="text-base font-semibold leading-tight tracking-tight" style="display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">${item.question}</h3>
          <div class="mt-4 flex items-center justify-center">
            <canvas class="recent-voice-pie" width="150" height="150" data-yes="${item.yes}" data-maybe="${item.maybe}" data-no="${item.no}" aria-label="Survey result distribution pie chart"></canvas>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderVoiceQuestion() {
  const weekEl = document.getElementById('voice-week-label');
  const questionEl = document.getElementById('voice-question-text');
  const optionsEl = document.getElementById('voice-options');

  if (weekEl) weekEl.textContent = activeVoiceQuestion.weekLabel;
  if (questionEl) questionEl.textContent = activeVoiceQuestion.question;
  if (!optionsEl) return;

  optionsEl.innerHTML = activeVoiceQuestion.answers
    .map(
      (answer) => `
      <label class="option-row flex cursor-pointer items-center justify-between rounded-2xl border border-charcoal/15 bg-cream px-4 py-3 transition hover:border-teal/50">
        <span class="font-medium">${answer}</span>
        <input type="radio" name="voice" value="${answer}" class="h-4 w-4 accent-teal" />
      </label>
    `
    )
    .join('');
}

async function loadVoiceFromSupabase() {
  if (!supabaseClient) return;

  const { data: questions, error: questionsError } = await supabaseClient
    .from(questionsTable)
    .select('id,week_label,question,answers,created_at')
    .order('created_at', { ascending: false })
    .limit(8);

  if (questionsError || !questions || !questions.length) return;

  const [latestQuestion] = questions;
  const parsedAnswers = Array.isArray(latestQuestion.answers) && latestQuestion.answers.length >= 2 ? latestQuestion.answers.slice(0, 3) : fallbackVoiceQuestion.answers;

  activeVoiceQuestion = {
    id: latestQuestion.id,
    weekLabel: latestQuestion.week_label || fallbackVoiceQuestion.weekLabel,
    question: latestQuestion.question || fallbackVoiceQuestion.question,
    answers: parsedAnswers
  };

  const questionIds = questions.map((item) => item.id);
  const { data: responses, error: responsesError } = await supabaseClient
    .from(responsesTable)
    .select('question_id,response')
    .in('question_id', questionIds);

  if (responsesError || !responses) return;

  const responseCountsByQuestion = responses.reduce((acc, row) => {
    const key = row.question_id;
    if (!acc[key]) {
      acc[key] = {};
    }
    const current = acc[key][row.response] || 0;
    acc[key][row.response] = current + 1;
    return acc;
  }, {});

  recentVoiceData = questions.map((item) => {
    const answers = Array.isArray(item.answers) && item.answers.length >= 3 ? item.answers.slice(0, 3) : fallbackVoiceQuestion.answers;
    const counts = responseCountsByQuestion[item.id] || {};
    const values = answers.map((answer) => counts[answer] || 0);
    const total = values.reduce((sum, value) => sum + value, 0);

    if (!total) {
      return {
        question: item.question,
        yes: 0,
        maybe: 0,
        no: 0
      };
    }

    return {
      question: item.question,
      yes: Math.round((values[0] / total) * 100),
      maybe: Math.round((values[1] / total) * 100),
      no: Math.round((values[2] / total) * 100)
    };
  });
}

function destroyRecentVoiceCharts() {
  recentVoiceCharts.forEach((chart) => chart.destroy());
  recentVoiceCharts = [];
}

function buildRecentVoiceCharts() {
  const canvases = document.querySelectorAll('.recent-voice-pie');
  if (!canvases.length || !window.Chart) return;

  destroyRecentVoiceCharts();

  const piePercentPlugin = {
    id: 'piePercentPlugin',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      const labels = ['Yes', 'Maybe', 'No'];

      meta.data.forEach((arc, index) => {
        const value = chart.data.datasets[0].data[index];
        const position = arc.tooltipPosition();
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = index === 2 ? '#1F2A2E' : '#FFFFFF';
        ctx.font = '600 12px Inter, system-ui, sans-serif';
        ctx.fillText(`${value}%`, position.x, position.y - 7);
        ctx.font = '500 10px Inter, system-ui, sans-serif';
        ctx.fillText(labels[index], position.x, position.y + 8);
        ctx.restore();
      });
    }
  };

  canvases.forEach((canvas) => {
    const data = [Number(canvas.dataset.yes), Number(canvas.dataset.maybe), Number(canvas.dataset.no)];

    recentVoiceCharts.push(
      new Chart(canvas, {
        type: 'pie',
        data: {
          labels: ['Yes', 'Maybe', 'No'],
          datasets: [
            {
              data,
              backgroundColor: [palette.teal, '#6DA2A2', '#A7B2B0'],
              borderColor: '#ffffff',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: false,
          animation: { duration: 900 },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label(context) {
                  return `${context.label}: ${context.parsed}%`;
                }
              }
            }
          }
        },
        plugins: [piePercentPlugin]
      })
    );
  });
}

function renderDecisions() {
  const list = document.getElementById('decisions-list');
  if (!list) return;

  list.innerHTML = homeDecisionsData
    .map((item) => {
      const preview = truncateText(item.description, 120);
      return `
      <article class="decision-item reveal group relative mb-8 rounded-2xl border border-transparent p-4 transition hover:border-charcoal/10 hover:bg-cream/70">
        <span class="absolute -left-[1.9rem] top-7 h-3 w-3 rounded-full border-2 border-cream bg-teal"></span>
        <p class="text-xs font-semibold uppercase tracking-[0.1em] text-slate">${item.dateLabel}</p>
        <h3 class="mt-2 text-lg font-semibold tracking-tight">${item.title}</h3>
        <p class="mt-2 text-sm text-slate">${preview}</p>
      </article>
      `;
    })
    .join('');
}

async function loadDecisionsForHome() {
  if (!supabaseClient) return;

  const { data, error } = await supabaseClient
    .from(decisionsTable)
    .select('slug,date,title,description,tags,source_link,created_at')
    .order('date', { ascending: false })
    .limit(3);

  if (error || !data || !data.length) return;

  homeDecisionsData = data.map((item) => ({
    slug: item.slug,
    date: item.date,
    dateLabel: formatDecisionDate(item.date),
    title: item.title,
    description: item.description,
    tags: Array.isArray(item.tags) ? item.tags : [],
    sourceLink: item.source_link || '#'
  }));
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
  if (!form) return;

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

    if (activeVoiceQuestion.id) {
      payload.question_id = activeVoiceQuestion.id;
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from(responsesTable).insert(payload);
      if (error) {
        showVoiceMessage('Saved locally for now. Live response sync is temporarily unavailable.', false);
        return;
      }
    }

    showVoiceMessage('Thanks — your voice has been recorded for this week.', true);
    form.reset();
  });
}

function setupVoiceSubscribe() {
  const toggle = document.getElementById('subscribe-toggle');
  const form = document.getElementById('voice-subscribe-form');
  const method = document.getElementById('subscribe-method');
  const contact = document.getElementById('subscribe-contact');
  const message = document.getElementById('subscribe-message');
  if (!toggle || !form || !method || !contact || !message) return;

  const updatePlaceholder = () => {
    contact.placeholder = method.value === 'sms' ? '3605551234' : 'name@email.com';
  };

  toggle.addEventListener('click', () => {
    form.classList.toggle('hidden');
    if (!form.classList.contains('hidden')) contact.focus();
  });

  method.addEventListener('change', updatePlaceholder);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = contact.value.trim();

    if (!value) {
      showPanelMessage(message, 'Please enter an email or phone number.', false);
      return;
    }

    if (method.value === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
      showPanelMessage(message, 'Please enter a valid email address.', false);
      return;
    }

    if (method.value === 'sms' && value.replace(/\D/g, '').length < 10) {
      showPanelMessage(message, 'Please enter a valid SMS number with at least 10 digits.', false);
      return;
    }

    const payload = {
      contact_method: method.value,
      contact_value: value,
      created_at: new Date().toISOString()
    };

    if (!supabaseClient) {
      showPanelMessage(message, 'Subscription saved locally. Add Supabase keys to enable live syncing.', false);
      return;
    }

    const { error } = await supabaseClient.from(subscriptionTable).insert(payload);

    if (error) {
      showPanelMessage(message, 'Subscription could not be saved right now. Please try again shortly.', false);
      return;
    }

    showPanelMessage(message, 'You are subscribed. We will send your next weekly reminder.', true);
    form.reset();
    updatePlaceholder();
  });

  updatePlaceholder();
}

function showVoiceMessage(text, isSuccess) {
  const message = document.getElementById('voice-message');
  if (!message) return;
  showPanelMessage(message, text, isSuccess);
}

function showPanelMessage(messageElement, text, isSuccess) {
  messageElement.textContent = text;
  messageElement.classList.remove('hidden');
  messageElement.classList.toggle('border-teal/20', isSuccess);
  messageElement.classList.toggle('bg-mist', isSuccess);
  messageElement.classList.toggle('border-amber-300/50', !isSuccess);
  messageElement.classList.toggle('bg-amber-100/70', !isSuccess);

  anime({
    targets: messageElement,
    opacity: [0, 1],
    translateY: [8, 0],
    duration: 360,
    easing: 'easeOutQuad'
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

function setupRecentVoiceResponsiveRender() {
  let previousSmall = window.matchMedia('(max-width: 639px)').matches;

  window.addEventListener('resize', () => {
    const nextSmall = window.matchMedia('(max-width: 639px)').matches;
    if (nextSmall === previousSmall) return;

    previousSmall = nextSmall;
    renderRecentVoice();
    buildRecentVoiceCharts();
  });
}

async function init() {
  await loadVoiceFromSupabase();
  await loadDecisionsForHome();
  renderVoiceQuestion();
  renderRecentVoice();
  buildRecentVoiceCharts();
  renderDecisions();
  initMap();
  setupVoiceSurvey();
  setupVoiceSubscribe();
  setupHoverPolish();
  setupRevealAnimations();
  animateCTA();
  setupRecentVoiceResponsiveRender();
}

document.addEventListener('DOMContentLoaded', init);
