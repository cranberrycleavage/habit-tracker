const STORAGE_KEY = "habitTrackerData_v1";

let tasks = loadTasks();
let currentView = "standard";
let tinderQueue = [];

console.log("APP LOADED");

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
                "habit";

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

<button class="complete-btn">
                ${
                    doneToday
                        ? "Completed Today"
                        : "Mark Complete"
                }
        </button>
    `;

} else {

    div.innerHTML = `
        <h3>${habit.name}</h3>

        <div class="info">
            🏆 Tier ${habit.tier}
        </div>

        <div class="info">
            ⏰ ${habit.scheduled}
        </div>

        <div class="info">
            ${
                streak > 0
                    ? `🔥 ${streak} day streak`
                    : `💤 No active streak`
            }
        </div>

        <div class="info">
            ✅ ${habit.completions.length} completions
        </div>

        <div class="habit-buttons">

<button
    class="complete-btn">
                ${
                    doneToday
                        ? "Completed Today"
                        : "Mark Complete"
                }
            </button>

            <button class="edit-btn">
                Edit
            </button>

            <button class="delete-btn">
                Delete
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
            🏆 Tier ${habit.tier}
        </div>

        <div class="info">
            ⏰ ${habit.scheduled}
        </div>

        <div class="info">
            ${
                streak > 0
                    ? `🔥 ${streak} day streak`
                    : `🎯 Start a new streak`
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
