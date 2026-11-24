# Hue Lab 🎨

**Hue Lab** is an RGB color mixer and color name finder. Mix any color with sliders, see its closest named color, and copy its HEX, RGB and HSL codes in one click.

Built with [Next.js](https://nextjs.org) (App Router), React, TypeScript and [React Bootstrap](https://react-bootstrap.github.io).

## Features

- **Large live preview** – the color name and HEX code, with text that automatically switches to stay readable on any background.
- **RGB sliders** – each slider track shows how the whole color changes along that channel.
- **Channel lock** – switch off a channel to keep it fixed while using **− Darker**, **Random** and **+ Lighter**.
- **Step control** – choose how much −/+ changes each active channel. Values stop at 0 and 255, and each button is disabled when it cannot change any active channel.
- **Copy color codes** – HEX, RGB, HSL and modern [OKLCH](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch), each with a copy button.
- **Closest named color** – the name, distance and a side-by-side comparison, plus a **Use it** button to jump to the exact named color.
- **Responsive layout** – side by side on desktop, stacked on mobile.

Color names come from [The Color API](https://www.thecolorapi.com). Requests are debounced, so dragging a slider doesn't flood the API.

## Getting started

Requirements: Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> On Windows PowerShell, if script execution is blocked, use `npm.cmd` instead of `npm`.

### Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the development server     |
| `npm run build` | Create a production build        |
| `npm run start` | Serve the production build       |
| `npm test`      | Run the color adjustment tests   |

### Environment variables

| Variable               | Description                                                                                   | Default                 |
| ---------------------- | --------------------------------------------------------------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used for canonical and Open Graph URLs. Set this when you deploy. | `http://localhost:3000` |

## Project structure

```text
app/
  layout.tsx            Root layout, Bootstrap CSS, metadata and viewport
  page.tsx              Home page
  globals.css           Custom styles (sliders, preview, layout)
  icon.svg              App icon / favicon
  manifest.ts           Web app manifest
  opengraph-image.tsx   Generated social sharing image
components/
  ColorPicker.tsx       Main app UI and state
  ChannelSlider.tsx     Single RGB channel: lock switch, number input and slider
  CopyField.tsx         Read-only value with a copy button
lib/
  color.ts              Color helpers (HEX/HSL/OKLCH conversion, step logic, contrast)
  site.ts               Site name, description and URL
```

## License

This project doesn't include a license yet.
