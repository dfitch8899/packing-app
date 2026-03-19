(function () {
  const ns = {};

  function computePackedPercentFromChecklist(checklist) {
    const allItems = [];
    for (const group of checklist.itemsByCategory) {
      for (const item of group.items) allItems.push(item);
    }
    const total = allItems.length || 1;
    const packed = allItems.filter((i) => i.isPacked).length;
    return Math.round((packed / total) * 100);
  }

  function applyChecklistPersistence(tripId, baseChecklist, persistence) {
    const itemPackedById = (persistence && persistence.itemPackedById) || {};
    const customItems = (persistence && persistence.customItems) || [];

    // Update base items packed flags from persistence.
    for (const group of baseChecklist.itemsByCategory) {
      for (const item of group.items) {
        if (Object.prototype.hasOwnProperty.call(itemPackedById, item.id)) {
          item.isPacked = Boolean(itemPackedById[item.id]);
        }
      }
    }

    // Merge custom items into the appropriate categories.
    baseChecklist.customItems = customItems;
    if (customItems.length > 0) {
      for (const item of customItems) {
        const target = baseChecklist.itemsByCategory.find(
          (g) => g.categoryId === item.categoryId
        );
        if (target) target.items.push(item);
      }
    }

    return baseChecklist;
  }

  function computeParticipantsPackedPercent(participants, checklist, viewerParticipantId) {
    // Compute from checklist item assignment.
    const items = [];
    for (const group of checklist.itemsByCategory) {
      for (const item of group.items) items.push(item);
    }

    const byParticipant = {};
    for (const p of participants) {
      byParticipant[p.id] = { total: 0, packed: 0 };
    }
    for (const item of items) {
      const assignee = item.assignedToParticipantId;
      if (!assignee) continue;
      if (!byParticipant[assignee]) byParticipant[assignee] = { total: 0, packed: 0 };
      byParticipant[assignee].total += 1;
      if (item.isPacked) byParticipant[assignee].packed += 1;
    }

    return participants.map((p) => {
      const stat = byParticipant[p.id] || { total: 0, packed: 0 };
      const denom = stat.total || 1;
      const pct = Math.round((stat.packed / denom) * 100);
      return { ...p, packedPercent: pct };
    });
  }

  function withSharedCommonItems(tripId, baseSharedTrip, sharedPersistence, checklist) {
    const override = (sharedPersistence && sharedPersistence.commonItemById) || {};
    const commonItems = baseSharedTrip.commonItems.map((ci) => {
      if (override[ci.id]) {
        return {
          ...ci,
          assignedToParticipantId: override[ci.id].assignedToParticipantId ?? ci.assignedToParticipantId,
          status: override[ci.id].status ?? ci.status,
        };
      }
      return ci;
    });

    // If a user has claimed items, participants readiness should be driven by checklist
    // anyway; common item claim UI is separate. We keep computed participants from checklist.
    const participants = computeParticipantsPackedPercent(
      baseSharedTrip.participants,
      checklist,
      null
    );

    return {
      ...baseSharedTrip,
      participants,
      commonItems,
    };
  }

  // ---------- Mock Data ----------
  const trips = [
    {
      id: "trip_kyoto",
      destinationName: "Kyoto",
      dateRangeText: "Oct 12 - Oct 24",
      heroImageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBxzaUdhzGFh6DraJVY65I3JpbufqTW_HqtwHwIJ76qzJAfw38GTdjDxr4e0cvDjOejp9k-PX0-TZmJYeB6HzmeT8E4t7HD9IXdTXyrI-gfWwiaghviHrDYR1r6T9xeWRXG1igtCaSaTNXd2PUdPozddnfA0QjMpaSyp0fYAgyWb6Ru22iIvYyqRghSbOEwgJCWV8NTC0qEQE_9tx5pgzrAJ5xcn8bl22LinnfzrC_AViPyKW7_Y4N-eLKiHCGKrzQKuRocfioqp7A",
      heroImageAlt: "Kyoto temple hero",
    },
    {
      id: "trip_paris",
      destinationName: "Paris",
      dateRangeText: "Sep 1 - Sep 14",
      heroImageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCj3k2QJ7zq2V8sE4vY2X0m5rJY3Jm7c2pGJv6dQy1w0Xxv3uTQdFfTQn8ZyH9n1gZyqzv5Qp8m5vQx3dV3wq2s3c0w6y8yG2s1hVZ",
      heroImageAlt: "Paris hero",
    },
    {
      id: "trip_reykjavik",
      destinationName: "Reykjavik",
      dateRangeText: "Dec 5 - Dec 12",
      heroImageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAN4RBPqH3HktVs4uLLYwimw3XLoriL1UOGpczCrbG0Pe01ewwgWXeMkYsFxmY6SW2opJdLKRoQTi1cSwZHldqBF1MUQMrv9Fl-HZhXSLm73A4jehYWG7WSbogb1I1C55W-aAnAYDio_XolmkRpJSGNOPRW2lvfW5OUnSc-h_tunArieNEoApf-hWMG7DFgDSLxP1sRGlpekizv2p_EqqNol4I9YZq0ewZeL_lHCcUSn_CyJfmKiOHCqLspxjwrBnwenvjTfYkqY0k",
      heroImageAlt: "Reykjavik hero",
    },
  ];

  const participantsBase = [
    { id: "p_alice", name: "Alice", roleTitle: "Lead Coordinator", packedPercent: 0 },
    { id: "p_bob", name: "Bob", roleTitle: "Photography", packedPercent: 0 },
    { id: "p_clara", name: "Clara", roleTitle: "Logistics", packedPercent: 0 },
    { id: "p_david", name: "David", roleTitle: "Culinary Lead", packedPercent: 0 },
  ];

  function baseChecklistForTrip(tripId) {
    const checklist = {
      tripId,
      categories: [
        { id: "cat_clothing", title: "Clothing" },
        { id: "cat_toiletries", title: "Toiletries" },
        { id: "cat_tech", title: "Tech" },
        { id: "cat_essentials", title: "Essentials" },
      ],
      itemsByCategory: [
        { categoryId: "cat_clothing", items: [] },
        { categoryId: "cat_toiletries", items: [] },
        { categoryId: "cat_tech", items: [] },
        { categoryId: "cat_essentials", items: [] },
      ],
      customItems: [],
    };

    if (tripId === "trip_kyoto") {
      // Matches the feel of the exported Home/Checklist prototypes.
      const baseItems = [
        { id: "item_merino_sweaters", label: "Merino Wool Sweaters", quantity: 2, isPacked: true, assignedToParticipantId: "p_alice", categoryId: "cat_clothing", isCustom: false },
        { id: "item_rain_jacket", label: "Lightweight Rain Jacket", quantity: 1, isPacked: true, assignedToParticipantId: "p_alice", categoryId: "cat_clothing", isCustom: false },
        { id: "item_trousers", label: "Evening Trousers", quantity: 2, isPacked: false, assignedToParticipantId: "p_clara", categoryId: "cat_clothing", isCustom: false, subtitle: "Navy linen" },
        { id: "item_undergarments", label: "Undergarments", quantity: 8, isPacked: true, assignedToParticipantId: "p_bob", categoryId: "cat_clothing", isCustom: false },

        { id: "item_walking_shoes", label: "Comfortable Walking Shoes", quantity: 1, isPacked: false, assignedToParticipantId: "p_clara", categoryId: "cat_essentials", isCustom: false },
        { id: "item_umbrella", label: "Compact Umbrella", quantity: 1, isPacked: false, assignedToParticipantId: "p_david", categoryId: "cat_essentials", isCustom: false },

        { id: "item_facewash", label: "Sea Salt Face Wash", quantity: 1, isPacked: true, assignedToParticipantId: "p_bob", categoryId: "cat_toiletries", isCustom: false },
        { id: "item_toothpaste", label: "Toothbrush + Paste", quantity: 1, isPacked: false, assignedToParticipantId: "p_alice", categoryId: "cat_toiletries", isCustom: false },
        { id: "item_sunscreen", label: "Sunscreen SPF30", quantity: 1, isPacked: false, assignedToParticipantId: "p_clara", categoryId: "cat_toiletries", isCustom: false },

        { id: "item_adapter", label: "Power Adapter", quantity: 1, isPacked: false, assignedToParticipantId: "p_david", categoryId: "cat_tech", isCustom: false },
        { id: "item_cam_batt", label: "Camera Batteries", quantity: 2, isPacked: true, assignedToParticipantId: "p_bob", categoryId: "cat_tech", isCustom: false },
      ];

      for (const item of baseItems) {
        const group = checklist.itemsByCategory.find((g) => g.categoryId === item.categoryId);
        if (group) {
          // eslint-disable-next-line no-param-reassign
          group.items.push({
            id: item.id,
            label: item.label,
            quantity: item.quantity,
            isPacked: Boolean(item.isPacked),
            assignedToParticipantId: item.assignedToParticipantId,
            isCustom: Boolean(item.isCustom),
            // Keep categoryId around so custom merge can place correctly.
            categoryId: item.categoryId,
          });
        }
      }
    } else if (tripId === "trip_paris") {
      // For MVP: make it feel complete.
      const baseItems = [
        { id: "item_merino_sweaters", label: "Merino Wool Sweaters", quantity: 2, isPacked: true, assignedToParticipantId: "p_alice", categoryId: "cat_clothing", isCustom: false },
        { id: "item_rain_jacket", label: "Lightweight Rain Jacket", quantity: 1, isPacked: true, assignedToParticipantId: "p_alice", categoryId: "cat_clothing", isCustom: false },
        { id: "item_trousers", label: "Evening Trousers", quantity: 2, isPacked: true, assignedToParticipantId: "p_clara", categoryId: "cat_clothing", isCustom: false },
        { id: "item_undergarments", label: "Undergarments", quantity: 8, isPacked: true, assignedToParticipantId: "p_bob", categoryId: "cat_clothing", isCustom: false },

        { id: "item_walking_shoes", label: "Comfortable Walking Shoes", quantity: 1, isPacked: true, assignedToParticipantId: "p_clara", categoryId: "cat_essentials", isCustom: false },
        { id: "item_umbrella", label: "Compact Umbrella", quantity: 1, isPacked: true, assignedToParticipantId: "p_david", categoryId: "cat_essentials", isCustom: false },

        { id: "item_facewash", label: "Sea Salt Face Wash", quantity: 1, isPacked: true, assignedToParticipantId: "p_bob", categoryId: "cat_toiletries", isCustom: false },
        { id: "item_toothpaste", label: "Toothbrush + Paste", quantity: 1, isPacked: true, assignedToParticipantId: "p_alice", categoryId: "cat_toiletries", isCustom: false },
        { id: "item_sunscreen", label: "Sunscreen SPF30", quantity: 1, isPacked: true, assignedToParticipantId: "p_clara", categoryId: "cat_toiletries", isCustom: false },

        { id: "item_adapter", label: "Power Adapter", quantity: 1, isPacked: true, assignedToParticipantId: "p_david", categoryId: "cat_tech", isCustom: false },
        { id: "item_cam_batt", label: "Camera Batteries", quantity: 2, isPacked: true, assignedToParticipantId: "p_bob", categoryId: "cat_tech", isCustom: false },
      ];

      for (const item of baseItems) {
        const group = checklist.itemsByCategory.find((g) => g.categoryId === item.categoryId);
        if (group) {
          group.items.push({
            id: item.id,
            label: item.label,
            quantity: item.quantity,
            isPacked: Boolean(item.isPacked),
            assignedToParticipantId: item.assignedToParticipantId,
            isCustom: Boolean(item.isCustom),
            categoryId: item.categoryId,
          });
        }
      }
    } else if (tripId === "trip_reykjavik") {
      // For MVP: show zero packed.
      const baseItems = [
        { id: "item_merino_sweaters", label: "Merino Wool Sweaters", quantity: 2, isPacked: false, assignedToParticipantId: "p_alice", categoryId: "cat_clothing", isCustom: false },
        { id: "item_rain_jacket", label: "Lightweight Rain Jacket", quantity: 1, isPacked: false, assignedToParticipantId: "p_alice", categoryId: "cat_clothing", isCustom: false },
        { id: "item_trousers", label: "Evening Trousers", quantity: 2, isPacked: false, assignedToParticipantId: "p_clara", categoryId: "cat_clothing", isCustom: false },
        { id: "item_undergarments", label: "Undergarments", quantity: 8, isPacked: false, assignedToParticipantId: "p_bob", categoryId: "cat_clothing", isCustom: false },

        { id: "item_walking_shoes", label: "Comfortable Walking Shoes", quantity: 1, isPacked: false, assignedToParticipantId: "p_clara", categoryId: "cat_essentials", isCustom: false },
        { id: "item_umbrella", label: "Compact Umbrella", quantity: 1, isPacked: false, assignedToParticipantId: "p_david", categoryId: "cat_essentials", isCustom: false },

        { id: "item_facewash", label: "Sea Salt Face Wash", quantity: 1, isPacked: false, assignedToParticipantId: "p_bob", categoryId: "cat_toiletries", isCustom: false },
        { id: "item_toothpaste", label: "Toothbrush + Paste", quantity: 1, isPacked: false, assignedToParticipantId: "p_alice", categoryId: "cat_toiletries", isCustom: false },
        { id: "item_sunscreen", label: "Sunscreen SPF30", quantity: 1, isPacked: false, assignedToParticipantId: "p_clara", categoryId: "cat_toiletries", isCustom: false },

        { id: "item_adapter", label: "Power Adapter", quantity: 1, isPacked: false, assignedToParticipantId: "p_david", categoryId: "cat_tech", isCustom: false },
        { id: "item_cam_batt", label: "Camera Batteries", quantity: 2, isPacked: false, assignedToParticipantId: "p_bob", categoryId: "cat_tech", isCustom: false },
      ];

      for (const item of baseItems) {
        const group = checklist.itemsByCategory.find((g) => g.categoryId === item.categoryId);
        if (group) {
          group.items.push({
            id: item.id,
            label: item.label,
            quantity: item.quantity,
            isPacked: Boolean(item.isPacked),
            assignedToParticipantId: item.assignedToParticipantId,
            isCustom: Boolean(item.isCustom),
            categoryId: item.categoryId,
          });
        }
      }
    }

    return checklist;
  }

  function forecastForTrip(tripId) {
    if (tripId === "trip_kyoto") {
      return {
        tripId,
        headerTitle: "Kyoto Forecast",
        dateRangeText: "OCT 12 — 24",
        currentConditions: { temperatureC: 19, summaryText: "Partly Cloudy", humidityText: "Humidity 64% • NW 12 km/h" },
        sevenDayOutlook: [
          { labelText: "Mon, Oct 12", iconName: "cloud", rainChance: 20, highC: 22, lowC: 14, rainText: "20% Rain" },
          { labelText: "Tue, Oct 13", iconName: "rainy", rainChance: 85, highC: 18, lowC: 15, rainText: "85% Rain" },
          { labelText: "Wed, Oct 14", iconName: "wb_sunny", rainChance: 5, highC: 24, lowC: 12, rainText: "5% Rain" },
          { labelText: "Thu, Oct 15", iconName: "partly_cloudy_day", rainChance: 10, highC: 21, lowC: 13, rainText: "10% Rain" },
          { labelText: "Fri, Oct 16", iconName: "cloud", rainChance: 30, highC: 19, lowC: 11, rainText: "30% Rain" },
        ],
        packingStrategyBlocks: [
          { iconName: "umbrella", title: "Heavy Rain Alert", body: "Expect rain on Tuesday—ensure your raincoat and waterproof shoes are packed for temple visits." },
          { iconName: "layers", title: "Thermal Layering", body: "Evening lows of 11° require a light wool scarf or a packable down vest for night walks in Gion." },
          { iconName: "footprint", title: "Footwear", body: "Uneven stone paths at Fushimi Inari will be slippery. Prioritize grip over aesthetics." },
        ],
        recommendedItems: ["Linen Shell", "Gore-Tex Trail", "Merino Socks", "Travel Tote"],
      };
    }

    if (tripId === "trip_paris") {
      return {
        tripId,
        headerTitle: "Paris Forecast",
        dateRangeText: "SEP 1 — 14",
        currentConditions: { temperatureC: 22, summaryText: "Light Showers", humidityText: "Humidity 58% • SW 9 km/h" },
        sevenDayOutlook: [
          { labelText: "Mon, Sep 1", iconName: "rainy", rainChance: 40, highC: 24, lowC: 16, rainText: "40% Rain" },
          { labelText: "Tue, Sep 2", iconName: "partly_cloudy_day", rainChance: 15, highC: 23, lowC: 15, rainText: "15% Rain" },
          { labelText: "Wed, Sep 3", iconName: "wb_sunny", rainChance: 5, highC: 26, lowC: 17, rainText: "5% Rain" },
          { labelText: "Thu, Sep 4", iconName: "cloud", rainChance: 25, highC: 25, lowC: 16, rainText: "25% Rain" },
          { labelText: "Fri, Sep 5", iconName: "cloud", rainChance: 10, highC: 24, lowC: 15, rainText: "10% Rain" },
        ],
        packingStrategyBlocks: [
          { iconName: "umbrella", title: "Light Showers", body: "Pack a compact umbrella and a breathable rain layer for café-to-street transitions." },
          { iconName: "layers", title: "Evening Comfort", body: "Bring a thin knit or scarf for cooler dinner hours along the Seine." },
          { iconName: "footprint", title: "Walkable Shoes", body: "City pavement adds up. Prioritize comfort and traction over stiff silhouettes." },
        ],
        recommendedItems: ["Packable Umbrella", "Light Wool Scarf", "Comfort Trainers", "Waterproof Tote"],
      };
    }

    return {
      tripId,
      headerTitle: "Reykjavik Forecast",
      dateRangeText: "DEC 5 — 12",
      currentConditions: { temperatureC: 4, summaryText: "Cold & Windy", humidityText: "Humidity 72% • N 18 km/h" },
      sevenDayOutlook: [
        { labelText: "Mon, Dec 5", iconName: "cloud", rainChance: 20, highC: 5, lowC: 1, rainText: "20% Rain" },
        { labelText: "Tue, Dec 6", iconName: "rainy", rainChance: 65, highC: 4, lowC: 0, rainText: "65% Rain" },
        { labelText: "Wed, Dec 7", iconName: "wb_sunny", rainChance: 10, highC: 6, lowC: 1, rainText: "10% Rain" },
        { labelText: "Thu, Dec 8", iconName: "partly_cloudy_day", rainChance: 30, highC: 5, lowC: 0, rainText: "30% Rain" },
        { labelText: "Fri, Dec 9", iconName: "cloud", rainChance: 25, highC: 4, lowC: -1, rainText: "25% Rain" },
      ],
      packingStrategyBlocks: [
        { iconName: "layers", title: "Wind-Ready Layering", body: "Favor a base + insulation + shell combo for brisk coastal gusts." },
        { iconName: "umbrella", title: "Wet Weather Shield", body: "Keep a waterproof layer accessible for sudden showers." },
        { iconName: "footprint", title: "Cold-Weather Traction", body: "Prioritize grip and warmth for uneven paths." },
      ],
      recommendedItems: ["Packable Shell", "Warm Socks", "Thermal Base Layer", "Waterproof Boots"],
    };
  }

  function sharedTripForTrip(tripId, checklist, sharedPersistence) {
    // Base common items (assignment may be overridden by persistence).
    let commonItems;
    let tripTitleText;

    if (tripId === "trip_kyoto") {
      tripTitleText = "Tuscany Retreat 2024"; // matches the vibe of the exported prototype
      commonItems = [
        { id: "common_first_aid", title: "First Aid Kit", assignedToParticipantId: "p_alice", status: "READY" },
        { id: "common_adapters", title: "Universal Adapters (3)", assignedToParticipantId: "p_david", status: "PENDING" },
        { id: "common_maps", title: "Physical Maps & Guide", assignedToParticipantId: "p_clara", status: "READY" },
        { id: "common_flashlight", title: "High-Lumen Flashlight", assignedToParticipantId: null, status: "PENDING" },
      ];
    } else if (tripId === "trip_paris") {
      tripTitleText = "Paris Atelier Walkthrough";
      commonItems = [
        { id: "common_first_aid", title: "First Aid Kit", assignedToParticipantId: "p_alice", status: "READY" },
        { id: "common_adapters", title: "Universal Adapters (3)", assignedToParticipantId: "p_david", status: "READY" },
        { id: "common_maps", title: "Physical Maps & Guide", assignedToParticipantId: "p_clara", status: "READY" },
        { id: "common_flashlight", title: "High-Lumen Flashlight", assignedToParticipantId: null, status: "PENDING" },
      ];
    } else {
      tripTitleText = "Reykjavik Lantern Season";
      commonItems = [
        { id: "common_first_aid", title: "First Aid Kit", assignedToParticipantId: null, status: "PENDING" },
        { id: "common_adapters", title: "Universal Adapters (3)", assignedToParticipantId: "p_david", status: "PENDING" },
        { id: "common_maps", title: "Physical Maps & Guide", assignedToParticipantId: "p_clara", status: "PENDING" },
        { id: "common_flashlight", title: "High-Lumen Flashlight", assignedToParticipantId: null, status: "PENDING" },
      ];
    }

    const baseSharedTrip = {
      tripId,
      tripTitleText,
      participants: participantsBase.map((p) => ({ ...p })),
      commonItems,
    };

    return withSharedCommonItems(tripId, baseSharedTrip, sharedPersistence, checklist);
  }

  ns.getTrips = function () {
    return trips.map((t) => ({ ...t }));
  };

  ns.getChecklist = function (tripId, checklistPersistence) {
    const baseChecklist = baseChecklistForTrip(tripId);
    const merged = applyChecklistPersistence(tripId, baseChecklist, checklistPersistence);
    return merged;
  };

  ns.getForecast = function (tripId) {
    return forecastForTrip(tripId);
  };

  ns.getSharedTrip = function (tripId, sharedPersistence, checklist) {
    return sharedTripForTrip(tripId, checklist, sharedPersistence);
  };

  ns.getInspiration = function () {
    return {
      destinations: [
        {
          id: "insp_kyoto",
          tripId: "trip_kyoto",
          destinationLabel: "Destination 01",
          destinationTitle: "Kyoto, Japan",
          description: "Where morning light meets quiet rituals; pack for transitions, not forecasts.",
          imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCfTWWPe1WATEsIbvMuNLrp6c4N-nbrkTxiDbDRnCedxV4mmA5PhB9-bwy2hDBUeDzvn42ldfdTfNvyLK4hT_EkcPCyr-NpmI_GQVI2ZYeGEkDfPG3rt7nHPTVhxS5poqDewCGM4hPiJpdZeqcW6AXaEPMoeY_HZyYbg5yDf_fgHapkjR5N_3Le2rGY8M7J-vIutgM2uiYzUSoNDZTz7iXXWnbd_hNi4blPtiKVRY6fWOE1frNDSEKr8K2ssbHIcAKpTwIx6ApuyEs",
          imageAlt: "Kyoto inspiration",
        },
        {
          id: "insp_paris",
          tripId: "trip_paris",
          destinationLabel: "Destination 02",
          destinationTitle: "Paris, France",
          description: "An elegant edit of essentials; fewer items, better rhythm, longer walks.",
          imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCj3k2QJ7zq2V8sE4vY2X0m5rJY3Jm7c2pGJv6dQy1w0Xxv3uTQdFfTQn8ZyH9n1gZyqzv5Qp8m5vQx3dV3wq2s3c0w6y8yG2s1hVZ",
          imageAlt: "Paris inspiration",
        },
        {
          id: "insp_reykjavik",
          tripId: "trip_reykjavik",
          destinationLabel: "Destination 03",
          destinationTitle: "Reykjavik, Iceland",
          description: "Cold air, warm layers. A trip designed around wind, light, and pace.",
          imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAN4RBPqH3HktVs4uLLYwimw3XLoriL1UOGpczCrbG0Pe01ewwgWXeMkYsFxmY6SW2opJdLKRoQTi1cSwZHldqBF1MUQMrv9Fl-HZhXSLm73A4jehYWG7WSbogb1I1C55W-aAnAYDio_XolmkRpJSGNOPRW2lvfW5OUnSc-h_tunArieNEoApf-hWMG7DFgDSLxP1sRGlpekizv2p_EqqNol4I9YZq0ewZeL_lHCcUSn_CyJfmKiOHCqLspxjwrBnwenvjTfYkqY0k",
          imageAlt: "Reykjavik inspiration",
        },
      ],
    };
  };

  // Expose.
  window.PackingAppMockApi = ns;
})();

