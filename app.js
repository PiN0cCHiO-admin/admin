const kpis = [
  { name: '철강', price: '$128/ton', delta: '+3.1%', positive: true },
  { name: '구리', price: '$9,820/ton', delta: '+1.8%', positive: true },
  { name: '알루미늄', price: '$2,460/ton', delta: '-0.6%', positive: false },
  { name: '아연', price: '$2,740/ton', delta: '+2.4%', positive: true },
];

const insights = [
  { label: '철강', detail: '해상 운임 안정화', value: '+3.1%', color: '#4ade80' },
  { label: '구리', detail: '전기차 수요 반등', value: '+1.8%', color: '#7dd3fc' },
  { label: '알루미늄', detail: '에너지 비용 압박', value: '-0.6%', color: '#fbbf24' },
  { label: '아연', detail: '제련 가동률 낮아짐', value: '+2.4%', color: '#a78bfa' },
];

const materials = [
  { name: '철강', price: '$128 / ton', mom: '+3.1%', risk: 'Watch' },
  { name: '구리', price: '$9,820 / ton', mom: '+1.8%', risk: 'Safe' },
  { name: '알루미늄', price: '$2,460 / ton', mom: '-0.6%', risk: 'Alert' },
  { name: '아연', price: '$2,740 / ton', mom: '+2.4%', risk: 'Watch' },
];

const regions = [
  { region: '동북아', lead: '4-5주', inventory: '82%', status: 'Safe' },
  { region: '유럽', lead: '5-7주', inventory: '71%', status: 'Watch' },
  { region: '북미', lead: '3-4주', inventory: '88%', status: 'Safe' },
  { region: '중동', lead: '6-8주', inventory: '62%', status: 'Alert' },
];

const chartData = [84, 87, 82, 88, 91, 95, 90, 102, 106, 115, 119, 124];

const kpiGrid = document.getElementById('kpi-grid');
const insightList = document.getElementById('insight-list');
const materialsTable = document.getElementById('materials-table');
const regionTable = document.getElementById('region-table');

function renderKpis() {
  kpiGrid.innerHTML = kpis
    .map(
      (item) => `
        <article class="card kpi-card">
          <h4>${item.name}</h4>
          <div class="kpi-row">
            <div class="kpi-price">${item.price}</div>
            <div class="kpi-change ${item.positive ? 'positive' : 'negative'}">${item.delta}</div>
          </div>
        </article>
      `,
    )
    .join('');
}

function renderInsights() {
  insightList.innerHTML = insights
    .map(
      (item) => `
        <li>
          <span class="insight-dot" style="background:${item.color};"></span>
          <div class="insight-copy">
            <strong>${item.label}</strong>
            <span>${item.detail}</span>
          </div>
          <span class="insight-value" style="color:${item.color};">${item.value}</span>
        </li>
      `,
    )
    .join('');
}

function renderMaterials() {
  materialsTable.innerHTML = materials
    .map(
      (item) => `
        <tr>
          <td><strong>${item.name}</strong></td>
          <td>${item.price}</td>
          <td class="${item.mom.startsWith('-') ? 'negative' : 'positive'}">${item.mom}</td>
          <td><span class="pill ${riskClass(item.risk)}">${item.risk}</span></td>
        </tr>
      `,
    )
    .join('');
}

function renderRegions() {
  regionTable.innerHTML = regions
    .map(
      (item) => `
        <tr>
          <td>${item.region}</td>
          <td>${item.lead}</td>
          <td>${item.inventory}</td>
          <td><span class="pill ${riskClass(item.status)}">${item.status}</span></td>
        </tr>
      `,
    )
    .join('');
}

function riskClass(status) {
  if (status === 'Safe') return 'safe';
  if (status === 'Watch') return 'watch';
  return 'alert';
}

function renderChart() {
  const svg = document.getElementById('price-chart');
  const width = 640;
  const height = 260;
  const padding = 24;
  const max = Math.max(...chartData) + 10;
  const min = Math.min(...chartData) - 10;

  const points = chartData
    .map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / (chartData.length - 1);
      const y = height - padding - ((value - min) / (max - min || 1)) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const area = `
    ${points}
    ${width - padding},${height - padding}
    ${padding},${height - padding}
  `;

  const grid = [0, 1, 2, 3].map((step) => {
    const y = padding + (step * (height - padding * 2)) / 3;
    return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(148,163,184,0.18)" stroke-width="1"/>`;
  }).join('');

  svg.innerHTML = `
    <defs>
      <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="rgba(125,211,252,0.42)" />
        <stop offset="100%" stop-color="rgba(125,211,252,0.02)" />
      </linearGradient>
    </defs>
    ${grid}
    <polyline points="${area}" fill="url(#lineFill)" opacity="0.9"></polyline>
    <polyline points="${points}" fill="none" stroke="#7dd3fc" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>
    ${chartData
      .map((value, index) => {
        const x = padding + (index * (width - padding * 2)) / (chartData.length - 1);
        const y = height - padding - ((value - min) / (max - min || 1)) * (height - padding * 2);
        return `<circle cx="${x}" cy="${y}" r="${index === chartData.length - 1 ? 5 : 3}" fill="#a78bfa"></circle>`;
      })
      .join('')}
  `;
}

renderKpis();
renderInsights();
renderMaterials();
renderRegions();
renderChart();
