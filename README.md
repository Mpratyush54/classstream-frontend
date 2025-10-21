# [ClassStream] - Frontend (Angular Application)

## Description

This is the Angular frontend for the Educational Content Platform. It provides distinct user interfaces for Teachers and Students, enabling features like secure video playback, note management, live class participation, and notifications. The application is built with modern Angular practices, including standalone components and reactive programming.

## Key Frontend Features

* **Role-Based Interfaces:** Separate layouts and components tailored for Teacher and Student roles.
* **Modular Architecture:** Utilizes Angular modules and standalone components for better organization and maintainability.
* **Secure Video Player:** Custom-built component using `dash.js` for MPEG-DASH adaptive streaming, integrated with a backend license server for ClearKey DRM protected content playback.
* **Notes Management:**
    * Teachers: Create rich-text notes using CKEditor 5 or upload PDF notes.
    * Students: View text notes and embedded PDFs using `ngx-extended-pdf-viewer`.
* **Live Class & Chat:** Components for creating (Teacher) and joining (Student) live sessions with real-time chat functionality via Socket.IO.
* **Notification System:** Integrates with browser Push API (via Angular Service Worker) and displays notifications within the app.
* **Responsive Design:** Adapts layout for desktop and mobile devices using distinct header/navigation components.
* **User Authentication & Management:** Login, logout, forgot password flows, and components for teachers to view/manage student details.
* **Reusable Components:** Includes generic components like Tables (`app/asset/tables`) and a Video Player wrapper (`app/teacher/video.player.wrapper`).
* **Loading Indicators:** Uses Angular Material progress bars and spinners integrated via an HTTP interceptor.

## Tech Stack (Frontend)

* **Framework:** Angular
* **Language:** TypeScript
* **UI Libraries:** Angular Material, NgBootstrap
* **Rich Text Editor:** CKEditor 5
* **Video Player:** `dash.js` (for MPEG-DASH & DRM)
* **PDF Viewer:** `ngx-extended-pdf-viewer`
* **Real-time:** Socket.IO Client
* **State Management:** Angular Signals (implied by usage in `NavigationService`, `NotificationMapService`)
* **Styling:** CSS
* **PWA:** Angular Service Worker (`@angular/service-worker`)

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Mpratyush54/myproject-frontend
    cd [your-project-directory]/[frontend-folder-name] # Navigate to the Angular app directory
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment:**
    * Modify `src/environments/environment.ts` (for development) and `src/environments/environment.prod.ts` (for production).
    * Ensure `baseurl`, `soket_url`, `live_url`, and `media_url` point to your running backend services.
4.  **Run the development server:**
    ```bash
    ng serve -o
    ```
    The application will be available at `http://localhost:4200/`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--configuration production` flag for a production build.

## Usage

* Access the application in your browser.
* Use the **/login** route to authenticate as a Teacher or Student.
* Navigate through the sidebar (desktop) or bottom navigation (mobile) to access different features like Videos, Notes, Live sessions, etc.

## Contributing

Contributions are welcome! Please follow standard Git workflow (fork, branch, commit, PR). Consider using [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

THr contribution guidlines can be seen here -  [CONTRIBUTING](CONTRIBUTING)
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
