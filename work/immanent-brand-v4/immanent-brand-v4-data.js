(function () {
  const assetBase = "/images/immanent-v4/";

  const assets = {
    heroDuo: {
      src: assetBase + "IMMANENT_14_DUO_pair_styled_pomelo.png",
      ratio: "1086:1448",
      type: "photography",
      fit: "cover",
      focal: "50% 48%",
      alt: {
        en: "PEEL 01 and PULP 01 presented with pomelo.",
        zh: "PEEL 01 与 PULP 01 以柚子素材呈现。"
      }
    },
    sourceStill: {
      src: assetBase + "04_Duo_luxury_mood_source_still_life.png",
      ratio: "1448:1086",
      type: "photography",
      fit: "cover",
      focal: "48% 50%",
      alt: {
        en: "Pomelo source still life with PEEL and PULP.",
        zh: "以柚子来源为核心的 PEEL 与 PULP 静物图。"
      }
    },
    peelMain: {
      src: assetBase + "IMMANENT_05_PEEL_front_main.png",
      ratio: "1086:1448",
      type: "packshot",
      fit: "contain",
      focal: "50% 50%",
      alt: { en: "PEEL 01 front packshot.", zh: "PEEL 01 正面产品图。" }
    },
    peelTactile: {
      src: assetBase + "03_PEEL_tactile_detail_hero.png",
      ratio: "1122:1402",
      type: "photography",
      fit: "cover",
      focal: "52% 44%",
      alt: { en: "PEEL 01 tactile cap detail.", zh: "PEEL 01 触感盖体细节。" }
    },
    peelOpen: {
      src: assetBase + "IMMANENT_03_PEEL_open_action_rollerball.png",
      ratio: "1086:1448",
      type: "photography",
      fit: "cover",
      focal: "50% 46%",
      alt: { en: "PEEL 01 open roller-ball action.", zh: "PEEL 01 打开后的滚珠使用状态。" }
    },
    peelAngled: {
      src: assetBase + "IMMANENT_02_PEEL_front_angled.png",
      ratio: "1086:1448",
      type: "photography",
      fit: "cover",
      focal: "50% 46%",
      alt: { en: "PEEL 01 angled view.", zh: "PEEL 01 斜角视图。" }
    },
    pulpMain: {
      src: assetBase + "IMMANENT_07_PULP_front_main.png",
      ratio: "1086:1448",
      type: "packshot",
      fit: "contain",
      focal: "50% 50%",
      alt: { en: "PULP 01 front packshot.", zh: "PULP 01 正面产品图。" }
    },
    pulpCap: {
      src: assetBase + "IMMANENT_08_PULP_measuring_cap_detail.png",
      ratio: "1086:1448",
      type: "photography",
      fit: "cover",
      focal: "50% 43%",
      alt: { en: "PULP 01 measuring cap detail.", zh: "PULP 01 量杯盖细节。" }
    },
    pulpOpen: {
      src: assetBase + "IMMANENT_01_PULP_open_action.png",
      ratio: "1086:1448",
      type: "photography",
      fit: "cover",
      focal: "50% 46%",
      alt: { en: "PULP 01 open state.", zh: "PULP 01 打开状态。" }
    },
    pulpPour: {
      src: assetBase + "02_PULP_ritual_measured_pour_hero.png",
      ratio: "1448:1086",
      type: "photography",
      fit: "cover",
      focal: "54% 50%",
      alt: { en: "PULP 01 measured pour ritual.", zh: "PULP 01 计量倒取仪式。" }
    },
    pulpStill: {
      src: assetBase + "IMMANENT_12_PULP_still_life_pomelo.png",
      ratio: "1086:1448",
      type: "photography",
      fit: "cover",
      focal: "50% 45%",
      alt: { en: "PULP 01 still life with pomelo.", zh: "PULP 01 与柚子静物。" }
    },
    duoClean: {
      src: assetBase + "IMMANENT_10_DUO_pair_front_clean.png",
      ratio: "1086:1448",
      type: "packshot",
      fit: "contain",
      focal: "50% 50%",
      alt: { en: "PEEL 01 and PULP 01 clean duo packshot.", zh: "PEEL 01 与 PULP 01 组合产品图。" }
    },
    giftBox: {
      src: assetBase + "IMMANENT_13_PACKAGING_gift_box.png",
      ratio: "1086:1448",
      type: "photography",
      fit: "cover",
      focal: "50% 50%",
      alt: { en: "Harvest 01 Duo gift box.", zh: "来源 01 礼盒。" }
    },
    retail: {
      src: assetBase + "05_Retail_counter_display_refined_scene.png",
      ratio: "1448:1086",
      type: "photography",
      fit: "cover",
      focal: "50% 54%",
      alt: { en: "IMMANENT retail counter scene.", zh: "IMMANENT 零售台面场景。" }
    },
    moodDuo: {
      src: assetBase + "IMMANENT_16_DUO_pair_styled_luxe.png",
      ratio: "1122:1402",
      type: "photography",
      fit: "cover",
      focal: "50% 52%",
      alt: { en: "Styled PEEL and PULP mood image.", zh: "PEEL 与 PULP 氛围图。" }
    }
  };

  const products = {
    peel: {
      slug: "peel-01",
      category: { en: "Botanical Perfume Oil", zh: "植物香氛油" },
      name: "PEEL 01",
      size: "15 mL",
      price: 65,
      priceLabel: "£65",
      oneLine: {
        en: "15 mL · pomelo peel · roller-ball touch.",
        zh: "15 mL · 柚子果皮 · 滚珠轻触"
      },
      thumbnail: "peelMain",
      hoverImage: "peelTactile",
      gallery: ["peelMain", "peelTactile", "peelOpen", "peelAngled"],
      profile: {
        en: "Pomelo peel · green petitgrain · pale woods",
        zh: "柚子果皮 · 青绿叶枝感 · 浅色干燥木质"
      },
      howToUse: {
        en: "Roll lightly onto pulse points such as wrists and neck. For external use only.",
        zh: "轻滚于手腕、颈侧等脉搏点。仅供外用。"
      },
      object: {
        en: "Translucent olive overcap · roller-ball applicator · tactile ivory body",
        zh: "半透明橄榄色罩盖 · 滚珠涂抹结构 · 象牙色触感瓶身"
      },
      origin: {
        en: "Harvest 01. Reference cultivar: Red-fleshed Guanxi Honey Pomelo, Pinghe, Fujian.",
        zh: "来源 01。参考品种：平和红肉琯溪蜜柚，福建平和。"
      },
      formulaNote: {
        en: "A fragrance direction built around pomelo peel, green petitgrain and pale woods.",
        zh: "围绕柚子果皮、青绿叶枝感与浅色木质展开的香气方向。"
      },
      delivery: {
        en: "Checkout and delivery are not enabled in this preview.",
        zh: "当前预览不提供实际结算或配送。"
      },
      storyImage: "peelTactile",
      storyTitle: { en: "Close to skin.", zh: "贴近肌肤。" },
      story: {
        en: "PEEL 01 keeps scent small and tactile: a roll-on object carried close, used with a controlled touch.",
        zh: "PEEL 01 将香气控制在贴近身体的尺度：随身携带，以滚珠轻触使用。"
      },
      related: "pulp"
    },
    pulp: {
      slug: "pulp-01",
      category: { en: "Botanical Drink Concentrate", zh: "植物饮用浓缩液" },
      name: "PULP 01",
      size: "250 mL",
      price: 30,
      priceLabel: "£30",
      oneLine: {
        en: "250 mL · 25 mL per serve · mix with 150–200 mL cold water or sparkling water.",
        zh: "250 mL · 每次 25 mL · 兑入约 150–200 mL 冰水或气泡水"
      },
      thumbnail: "pulpMain",
      hoverImage: "pulpCap",
      gallery: ["pulpMain", "pulpCap", "pulpOpen", "pulpPour"],
      profile: {
        en: "Pomelo · yuzu · lemongrass · ginger",
        zh: "柚子 · 柑橘 · 香茅 · 姜"
      },
      howToUse: {
        en: "Measure 25 mL PULP 01 and lengthen with approximately 150–200 mL chilled still or sparkling water. Approx. 10 serves.",
        zh: "每次量取 25 mL，兑入约 150–200 mL 冰水或气泡水。约 10 次调饮。"
      },
      object: {
        en: "250 mL bottle · 25 mL serve · cap marks 10 / 15 / 20 / 25 mL",
        zh: "250 mL 瓶身 · 25 mL 单次量取 · 量杯刻度 10 / 15 / 20 / 25 mL"
      },
      origin: {
        en: "Harvest 01. Reference cultivar: Red-fleshed Guanxi Honey Pomelo, Pinghe, Fujian.",
        zh: "来源 01。参考品种：平和红肉琯溪蜜柚，福建平和。"
      },
      formulaNote: {
        en: "A pomelo drink direction with yuzu, lemongrass and ginger.",
        zh: "以柚子为主体，并加入柑橘、香茅与姜的饮用方向。"
      },
      delivery: {
        en: "Checkout and delivery are not enabled in this preview.",
        zh: "当前预览不提供实际结算或配送。"
      },
      storyImage: "pulpPour",
      storyTitle: { en: "Measured, then mixed.", zh: "量取，再调饮。" },
      story: {
        en: "PULP 01 is built around a measured serve, making the ritual short, clear and repeatable.",
        zh: "PULP 01 围绕一次清楚的量取建立使用仪式，让调饮过程短、准、可重复。"
      },
      related: "peel"
    },
    duo: {
      slug: "duo",
      category: { en: "Harvest 01 gift set", zh: "来源 01 礼盒" },
      name: { en: "HARVEST 01 DUO", zh: "来源 01 礼盒" },
      size: "PEEL 01 + PULP 01",
      price: 88,
      priceLabel: "£88",
      oneLine: {
        en: "One box, two experiences. PEEL and PULP share a source while keeping separate product logic.",
        zh: "一盒，两种体验。PEEL 与 PULP 来自同一次采收，但各自保留完整的产品逻辑。"
      },
      thumbnail: "giftBox",
      hoverImage: "duoClean",
      gallery: ["giftBox", "duoClean", "heroDuo", "moodDuo"],
      profile: {
        en: "PEEL 01 botanical perfume oil · PULP 01 botanical drink concentrate",
        zh: "PEEL 01 植物香氛油 · PULP 01 植物饮用浓缩液"
      },
      howToUse: {
        en: "Use PEEL close to skin. Mix PULP as a chilled serve. The products are connected by source, not formula.",
        zh: "PEEL 贴肤使用，PULP 冷水或气泡水调饮。两者由来源相连，而非配方相同。"
      },
      object: {
        en: "Gift box direction with two independent products.",
        zh: "礼盒方向包含两款彼此独立的产品。"
      },
      origin: {
        en: "Harvest 01. Reference cultivar: Red-fleshed Guanxi Honey Pomelo, Pinghe, Fujian.",
        zh: "来源 01。参考品种：平和红肉琯溪蜜柚，福建平和。"
      },
      formulaNote: {
        en: "A gift set direction pairing two independent products from one ingredient origin.",
        zh: "礼盒方向将两款彼此独立的产品放在同一原料来源下理解。"
      },
      delivery: {
        en: "Checkout and delivery are not enabled in this preview.",
        zh: "当前预览不提供实际结算或配送。"
      },
      storyImage: "sourceStill",
      storyTitle: { en: "One source, kept clear.", zh: "同一来源，清楚分开。" },
      story: {
        en: "The duo makes the source relationship visible while preserving two separate use moments.",
        zh: "套组让共同来源可被理解，同时保留两种清楚分开的使用时刻。"
      },
      related: "peel"
    }
  };

  window.IMMANENT_BRAND_V4_DATA = {
    settings: {
      debugAssets: false,
      defaultLanguage: "en",
      brandRoot: "/work/immanent-brand-v4/"
    },
    identity: {
      brand: "IMMANENT",
      chinese: "蕴"
    },
    ui: {
      skip: { en: "Skip to content", zh: "跳至正文" },
      menu: { en: "Menu", zh: "菜单" },
      close: { en: "Close", zh: "关闭" },
      bag: { en: "Bag", zh: "购物袋" },
      addToBag: { en: "Add to bag", zh: "加入购物袋" },
      discoverPeel: { en: "View PEEL", zh: "查看 PEEL" },
      discoverPulp: { en: "View PULP", zh: "查看 PULP" },
      viewGiftSet: { en: "View gift set", zh: "查看礼盒" },
      shopNow: { en: "View product", zh: "查看产品" },
      previous: { en: "Previous image", zh: "上一张图片" },
      next: { en: "Next image", zh: "下一张图片" },
      remove: { en: "Remove", zh: "移除" },
      checkout: { en: "Checkout", zh: "结算" },
      subtotal: { en: "Subtotal", zh: "小计" },
      emptyBag: { en: "Your bag is empty.", zh: "购物袋为空。" },
      conceptPrototype: { en: "Concept preview", zh: "概念预览" },
      checkoutDisabled: { en: "Checkout is not enabled.", zh: "当前不提供实际结算。" },
      continueBrowsing: { en: "Continue browsing", zh: "继续浏览" }
    },
    nav: [
      { id: "source", label: { en: "SOURCE", zh: "来源" } },
      { id: "peel-01", label: { en: "PEEL", zh: "PEEL" }, product: "peel" },
      { id: "pulp-01", label: { en: "PULP", zh: "PULP" }, product: "pulp" },
      { id: "process", label: { en: "PROCESS", zh: "制作" } },
      { id: "duo", label: { en: "GIFT SET", zh: "礼盒" }, product: "duo" },
      { id: "about", label: { en: "ABOUT", zh: "关于" } }
    ],
    assets,
    products,
    home: {
      hero: {
        titleLines: {
          en: ["One pomelo,", "two ways to experience it."],
          zh: ["一枚柚子，", "两种感官体验。"]
        },
        bodyLines: {
          en: [
            "Peel becomes a close-to-skin perfume oil. Pulp becomes a low-sweetness drink concentrate.",
            "They share a source, not a formula."
          ],
          zh: [
            "果皮成为贴肤香氛油，果肉成为低甜度饮用浓缩液。",
            "两款产品来自同一次采收，但配方与使用方式彼此独立。"
          ]
        }
      },
      shop: {
        eyebrow: { en: "Shop the two products", zh: "两款核心产品" },
        title: { en: "Choose a sensory path.", zh: "选择一条感官路径。" }
      },
      origin: {
        eyebrow: { en: "Source", zh: "来源" },
        titleLines: {
          en: ["Starting from", "one ingredient."],
          zh: ["从同一种", "原料出发。"]
        },
        bodyLines: {
          en: [
            "We chose pomelo because peel, pith and pulp already suggest different uses.",
            "PEEL focuses on peel aroma. PULP focuses on pulp flavour.",
            "Pith is kept as a material study, not a product for sale."
          ],
          zh: [
            "我们选择柚子，是因为果皮、白瓤和果肉本身就有不同的用途。",
            "PEEL 聚焦果皮芳香，PULP 聚焦果肉风味；白瓤只作为材料研究，不作为商品销售。"
          ]
        },
        sourcing: {
          en: "Reference cultivar: Red-fleshed Guanxi Honey Pomelo · Citrus maxima · Pinghe, Fujian, China",
          zh: "参考品种：平和红肉琯溪蜜柚 · Citrus maxima · 福建平和"
        }
      },
      ritual: {
        eyebrow: { en: "Process", zh: "制作" },
        titleLines: {
          en: ["Measure.", "Mix. Drink."],
          zh: ["量取，", "再调饮。"]
        },
        body: {
          en: "Measure 25 mL, then add approximately 150–200 mL of chilled or sparkling water. The marked cap keeps each serve simple and repeatable.",
          zh: "每次量取 25 mL，兑入约 150–200 mL 冰水或气泡水。量杯刻度让每次调饮更简单，也更容易重复。"
        }
      },
      duo: {
        title: { en: "One box, two experiences.", zh: "一盒，两种体验。" },
        body: {
          en: "PEEL and PULP come from the same reference harvest, while keeping their own product logic. Made for personal use, and clear enough to give as a complete gift.",
          zh: "PEEL 与 PULP 来自同一次采收，但各自保留完整的产品逻辑。适合自己使用，也适合作为一套完整的礼物。"
        }
      },
      about: {
        eyebrow: { en: "About", zh: "关于" },
        titleLines: {
          en: ["We start with the source,", "then decide what the product should become."],
          zh: ["我们从原料开始，", "再决定产品应该成为什么。"]
        },
        bodyLines: {
          en: [
            "IMMANENT / 蕴 looks at what a material can already offer.",
            "For this first concept, pomelo peel becomes scent and pomelo pulp becomes flavour.",
            "The products are connected by source, while each keeps its own clear use."
          ],
          zh: [
            "IMMANENT / 蕴关注一种原料本身已经拥有的可能。",
            "在这个概念中，柚子果皮进入气味，果肉进入风味。",
            "两款产品由来源相连，但使用方式各自清楚。"
          ]
        }
      },
      footerNote: {
        en: "Independent fictional brand concept · 2026. Products, prices, formulas and purchase flows are shown for concept presentation only and are not offered for sale.",
        zh: "独立虚构品牌概念 · 2026。页面中的产品、价格、配方与购买流程仅用于概念展示，不构成实际销售。"
      }
    },
    accordion: [
      { key: "details", label: { en: "Details", zh: "细节" } },
      { key: "profile", label: { en: "Profile", zh: "风味 / 香气" } },
      { key: "howToUse", label: { en: "How to use", zh: "使用方式" } },
      { key: "origin", label: { en: "Origin", zh: "来源" } },
      { key: "formulaNote", label: { en: "Ingredient / formula note", zh: "成分 / 配方说明" } },
      { key: "delivery", label: { en: "Delivery & returns", zh: "配送与退换" } }
    ]
  };
})();
