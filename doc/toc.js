// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="Introduction.html">Introduction</a></li><li class="chapter-item expanded affix "><li class="part-title">이론 PART</li><li class="chapter-item expanded "><a href="chapter_1/chapter_1_메가리스란.html"><strong aria-hidden="true">1.</strong> Chapter 1: 메가리스란?</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter_1/chapter_1-1_중심부/chapter_1-1_중심부.html"><strong aria-hidden="true">1.1.</strong> 중심부</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter_1/chapter_1-1_중심부/chapter_1-1-1_상급_메가리스_몬스터.html"><strong aria-hidden="true">1.1.1.</strong> 상급 메가리스 몬스터</a></li><li class="chapter-item expanded "><a href="chapter_1/chapter_1-1_중심부/chapter_1-1-2_하급_메가리스_몬스터.html"><strong aria-hidden="true">1.1.2.</strong> 하급 메가리스 몬스터</a></li><li class="chapter-item expanded "><a href="chapter_1/chapter_1-1_중심부/chapter_1-1-3_메가리스의_마법&함정.html"><strong aria-hidden="true">1.1.3.</strong> 메가리스의 마법&amp;함정</a></li></ol></li><li class="chapter-item expanded "><a href="chapter_1/chapter_1-2_가지부/chapter_1-2_가지부.html"><strong aria-hidden="true">1.2.</strong> 가지부</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter_1/chapter_1-2_가지부/chapter_1-2-1_전개_서포트.html"><strong aria-hidden="true">1.2.1.</strong> 전개 서포트</a></li><li class="chapter-item expanded "><a href="chapter_1/chapter_1-2_가지부/chapter_1-2-2_자원_서포트.html"><strong aria-hidden="true">1.2.2.</strong> 자원 서포트</a></li><li class="chapter-item expanded "><a href="chapter_1/chapter_1-2_가지부/chapter_1-2-3_공수_서포트.html"><strong aria-hidden="true">1.2.3.</strong> 공수 서포트</a></li></ol></li><li class="chapter-item expanded "><a href="chapter_1/chapter_1-3_독립부/chapter_1-3_독립부.html"><strong aria-hidden="true">1.3.</strong> 독립부</a></li></ol></li><li class="chapter-item expanded "><a href="chapter_2/chapter_2_삼중_사이클_이론.html"><strong aria-hidden="true">2.</strong> Chapter 2: 삼중 사이클 이론</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter_2/chapter_2-1_전개_사이클.html"><strong aria-hidden="true">2.1.</strong> 전개 사이클</a></li><li class="chapter-item expanded "><a href="chapter_2/chapter_2-2_자원_사이클.html"><strong aria-hidden="true">2.2.</strong> 자원 사이클</a></li><li class="chapter-item expanded "><a href="chapter_2/chapter_2-3_공수_사이클.html"><strong aria-hidden="true">2.3.</strong> 공수 사이클</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
