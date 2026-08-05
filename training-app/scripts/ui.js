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
  container.innerHTML = `
    <div class="card">
      ${buildSectionTitle("🧭", "מאמן")}
      <p>קטע זה מסביר איך להשתמש ביישום כדי לייעץ, ליצור פרומפטים ולהעתיק אותם בקלות.</p>
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
  `;
}

function renderPrompts(container) {
  container.innerHTML = `
    <div class="card">
      ${buildSectionTitle("📋", "פרומפטים מוכנים")}
      <p>בחר פרומפט, חפש או סנן לפי קטגוריה, והעתק בקליק.</p>
    </div>

    <div class="card">
      <div class="toolbar" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
        <input id="prompt-search" class="search-input" placeholder="חפש פרומפט או כותרת..." />
        <select id="prompt-category">
          <option value="">הכל</option>
          ${[...new Set(projectInfo.prompts.map((p) => p.category))]
            .map((c) => `<option value="${c}">${c}</option>`)
            .join("")}
        </select>
        <button id="copy-all" class="copy-button">העתק הכל</button>
      </div>

      <table class="prompts-table">
        <thead>
          <tr>
            <th>אייקון</th>
            <th>קטגוריה</th>
            <th>כותרת</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody id="prompts-tbody"></tbody>
      </table>
    </div>

    <div class="card">
      <h3>פרומפט פעיל</h3>
      <p id="prompt-preview">בחר שורה בטבלה כדי לראות את הטקסט כאן.</p>
    </div>
  `;

  const search = container.querySelector("#prompt-search");
  const category = container.querySelector("#prompt-category");
  const tbody = container.querySelector("#prompts-tbody");
  const preview = container.querySelector("#prompt-preview");
  const copyAllBtn = container.querySelector("#copy-all");

  function renderTableRows(filterText = "", filterCategory = "") {
    const text = filterText.trim().toLowerCase();
    const rows = projectInfo.prompts
      .filter((p) => (filterCategory ? p.category === filterCategory : true))
      .filter((p) => (text ? (p.title + p.content + p.category).toLowerCase().includes(text) : true))
      .map(
        (prompt) => `
          <tr data-id="${prompt.id}">
            <td>${prompt.icon}</td>
            <td>${prompt.category}</td>
            <td>${prompt.title}</td>
            <td><button type="button" class="copy-button" data-prompt-id="${prompt.id}">העתק</button></td>
          </tr>`
      )
      .join("");

    tbody.innerHTML = rows || '<tr><td colspan="4">לא נמצאו פרומפטים</td></tr>';

    // attach listeners
    const buttons = tbody.querySelectorAll(".copy-button");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.promptId;
        const prompt = projectInfo.prompts.find((p) => p.id === id);
        if (!prompt) return;
        navigator.clipboard.writeText(prompt.content).then(() => {
          preview.textContent = prompt.content;
          tbody.querySelectorAll(".copy-button").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
        });
      });
    });

    // row click shows preview
    tbody.querySelectorAll("tr[data-id]").forEach((row) => {
      row.addEventListener("click", (e) => {
        // avoid firing when button clicked
        if (e.target.closest("button")) return;
        const id = row.dataset.id;
        const prompt = projectInfo.prompts.find((p) => p.id === id);
        if (prompt) preview.textContent = prompt.content;
      });
    });
  }

  // initial render
  renderTableRows();

  // filters
  search.addEventListener("input", () => renderTableRows(search.value, category.value));
  category.addEventListener("change", () => renderTableRows(search.value, category.value));

  // copy all filtered
  copyAllBtn.addEventListener("click", async () => {
    const text = projectInfo.prompts
      .filter((p) => (category.value ? p.category === category.value : true))
      .filter((p) => (search.value ? (p.title + p.content + p.category).toLowerCase().includes(search.value.trim().toLowerCase()) : true))
      .map((p) => `# ${p.title}\n${p.content}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      copyAllBtn.textContent = "הועתק!";
      copyAllBtn.classList.add("active");
      setTimeout(() => {
        copyAllBtn.textContent = "העתק הכל";
        copyAllBtn.classList.remove("active");
      }, 1200);
    } catch (err) {
      console.error(err);
    }
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
