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
npm run lint
npm run format:check    # Check formatting
npm run format          # Fix formatting
npm run build
npm run preview -- --host 0.0.0.0
```

---
