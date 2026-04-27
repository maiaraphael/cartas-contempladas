/**
 * Hook que intercepta cliques em links de âncora (#section)
 * e realiza uma rolagem suave com offset para compensar o header fixo.
 */
export function useSmoothScroll(headerOffset = 80) {
  function scrollToSection(e, href) {
    if (!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top,
      behavior: 'smooth',
    });
  }

  return { scrollToSection };
}
