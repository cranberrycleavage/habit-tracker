"use strict";

/* ==========================================================
   Constants & helpers
   ========================================================== */
const STORAGE_KEY = "habitTrackerData_v1";
const BACKUP_KEY = "habitTrackerData_v1_backup_timestamps";
const THEME_KEY = "habitTrackerTheme";
const VIEW_KEY = "habitTrackerView";
const SETTINGS_KEY = "habitTrackerSettings_v1";
const DAY_MS = 86400000;
const NUDGE_AFTER_DAYS = 7;   // remind to back up after this long without an export
const NUDGE_SNOOZE_DAYS = 3;  // "Later" hides the reminder for this long
const hasPopover = "showPopover" in HTMLElement.prototype;
const VIEWS = ["standard", "compact", "focus"];
const TIERS = [1, 2, 3, 4, 5];
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

const $ = id => document.getElementById(id);

const esc = value =>
    String(value ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);

const ICONS = {
    check: `<path d="M20 6 9 17l-5-5"/>`,
    "circle-check": `<circle cx="12" cy="12" r="10"/><path d="m16 9-5.5 5.5L8 12"/>`,
    circle: `<circle cx="12" cy="12" r="10"/>`,
    clock: `<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>`,
    flame: `<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>`,
    "list-todo": `<path d="M13 5h8"/><path d="M13 12h8"/><path d="M13 19h8"/><path d="m3 17 2 2 4-4"/><rect x="3" y="4" width="6" height="6" rx="1"/>`,
    "notebook-pen": `<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>`,
    pencil: `<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>`,
    plus: `<path d="M5 12h14"/><path d="M12 5v14"/>`,
    settings: `<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>`,
    skip: `<path d="M12 3a9.75 9.75 0 0 1 6.74 2.74"/><path d="M18.74 5.74 21 8"/><path d="M21 8V3"/><path d="M7.5 19.794c-6-3.464-6-12.124 0-15.588"/><path d="M7.5 4.206A9 9 0 0 1 12 3"/><path d="M12 7v5l4 2"/><path d="M14 20.775A9 9 0 0 1 12 21"/><path d="M19 17.656a9 9 0 0 1-1.5 1.456"/><path d="M21 12a9 9 0 0 1-.228 2"/><path d="M21 8h-5"/>`,
    snowflake: `<path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/><path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/><path d="m17 21-3-6h-4"/><path d="m17 3-3 6 1.5 3"/><path d="M2 12h6.5L10 9"/><path d="m20 10-1.5 2 1.5 2"/><path d="M22 12h-6.5L14 15"/><path d="m4 10 1.5 2L4 14"/><path d="m7 21 3-6-1.5-3"/><path d="m7 3 3 6h4"/>`,
    sparkles: `<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>`,
    trash: `<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>`,
    "chart-column": `<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>`,
    archive: `<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>`,
    "archive-restore": `<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h2"/><path d="M20 8v11a2 2 0 0 1-2 2h-2"/><path d="m9 15 3-3 3 3"/><path d="M12 12v9"/>`
};

// Inline SVG so strokes inherit the surrounding text color (and therefore the theme)
const icon = name =>
    `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] ?? ""}</svg>`;

const newId = () =>
    globalThis.crypto?.randomUUID?.() ??
    Date.now().toString(36) + Math.random().toString(36).slice(2);

const store = {
    get(key) {
        try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
        try { localStorage.setItem(key, value); return true; }
        catch (err) { console.error(err); return false; }
    }
};

/* ==========================================================
   Dates — completions are stored as local "YYYY-MM-DD" keys,
   so there is no timezone / DST arithmetic anywhere.
   ========================================================== */
const pad = n => String(n).padStart(2, "0");

const dayKey = (d = new Date()) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function shiftDay(key, n) {
    const [y, m, d] = key.split("-").map(Number);
    return dayKey(new Date(y, m - 1, d + n));
}

const prevDay = key => shiftDay(key, -1);

// Accepts a day key (kept as is) or an old ISO timestamp (converted to local day).
function toDayKey(value) {
    if (typeof value === "string" && DAY_RE.test(value)) return value;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : dayKey(d);
}

/* ==========================================================
   Data model
   ========================================================== */
function normalizeHabit(raw) {
    const tier = Math.round(Number(raw?.tier));
    const rawDays = Array.isArray(raw?.completions) ? raw.completions : [];
    const days = [...new Set(rawDays.map(toDayKey).filter(Boolean))].sort();

    // "created" lets stats ignore days before a habit existed. Older data has none,
    // so fall back to the first completion (or today).
    const today = dayKey();
    let created = DAY_RE.test(raw?.created) ? raw.created : (days[0] ?? today);
    if (days[0] && days[0] < created) created = days[0];
    if (created > today) created = today;

    return {
        id: String(raw?.id ?? newId()),
        name: String(raw?.name ?? "").trim() || "Unnamed Habit",
        tier: TIERS.includes(tier) ? tier : 1,
        scheduled: TIME_RE.test(raw?.scheduled) ? raw.scheduled : "",
        notes: typeof raw?.notes === "string" ? raw.notes : "",
        archived: raw?.archived === true,
        created,
        completions: days
    };
}

