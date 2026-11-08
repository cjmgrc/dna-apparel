# DNA Apparel

Frontend for an apparel store, built with [Cajoa](https://cajoats.github.io/Cajoa/) (signals + JSX) and Vite. There is no backend: sign-in and orders are simulated in the browser.

## Run it

Requires Node.js 20 or newer.

```
cd web
npm install
npm run dev       # development server
npm run build     # production build in web/dist
npm run preview   # serve the production build
```

Single-page apps need a server fallback to `index.html` for unknown paths when you deploy.

## Pages

| Route | Page |
| --- | --- |
| `/` | Discover: banner and rows of featured products |
| `/categories` | Category tabs and every product |
| `/categories/:slug` | Same page, filtered to one category (`tees`, `hoodies`, `outerwear`, `bottoms`, `headwear`, `bags`) |
| `/checkout` | Delivery details, order summary, place order. Needs an account |
| `/login` | Sign in or create an account |

## How ordering and login work

Guests can browse and add to the bag freely. Nothing in the header links to login.

1. Adding an item shows an "Item added to your cart" popup (View cart, Check out, Continue shopping).
2. Check out, the bag's Order button and the Order now button all call `requestOrder()` in `src/state.ts`.
3. If nobody is signed in, `requestOrder()` remembers `/checkout` and opens `/login`. After signing in or creating an account, the user goes straight to checkout with the bag intact.
4. Opening `/checkout` directly as a guest also redirects to `/login`.

The bag and the signed-in user are saved in `localStorage`.

## Where to change things

| To change | Edit |
| --- | --- |
| Products, categories, prices, currency format | `src/data.ts` |
| Bag, login state, `requestOrder()` | `src/state.ts` |
| Colors, type, spacing (light and dark tokens at the top) | `src/style.css` |
| Header, footer, bag drawer, added-to-cart popup, routes | `src/App.tsx` |
| Discover page rows and banner | `src/pages/Discover.tsx` |
| Product card | `src/components/Card.tsx` |

### Product photos

Products are flat color tiles until you give them images. Add `img` (main photo) and `img2` (shown on hover) to a product in `src/data.ts`. Put the files in `web/public` and use paths like `/photos/helix-tee.jpg`.

### Connect a real backend

- Auth: replace the `setTimeout` in `src/pages/Login.tsx` with your API call, then call `signIn({ name, email })` on success.
- Orders: replace the body of `place()` in `src/pages/Checkout.tsx` with a request to your order endpoint. Payment is not collected in this frontend.
- Newsletter: the footer form in `src/App.tsx` only shows a thank-you message.

## Project layout

```
web/
  index.html
  src/
    main.tsx            entry
    App.tsx             shell and router
    state.ts            bag, user, navigation helpers
    data.ts             products and categories
    style.css           design tokens and styles
    pages/              Discover, Categories, Login, Checkout
    components/         Card, ThemeToggle
```

## Notes

- Not yet run or built: install the dependencies and check `npm run dev` first.
- Not done yet: product detail pages, quantity controls in the bag, search.
- The Cajoa router matches pathnames only, so filters use paths (`/categories/tees`), not query strings.
