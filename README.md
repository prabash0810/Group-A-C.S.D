DayWise – Work & Study Planner
Project Overview

DayWise is a client-side web application designed to help users organise their university classes, work shifts, working hours, and reminders in one place.

The Work & Study Planner allows users to add and manage university classes and work shifts. The dashboard automatically updates when information is added or deleted.

The application demonstrates important client-side web development concepts, including:

HTML5
CSS3
JavaScript
DOM manipulation
Form handling
Browser localStorage
Data processing
Responsive web design
Dynamic user interface updates
Main Features
1. Dashboard

The dashboard provides users with a quick overview of their current university and work schedule.

It displays:

Number of university classes
Number of work shifts
Total working hours
University reminder

The dashboard is automatically updated whenever a university class or work shift is added or deleted.

Example
Dashboard Item	Example
University	3 Classes
Work	2 Shifts
Hours	16 hrs
Reminder	Monday
2. University Class Planner

The Add University Class form allows users to record their university timetable.

The form collects:

Module Name
Lecturer
Day
Start Time
End Time
Room Number

After the form is submitted, the class is added to the university schedule and saved in the browser's local storage.

Example University Schedule
Module	Day	Time
Client Side Development	Monday	10:00 - 12:00
Database Systems	Wednesday	13:00 - 15:00

Users can also delete a university class when it is no longer required.

3. Work Shift Planner

The Add Work Shift form allows users to record their work schedule.

The form collects:

Company Name
Job Role
Work Day
Start Time
End Time
Location

The application automatically calculates the number of hours worked using the start and end times.

Example
Start Time: 09:00
End Time:   13:30
Total:      4.5 hours

The calculated working hours are stored together with the work-shift information.

Work Hours Calculation

JavaScript is used to automatically calculate the duration of each work shift.

The calculateHours() function converts the start and end times into minutes and calculates the difference between them.

This means the user does not need to manually enter the number of hours.

The calculated value is then stored in the work object.

function calculateHours(start, end) {

    let s = start.split(":");
    let e = end.split(":");

    let startMinutes = Number(s[0]) * 60 + Number(s[1]);
    let endMinutes = Number(e[0]) * 60 + Number(e[1]);

    return (endMinutes - startMinutes) / 60;
}
Data Storage

DayWise uses browser localStorage to persist university and work data.

The application stores two main datasets:

university
work

The following methods are used:

localStorage.setItem()
localStorage.getItem()

JavaScript objects are converted into JSON before being stored:

JSON.stringify()

When the data is retrieved, JSON is converted back into JavaScript objects:

JSON.parse()

This allows the user's university classes and work shifts to remain available after refreshing or reopening the webpage in the same browser.


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


    Storage Explanation

Local Storage

Local Storage is currently implemented in the Work & Study module. It is used to persist university classes and work shifts so that the data remains available after refreshing or reopening the webpage.

Session Storage

Session Storage is included in the overall DayWise architecture for temporary session-related information. It is part of the planned system design and is not currently implemented in the Work & Study JavaScript.

Cookies

Cookies are included in the overall architecture for potential features such as Remember Me, theme preferences, language preferences, and session identifiers.

Implementation Note: The current Work & Study module specifically uses localStorage. Session Storage and Cookies are represented as part of the wider DayWise system architecture and can be implemented as the project develops.

Data Structure

University classes and work shifts are stored as JavaScript objects inside arrays.

University Class Object
{
    module: "Client Side Development",
    lecturer: "Dr. Smith",
    day: "Monday",
    start: "10:00",
    end: "12:00",
    room: "B201"
}
Work Shift Object
{
    company: "Tesco",
    role: "Customer Assistant",
    day: "Tuesday",
    start: "09:00",
    end: "13:30",
    location: "London",
    hours: 4.5
}

The objects are stored inside arrays:

let university = [];
let work = [];

The arrays are then saved to localStorage.

Delete Functionality

The application provides delete buttons for both university classes and work shifts.

When the user deletes a record, the application:

Removes the record from the relevant array.
Saves the updated data to localStorage.
Refreshes the relevant table.
Updates the dashboard.
Displays a confirmation message.
Delete University Class
university.splice(index, 1);

saveData();

displayUniversity();

updateDashboard();
Delete Work Shift
work.splice(index, 1);

saveData();

displayWork();

updateDashboard();

The splice() method removes the selected item from the array.

Technologies Used
HTML5

HTML is used to create the structure of the application, including:

Header and navigation
Dashboard cards
University form
Work form
Input fields
Select menus
Schedule tables
Buttons
Notification area
CSS3

CSS is used for:

Page layout
Colours
Typography
Cards
Buttons
Tables
Hover effects
Responsive design
Media queries
JavaScript

JavaScript provides the main functionality of the Work & Study Planner, including:

Form submission
DOM manipulation
Data storage
Data retrieval
Work-hour calculation
Dashboard updates
Dynamic table generation
Delete functionality
User notifications

Browser localStorage

Browser localStorage is used to persist university and work schedule data.

This allows the data to remain available after the webpage is refreshed or reopened in the same browser.

Project Structure
DayWise/
│
├── index.html
├── workstudy.css
├── workstudy.js
└── README.md
index.html

Contains the structure and content of the Work & Study Planner, including the dashboard, forms, tables, and notification area.

workstudy.css

Contains the visual styling, layout, responsive design, animations, colours, and typography.

workstudy.js

Contains the application functionality, including data management, form handling, work-hour calculations, dashboard updates, table generation, deletion, and localStorage.

README.md

Contains project documentation, architecture, features, technologies, data storage, and implementation details.

Conclusion

DayWise provides a centralised solution for managing everyday university and work schedules.

