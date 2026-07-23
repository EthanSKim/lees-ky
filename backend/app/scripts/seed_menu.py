"""Seed the database with Lee's actual printed menu.

Transcribed directly from photos of the restaurant's physical menu (dinner
entrees + desserts, lunch special, and appetizers/sides pages). Replaces
whatever categories/items currently exist - this is meant to be run once
to load the real menu in place of placeholder/test data.

Per the owner's request: the menu's "recommend popular dish" star markers
are not tracked as their own field (no schema field for it), and rather
than using the app's 1-6 spice_level scale, spicy items are marked the
same simple way the printed menu does it - a chili emoji appended directly
to the item name. A handful of the menu's own starred "recommended" dishes
(Galbi, Bulgogi, Japchae, Bibimbap, Jambong, Kimchi-jji-gae) are marked
`is_featured` by default so the homepage isn't empty out of the box - the
owner can change this pick anytime through the admin panel. Photos are
intentionally left unset for all items; the owner uploads those separately.

Usage:
    python -m app.scripts.seed_menu           # prompts for confirmation
    python -m app.scripts.seed_menu --yes      # skips the confirmation
"""

import argparse

from app.database import SessionLocal
from app.models import MenuCategory, MenuItem

SPICY = "🌶️"

# Each category is (name, [items]). Each item is a dict of MenuItem fields
# minus category_id/display_order/image_url/is_featured/spice_level/
# is_available, which are filled in by the loader below. `spicy=True`
# appends the chili emoji to name_en at load time, matching how the
# printed menu marks it. `featured=True` sets is_featured (used to pick a
# default set of homepage highlights; most items omit this key entirely).

