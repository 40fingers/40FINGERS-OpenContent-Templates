/**
 * Generates a Table of Contents (TOC) based on headings in the document.
 * @param {string} selector - CSS selector for headings to include in the TOC.
 * @param {string} excludeChildrenSelector - CSS selector for containers whose children should be excluded.
 * @param {string} excludeItemSelector - CSS selector for individual headings to exclude.
 * @param {string} tocContainerSelector - CSS selector for TOC container(s).
 * @param {string} anchorSuffix - String to append to each anchor's id and href.
 * @param {string} ulClass - CSS class for the generated <ul> element.
 * @param {string} liClass - CSS class for each <li> item.
 * @param {string} linkClass - CSS class for each anchor (<a>) link.
 * @param {string} excludeMeSelector - CSS selector for ancestor blocks; 
 *                                     if a TOC container is inside one,
 *                                     headings inside that same block are excluded.
 */
function generateTOC(
  selector = "h1,h2,h3",
  excludeChildrenSelector = ".toc-exclude-children",
  excludeItemSelector = ".toc-exclude-item",
  tocContainerSelector = "#heading_toc",
  anchorSuffix = "",
  ulClass = "toc-menu",
  liClass = "toc-menu-item",
  linkClass = "toc-menu-anchor",
  excludeMeSelector = ".DnnModule-OpenContent"
) {
  // Helper: slugify text to safe IDs
  function slugify(text) {
    return text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric chars
      .replace(/\s+/g, "-")         // spaces to hyphens
      .replace(/-+/g, "-");         // collapse multiple hyphens
  }

  // Find all TOC containers
  const tocContainers = document.querySelectorAll(tocContainerSelector);
  if (!tocContainers.length) return;

  tocContainers.forEach(container => {
    // Find the exclude-me ancestor for this TOC container (if any)
    const excludeBlock = excludeMeSelector ? container.closest(excludeMeSelector) : null;

    // Collect headings
    const headings = Array.from(document.querySelectorAll(selector)).filter(el => {
      if (excludeChildrenSelector && el.closest(excludeChildrenSelector)) return false;
      if (excludeItemSelector && el.matches(excludeItemSelector)) return false;
      if (excludeBlock && excludeBlock.contains(el)) return false; // <- exclude inside this block
      return true;
    });

    // Create UL with accessibility attributes
    const ul = document.createElement("ul");
    ul.className = ulClass;
    ul.setAttribute("role", "navigation");
    ul.setAttribute("aria-label", "Table of Contents");

    if (anchorSuffix !== "") {
      ul.classList.add(ulClass + "-" + anchorSuffix);
    }

    headings.forEach((heading, index) => {
      // Generate or reuse ID
      let headingId = heading.id;
      if (!headingId) {
        headingId = anchorSuffix
          ? `${slugify(heading.textContent)}-${anchorSuffix}`
          : slugify(heading.textContent);

        // Ensure uniqueness
        let uniqueId = headingId;
        let counter = 1;
        while (document.getElementById(uniqueId)) {
          uniqueId = `${headingId}-${counter++}`;
        }
        headingId = uniqueId;
        heading.id = headingId;
      }

      // Create <li><a>
      const li = document.createElement("li");
      li.className = liClass;

      const a = document.createElement("a");
      a.className = linkClass;
      a.href = `#${headingId}`;
      a.textContent = heading.textContent.trim();

      li.appendChild(a);
      ul.appendChild(li);
    });

    // Replace content inside the TOC container
    container.innerHTML = "";
    container.appendChild(ul);
  });
}

// Auto-run
document.addEventListener("DOMContentLoaded", () => {
  generateTOC();
});
