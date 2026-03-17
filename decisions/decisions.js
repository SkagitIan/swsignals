const supabaseConfig = {
  url: window.SUPABASE_URL || '',
  anonKey: window.SUPABASE_ANON_KEY || ''
};

const supabaseClient =
  window.supabase && supabaseConfig.url && supabaseConfig.anonKey
    ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
    : null;

const decisionsTable = window.SUPABASE_DECISIONS_TABLE || 'civic_decisions';

const fallbackDecisions = [
  {
    slug: 'downtown-ada-sidewalk-repair-package',
    date: '2024-04-23',
    title: 'Council advanced a downtown ADA sidewalk repair package.',
    description:
      'Phase one prioritizes high-foot-traffic blocks near schools and senior housing to improve walkability and safety before winter weather.',
    tags: ['Infrastructure', 'Accessibility'],
    sourceLink: 'https://example.com/decision/ada-sidewalk-repair'
  },
  {
    slug: 'mixed-use-zoning-amendment-public-hearing',
    date: '2024-04-17',
    title: 'Mixed-use zoning amendment moved to public hearing.',
    description:
      'The draft sets height transitions, active street frontage, and design requirements near core corridors ahead of a formal public hearing.',
    tags: ['Planning', 'Zoning'],
    sourceLink: 'https://example.com/decision/mixed-use-zoning'
  },
  {
    slug: 'trail-lighting-upgrade-northern-state-corridor',
    date: '2024-04-09',
    title: 'City approved trail lighting upgrade near Northern State corridor.',
    description:
      'Installation is expected in late summer and is coordinated with utility scheduling to improve evening visibility for trail users.',
    tags: ['Parks', 'Public Safety'],
    sourceLink: 'https://example.com/decision/trail-lighting'
  },
  {
    slug: 'main-street-crosswalk-timing-adjustment',
    date: '2024-04-03',
    title: 'Main Street crosswalk timing adjustments approved for school commute hours.',
    description:
      'Signal timing changes add longer crossing windows during morning drop-off and afternoon pickup periods around school routes.',
    tags: ['Transportation', 'Schools'],
    sourceLink: 'https://example.com/decision/crosswalk-timing'
  },
  {
    slug: 'library-meeting-room-reservation-pilot',
    date: '2024-03-27',
    title: 'Library launched a pilot for online community meeting room reservations.',
    description:
      'Residents can reserve library meeting rooms online during a six-month pilot designed to simplify bookings and improve room usage visibility.',
    tags: ['Library', 'Digital Services'],
    sourceLink: 'https://example.com/decision/library-room-pilot'
  }
];

const badgeClasses = [
  'bg-teal/10 text-teal border-teal/30',
  'bg-amber-100 text-amber-800 border-amber-300/70',
  'bg-sky-100 text-sky-700 border-sky-300/80',
  'bg-emerald-100 text-emerald-700 border-emerald-300/80',
  'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300/80'
];

let decisions = [...fallbackDecisions];

function formatDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getBadgeClass(index) {
  return badgeClasses[index % badgeClasses.length];
}

function renderTagBadges(tags) {
  return tags
    .map((tag, index) => `<span class="rounded-full border px-2.5 py-1 text-xs font-semibold ${getBadgeClass(index)}">${tag}</span>`)
    .join('');
}

function renderDecisions() {
  const timeline = document.getElementById('decisions-timeline');
  if (!timeline) return;

  timeline.innerHTML = decisions
    .map(
      (item) => `
      <article class="group relative mb-8 rounded-2xl border border-transparent bg-cream/70 p-4 transition hover:border-charcoal/10 hover:bg-cream">
        <span class="absolute -left-[1.7rem] top-6 h-3 w-3 rounded-full border-2 border-cream bg-teal"></span>
        <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate">${formatDate(item.date)}</p>
        <h2 class="mt-2 text-lg font-semibold tracking-tight">${item.title}</h2>
        <p class="mt-2 text-sm leading-6 text-slate">${item.description}</p>
        <div class="mt-3 flex flex-wrap gap-2">${renderTagBadges(item.tags || [])}</div>
        <button class="mt-4 inline-flex text-sm font-semibold text-teal hover:text-charcoal" data-slug="${item.slug}" type="button">
          Open details
        </button>
      </article>
    `
    )
    .join('');
}

function openModal(item) {
  const modal = document.getElementById('decision-modal');
  if (!modal) return;

  document.getElementById('modal-title').textContent = item.title;
  document.getElementById('modal-date').textContent = formatDate(item.date);
  document.getElementById('modal-description').textContent = item.description;
  document.getElementById('modal-tags').innerHTML = renderTagBadges(item.tags || []);

  const source = document.getElementById('modal-source');
  source.href = item.sourceLink || '#';

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal() {
  const modal = document.getElementById('decision-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function setupModalHandlers() {
  const timeline = document.getElementById('decisions-timeline');
  const closeButton = document.getElementById('modal-close');
  const modal = document.getElementById('decision-modal');

  if (timeline) {
    timeline.addEventListener('click', (event) => {
      const button = event.target.closest('[data-slug]');
      if (!button) return;

      const selected = decisions.find((item) => item.slug === button.dataset.slug);
      if (!selected) return;
      openModal(selected);
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
}

async function loadDecisionsFromSupabase() {
  if (!supabaseClient) return;

  const { data, error } = await supabaseClient
    .from(decisionsTable)
    .select('slug,date,title,description,tags,source_link')
    .order('date', { ascending: false });

  if (error || !data || !data.length) return;

  decisions = data.map((item) => ({
    slug: item.slug,
    date: item.date,
    title: item.title,
    description: item.description,
    tags: Array.isArray(item.tags) ? item.tags : [],
    sourceLink: item.source_link || '#'
  }));
}

async function init() {
  await loadDecisionsFromSupabase();
  renderDecisions();
  setupModalHandlers();
}

document.addEventListener('DOMContentLoaded', init);
