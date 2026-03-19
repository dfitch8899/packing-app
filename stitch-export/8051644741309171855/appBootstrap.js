(function () {
  const API = window.PackingAppMockApi;
  const Storage = window.PackingAppStorage;
  const Contract = window.PackingAppUIContract;
  const ApiClient = window.PackingAppApiClient;

  if (!API || !Storage || !Contract) {
    // eslint-disable-next-line no-console
    console.warn(
      "PackingApp bootstrap missing dependencies. Ensure uiContract.js, storage.js, and mockApi.js load before appBootstrap.js."
    );
  }

  // Prefer the backend-ready client if present.
  const Api = ApiClient || API;

  const NAV = {
    home: "../home_enhanced/home_enhanced_code.html",
    checklist: "../checklist_enhanced/checklist_enhanced_code.html",
    weather: "../weather_forecast/weather_forecast_code.html",
    shared: "../shared_trip_overview/shared_trip_overview_code.html",
    inspiration: "../inspiration/inspiration_code.html",
  };

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function parseTripIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get(Contract.urlParams.tripId) || "";
  }

  function getTripId() {
    const fromUrl = parseTripIdFromUrl();
    if (fromUrl) {
      Storage.setSelectedTripId(fromUrl);
      return fromUrl;
    }
    const fromStorage = Storage.getSelectedTripId();
    if (fromStorage) return fromStorage;

    const trips = Api.getTrips();
    const fallback = trips[0] && trips[0].id ? trips[0].id : "";
    Storage.setSelectedTripId(fallback);
    return fallback;
  }

  function renderStars(widthPct) {
    const pct = Math.max(0, Math.min(100, Number(widthPct) || 0));
    return `${pct}% PACKED`;
  }

  function showModal({ title, bodyHtml, confirmText, onConfirm, cancelText }) {
    // Basic lightweight modal; no external dependencies.
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-end justify-center sm:items-center";

    const modal = document.createElement("div");
    modal.className =
      "w-full max-w-md bg-white rounded-none shadow-lg overflow-hidden";

    modal.innerHTML = `
      <div class="p-6" style="border-bottom:1px solid rgba(229,228,226,0.9);">
        <h2 style="margin:0;font-size:24px;line-height:1.2;font-family:serif;font-weight:600;color:#2C3531;">${escapeHtml(
          title || ""
        )}</h2>
      </div>
      <div class="p-6 text-sm leading-relaxed" style="color:#1A1D1A;">
        ${bodyHtml || ""}
      </div>
      <div class="p-6 pt-0 flex gap-3 justify-end" style="border-top:1px solid rgba(229,228,226,0.9);">
        <button data-modal-cancel style="padding:10px 16px;border:1px solid rgba(229,228,226,1);background:transparent;color:#8D978F;cursor:pointer;letter-spacing:0.08em;text-transform:uppercase;font-size:10px;" >${escapeHtml(
          cancelText || "Cancel"
        )}</button>
        ${
          confirmText
            ? `<button data-modal-confirm style="padding:10px 16px;border:1px solid #2C3531;background:#2C3531;color:#fff;cursor:pointer;letter-spacing:0.08em;text-transform:uppercase;font-size:10px;">${escapeHtml(
                confirmText
              )}</button>`
            : ""
        }
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    function cleanup() {
      overlay.remove();
    }

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cleanup();
    });

    overlay.querySelector("[data-modal-cancel]")?.addEventListener("click", cleanup);
    overlay.querySelector("[data-modal-confirm]")?.addEventListener("click", () => {
      if (onConfirm) onConfirm();
      cleanup();
    });

    function onKeyDown(e) {
      if (e.key === "Escape") cleanup();
    }
    document.addEventListener("keydown", onKeyDown, { once: true });
  }

  function renderHome() {
    const tripListEl = document.getElementById("packingapp-tripList");
    const featuredTitleEl = document.getElementById("packingapp-featuredDestinationTitle");
    const featuredSubtitleEl = document.getElementById(
      "packingapp-featuredDestinationSubtitle"
    );
    const featuredImageEl = document.getElementById("packingapp-featuredDestinationImage");
    const beginBtn = document.getElementById("packingapp-beginJourneyBtn");

    if (!tripListEl) return;

    const trips = Api.getTrips();
    const selectedTripId = Storage.getSelectedTripId() || (trips[0] && trips[0].id);

    // Featured destination (use selected trip if available).
    const featuredTrip = trips.find((t) => t.id === selectedTripId) || trips[0];
    if (featuredTrip) {
      if (featuredTitleEl) featuredTitleEl.textContent = featuredTrip.destinationName;
      if (featuredSubtitleEl) featuredSubtitleEl.textContent = featuredTrip.dateRangeText;
      if (featuredImageEl) {
        featuredImageEl.src = featuredTrip.heroImageUrl;
        featuredImageEl.alt = featuredTrip.heroImageAlt || featuredTrip.destinationName;
      }
    }

    function computeTripPackedPercent(tripId) {
      const checklistPersistence = Storage.loadChecklistPersistence(tripId);
      const checklist = Api.getChecklist(tripId, checklistPersistence);
      const allItems = [];
      for (const group of checklist.itemsByCategory) {
        for (const item of group.items) allItems.push(item);
      }
      const total = allItems.length || 1;
      const packed = allItems.filter((i) => i.isPacked).length;
      return Math.round((packed / total) * 100);
    }

    tripListEl.innerHTML = "";
    trips.forEach((trip) => {
      const pct = computeTripPackedPercent(trip.id);
      const isFull = pct >= 100;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "w-full flex items-center justify-between px-6 py-6 bg-design-surface border-thin text-left hover:bg-design-bg/50 transition-colors";
      btn.dataset.tripId = trip.id;

      btn.innerHTML = `
        <div class="flex flex-col gap-1">
          <span class="font-serif text-[24px] text-design-text">${escapeHtml(trip.destinationName)}</span>
          <span class="font-body text-[15px] text-design-muted">${escapeHtml(
            trip.dateRangeText
          )}</span>
        </div>
        <div class="flex flex-col items-end gap-2">
          <span class="font-body text-[12px] text-design-${isFull ? "text" : "muted"} tracking-wider uppercase">${escapeHtml(
            `${pct}% Packed`
          )}</span>
          <div class="w-16 h-[2px] bg-design-border relative">
            <div class="absolute top-0 left-0 h-full bg-design-${isFull ? "text" : "accent"}" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;

      btn.addEventListener("click", () => {
        Storage.setSelectedTripId(trip.id);
        window.location.href = `${NAV.checklist}?${Contract.urlParams.tripId}=${encodeURIComponent(
          trip.id
        )}`;
      });

      tripListEl.appendChild(btn);
    });

    if (beginBtn) {
      beginBtn.addEventListener("click", () => {
        const target = Storage.getSelectedTripId() || trips[0]?.id;
        if (!target) return;
        window.location.href = `${NAV.checklist}?${Contract.urlParams.tripId}=${encodeURIComponent(
          target
        )}`;
      });
    }
  }

  function renderChecklist() {
    const itemsEl = document.getElementById("packingapp-checklistItems");
    const titleEl = document.getElementById("packingapp-checklistTitle");
    const dateRangeEl = document.getElementById("packingapp-checklistDateRange");
    const heroImgEl = document.getElementById("packingapp-checklistHeroImage");
    const categoryNavEl = document.getElementById("packingapp-categoryNav");
    const weatherLinkEl = document.getElementById("packingapp-weatherLink");
    const addCustomBtn = document.getElementById("packingapp-addCustomItemBtn");
    const backToHomeBtn = document.getElementById("packingapp-backToHome");

    if (!itemsEl) return;

    const tripId = getTripId();
    const trips = Api.getTrips();
    const trip = trips.find((t) => t.id === tripId) || trips[0];

    const checklistPersistence = Storage.loadChecklistPersistence(tripId);
    const checklist = Api.getChecklist(tripId, checklistPersistence);
    const viewerParticipantId = Storage.getViewerParticipantId();

    let activeCategoryId = checklist.categories[0]?.id || "";
    if (activeCategoryId && checklist.categories.some((c) => c.id === activeCategoryId) === false) {
      activeCategoryId = checklist.categories[0]?.id || "";
    }

    if (titleEl && trip) titleEl.textContent = trip.destinationName;
    if (dateRangeEl && trip) dateRangeEl.textContent = trip.dateRangeText;
    if (heroImgEl && trip) {
      heroImgEl.src = trip.heroImageUrl;
      heroImgEl.alt = trip.heroImageAlt || trip.destinationName;
    }

    if (weatherLinkEl) {
      weatherLinkEl.href = `${NAV.weather}?${Contract.urlParams.tripId}=${encodeURIComponent(
        tripId
      )}`;
    }

    if (backToHomeBtn) {
      backToHomeBtn.addEventListener("click", () => {
        Storage.setSelectedTripId(tripId);
        window.location.href = NAV.home;
      });
    }

    function renderCategories() {
      if (!categoryNavEl) return;
      categoryNavEl.innerHTML = "";

      checklist.categories.forEach((cat, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.categoryId = cat.id;
        const isActive = cat.id === activeCategoryId;
        btn.className = [
          "whitespace-nowrap px-1 py-3 text-[14px] mr-8 uppercase tracking-widest transition-colors",
          isActive
            ? "text-text-main font-semibold border-b-2 border-text-main"
            : "text-muted font-normal hover:text-text-main border-b-2 border-transparent",
        ].join(" ");
        btn.textContent = cat.title;
        btn.addEventListener("click", () => {
          activeCategoryId = cat.id;
          renderCategories();
          renderItems();
        });

        categoryNavEl.appendChild(btn);
      });
    }

    function renderItems() {
      itemsEl.innerHTML = "";

      const catGroup = checklist.itemsByCategory.find((g) => g.categoryId === activeCategoryId);
      const items = (catGroup && catGroup.items) || [];

      items.forEach((item) => {
        const label = document.createElement("label");
        label.className =
          "checklist-item flex items-center justify-between h-16 border-b border-border-thin cursor-pointer group";
        label.title = "Tap to mark packed";

        label.innerHTML = `
          <div class="flex items-center gap-4 flex-1">
            <div class="custom-checkbox relative flex items-center justify-center">
              <input class="peer sr-only" type="checkbox" data-item-id="${escapeHtml(
                item.id
              )}" ${item.isPacked ? "checked" : ""}/>
              <div class="w-4 h-4 border border-border-thin bg-surface flex items-center justify-center transition-colors duration-200">
                <svg class="hidden w-3 h-3 text-white pointer-events-none" fill="none" stroke="currentColor" stroke-width="3" viewbox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </div>
            </div>
            <span class="item-text text-[15px] text-text-main font-light transition-all duration-300">${escapeHtml(
              item.label
            )}</span>
          </div>
          <span class="text-[12px] text-muted font-normal tracking-wider">x${escapeHtml(
            item.quantity
          )}</span>
        `;

        const input = label.querySelector('input[type="checkbox"]');
        input.addEventListener("change", () => {
          Storage.setChecklistItemPacked(tripId, item.id, input.checked);

          // Re-load checklist so checkbox state reflects persistence.
          const persistence = Storage.loadChecklistPersistence(tripId);
          const updatedChecklist = Api.getChecklist(tripId, persistence);

          // Update shared checklist variable.
          checklist.categories = updatedChecklist.categories;
          checklist.customItems = updatedChecklist.customItems;
          checklist.itemsByCategory = updatedChecklist.itemsByCategory;

          renderCategories();
          renderItems();
        });

        itemsEl.appendChild(label);
      });
    }

    if (addCustomBtn) {
      addCustomBtn.addEventListener("click", () => {
        const modalHtml = `
          <div class="flex flex-col gap-4">
            <label class="flex flex-col gap-2">
              <span class="text-[12px] text-muted uppercase tracking-widest font-body">Item name</span>
              <input id="packingapp-customItemName" class="w-full border border-border-thin px-3 py-3 bg-surface outline-none" placeholder="e.g. Cashmere Scarf"/>
            </label>
            <label class="flex flex-col gap-2">
              <span class="text-[12px] text-muted uppercase tracking-widest font-body">Quantity</span>
              <input id="packingapp-customItemQty" type="number" min="1" value="1" class="w-full border border-border-thin px-3 py-3 bg-surface outline-none"/>
            </label>
            <label class="flex flex-col gap-2">
              <span class="text-[12px] text-muted uppercase tracking-widest font-body">Category</span>
              <select id="packingapp-customItemCat" class="w-full border border-border-thin px-3 py-3 bg-surface outline-none">
                ${checklist.categories
                  .map(
                    (c) =>
                      `<option value="${escapeHtml(c.id)}">${escapeHtml(c.title)}</option>`
                  )
                  .join("")}
              </select>
            </label>
          </div>
        `;

        showModal({
          title: "Add Custom Item",
          bodyHtml: modalHtml,
          confirmText: "Add",
          cancelText: "Cancel",
          onConfirm: () => {
            const nameEl = document.getElementById("packingapp-customItemName");
            const qtyEl = document.getElementById("packingapp-customItemQty");
            const catEl = document.getElementById("packingapp-customItemCat");
            const label = (nameEl?.value || "").trim();
            const quantity = Number(qtyEl?.value || 1);
            const categoryId = catEl?.value || checklist.categories[0]?.id;

            if (!label) return;

            const id = `custom_${tripId}_${Date.now()}`;

            Storage.addCustomChecklistItem(tripId, {
              id,
              label,
              quantity: Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1,
              isPacked: false,
              categoryId,
              assignedToParticipantId: viewerParticipantId,
              isCustom: true,
            });

            activeCategoryId = categoryId;
            // Re-render checklist.
            renderCategories();
            renderItems();
          },
        });
      });
    }

    renderCategories();
    renderItems();
  }

  function renderWeather() {
    const daysEl = document.getElementById("packingapp-weatherDaysList");
    const blocksEl = document.getElementById("packingapp-packingStrategyBlocks");
    const recommendedEl = document.getElementById("packingapp-recommendedItems");
    const titleEl = document.getElementById("packingapp-weatherHeaderTitle");
    const dateRangeEl = document.getElementById("packingapp-weatherDateRange");
    const tempEl = document.getElementById("packingapp-currentTemperature");
    const summaryEl = document.getElementById("packingapp-currentSummary");
    const humidityEl = document.getElementById("packingapp-currentHumidity");
    const heroImgEl = document.getElementById("packingapp-weatherHeroImage");

    if (!daysEl) return;

    const tripId = getTripId();
    const trips = Api.getTrips();
    const trip = trips.find((t) => t.id === tripId) || trips[0];

    const forecast = Api.getForecast(tripId);

    if (titleEl) titleEl.textContent = forecast.headerTitle || "";
    if (dateRangeEl) dateRangeEl.textContent = forecast.dateRangeText || "";
    if (tempEl) tempEl.textContent = `${forecast.currentConditions?.temperatureC ?? ""}°`;
    if (summaryEl) summaryEl.textContent = forecast.currentConditions?.summaryText || "";
    if (humidityEl) humidityEl.textContent = forecast.currentConditions?.humidityText || "";
    if (heroImgEl && trip) {
      heroImgEl.src = trip.heroImageUrl;
      heroImgEl.alt = trip.heroImageAlt || forecast.headerTitle || trip.destinationName;
    }

    daysEl.innerHTML = "";
    (forecast.sevenDayOutlook || []).forEach((day) => {
      const rainPct = Math.max(0, Math.min(100, Number(day.rainChance) || 0));

      const row = document.createElement("div");
      row.className =
        "group flex items-center justify-between py-6 border-b border-outline hover:bg-surface-bright transition-colors px-4";
      row.innerHTML = `
        <div class="w-32">
          <p class="font-label text-xs tracking-widest uppercase text-on-surface-variant">${escapeHtml(
            day.labelText
          )}</p>
        </div>
        <div class="flex items-center gap-4 flex-1 justify-center">
          <span class="material-symbols-outlined text-secondary" data-icon="${escapeHtml(
            day.iconName || "cloud"
          )}">${escapeHtml(day.iconName || "")}</span>
          <span class="font-label text-xs tracking-widest text-on-surface-variant">${escapeHtml(
            day.rainText || `${rainPct}% Rain`
          )}</span>
        </div>
        <div class="w-48 flex justify-end items-center gap-8">
          <div class="text-right">
            <span class="font-body text-xl">${escapeHtml(day.highC ?? "")}°</span>
            <span class="text-on-surface-variant ml-2">${escapeHtml(day.lowC ?? "")}°</span>
          </div>
          <div class="w-24 h-0.5 bg-outline relative">
            <div class="absolute left-0 top-0 h-full bg-primary" style="width:${rainPct}%;"></div>
          </div>
        </div>
      `;
      daysEl.appendChild(row);
    });

    blocksEl && (blocksEl.innerHTML = "");
    (forecast.packingStrategyBlocks || []).forEach((b, idx) => {
      const block = document.createElement("div");
      block.className = "flex gap-4";

      const iconClass = idx === 0 ? "w-10 h-10 bg-primary text-white" : "w-10 h-10 border border-primary text-primary";
      block.innerHTML = `
        <div class="${iconClass} flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined" data-icon="${escapeHtml(b.iconName || "layers")}">${escapeHtml(b.iconName || "")}</span>
        </div>
        <div>
          <h4 class="font-label text-[10px] tracking-widest uppercase mb-1">${escapeHtml(b.title || "")}</h4>
          <p class="text-sm">${escapeHtml(b.body || "")}</p>
        </div>
      `;
      blocksEl && blocksEl.appendChild(block);
    });

    if (recommendedEl) {
      recommendedEl.innerHTML = "";
      (forecast.recommendedItems || []).forEach((name) => {
        const span = document.createElement("span");
        span.className =
          "px-3 py-1 bg-surface-bright text-[10px] uppercase tracking-widest border border-outline";
        span.textContent = name;
        recommendedEl.appendChild(span);
      });
    }
  }

  function renderSharedTrip() {
    const participantsListEl = document.getElementById("packingapp-sharedParticipantsList");
    const commonItemsEl = document.getElementById("packingapp-commonItemsList");
    const titleEl = document.getElementById("packingapp-sharedTripTitle");
    const participantsCountEl = document.getElementById("packingapp-participantsCount");
    const messageBtn = document.getElementById("packingapp-messageGroupBtn");
    const reminderBtn = document.getElementById("packingapp-sendReminderBtn");
    const addSharedRequirementBtn = document.getElementById("packingapp-addSharedRequirementBtn");

    if (!participantsListEl || !commonItemsEl) return;

    const tripId = getTripId();
    const sharedPersistence = Storage.loadSharedPersistence(tripId);
    const checklistPersistence = Storage.loadChecklistPersistence(tripId);
    const checklist = Api.getChecklist(tripId, checklistPersistence);
    const sharedTrip = Api.getSharedTrip(tripId, sharedPersistence, checklist);

    if (titleEl && sharedTrip.tripTitleText) titleEl.textContent = sharedTrip.tripTitleText;
    if (participantsCountEl) participantsCountEl.textContent = `${sharedTrip.participants.length} Travelers`;

    participantsListEl.innerHTML = "";
    sharedTrip.participants.forEach((p) => {
      const wrap = document.createElement("div");
      wrap.className = "group";
      wrap.innerHTML = `
        <div class="flex justify-between items-end mb-3">
          <div>
            <h4 class="text-lg font-headline">${escapeHtml(p.name)}</h4>
            <p class="text-[10px] font-label tracking-widest uppercase text-secondary">${escapeHtml(
              p.roleTitle
            )}</p>
          </div>
          <span class="text-xs font-label text-primary">${escapeHtml(p.packedPercent)}% PACKED</span>
        </div>
        <div class="h-[2px] w-full bg-outline">
          <div class="h-full bg-primary transition-all duration-1000" style="width:${Math.max(
            0,
            Math.min(100, Number(p.packedPercent) || 0)
          )}%;"></div>
        </div>
      `;
      participantsListEl.appendChild(wrap);
    });

    commonItemsEl.innerHTML = "";
    const participantsById = {};
    sharedTrip.participants.forEach((p) => (participantsById[p.id] = p));

    (sharedTrip.commonItems || []).forEach((ci) => {
      const li = document.createElement("li");
      li.className = "flex items-start gap-4 group";

      const assignedToName = ci.assignedToParticipantId
        ? participantsById[ci.assignedToParticipantId]?.name || "—"
        : "";

      const isClaimable = !ci.assignedToParticipantId;
      const badgeHtml =
        ci.status === "READY"
          ? `<span class="text-[10px] px-2 py-1 bg-surface-container-highest text-primary font-bold">${escapeHtml(
              ci.status
            )}</span>`
          : `<span class="text-[10px] px-2 py-1 border border-outline text-secondary">${escapeHtml(
              ci.status
            )}</span>`;

      li.innerHTML = `
        <span class="material-symbols-outlined text-tertiary mt-1" data-icon="${escapeHtml(
          ci.iconName || "add"
        )}">${escapeHtml(ci.iconName || "")}</span>
        <div class="flex-1 border-b border-outline/30 pb-4">
          <p class="text-sm font-label uppercase tracking-widest text-primary mb-1">${escapeHtml(ci.title)}</p>
          <div class="flex justify-between items-center">
            ${
              ci.assignedToParticipantId
                ? `<p class="text-xs text-secondary italic">Assigned to: ${escapeHtml(
                    assignedToName
                  )}</p>`
                : `<p class="text-xs text-secondary italic">Unassigned</p>`
            }
            ${badgeHtml}
          </div>
          ${
            isClaimable
              ? `<div class="flex justify-between items-center mt-3">
                   <button class="text-[10px] font-bold text-tertiary-dim hover:underline tracking-tighter" data-common-item-id="${escapeHtml(
                     ci.id
                   )}">CLAIM ITEM</button>
                 </div>`
              : ""
          }
        </div>
      `;

      if (isClaimable) {
        li.querySelector("[data-common-item-id]")?.addEventListener("click", () => {
          const viewerParticipantId = Storage.getViewerParticipantId();
          Storage.claimCommonItem(tripId, ci.id, viewerParticipantId);
          renderSharedTrip();
        });
      }

      commonItemsEl.appendChild(li);
    });

    if (messageBtn) {
      messageBtn.addEventListener("click", () => {
        showModal({
          title: "Message Group",
          bodyHtml:
            "<p class='text-sm text-text-main'>This is a prototype. We’ll store your draft message locally for now.</p><textarea id='packingapp-msgDraft' class='w-full border border-border-thin px-3 py-3 bg-surface outline-none mt-4' rows='4' placeholder='Write a short message to the group...'></textarea>",
          confirmText: "Save Draft",
          cancelText: "Close",
          onConfirm: () => {
            const draft = document.getElementById("packingapp-msgDraft")?.value || "";
            const key = `packingApp.sharedMessageDraft.${tripId}`;
            localStorage.setItem(key, draft);
          },
        });
      });
    }

    if (reminderBtn) {
      reminderBtn.addEventListener("click", () => {
        showModal({
          title: "Send Reminder",
          bodyHtml:
            "<p class='text-sm text-text-main'>Prototype behavior: we’ll record a reminder timestamp locally.</p>",
          confirmText: "Record Reminder",
          cancelText: "Close",
          onConfirm: () => {
            const key = `packingApp.sharedReminder.${tripId}`;
            localStorage.setItem(key, new Date().toISOString());
          },
        });
      });
    }

    if (addSharedRequirementBtn) {
      addSharedRequirementBtn.addEventListener("click", () => {
        showModal({
          title: "Add Shared Requirement",
          bodyHtml:
            "<p class='text-sm text-text-main'>Prototype behavior: create a draft requirement locally. Backend wiring comes later.</p><input id='packingapp-sharedReqTitle' class='w-full border border-border-thin px-3 py-3 bg-surface outline-none mt-4' placeholder='e.g. Waterproof Sandals'/>",
          confirmText: "Save Draft",
          cancelText: "Close",
          onConfirm: () => {
            const title = document.getElementById("packingapp-sharedReqTitle")?.value || "";
            const key = `packingApp.sharedReqDraft.${tripId}`;
            localStorage.setItem(key, title);
          },
        });
      });
    }
  }

  function renderInspiration() {
    const gridEl = document.getElementById("packingapp-inspirationGrid");
    const startBtn = document.getElementById("packingapp-startPlanningBtn");
    const viewAllBtn = document.getElementById("packingapp-viewAllDestinationsBtn");
    if (!gridEl) return;

    const inspiration = Api.getInspiration();
    const destinations = inspiration.destinations || [];

    gridEl.innerHTML = "";
    destinations.forEach((d) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className =
        "text-left group overflow-hidden border border-outline/30 bg-surface-container h-full flex flex-col";
      card.dataset.tripId = d.tripId;
      card.innerHTML = `
        <div class="h-[240px] overflow-hidden">
          <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="${escapeHtml(
            d.imageAlt || d.destinationTitle
          )}" src="${escapeHtml(d.imageUrl)}"/>
        </div>
        <div class="p-6 flex flex-col gap-2">
          <span class="text-[10px] tracking-[0.3em] font-sans uppercase text-secondary">${escapeHtml(
            d.destinationLabel || ""
          )}</span>
          <h3 class="font-headline text-2xl text-primary">${escapeHtml(d.destinationTitle)}</h3>
          <p class="font-body text-sm text-secondary leading-relaxed">${escapeHtml(d.description)}</p>
          <span class="mt-2 inline-flex items-center gap-2 text-[11px] font-sans tracking-[0.2em] uppercase text-primary pb-1 hover:text-tertiary transition-all">
            Select Destination <span class="material-symbols-outlined">chevron_right</span>
          </span>
        </div>
      `;

      card.addEventListener("click", () => {
        Storage.setSelectedTripId(d.tripId);
        window.location.href = `${NAV.checklist}?${Contract.urlParams.tripId}=${encodeURIComponent(
          d.tripId
        )}`;
      });

      gridEl.appendChild(card);
    });

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        const first = destinations[0];
        if (!first) return;
        Storage.setSelectedTripId(first.tripId);
        window.location.href = `${NAV.checklist}?${Contract.urlParams.tripId}=${encodeURIComponent(
          first.tripId
        )}`;
      });
    }

    if (viewAllBtn) {
      viewAllBtn.addEventListener("click", () => {
        gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function boot() {
    // Decide which screen we’re on by root markers/containers.
    if (document.getElementById("packingapp-tripList")) {
      renderHome();
      return;
    }
    if (document.getElementById("packingapp-checklistItems")) {
      renderChecklist();
      return;
    }
    if (document.getElementById("packingapp-weatherDaysList")) {
      renderWeather();
      return;
    }
    if (document.getElementById("packingapp-sharedParticipantsList")) {
      renderSharedTrip();
      return;
    }
    if (document.getElementById("packingapp-inspirationGrid")) {
      renderInspiration();
      return;
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();

