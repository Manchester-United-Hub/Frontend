# Common Problematic Patterns — TypeScript / Next.js / React

Patterns to search for during review. Each entry explains why it's worth flagging.

---

## TypeScript

### Silent `any` casts

```typescript
// Red flag — silences all type errors downstream
const data = response as any;
const value = (thing as any).nested.field;
```

Why: A cast to `any` removes all type-checking. Prefer `unknown` + a type guard, or a proper interface.

### Non-null assertion without validation

```typescript
// Red flag — crashes at runtime if undefined
const name = user!.profile!.name;
```

Why: `!` tells TypeScript "trust me", but if the assumption is wrong the error is a runtime crash. Prefer optional chaining + a guard.

### Index signature access without undefined check

```typescript
// Red flag — record[key] is T | undefined in strict mode
const val = record[key].toUpperCase();
```

Why: `noUncheckedIndexedAccess` makes this `T | undefined`. The access is safe only after a guard.

---

## React

### Stale closure in `useEffect`

```typescript
useEffect(() => {
  // Red flag if `count` is used here but not in deps array
  setInterval(() => console.log(count), 1000);
}, []); // missing `count`
```

Why: The interval captures the initial value of `count` and never updates.

### Object/array literal in deps array

```typescript
// Red flag — new object reference every render → infinite loop
useEffect(() => { ... }, [{ id: user.id }]);
```

Why: Object literals are recreated each render, making the deps always "new". Extract the primitive.

### Missing cleanup for subscriptions / intervals

```typescript
useEffect(() => {
  const id = setInterval(fn, 1000);
  // Red flag — no return () => clearInterval(id)
}, []);
```

Why: Memory leak and duplicate execution on re-mount (React 18 Strict Mode mounts twice).

### Key prop as array index

```typescript
// Red flag for dynamic lists that can reorder/filter
{items.map((item, i) => <Card key={i} {...item} />)}
```

Why: Index keys break reconciliation when the list changes order — state and DOM get mismatched.

### `async` callback directly in `useEffect`

```typescript
// Red flag — useEffect callback must return void or a cleanup fn
useEffect(async () => { ... }, []);
```

Why: An async function returns a Promise, not a cleanup function. Define an inner async function and call it.

---

## Next.js

### Server-only secret in Client Component props

```typescript
// Red flag — API_SECRET ends up in the browser bundle
export default function Page() {
  return <Chart apiKey={process.env.API_SECRET} />;
}
```

Why: Props passed to Client Components are serialized and sent to the browser. Use `NEXT_PUBLIC_` only for values safe to expose, or call the API server-side.

### Missing `await` on Server Action

```typescript
// Red flag — mutation fires without waiting for result
async function handleSubmit() {
  saveData(formData); // missing await
  redirect('/success');
}
```

Why: The redirect runs before the mutation completes; data may not be saved.

### Dynamic route without `generateStaticParams` when static export is needed

```typescript
// Red flag in static export mode — builds fail for unregistered params
export default function Page({ params }: { params: { id: string } }) { ... }
// missing: export async function generateStaticParams() { ... }
```

### Fetch without cache strategy in Server Component

```typescript
// Ambiguous — is this cached? revalidated? always fresh?
const data = await fetch('https://api.example.com/data');
```

Why: In Next.js 15, `fetch` defaults to no caching. Be explicit: `{ cache: 'no-store' }` or `{ next: { revalidate: 60 } }`.

### Client Component importing a server-only module

```typescript
'use client';
import { db } from '@/lib/db'; // Red flag — db is server-only
```

Why: This bundles the DB client (and potentially credentials) into the browser bundle.

---

## Security

### Template literal in `Bash` tool or `child_process`

```typescript
// Red flag — command injection if `name` contains shell metacharacters
exec(`git log --author=${name}`);
```

Why: User input must be passed as an argument array, never interpolated into a command string.

### Unvalidated redirect target

```typescript
// Red flag — open redirect
const target = searchParams.get('next');
redirect(target); // attacker can redirect to https://evil.com
```

Why: Validate that the target is a relative path or an allowed domain before redirecting.

### `innerHTML` with unsanitized content

```typescript
// Red flag — XSS
element.innerHTML = userInput;
div.dangerouslySetInnerHTML={{ __html: userInput }};
```

Why: Any `<script>` or event handler in `userInput` executes in the user's browser.

---

## Docker / CI

### Secret in `RUN` layer

```dockerfile
# Red flag — secret persists in image history even if deleted later
RUN echo "API_KEY=abc123" > .env && npm run build && rm .env
```

Why: Every `RUN` layer is cached in the image. Use Docker BuildKit's `--secret` mount instead.

### `${{ github.event.issue.body }}` interpolated into `run:`

```yaml
# Red flag — script injection via issue body
- run: echo "${{ github.event.issue.body }}"
```

Why: An attacker can craft an issue body that contains shell commands. Pass event data via `env:` and read from `$ENV_VAR`.

### Wildcard permission grant in GitHub Actions

```yaml
permissions: write-all # Red flag
```

Why: Grant only the minimum permissions the job needs.
