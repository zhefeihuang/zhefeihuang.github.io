(() => {
  const zhCopy = {
    homeLine: "作品围绕图像、空间与数字媒介展开。",
    homeNote: "点击移动作品，进入项目。",
    aboutOne: "我的创作常从一个细节开始：一件物品、一种质感、一处空间，或一种反复出现的行为。",
    aboutMA: "研究生就读于伦敦大学金史密斯学院，方向为数字媒体与图像制作。",
    aboutBA: "本科毕业于上海视觉艺术学院视觉传达设计专业，研究品牌识别与公共空间。"
  };

  const roomCopy = {
    "Generative Healing": {
      question: "平静可以被系统设计吗？",
      made: "我搭建了一处海边的 VR 空间。观众先选择，系统再记住这些选择，并开始替他们决定接下来会看见什么。"
    },
    Oxidation: {
      question: "私人物品如何保存记忆？"
    },
    "Mossy Territory": {
      question: "空间缓慢生长时，会留下什么？"
    },
    "Archetypes: Cherries": {
      question: "标准怎样改变选择？"
    },
    "Trending Disasters": {
      question: "灾难为何变成消费内容？"
    }
  };

  function isChinese() {
    return document.documentElement.lang === "zh-CN";
  }

  function setText(selector, text) {
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = text;
    });
  }

  function patchStaticCopy() {
    if (!isChinese()) return;
    Object.entries(zhCopy).forEach(([key, value]) => {
      setText(`[data-i18n="${key}"]`, value);
    });
  }

  function patchRoomCopy() {
    if (!isChinese()) return;
    const title = document.querySelector("#room-title")?.textContent.trim();
    const copy = title ? roomCopy[title] : null;
    if (!copy) return;

    const blocks = Array.from(document.querySelectorAll(".story-block"));
    const question = blocks.find((block) => block.textContent.includes("01 /"));
    const made = blocks.find((block) => block.textContent.includes("03 /"));

    if (copy.question) {
      const heading = question?.querySelector("h3");
      if (heading) heading.textContent = copy.question;
    }

    if (copy.made) {
      const paragraph = made?.querySelector("p");
      if (paragraph) paragraph.textContent = copy.made;
    }
  }

  function patchAll() {
    patchStaticCopy();
    patchRoomCopy();
  }

  document.addEventListener("DOMContentLoaded", () => {
    patchAll();
    document.addEventListener("click", () => window.setTimeout(patchAll, 80), true);

    const observer = new MutationObserver(patchAll);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    const room = document.querySelector("#room-view");
    if (room) observer.observe(room, { childList: true, subtree: true });
  });
})();
