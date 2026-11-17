const STORAGE_KEY = "habitTrackerData_v1";
const THEME_KEY = "habitTrackerTheme";

const themes = {
    default: {
        "--bg": "#102a13",
        "--bg-secondary": "#1f4d29",
        "--card": "rgba(31,77,41,.75)",
        "--text": "#f0fdf4",
        "--text-secondary": "#bbf7d0",
        "--primary": "#22c55e",
        "--primary-hover": "#16a34a",
        "--success": "#84cc16",
        "--success-hover": "#65a30d",
        "--warning": "#eab308",
        "--warning-hover": "#ca8a04",
        "--body-gradient":
            "radial-gradient(circle at top left,#14532d,#102a13 40%)",
"--edit": "#38bdf8",
"--edit-hover": "#0ea5e9",
"--delete": "#dc2626",
"--delete-hover": "#b91c1c",
"--completed-card": "rgba(20,45,24,.85)"
    },

    ocean: {
        "--bg": "#082f49",
        "--bg-secondary": "#0f4c75",
        "--card": "rgba(15,76,117,.72)",
        "--text": "#ecfeff",
        "--text-secondary": "#a5f3fc",
        "--primary": "#06b6d4",
        "--primary-hover": "#0891b2",
        "--success": "#14b8a6",
        "--success-hover": "#0f766e",
        "--warning": "#38bdf8",
        "--warning-hover": "#0284c7",
        "--body-gradient":
            "radial-gradient(circle at top left,#0ea5e9,#082f49 45%)",
"--edit": "#67e8f9",
"--edit-hover": "#22d3ee",
"--delete": "#ef4444",
"--delete-hover": "#dc2626",
"--completed-card": "rgba(8,35,55,.88)"
    },

    sunset: {
        "--bg": "#431407",
        "--bg-secondary": "#7c2d12",
        "--card": "rgba(124,45,18,.75)",
        "--text": "#fff7ed",
        "--text-secondary": "#fdba74",
        "--primary": "#f97316",
        "--primary-hover": "#ea580c",
        "--success": "#fb7185",
        "--success-hover": "#e11d48",
        "--warning": "#fbbf24",
        "--warning-hover": "#d97706",
        "--body-gradient":
            "radial-gradient(circle at top left,#f97316,#431407 40%)",
"--edit": "#fb7185",
"--edit-hover": "#e11d48",
"--delete": "#dc2626",
"--delete-hover": "#991b1b",
"--completed-card": "rgba(80,25,12,.88)"
    },

    lavender: {
        "--bg": "#2e1065",
        "--bg-secondary": "#5b21b6",
        "--card": "rgba(91,33,182,.70)",
        "--text": "#faf5ff",
        "--text-secondary": "#d8b4fe",
        "--primary": "#a855f7",
        "--primary-hover": "#9333ea",
        "--success": "#c084fc",
        "--success-hover": "#a855f7",
        "--warning": "#f472b6",
        "--warning-hover": "#db2777",
        "--body-gradient":
            "radial-gradient(circle at top left,#8b5cf6,#2e1065 40%)",
"--edit": "#60a5fa",
"--edit-hover": "#3b82f6",
"--delete": "#ef4444",
"--delete-hover": "#dc2626",
"--completed-card": "rgba(55,20,120,.85)"
    },
matcha: {
    "--bg": "#e8f5e9",
    "--bg-secondary": "#c8e6c9",
    "--card": "rgba(255,255,255,.90)",
    "--text": "#1b4332",
    "--text-secondary": "#40916c",
    "--primary": "#52b788",
    "--primary-hover": "#40916c",
    "--success": "#2d6a4f",
    "--success-hover": "#1b4332",
    "--warning": "#95d5b2",
    "--warning-hover": "#74c69d",
    "--body-gradient":
        "linear-gradient(#d8f3dc,#f4fff7)",
"--edit": "#40916c",
"--edit-hover": "#2d6a4f",
"--delete": "#d62828",
"--delete-hover": "#b71c1c",
"--completed-card": "rgba(220,235,223,.95)"
},
coffee: {
    "--bg": "#2b1d16",
    "--bg-secondary": "#4e342e",
    "--card": "rgba(78,52,46,.85)",
    "--text": "#f5ebe0",
    "--text-secondary": "#d5bdaf",
    "--primary": "#a98467",
    "--primary-hover": "#8c6d54",
    "--success": "#7f5539",
    "--success-hover": "#5e412f",
    "--warning": "#ddb892",
    "--warning-hover": "#c79a72",
    "--body-gradient":
        "radial-gradient(circle at top left,#6f4e37,#2b1d16 50%)",
"--edit": "#90caf9",
"--edit-hover": "#64b5f6",
"--delete": "#e57373",
"--delete-hover": "#ef5350",
"--completed-card": "rgba(55,35,30,.92)"
},
sakura: {
    "--bg": "#fff0f6",
    "--bg-secondary": "#ffd6e7",
    "--card": "rgba(255,255,255,.92)",
    "--text": "#742f57",
    "--text-secondary": "#b56576",
    "--primary": "#ff70a6",
    "--primary-hover": "#ff4d8d",
    "--success": "#ff85a1",
    "--success-hover": "#ff5c8a",
    "--warning": "#ffc8dd",
    "--warning-hover": "#ffafcc",
    "--body-gradient":
        "linear-gradient(#fff0f6,#ffd6e7)",
    "--edit": "#ff70a6",
    "--edit-hover": "#ff4d8d",
    "--delete": "#c9184a",
    "--delete-hover": "#a4133c",
"--completed-card": "rgba(255,225,235,.96)"
},
rosegold: {
    "--bg": "#fff1f2",
    "--bg-secondary": "#ffe4e6",
    "--card": "rgba(255,255,255,.92)",
    "--text": "#6b2737",
    "--text-secondary": "#9d4e61",
    "--primary": "#d17b88",
    "--primary-hover": "#bb6372",
    "--success": "#c06c84",
    "--success-hover": "#a65470",
    "--warning": "#f4a261",
    "--warning-hover": "#e76f51",
    "--body-gradient":
        "linear-gradient(#fff1f2,#ffe4e6)",
"--edit": "#b56576",
"--edit-hover": "#9d4e61",
"--delete": "#c9184a",
"--delete-hover": "#a4133c",
"--completed-card": "rgba(245,225,230,.96)"
},
    terminal: {
        "--bg": "#001100",
        "--bg-secondary": "#002200",
        "--card": "rgba(0,34,0,.85)",
        "--text": "#00ff66",
        "--text-secondary": "#66ff99",
        "--primary": "#00ff66",
        "--primary-hover": "#00cc52",
        "--success": "#00ff99",
        "--success-hover": "#00cc77",
        "--warning": "#99ff00",
        "--warning-hover": "#77cc00",
        "--body-gradient":
            "linear-gradient(#001100,#000000)",
"--edit": "#00ffff",
"--edit-hover": "#00cccc",
"--delete": "#ff4444",
"--delete-hover": "#cc2222",
"--completed-card": "rgba(0,18,0,.95)"
    },
};