function normalizeAll(list) {
    const seen = new Set();
    return list.map(raw => {
        const habit = normalizeHabit(raw);
        if (seen.has(habit.id)) habit.id = newId();
        seen.add(habit.id);
        return habit;
    });
}

function loadTasks() {
    const raw = store.get(STORAGE_KEY);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        const habits = normalizeAll(parsed);

        // One-time migrations: ISO-timestamp completions -> day keys, and adding "created".
        const needsDayKeys = parsed.some(h =>
            Array.isArray(h?.completions) &&
            h.completions.some(c => !DAY_RE.test(c))
        );
        const needsCreated = parsed.some(h => !DAY_RE.test(h?.created));

        if (needsDayKeys && !store.get(BACKUP_KEY)) store.set(BACKUP_KEY, raw);
        if (needsDayKeys || needsCreated) store.set(STORAGE_KEY, JSON.stringify(habits));

        return habits;
    } catch (err) {
        console.error("Could not read saved habits:", err);
        return [];
    }
}

function saveTasks() {
    if (!store.set(STORAGE_KEY, JSON.stringify(tasks))) {
        alert("Couldn't save your habits. Browser storage may be full or disabled.");
    }
}

/* ==========================================================
   State
   ========================================================== */
let tasks = [];
let currentView = "standard";
let skipped = [];            // Focus view: ids skipped this session, in skip order
let editingId = null;        // Habit being edited in the dialog (null = adding)
let today = dayKey();
const openNotes = new Set(); // Keeps note panels open across re-renders

let pendingImport = null;    // parsed import waiting for Merge / Replace
let installPrompt = null;
let toastTimer;

let settings = {
    sort: "time",
    weekStart: "mon",
    hideCompleted: false,
    badDay: null,            // day key the mode was switched on; auto-expires at midnight
    lastExport: null,
    nudgeDismissed: 0,
    firstSeen: null
};

const SORTS = {
    time:   (a, b) => a.scheduled.localeCompare(b.scheduled),
    tier:   (a, b) => a.tier - b.tier || a.scheduled.localeCompare(b.scheduled),
    streak: (a, b) => getStreak(b) - getStreak(a) || a.scheduled.localeCompare(b.scheduled),
    name:   (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
};

const byOrder = (a, b) => SORTS[settings.sort](a, b);
const activeTasks = () => tasks.filter(h => !h.archived);
const isBadDay = () => settings.badDay === dayKey();
const shownTasks = () => activeTasks().filter(h => !isBadDay() || h.tier === 1);

function loadSettings() {
    try {
        Object.assign(settings, JSON.parse(store.get(SETTINGS_KEY) ?? "{}"));
    } catch (err) {
        console.error("Could not read settings:", err);
    }

    if (!SORTS[settings.sort]) settings.sort = "time";
    if (!["mon", "sun"].includes(settings.weekStart)) settings.weekStart = "mon";

    // Backup reminders count from the first completion (existing users) or today (new users)
    if (!settings.firstSeen) {
        const earliest = tasks.flatMap(h => h.completions).sort()[0];
        settings.firstSeen = earliest ? new Date(`${earliest}T00:00:00`).getTime() : Date.now();
        saveSettings();
    }
}

function saveSettings() {
    store.set(SETTINGS_KEY, JSON.stringify(settings));
}

const find = id => tasks.find(h => h.id === id);
const isDoneToday = h => h.completions.includes(dayKey());

function getStreak(habit) {
    const days = new Set(habit.completions);
    let key = dayKey();
    if (!days.has(key)) key = prevDay(key); // today not done yet doesn't break it

    let streak = 0;
    while (days.has(key)) {
        streak++;
        key = prevDay(key);
    }
    return streak;
}

/* ==========================================================
   Stats
   ========================================================== */
const HEATMAP_WEEKS = 26;
const MAX_LOOKBACK_DAYS = 1825;
let statsRange = 30;

const pct = (done, possible) => (possible ? `${Math.round((done / possible) * 100)}%` : "—");

const stat = (value, label) =>
    `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`;

function fmtDate(key, opts = { month: "short", day: "numeric", year: "numeric" }) {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, opts);
}

function bestStreak(habit) {
    let best = 0, run = 0, prev = null;

    for (const key of habit.completions) {   // sorted + unique
        run = prev && shiftDay(prev, 1) === key ? run + 1 : 1;
        best = Math.max(best, run);
        prev = key;
    }
    return best;
}

// Completed / possible days over the last `days` days. Counting starts at the habit's
// creation date, and today only counts once it's done (the day isn't over yet).
function habitRate(habit, days) {
    const today = dayKey();
    const done = new Set(habit.completions);
    let start = shiftDay(today, -(days - 1));
    if (habit.created > start) start = habit.created;

    let completed = 0, possible = 0;
    for (let k = start; k <= today; k = shiftDay(k, 1)) {
        if (done.has(k)) { completed++; possible++; }
        else if (k !== today) possible++;
    }
    return { done: completed, possible };
}

