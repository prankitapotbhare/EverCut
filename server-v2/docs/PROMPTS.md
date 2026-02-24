Analyze the entire codebase to fully understand the project, its current implementation, and its overall architecture and context.

The project was developed by other developers, but it is poorly structured and lacks proper architectural standards — it appears to have been built without solid engineering practices.

We need to completely refactor and rebuild the project, including:

* Project folder structure
* File and folder naming conventions
* Function and variable naming
* Code quality and organization
* Database design and schemas
* Overall architecture and implementation patterns

Essentially, the entire codebase needs to be rewritten and properly structured.

You may read and refer to the following documents for guidance in selecting the best possible architecture and standards:

* `docs/BACKEND_ARCHITECTURE_BLUEPRINT.md`
* `docs/ROLE_BASED_AUTHENTICATION_ARCHITECTURE.md`

Use these guides to implement the most robust, scalable, and maintainable architecture possible.

Develop a complete understanding of the system, apply best practices, modern design patterns, and proven engineering techniques, and fully restructure and fix the entire project.







Analyze the entire codebase to fully understand the project, including its current implementation, overall architecture, and complete context.

Perform a comprehensive, line-by-line technical audit of the system. Identify and document all flaws, vulnerabilities, implementation issues, architectural weaknesses, logical errors, and potential bugs.

Conduct an in-depth review of the following areas:

### 1. Security Vulnerabilities

* Authentication and authorization flaws
* Role-based access control misconfigurations
* Injection vulnerabilities (SQL/NoSQL injection, command injection, etc.)
* XSS, CSRF, SSRF, and related web vulnerabilities
* Insecure password hashing or token management
* Improper input validation or sanitization
* Misconfigured CORS, headers, cookies, or session handling
* Exposure of secrets, API keys, or sensitive data

### 2. Logical & Functional Errors

* Incorrect business logic
* Broken edge-case handling
* Race conditions and concurrency issues
* Improper error handling or swallowed exceptions
* Unreachable or redundant code

### 3. Incomplete or Incorrect Implementations

* Partially implemented features
* TODO / FIXME sections
* Missing validation layers
* Inconsistent schema definitions or mismatched types

### 4. Architecture & Design Issues

* Violations of separation of concerns
* Tight coupling or poor modularization
* Improper controller/service/repository layering
* Poor scalability or extensibility design
* Dependency mismanagement

### 5. Performance Problems

* N+1 queries
* Missing database indexes
* Inefficient queries or aggregations
* Blocking I/O operations
* Memory leaks
* Missing caching strategies

### 6. Configuration & Environment Issues

* Unsafe environment variable handling
* Hardcoded secrets
* Development/production misconfiguration
* Logging misconfiguration

### 7. Code Quality & Maintainability

* Code duplication
* Inconsistent naming conventions
* Weak typing or misuse of TypeScript
* Lack of validation schemas
* Dead code

### 8. Testing & Reliability

* Missing unit or integration tests
* Flaky or unreliable tests
* Lack of edge-case coverage
* Improper mocking

### 9. API & Data Integrity

* Incorrect HTTP status codes
* Inconsistent API response formats
* Data integrity issues
* Schema validation gaps

---

### For Every Issue Identified:

* Clearly describe the issue
* Provide the exact file/location (if possible)
* Explain the root cause
* Assess severity level (Low / Medium / High / Critical)
* Explain business and security impact
* Provide a recommended fix with code-level guidance
* Suggest best-practice alternatives where applicable

---

### Output Requirements (MANDATORY)

Output the entire audit as a **well-structured Markdown (.md) document** with:

* Proper hierarchical headings (`#`, `##`, `###`)
* A clear table of contents
* Bullet points for clarity
* Severity summary tables where appropriate
* Code blocks for examples and fixes
* A categorized breakdown by vulnerability type
* A prioritized remediation roadmap section
* An overall system health summary at the end

The document should be professional, structured like a formal security audit report, and suitable for direct sharing with engineering and security teams.









How many vulnerabilities listed in `SECURITY_AUDIT.md` are addressed and resolved by `docs/IMPLEMENTATION_PLAN.md`?

For any vulnerabilities that are **not** resolved by `docs/IMPLEMENTATION_PLAN.md`, create a separate document outlining:

* The unresolved vulnerabilities
* Their severity levels
* Why they remain unaddressed
* A clear remediation plan for each
* Recommended best-practice solutions

Present the analysis in a well-structured Markdown document.




I want you to analyze the entire codebase to fully understand the project, including its current implementation, overall architecture, and complete context.

Then, [MODIFICATION-START] integrate a feature that allows barbers/shops to reply to user/customer ratings and reviews. [MODIFICATION-END]

Also, update the `postman-collections/`, `docs/`, and any other relevant parts of the project accordingly. However, **do not create any new documents or new `.md` files**.

While implementing this functionality, use the best possible architectural approach, follow industry best practices, ensure proper role-based access control, maintain a clean and scalable code structure, and make the solution production-ready.
