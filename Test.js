document.addEventListener("DOMContentLoaded", () => {
    const UNI_STORAGE_KEY = "daywise_uni_classes";
    const WORK_STORAGE_KEY = "daywise_work_shifts";

    const uniForm = document.getElementById("uniForm");
    const workForm = document.getElementById("workForm");
    const uniTable = document.getElementById("uniTable");
    const workTable = document.getElementById("workTable");
    const uniCount = document.getElementById("uniCount");
    const workCount = document.getElementById("workCount");
    const hoursEl = document.getElementById("hours");
    const reminderEl = document.getElementById("reminder");

    function safeParse(value) {
        try {
            return JSON.parse(value);
        } catch (error) {
            return null;
        }
    }

    function loadData(key) {
        const raw = localStorage.getItem(key);
        const parsed = safeParse(raw);
        return Array.isArray(parsed) ? parsed : [];
    }

    function saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function formatPlural(count, singular, plural) {
        return `${count} ${count === 1 ? singular : plural}`;
    }

    function parseTime(value) {
        const [hours, minutes] = value.split(":").map(Number);
        if (
            Number.isInteger(hours) &&
            Number.isInteger(minutes) &&
            hours >= 0 &&
            hours < 24 &&
            minutes >= 0 &&
            minutes < 60
        ) {
            return hours * 60 + minutes;
        }
        return null;
    }

    function getDuration(start, end) {
        const startMinutes = parseTime(start);
        const endMinutes = parseTime(end);

        if (startMinutes === null || endMinutes === null) {
            return 0;
        }

        const duration = endMinutes - startMinutes;
        return duration > 0 ? duration / 60 : 0;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderUniTable(entries) {
        uniTable.innerHTML = "";

        entries.forEach((entry) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${escapeHtml(entry.moduleName)}</td>
                <td>${escapeHtml(entry.day)}</td>
                <td>${escapeHtml(entry.timeRange)}</td>
            `;
            uniTable.appendChild(row);
        });

        uniCount.textContent = formatPlural(entries.length, "Class", "Classes");
    }

    function renderWorkTable(entries) {
        workTable.innerHTML = "";

        entries.forEach((entry) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${escapeHtml(entry.company)}</td>
                <td>${escapeHtml(entry.day)}</td>
                <td>${escapeHtml(entry.hours.toFixed(2))} hrs</td>
            `;
            workTable.appendChild(row);
        });

        workCount.textContent = formatPlural(entries.length, "Shift", "Shifts");
        const totalHours = entries.reduce((sum, item) => sum + item.hours, 0);
        hoursEl.textContent = `${totalHours.toFixed(2)} hrs`;
    }

    function updateReminder(classEntries, workEntries) {
        const total = classEntries.length + workEntries.length;

        if (total === 0) {
            reminderEl.textContent = "None";
            return;
        }

        if (!classEntries.length) {
            reminderEl.textContent = `${workEntries.length} upcoming ${workEntries.length === 1 ? "shift" : "shifts"}`;
            return;
        }

        if (!workEntries.length) {
            reminderEl.textContent = `${classEntries.length} upcoming ${classEntries.length === 1 ? "class" : "classes"}`;
            return;
        }

        reminderEl.textContent = `${total} upcoming events`;
    }

    function updateDisplay(classEntries, workEntries) {
        renderUniTable(classEntries);
        renderWorkTable(workEntries);
        updateReminder(classEntries, workEntries);
    }

    function showAlert(message) {
        window.alert(message);
    }

    const savedUniClasses = loadData(UNI_STORAGE_KEY);
    const savedWorkShifts = loadData(WORK_STORAGE_KEY);

    updateDisplay(savedUniClasses, savedWorkShifts);

    if (uniForm) {
        uniForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const moduleName = document.getElementById("moduleName").value.trim();
            const day = document.getElementById("uniDay").value;
            const start = document.getElementById("uniStart").value;
            const end = document.getElementById("uniEnd").value;

            if (!moduleName) {
                showAlert("Enter the module name.");
                return;
            }

            if (!day) {
                showAlert("Select the day for the class.");
                return;
            }

            if (!start || !end) {
                showAlert("Enter both start and end times for the class.");
                return;
            }

            const duration = getDuration(start, end);

            if (!duration) {
                showAlert("The class end time must be after the start time.");
                return;
            }

            savedUniClasses.push({
                id: Date.now().toString(36),
                moduleName,
                day,
                timeRange: `${start} - ${end}`
            });

            saveData(UNI_STORAGE_KEY, savedUniClasses);
            updateDisplay(savedUniClasses, savedWorkShifts);
            uniForm.reset();
            document.getElementById("moduleName").focus();
        });
    }

    if (workForm) {
        workForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const company = document.getElementById("company").value.trim();
            const day = document.getElementById("workDay").value;
            const start = document.getElementById("workStart").value;
            const end = document.getElementById("workEnd").value;

            if (!company) {
                showAlert("Enter the company name.");
                return;
            }

            if (!day) {
                showAlert("Select the work day.");
                return;
            }

            if (!start || !end) {
                showAlert("Enter both start and end times for the shift.");
                return;
            }

            const hours = getDuration(start, end);

            if (!hours) {
                showAlert("The shift end time must be after the start time.");
                return;
            }

            savedWorkShifts.push({
                id: Date.now().toString(36),
                company,
                day,
                hours
            });

            saveData(WORK_STORAGE_KEY, savedWorkShifts);
            updateDisplay(savedUniClasses, savedWorkShifts);
            workForm.reset();
            document.getElementById("company").focus();
        });
    }
});