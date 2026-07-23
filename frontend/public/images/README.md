# Photos needed

The site currently shows labeled placeholders instead of real photos (see
`src/components/public/PhotoPlaceholder.jsx`). Drop real photos into this
folder with these exact filenames and they'll show up automatically — no
code changes needed for the ones listed below the menu items.

| Filename                       | Used on             | Suggested shot                                                                                                                                                             |
| ------------------------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hero-food-spread.jpg`         | Home (hero)         | Wide shot of a full table spread — banchan, a hot stone bowl, barley tea. This is the first thing visitors see, so it should be the most appetizing single photo you have. |
| `an-family-interior.jpg`       | Home (story teaser) | The dining room, ideally with people in it                                                                                                                                 |
| `restaurant-history-1980s.jpg` | About               | An old photo if you have one, or a current shot styled to feel timeless                                                                                                    |
| `an-family-portrait.jpg`       | About               | A portrait of the An family                                                                                                                                                |
| `dining-room-interior.jpg`     | About               | Another interior shot, different angle than the home page one                                                                                                              |

**Menu item photos** are named automatically from each dish's English name,
lowercased with spaces replaced by dashes — e.g. an item named "Kimbap"
expects `menu-kimbap.jpg`. Check the Menu page in the browser to see exactly
which filenames it's currently looking for.

## Swapping a placeholder for a real photo

In the relevant page file, replace:

```jsx
<PhotoPlaceholder filename="hero-food-spread.jpg" alt="..." aspectRatio="16 / 9" />
```

with:

```jsx
<img
  src="/images/hero-food-spread.jpg"
  alt="..."
  style={{
    width: '100%',
    aspectRatio: '16 / 9',
    objectFit: 'cover',
    borderRadius: 'var(--radius-md)',
  }}
/>
```

Keep photos reasonably compressed (aim under ~300KB each) so the site stays fast.
