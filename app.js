(function(){
  "use strict";

  const D = MTA_DATA;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = new Intl.NumberFormat('en-US');

  const state = { selected: new Set() };

  /* ---------------------------------------------------------
     helpers
     --------------------------------------------------------- */
  function weightedOtp(rows){
    // rows: [{trips, otp}] -> trip-weighted average otp
    let num = 0, den = 0;
    rows.forEach(r => { num += r.otp * r.trips; den += r.trips; });
    return den ? num / den : 0;
  }

  function hexToRgb(hex){
    const h = hex.replace('#','');
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  }
  function rgbToHex(r,g,b){
    return '#' + [r,g,b].map(v => Math.round(v).toString(16).padStart(2,'0')).join('');
  }
  function lerpColor(hexA, hexB, t){
    const a = hexToRgb(hexA), b = hexToRgb(hexB);
    return rgbToHex(a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t);
  }
  // signal-aspect scale: red (stop/bad) -> amber (caution) -> green (proceed/good)
  function signalColor(otp, min, max){
    const t = Math.max(0, Math.min(1, (otp - min) / (max - min)));
    if (t < 0.5) return lerpColor('#B3261E', '#FFA630', t / 0.5);
    return lerpColor('#FFA630', '#1E8E3E', (t - 0.5) / 0.5);
  }
  function luminance(hex){
    const [r,g,b] = hexToRgb(hex).map(v => v/255);
    return 0.2126*r + 0.7152*g + 0.0722*b;
  }

  /* ---------------------------------------------------------
     count-up board digits
     --------------------------------------------------------- */
  function animateValue(el, to, opts){
    opts = opts || {};
    const decimals = opts.decimals || 0;
    const suffix = opts.suffix || '';
    const duration = reduceMotion ? 0 : 1100;
    const start = performance.now();
    function frame(now){
      const p = duration ? Math.min(1, (now - start) / duration) : 1;
      const eased = 1 - Math.pow(1 - p, 3);
      const val = to * eased;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString('en-US')) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------
     shared CSS-var lookups (safe regardless of Chart.js)
     --------------------------------------------------------- */
  const CSS_VAR = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const inkColor = CSS_VAR('--ink');
  const mutedColor = CSS_VAR('--muted');
  const borderColor = CSS_VAR('--border');
  const amber = CSS_VAR('--amber');
  const panelColor = CSS_VAR('--panel-raised');
  const hasChart = typeof Chart !== 'undefined';

  /* ---------------------------------------------------------
     Chart.js global styling (only runs if the library loaded)
     --------------------------------------------------------- */
  function configureChartDefaults(){
    if (!hasChart) return;
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = mutedColor;
    Chart.defaults.borderColor = borderColor;
    Chart.defaults.plugins.legend.labels.boxWidth = 12;
    Chart.defaults.plugins.legend.labels.font = { size: 11 };
    Chart.defaults.plugins.tooltip.backgroundColor = panelColor;
    Chart.defaults.plugins.tooltip.titleColor = inkColor;
    Chart.defaults.plugins.tooltip.bodyColor = inkColor;
    Chart.defaults.plugins.tooltip.borderColor = borderColor;
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.displayColors = false;
  }

  function showChartFallback(canvasId, message){
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const note = document.createElement('p');
    note.className = 'chart-fallback';
    note.textContent = message || 'Chart unavailable \u2014 vendor/chart.umd.min.js did not load.';
    canvas.replaceWith(note);
  }

  /* ---------------------------------------------------------
     1. Bullet selector row
     --------------------------------------------------------- */
  const bulletRow = document.getElementById('bullet-row');
  D.lineStats.slice().sort((a,b) => a.line.localeCompare(b.line, 'en', {numeric:true})).forEach(l => {
    const btn = document.createElement('button');
    btn.className = 'bullet';
    btn.type = 'button';
    btn.style.background = l.color;
    btn.textContent = l.line;
    btn.setAttribute('aria-pressed','false');
    btn.setAttribute('aria-label', `Line ${l.line}, ${l.otp}% on time`);
    btn.addEventListener('click', () => toggleLine(l.line));
    btn.dataset.line = l.line;
    bulletRow.appendChild(btn);
  });
  document.getElementById('reset-lines').addEventListener('click', () => {
    state.selected.clear();
    render();
  });

  function toggleLine(line){
    if (state.selected.has(line)) state.selected.delete(line);
    else state.selected.add(line);
    render();
  }

  /* ---------------------------------------------------------
     2. Board + KPI values (recompute on selection)
     --------------------------------------------------------- */
  function currentAggregate(){
    if (state.selected.size === 0){
      return {
        otp: D.totals.avgOtp,
        incidents: D.totals.incidents,
        delays: D.totals.delays,
        cause: D.totals.topCategory,
        label: 'Systemwide'
      };
    }
    const lines = D.lineStats.filter(l => state.selected.has(l.line));
    const incidents = lines.reduce((s,l) => s + l.incidents, 0);
    const delays = lines.reduce((s,l) => s + l.delays, 0);
    const otp = weightedOtp(lines.map(l => ({trips:l.trips, otp:l.otp})));
    const catRows = D.lineCategoryMatrix.filter(r => state.selected.has(r.line));
    const byCat = {};
    catRows.forEach(r => { byCat[r.category] = (byCat[r.category]||0) + r.delays; });
    const topCat = Object.entries(byCat).sort((a,b) => b[1]-a[1])[0];
    return {
      otp, incidents, delays,
      cause: topCat ? topCat[0] : '\u2014',
      label: Array.from(state.selected).sort().join(' / ')
    };
  }

  function renderBoard(agg){
    animateValue(document.getElementById('stat-otp'), agg.otp, {decimals:1, suffix:'%'});
    animateValue(document.getElementById('stat-incidents'), agg.incidents);
    animateValue(document.getElementById('stat-delays'), agg.delays);
    document.getElementById('stat-cause').textContent = agg.cause;
    document.querySelector('.board-caption').textContent =
      state.selected.size === 0
        ? 'Live board \u00b7 select a line below to filter'
        : `Live board \u00b7 showing line${state.selected.size>1?'s':''} ${agg.label}`;
  }

  function renderKpis(agg){
    const grid = document.getElementById('kpi-grid');
    const rate = agg.incidents ? (agg.delays / agg.incidents) : 0;
    const cards = [
      { value: `${agg.otp.toFixed(1)}%`, label: 'On-Time Performance' },
      { value: fmt.format(agg.incidents), label: 'Incidents Logged' },
      { value: rate.toFixed(1), label: 'Avg. Delays per Incident' },
      { value: agg.cause, label: 'Top Cause of Delay' },
    ];
    grid.innerHTML = cards.map(c => `
      <div class="kpi-card">
        <span class="kpi-value">${c.value}</span>
        <span class="kpi-label">${c.label}</span>
      </div>
    `).join('');
  }

  /* ---------------------------------------------------------
     3. Charts
     --------------------------------------------------------- */
  let chartYear, chartCategory, chartMonth, chartLines;

  function buildYearChart(){
    const ctx = document.getElementById('chart-year');
    chartYear = new Chart(ctx, {
      type: 'line',
      data: {
        labels: D.yearStats.map(y => y.year),
        datasets: [
          {
            label: 'On-Time Performance (%)',
            data: D.yearStats.map(y => y.otp),
            borderColor: amber,
            backgroundColor: amber,
            yAxisID: 'y',
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: amber,
            borderWidth: 2.5,
          },
          {
            label: 'Delay Rate (per 1k trips)',
            data: D.yearStats.map(y => y.delayRate),
            borderColor: mutedColor,
            backgroundColor: mutedColor,
            yAxisID: 'y1',
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: mutedColor,
            borderWidth: 2,
            borderDash: [4,3],
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: { position: 'left', min: 70, max: 90, ticks:{callback:v=>v+'%'}, grid:{color:borderColor} },
          y1:{ position: 'right', grid:{display:false} },
          x: { grid:{display:false} }
        },
        plugins: { legend: { position: 'top', align:'start' } }
      }
    });
    document.getElementById('trend-years').textContent = D.totals.years;
    document.getElementById('hero-years').textContent = D.totals.years;
  }

  function categoryData(){
    if (state.selected.size === 0){
      return D.categoryStats.map(c => ({category:c.category, delays:c.delays, color:c.color}));
    }
    const rows = D.lineCategoryMatrix.filter(r => state.selected.has(r.line));
    const byCat = {};
    rows.forEach(r => { byCat[r.category] = (byCat[r.category]||0) + r.delays; });
    const colorMap = {}; D.categoryStats.forEach(c => colorMap[c.category] = c.color);
    return Object.entries(byCat)
      .map(([category, delays]) => ({category, delays, color: colorMap[category] || mutedColor}))
      .sort((a,b) => b.delays - a.delays);
  }

  function buildCategoryChart(){
    const rows = categoryData();
    const ctx = document.getElementById('chart-category');
    chartCategory = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: rows.map(r => r.category),
        datasets: [{
          data: rows.map(r => r.delays),
          backgroundColor: rows.map(r => r.color),
          borderRadius: 3,
          maxBarThickness: 28,
        }]
      },
      options: {
        indexAxis: 'y',
        maintainAspectRatio: false,
        scales: {
          x: { grid:{color:borderColor}, ticks:{callback:v=>fmt.format(v)} },
          y: { grid:{display:false} }
        },
        plugins: { legend: { display:false }, tooltip:{ callbacks:{ label: c => `${fmt.format(c.raw)} delays` } } }
      }
    });
  }

  function updateCategoryChart(){
    const rows = categoryData();
    document.getElementById('causes-sub').textContent =
      state.selected.size === 0
        ? 'Delays by reporting category, systemwide'
        : `Delays by reporting category \u00b7 line${state.selected.size>1?'s':''} ${Array.from(state.selected).sort().join(', ')}`;
    if (!chartCategory) return;
    chartCategory.data.labels = rows.map(r => r.category);
    chartCategory.data.datasets[0].data = rows.map(r => r.delays);
    chartCategory.data.datasets[0].backgroundColor = rows.map(r => r.color);
    chartCategory.update();
  }

  function buildMonthChart(){
    const ctx = document.getElementById('chart-month');
    chartMonth = new Chart(ctx, {
      data: {
        labels: D.monthStats.map(m => m.month.slice(0,3)),
        datasets: [
          {
            type: 'bar',
            label: 'Incidents',
            data: D.monthStats.map(m => m.incidents),
            backgroundColor: 'rgba(139,148,160,0.35)',
            borderRadius: 2,
            yAxisID: 'y1',
            order: 2,
          },
          {
            type: 'line',
            label: 'On-Time %',
            data: D.monthStats.map(m => m.otp),
            borderColor: amber,
            backgroundColor: amber,
            pointBackgroundColor: amber,
            tension: 0.35,
            yAxisID: 'y',
            order: 1,
            borderWidth: 2.5,
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: { position:'left', min:75, max:86, ticks:{callback:v=>v+'%'}, grid:{color:borderColor} },
          y1:{ position:'right', grid:{display:false} },
          x: { grid:{display:false} }
        },
        plugins: { legend:{ position:'top', align:'start' } }
      }
    });
  }

  function buildLinesChart(){
    const rows = D.lineStats; // already sorted desc by otp
    const ctx = document.getElementById('chart-lines');
    chartLines = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: rows.map(r => r.line),
        datasets: [{
          data: rows.map(r => r.otp),
          backgroundColor: rows.map(r => r.color),
          borderRadius: 3,
          barPercentage: 0.82,
          categoryPercentage: 0.9,
        }]
      },
      options: {
        indexAxis: 'y',
        maintainAspectRatio: false,
        layout: { padding: { top: 4, bottom: 4 } },
        scales: {
          x: { min:65, max:95, grid:{color:borderColor}, ticks:{callback:v=>v+'%'} },
          y: { grid:{display:false}, ticks:{ font:{family:"'Oswald', sans-serif", weight:600, size:13} } }
        },
        plugins: {
          legend:{ display:false },
          tooltip:{ callbacks:{ label: c => `${c.raw.toFixed(1)}% on time \u00b7 ${fmt.format(rows[c.dataIndex].incidents)} incidents` } }
        }
      }
    });
  }

  function updateLinesHighlight(){
    if (!chartLines) return;
    const rows = D.lineStats;
    chartLines.data.datasets[0].backgroundColor = rows.map(r =>
      state.selected.size === 0 || state.selected.has(r.line) ? r.color : borderColor
    );
    chartLines.update();
  }

  /* ---------------------------------------------------------
     4. Heatmap: OTP by line x year
     --------------------------------------------------------- */
  function buildHeatmap(){
    const el = document.getElementById('heatmap');
    const years = D.years;
    const otpVals = D.yearLineMatrix.map(r => r.otp);
    const min = Math.min(...otpVals), max = Math.max(...otpVals);
    const lookup = {};
    D.yearLineMatrix.forEach(r => { lookup[`${r.year}|${r.line}`] = r.otp; });

    let html = `<div class="hm-cell hm-head"></div>`;
    years.forEach(y => html += `<div class="hm-cell hm-head">${y}</div>`);

    D.lineStats.forEach(l => {
      html += `<div class="hm-cell"><button class="hm-row-btn" data-line="${l.line}" aria-label="Filter to line ${l.line}"><span class="hm-rowlabel" style="background:${l.color}">${l.line}</span></button></div>`;
      years.forEach(y => {
        const v = lookup[`${y}|${l.line}`];
        if (v === undefined){ html += `<div class="hm-cell"></div>`; return; }
        const bg = signalColor(v, min, max);
        const text = luminance(bg) > 0.55 ? '#0A0C10' : '#F5F5F5';
        html += `<div class="hm-cell hm-data" style="background:${bg};color:${text}" title="Line ${l.line}, ${y}: ${v.toFixed(1)}% on time">${v.toFixed(0)}%</div>`;
      });
    });
    el.innerHTML = html;
    el.querySelectorAll('.hm-row-btn').forEach(btn => {
      btn.addEventListener('click', () => toggleLine(btn.dataset.line));
    });
  }

  function updateHeatmapHighlight(){
    document.querySelectorAll('.hm-rowlabel').forEach(span => {
      const line = span.textContent;
      const dim = state.selected.size > 0 && !state.selected.has(line);
      span.parentElement.style.opacity = dim ? 0.35 : 1;
    });
  }

  /* ---------------------------------------------------------
     5. Bullet row active states
     --------------------------------------------------------- */
  function updateBullets(){
    bulletRow.classList.toggle('has-selection', state.selected.size > 0);
    bulletRow.querySelectorAll('.bullet').forEach(btn => {
      const on = state.selected.has(btn.dataset.line);
      btn.classList.toggle('is-selected', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.getElementById('reset-lines').classList.toggle('is-active', state.selected.size === 0);
  }

  /* ---------------------------------------------------------
     render orchestration
     --------------------------------------------------------- */
  function render(){
    const agg = currentAggregate();
    renderBoard(agg);
    renderKpis(agg);
    updateCategoryChart();
    updateLinesHighlight();
    updateHeatmapHighlight();
    updateBullets();
  }

  function safeBuild(fn, canvasId, label){
    try{
      fn();
    }catch(err){
      console.error(`[dashboard] ${label} failed:`, err);
      if (canvasId) showChartFallback(canvasId, `${label} couldn't render.`);
    }
  }

  function init(){
    // Non-chart UI works regardless of whether Chart.js loaded.
    configureChartDefaults();

    if (hasChart){
      safeBuild(buildYearChart, 'chart-year', 'Year-over-year chart');
      safeBuild(buildCategoryChart, 'chart-category', 'Cause breakdown chart');
      safeBuild(buildMonthChart, 'chart-month', 'Seasonality chart');
      safeBuild(buildLinesChart, 'chart-lines', 'Line leaderboard chart');
    } else {
      console.error('[dashboard] Chart.js did not load; skipping all charts.');
      ['chart-year','chart-category','chart-month','chart-lines'].forEach(id =>
        showChartFallback(id, 'Chart unavailable \u2014 vendor/chart.umd.min.js did not load.')
      );
      document.getElementById('trend-years').textContent = D.totals.years;
      document.getElementById('hero-years').textContent = D.totals.years;
    }

    safeBuild(buildHeatmap, null, 'Departure-board heatmap');
    render();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
