// This is your product "database" for now — plain data, no JSX.
// Add a new product = add one object here. Nothing else needs to change.
// Once Supabase is wired up, this array can be replaced by a fetch call
// that returns rows in this same shape — ProductCard won't need to change.
//
// "image" can be either:
//   1. A URL to an image/GIF you found and are allowed to use, e.g.
//      "https://example.com/some-image.gif"
//   2. A local file you download yourself into src/assets/products/
//      and import at the top of this file, e.g.:
//        import windowsImg from "../../assets/products/windows.png";
//      then use `image: windowsImg` below instead of a string URL.
//
// Local imports are usually the safer/faster option — no dependency on
// an external site staying online, and Vite will bundle/optimize them.

const products = [
  {
    id: 1,
    name: "Windows 11 Pro Key",
    price: 15,
    description: "Genuine lifetime license, instant delivery via email.",
    image: "https://placehold.co/400x300/1f1330/a855f7?text=Windows+11",
    badge: "Popular",
    inStock: true,
  },
  {
    id: 2,
    name: "Netflix Premium (1 Month)",
    price: 6,
    description: "4K streaming, 4 screens, shared account access.",
    image: "https://placehold.co/400x300/1f1330/a855f7?text=Netflix",
    inStock: true,
  },
  {
    id: 3,
    name: "Steam Wallet $20",
    price: 21,
    description: "Digital gift card code, redeemable instantly.",
    image: "https://placehold.co/400x300/1f1330/a855f7?text=Steam",
    badge: "Best Value",
    inStock: true,
  },
  {
    id: 4,
    name: "Canva Pro (1 Year)",
    price: 12,
    description: "Full Pro features, activated on your own account.",
    image: "https://placehold.co/400x300/1f1330/a855f7?text=Canva",
    inStock: false,
  },
];

export default products;
