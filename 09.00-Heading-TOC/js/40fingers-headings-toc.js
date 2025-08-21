/**
 *  * Generates a Table of Contents (TOC) based on headings in the document.
 *
 * ## Examples:
 *
 * ### Basic usage
 * ```html
 * <div id="heading_toc"></div>
 * <h2>Intro</h2>
 * <h2>Chapter 1</h2>
 * <script>
 *   generateTOC("h2"); // Builds TOC from all h2 elements into #heading_toc
 * </script>
 * ```
 *
 * ### Excluding specific sections
 * ```html
 * <div id="heading_toc"></div>
 * <div class="toc-exclude-children">
 *   <h2>This will be excluded</h2>
 * </div>
 * <h2>This will be included</h2>
 * <script>
 *   generateTOC("h2"); // Only the second h2 appears in TOC
 * </script>
 * ```
 *
 * ### Multiple TOC containers
 * ```html
 * <div id="toc1"></div>
 * <div id="toc2"></div>
 * <h2>First</h2>
 * <h2>Second</h2>
 * <script>
 *   generateTOC("h2", ".toc-exclude-children", ".toc-exclude-item", "#toc1, #toc2");
 * </script>
 * ```
 *
 * ### Custom classes for styling
 * ```html
 * <div id="heading_toc"></div>
 * <h2>Alpha</h2>
 * <h2>Beta</h2>
 * <script>
 *   generateTOC("h2", "", "", "#heading_toc", "", "my-toc", "my-toc-item", "my-toc-link");
 * </script>
 * ```
 *
 **/

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
 */
function generateTOC(
  selector = "h1,h2,h3",
  excludeChildrenSelector = ".toc-exclude-children",
  excludeItemSelector = ".toc-exclude-item",
  tocContainerSelector = "#heading_toc",
  anchorSuffix = "",
  ulClass = "toc-menu",
  liClass = "toc-menu-item",
  linkClass = "toc-menu-anchor"
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

  // Find all TOC containers on the page
  const tocContainers = document.querySelectorAll(tocContainerSelector);
  if (!tocContainers.length) return;

  // Find all headings matching the selector
  const headings = Array.from(document.querySelectorAll(selector)).filter(el => {
    if (excludeChildrenSelector && el.closest(excludeChildrenSelector)) return false;
    if (excludeItemSelector && el.matches(excludeItemSelector)) return false;
    return true;
  });

  // Create the TOC list with accessibility attributes
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

      // Ensure ID is unique (avoid duplicates)
      let uniqueId = headingId;
      let counter = 1;
      while (document.getElementById(uniqueId)) {
        uniqueId = `${headingId}-${counter++}`;
      }
      headingId = uniqueId;
      heading.id = headingId;
    }

    // Create list item + anchor
    const li = document.createElement("li");
    li.className = liClass;

    const a = document.createElement("a");
    a.className = linkClass;
    a.href = `#${headingId}`;
    a.textContent = heading.textContent.trim();

    li.appendChild(a);
    ul.appendChild(li);
  });

  // Inject the TOC into each container found
  tocContainers.forEach(container => {
    container.innerHTML = ""; // Clear any existing content
    container.appendChild(ul.cloneNode(true)); // Insert the TOC
  });
}

// Auto-run on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  generateTOC();
});
