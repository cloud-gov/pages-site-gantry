type Card = {
  image?: {
    altText: string;
    url: string;
  };
  title: string;
  description: string;
  orientation?: "vertical" | "horizontal" | "horizontal-right";
};

export const cardGridBlock = ({ node }: { node: any }): string => {
  const fields = node?.fields ?? node;
  const cards: Card[] = Array.isArray(fields?.cards) ? fields.cards : [];
  const numberOfColumns = parseInt(fields?.numberOfColumns ?? "3", 10);

  if (!cards.length || numberOfColumns < 1) return "";

  // split cards into rows based on numberOfColumns
  const rows: Card[][] = [];
  for (let i = 0; i < cards.length; i += numberOfColumns) {
    rows.push(cards.slice(i, i + numberOfColumns));
  }

  // generate html
  const gridHTML = rows
    .map((row) => {
      const rowHTML = row
        .map((card) => {
          const imgHTML = card.image
            ? `
          <div class="usa-card__media">
            <div class="usa-card__img">
              <img
                src="${card.image.url}"
                alt="${card.image.altText}"
              />
            </div>
          </div>
        `
            : "";
          return `
        <div class="
          tablet:grid-col usa-card
          ${card.orientation === "horizontal" ? "usa-card--flag flex-1" : ""}
          ${card.orientation === "horizontal-right" ? "usa-card--flag flex-1 usa-card--media-right" : ""}
          ">
          <div class="usa-card__container">
            <div class="usa-card__header">
              <h4 class="usa-card__heading">${card.title}</h4>
            </div>
            ${imgHTML}
            <div class="usa-card__body">
              <p class="usa-card__description">${card.description}</p>
            </div>
          </div>
        </div>
      `;
        })
        .join("");

      // add empty divs if row is short to maintain card width consistency
      const emptyCols = numberOfColumns - row.length;
      const paddingHTML =
        emptyCols > 0
          ? Array(emptyCols)
              .fill('<div class="tablet:grid-col"></div>')
              .join("")
          : "";

      return `
      <div class="grid-row usa-card-group">${rowHTML}${paddingHTML}</div>
    `;
    })
    .join("");

  return gridHTML;
};
