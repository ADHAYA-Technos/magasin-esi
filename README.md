# ES3 - ESI Store Management Web Application

## Overview

ES3 is a full-stack web application designed to automate and streamline the management of the store at the Ecole Supérieure en Informatique (ESI) 8 Mai 1945 in Sidi Bel Abbes. Developed by ADHYA Tech, this platform aims to optimize product availability, minimize storage and management costs, and enhance operational efficiency. It provides tools for tracking stock, managing orders, automated replenishment, supplier tracking, and article management. The system includes features for account and role management, creating internal and external purchase orders, delivery notes, and notifications for users based on their roles (e.g., low stock alerts, supply requests, validations, and product expiration warnings).

This repository contains the source code for the ES3 application, built to meet the requirements outlined in the project's cahier des charges.

## Features

### Account and Role Management (Administrator)
- Create, edit, and delete user accounts.
- Manage roles and assign access rights.
- Handle consumer profiles (students, teachers, employees).
- Manage organizational structures.
- Assign and revoke access permissions.

### Entry Management (Agent du Service Achat - ASA)
- Create and manage chapters, articles, and products.
- Register and manage suppliers.
- Generate external purchase orders (Bon de Commande Externe - BCE).
- Handle reception vouchers (Bon de Réception - BR) by verifying received orders and automatically updating stock.

### Exit Management (Magasinier, RSR, Directeur)
- Create internal supply requests (Bon de Commande Interne - BCI) as a consumer.
- Validate or modify BCIs (Responsable de la Structure de Rattachement - RSR).
- Approve BCIs (Directeur).
- Modify quantities, establish discharge vouchers (Bon de Décharge), and exit vouchers (Bon de Sortie) (Magasinier).

### Inventory Management
- Phase 1: Generate and print product lists for physical inventory checks.
- Phase 2: Update physical quantities in the system and reconcile with logical stock.
- Automated notifications for low stock thresholds and approaching expiration dates.

### Additional Functionalities
- User authentication and registration.
- Role-based access control.
- Notification system for supply requests, validations, and stock alerts.
- Reporting and tracking of all entries and exits.

## User Roles
- **Administrator**: Manages accounts, roles, and access rights.
- **Agent du Service Achat (ASA)**: Handles procurement and entries.
- **Magasinier**: Manages stock reception, exits, and inventory.
- **Responsable de la Structure de Rattachement (RSR)**: Validates internal orders.
- **Directeur**: Approves internal orders.
- **Consommateur**: Submits supply requests (e.g., students, teachers, employees).
![Actors Diagram](https://github.com/ADHAYA-Technos/magasin-esi/blob/main/ES3_Actors.jpg)
  - **Description**: ES3 Actors Diagram

## Technologies Used
- **Backend**: Node.js (event-driven JavaScript runtime for network applications).
- **Database**: MySQL (with logical requirements for reliability, security, maintainability, portability, and user-friendliness).
- **Frontend**: (Inferred from web app context; likely HTML/CSS/JavaScript frameworks, but specifics may include React or similar based on full-stack nature).
- **Other**: Compliance with ISO/IEC 12207 software life cycle processes.
- **Development Framework**: Express.js (as hinted in constraints for web development).

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/ADHYA-Tech/ES3.git
   ```

2. Navigate to the project directory:
   ```
   cd ES3
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up the MySQL database:
   - Create a database named `es3_db`.
   - Import the schema from `database/schema.sql`.
   - Configure database credentials in `.env` file (e.g., DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).

5. Start the application:
   ```
   npm start
   ```

   The app will run on `http://localhost:3000` (or configured port).

## Usage

- **Authentication**: Access the login page to sign in with valid credentials.
- **Dashboard**: Depending on your role, navigate to manage accounts, entries, exits, or inventory.
- **Notifications**: Receive alerts for stock levels, expirations, and order statuses.
- For detailed user interfaces and flows, refer to the cahier des charges document.

## Contributors

- **DAIT DEHANE YACINE** - Chef d'équipe (y.daitdehane@esi-sba.dz)
- **SERGHINE ABDELILLAH** - Responsable de qualité (a.serghine@esi-sba.dz)
- **OMARI ABDESSLAM** - Développeur (a.omari@esi-sba.dz)
- **BENCHEHIDA HAMZA** - Développeur (h.benchehida@esi-sba.dz)
- **OUIS FAROUK ABDELMADJID** - Développeur (f.ouis@esi-sba.dz)
- **BOUDAOUD DJABER** - Développeur (d.boudaoud@esi-sba.dz)

## Demostration Video 
https://www.linkedin.com/posts/dait-dehane-yacine_network-techinnovators-teamwork-activity-7208463092349841410-m1tm?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD_UYbcBGZD2qYvsxG3-x9-B3zzJ88zhaPA

## Contact

For inquiries, contact ADHYA Tech at adhaya.technos@gmail.com.
