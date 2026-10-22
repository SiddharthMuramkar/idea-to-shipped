# 01: Design foundation

**What to build:** Every existing page instantly wears the new brand.

- **Colours:** royal blue `#1E3FCC`, a deep navy for dark bands, and one warm amber accent used sparingly.
- **Type and buttons:** large lighter-weight display headings over Inter body text, and GE-style pill buttons with an arrow.
- **Header:** stays at the top of the page and holds the logo mark, the "Idea to Shipped" wordmark, and links to Lessons and The main flow. It is see-through with white text over a top photo, and turns solid white with dark text and a soft shadow once you scroll past it. On pages without a top photo it starts solid.
- **Footer:** dark, lists the Lessons, and has a place for photo credits.
- **Logo:** the logo mark is also the browser-tab icon and replaces the default favicon.
- **Corners:** the v1 rule forcing square corners on everything is removed. Photos and cards stay square-edged.

Plain CSS only. See the spec's Colours, Type, Shape, Header and Logo decisions.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Colour, type and spacing live as named design tokens in the one stylesheet, and the old square-corners rule is gone
- [ ] The header holds the logo, wordmark and two links. It stays at the top while scrolling, switches from see-through to solid after you scroll past a top photo, and starts solid on pages without one
- [ ] A simple vector logo mark shows in the header and as the tab icon, and the default favicon is gone
- [ ] The dark footer lists every Lesson, links to the credits list, and works at phone width
- [ ] Links, buttons and form fields show a visible focus outline
- [ ] No sideways scrolling at about 390px wide; existing tests, lint and build pass
- [ ] Screenshots of the home page and a Lesson page at phone and desktop widths
