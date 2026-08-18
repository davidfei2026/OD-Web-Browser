const address =
  document.getElementById("address");

const content =
  document.getElementById("content");

const tabsElement =
  document.getElementById("tabs");

const settingsModal =
  document.getElementById("settingsModal");

let tabs = [];

let activeTabId = null;


/* =========================
   TAB SYSTEM
========================= */

function createId() {

  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2)
  );

}


function createTab() {

  const tab = {

    id: createId(),

    title: "New Tab",

    url: "",

    history: [""],

    historyIndex: 0

  };

  tabs.push(tab);

  activeTabId = tab.id;

  render();

}


function getActiveTab() {

  return tabs.find(
    tab => tab.id === activeTabId
  );

}


/* =========================
   HOME PAGE
========================= */

function homePage() {

  return `

    <section class="home">

      <div class="logo">
        🕵️
      </div>

      <h1>
        Private Browser
      </h1>

      <div class="tagline">
        Private Browser V2
      </div>

      <div class="home-search">

        <input
          id="homeSearch"
          placeholder="Search or enter a web address"
          autocomplete="off"
        >

        <button
          class="search-button"
          id="homeGo"
        >
          Search
        </button>

      </div>

      <div class="quick-links">

        <button data-url="https://www.google.com">
          <span>🔎</span>
          Google
        </button>

        <button data-url="https://www.bing.com">
          <span>🟦</span>
          Bing
        </button>

        <button data-url="https://duckduckgo.com">
          <span>🦆</span>
          DuckDuckGo
        </button>

        <button data-url="https://github.com">
          <span>🐙</span>
          GitHub
        </button>

      </div>

      <div class="privacy-card">

        <strong>
          🕵️ Private Session
        </strong>

        <br><br>

        Your browser tabs and session history
        exist only while this page is open.

        <br><br>

        <strong>
          Important:
        </strong>

        This browser interface does not
        provide VPN-level anonymity.

      </div>

    </section>

  `;

}


/* =========================
   WEBSITE PAGE
========================= */

function websitePage(url) {

  return `

    <section class="website-screen">

      <div class="website-box">

        <div class="website-icon">
          🌐
        </div>

        <h2>
          Ready to visit
        </h2>

        <p>
          ${escapeHTML(url)}
        </p>

        <p>

          Some websites prevent themselves from
          being displayed inside another webpage.

          V2 therefore provides a button to open
          the destination normally.

        </p>

        <a
          class="open-site"
          href="${escapeAttribute(url)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Website ↗
        </a>

      </div>

    </section>

  `;

}


/* =========================
   SECURITY HELPERS
========================= */

function escapeHTML(value) {

  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function escapeAttribute(value) {

  return escapeHTML(value);

}


/* =========================
   RENDER
========================= */

function render() {

  tabsElement.innerHTML = "";

  tabs.forEach(tab => {

    const element =
      document.createElement("div");

    element.className =
      "tab" +
      (tab.id === activeTabId
        ? " active"
        : "");

    element.innerHTML = `

      <span>
        🕵️
      </span>

      <span class="tab-title"></span>

      <button class="tab-close">
        ✕
      </button>

    `;

    element.querySelector(".tab-title")
      .textContent = tab.title;


    element.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(".tab-close")
        ) {
          return;
        }

        activeTabId = tab.id;

        render();

      }
    );


    element.querySelector(".tab-close")
      .addEventListener(
        "click",
        event => {

          event.stopPropagation();

          closeTab(tab.id);

        }
      );


    tabsElement.appendChild(element);

  });


  content.innerHTML = "";


  const tab = getActiveTab();


  if (!tab) {
    return;
  }


  const page =
    document.createElement("div");

  page.className =
    "page active";


  if (tab.url === "") {

    page.innerHTML =
      homePage();


    const search =
      page.querySelector("#homeSearch");


    page.querySelector("#homeGo")
      .addEventListener(
        "click",
        () => {

          navigate(search.value);

        }
      );


    search.addEventListener(
      "keydown",
      event => {

        if (event.key === "Enter") {

          navigate(search.value);

        }

      }
    );


    page
      .querySelectorAll("[data-url]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            navigate(
              button.dataset.url
            );

          }
        );

      });

  }

  else {

    page.innerHTML =
      websitePage(tab.url);

  }


  content.appendChild(page);


  address.value =
    tab.url;

}


/* =========================
   NAVIGATION
========================= */

function normalize(input) {

  input =
    input.trim();


  if (!input) {

    return "";

  }


  if (
    /^https?:\/\//i.test(input)
  ) {

    return input;

  }


  if (
    /^[a-z0-9.-]+\.[a-z]{2,}/i.test(input)
  ) {

    return "https://" + input;

  }


  return (
    "https://duckduckgo.com/?q=" +
    encodeURIComponent(input)
  );

}


