import { projectInfo } from "./data.js";

function buildSectionTitle(icon, title) {
  return `<div class="section-label"><span class="icon">${icon}</span>${title}</div>`;
}

function renderDashboard(container) {
  container.innerHTML = `
    <div class="card">
      <h2>${projectInfo.title}</h2>
      <p>${projectInfo.subtitle}</p>
    </div>
    <div class="card card-grid grid-2">
      ${projectInfo.overview
        .map(
          (item) => `
        <div>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </div>`
        )
        .join("")}
    </div>
    <div class="card">
      ${buildSectionTitle("📌", "מקור התוכן")}
      <table class="info-table">
        <tbody>
          ${projectInfo.infoRows
            .map(
              (row) => `
            <tr>
              <th>${row.label}</th>
              <td>${row.value}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderTrainer(container) {
  // Interactive trainer with checklist saved to localStorage
  const storageKey = "trainer.checklist.v1";
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
  const checklist = saved || projectInfo.plan.map((p) => ({ id: p.phase, title: p.title, done: false }));

  container.innerHTML = `
    <div class="card">
      ${buildSectionTitle("🧭", "מאמן")}
      <p>השתמש ברשימת המשימות למטה כדי לעקוב אחרי השלבים, לשמור התקדמות ולחזור אליהם מאוחר יותר.</p>
    </div>
    <div class="card">
      <div class="card-grid">
        ${projectInfo.trainer
          .map(
            (item) => `
          <div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </div>`
          )
          .join("")}
      </div>
    </div>
    <div class="card">
      ${buildSectionTitle("✅", "רשימת משימות - מעקב")}
      <div id="trainer-checklist"></div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end;">
        <button id="save-checklist" class="copy-button">שמור</button>
        <button id="clear-checklist" class="copy-button">נקה</button>
      </div>
    </div>
  `;

  const listContainer = container.querySelector("#trainer-checklist");

  function renderChecklist() {
    listContainer.innerHTML = checklist
      .map(
        (item, idx) => `
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px dashed #eef4fb;">
            <input type="checkbox" id="chk-${idx}" data-idx="${idx}" ${item.done ? "checked" : ""} />
            <label for="chk-${idx}">${item.title}</label>
          </div>`
      )
      .join("");

    // attach handlers
    listContainer.querySelectorAll("input[type=checkbox]").forEach((cb) => {
      cb.addEventListener("change", (e) => {
        const idx = Number(cb.dataset.idx);
        checklist[idx].done = cb.checked;
      });
    });
  }

  renderChecklist();

  container.querySelector("#save-checklist").addEventListener("click", () => {
    localStorage.setItem(storageKey, JSON.stringify(checklist));
    const btn = container.querySelector("#save-checklist");
    btn.textContent = "נשמר";
    setTimeout(() => (btn.textContent = "שמור"), 900);
  });

  container.querySelector("#clear-checklist").addEventListener("click", () => {
    checklist.forEach((it) => (it.done = false));
    localStorage.removeItem(storageKey);
    renderChecklist();
  });
}

const promptsStorageKey = "promptTrainer.prompts.v1";

function getCategorySvg(category) {
  const svgMap = {
    "ייעוץ AI": `
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4h16v12H9l-5 5V4Z" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 8h8M8 12h5" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`,
    "בניית פרומפט": `
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 19h14" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round"/>
        <path d="m7 10.5 6.25 6.25L21 9.5 14.25 2.75 7 10.5Z" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    "ניתוח": `
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 16V6h16v10" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 13l2-2 3 3 5-5" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    "צמיחה": `
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 20 20 4" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M14 4h6v6" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M10 10l4-4" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`,
    "מחקר": `
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="6" stroke="#2563eb" stroke-width="1.8"/>
        <path d="m14.5 14.5 5 5" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`,
    "ניסוי": `
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2h8l1 6.5c.2 1.2-.4 2.4-1.4 3.1L13 14v6H9v-6L5.4 11.6A3.12 3.12 0 0 1 4 8.5L5 2Z" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 8h4" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`,
  };
  return svgMap[category] || `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="#2563eb" stroke-width="1.8"/>
    </svg>`;
}

function getSavedPrompts() {
  const saved = localStorage.getItem(promptsStorageKey);
  return saved ? JSON.parse(saved) : null;
}

function savePrompts(prompts) {
  localStorage.setItem(promptsStorageKey, JSON.stringify(prompts));
}

function createPromptId() {
  return `prompt-${Date.now()}`;
}

function renderPrompts(container) {
  let promptsState = getSavedPrompts() || [...projectInfo.prompts];
  let editingId = null;

  container.innerHTML = `
    <div class="card">
      ${buildSectionTitle("📋", "פרומפטים מוכנים")}
      <p>בחר פרומפט, חפש או סנן לפי קטגוריה, ונהל פרומפטים עם יצירה, עדכון וייצוא.</p>
    </div>

    <div class="card">
      <div class="toolbar" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px;justify-content:space-between;">
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
          <input id="prompt-search" class="search-input" placeholder="חפש פרומפט או כותרת..." />
          <select id="prompt-category">
            <option value="">הכל</option>
            ${[...new Set(promptsState.map((p) => p.category))]
              .map((c) => `<option value="${c}">${c}</option>`)
              .join("")}
          </select>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;">
          <button id="export-json" class="copy-button">ייצא JSON</button>
          <button id="copy-all" class="copy-button">העתק הכל</button>
        </div>
      </div>

      <table class="prompts-table">
        <thead>
          <tr>
            <th>אייקון</th>
            <th>קטגוריה</th>
            <th>כותרת</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody id="prompts-tbody"></tbody>
      </table>
    </div>

    <div class="card">
      <h3>ניהול פרומפטים</h3>
      <div class="prompt-form-grid">
        <label>
          כותרת
          <input id="prompt-title" class="search-input" placeholder="הזן שם לפרומפט" />
        </label>
        <label>
          קטגוריה
          <input id="prompt-category-input" class="search-input" placeholder="לדוגמה: מחקר" />
        </label>
        <label style="grid-column:1/-1;">
          תוכן הפרומפט
          <textarea id="prompt-content" class="prompt-textarea" placeholder="כתוב כאן את טקסט הפרומפט"></textarea>
        </label>
        <div style="grid-column:1/-1;display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;">
          <button id="save-prompt" class="copy-button">הוסף/עדכן פרומפט</button>
          <button id="reset-prompt" class="copy-button">נקה טופס</button>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>פרומפט פעיל</h3>
      <p id="prompt-preview">בחר שורה בטבלה כדי לראות את הטקסט כאן.</p>
    </div>
  `;

  const search = container.querySelector("#prompt-search");
  const filterCategory = container.querySelector("#prompt-category");
  const tbody = container.querySelector("#prompts-tbody");
  const preview = container.querySelector("#prompt-preview");
  const copyAllBtn = container.querySelector("#copy-all");
  const exportJsonBtn = container.querySelector("#export-json");
  const titleInput = container.querySelector("#prompt-title");
  const categoryInput = container.querySelector("#prompt-category-input");
  const contentInput = container.querySelector("#prompt-content");
  const savePromptBtn = container.querySelector("#save-prompt");
  const resetPromptBtn = container.querySelector("#reset-prompt");

  function getFilteredPrompts() {
    const text = search.value.trim().toLowerCase();
    const category = filterCategory.value;
    return promptsState
      .filter((p) => (category ? p.category === category : true))
      .filter((p) =>
        text
          ? (p.title + p.content + p.category).toLowerCase().includes(text)
          : true
      );
  }

  function renderTableRows() {
    const rows = getFilteredPrompts()
      .map(
        (prompt) => `
          <tr data-id="${prompt.id}">
            <td>${getCategorySvg(prompt.category)}</td>
            <td>${prompt.category}</td>
            <td>${prompt.title}</td>
            <td class="prompt-actions">
              <button type="button" class="copy-button" data-action="copy" data-id="${prompt.id}">העתק</button>
              <button type="button" class="copy-button" data-action="edit" data-id="${prompt.id}">ערוך</button>
              <button type="button" class="copy-button" data-action="delete" data-id="${prompt.id}">מחק</button>
            </td>
          </tr>`
      )
      .join("");

    tbody.innerHTML = rows || '<tr><td colspan="4">לא נמצאו פרומפטים</td></tr>';
    attachRowListeners();
  }

  function attachRowListeners() {
    tbody.querySelectorAll("button").forEach((button) => {
      const action = button.dataset.action;
      const id = button.dataset.id;
      button.addEventListener("click", async (e) => {
        e.stopPropagation();
        const prompt = promptsState.find((p) => p.id === id);
        if (!prompt) return;

        if (action === "copy") {
          await navigator.clipboard.writeText(prompt.content);
          preview.textContent = prompt.content;
          tbody.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
          button.classList.add("active");
        }

        if (action === "edit") {
          editingId = prompt.id;
          titleInput.value = prompt.title;
          categoryInput.value = prompt.category;
          contentInput.value = prompt.content;
          savePromptBtn.textContent = "עדכן פרומפט";
        }

        if (action === "delete") {
          promptsState = promptsState.filter((p) => p.id !== id);
          savePrompts(promptsState);
          updateCategoryOptions();
          renderTableRows();
          preview.textContent = "פרומפט נמחק";
        }
      });
    });

    tbody.querySelectorAll("tr[data-id]").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        const id = row.dataset.id;
        const prompt = promptsState.find((p) => p.id === id);
        if (prompt) preview.textContent = prompt.content;
      });
    });
  }

  function updateCategoryOptions() {
    const categories = [...new Set(promptsState.map((p) => p.category))];
    filterCategory.innerHTML = `
      <option value="">הכל</option>
      ${categories.map((c) => `<option value="${c}">${c}</option>`).join("")}
    `;
  }

  function resetForm() {
    editingId = null;
    titleInput.value = "";
    categoryInput.value = "";
    contentInput.value = "";
    savePromptBtn.textContent = "הוסף/עדכן פרומפט";
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(promptsState, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "prompt-trainer-data.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  renderTableRows();

  search.addEventListener("input", renderTableRows);
  filterCategory.addEventListener("change", renderTableRows);

  savePromptBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const category = categoryInput.value.trim();
    const content = contentInput.value.trim();
    if (!title || !category || !content) {
      alert("אנא מלא כותרת, קטגוריה ותוכן פרומפט.");
      return;
    }

    if (editingId) {
      promptsState = promptsState.map((p) =>
        p.id === editingId ? { ...p, title, category, content } : p
      );
    } else {
      promptsState.push({ id: createPromptId(), icon: "💡", category, title, content });
    }

    savePrompts(promptsState);
    updateCategoryOptions();
    renderTableRows();
    resetForm();
  });

  resetPromptBtn.addEventListener("click", () => {
    resetForm();
  });

  copyAllBtn.addEventListener("click", async () => {
    const text = getFilteredPrompts().map((p) => `# ${p.title}\n${p.content}`).join("\n\n");
    await navigator.clipboard.writeText(text);
    copyAllBtn.textContent = "הועתק!";
    copyAllBtn.classList.add("active");
    setTimeout(() => {
      copyAllBtn.textContent = "העתק הכל";
      copyAllBtn.classList.remove("active");
    }, 1200);
  });

  exportJsonBtn.addEventListener("click", () => {
    downloadJson();
  });
}

