# Commonplace

A responsive React course-discovery and registration demo.

## Run locally

```bash
npm install
npm run dev
```

## Features

- Search courses and filter by category or experience level.
- Sort by popularity, start date, or price.
- View course details, instructor information, schedule, and class size.
- Create and switch between browser-local student and admin demo profiles.
- Enroll in classes, cancel enrollments, and see class capacity in **My learning**.
- Track lesson completion and overall learning progress.
- Save courses and manage the course catalog and enrollments from the admin workspace.
- Complete a simulated checkout for paid classes; no payment details are requested and no charge is made.
- Persist profiles, courses, saved items, enrollments, and progress in browser `localStorage`.
- Responsive layouts for desktop and mobile.

## Demo limitations

This version deliberately has no API or server. All data is stored in the current browser and is not shared across devices or users. The sign-in flow is a local profile switch, with no password or secure authentication; selecting the administrator role is for demonstration only. Paid checkout is simulated and never charges a card. Real accounts, shared course data, secure admin authorization, payment processing, and email notifications require a backend and provider credentials.
