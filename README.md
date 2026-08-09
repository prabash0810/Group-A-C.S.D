## DayWise System & Data Storage Architecture

```mermaid
graph TD

    A[User] --> B[DayWise Website]

    B --> C[Login]
    B --> D[Dashboard]

    D --> E[Daily Planner]
    D --> F[Work & Study]
    D --> G[Income Tracker]
    D --> H[Events & Achievements]

    %% Local Storage
    E --> J[Local Storage]
    F --> J
    G --> J
    H --> J

    J --> J1[University Class Data]
    J --> J2[Work Shift Data]
    J --> J3[Income Data]
    J --> J4[Achievement Progress]
    J --> J5[Event Data]

    %% Session Storage
    C --> K[Session Storage]

    K --> K1[Current Login Session]
    K --> K2[Temporary User State]
    K --> K3[Current Dashboard State]

    %% Cookies
    C --> L[Cookies]

    L --> L1[Remember Me]
    L --> L2[Theme Preference]
    L --> L3[Language Preference]
    L --> L4[Session Identifier]
