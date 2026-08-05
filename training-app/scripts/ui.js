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
      <p>בחר פרומפט, ונדאג שתוכל להעתיק אותו ישירות ללוח.</p>
    </div>
    <div class="card">
      <table class="prompts-table">
        <thead>
          <tr>
            <th>אייקון</th>
            <th>קטגוריה</th>
            <th>כותרת</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody>
          ${projectInfo.prompts
            .map(
              (prompt) => `
            <tr>
              <td>${prompt.icon}</td>
              <td>${prompt.category}</td>
              <td>${prompt.title}</td>
              <td><button type="button" class="copy-button" data-prompt-id="${prompt.id}">העתק</button></td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <div class="card">
      <h3>פרומפט פעיל</h3>
      <p id="prompt-preview">בחר שורה בטבלה כדי לראות את הטקסט כאן.</p>
    </div>
  `;

  const copyButtons = container.querySelectorAll(".copy-button");
  const preview = container.querySelector("#prompt-preview");

  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const prompt = projectInfo.prompts.find((item) => item.id === button.dataset.promptId);
      if (!prompt) return;
      navigator.clipboard.writeText(prompt.content).then(() => {
        preview.textContent = prompt.content;
        copyButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      });
    });
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
