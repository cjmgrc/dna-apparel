# dna-apparel

Futuristic apparel storefront (shop, filters, product pages, saved items, bag with promo DNA10, checkout, help) built with [Cajoa](https://cajoats.github.io/Cajoa/).

```
cd web
npm install
npm run dev
```

- `/` Discover, `/shop`, `/product/:id`, `/wishlist`, `/info`
- `/categories` and `/categories/:slug`: category list and products
- `/login` only opens when a guest taps Order (`requestOrder` in `src/state.ts`), then returns to `/checkout`
- Sign-in and orders are simulated. Replace the timeout in `src/pages/Login.tsx` with your API call.
- Products live in `src/data.ts`.
