(function () {
  "use strict";

  // -----------------------------------------------------------------
  // Project detail data (mirrors src/data/projects.ts)
  // -----------------------------------------------------------------
  const PROJECTS = {
    "ai-advisor-desktop": {
      title: "AI powered Advisor Desktop",
      summary:
        "Reduced manual research and operational overhead for financial advisors by embedding AI Agents into daily workflows. Enabled informed decision-making at scale, significantly improving advisor efficiency and client relationships",
      problem:
        "Advisors managing large client portfolios spend significant time manually preparing for meetings by navigating fragmented data across multiple systems. This limits their ability to deliver timely, personalized advice and focus on client interactions",
      role: [
        "Led technical design decisions for the AI-powered Advisor Desktop, identifying high-impact areas where GenAI could meaningfully reduce advisor effort and improve efficiency",
        "Designed the end-to-end backend data schema and defined reusable architectural patterns to support scalable, agentic orchestration across the platform",
        "Owned the AI system design across five core capabilities, including conversational research, advisor notebooks, AI-driven notifications, and post-call insights automation",
        "Defined and implemented multi-agent workflows to extract insights from advisor interactions, automate follow-ups, update enterprise systems, and surface personalized learning recommendations",
      ],
      architecture: [
        "MCP-based ingestion from CRM and enterprise systems, GenAI transcription of advisor and client calls, and a centralized data schema to aggregate structured and unstructured data",
        "Batch LLM workflows for post-call analysis, insight extraction, compliance tagging, and enrichment of advisor and client context at scale",
        "Purpose-built agents for internal document RAG, web research, advisor training, and client portfolio and database search, orchestrated through a conversational interface",
        "A unified dashboard that surfaces client insights, call summaries, tasks, alerts, and notifications within existing advisor workflows",
      ],
      impact: [
        "50% increase in operational efficiency as GenAI automates repetitive tasks and streamlines workflows, allowing advisors to serve more clients with less effort",
        "80% reduction in errors as AI agents ensures data accuracy and consistency by proactively validating inputs and surfacing anomalies before they impact decisions",
        "$60,000 additional revenue per advisor by surfacing timely insights and next-best actions, the AI Agents empowers advisors to focus on high-value opportunities that drive growth",
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

  const renderField = (value) => {
    if (value == null || (Array.isArray(value) && value.length === 0)) {
      return '<p>None</p>';
    }
    const items = Array.isArray(value)
      ? value
      : String(value)
          .split(/\n|•|;|—|-|\|/)
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

  const openProject = (id) => {
    const p = PROJECTS[id];
    if (!p || !dialog) return;
    dialogTitle.textContent = p.title;
    dialogBody.innerHTML = `
      <p class="project-dialog-summary">${escape(p.summary)}</p>
      <section>
        <h4>Problem Statement</h4>
        ${renderField(p.problem)}
      </section>
      <section>
        <h4>Role</h4>
        ${renderField(p.role)}
      </section>
      <section>
        <h4>Solution Architecture</h4>
        ${renderField(p.architecture)}
      </section>
      <section>
        <h4>Impact</h4>
        ${renderField(p.impact)}
      </section>
    `;
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
