# ⚠️ ClassStream Frontend (Web-v2)

**⚠️ DEPRECATION NOTICE:**  
This branch (`web-v2`) has been **deprecated as of October 22, 2025**.  
It is no longer actively maintained or supported.  
Future development and maintenance continue on the **[main branch](https://github.com/Mpratyush54/classstream-frontend/tree/main)**.

---

## 📘 About This Project

This branch contains the **second major version (v2)** of the ClassStream Frontend, built with Angular.  
It followed `web-v1` and served as an improved architecture before transitioning to the active branch.

**ClassStream** is a web-based educational content platform connecting teachers and students with interactive and secure digital classrooms.  
The system features encrypted video playback, note sharing, real-time communication, and live classes.

---

## 🪦 Deprecated Branch History

| Version | Status | Notes |
|----------|---------|-------|
| [`web-v1`](https://github.com/Mpratyush54/classstream-frontend/tree/deprecated/web-v1) | 🔴 Deprecated | Original Angular build |
| [`web-v2`](https://github.com/Mpratyush54/classstream-frontend/tree/deprecated/web-v2) | 🔴 Deprecated | Legacy architecture, no longer updated |
| [`main`](https://github.com/Mpratyush54/classstream-frontend/tree/main)                | 🟢 Active     | Current and maintained branch |

---

## ⚙️ Legacy Features (For Reference)

- Role-based dashboards for **Teachers** and **Students**
- Secure video playback with **MPEG-DASH + DRM (ClearKey)**
- Note management using **CKEditor 5** and PDF uploads
- Real-time chat and **live class** system via **Socket.IO**
- Browser push notifications via **Angular Service Worker**
- Responsive layout with **Angular Material** components

> These features were implemented during the `web-v2` phase and may differ from newer versions.

---

## 🧱 Setup (For Archival Testing Only)

> ⚠️ This setup is preserved for reference.  
> The branch is not recommended for new deployments.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Angular CLI](https://angular.io/cli)

```bash
npm install -g @angular/cli
```
Installation
```bash
git clone https://github.com/Mpratyush54/classstream-frontend.git
cd classstream-frontend
git checkout web-v2
npm install
```
Development Server
```bash
ng serve -o
```
Production Build
```bash
ng build --configuration production
```
##📄 License
- This project is licensed under the MIT License.
- See the LICENSE file for details.
