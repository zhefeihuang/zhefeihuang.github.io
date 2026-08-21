(function () {
  const data = window.IMMANENT_CASE_V4_DATA;
  if (!data) return;

  const replacements = new Map([
    [
      "想送一份完整、好理解，也适合送人的礼物的人。礼盒本身应该能说明关系，而不是依赖一大段概念文字。",
      "想送一份完整、好懂、拿得出手的礼物。礼盒本身要能把两款产品的关系讲清楚，不需要再读一大段概念说明。"
    ],
    [
      "IMMANENT 不把香氛和饮品做成同一种东西。品牌负责说清楚共同来源；每款产品保留自己的使用方式、配方方向和品类逻辑。",
      "IMMANENT 不把香氛和饮品混成同一种体验。它只说明两款产品来自同一份来源；至于用法、配方方向和品类逻辑，各自保持清楚。"
    ],
    [
      "品牌从柚子本身已经拥有的差异开始。果皮有芳香，果肉有风味。我的设计工作，是把这个简单的分流做成一套清楚、可使用、也有吸引力的产品系统。",
      "这个品牌从柚子本身的差异开始：果皮有香气，果肉有风味。我做的是把这个自然分流整理成一套清楚、可用、也有吸引力的产品系统。"
    ],
    [
      "柚子本身就适合被清楚拆分：果皮可以进入芳香方向，果肉可以进入风味方向，白瓤可以作为材料研究。我们从原料来源开始讲，而不是先讲功效。",
      "柚子本身就有清楚的分工：果皮适合进入香气，果肉适合进入风味，白瓤可以继续作为材料研究。这个项目从原料关系出发，而不是先用功效包装自己。"
    ],
    [
      "它不是为了证明两款产品必须一起使用，而是提供一个更容易理解“同一来源，两种产品”的礼赠场景。",
      "礼盒不是要证明两款产品必须一起使用，而是给送礼的人一个更清楚的理解方式：同一份来源，可以有两种体验。"
    ],
    [
      "先把 IMMANENT / 蕴 的字标体系做稳，再用产品命名、材质线索和信息排布，让 PEEL、PULP 与礼盒看起来属于同一品牌。没有作用的装饰图形不再出现。",
      "先把 IMMANENT / 蕴 的字标体系做稳，再通过产品命名、材质线索和信息秩序，让 PEEL、PULP 与礼盒看起来属于同一品牌。不使用只为了装饰而存在的图形。"
    ]
  ]);

  function polishString(input) {
    let output = input;
    replacements.forEach((to, from) => {
      output = output.split(from).join(to);
    });
    return output;
  }

  function walk(node) {
    if (!node) return node;
    if (typeof node === "string") return polishString(node);
    if (Array.isArray(node)) {
      node.forEach((item, index) => {
        node[index] = walk(item);
      });
      return node;
    }
    if (typeof node === "object") {
      Object.keys(node).forEach((key) => {
        node[key] = walk(node[key]);
      });
    }
    return node;
  }

  walk(data);

  if (data.strategy?.positioning?.statement) {
    data.strategy.positioning.statement.zh = "";
  }

  if (data.strategy?.brandIdea?.naming?.body) {
    data.strategy.brandIdea.naming.body.zh = "IMMANENT 指向“原本就在其中”的东西；“蕴”也有内在、积蓄、等待被引出的意思。";
  }

  const style = document.createElement("style");
  style.textContent = ".positioning-panel blockquote:empty{display:none!important;}";
  document.head.appendChild(style);

  if (data.product?.useExperience?.titleLines?.zh) {
    data.product.useExperience.titleLines.zh = ["清晰的展示，", "简单的操作。"];
  }

  if (data.identitySystem?.titleLines?.zh) {
    data.identitySystem.titleLines.zh = ["先记住品牌，", "再看见系统。"];
  }
})();
