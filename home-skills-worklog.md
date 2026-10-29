# Home page skills view

- Owner: primary agent.
- Goal: show the categorized skills listing by default, matching the supplied reference, with an optional graph view.
- Decisions: a Show graph view / Show list view button switches modes. List view uses two columns and stacks on small screens; list items are plain text. Graph view keeps the existing category controls and drag interaction.
- Performance: lazy-load and mount the 3D graph only after choosing it.
- Validation: production build passed. Browser confirmed the list is the initial view, the toggle mounts the existing graph, and switching back restores the two-column list. Left the page in list view. Only the existing large-bundle build warning remains.