// Consecutive days on which every Tier 1 habit (that existed that day) was done
function coreStats() {
    const tier1 = activeTasks()
        .filter(h => h.tier === 1)
        .map(h => ({ created: h.created, done: new Set(h.completions) }));
    if (!tier1.length) return null;

    const today = dayKey();
    const floor = shiftDay(today, -MAX_LOOKBACK_DAYS);
    let start = tier1.map(h => h.created).sort()[0];
    if (start < floor) start = floor;

    let run = 0, best = 0;
    for (let k = start; k <= today; k = shiftDay(k, 1)) {
        const required = tier1.filter(h => h.created <= k);

        if (required.length && required.every(h => h.done.has(k))) {
            run++;
            best = Math.max(best, run);
        } else if (k !== today) {
            run = 0;   // an unfinished today doesn't break the streak yet
        }
    }
    return { current: run, best };
}

// GitHub-style grid: one column per week, one row per weekday
function heatmap(habit) {
    const today = dayKey();
    const [ty, tm, td] = today.split("-").map(Number);
    const now = new Date(ty, tm - 1, td);
    const offset = settings.weekStart === "mon" ? (now.getDay() + 6) % 7 : now.getDay();
    const start = new Date(ty, tm - 1, td - offset - (HEATMAP_WEEKS - 1) * 7);
    const done = new Set(habit.completions);

    let cells = "", months = "", lastMonth = -1, lastLabel = -10, inRange = 0;

    for (let w = 0; w < HEATMAP_WEEKS; w++) {
        for (let d = 0; d < 7; d++) {
            const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + d);
            const key = dayKey(date);
            const isDone = done.has(key);

            let cls = key > today ? "future" : isDone ? "done" : key < habit.created ? "before" : "miss";
            if (key === today) cls += " today";
            if (isDone) inRange++;

            const title = isDone ? ` title="${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}"` : "";
            cells += `<i class="${cls}"${title}></i>`;
        }

        const first = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7);
        if (first.getMonth() !== lastMonth) {
            lastMonth = first.getMonth();
            if (w - lastLabel >= 3) {
                months += `<span style="grid-column:${w + 1}">${first.toLocaleDateString(undefined, { month: "short" })}</span>`;
                lastLabel = w;
            }
        }
    }

    return `
        <div class="heat-card">
            <div class="heat-months" aria-hidden="true">${months}</div>
            <div class="heat" role="img"
                aria-label="${inRange} completions in the last ${HEATMAP_WEEKS} weeks">${cells}</div>
            <p class="hint">${inRange} ${inRange === 1 ? "completion" : "completions"} in the last ${HEATMAP_WEEKS} weeks</p>
        </div>`;
}

function renderStats() {
    document.querySelectorAll("[data-range]").forEach(btn =>
        btn.setAttribute("aria-pressed", String(Number(btn.dataset.range) === statsRange))
    );

    const habits = activeTasks().sort(byOrder);
    const core = coreStats();

    const coreHtml = core
        ? `<div class="stat-grid two">
               ${stat(core.current, "Current core streak")}
               ${stat(core.best, "Best core streak")}
           </div>
           <p class="hint">A day counts when every Tier 1 habit is done.</p>`
        : `<p class="hint">Add a Tier 1 habit to start a core streak.</p>`;

    const tierHtml = TIERS.map(t => {
        const group = habits.filter(h => h.tier === t);
        if (!group.length) return "";

        const sum = group.reduce((acc, h) => {
            const r = habitRate(h, statsRange);
            return { done: acc.done + r.done, possible: acc.possible + r.possible };
        }, { done: 0, possible: 0 });

        const width = sum.possible ? (sum.done / sum.possible) * 100 : 0;

        return `
            <div class="rate-row">
                <div class="rate-head"><span>Tier ${t}</span><strong>${pct(sum.done, sum.possible)}</strong></div>
                <div class="tier-progress"><div class="tier-fill" data-tier="${t}" style="width:${width}%"></div></div>
                <span class="hint">${sum.done} of ${sum.possible} days</span>
            </div>`;
    }).join("") || `<p class="hint">No habits yet.</p>`;

    $("statsBody").innerHTML = `
        <section class="stats-section">
            <h3>Core streak</h3>${coreHtml}
        </section>
        <section class="stats-section">
            <h3>Completion by tier, last ${statsRange} days</h3>${tierHtml}
        </section>`;
}

function openDetail(id) {
    const habit = find(id);
    if (!habit) return;

    const rates = [7, 30, 90].map(days => {
        const r = habitRate(habit, days);
        return stat(pct(r.done, r.possible), `${days} days (${r.done}/${r.possible})`);
    }).join("");

    $("detailTitle").textContent = habit.name;
    $("detailMeta").textContent =
        `Tier ${habit.tier}${habit.scheduled ? `, ${habit.scheduled}` : ""}. Tracking since ${fmtDate(habit.created)}.`;

    $("detailBody").innerHTML = `
        <div class="stat-grid">
            ${stat(getStreak(habit), "Current streak")}
            ${stat(bestStreak(habit), "Best streak")}
            ${stat(habit.completions.length, "Completions")}
        </div>
        <h3>Completion rate</h3>
        <div class="stat-grid">${rates}</div>
        <p class="hint">Rates only count days since the habit was created.</p>
        <h3>Heatmap</h3>
        ${heatmap(habit)}`;

    $("detailDialog").showModal();
}

/* ==========================================================
   Actions
   ========================================================== */
function commit() {
    saveTasks();
    render();
}

