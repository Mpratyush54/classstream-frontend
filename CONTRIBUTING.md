## Contribution Guidelines

We appreciate your interest in contributing! Here are some specific guidelines to help you get started:

### Getting Started

1.  **Prerequisites:** Ensure you have [Node.js](https://nodejs.org/) (which includes npm) and the [Angular CLI](https://angular.io/cli) installed globally.
2.  **Fork & Clone:** Fork the repository and clone your fork locally.
3.  **Install Dependencies:** Navigate to the project directory and run `npm install`.
4.  **Development Server:** Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any source files.

### Branching Strategy

* Create new branches from the `main` branch (or the primary development branch, e.g., `develop`).
* Use descriptive branch names prefixed with `feat/`, `fix/`, `docs/`, `refactor/`, etc.
    * Example: `feat/add-video-search-filter`
    * Example: `fix/login-validation-error`

### Code Style & Quality

* **Follow Existing Style:** Please try to match the coding style and patterns used throughout the existing codebase.
* **Linting:** We use ESLint and Prettier to enforce code style. Run `ng lint` before committing to catch potential issues.
* **TypeScript Best Practices:** Utilize TypeScript features like strong typing where appropriate. Avoid using `any` unless necessary.
* **Component Structure:** Follow Angular best practices for component organization, inputs/outputs, and lifecycle hooks. Use standalone components where appropriate for new features.
* **RxJS:** Use RxJS operators effectively for handling asynchronous operations. Ensure subscriptions are properly managed (e.g., using `async` pipe or unsubscribing manually) to prevent memory leaks.

### Testing

* **Unit Tests:** Add unit tests (`*.spec.ts`) for new services, complex component logic, pipes, or directives.
* **Run Tests:** Ensure all tests pass by running `ng test`. For CI environments or a single run, use `ng test --watch=false --browsers=ChromeHeadless`.

### Building

* Ensure the application builds successfully for production using `ng build --configuration production`.

### Pull Request Process

1.  **Ensure Checks Pass:** Before submitting, make sure your branch builds, passes linting, and passes all tests.
2.  **Update Your Branch:** Rebase your branch onto the latest `main` (or development branch) if necessary (`git pull --rebase origin main`).
3.  **Submit PR:** Push your branch to your fork and open a Pull Request against the original repository's `main` branch.
4.  **Description:** Provide a clear title and description for your PR. Explain the "what" and "why" of your changes. Include screenshots or GIFs for UI changes.
5.  **Link Issues:** If your PR addresses an existing issue, link it using keywords like `Closes #123` or `Fixes #456`.
6.  **Code Review:** Be responsive to feedback during the code review process.