function renderPlan(container) {
  container.innerHTML = `
    <div class="card">
      ${buildSectionTitle("🗓️", "תוכנית עבודה")}
      <p>חמישה שלבים פשוטים שפועלים יחד כדי לבנות את היישום ביום אחד.</p>
    </div>
    <div class="card">
      <table class="plan-table">
        <thead>
          <tr>
            <th>שלב</th>
            <th>כותרת</th>
            <th>תיאור</th>
          </tr>
        </thead>
        <tbody>
          ${projectInfo.plan
            .map(
              (item) => `
            <tr>
              <td>${item.phase}</td>
              <td>${item.title}</td>
              <td>${item.details}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderTabs(activeTab) {
  const tabs = document.querySelectorAll(".tab");
  const drawerLinks = document.querySelectorAll(".drawer-link");

  tabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === activeTab);
  });

  drawerLinks.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === activeTab);
  });
}

function renderTabContent(tab) {
  const container = document.getElementById("tab-content");
  switch (tab) {
    case "trainer":
      renderTrainer(container);
      break;
    case "prompts":
      renderPrompts(container);
      break;
    case "plan":
      renderPlan(container);
      break;
    default:
      renderDashboard(container);
      break;
  }
}

function initUI() {
  const tabButtons = document.querySelectorAll(".tab");
  const drawerButtons = document.querySelectorAll(".drawer-link");
  const drawerToggle = document.getElementById("drawer-toggle");
  const drawer = document.getElementById("drawer");
  const defaultTab = "dashboard";

  function switchTab(tabId) {
    renderTabs(tabId);
    renderTabContent(tabId);
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  drawerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchTab(button.dataset.tab);
      if (drawer.classList.contains("open")) {
        drawer.classList.remove("open");
      }
    });
  });

  drawerToggle.addEventListener("click", () => {
    drawer.classList.toggle("open");
  });

  switchTab(defaultTab);
}

export { initUI };