function tierStats(tier) {
    const group = activeTasks().filter(h => h.tier === tier);
    return { total: group.length, done: group.filter(isDoneToday).length };
}

function toggleToday(id) {
    const habit = find(id);
    if (!habit) return;

    const before = tierStats(habit.tier);

    const t = dayKey();
    habit.completions = habit.completions.includes(t)
        ? habit.completions.filter(d => d !== t)
        : [...habit.completions, t].sort();

    const after = tierStats(habit.tier);

    commit();

    if (after.total > 0 && after.done === after.total && before.done < before.total) {
        celebrate(habit.tier);
    }
}

function skipHabit(id) {
    skipped = skipped.filter(s => s !== id);
    skipped.push(id);
    render();
}

function archiveHabit(id) {
    const habit = find(id);
    if (!habit) return;

    habit.archived = true;
    skipped = skipped.filter(s => s !== id);
    commit();

    showToast(`Archived “${habit.name}”`, { label: "Undo", run: () => restoreHabit(id, false) });
}

function restoreHabit(id, notify = true) {
    const habit = find(id);
    if (!habit) return;

    habit.archived = false;
    commit();
    renderArchive();

    if (notify) showToast(`Restored “${habit.name}”`);
}

// Permanent. Only reachable from the Archived habits dialog.
function deleteHabit(id) {
    const habit = find(id);
    if (!habit) return;
    if (!confirm(`Permanently delete “${habit.name}” and its history? This can't be undone.`)) return;

    tasks = tasks.filter(h => h.id !== id);
    skipped = skipped.filter(s => s !== id);
    openNotes.delete(id);
    commit();
    renderArchive();
}

function resetAll() {
    if (!confirm("Remove all completion history?")) return;
    tasks.forEach(h => { h.completions = []; });
    $("settingsDialog").close();
    commit();
}

/* ==========================================================
   Import / export
   ========================================================== */
function exportJson() {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
        href: url,
        download: `habit-tracker-${dayKey()}.json`
    });

    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    settings.lastExport = Date.now();
    saveSettings();
    render();
    showToast("Backup exported");
}

async function importJson(file) {
    try {
        const data = JSON.parse(await file.text());

        if (!Array.isArray(data)) {
            throw new Error("JSON must contain an array of habits.");
        }

        pendingImport = normalizeAll(data);
        $("importSummary").textContent =
            `This file has ${pendingImport.length} habits. You currently have ${tasks.length}.`;

        $("settingsDialog").close();
        $("importDialog").showModal();
    } catch (err) {
        console.error(err);
        alert("Import failed:\n" + err.message);
    }
}

// Merge: habits are matched by id (then by name). Matches keep your current
// settings and gain any completions from the file; everything else is added.
function applyImport(mode) {
    if (!pendingImport) return;
    let message;

    if (mode === "replace") {
        tasks = pendingImport;
        skipped = [];
        message = `Replaced with ${tasks.length} habits`;
    } else {
        let added = 0;
        let updated = 0;

        pendingImport.forEach(incoming => {
            const match =
                tasks.find(h => h.id === incoming.id) ??
                tasks.find(h => h.name.toLowerCase() === incoming.name.toLowerCase());

            if (match) {
                match.completions = [...new Set([...match.completions, ...incoming.completions])].sort();
                if (!match.notes && incoming.notes) match.notes = incoming.notes;
                match.created = [match.created, incoming.created].sort()[0];
                updated++;
            } else {
                tasks.push(incoming);
                added++;
            }
        });

        message = `Merged: ${added} added, ${updated} updated`;
    }

    pendingImport = null;
    $("importDialog").close();
    commit();
    showToast(message);
}

/* ==========================================================
   Rendering
   ========================================================== */
function buildTierSummary() {
    $("tierRows").innerHTML = TIERS.map(t => `
        <div class="tier-row">
            <div class="tier-label" id="tier${t}Label"></div>
            <div class="tier-progress">
                <div class="tier-fill" id="tier${t}Bar" data-tier="${t}"></div>
            </div>
        </div>`).join("");
}

function renderTiers() {
    const badDay = isBadDay();

    TIERS.forEach(t => {
        const { total, done } = tierStats(t);
        const label = $(`tier${t}Label`);

        label.textContent = `Tier ${t} - ${done}/${total}`;
        $(`tier${t}Bar`).style.width = total ? `${(done / total) * 100}%` : "0%";
        label.closest(".tier-row").hidden = badDay && t !== 1;
    });
}

function details(h) {
    const streak = getStreak(h);

    return `
        <div class="habit-details">
            <div class="info">${icon("sparkles")} Tier ${h.tier}</div>
            <div class="info">${icon(streak ? "flame" : "snowflake")}
                ${streak ? `${streak} day streak` : "No active streak"}</div>
            <div class="info">${icon("clock")} ${esc(h.scheduled || "No time set")}</div>
            <div class="info">${icon("list-todo")} ${h.completions.length} completions</div>
        </div>`;
}

const nameButton = h =>
    `<button class="habit-name" data-action="detail" title="Show stats">${esc(h.name)}</button>`;

const completeButton = done => `
    <button class="complete-btn" data-action="toggle"
        aria-label="${done ? "Mark incomplete" : "Mark complete"}">
        ${icon(done ? "circle-check" : "circle")}
    </button>`;

