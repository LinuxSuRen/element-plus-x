# Element Plus X Demo

Live demo application showcasing the PaginationTable component.

**Live Demo:** [View on GitHub Pages](https://LinuxSuRen.github.io/element-plus-x/)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the demo server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Demo Pages

| Page | Description |
|------|-------------|
| **Basic Usage** | Simple table with pagination - no search, no actions |
| **With Search** | Search bar with input, select dropdown, and date picker |
| **With Actions** | Custom action buttons with built-in delete functionality |
| **Real World API** | Integration with JSONPlaceholder REST API |

## Features Demonstrated

- **Pagination** - Configurable page sizes and layouts
- **Search Bar** - Auto-generated from column definitions
- **Input Types** - Text input, select dropdown, date picker
- **Actions** - Custom slots and built-in delete button
- **API Integration** - Real REST API calls with loading states
- **Custom Cells** - Render custom content in table cells
- **Events** - Data loaded and delete events

## Project Structure

```
demo/
├── src/
│   ├── views/          # Demo pages
│   │   ├── BasicView.vue
│   │   ├── SearchView.vue
│   │   ├── ActionsView.vue
│   │   └── ApiView.vue
│   ├── router/         # Vue Router configuration
│   ├── App.vue         # Main app component
│   └── main.ts         # Entry point
├── public/
│   └── .nojekyll      # Disable Jekyll processing on GitHub Pages
├── index.html
├── vite.config.ts
└── package.json
```

## Development

The demo uses Vite for fast development. The component is imported directly from the `src/` directory using path alias:

```ts
// vite.config.ts
resolve: {
  alias: {
    'element-plus-x': resolve(__dirname, '../src')
  }
}
```

This means any changes to the library source will be immediately reflected in the demo without rebuilding.

## Build for Production

```bash
npm run build
```

The built demo will be in the `dist/` directory. Preview it with:

```bash
npm run preview
```

## Deploy to GitHub Pages

The demo is automatically deployed to GitHub Pages when you push to the `master` branch.

### Manual Deployment

If you need to deploy manually:

1. Install `gh-pages` package:
   ```bash
   npm install -g gh-pages
   ```

2. Build the demo:
   ```bash
   npm run build
   ```

3. Deploy to GitHub Pages:
   ```bash
   npx gh-pages -d demo/dist
   ```

### Configuration

- **Base path**: Configured in `vite.config.ts` as `/element-plus-x/`
- **Workflow**: GitHub Actions workflow in `.github/workflows/deploy.yml`
- **Branch deploys from**: `main`
- **Source directory**: `demo/dist`

To change the base path (if your repo name is different), edit `demo/vite.config.ts`:

```ts
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```