function applyTheme(themeName) {
    const theme = themes[themeName] || themes.default;

    Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
    });

    localStorage.setItem(THEME_KEY, themeName);
}

function loadTheme() {
    const saved =
        localStorage.getItem(THEME_KEY) || "default";

    applyTheme(saved);

    const selector =
        document.getElementById("themeSelector");

    if (selector) {
        selector.value = saved;
    }
}

let tasks = loadTasks();
let currentView = "standard";
let tinderQueue = [];

console.log("APP LOADED");
function updateTierCounters() {
    const stats = {
        1: { total: 0, completed: 0 },
        2: { total: 0, completed: 0 },
        3: { total: 0, completed: 0 },
        4: { total: 0, completed: 0 },
        5: { total: 0, completed: 0 }
    };

    tasks.forEach(habit => {
        const tier = Number(habit.tier);

        if (!stats[tier]) return;

        stats[tier].total++;

        if (completedToday(habit)) {
            stats[tier].completed++;
        }
    });




for (let tier = 1; tier <= 5; tier++) {

    const counter =
        document.getElementById(
            `tier${tier}Counter`
        );

    const bar =
        document.getElementById(
            `tier${tier}Bar`
        );

    const completed =
        stats[tier].completed;

    const total =
        stats[tier].total;

    counter.textContent =
        `Tier ${tier} - ${completed}/${total}`;

    const percent =
        total === 0
            ? 0
            : (completed / total) * 100;

    if (bar) {
        bar.style.width =
            `${percent}%`;
    }
}




}