const editArchiveButtons = () => `
    <button class="edit-btn" data-action="edit" title="Edit habit" aria-label="Edit habit">
        ${icon("pencil")}
    </button>
    <button class="archive-btn" data-action="archive" title="Archive habit" aria-label="Archive habit">
        ${icon("archive")}
    </button>`;

const actions = done => `
    <div class="habit-buttons">${completeButton(done)}${editArchiveButtons()}</div>`;

// Editable notes, shared by Standard and Focus views
function notesPanel(h) {
    return `
        <details class="notes"${openNotes.has(h.id) ? " open" : ""}>
            <summary>${icon("notebook-pen")} Notes</summary>
            <textarea class="notes-editor" rows="4"
                aria-label="Notes for ${esc(h.name)}"
                placeholder="Write your notes here...">${esc(h.notes)}</textarea>
        </details>`;
}

// The 7 days of the current week, starting on the user's chosen weekday
function weekDays() {
    const now = new Date();
    const offset = settings.weekStart === "mon" ? (now.getDay() + 6) % 7 : now.getDay();

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset + i);
        return {
            key: dayKey(d),
            label: d.toLocaleDateString(undefined, { weekday: "narrow" }),
            full: d.toLocaleDateString(undefined, { weekday: "long" })
        };
    });
}

function weekStrip(h, week) {
    const t = dayKey();

    return `<div class="week-strip">${week.map(d => {
        const done = h.completions.includes(d.key);
        const cls = ["dot", done && "done", d.key === t && "today", d.key > t && "future"]
            .filter(Boolean).join(" ");
        return `<span class="${cls}" role="img" aria-label="${d.full}${done ? ", done" : ""}">${d.label}</span>`;
    }).join("")}</div>`;
}

function standardCard(h, week) {
    const done = isDoneToday(h);

    return `
        <div class="habit${done ? " completed" : ""}" data-id="${esc(h.id)}">
            <h3>${nameButton(h)}</h3>
            ${details(h)}
            ${weekStrip(h, week)}
            ${notesPanel(h)}
            ${actions(done)}
        </div>`;
}

function compactCard(h) {
    const done = isDoneToday(h);

    return `
        <div class="habit compact-habit${done ? " completed" : ""}" data-id="${esc(h.id)}">
            ${completeButton(done)}
            <h3>${nameButton(h)}</h3>
            <div class="habit-buttons">${editArchiveButtons()}</div>
        </div>`;
}

function focusOrder() {
    const active = shownTasks().filter(h => !isDoneToday(h)).sort(byOrder);
    const activeIds = new Set(active.map(h => h.id));

    skipped = skipped.filter(id => activeIds.has(id));

    return [
        ...active.filter(h => !skipped.includes(h.id)),
        ...skipped.map(find)
    ];
}

function focusCard(h) {
    return `
        <div class="habit focus-card" data-id="${esc(h.id)}">
            <h2>${nameButton(h)}</h2>
            ${details(h)}
            ${notesPanel(h)}
            <div class="focus-buttons">
                <button class="skip-btn" data-action="skip" aria-label="Skip">${icon("skip")}</button>
                <button class="complete-btn" data-action="toggle" aria-label="Complete">${icon("check")}</button>
            </div>
        </div>`;
}

const empty = html => `<div class="habit empty">${html}</div>`;

function render() {
    renderTiers();
    renderNudge();

    $("lastExportText").textContent = lastExportText();
    $("hideCompletedBtn").setAttribute("aria-pressed", String(settings.hideCompleted));
    $("badDayBtn").setAttribute("aria-pressed", String(isBadDay()));

    document.querySelectorAll("[data-view]").forEach(btn =>
        btn.setAttribute("aria-pressed", String(btn.dataset.view === currentView))
    );

    const list = $("habitList");

    if (activeTasks().length === 0) {
        list.innerHTML = empty(tasks.length
            ? "Every habit is archived. Restore one from Settings."
            : "No habits yet. Tap + to add your first one.");
        return;
    }

    if (shownTasks().length === 0) {
        list.innerHTML = empty("Bad-day mode shows Tier 1 habits only, and you don't have any yet.");
        return;
    }

    if (currentView === "focus") {
        const [next] = focusOrder();
        list.innerHTML = next ? focusCard(next) : empty("<h2>🎉 All habits complete!</h2>");
        return;
    }

    const visible = shownTasks()
        .filter(h => !(settings.hideCompleted && isDoneToday(h)))
        .sort(byOrder);

    if (visible.length === 0) {
        list.innerHTML = empty("🎉 All done for today!");
        return;
    }

    const week = weekDays();
    list.innerHTML = visible
        .map(h => (currentView === "compact" ? compactCard(h) : standardCard(h, week)))
        .join("");
}

/* ==========================================================
   Backup nudge, archive list, toast, celebration
   ========================================================== */
function renderNudge() {
    const base = settings.lastExport ?? settings.firstSeen;
    const due =
        tasks.length > 0 &&
        Date.now() - base > NUDGE_AFTER_DAYS * DAY_MS &&
        Date.now() - settings.nudgeDismissed > NUDGE_SNOOZE_DAYS * DAY_MS;

    $("backupNudge").hidden = !due;
    if (!due) return;

    const days = Math.floor((Date.now() - base) / DAY_MS);
    $("nudgeText").textContent = settings.lastExport
        ? `Your last backup was ${days} days ago. Export a fresh copy so you don't lose progress.`
        : "Your habits only live in this browser, and you haven't exported a backup yet. Export a copy to keep them safe.";
}