CATEGORIES = [
    (
        "Lunch Special",
        [
            dict(
                name_en="Japchae",
                name_kr="잡채",
                price=12.00,
                description="Stir-fried sweet potato noodles and vegetables with meat. Choose from beef, chicken, pork, or tofu; $3 for shrimp.",
            ),
            dict(
                name_en="Bibim Deopbap",
                name_kr="비빔덮밥",
                price=12.00,
                description="Stir-fried meat and vegetables served over rice and topped with spicy sauce. Choose from beef, chicken, pork, or tofu; $3 for shrimp.",
                spicy=True,
            ),
            dict(
                name_en="Rajogi",
                name_kr="라조기",
                price=12.00,
                description="Boneless chicken nuggets fried and stir-fried with vegetables in a sweet sauce.",
            ),
            dict(
                name_en="Deopbap",
                name_kr="덮밥",
                price=12.00,
                description="Stir-fried vegetables with meat. Choose from beef, chicken, pork, or tofu; $3 for shrimp.",
            ),
            dict(
                name_en="Almond Deopbap",
                price=12.00,
                description="Stir-fried vegetables with meat. Choose from beef, chicken, pork, or tofu; $3 for shrimp.",
            ),
            dict(
                name_en="Bibimbap",
                name_kr="비빔밥",
                price=12.00,
                description="Meat, bean sprouts, cucumber, radish, carrot, spinach, and fried egg served on steamed rice, with spicy red pepper paste served as a side to mix in. Choose from beef, chicken, pork, or tofu; $3 for shrimp.",
                spicy=True,
            ),
            dict(
                name_en="Jambong",
                name_kr="짬뽕",
                price=13.00,
                description="Thick noodles, mussels, shrimp, squid, and vegetables in spicy broth.",
                spicy=True,
            ),
            dict(
                name_en="Udong",
                name_kr="우동",
                price=13.00,
                description="Thick noodles, mussels, shrimp, squid, and vegetables in mild broth.",
            ),
            dict(
                name_en="Ramen Soup",
                name_kr="라면",
                price=12.00,
                description="Choose from vegetables, beef, chicken, pork, or tofu; $3 for shrimp.",
            ),
            dict(
                name_en="Bulgogi",
                name_kr="불고기",
                price=13.00,
                description="Marinated thinly sliced beef, pan-fried with vegetables.",
            ),
            dict(
                name_en="Yuk-gae-jang",
                name_kr="육개장",
                price=13.00,
                description="Shredded beef stewed with spicy seasoning and vegetables in beef bone broth, served with egg and clear noodles.",
                spicy=True,
            ),
            dict(
                name_en="Dumpling Soup",
                name_kr="만두국",
                price=12.00,
                description="Soup made by boiling seasonings and dumplings in beef bone broth, topped with beef, scallion, and egg.",
            ),
            dict(
                name_en="Tteok-mando-guk",
                name_kr="떡만두국",
                price=12.00,
                description="A soup made by boiling seasonings, sliced rice cake, and dumplings in beef bone broth, topped with beef, scallion, and egg.",
            ),
            dict(
                name_en="Soft Tofu Stew",
                name_kr="순두부찌개",
                price=12.00,
                description="Beef bone broth stewed with spicy seasoning, shrimp, soft tofu, and vegetables.",
                spicy=True,
            ),
            dict(
                name_en="Fermented Soy Bean Paste Stew",
                name_kr="청국장찌개",
                price=12.00,
                description="Stewed with fermented beans and vegetables in spicy seasoned broth.",
                spicy=True,
            ),
            dict(
                name_en="Fermented Black Soy Bean Paste Stew",
                name_kr="흑청국장찌개",
                price=12.00,
                description="Stewed with fermented black beans and vegetables in spicy seasoned broth.",
                spicy=True,
            ),
            dict(
                name_en="Seol-leong-tang",
                name_kr="설렁탕",
                price=12.00,
                description="Beef bone broth boiled with thin shank of beef, topped with scallion.",
            ),
            dict(
                name_en="Sweet and Sour",
                name_kr="탕수육",
                price=12.00,
                description="Deep fried shredded meat mixed with fruit and sweet sour sauce. Choose from chicken or pork.",
            ),
            dict(
                name_en="Soy Bean Paste Stew",
                name_kr="된장찌개",
                price=12.00,
                description="Bean bone broth with vegetables and spicy sauce.",
                spicy=True,
            ),
            dict(
                name_en="Fried Rice",
                name_kr="볶음밥",
                price=12.00,
                description="Broccoli, carrots, and egg. Choose from beef, chicken, pork, or tofu; $3 for shrimp.",
            ),
        ],
    ),
    (
        "Appetizer",
        [
            dict(
                name_en="Seafood Pancake",
                name_kr="해물파전",
                price=16.00,
                description="Korean pancake with squid, egg, crabmeat, shrimp, mussels, and scallion. Served with soy sauce.",
            ),
            dict(
                name_en="Kimchi Pancake",
                name_kr="김치전",
                price=16.00,
                description="Korean pancake with kimchi, onion, and egg.",
            ),
            dict(
                name_en="Vegetable Pancake",
                name_kr="녹두전",
                price=16.00,
                description="Korean pancake with mung bean, onion, scallion, carrots, and cabbage.",
            ),
            dict(
                name_en="Deep Fried Wonton (10pcs)",
                name_kr="튀김만두",
                price=12.00,
                description="Served with beef, onion, carrots, cabbage, and scallion.",
            ),
            dict(
                name_en="Tofu with Sauce",
                name_kr="양념두부",
                price=12.00,
                description="Griddled fried tofu with sauce, scallion, sesame seed, and soy sauce.",
            ),
            dict(
                name_en="Tofu Kimchi",
                name_kr="두부김치",
                price=12.00,
                description="Griddled fried tofu with kimchi, sesame seed, and spicy sauce.",
                spicy=True,
            ),
            dict(
                name_en="Edamame",
                name_kr="풋콩",
                price=6.00,
                description="Served steamed.",
            ),
            dict(
                name_en="Vegetable Tempura",
                name_kr="야채튀김",
                price=12.00,
                description="Served with scallion, onion, cabbage, and carrots.",
            ),
            dict(
                name_en="Egg Rolls (2pcs)",
                name_kr="에그롤",
                price=6.00,
                description="Served with beef, onion, cabbage, celery, and carrots.",
            ),
            dict(
                name_en="Vegetable Egg Rolls (4pcs)",
                name_kr="야채 에그롤",
                price=6.00,
                description="Served with cabbage, celery, and carrots.",
            ),
            dict(
                name_en="Wonton Soup",
                price=6.00,
                description="Chicken broth with scallion, onion, celery, cabbage, and dumplings.",
            ),
            dict(
                name_en="Egg Drop Soup",
                price=6.00,
                description="Chicken broth with egg, scallion, onion, celery, and carrots.",
            ),
            dict(
                name_en="Oriental Salad",
                price=7.00,
                description="Served with spinach and bean sprouts.",
            ),
            dict(
                name_en="Hot & Sour Soup",
                price=6.00,
                description="Chicken broth with egg, scallion, onion, carrots, celery, cabbage, and spicy pepper.",
                spicy=True,
            ),
            dict(
                name_en="Tteok-bok-ki (Stir-Fried Rice Cake)",
                name_kr="떡볶이",
                price=18.00,
                description="Pan-fried rice cake with vegetables, sesame seed, and spicy pepper paste sauce.",
                spicy=True,
            ),
        ],
    ),
    (
        "Stir Fried",
        [
            dict(
                name_en="Fried Rice",
                name_kr="볶음밥",
                price=17.00,
                description="Broccoli, carrots, and egg. Choose from beef, chicken, pork, or tofu; $3 for shrimp, $7 for all.",
            ),
            dict(
                name_en="Fried Rice (Kid's Menu)",
                name_kr="볶음밥",
                price=10.00,
                description="Broccoli, carrots, and egg. Up to 10 years old. Choose from beef, chicken, pork, or tofu; $3 for shrimp, $5 for all.",
            ),
            dict(
                name_en="Sweet and Sour Meat",
                name_kr="탕수육",
                price=18.00,
                description="Deep fried shredded meat mixed with fruit and sweet sour sauce. Choose from chicken or pork.",
            ),
            dict(
                name_en="Almond Deopbap",
                price=18.00,
                description="Stir-fried vegetables with meat. Choose from beef, chicken, pork, or tofu; $3 for shrimp.",
            ),
            dict(
                name_en="Rajogi",
                name_kr="라조기",
                price=18.00,
                description="Boneless chicken nuggets fried and stir-fried with vegetables in a sweet sauce.",
            ),
            dict(
                name_en="Gan-pung-gi",
                name_kr="간풍기",
                price=19.00,
                description="Boneless chicken nuggets fried and stir-fried with sweet sauce and sesame seeds.",
            ),
            dict(
                name_en="Deopbap",
                name_kr="덮밥",
                price=18.00,
                description="Stir-fried vegetables with meat.",
            ),
            dict(
                name_en="Japchae",
                name_kr="잡채",
                price=18.00,
                description="Stir-fried sweet potato noodles and vegetables with meat. Choose from beef, chicken, pork, or tofu; $3 for shrimp.",
                featured=True,
            ),
        ],
    ),
    (
        "Noodles Soup",
        [
            dict(
                name_en="Jambong",
                name_kr="짬뽕",
                price=18.00,
                description="Thick noodles, mussels, shrimp, squid, and vegetables in spicy broth.",
                spicy=True,
                featured=True,
            ),
            dict(
                name_en="Ja-jang-myun",
                name_kr="짜장면",
                price=18.00,
                description="Thick noodles, beef, and vegetables in black bean sauce.",
            ),
            dict(
                name_en="Udong",
                name_kr="우동",
                price=18.00,
                description="Thick noodles, mussels, shrimp, squid, and vegetables in mild broth.",
            ),
            dict(
                name_en="Bibim Naeng-myeon",
                name_kr="비빔냉면",
                price=18.00,
                description="Buckwheat noodles mixed in spicy hot sauce, topped with sliced half egg, radish, carrots, sesame seed, and shredded cucumber. Served cold.",
                spicy=True,
            ),
            dict(
                name_en="Ramen Soup",
                name_kr="라면",
                price=15.00,
                description="Choose from vegetables, beef, chicken, pork, or tofu; $3 for shrimp.",
            ),
            dict(
                name_en="Soy Bean Paste Stew",
                name_kr="된장찌개",
                price=18.00,
                description="Bean bone broth with vegetables and spicy sauce.",
                spicy=True,
            ),
        ],
    ),
    (
        "Sizzling Platters",
        [
            dict(
                name_en="Galbi",
                name_kr="갈비",
                price=27.00,
                description="Marinated beef short ribs, grilled.",
                featured=True,
            ),
            dict(
                name_en="Bulgogi",
                name_kr="불고기",
                price=20.00,
                description="Marinated thinly sliced beef, pan-fried with vegetables.",
                featured=True,
            ),
            dict(
                name_en="Pork Bulgogi",
                name_kr="돼지불고기",
                price=20.00,
                description="Marinated thinly sliced pork, grilled with vegetables.",
            ),
            dict(
                name_en="Chicken Bulgogi",
                name_kr="닭불고기",
                price=20.00,
                description="Marinated thinly sliced chicken, grilled with vegetables.",
            ),
            dict(
                name_en="Squid Pan Fried",
                name_kr="오징어볶음",
                price=21.00,
                description="Pan-fried squid with vegetables and sesame seed in spicy sauce.",
                spicy=True,
            ),
            dict(
                name_en="Seafood Pan Fried",
                name_kr="해물볶음",
                price=22.00,
                description="Pan-fried shrimp, squid, and scallops with vegetables.",
            ),
            dict(
                name_en="Pork Pan Fried",
                name_kr="제육볶음",
                price=20.00,
                description="Pan-fried thinly sliced pork with vegetables and sesame seed in spicy sauce.",
                spicy=True,
            ),
            dict(
                name_en="Mackerel Broiled",
                name_kr="고등어구이",
                price=21.00,
                description="Broiled mackerel seasoned with salt.",
            ),
        ],
    ),
    (
        "Hot Pot (for two)",
        [
            dict(
                name_en="Seafood Hot Pot",
                name_kr="해물전골",
                price=48.00,
                description="Cod, mussels, shrimp, noodles, rice cake, scallops, and vegetables simmered in a spicy marinated broth, served in a hot pot.",
                spicy=True,
            ),
            dict(
                name_en="Goat Hot Pot",
                name_kr="사철전골",
                price=48.00,
                description="Sliced goat meat in goat bone broth with spicy seasoning, sesame leaves, vegetables, rice cake, and noodles, served in a hot pot.",
                spicy=True,
            ),
            dict(
                name_en="Bulgogi Hot Pot",
                name_kr="불고기전골",
                price=48.00,
                description="Beef bone stock with lightly sweetened seasoning, thinly sliced beef, sweet potato noodles, rice cake, and vegetables, served in a hot pot.",
            ),
            dict(
                name_en="Spicy Chicken Hot Pot",
                name_kr="닭한마리전골",
                price=48.00,
                description="Thin chicken, potato, rice cake, and vegetables simmered in a spicy marinated broth, served in a hot pot.",
                spicy=True,
            ),
            dict(
                name_en="Kimchi Hot Pot",
                name_kr="김치전골",
                price=48.00,
                description="Kimchi, beef, tofu, rice cake, and vegetables simmered in a spicy broth, served in a hot pot.",
                spicy=True,
            ),
        ],
    ),
    (
        "Soup and Stew",
        [
            dict(
                name_en="Galbi-tang",
                name_kr="갈비탕",
                price=23.00,
                description="Short ribs stewed in beef bone broth with egg, vegetables, and sweet potato noodles.",
            ),
            dict(
                name_en="Yuk-gae-jang",
                name_kr="육개장",
                price=19.00,
                description="Shredded beef stewed with spicy seasoning and vegetables in beef bone broth, served with egg and clear noodles.",
                spicy=True,
            ),
            dict(
                name_en="Dumpling Soup",
                name_kr="만두국",
                price=18.00,
                description="Soup made by boiling seasonings and dumplings in beef bone broth, topped with beef, scallion, and egg.",
            ),
            dict(
                name_en="Tteok-mando-guk",
                name_kr="떡만두국",
                price=18.00,
                description="A soup made by boiling seasonings, sliced rice cake, and dumplings in beef bone broth, topped with beef, scallion, and egg.",
            ),
            dict(
                name_en="Soft Tofu Stew",
                name_kr="순두부찌개",
                price=18.00,
                description="Beef bone broth stewed with spicy seasoning, shrimp, soft tofu, and vegetables.",
                spicy=True,
            ),
            dict(
                name_en="Fermented Soy Bean Paste Stew",
                name_kr="청국장찌개",
                price=18.00,
                description="Stewed with fermented beans and vegetables in spicy seasoned broth.",
                spicy=True,
            ),
            dict(
                name_en="Fermented Black Soy Bean Paste Stew",
                name_kr="흑청국장찌개",
                price=18.00,
                description="Stewed with fermented black beans and vegetables in spicy seasoned broth.",
                spicy=True,
            ),
            dict(
                name_en="Kimchi-jji-gae",
                name_kr="김치찌개",
                price=18.00,
                description="Stewed with kimchi, beef, tofu, and vegetables in spicy seasoned broth.",
                spicy=True,
                featured=True,
            ),
            dict(
                name_en="Dae-gu-maeun-tang",
                name_kr="대구매운탕",
                price=20.00,
                description="Stewed with cod, tofu, shrimp, mussels, and vegetables in spicy seasoned broth.",
                spicy=True,
            ),
            dict(
                name_en="Dae-gu-jiri-tang",
                name_kr="대구지리탕",
                price=20.00,
                description="Stewed with cod, tofu, shrimp, mussels, and vegetables in mild seasoned broth.",
            ),
            dict(
                name_en="Sah-cheol-tang",
                name_kr="사철탕",
                price=20.00,
                description="Goat bone broth spicy stew with sesame leaf, vegetables, and soft tofu, served with a spicy side dish.",
                spicy=True,
            ),
            dict(
                name_en="Spicy Chicken Stew with Vegetables",
                name_kr="닭도리탕",
                price=18.00,
                description="Spicy chicken nuggets and vegetables boiled in rich chicken broth.",
                spicy=True,
            ),
            dict(
                name_en="Seol-leong-tang",
                name_kr="설렁탕",
                price=18.00,
                description="Beef bone broth boiled with thin shank of beef and sweet potato noodles, topped with scallion.",
            ),
        ],
    ),
    (
        "Rice Dishes",
        [
            dict(
                name_en="Bibimbap",
                name_kr="비빔밥",
                price=18.00,
                description="Meat, bean sprouts, cucumber, radish, carrot, spinach, and fried egg served on steamed rice, with spicy red pepper paste served as a side to mix in. Choose from beef, chicken, pork, or tofu; $3 for shrimp.",
                spicy=True,
                featured=True,
            ),
            dict(
                name_en="Bibim Deopbap",
                name_kr="비빔덮밥",
                price=18.00,
                description="Stir-fried meat and vegetables served over rice and topped with spicy sauce. Choose from beef, chicken, pork, or tofu; $3 for shrimp.",
                spicy=True,
            ),
            dict(
                name_en="Hot Stone Bibimbap",
                name_kr="뜨근돌비빔밥",
                price=19.00,
                description="Meat, bean sprouts, cucumber, radish, spinach, and fried egg served on steamed rice in a hot stone pot, with spicy red pepper paste served as a side to mix in. Choose from beef, chicken, pork, or tofu; $3 for shrimp.",
                spicy=True,
            ),
            dict(
                name_en="Hot Stone Japchae Deopbap",
                name_kr="뜨근돌잡채덮밥",
                price=19.00,
                description="Stir-fried meat and sweet potato noodles in a frying pan, served over steamed rice in a stone pot with spicy sauce on top.",
                spicy=True,
            ),
            dict(
                name_en="Squid Hot Stone",
                name_kr="오징어뜨근돌",
                price=21.00,
                description="Stir-fried squid and vegetables placed on top of rice in a stone pot, served with sesame seeds.",
            ),
            dict(
                name_en="Bulgogi Hot Stone",
                name_kr="불고기뜨근돌",
                price=20.00,
                description="Stir-fried beef and vegetables placed on top of rice in a stone pot, served with sesame seeds.",
            ),
            dict(
                name_en="Bulgogi-Kimchi Hot Stone",
                name_kr="불고기김치돌",
                price=20.00,
                description="Stir-fried beef and kimchi placed on top of rice in a stone pot, served with sesame seeds.",
            ),
        ],
    ),
    (
        "Desserts",
        [
            dict(
                name_en="Boong-a-bbang Ice Cream",
                price=6.00,
                description="Fish-shaped bun ice cream.",
            ),
            dict(
                name_en="Mochi Ice Cream (4pcs)",
                price=6.00,
            ),
        ],
    ),
    (
        "Sides & Extras",
        [
            dict(name_en="Extra Meat / Tofu", price=2.50, description="Add to a meal."),
            dict(name_en="Extra Vegetables", price=2.50, description="Add to a meal."),
            dict(name_en="Extra Egg", price=1.00, description="Add to a meal."),
            dict(name_en="Extra Shrimp", price=5.00, description="Add to a meal."),
            dict(name_en="Additional Noodles", price=5.00),
            dict(name_en="Side Dish (Banchan)", price=2.50),
            dict(name_en="Extra Rice", price=2.50),
            dict(name_en="Extra Brown Rice", price=2.50),
        ],
    ),
]


