(function () {
  "use strict";

  // -----------------------------------------------------------------
  // Project detail data (mirrors src/data/projects.ts)
  // -----------------------------------------------------------------
  const PROJECTS = {
    "ai-advisor-desktop": {
      title: "AI Powered-Advisor Desktop",
      summary:
        "Reduced manual research and operational overhead for financial advisors by embedding AI agents into daily workflows. Enabled informed decision-making at scale, significantly improving advisor efficiency and client relationships",
      problem:
        "Advisors managing large books of clients prepare for each meeting by moving between CRM, portfolio systems, email, chat and market research. That prep time comes out of time with clients, and the context they assemble is often incomplete or out of date when they need it.",
      role: [
        "Led the AI system design end to end",
        "Defined the orchestrator-plus-workflow agent pattern and the backend data schema",
        "Designed the gateway layer for models and tools",
        "Owned how compliance and guardrails fit into every response path",
        "Took the design to production on Azure with the engineering team",
      ],
      diagram: "projects/ai-advisor-desktop/diagram.html",
      decisions: [
        { title: "One orchestrator, four focused workflows", text: "Each workflow has a narrow scope, so it can be tested, evaluated and released on its own." },
        { title: "Two gateways, not direct calls", text: "The AI gateway centralizes token quotas, model routing and fallback between GPT-5.6 and Terra/Sol, and logging. The MCP gateway centralizes tool authentication, allow-lists and auditing." },
        { title: "MCP as the integration layer", text: "A new system means a new MCP server, not an agent change." },
        { title: "Compliance before the advisor sees anything", text: "Every response passes the compliance agent and AI Content Safety." },
        { title: "Private by default", text: "Services use managed identities, and secrets are kept in Key Vault." },
        { title: "Observable and evaluated", text: "Every agent step is traced, the same telemetry feeds the evaluation runs, and the deployment is zone-redundant." },
      ],
      architecture: [
        "MCP-based ingestion from CRM and enterprise systems, GenAI transcription of advisor and client calls, and a centralized data schema to aggregate structured and unstructured data",
        "Batch LLM workflows for post-call analysis, insight extraction, compliance tagging, and enrichment of advisor and client context at scale",
        "Purpose-built agents for internal document RAG, web research, advisor training, and client portfolio and database search, orchestrated through a conversational interface",
        "A unified dashboard that surfaces client insights, call summaries, tasks, alerts, and notifications within existing advisor workflows",
      ],
      impact: [
        { metric: "50%", text: "higher operational efficiency, as GenAI automates repetitive tasks so advisors serve more clients with less effort" },
        { metric: "80%", text: "fewer errors, as AI agents validate inputs and surface anomalies before they affect decisions" },
        { metric: "$60K", text: "additional revenue per advisor, from timely insights and next-best actions" },
      ],
    },
    "llm-benchmarking": {
      title: "LLM Benchmarking Platform",
      summary:
        "Built a standardized framework to evaluate and compare LLMs across accuracy, latency, cost, risk, and concurrency. Enabled teams to make data-driven LLM selection decisions and avoid ad-hoc experimentation at enterprise scale",
      architecture:
        "Created a systematic evaluation framework for comparing 15+ LLM models across accuracy, latency, cost, and domain-specific performance. Enabled data-driven model selection that reduced inference costs by 45% while improving response quality",
    },
    "contact-center-ai": {
      title: "Contact Center AI",
      summary:
        "Designed a scalable GenAI system to process high-volume call transcripts and generate actionable insights. Operationalized AI across summarization, compliance tagging, and workflow automation in production environments",
      architecture:
        "Architected and deployed an enterprise voice AI system processing 10K+ daily interactions. Integrated speech-to-text, LLM reasoning, and text-to-speech pipelines. Reduced average handling time by 60% while maintaining 90% customer satisfaction scores",
    },
    "llmops-enablement": {
      title: "LLMOps Enablement",
      summary:
        "Designed an enterprise LLMOps layer to operationalize GenAI workloads across environments. Supported scalable model serving, observability, and FinOps for production AI systems",
      architecture:
        "Designed agent coordination and fallback strategies to handle long-running workflows and multi-step reasoning, plus observability hooks for production usage.",
    },
    "ai-maturity-index": {
      title: "Enterprise AI Maturity Index",
      summary:
        "Created a standardized index to evaluate how organizations adopt, govern, and scale AI initiatives. Helped executives move from fragmented experimentation to a cohesive, enterprise AI strategy",
      architecture:
        "Designed agent coordination and fallback strategies to handle long-running workflows and multi-step reasoning, plus observability hooks for production usage.",
    },
    "payment-throttling": {
      title: "Intraday Payment Throttling",
      summary:
        "Built an AI-driven system to dynamically delay intraday payments based on liquidity risk and real-time signals. Reduced operational risk while maintaining payment throughput and regulatory compliance in time-sensitive financial workflows",
      architecture:
        "Built a lightweight RAG UI with semantic search, filterable sources, and threaded explanations for analyst workflows. Integrates with vector DB and incremental indexing.",
    },
    "liquidity-stress": {
      title: "Liquidity Stress Testing",
      summary:
        "Applied AI-driven segmentation to enhance liquidity stress testing and scenario analysis. Improved risk sensitivity and decision-making by identifying differentiated liquidity behaviors across portfolios and stress conditions",
      architecture:
        "Designed agent coordination and fallback strategies to handle long-running workflows and multi-step reasoning, plus observability hooks for production usage.",
    },
  };

  // -----------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------
  const escape = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));

  const hasContent = (value) =>
    value != null && !(Array.isArray(value) && value.length === 0) && String(value).trim() !== "";

  const renderField = (value) => {
    const items = Array.isArray(value)
      ? value
      : String(value)
          .split(/\n|•/)
          .map((s) => s.trim())
          .filter(Boolean);
    if (items.length > 1) {
      return (
        "<ul>" +
        items.map((entry) => `<li>${escape(entry)}</li>`).join("") +
        "</ul>"
      );
    }
    return `<p>${escape(items[0] ?? value)}</p>`;
  };

  // -----------------------------------------------------------------
  // Fade-up on scroll
  // -----------------------------------------------------------------
  const fadeUps = document.querySelectorAll(".fade-up");
  if ("IntersectionObserver" in window && fadeUps.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    fadeUps.forEach((el) => io.observe(el));
  } else {
    fadeUps.forEach((el) => el.classList.add("is-visible"));
  }

  // -----------------------------------------------------------------
  // Years of experience pill
  // -----------------------------------------------------------------
  const yearsEl = document.getElementById("years-of-experience");
  if (yearsEl) {
    const start = new Date("2018-07-13");
    const ms = Math.abs(Date.now() - start.getTime());
    const years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365.25));
    yearsEl.textContent = `${years}+ years`;
  }

  // -----------------------------------------------------------------
  // Project modal (native <dialog>)
  // -----------------------------------------------------------------
  const dialog = document.getElementById("project-dialog");
  const dialogTitle = document.getElementById("project-dialog-title");
  const dialogBody = document.getElementById("project-dialog-body");

  const section = (title, body, cls = "") =>
    `<section${cls ? ` class="${cls}"` : ""}><h4>${title}</h4>${body}</section>`;

  const renderImpact = (items) =>
    "<ul>" +
    items
      .map((item) =>
        typeof item === "string"
          ? `<li class="impact-item"><span class="impact-text">${escape(item)}</span></li>`
          : `<li class="impact-item"><span class="impact-metric">${escape(item.metric)}</span><span class="impact-text">${escape(item.text)}</span></li>`
      )
      .join("") +
    "</ul>";

  const renderDecisions = (items) =>
    "<ul>" +
    items.map((d) => `<li><strong>${escape(d.title)}.</strong> ${escape(d.text)}</li>`).join("") +
    "</ul>";

  const CHEVRON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>';
  const EXTERNAL =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';

  // Size the diagram iframe to its content (same origin), so it never scrolls vertically.
  const fitFrame = (frame) => {
    try {
      const body = frame.contentDocument && frame.contentDocument.body;
      if (body) frame.style.height = Math.ceil(body.getBoundingClientRect().height) + "px";
    } catch (e) {
      /* keep the CSS aspect-ratio fallback */
    }
  };

  const renderArchitecture = (p) => {
    let body = "";
    if (p.diagram) {
      body =
        `<div class="project-architecture-head"><h4>Solution Architecture</h4>` +
        `<a class="hero-pill" href="${escape(p.diagram)}" target="_blank" rel="noopener noreferrer">${EXTERNAL}<span>Open full screen</span></a></div>` +
        `<p class="diagram-hint"><span>Scroll to explore</span>${CHEVRON}</p>` +
        `<div class="diagram-frame"><iframe src="${escape(p.diagram)}" title="${escape(p.title)} solution architecture"></iframe></div>`;
    } else if (hasContent(p.architecture)) {
      body = `<h4>Solution Architecture</h4>${renderField(p.architecture)}`;
    }
    return body ? `<section class="project-architecture">${body}</section>` : "";
  };

  const openProject = (id) => {
    const p = PROJECTS[id];
    if (!p || !dialog) return;
    dialogTitle.textContent = p.title;
    dialog.classList.toggle("project-dialog--wide", Boolean(p.diagram));

    // Up to four boxes, in reading order: Problem | Impact / My Role | Key Design Decisions
    const boxes = [
      hasContent(p.problem) && section("Problem Statement", renderField(p.problem), "project-box"),
      hasContent(p.impact) && section("Impact", renderImpact(p.impact), "project-box project-impact"),
      hasContent(p.role) && section("My Role", renderField(p.role), "project-box"),
      hasContent(p.decisions) && section("Key Design Decisions", renderDecisions(p.decisions), "project-box"),
    ].filter(Boolean);
    const grid = boxes.length
      ? `<div class="project-dialog-grid${boxes.length > 1 ? " is-split" : ""}">${boxes.join("")}</div>`
      : "";

    dialogBody.innerHTML = `
      <p class="project-dialog-summary">${escape(p.summary)}</p>
      ${grid}
      ${renderArchitecture(p)}
    `;

    const frame = dialogBody.querySelector(".diagram-frame iframe");
    if (frame) frame.addEventListener("load", () => fitFrame(frame));
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    document.body.style.overflow = "hidden";
  };

  const closeProject = () => {
    if (!dialog) return;
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-project]").forEach((btn) => {
    btn.addEventListener("click", () => openProject(btn.dataset.project));
  });

  if (dialog) {
    dialog.addEventListener("click", (e) => {
      const rect = dialog.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inside) closeProject();
    });
    dialog.addEventListener("close", () => {
      document.body.style.overflow = "";
    });
    const closeBtn = dialog.querySelector(".project-dialog-close");
    if (closeBtn) closeBtn.addEventListener("click", closeProject);
    window.addEventListener("resize", () => {
      const frame = dialog.open && dialogBody.querySelector(".diagram-frame iframe");
      if (frame) fitFrame(frame);
    });
  }

  // -----------------------------------------------------------------
  // Featured Work — horizontal scroll shadow + arrow button
  // -----------------------------------------------------------------
  const scroller = document.querySelector(".featured-scroll");
  const shadow = document.querySelector(".featured-shadow");
  const scrollBtn = document.querySelector(".featured-scroll-button");
  const CARD_GAP = 32;

  if (scroller && shadow) {
    const updateShadow = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scroller;
      const hasMore = scrollLeft + clientWidth < scrollWidth - 8;
      shadow.classList.toggle("show-right-shadow", hasMore);
    };
    updateShadow();
    scroller.addEventListener("scroll", updateShadow, { passive: true });
    window.addEventListener("resize", updateShadow);
  }

  if (scrollBtn && scroller) {
    scrollBtn.addEventListener("click", () => {
      const card = scroller.querySelector(".featured-card");
      const cardWidth = card ? card.offsetWidth : Math.round(scroller.clientWidth * 0.8);
      scroller.scrollBy({ left: cardWidth + CARD_GAP, behavior: "smooth" });
    });
  }
})();