function lastExportText() {
    if (!settings.lastExport) return "Never exported";

    const days = Math.floor((Date.now() - settings.lastExport) / DAY_MS);
    if (days < 1) return "Last export: today";
    return days === 1 ? "Last export: yesterday" : `Last export: ${days} days ago`;
}

function renderArchive() {
    const archived = tasks
        .filter(h => h.archived)
        .sort((a, b) => a.name.localeCompare(b.name));

    $("archiveList").innerHTML = archived.length
        ? archived.map(h => `
            <div class="archive-row" data-id="${esc(h.id)}">
                <div class="archive-name">
                    <strong>${esc(h.name)}</strong>
                    <span>Tier ${h.tier}, ${h.completions.length} completions</span>
                </div>
                <button class="restore-btn" data-action="restore" title="Restore habit"
                    aria-label="Restore ${esc(h.name)}">${icon("archive-restore")}</button>
                <button class="delete-btn" data-action="delete" title="Delete permanently"
                    aria-label="Delete ${esc(h.name)} permanently">${icon("trash")}</button>
            </div>`).join("")
        : `<p class="hint">Nothing archived. Archiving hides a habit without losing its history.</p>`;
}

// The toast is a popover so it shows above open dialogs too
function setToastOpen(open) {
    const el = $("toast");

    if (!hasPopover) {
        el.hidden = !open;
        return;
    }

    const isOpen = el.matches(":popover-open");
    if (open && !isOpen) el.showPopover();
    if (!open && isOpen) el.hidePopover();
}

function showToast(message, action) {
    const btn = $("toastAction");

    $("toastMsg").textContent = message;
    btn.hidden = !action;

    if (action) {
        btn.textContent = action.label;
        btn.onclick = () => {
            setToastOpen(false);
            action.run();
        };
    }

    setToastOpen(true);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToastOpen(false), action ? 6000 : 2800);
}

const TIER_COLORS = ["#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444"];

function celebrate(tier) {
    showToast(`Tier ${tier} complete! 🎉`);

    const row = $(`tier${tier}Label`).closest(".tier-row");
    row.classList.remove("celebrate");
    void row.offsetWidth; // restart the animation if it's already running
    row.classList.add("celebrate");

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const colors = [TIER_COLORS[tier - 1], "var(--primary)", "var(--success)", "var(--warning)"];
    const layer = document.createElement("div");
    layer.className = "confetti";
    layer.setAttribute("aria-hidden", "true");

    for (let i = 0; i < 36; i++) {
        const piece = document.createElement("i");
        piece.style.cssText =
            `--x:${Math.random() * 100}vw;--dx:${(Math.random() - .5) * 160}px;` +
            `--r:${Math.random() * 720 - 360}deg;--d:${1.4 + Math.random() * 1.2}s;` +
            `--delay:${Math.random() * .25}s;background:${colors[i % colors.length]}`;
        layer.append(piece);
    }

    document.body.append(layer);
    setTimeout(() => layer.remove(), 3200);
}

/* ==========================================================
   Themes
   ========================================================== */
const THEMES = {
    default:  { bg: "#102a13", g: "radial-gradient(circle at top left,#14532d,#102a13 40%)", card: "rgba(31,77,41,.75)",   text: "#f0fdf4", t2: "#bbf7d0", p: "#22c55e", ph: "#16a34a", s: "#84cc16", sh: "#65a30d", w: "#eab308", wh: "#ca8a04", done: "rgba(20,45,24,.85)" },
    ocean:    { bg: "#082f49", g: "radial-gradient(circle at top left,#0ea5e9,#082f49 45%)", card: "rgba(15,76,117,.72)",  text: "#ecfeff", t2: "#a5f3fc", p: "#06b6d4", ph: "#0891b2", s: "#14b8a6", sh: "#0f766e", w: "#38bdf8", wh: "#0284c7", done: "rgba(8,35,55,.88)" },
    sunset:   { bg: "#431407", g: "radial-gradient(circle at top left,#f97316,#431407 40%)", card: "rgba(124,45,18,.75)",  text: "#fff7ed", t2: "#fdba74", p: "#f97316", ph: "#ea580c", s: "#fb7185", sh: "#e11d48", w: "#fbbf24", wh: "#d97706", done: "rgba(80,25,12,.88)" },
    lavender: { bg: "#2e1065", g: "radial-gradient(circle at top left,#8b5cf6,#2e1065 40%)", card: "rgba(91,33,182,.70)",  text: "#faf5ff", t2: "#d8b4fe", p: "#a855f7", ph: "#9333ea", s: "#c084fc", sh: "#a855f7", w: "#f472b6", wh: "#db2777", done: "rgba(55,20,120,.85)" },
    terminal: { bg: "#001100", g: "linear-gradient(#001100,#000000)",                        card: "rgba(0,34,0,.85)",     text: "#00ff66", t2: "#66ff99", p: "#00ff66", ph: "#00cc52", s: "#00ff99", sh: "#00cc77", w: "#99ff00", wh: "#77cc00", done: "rgba(0,18,0,.95)" },
    coffee:   { bg: "#2b1d16", g: "radial-gradient(circle at top left,#6f4e37,#2b1d16 50%)", card: "rgba(78,52,46,.85)",   text: "#f5ebe0", t2: "#d5bdaf", p: "#a98467", ph: "#8c6d54", s: "#7f5539", sh: "#5e412f", w: "#ddb892", wh: "#c79a72", done: "rgba(55,35,30,.92)" },
    matcha:   { bg: "#e8f5e9", g: "linear-gradient(#d8f3dc,#f4fff7)",                        card: "rgba(255,255,255,.90)", text: "#1b4332", t2: "#40916c", p: "#52b788", ph: "#40916c", s: "#2d6a4f", sh: "#1b4332", w: "#95d5b2", wh: "#74c69d", done: "rgba(220,235,223,.95)", light: true },
    rosegold: { bg: "#fff1f2", g: "linear-gradient(#fff1f2,#ffe4e6)",                        card: "rgba(255,255,255,.92)", text: "#6b2737", t2: "#9d4e61", p: "#d17b88", ph: "#bb6372", s: "#c06c84", sh: "#a65470", w: "#f4a261", wh: "#e76f51", done: "rgba(245,225,230,.96)", light: true },
    sakura:   { bg: "#fff0f6", g: "linear-gradient(#fff0f6,#ffd6e7)",                        card: "rgba(255,255,255,.92)", text: "#742f57", t2: "#b56576", p: "#ff70a6", ph: "#ff4d8d", s: "#ff85a1", sh: "#ff5c8a", w: "#ffc8dd", wh: "#ffafcc", done: "rgba(255,225,235,.96)", light: true }
};