renderHabits();

function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function updateState() {
    saveTasks();
    renderHabits();
}

function createHabit(name, tier, scheduled) {
    return {
        id: Date.now().toString(),
        name,
        tier: Number(tier),
        scheduled,
        completions: []
    };
}

function loadTasks() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

function saveTasks() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );
}

function addHabit(name, tier, scheduled) {
    tasks.push(
        createHabit(
            name,
            tier,
            scheduled
        )
    );

    updateState();
}

function completeHabit(id) {
    const habit =
        tasks.find(
            h => h.id === id
        );

    if (!habit) {
        return;
    }

    if (completedToday(habit)) {
        return;
    }

    habit.completions.push(
        new Date().toISOString()
    );
tinderQueue = tinderQueue.filter(
    queueId => queueId !== id
);
    updateState();
}

function undoTodayCompletion(id) {
    const habit =
        tasks.find(
            h => h.id === id
        );

    if (!habit) {
        return;
    }

    const today =
        startOfDay(
            new Date()
        ).getTime();

    habit.completions =
        habit.completions.filter(
            completion =>
                startOfDay(
                    completion
                ).getTime() !== today
        );

    updateState();
}


function deleteHabit(id) {
    if (!confirm("Delete this habit?")) {
        return;
    }

    tasks = tasks.filter(habit => habit.id !== id);

    tinderQueue = tinderQueue.filter(
        queueId => queueId !== id
    );

    updateState();
}

function editHabit(id) {
    const habit = tasks.find(
        h => h.id === id
    );

    if (!habit) {
        return;
    }

    const newName = prompt(
        "Habit name:",
        habit.name
    );

    if (
        newName === null ||
        newName.trim() === ""
    ) {
        return;
    }

    const newTier = prompt(
        "Tier:",
        habit.tier
    );

    if (
        newTier === null ||
        newTier.trim() === ""
    ) {
        return;
    }

    const newTime = prompt(
        "Scheduled time:",
        habit.scheduled
    );

    if (
        newTime === null ||
        newTime.trim() === ""
    ) {
        return;
    }

    habit.name = newName.trim();
    habit.tier = Number(newTier);
    habit.scheduled = newTime;

    updateState();
}

function resetAll() {
    if (
        !confirm(
            "Remove all completion history?"
        )
    ) {
        return;
    }

    tasks.forEach(habit => {
        habit.completions = [];
    });

    updateState();
}

function completedToday(habit) {
    if (
        !habit.completions ||
        habit.completions.length === 0
    ) {
        return false;
    }

    const latest =
        startOfDay(
            habit.completions[
                habit.completions.length - 1
            ]
        );

    const today =
        startOfDay(
            new Date()
        );

    return (
        latest.getTime() ===
        today.getTime()
    );
}