function navigate(input) {

  const url =
    normalize(input);


  if (!url) {
    return;
  }


  const tab =
    getActiveTab();


  if (!tab) {
    return;
  }


  tab.url =
    url;


  try {

    tab.title =
      new URL(url).hostname;

  }

  catch {

    tab.title =
      "Web Page";

  }


  tab.history =
    tab.history.slice(
      0,
      tab.historyIndex + 1
    );


  tab.history.push(url);


  tab.historyIndex =
    tab.history.length - 1;


  render();

}


/* =========================
   BACK
========================= */

function goBack() {

  const tab =
    getActiveTab();


  if (
    !tab ||
    tab.historyIndex <= 0
  ) {

    return;

  }


  tab.historyIndex--;


  tab.url =
    tab.history[
      tab.historyIndex
    ];


  render();

}


/* =========================
   FORWARD
========================= */

function goForward() {

  const tab =
    getActiveTab();


  if (
    !tab ||
    tab.historyIndex >=
      tab.history.length - 1
  ) {

    return;

  }


  tab.historyIndex++;


  tab.url =
    tab.history[
      tab.historyIndex
    ];


  render();

}


/* =========================
   HOME
========================= */

function goHome() {

  const tab =
    getActiveTab();


  if (!tab) {
    return;
  }


  tab.url = "";

  tab.title =
    "New Tab";

  tab.history =
    [""];

  tab.historyIndex =
    0;


  render();

}


/* =========================
   CLOSE TAB
========================= */

function closeTab(id) {

  const index =
    tabs.findIndex(
      tab => tab.id === id
    );


  if (index === -1) {
    return;
  }


  tabs.splice(
    index,
    1
  );


  if (tabs.length === 0) {

    createTab();

    return;

  }


  if (
    activeTabId === id
  ) {

    activeTabId =
      tabs[
        Math.max(
          0,
          index - 1
        )
      ].id;

  }


  render();

}


/* =========================
   BUTTONS
========================= */

document
  .getElementById("go")
  .addEventListener(
    "click",
    () => {

      navigate(
        address.value
      );

    }
  );


address.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter"
    ) {

      navigate(
        address.value
      );

    }

  }
);


document
  .getElementById("back")
  .addEventListener(
    "click",
    goBack
  );


document
  .getElementById("forward")
  .addEventListener(
    "click",
    goForward
  );


document
  .getElementById("homeBtn")
  .addEventListener(
    "click",
    goHome
  );


document
  .getElementById("reload")
  .addEventListener(
    "click",
    render
  );


document
  .getElementById("newTab")
  .addEventListener(
    "click",
    createTab
  );


/* =========================
   SETTINGS
========================= */

document
  .getElementById("settingsBtn")
  .addEventListener(
    "click",
    () => {

      settingsModal
        .classList
        .add("show");

    }
  );


document
  .getElementById("closeSettings")
  .addEventListener(
    "click",
    () => {

      settingsModal
        .classList
        .remove("show");

    }
  );


settingsModal
  .addEventListener(
    "click",
    event => {

      if (
        event.target ===
        settingsModal
      ) {

        settingsModal
          .classList
          .remove("show");

      }

    }
  );


/* =========================
   CLEAR SESSION
========================= */

document
  .getElementById("clearSession")
  .addEventListener(
    "click",
    () => {

      tabs = [];

      activeTabId =
        null;

      createTab();

      settingsModal
        .classList
        .remove("show");

    }
  );


/* =========================
   THEME
========================= */

let lightMode = false;


document
  .getElementById("themeToggle")
  .addEventListener(
    "click",
    () => {

      lightMode =
        !lightMode;


      if (lightMode) {

        document
          .documentElement
          .style
          .setProperty(
            "--bg",
            "#f1f5f9"
          );

        document
          .documentElement
          .style
          .setProperty(
            "--panel",
            "#ffffff"
          );

        document
          .documentElement
          .style
          .setProperty(
            "--panel2",
            "#e2e8f0"
          );

        document
          .documentElement
          .style
          .setProperty(
            "--text",
            "#0f172a"
          );

        document
          .documentElement
          .style
          .setProperty(
            "--muted",
            "#64748b"
          );

        document
          .documentElement
          .style
          .setProperty(
            "--border",
            "#cbd5e1"
          );

        document
          .getElementById(
            "themeToggle"
          )
          .textContent = "☀️";

      }

      else {

        document
          .documentElement
          .style
          .setProperty(
            "--bg",
            "#0b1020"
          );

        document
          .documentElement
          .style
          .setProperty(
            "--panel",
            "#111827"
          );

        document
          .documentElement
          .style
          .setProperty(
            "--panel2",
            "#172033"
          );

        document
          .documentElement
          .style
          .setProperty(
            "--text",
            "#f8fafc"
          );

        document
          .documentElement
          .style
          .setProperty(
            "--muted",
            "#94a3b8"
          );

        document
          .documentElement
          .style
          .setProperty(
            "--border",
            "#263247"
          );

        document
          .getElementById(
            "themeToggle"
          )
          .textContent = "🌙";

      }

    }
  );


/* =========================
   START
========================= */

createTab();