// Picks black or white text, whichever contrasts better with a hex background
function readableOn(hex) {
    const [r, g, b] = [1, 3, 5]
        .map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.179 ? "#111" : "#fff";
}

function applyTheme(name) {
    const key = THEMES[name] ? name : "default";
    const t = THEMES[key];
    const ink = t.light ? "0,0,0" : "255,255,255"; // border/field/track must contrast with the theme

    const vars = {
        "--bg": t.bg,
        "--body-gradient": t.g,
        "--card": t.card,
        "--text": t.text,
        "--text-secondary": t.t2,
        "--primary": t.p,
        "--primary-hover": t.ph,
        "--success": t.s,
        "--success-hover": t.sh,
        "--warning": t.w,
        "--warning-hover": t.wh,
        "--completed-card": t.done,
        "--on-primary": readableOn(t.p),
        "--on-success": readableOn(t.s),
        "--on-warning": readableOn(t.w),
        "--border": `rgba(${ink},${t.light ? .12 : .08})`,
        "--field": `rgba(${ink},.06)`,
        "--track": `rgba(${ink},${t.light ? .12 : .10})`
    };

    Object.entries(vars).forEach(([k, v]) =>
        document.documentElement.style.setProperty(k, v)
    );

    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t.bg);

    store.set(THEME_KEY, key);
    return key;
}

/* ==========================================================
   Dialogs
   ========================================================== */
function openHabitDialog(id = null) {
    editingId = id;
    const habit = id ? find(id) : null;

    $("habitDialogTitle").textContent = habit ? "Edit Habit" : "Add Habit";
    $("habitSubmitBtn").textContent = habit ? "Save changes" : "Add habit";
    $("habitName").value = habit?.name ?? "";
    $("habitTier").value = habit?.tier ?? "";
    $("habitTime").value = habit?.scheduled ?? "";

    $("habitDialog").showModal();
}

function submitHabitForm(event) {
    event.preventDefault();

    const name = $("habitName").value.trim();
    if (!name) {
        $("habitName").focus();
        return;
    }

    const data = {
        name,
        tier: Number($("habitTier").value),
        scheduled: $("habitTime").value
    };

    if (editingId && find(editingId)) {
        Object.assign(find(editingId), data);
    } else {
        tasks.push(normalizeHabit(data));
    }

    commit();
    $("habitDialog").close();
}

/* ==========================================================
   Events
   ========================================================== */
