# DayWise Project Organisation

The source files are separated by file type without combining modules or changing their behaviour.

## Folders

- `Html/` contains every application page. Start the application with `Html/webpage.html`.
- `Css/` contains all module and shared stylesheets.
- `Javascript/` contains all module and shared scripts, including the authentication guard and theme handler.
- `Images/` is the designated location for standalone images. It is currently empty because the application uses CSS gradients, emoji and inline SVG data.
- `Documentation/` contains project-maintenance documentation.

The existing root `README.md` remains the primary project documentation.

## Path conventions

HTML pages link to stylesheets using `../Css/<file>.css` and scripts using `../Javascript/<file>.js`. Because all pages are siblings in `Html/`, navigation links use page names such as `dashboard.html` and `moneymanager.html`.

JavaScript redirects are relative to the HTML page currently displayed. The shared authentication guard derives the login-page URL from its own script URL so it works from every protected page.

## Adding a module

1. Add its page to `Html/`.
2. Add its stylesheet to `Css/`.
3. Add its script to `Javascript/`.
4. Put standalone visual assets in `Images/`.
5. Use the path conventions above and update module navigation where required.
6. Run syntax and local-reference checks before committing.