def seed(skip_confirm: bool = False):
    total_items = sum(len(items) for _, items in CATEGORIES)
    print(
        f"About to replace all menu data with {len(CATEGORIES)} categories / {total_items} items."
    )

    if not skip_confirm:
        answer = input("This deletes any existing categories/items. Continue? [y/N] ")
        if answer.strip().lower() != "y":
            print("Aborted.")
            return

    db = SessionLocal()
    try:
        # Deleting categories cascades to their items (see MenuCategory.items
        # cascade="all, delete-orphan" in app/models.py).
        db.query(MenuCategory).delete()
        db.commit()

        for cat_order, (category_name, items) in enumerate(CATEGORIES):
            category = MenuCategory(name=category_name, display_order=cat_order)
            db.add(category)
            db.flush()  # assigns category.id without a full commit

            for item_order, item_data in enumerate(items):
                spicy = item_data.pop("spicy", False)
                featured = item_data.pop("featured", False)
                name_en = item_data["name_en"]
                if spicy:
                    name_en = f"{name_en} {SPICY}"

                db.add(
                    MenuItem(
                        category_id=category.id,
                        display_order=item_order,
                        is_available=True,
                        is_featured=featured,
                        spice_level=None,
                        image_url=None,
                        **{**item_data, "name_en": name_en},
                    )
                )

        db.commit()
        print(f"Seeded {len(CATEGORIES)} categories and {total_items} items.")
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed the database with the real printed menu")
    parser.add_argument("--yes", action="store_true", help="Skip the confirmation prompt")
    args = parser.parse_args()
    seed(skip_confirm=args.yes)