function bindEvents() {
    const list = $("habitList");

    // One delegated listener for every card button
    list.addEventListener("click", e => {
        const btn = e.target.closest("[data-action]");
        const id = btn?.closest("[data-id]")?.dataset.id;
        if (!id) return;

        ({
            toggle: () => toggleToday(id),
            edit: () => openHabitDialog(id),
            archive: () => archiveHabit(id),
            detail: () => openDetail(id),
            skip: () => skipHabit(id)
        })[btn.dataset.action]?.();
    });

    // Notes autosave when the textarea loses focus (no re-render, so no lost typing)
    list.addEventListener("change", e => {
        if (!e.target.matches(".notes-editor")) return;
        const habit = find(e.target.closest("[data-id]")?.dataset.id);
        if (habit) {
            habit.notes = e.target.value;
            saveTasks();
        }
    });

    // Remember which notes panels are open ("toggle" doesn't bubble, so capture)
    list.addEventListener("toggle", e => {
        if (!e.target.matches("details.notes")) return;
        const id = e.target.closest("[data-id]")?.dataset.id;
        if (!id) return;
        e.target.open ? openNotes.add(id) : openNotes.delete(id);
    }, true);

    // View switcher
    document.querySelectorAll("[data-view]").forEach(btn =>
        btn.addEventListener("click", () => {
            currentView = btn.dataset.view;
            skipped = [];
            store.set(VIEW_KEY, currentView);
            render();
        })
    );

    // Dialogs: close on backdrop click or any [data-close] button
    document.querySelectorAll("dialog").forEach(dialog =>
        dialog.addEventListener("click", e => {
            if (e.target === dialog || e.target.closest("[data-close]")) dialog.close();
        })
    );

    $("addHabitMenuBtn").addEventListener("click", () => openHabitDialog());
    $("habitForm").addEventListener("submit", submitHabitForm);
    $("settingsBtn").addEventListener("click", () => $("settingsDialog").showModal());

    $("exportBtn").addEventListener("click", exportJson);
    $("resetBtn").addEventListener("click", resetAll);

    $("importFile").addEventListener("change", e => {
        const file = e.target.files[0];
        e.target.value = ""; // allow re-importing the same file
        if (file) importJson(file);
    });

    $("themeSelector").addEventListener("change", e => applyTheme(e.target.value));

    // Quick toggles
    $("hideCompletedBtn").addEventListener("click", () => {
        settings.hideCompleted = !settings.hideCompleted;
        saveSettings();
        render();
    });

    $("badDayBtn").addEventListener("click", () => {
        settings.badDay = isBadDay() ? null : dayKey();
        saveSettings();
        render();
    });

    // Preferences
    $("sortSelect").addEventListener("change", e => {
        settings.sort = e.target.value;
        saveSettings();
        render();
    });

    $("weekStartSelect").addEventListener("change", e => {
        settings.weekStart = e.target.value;
        saveSettings();
        render();
    });

    // Backup reminder
    $("nudgeExportBtn").addEventListener("click", exportJson);
    $("nudgeLaterBtn").addEventListener("click", () => {
        settings.nudgeDismissed = Date.now();
        saveSettings();
        render();
    });

    // Archive
    $("archiveBtn").addEventListener("click", () => {
        $("settingsDialog").close();
        renderArchive();
        $("archiveDialog").showModal();
    });

    $("archiveList").addEventListener("click", e => {
        const btn = e.target.closest("[data-action]");
        const id = btn?.closest("[data-id]")?.dataset.id;
        if (!id) return;

        if (btn.dataset.action === "restore") restoreHabit(id);
        if (btn.dataset.action === "delete") deleteHabit(id);
    });

    // Import: merge or replace
    $("importMergeBtn").addEventListener("click", () => applyImport("merge"));
    $("importReplaceBtn").addEventListener("click", () => applyImport("replace"));
    $("importDialog").addEventListener("close", () => { pendingImport = null; });

    // Install as an app
    window.addEventListener("beforeinstallprompt", e => {
        e.preventDefault();
        installPrompt = e;
    });

    window.addEventListener("appinstalled", () => {
        installPrompt = null;
        $("installBtn").hidden = true;
    });

    $("installBtn").addEventListener("click", async () => {
        if (installPrompt) {
            installPrompt.prompt();
            await installPrompt.userChoice;
            installPrompt = null;
            return;
        }
        alert("To install: on iPhone or iPad, tap Share, then Add to Home Screen. " +
              "On Android or desktop Chrome, open the browser menu and choose Install app.");
    });

    // Stats dialog + per-habit detail sheet
    $("statsBtn").addEventListener("click", () => {
        renderStats();
        $("statsDialog").showModal();
    });

    document.querySelectorAll("[data-range]").forEach(btn =>
        btn.addEventListener("click", () => {
            statsRange = Number(btn.dataset.range);
            renderStats();
        })
    );

    // Re-render if the app is left open past midnight
    const checkRollover = () => {
        if (dayKey() !== today) {
            today = dayKey();
            render();
        }
    };
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) checkRollover();
    });
    setInterval(checkRollover, 60000);
}

/* ==========================================================
   Init
   ========================================================== */
function init() {
    $("habitTier").innerHTML =
        `<option value="" disabled selected>Tier</option>` +
        TIERS.map(t => `<option value="${t}">Tier ${t}</option>`).join("");

    document.querySelectorAll("[data-icon]").forEach(el => {
        el.innerHTML = icon(el.dataset.icon);
    });

    const savedView = store.get(VIEW_KEY);
    currentView = VIEWS.includes(savedView) ? savedView : "standard";

    $("themeSelector").value = applyTheme(store.get(THEME_KEY) || "default");

    tasks = loadTasks();
    loadSettings();
    $("sortSelect").value = settings.sort;
    $("weekStartSelect").value = settings.weekStart;

    if (!hasPopover) {
        $("toast").removeAttribute("popover");
        $("toast").hidden = true;
    }
    if (matchMedia("(display-mode: standalone)").matches || navigator.standalone) {
        $("installBtn").hidden = true;
    }

    buildTierSummary();
    bindEvents();
    render();

    // Offline support + installability (needs http(s); skipped on file://)
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
        navigator.serviceWorker.register("sw.js").catch(console.error);
    }
}

init();
