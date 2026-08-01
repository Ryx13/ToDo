# COMS3011A Lab 1 - Todo Application

## 1. Third-Party Code
The following libraries and packages were installed to build this local-first application:
* **`next` / `react`**: Chosen as the core framework for building the user interface and handling the backend API routes seamlessly in a single project.
* **`tailwindcss`**: Chosen to enable rapid, utility-first styling for the frontend UI components without writing separate CSS files.
* **`better-sqlite3`**: Chosen because it is a fast, synchronous SQLite driver that runs natively in Node.js, providing the most performant local-first database interaction.
* **`drizzle-orm`**: Chosen to declare the database schema strictly in TypeScript and query the SQLite database in a type-safe manner.
* **`drizzle-kit`**: Chosen to automatically track schema changes and generate the SQL migration files needed to build the database.
* **`vitest`**: Chosen as a fast, zero-configuration testing framework to execute the TypeScript integration tests.

---

## 2. Database Design
The application utilizes a single SQLite database table named `tasks`. 

### `tasks` Table Schema
| Column Name   | Data Type | Constraints                          | Description                                                                 |
|---------------|-----------|--------------------------------------|-----------------------------------------------------------------------------|
| `id`          | Integer   | Primary Key, Auto Increment          | Unique identifier for the task.                                             |
| `title`       | Text      | Not Null                             | The name of the task.                                                       |
| `description` | Text      | Not Null                             | Detailed context about the task.                                            |
| `due_date`    | Integer   | Not Null                             | Stored as a Unix timestamp (milliseconds) representing local midnight.      |
| `topic`       | Text      | Not Null                             | The category or subject of the task.                                        |
| `status`      | Text      | Not Null, Default: 'Todo'            | Restricted via API logic to: `Todo`, `In-Progress`, or `Complete`.          |
| `is_archived` | Integer   | Not Null, Default: 0                 | Boolean flag (0 = active, 1 = archived) to retain tasks without deleting.   |

**Design Decisions:**
* **Archiving:** Tasks are never deleted. Instead, the `is_archived` integer acts as a boolean flag. The frontend toggles this flag to remove tasks from the active list while retaining the row in the database.
* **Overdue Rule:** Overdue is strictly **not** stored as a column or a status value. It is derived dynamically at read-time by comparing the `due_date` timestamp against the current date's midnight timestamp. If the due date has passed and the task is not `Complete`, it is visually flagged as overdue in the UI.

---

## 3. Running It
**Prerequisites:** 
* Node.js v20.x or higher must be installed on your machine.

Follow these exact commands to start the application from a clean clone:

```bash
# 1. Clone the repository and navigate into it
git clone https://github.com/Ryx13/ToDo.git
cd ToDo

# 2. Install all required dependencies
npm install

# 3. Generate the database and apply migrations to create sqlite.db
npx drizzle-kit generate
npx drizzle-kit migrate

# 4. Run the integration tests (verifies archiving and overdue rules)
npm test

# 5. Start the local development server
npm run dev

```

## AI Usage Declaration
This repository makes use of AI code generation using the following tools: Gemini-Web[Gemini 1.5 Pro].
This repository does not use AI in-line editing tools.
This repository does not use AI code review. (Gemini-Web[Gemini 1.5 Pro] was used for debugging via terminal-output analysis, documented in the AI usage transcript.)
