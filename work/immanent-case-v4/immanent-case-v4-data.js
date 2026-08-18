(function () {
  const assetBase = "/images/immanent-v4/";

  const assets = {
    heroDuo: {
      src: assetBase + "IMMANENT_14_DUO_pair_styled_pomelo.png",
      ratio: "1086:1448",
      type: "photography",
      fit: "cover",
      focal: "50% 48%",
      alt: { en: "PEEL 01 and PULP 01 styled with pomelo.", zh: "PEEL 01 与 PULP 01 以柚子素材共同呈现。" }
    },
    sourceStill: {
      src: assetBase + "04_Duo_luxury_mood_source_still_life.png",
      ratio: "1448:1086",
      type: "photography",
      fit: "cover",
      focal: "48% 50%",
      alt: { en: "Pomelo source still life with PEEL 01 and PULP 01.", zh: "以柚子来源为核心的 PEEL 01 与 PULP 01 静物图。" }
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
    peelCapDetail: {
      src: assetBase + "IMMANENT_04_PEEL_cap_detail.png",
      ratio: "1086:1448",
      type: "photography",
      fit: "cover",
      focal: "50% 42%",
      alt: { en: "PEEL 01 cap and material detail.", zh: "PEEL 01 盖体与材料细节。" }
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
      alt: { en: "PEEL 01 angled product view.", zh: "PEEL 01 斜角产品视图。" }
    },
    peelExploded: {
      src: assetBase + "01_PEEL_exploded_view_final.png",
      ratio: "1254:1254",
      type: "diagram",
      fit: "contain",
      focal: "50% 50%",
      alt: { en: "PEEL 01 concept architecture diagram.", zh: "PEEL 01 概念结构方案图。" }
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
      alt: { en: "PULP 01 open bottle state.", zh: "PULP 01 打开状态。" }
    },
    pulpRitual: {
      src: assetBase + "02_PULP_ritual_measured_pour_hero.png",
      ratio: "1448:1086",
      type: "photography",
      fit: "cover",
      focal: "54% 50%",
      alt: { en: "PULP 01 measured pouring ritual.", zh: "PULP 01 计量倒取仪式。" }
    },
    pulpPour: {
      src: assetBase + "IMMANENT_06_PULP_usage_pouring.png",
      ratio: "1086:1448",
      type: "photography",
      fit: "cover",
      focal: "50% 50%",
      alt: { en: "PULP 01 serving pour.", zh: "PULP 01 调饮倒取。" }
    },
    pulpStill: {
      src: assetBase + "IMMANENT_12_PULP_still_life_pomelo.png",
      ratio: "1086:1448",
      type: "photography",
      fit: "cover",
      focal: "50% 45%",
      alt: { en: "PULP 01 still life with pomelo.", zh: "PULP 01 与柚子静物图。" }
    },
    duoClean: {
      src: assetBase + "IMMANENT_10_DUO_pair_front_clean.png",
      ratio: "1086:1448",
      type: "packshot",
      fit: "contain",
      focal: "50% 50%",
      alt: { en: "Clean PEEL 01 and PULP 01 duo packshot.", zh: "PEEL 01 与 PULP 01 组合产品图。" }
    },
    giftBox: {
      src: assetBase + "IMMANENT_13_PACKAGING_gift_box.png",
      ratio: "1086:1448",
      type: "photography",
      fit: "cover",
      focal: "50% 50%",
      alt: { en: "IMMANENT gift box and product pair.", zh: "IMMANENT 礼盒与产品套组。" }
    },
    retail: {
      src: assetBase + "05_Retail_counter_display_refined_scene.png",
      ratio: "1448:1086",
      type: "photography",
      fit: "cover",
      focal: "50% 54%",
      alt: { en: "Refined retail counter scene for IMMANENT.", zh: "IMMANENT 精修零售台面场景。" }
    },
    moodDuo: {
      src: assetBase + "IMMANENT_16_DUO_pair_styled_luxe.png",
      ratio: "1122:1402",
      type: "photography",
      fit: "cover",
      focal: "50% 52%",
      alt: { en: "Styled PEEL and PULP atmosphere image.", zh: "PEEL 与 PULP 氛围图。" }
    }
  };

  window.IMMANENT_CASE_V4_DATA = {
    settings: {
      debugAssets: false,
      defaultLanguage: "en",
      brandSiteUrl: "/work/immanent-brand-v4/"
    },
    identity: {
      brand: "IMMANENT",
      chinese: "蕴"
    },
    ui: {
      skip: { en: "Skip to content", zh: "跳至正文" },
      menu: { en: "Menu", zh: "菜单" },
      close: { en: "Close", zh: "关闭" },
      viewBrandSite: { en: "View brand site ↗", zh: "查看消费者官网 ↗" },
      view: { en: "View", zh: "查看" },
      viewSources: { en: "View sources", zh: "查看来源" },
      sourceDrawerTitle: { en: "Research sources", zh: "资料来源" },
      appendixOpen: { en: "Open research notes", zh: "展开补充研究" }
    },
    nav: [
      { id: "overview", label: { en: "OVERVIEW", zh: "概览" } },
      { id: "research", label: { en: "RESEARCH", zh: "研究" } },
      { id: "strategy", label: { en: "STRATEGY", zh: "策略" } },
      { id: "product", label: { en: "PRODUCT", zh: "产品" } },
      { id: "identity", label: { en: "IDENTITY", zh: "品牌识别" } },
      { id: "experience", label: { en: "EXPERIENCE", zh: "体验" } }
    ],
    assets,
    chapters: [
    { number: "00", id: "overview", title: { en: "Overview", zh: "概览" }, descriptor: { en: "Case-study entry points.", zh: "案例入口与范围。" } },
      { number: "01", id: "research", title: { en: "Research", zh: "研究" }, descriptor: { en: "What the category showed, and how it shaped design.", zh: "市场说明了什么，以及它如何影响设计。" } },
      { number: "02", id: "opportunity", title: { en: "Opportunity", zh: "机会" }, descriptor: { en: "Why the two products should belong together.", zh: "为什么两款产品应该在一起。" } },
      { number: "03", id: "audience", title: { en: "Audience", zh: "受众" }, descriptor: { en: "Who might buy it, use it and gift it.", zh: "谁会购买、使用和赠送。" } },
      { number: "04", id: "brand-idea", title: { en: "Brand Strategy", zh: "品牌策略" }, descriptor: { en: "Name, idea and guiding principles.", zh: "命名、想法和核心原则。" } },
      { number: "05", id: "product", title: { en: "Product System", zh: "产品体系" }, descriptor: { en: "PEEL, PULP and a material study.", zh: "PEEL、PULP 与材料研究。" } },
      { number: "06", id: "source-process", title: { en: "Source & Process", zh: "原料与制作" }, descriptor: { en: "Why pomelo, and how each route develops.", zh: "为什么是柚子，以及两条路径如何展开。" } },
      { number: "07", id: "design-decisions", title: { en: "Product & Packaging", zh: "产品与包装" }, descriptor: { en: "Object, use action and packaging choices.", zh: "物件、使用动作和包装选择。" } },
      { number: "08", id: "use-experience", title: { en: "Use Experience", zh: "使用体验" }, descriptor: { en: "Roll on, measure, mix and gift.", zh: "滚涂、量取、调饮和礼赠。" } },
      { number: "09", id: "identity", title: { en: "Visual Identity", zh: "品牌识别" }, descriptor: { en: "Wordmark, material cues and information order.", zh: "字标、材质线索和信息排布。" } },
      { number: "10", id: "experience", title: { en: "Digital / Retail / Campaign", zh: "数字 / 零售 / 传播" }, descriptor: { en: "How the brand is seen, browsed and bought.", zh: "品牌如何被看见、浏览和购买。" } },
      { number: "11", id: "completion", title: { en: "Completed / Next", zh: "完成 / 下一步" }, descriptor: { en: "What is ready, and what needs real-world testing.", zh: "哪些已完成，哪些需要真实验证。" } },
      { number: "12", id: "appendix", title: { en: "Research notes", zh: "补充研究" }, descriptor: { en: "Supporting notes outside the main story.", zh: "主线之外的补充资料。" } }
    ],
    overview: {
      id: "overview",
      eyebrow: { en: "Self-Initiated Brand Concept · 2026", zh: "自主品牌概念 · 2026" },
      title: { en: "IMMANENT / 蕴", zh: "IMMANENT / 蕴" },
      headlineLines: {
        en: ["One pomelo.", "Two product paths."],
        zh: ["从一枚柚子开始，", "建立两条完整的产品路径。"]
      },
      bodyLines: {
        en: [
          "Peel becomes a close-to-skin perfume oil. Pulp becomes a low-sweetness drink concentrate.",
          "This case study shows how the idea was shaped through research, positioning, product architecture, packaging and digital experience."
        ],
        zh: [
          "果皮成为贴肤香氛油，果肉成为低甜度饮用浓缩液。",
          "这个案例记录我如何从研究、定位、产品架构、包装到数字体验，把一个想法做成一套完整的品牌方案。"
        ]
      },
      scope: {
        en: ["Strategy", "Brand identity", "Product concept", "Digital experience"],
        zh: ["策略", "品牌识别", "产品概念", "数字体验"]
      }
    },
    research: {
      id: "research",
      number: "01",
      eyebrow: { en: "Research", zh: "研究" },
      titleLines: {
        en: ["Understand the market", "before deciding what to make."],
        zh: ["先看清市场，", "再决定怎么做。"]
      },
      intro: {
        en: "I used the research to make design decisions, not to decorate the page with claims. The work focused on three things: how comparable products are sold, when people would use them, and which formats already feel believable.",
        zh: "研究不是为了堆结论，而是为了帮助我做设计判断。我主要看三件事：类似产品怎么卖、用户会在什么时候使用，以及哪些规格和动作已经足够可信。"
      },
      blocks: [
        {
          title: { en: "What I saw", zh: "我看到什么" },
          body: {
            en: "Niche fragrance, botanical non-alcoholic drinks and design-led gifting already have clear buying occasions.",
            zh: "小众香氛、植物型无酒精饮品和设计型礼物，都已经有清楚的购买场景。"
          }
        },
        {
          title: { en: "What it means", zh: "这意味着什么" },
          body: {
            en: "The opportunity was not to make a novelty pairing. The products had to be useful on their own, then connected by a reason people could understand quickly.",
            zh: "机会不在于做一个新奇组合。两款产品必须先各自好用，再用一个能被快速理解的理由连接起来。"
          }
        },
        {
          title: { en: "How I designed", zh: "因此怎么设计" },
          body: {
            en: "I kept the range small: PEEL for close-to-skin scent, PULP for a measured drink. The shared source explains the family without forcing the formulas together.",
            zh: "我把产品线保持得很小：PEEL 负责贴肤香气，PULP 负责定量调饮。共同来源解释它们的关系，但不强行合并配方。"
          }
        }
      ],
      referenceColumns: [
        { key: "source", label: { en: "Reference", zh: "参考" } },
        { key: "fact", label: { en: "What it confirms", zh: "说明了什么" } },
        { key: "decision", label: { en: "Design decision", zh: "对应设计判断" } }
      ],
      referenceRows: [
        {
          source: { en: "Maison Louis Marie official", zh: "Maison Louis Marie 官方资料" },
          fact: { en: "15 mL perfume oil / roll-on format and pulse-point use exist as a real consumer format.", zh: "15 mL 滚珠香氛油和脉搏点涂抹，是已有真实消费规格和使用方式。" },
          decision: { en: "PEEL can be small, portable and close to skin without feeling arbitrary.", zh: "PEEL 的体量和贴肤使用方式有现实参照，不是随意设定。" }
        },
        {
          source: { en: "Botivo official", zh: "Botivo 官方资料" },
          fact: { en: "A signature serve uses 25 mL concentrate with 175 mL soda.", zh: "其推荐饮用方式包含 25 mL 浓缩液与 175 mL 气泡水。" },
          decision: { en: "PULP keeps 25 mL as the measured action and uses a cap to make that action visible.", zh: "PULP 保留 25 mL 作为核心动作，量杯盖服务于清楚的单次用量。" }
        },
        {
          source: { en: "GOV.UK, Fujian Provincial Government, Kew POWO", zh: "GOV.UK、福建省政府、Kew POWO" },
          fact: { en: "Guanxi Mi You is tied to Pinghe; Citrus maxima is the accepted botanical name.", zh: "琯溪蜜柚与福建平和有真实产地关系；Citrus maxima 可作为接受学名。" },
          decision: { en: "Pinghe works as a sourcing direction because it is tied to the fruit, not because it adds a decorative origin story.", zh: "选择平和是因为它与琯溪蜜柚本身有关，而不是为了硬加地域故事。" }
        },
        {
          source: { en: "Citrus maxima peel essential-oil studies", zh: "Citrus maxima 果皮精油提取研究" },
          fact: { en: "Pomelo peel contains volatile aromatic material; extraction routes include hydrodistillation, steam extraction and cold-press comparisons.", zh: "柚子外层果皮含有挥发性芳香物质，研究中出现水蒸馏、蒸汽提取和冷压对比等方法。" },
          decision: { en: "PEEL can use peel aroma as a direction, while final extraction, formula and stability remain specialist work.", zh: "PEEL 可以把果皮芳香作为方向，但最终提取方式、香精配比和稳定性需要专业方确认。" }
        },
        {
          source: { en: "UK Government packaging responsibility guidance", zh: "英国政府包装责任相关说明" },
          fact: { en: "Packaging material and weight affect later cost and compliance decisions.", zh: "包装材料和重量会影响后续成本与合规。" },
          decision: { en: "The concept avoids decorative secondary packaging that does not improve use or explanation.", zh: "当前概念避免无意义的二次包装堆叠。" }
        }
      ],
      sourceNames: [
        { en: "GOV.UK / Guanxi Mi You specification", zh: "GOV.UK / 琯溪蜜柚规范" },
        { en: "Fujian Provincial Government / Pinghe pomelo origin and red-fleshed pomelo background", zh: "福建省政府 / 平和蜜柚产地与红肉蜜柚资料" },
        { en: "Kew Plants of the World Online / Citrus maxima", zh: "Kew Plants of the World Online / Citrus maxima" },
        { en: "Maison Louis Marie official / Perfume Oil 15 mL", zh: "Maison Louis Marie 官方资料 / 15 mL 香氛油" },
        { en: "Botivo official / 25 mL serving ritual", zh: "Botivo 官方资料 / 25 mL 调饮方式" },
        { en: "UK Government / Extended Producer Responsibility for Packaging", zh: "英国政府 / 包装生产者责任说明" },
        { en: "Peer-reviewed Citrus maxima peel essential-oil extraction papers", zh: "同行评审论文 / Citrus maxima 果皮精油提取研究" }
      ]
    },
    strategy: {
      opportunity: {
        id: "opportunity",
        number: "02",
        eyebrow: { en: "Opportunity", zh: "机会" },
        titleLines: {
          en: ["The question is not pairing.", "It is why the products belong together."],
          zh: ["问题不是把两类产品凑在一起，", "而是它们为什么应该在一起。"]
        },
        body: {
          en: "Fragrance-and-drink concepts already exist, so I did not treat the category mix as the idea. I started with one pomelo instead: peel moves naturally toward scent, while pulp moves naturally toward taste. That made the connection simpler and more believable.",
          zh: "香氛和饮品的组合已经存在，所以我没有把“跨品类”当成核心概念。我从一枚柚子出发：果皮更自然地进入气味，果肉更自然地进入味觉。这样，两款产品的关系更简单，也更可信。"
        }
      },
      audience: {
        id: "audience",
        number: "03",
        eyebrow: { en: "Audience & Scenes", zh: "受众与场景" },
        titleLines: {
          en: ["Who would buy it?", "When would they use it?"],
          zh: ["谁会买？", "什么时候会用？"]
        },
        groups: [
          {
            title: { en: "Target audience hypothesis", zh: "目标受众假设" },
            body: {
              en: "People who already buy niche fragrance, considered drinks and design-led objects. They care whether a product is useful, well made and easy to understand.",
              zh: "已经购买小众香氛、精致饮品和设计型生活用品的人。他们在意产品是否好用、是否做得认真，也希望能快速理解它为什么存在。"
            }
          },
          {
            title: { en: "Gifting audience", zh: "礼赠受众" },
            body: {
              en: "People looking for a gift that feels complete, clear and less expected. The set should explain itself without a long concept note.",
              zh: "想送一份完整、好理解，也适合送人的礼物的人。礼盒本身应该能说明关系，而不是依赖一大段概念文字。"
            }
          }
        ],
        scenes: [
          { en: "PEEL / portable, close-to-skin scent", zh: "PEEL / 随身、贴肤、低扩散的香气" },
          { en: "PULP / low-sweetness serve at home or with others", zh: "PULP / 家中或社交场景中的低甜度调饮" },
          { en: "Gift set / one ingredient origin, two products", zh: "礼盒 / 同一原料来源，两款产品" }
        ]
      },
      positioning: {
        id: "positioning",
        number: "04",
        eyebrow: { en: "Positioning", zh: "定位" },
        titleLines: {
          en: ["One source.", "Two independent formulas."],
          zh: ["同一来源，", "两套独立配方。"]
        },
        body: {
          en: "IMMANENT does not make fragrance and drink behave like the same product. The brand explains the shared source; each product keeps its own use, formula direction and category logic.",
          zh: "IMMANENT 不把香氛和饮品做成同一种东西。品牌负责说清楚共同来源；每款产品保留自己的使用方式、配方方向和品类逻辑。"
        },
        statement: {
          en: "One traceable pomelo idea becomes two useful product paths: PEEL for close-to-skin scent, PULP for a measured low-sweetness drink.",
          zh: "一个可说明的柚子来源，发展成两条清楚的产品路径：PEEL 负责贴肤香气，PULP 负责低甜度定量调饮。"
        }
      },
      brandIdea: {
        id: "brand-idea",
        number: "05",
        eyebrow: { en: "Brand Idea", zh: "品牌想法" },
        titleLines: {
          en: ["One pomelo,", "developed into two products."],
          zh: ["一枚柚子，", "发展成两种产品。"]
        },
        body: {
          en: "The brand begins with what the fruit already offers. Peel carries aroma; pulp carries flavour. The design work was to turn that simple split into a product system people could understand and want to use.",
          zh: "品牌从柚子本身已经拥有的差异开始。果皮有芳香，果肉有风味。我的设计工作，是把这个简单的分流做成一套清楚、可使用、也有吸引力的产品系统。"
        },
        naming: {
          title: { en: "Why IMMANENT / 蕴?", zh: "为什么叫 IMMANENT / 蕴？" },
          body: {
            en: "IMMANENT means something already present within. 蕴 carries the same idea of what is held inside and slowly drawn out. The name keeps the brand close to the source instead of adding a separate myth.",
            zh: "IMMANENT 指向“原本就在其中”的东西；“蕴”也有内在、积蓄、等待被引出的意思。这个名字让品牌回到原料本身，而不是再造一个与产品无关的故事。"
          }
        }
      }
    },
    product: {
      system: {
        id: "product",
        number: "05",
        eyebrow: { en: "Product System", zh: "产品体系" },
        titleLines: {
          en: ["Two products,", "two different jobs."],
          zh: ["两款产品，", "各做各的事。"]
        },
        intro: {
          en: "The range stays small on purpose. PEEL and PULP are the two core products. FIBRE is kept as a material implementation study for future packaging, not a third launch product.",
          zh: "产品线有意保持精简。PEEL 和 PULP 是两款核心产品。FIBRE 只保留为未来包装材料的落地研究，不作为第三款上市产品。"
        },
        items: [
          {
            code: "PEEL 01",
            role: { en: "Botanical Perfume Oil", zh: "植物香氛油" },
            size: "15 mL",
            price: "£65",
            body: {
              en: "A portable perfume oil built around the bitter-green aroma of pomelo peel.",
              zh: "一款围绕柚子果皮清苦芳香展开的随身香氛油。"
            },
            notes: { en: ["Pomelo peel", "Green petitgrain", "Pale woods"], zh: ["柚子果皮", "青绿叶枝感", "浅色干燥木质"] },
            image: "peelMain"
          },
          {
            code: "PULP 01",
            role: { en: "Botanical Drink Concentrate", zh: "植物饮用浓缩液" },
            size: "250 mL",
            price: "£30",
            body: {
              en: "A low-sweetness pomelo drink concentrate brightened with yuzu, lemongrass and ginger.",
              zh: "一款低甜度柚子饮用浓缩液，以柚子为主体，并加入柑橘、香茅与姜的清亮层次。"
            },
            notes: { en: ["25 mL per serve", "Approx. 10 serves", "150–200 mL cold water"], zh: ["每次 25 mL", "约 10 次调饮", "兑入 150–200 mL 冷水或气泡水"] },
            image: "pulpMain"
          },
          {
            code: "FIBRE 01",
            role: { en: "Material note", zh: "材料研究说明" },
            size: { en: "Future packaging study", zh: "未来包装材料方向" },
            price: { en: "No retail price", zh: "不设零售价格" },
            body: {
              en: "A pith-related packaging idea kept as a future study because it needs physical samples and supplier testing.",
              zh: "与白瓤相关的包装材料想法被保留为未来研究，因为它需要实物打样与供应方测试。"
            },
            notes: { en: ["Packaging direction", "Needs samples", "Not in the first range"], zh: ["包装方向", "需要打样", "不进入首发产品线"] },
            image: "sourceStill"
          }
        ],
        pricingNote: {
          en: "Prices are concept retail targets and can change after costing.",
          zh: "价格为概念零售目标，后续需根据成本核算调整。"
        }
      },
      sourceProcess: {
        id: "source-process",
        number: "06",
        eyebrow: { en: "Source & Process", zh: "原料与工艺方向" },
        titleLines: {
          en: ["Why pomelo?"],
          zh: ["为什么是柚子？"]
        },
        body: {
          en: "Pomelo gives the project a practical split. Peel has an aromatic direction, pulp has a flavour direction, and pith can be studied as a material. The source is used to explain the products, not to make exaggerated claims.",
          zh: "柚子本身就适合被清楚拆分：果皮可以进入芳香方向，果肉可以进入风味方向，白瓤可以作为材料研究。我们从原料来源开始讲，而不是先讲功效。"
        },
        note: {
          en: "Pinghe red-fleshed Guanxi Honey Pomelo is used as the reference origin and cultivar direction. A commercial supplier and traceable production lot would still need to be established.",
          zh: "平和红肉琯溪蜜柚是当前概念的参考产地与品种方向。真实商业供应商和可追溯生产批次仍需后续建立。"
        },
        split: [
          { material: { en: "PEEL", zh: "果皮" }, path: { en: "AROMATIC PATH", zh: "芳香路径" }, product: "PEEL 01" },
          { material: { en: "PULP", zh: "果肉" }, path: { en: "DRINK PATH", zh: "饮用路径" }, product: "PULP 01" },
          { material: { en: "PITH", zh: "白瓤" }, path: { en: "MATERIAL STUDY", zh: "材料研究" }, product: "FIBRE 01" }
        ],
        routes: [
          {
            title: "PEEL",
            steps: {
              en: ["clean and separate peel", "aroma extraction route", "fragrance formulation", "fill", "roller application"],
              zh: ["清洁与分离果皮", "芳香物质提取方向", "香氛配方", "灌装", "滚珠贴肤使用"]
            }
          },
          {
            title: "PULP",
            steps: {
              en: ["fruit preparation", "flavour formulation", "filtration / stability route", "measured fill", "dilute to serve"],
              zh: ["果肉处理", "风味配方", "过滤与稳定性方向", "定量灌装", "兑水饮用"]
            }
          }
        ],
        routeNote: {
          en: "These are concept process routes. Final methods need to be confirmed by food, fragrance and production specialists.",
          zh: "以上为概念工艺路径，最终方法需由食品 / 香氛配方与生产专业方确认。"
        }
      },
      decisions: {
        id: "design-decisions",
        number: "07",
        eyebrow: { en: "Product & Packaging Design", zh: "产品与包装设计" },
        titleLines: {
          en: ["PEEL rolls on.", "PULP measures out."],
          zh: ["PEEL 贴肤使用，", "PULP 定量调饮。"]
        },
        items: [
          {
            number: "01",
            title: { en: "Why not one bottle shape?", zh: "为什么不用同一种瓶型？" },
            body: { en: "Fragrance and drink need different volume, grip and category recognition.", zh: "因为香氛与饮品需要不同的容量、握持和品类识别。" },
            image: "duoClean"
          },
          {
            number: "02",
            title: { en: "Why is PEEL a slim object?", zh: "为什么 PEEL 做成长条随身物件？" },
            body: { en: "The 15 mL size needs to sit securely in the hand, while the roller, window and sleeve create a tactile product character.", zh: "为了让 15 mL 的体量在手中更稳定，也让滚珠、开窗和外壳成为可感知的产品特征。" },
            image: "peelTactile"
          },
          {
            number: "03",
            title: { en: "Why is the PULP cap a measure?", zh: "为什么 PULP 的瓶盖是量杯？" },
            body: { en: "Because 25 mL is the main use action; the packaging should help the user measure instead of adding another tool.", zh: "因为 25 mL 是核心使用动作，包装本身应该帮助消费者完成量取，而不是额外提供一个工具。" },
            image: "pulpCap"
          },
          {
            number: "04",
            title: { en: "Why do they still feel related?", zh: "为什么两款产品仍然像一个品牌？" },
            body: { en: "Ivory, brass, olive and pomelo-blush material cues, shared information order and the same ingredient origin hold the system together.", zh: "共同的象牙白、黄铜、橄榄玻璃色和柚肉柔粉材质关系，加上相同的信息秩序和同一来源，让两款产品仍然像一个品牌；产品轮廓则保持不同。" },
            image: "sourceStill"
          },
          {
            number: "05",
            title: { en: "Why a gift set?", zh: "为什么有礼盒？" },
            body: { en: "The set does not claim the products must be used together. It gives a clearer gifting scene for understanding one origin and two products.", zh: "它不是为了证明两款产品必须一起使用，而是提供一个更容易理解“同一来源，两种产品”的礼赠场景。" },
            image: "giftBox"
          }
        ]
      },
      useExperience: {
        id: "use-experience",
        number: "08",
        eyebrow: { en: "Use Experience", zh: "使用体验" },
        titleLines: {
          en: ["Clear actions", "make the system easy to read."],
          zh: ["用清楚的动作，", "让产品关系被理解。"]
        },
        items: [
          { title: "PEEL 01", body: { en: "Roll lightly onto wrists or neck. The scale stays intimate and controlled.", zh: "轻滚于手腕或颈侧，让香气保持贴近和克制。" }, image: "peelOpen" },
          { title: "PULP 01", body: { en: "Measure 25 mL, add 150–200 mL chilled still or sparkling water, and serve cold.", zh: "量取 25 mL，兑入 150–200 mL 冰水或气泡水，冷饮呈上。" }, image: "pulpRitual" },
          { title: { en: "HARVEST 01 DUO", zh: "来源 01 礼盒" }, body: { en: "The gift set makes the shared ingredient origin easy to see without merging the two rituals.", zh: "礼盒让共同原料来源更容易被理解，同时保留两种独立使用方式。" }, image: "giftBox" }
        ]
      }
    },
    identitySystem: {
      id: "identity",
      number: "09",
      eyebrow: { en: "Visual Identity", zh: "视觉识别" },
      titleLines: {
        en: ["Make the brand recognisable", "before showing the system."],
        zh: ["先让人认出品牌，", "再看见系统。"]
      },
      intro: {
        en: "The identity starts with the IMMANENT / 蕴 wordmark. Product names, material cues and information order then make PEEL, PULP and the gift set feel related without adding extra decoration.",
        zh: "先把 IMMANENT / 蕴 的字标体系做稳，再用产品命名、材质线索和信息排布，让 PEEL、PULP 与礼盒看起来属于同一品牌。没有作用的装饰图形不再出现。"
      },
      left: {
        title: "IMMANENT / 蕴",
        caption: { en: "Master lockup and packaging detail.", zh: "主锁定与包装细节。" },
        image: "peelCapDetail"
      },
      right: [
        { label: { en: "Wordmark", zh: "英文字标" }, value: "IMMANENT" },
        { label: { en: "Chinese name", zh: "中文名" }, value: "蕴" },
        { label: { en: "Product marking hierarchy", zh: "产品标记层级" }, value: { en: "PEEL 01 / PULP 01 / HARVEST 01", zh: "PEEL 01 / PULP 01 / 来源 01 礼盒" } },
        { label: { en: "Type system", zh: "字体系统" }, value: { en: "Newsreader + Inter / Noto Serif SC + Noto Sans SC", zh: "Noto Serif SC + Noto Sans SC / Newsreader + Inter" } }
      ],
      paletteNote: {
        en: "Digital palette derived from the current locked visual system.",
        zh: "当前数字界面色板，来自已锁定的视觉系统。"
      },
      palette: [
        { en: "Warm Ivory", zh: "暖象牙白", hex: "#F2E7D7" },
        { en: "Ink", zh: "墨色", hex: "#1C1E1A" },
        { en: "Brass", zh: "黄铜", hex: "#B99761" },
        { en: "Olive Glass", zh: "橄榄玻璃色", hex: "#68643D" },
        { en: "Pomelo Blush", zh: "柚肉柔粉", hex: "#E8B7A5" }
      ]
    },
    experience: {
      id: "experience",
      number: "10",
      eyebrow: { en: "Digital / Retail / Campaign", zh: "数字官网 / 零售 / 传播" },
      titleLines: {
        en: ["From seeing it,", "to picking it up and gifting it."],
        zh: ["从看到、拿起，", "到购买和送礼。"]
      },
      body: {
        en: "The consumer site moves quickly from source to product, then to process, gift set and bag. Retail and campaign imagery keep the product visible instead of showing internal research language.",
        zh: "消费者官网从来源快速进入产品，再进入制作、礼盒和购物袋。零售与传播画面以产品和材质为主，不展示内部研究术语。"
      },
      images: ["giftBox", "retail", "moodDuo", "sourceStill"],
      points: [
        { en: "Brand site with product detail pages", zh: "带产品详情页的品牌官网" },
        { en: "Bag flow with quantity, removal and subtotal", zh: "包含数量、移除和小计的购物袋流程" },
        { en: "Retail counter direction and campaign image rhythm", zh: "零售台面方向与传播图像节奏" }
      ]
    },
    completion: {
      id: "completion",
      number: "11",
      eyebrow: { en: "Completion & Next Steps", zh: "完成内容与下一步" },
      titleLines: {
        en: ["What is complete,", "and what needs testing next."],
        zh: ["哪些已经完成，", "哪些还要继续验证。"]
      },
      completed: [
        {
          number: "01",
          title: { en: "Research & positioning", zh: "研究与定位" },
          body: { en: "Category references, source research, audience hypothesis and the core opportunity.", zh: "品类参考、来源研究、受众假设和核心机会判断。" }
        },
        {
          number: "02",
          title: { en: "Product & packaging", zh: "产品与包装" },
          body: { en: "PEEL and PULP product logic, use actions, vessel direction and gift set structure.", zh: "PEEL 和 PULP 的产品逻辑、使用动作、容器方向和礼盒结构。" }
        },
        {
          number: "03",
          title: { en: "Brand identity", zh: "品牌识别" },
          body: { en: "Naming, wordmark relationship, colour, typography and photography direction.", zh: "命名、字标关系、色彩、排版和摄影方向。" }
        },
        {
          number: "04",
          title: { en: "Digital & retail experience", zh: "数字与零售体验" },
          body: { en: "Consumer brand site, product detail pages, bag flow and retail image direction.", zh: "消费者官网、产品详情页、购物袋流程和零售图像方向。" }
        },
        {
          number: "05",
          title: { en: "Next step", zh: "下一步" },
          body: {
            en: "Next comes physical prototyping, formula and supply-chain validation, including stability, regulatory review, vessel ergonomics, packaging tests and production costing.",
            zh: "下一步是实物原型、配方与供应链验证，包括稳定性、食品与化妆品法规、容器人体工学、包装打样和量产成本。"
          }
        }
      ]
    },
    appendix: {
      id: "appendix",
      number: "12",
      title: { en: "Research notes", zh: "补充研究" },
      note: {
        en: "The main page keeps the decisions that shaped the design. Supporting references, directions I did not pursue and open questions stay here.",
        zh: "主页面保留真正影响设计的判断。更详细的资料、没有继续发展的方向和待验证事项放在这里。"
      },
      items: [
        { en: "Reference cases and public material", zh: "参考案例与公开资料" },
        { en: "Why I did not continue a simple fragrance × drink pairing", zh: "为什么没有继续做“香氛 × 饮品”的简单配对" },
        { en: "Price, cost and channel assumptions", zh: "价格、成本与渠道假设" },
        { en: "Formula, safety, regulation and supply-chain questions", zh: "配方、安全、法规与供应链待验证事项" }
      ]
    }
  };
})();