function getStreak(habit) {
    if (
        !habit.completions ||
        habit.completions.length === 0
    ) {
        return 0;
    }

    const dates =
        habit.completions.map(
            d =>
                startOfDay(d)
                    .getTime()
        );

    const uniqueDates =
        [...new Set(dates)]
            .sort(
                (a, b) => b - a
            );

    const today =
        startOfDay(
            new Date()
        );

    const latest =
        new Date(
            uniqueDates[0]
        );

    const daysSinceLatest =
        (today - latest) /
        86400000;

    if (
        daysSinceLatest > 1
    ) {
        return 0;
    }

    let streak = 1;

    for (
        let i = 1;
        i < uniqueDates.length;
        i++
    ) {
        const diff =
            (
                uniqueDates[i - 1]
                - uniqueDates[i]
            ) / 86400000;

        if (diff === 1) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

function exportJson() {
    const blob = new Blob(
        [
            JSON.stringify(
                tasks,
                null,
                2
            )
        ],
        {
            type:
                "application/json"
        }
    );

    const url =
        URL.createObjectURL(
            blob
        );

    const a =
        document.createElement("a");

    a.href = url;
    a.download = "tasks.json";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}

function importJson(file) {
    const reader =
        new FileReader();

    reader.onload =
        function(event) {
            try {
                const imported =
                    JSON.parse(
                        event.target.result
                    );

                if (
                    !Array.isArray(
                        imported
                    )
                ) {
                    throw new Error(
                        "JSON must contain an array of habits."
                    );
                }

                tasks =
                    imported.map(
                        (
                            habit
                        ) => ({
                            id:
                                habit.id ??
                                Date.now().toString(),

                            name:
                                habit.name ??
                                "Unnamed Habit",

                            tier:
                                Number(
                                    habit.tier
                                ) || 1,

                            scheduled:
                                habit.scheduled ??
                                "",

                            completions:
                                Array.isArray(
                                    habit.completions
                                )
                                    ? habit.completions
                                    : []
                        })
                    );

                updateState();

                alert(
                    `Imported ${tasks.length} habits`
                );

            } catch (error) {

                console.error(
                    error
                );

                alert(
                    "Import failed:\n" +
                    error.message
                );
            }
        };

    reader.readAsText(file);
}

function renderHabits() {
updateTierCounters();
    if (
        currentView ===
        "tinder"
    ) {
        renderTinderView();
        return;
    }

    renderStandardView();
}

function renderStandardView() {
    const container =
        document.getElementById(
            "habitList"
        );

    container.innerHTML = "";

    const sortedTasks =
        [...tasks].sort(
            (a, b) =>
                a.scheduled.localeCompare(
                    b.scheduled
                )
        );

    sortedTasks.forEach(
        habit => {

            const doneToday =
                completedToday(
                    habit
                );

            const streak =
                getStreak(
                    habit
                );

            const div =
                document.createElement(
                    "div"
                );

            div.className =
    currentView === "compact"
        ? "habit compact-habit"
        : "habit";

            if (
                doneToday
            ) {
                div.classList.add(
                    "completed"
                );
            }

if (currentView === "compact") {

    div.innerHTML = `
        <h3>${habit.name}</h3>

<button class="complete-btn" >
    <img
        src="icons/${
            doneToday
                ? "circle-check.svg"
                : "circle.svg"
        }"
        alt="${
            doneToday
                ? "Completed"
                : "Incomplete"
        }"
        class="icon"
    />
</button>
`;



} else {

    div.innerHTML = `
        <h3>${habit.name}</h3>

<div class="info">
    <img src="icons/sparkles.svg" class="icon" alt=""> Tier ${habit.tier}
</div>

<div class="info">
    <img src="icons/clock.svg" class="icon" alt="">
    ${habit.scheduled}
</div>

<div class="info">
    <img 
src="icons/${
streak > 0
? "flame.svg"
: "snowflake.svg"}" class="icon" alt="">
    ${
        streak > 0
            ? `${streak} day streak`
            : `No active streak`
    }
</div>









<div class="info">
    <img src="icons/list-todo.svg" class="icon" alt="">
    ${habit.completions.length} completions
</div>



<button
    class="complete-btn">
    <img
        src="icons/${
            doneToday
                ? "circle-check.svg"
                : "circle.svg"
        }"
        alt="${
            doneToday
                ? "Completed"
                : "Incomplete"
        }"
        class="icon"
    />
            </button>

<button
    class="edit-btn"
    title="Edit Habit">
    <img
        src="icons/pencil.svg"
        alt="Edit"
        class="icon"
    >
</button>

<button
    class="delete-btn"
    title="Delete Habit">
    <img
        src="icons/trash.svg"
        alt="Delete"
        class="icon"
    >
</button>

        </div>
    `;
}
const completeBtn =
    div.querySelector(
        ".complete-btn"
    );

completeBtn.addEventListener(
    "click",
    () => {

        if (
            completedToday(
                habit
            )
        ) {

            undoTodayCompletion(
                habit.id
            );

        } else {

            completeHabit(
                habit.id
            );

        }
    }
);

const editBtn =
    div.querySelector(
        ".edit-btn"
    );

if (editBtn) {
    editBtn.addEventListener(
        "click",
        () =>
            editHabit(
                habit.id
            )
    );
}

const deleteBtn =
    div.querySelector(
        ".delete-btn"
    );

if (deleteBtn) {
    deleteBtn.addEventListener(
        "click",
        () =>
            deleteHabit(
                habit.id
            )
    );
}
container.appendChild(div);
}
);

}

function getTinderOrder() {
    const activeHabits = tasks
        .filter(h => !completedToday(h))
        .sort((a, b) =>
            a.scheduled.localeCompare(b.scheduled)
        );

    if (tinderQueue.length === 0) {
        tinderQueue = activeHabits.map(h => h.id);
    }

    tinderQueue = tinderQueue.filter(id =>
        activeHabits.some(h => h.id === id)
    );

    activeHabits.forEach(h => {
        if (!tinderQueue.includes(h.id)) {
            tinderQueue.push(h.id);
        }
    });

    return tinderQueue
        .map(id =>
            activeHabits.find(h => h.id === id)
        )
        .filter(Boolean);
}

function renderTinderView() {
    const container =
        document.getElementById(
            "habitList"
        );

    container.innerHTML = "";

    const orderedHabits =
        getTinderOrder();

    if (
        orderedHabits.length === 0
    ) {
        container.innerHTML = `
            <div class="habit">
                <h2>
                    🎉 All habits complete!
                </h2>
            </div>
        `;
        return;
    }

    const habit =
        orderedHabits[0];

    const streak =
        getStreak(
            habit
        );

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "habit tinder-card";

    card.innerHTML = `
        <h2>${habit.name}</h2>

        <div class="info">
<img src="icons/sparkles.svg" class="icon" alt=""> Tier ${habit.tier}
        </div>

        <div class="info">
    <img src="icons/clock.svg" class="icon" alt="">
    ${habit.scheduled}
        </div>

        <div class="info">

   <img 
src="icons/${
streak > 0
? "flame.svg"
: "snowflake.svg"}" class="icon" alt="">
    ${
        streak > 0
            ? `${streak} day streak`
            : `No active streak`
    }

        </div>

        <div class="tinder-buttons">

            <button
                id="skipHabitBtn"
                class="skip-btn">
                Skip
            </button>

            <button
                id="completeHabitBtn"
                class="complete-btn">
                Complete
            </button>

        </div>
    `;

    container.appendChild(
        card
    );

    document
        .getElementById(
            "completeHabitBtn"
        )
        .addEventListener(
            "click",
            () => {
                completeHabit(
                    habit.id
                );
            }
        );

    document
        .getElementById(
            "skipHabitBtn"
        )
        .addEventListener(
            "click",
            () => {

           	 tinderQueue.shift();
           	 tinderQueue.push(habit.id);
           	 renderTinderView();
            }
        );
}

document
    .getElementById(
        "addBtn"
    )
    .addEventListener(
        "click",
        () => {

            const name =
                document
                    .getElementById(
                        "habitName"
                    )
                    .value
                    .trim();

            const tier =
                document
                    .getElementById(
                        "habitTier"
                    )
                    .value;

            const time =
                document
                    .getElementById(
                        "habitTime"
                    )
                    .value;

            if (
                !name ||
                !tier ||
                !time
            ) {
                return;
            }

            addHabit(
                name,
                tier,
                time
            );

            document
                .getElementById(
                    "habitName"
                )
                .value = "";

            document
                .getElementById(
                    "habitTier"
                )
                .value = "";

            document
                .getElementById(
                    "habitTime"
                )
                .value = "";
        }
    );

document
    .getElementById(
        "resetBtn"
    )
    ?.addEventListener(
        "click",
        resetAll
    );

document
    .getElementById(
        "exportBtn"
    )
    ?.addEventListener(
        "click",
        exportJson
    );

document
    .getElementById(
        "importFile"
    )
    ?.addEventListener(
        "change",
        e => {

            const file =
                e.target.files[0];

            if (file) {
                importJson(
                    file
                );
            }
        }
    );

document
    .getElementById(
        "standardViewBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            currentView =
                "standard";

            tinderQueue = [];

            renderHabits();
        }
    );

document
    .getElementById(
        "compactViewBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            currentView =
                "compact";

            renderHabits();
        }
    );
document
    .getElementById("themeSelector")
    ?.addEventListener("change", e => {
        applyTheme(e.target.value);
    });

loadTheme();


document
    .getElementById(
        "tinderViewBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            currentView =
                "tinder";

            tinderQueue = [];

            renderHabits();
        }
    );
