# Self-hosted fonts

Served from our own origin because Google Fonts is unreachable from mainland China.
Declared in `src/fonts.css`; do not link fonts.googleapis.com from `index.html` again.

| File | Source (downloaded 2026-11-15) | License |
| --- | --- | --- |
| `material-icons.woff2` | Google Fonts, Material Icons v145 | Apache License 2.0 |
| `roboto-latin.woff2` | Google Fonts, Roboto v51 variable (latin subset, weights 300–500) | SIL Open Font License 1.1 |
| `roboto-latin-ext.woff2` | Google Fonts, Roboto v51 variable (latin-ext subset, weights 300–500) | SIL Open Font License 1.1 |

To refresh, request `https://fonts.googleapis.com/icon?family=Material+Icons` and
`https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap` with a modern
browser User-Agent and download the woff2 URLs they list.
