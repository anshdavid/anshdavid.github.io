# Website anshdavid.com

## build

- `docker compose up -d --build`

## VS Code Extensions Setup

Export extensions

```bash
code --list-extensions > extensions.txt
```

If using VS Code, install all recommended extensions:

```bash
while read line; do code --install-extension "$line"; done < extensions.txt
```

## Run astro

- `npm run dev -- --host 0.0.0.0`


## For deployment

Run the following for check. good to have push hooks

```bash
pnpm install
pnpm run lint
pnpm run format:check
pnpm run build
npm run preview -- --host 0.0.0.0
```

---
