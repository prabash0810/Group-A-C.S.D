# DayWise System & Data Storage Architecture

```mermaid
graph TD

    A[🌍 User] --> B[🏠 DayWise Website]

    B --> C[🔐 Login]
    B --> D[📊 Dashboard]

    D --> E[📝 Daily Planner]
    D --> F[🎓 Work & Uni]
    D --> G[💰 Income]
    D --> H[🏆 Achievements]
    D --> I[📅 Events]

    %% Session Storage
    E --> J[(⚡ Session Storage)]
    F --> J
    G --> J
    H --> J
    I --> J

    J --> J1[Current Planner Data]
    J --> J2[Current Work Schedule]
    J --> J3[Current Income Session]
    J --> J4[Current Achievements]
    J --> J5[Current Events]

    %% Cookies
    C --> K[(🍪 Cookies)]
    K --> K1[Remember Me]
    K --> K2[Theme Preference]
    K --> K3[Language]
    K --> K4[Session Identifier]

  DayWise – Project Overview

DayWise is a client-side web application designed to help users organise their daily lives in one place. The application combines personal planning, financial tracking, study and work management, achievements, and event scheduling into a single, user-friendly platform. The aim of DayWise is to improve productivity by allowing users to manage their daily responsibilities efficiently.

Application Features
🏠 Home Page

The Home Page serves as the entry point of the application. It introduces DayWise, highlights its main features, and provides navigation to the Login page. It gives users a clear overview of the application's purpose and benefits.

🔐 Login Page

The Login Page authenticates users before they access their personal dashboard. User preferences such as the "Remember Me" option and interface settings are managed using Cookies to improve the user experience.

📝 Daily Planner

The Daily Planner allows users to:

Add daily tasks
Edit or delete tasks
Mark tasks as completed
Organise activities throughout the day

This helps users stay organised and track their daily progress.

💰 Income Tracker

The Income Tracker helps users manage their personal finances by:

Recording income
Viewing income history
Monitoring total earnings
Tracking financial progress
🎓 Uni & Work Balance

The Uni & Work Balance module enables users to organise both academic and work commitments. Users can:

Add university classes
Record work shifts
View weekly schedules
Balance study and employment responsibilities
🏆 Achievements

The Achievements section motivates users by allowing them to:

Set personal goals
Track completed objectives
Monitor progress over time
📅 Events

The Events section helps users manage important occasions by allowing them to:

Create new events
Edit existing events
View upcoming events
Stay informed about future schedules
Data Storage

DayWise uses different browser storage technologies depending on the type of information being stored.

⚡ Session Storage

Session Storage is used to store important data required during the user's active session, such as:

Current planner information
Active work and university schedules
Income data currently being viewed or edited
Achievement progress during the session
Event information being managed

This data is automatically removed when the browser session ends, helping reduce the amount of information left on the user's device.

🍪 Cookies

Cookies are used to store small pieces of information that improve the user experience, including:

Login session identifier
"Remember Me" preference
Theme preference (Light/Dark Mode)
Language preference

Cookies allow the application to personalise the experience without storing large amounts of application data.

💾 Local Storage

Local Storage is used to store application preferences and non-sensitive information that should remain available after the browser is closed, such as:

User interface settings
Recently used options
Application preferences

This allows users to continue using the application without repeatedly configuring their settings.

Future Enhancement

Although the current version is a client-side web application, DayWise is designed with future scalability in mind. In a production environment, browser storage would be complemented or replaced by a secure cloud database. This would enable:

User accounts
Secure authentication
Data encryption
Automatic backups
Synchronisation across multiple devices
Access to user data from anywhere in the world
    L --> O[Automatic Backup]
```
