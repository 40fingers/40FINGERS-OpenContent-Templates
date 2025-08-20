/**
 * Generates a Table of Contents (TOC) based on headings in the document.
 * @param {string} selector - CSS selector for headings to include in the TOC.
 * @param {string} skipSelector - CSS selector for headings to skip.
 * @param {string} tocContainerSelector - CSS selector for TOC container(s).
 * @param {string} anchorSuffix - String to append to each anchor's id and href.
 * @param {string} ulClass - CSS class for the generated <ul> element.
 * @param {string} liClass - CSS class for each <li> item.
 * @param {string} linkClass - CSS class for each anchor (<a>) link.
 */
function generateTOC(
  selector = "h1,h2,h3",
  skipSelector = ".skip-heading",
  tocContainerSelector = "#heading_toc",
  anchorSuffix = "",
  ulClass = "toc-menu",
  liClass = "toc-menu-item",
  linkClass = "toc-menu-anchor"
) {
  // Find all TOC containers on the page
  const tocContainers = document.querySelectorAll(tocContainerSelector);
  if (!tocContainers.length) return;

  // Find all headings matching the selector, excluding those inside skipSelector (if provided)
  const headings = Array.from(document.querySelectorAll(selector)).filter(
    el => !skipSelector || !el.closest(skipSelector)
  );

  // Create the TOC list
  const ul = document.createElement("ul");
  ul.className = ulClass;
  if (anchorSuffix != "") {
    ul.classList.add(ulClass + "-" + anchorSuffix);
  }

  headings.forEach((heading, index) => {
    // Use existing ID if present, otherwise generate one (with anchorSuffix at the end)
    let headingId = heading.id;
    if (!headingId) {
      headingId = anchorSuffix
        ? `heading-${index}-${heading.textContent.trim().toLowerCase().replace(/\s+/g, "-")}-${anchorSuffix}`
        : `heading-${index}-${heading.textContent.trim().toLowerCase().replace(/\s+/g, "-")}`;
      heading.id = headingId;
    } else {
      // If the heading already has an ID, just use it as is (do not append anchorSuffix)
      headingId = heading.id;
    }

    // Create list item and link for each heading
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
