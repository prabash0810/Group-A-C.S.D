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

    %% Future Upgrade
    J -. Future Upgrade .-> L[(☁️ Secure Cloud Database)]

    L --> M[Encrypted User Data]
    L --> N[Cross-device Access]
    L --> O[Automatic Backup]
```