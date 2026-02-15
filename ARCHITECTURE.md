# Clean Architecture Documentation

This imageboard follows strict Clean Architecture principles with clear separation of concerns across layers.

## Layer Structure

### 1. Entity Layer (`lib/entities/`)

**Responsibility:** Pure data structures only

- `thread.entity.ts` - Thread data structure and input types
- `reply.entity.ts` - Reply data structure and input types
- `board.entity.ts` - Board data structure
- `post.entity.ts` - Latest posts and recent images data structures

**Rules:**

- No business logic
- No external dependencies
- Pure TypeScript interfaces

### 2. Repository Layer (`lib/repositories/`)

**Responsibility:** Database access only

- `thread.repository.ts` - Thread CRUD operations
- `reply.repository.ts` - Reply CRUD operations
- `board.repository.ts` - Board read operations
- `post.repository.ts` - Cross-entity queries for homepage

**Rules:**

- Contains ONLY data access logic
- No business rules
- Maps database records to entities
- Uses Supabase client for database operations

### 3. Service Layer (`lib/services/`)

**Responsibility:** Non-core reusable logic

- `content-filter.service.ts` - Content moderation and filtering

**Rules:**

- Handles cross-cutting concerns
- No business rules specific to use cases
- Reusable across multiple use cases

### 4. Use Case Layer (`lib/use-cases/`)

**Responsibility:** ALL business logic and application rules

- `create-thread.use-case.ts` - Thread creation with validation
- `reply-to-thread.use-case.ts` - Reply creation with thread bumping
- `get-thread-list.use-case.ts` - Fetch threads with reply counts
- `get-thread-detail.use-case.ts` - Fetch thread with replies
- `get-latest-posts.use-case.ts` - Homepage latest posts
- `get-recent-images.use-case.ts` - Homepage recent images
- `flag-post.use-case.ts` - Report inappropriate content
- `soft-delete-post.use-case.ts` - Moderation deletion

**Rules:**

- Class-based implementation
- Constructor dependency injection
- Contains ALL business rules
- Coordinates between repositories
- No direct database access

### 5. Controller Layer (`lib/controllers/`)

**Responsibility:** Input validation and request mapping

- `thread.controller.ts` - Thread operations controller
- `reply.controller.ts` - Reply operations controller
- `home.controller.ts` - Homepage data controller
- `moderation.controller.ts` - Moderation operations controller

**Rules:**

- Validates input data
- Maps requests to use case calls
- No business logic
- Returns formatted responses

### 6. Action Layer (`lib/actions/`)

**Responsibility:** Server Action entry points

- `thread.actions.ts` - Thread server actions
- `reply.actions.ts` - Reply server actions
- `home.actions.ts` - Homepage data actions
- `moderation.actions.ts` - Moderation actions

**Rules:**

- Server Actions only
- Handles dependency injection
- Forwards requests to controllers
- No logic besides setup and forwarding
- Handles cache revalidation

## Data Flow Examples

### Creating a Thread

\`\`\`
User Form → createThread(formData) → ThreadController.createThread()
→ CreateThreadUseCase.execute() → ThreadRepository.create() → Database
\`\`\`

**Layer responsibilities:**

- **Action:** Extract FormData, inject dependencies
- **Controller:** Validate required fields
- **Use Case:** Business rules (length limits, board validation, author cleaning)
- **Repository:** Insert into database

### Fetching Latest Posts

\`\`\`
Homepage → getLatestPosts() → HomeController.getLatestPosts()
→ GetLatestPostsUseCase.execute() → PostRepository.getLatestPosts() → Database
\`\`\`

**Layer responsibilities:**

- **Action:** Call controller with limit parameter
- **Controller:** Validate limit parameter
- **Use Case:** Business rule (limit between 1-50)
- **Repository:** Complex join query across threads and replies

### Replying to Thread

\`\`\`
Reply Form → createReply(formData) → ReplyController.createReply()
→ ReplyToThreadUseCase.execute() → ReplyRepository.create() + ThreadRepository.updateBumpTime() → Database
\`\`\`

**Layer responsibilities:**

- **Action:** Extract FormData, inject dependencies, revalidate cache
- **Controller:** Validate required fields
- **Use Case:** Business rules (thread locked check, bump thread logic)
- **Repository:** Insert reply and update thread bump time

## Key Architectural Principles

1. **Dependency Rule:** Dependencies only point inward
   - Actions depend on Controllers
   - Controllers depend on Use Cases
   - Use Cases depend on Repositories
   - Repositories depend on Entities

2. **Business Logic Location:** ALL business logic lives in Use Cases
   - Content length validation
   - Thread locking checks
   - Thread bumping logic
   - Author name cleaning
   - Limit constraints

3. **Dependency Injection:** Use Cases receive dependencies via constructor
   \`\`\`typescript
   new CreateThreadUseCase(threadRepository, boardRepository)
   \`\`\`

4. **Single Responsibility:** Each layer has one clear purpose
   - Actions: Server Action setup
   - Controllers: Input validation
   - Use Cases: Business rules
   - Repositories: Data access
   - Entities: Data structures

5. **Testability:** Each layer can be tested in isolation
   - Mock repositories for use case tests
   - Mock use cases for controller tests
   - No tight coupling between layers

## Benefits of This Architecture

- **Maintainability:** Changes isolated to specific layers
- **Testability:** Easy to unit test each component
- **Flexibility:** Can swap implementations (e.g., different databases)
- **Clarity:** Clear separation of concerns
- **Scalability:** Easy to add new features following same patterns

## Development Load Testing

- `npm run seed-load-test`: Seed load test data
- `npm run seed-load-test -- --boardId=1 --threadCount=2000 --replyCount=50 --monthsBack=6`
