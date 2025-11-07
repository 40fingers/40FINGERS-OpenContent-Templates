/**
 * Generates a Table of Contents (TOC) based on headings in the document.
 * Adds optional link wrapping options for structured menus.
 * version 01.00.01
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
  excludeMeSelector = ".DnnModule-OpenContent",
  anchorElementClass = "oc-toc-anchor",
  wrapLink = false,                 // new (default = off)
  wrapLinkText = false,             // new (default = off)
  wrapLinkClass = "itemwrap Level0", // new (used only if wrapLink=true)
  wrapLinkTextClass = ""             // new (used only if wrapLinkText=true)
) {
  // Helper: slugify text to safe IDs
  function slugify(text) {
    return text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // Find all TOC containers
  const tocContainers = document.querySelectorAll(tocContainerSelector);
  if (!tocContainers.length) return;

  tocContainers.forEach(container => {
    const excludeBlock = excludeMeSelector ? container.closest(excludeMeSelector) : null;

    // Collect headings
    const headings = Array.from(document.querySelectorAll(selector)).filter(el => {
      if (excludeChildrenSelector && el.closest(excludeChildrenSelector)) return false;
      if (excludeItemSelector && el.matches(excludeItemSelector)) return false;
      if (excludeBlock && excludeBlock.contains(el)) return false;
      return true;
    });

    // Create UL
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

        let uniqueId = headingId;
        let counter = 1;
        while (document.getElementById(uniqueId)) {
          uniqueId = `${headingId}-${counter++}`;
        }
        headingId = uniqueId;
      }

      // Always insert an anchor before the heading
      const anchor = document.createElement("a");
      anchor.id = headingId;
      anchor.className = anchorElementClass;
      heading.parentNode.insertBefore(anchor, heading);

      // Create <li> and <a>
      const li = document.createElement("li");
      li.className = liClass;

      const a = document.createElement("a");
      a.className = linkClass;
      a.href = `#${headingId}`;

      if (wrapLinkText) {
        const spanText = document.createElement("span");
        if (wrapLinkTextClass) spanText.className = wrapLinkTextClass;
        spanText.textContent = heading.textContent.trim();
        a.appendChild(spanText);
      } else {
        a.textContent = heading.textContent.trim();
      }

      if (wrapLink) {
        const spanWrap = document.createElement("span");
        if (wrapLinkClass) spanWrap.className = wrapLinkClass;
        spanWrap.appendChild(a);
        li.appendChild(spanWrap);
      } else {
        li.appendChild(a);
      }

      ul.appendChild(li);
    });

    // Replace content inside the TOC container
    container.innerHTML = "";
    container.appendChild(ul);
  });
}
