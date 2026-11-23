import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_guess11_icon():
    size = 1024
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Background Rounded Squircle
    bg_pad = 40
    bg_box = [bg_pad, bg_pad, size - bg_pad, size - bg_pad]
    corner_radius = 230

    # Draw radial gradient on background
    bg_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg_img)
    bg_draw.rounded_rectangle(bg_box, radius=corner_radius, fill=(9, 13, 22, 255))

    # Center glow
    glow_center_x, glow_center_y = size // 2, size // 2 - 40
    for r in range(350, 0, -5):
        alpha = int(70 * (1 - r / 350))
        glow_draw = ImageDraw.Draw(bg_img)
        glow_box = [glow_center_x - r, glow_center_y - r, glow_center_x + r, glow_center_y + r]
        # Soft purple/indigo radial tint
        glow_draw.ellipse(glow_box, fill=(30, 27, 75, alpha))

    # Mask radial glow to squircle
    mask = Image.new('L', (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(bg_box, radius=corner_radius, fill=255)
    img.paste(bg_img, (0, 0), mask)

    # 2. Glowing Neon Border Gradient
    border_width = 16
    for i in range(border_width):
        t = i / border_width
        # Interpolate neon cyan to purple to amber
        color = (
            int(6 + (245 - 6) * t),
            int(182 - 80 * t),
            int(212 + (36 - 212) * t),
            int(220 * (1 - t * 0.3))
        )
        b_box = [bg_pad + i, bg_pad + i, size - bg_pad - i, size - bg_pad - i]
        draw.rounded_rectangle(b_box, radius=corner_radius - i, outline=color, width=2)

    # 3. Dynamic Colorful Paint Splashes & Glow Dots
    dots = [
        (180, 210, 22, (0, 229, 255, 220)),
        (130, 310, 14, (56, 189, 248, 200)),
        (840, 230, 24, (255, 145, 0, 230)),
        (890, 320, 15, (251, 191, 36, 200)),
        (210, 800, 18, (168, 85, 247, 210)),
        (810, 780, 20, (236, 72, 153, 220)),
        (160, 480, 10, (244, 63, 94, 190)),
        (860, 490, 12, (34, 197, 94, 210)),
    ]
    for x, y, r, c in dots:
        draw.ellipse([x - r, y - r, x + r, y + r], fill=c)

    # Sparkle Stars
    def draw_star(cx, cy, s, color=(255, 255, 255, 230)):
        p = [
            (cx, cy - s), (cx + s * 0.25, cy - s * 0.25),
            (cx + s, cy), (cx + s * 0.25, cy + s * 0.25),
            (cx, cy + s), (cx - s * 0.25, cy + s * 0.25),
            (cx - s, cy), (cx - s * 0.25, cy - s * 0.25)
        ]
        draw.polygon(p, fill=color)

    draw_star(230, 290, 28)
    draw_star(790, 310, 24)
    draw_star(512, 140, 32)
    draw_star(750, 700, 20)

    # 4. Center 3D Neon "11" Badge
    badge_w, badge_h = 320, 300
    badge_x = (size - badge_w) // 2
    badge_y = 190
    badge_box = [badge_x, badge_y, badge_x + badge_w, badge_y + badge_h]
    badge_radius = 80

    # Badge drop shadow
    shadow_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_img)
    s_draw.rounded_rectangle([badge_x, badge_y + 15, badge_x + badge_w, badge_y + badge_h + 15], radius=badge_radius, fill=(0, 0, 0, 180))
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(16))
    img.paste(shadow_img, (0, 0), shadow_img)

    # Badge background
    draw.rounded_rectangle(badge_box, radius=badge_radius, fill=(13, 17, 28, 255))
    # Badge glowing gradient border
    for j in range(8):
        border_col = (
            int(255 - j * 15),
            int(110 + j * 12),
            int(0 + j * 28),
            240 - j * 20
        )
        draw.rounded_rectangle([badge_x + j, badge_y + j, badge_x + badge_w - j, badge_y + badge_h - j], radius=badge_radius - j, outline=border_col, width=2)

    # Draw Giant Glossy "11" inside badge
    font_impact_huge = ImageFont.truetype('C:/Windows/Fonts/impact.ttf', 240)
    text_11 = "11"
    bbox_11 = draw.textbbox((0, 0), text_11, font=font_impact_huge)
    tw_11, th_11 = bbox_11[2] - bbox_11[0], bbox_11[3] - bbox_11[1]
    tx_11 = badge_x + (badge_w - tw_11) // 2 - bbox_11[0]
    ty_11 = badge_y + (badge_h - th_11) // 2 - bbox_11[1] - 15

    # 11 3D Shadow
    draw.text((tx_11 + 6, ty_11 + 8), text_11, font=font_impact_huge, fill=(0, 0, 0, 200))
    # 11 Golden gradient fill
    draw.text((tx_11, ty_11), text_11, font=font_impact_huge, fill=(255, 230, 110, 255))
    # Highlight
    draw.text((tx_11 - 2, ty_11 - 2), text_11, font=font_impact_huge, fill=(255, 255, 255, 180))

    # 5. Bold "GUESS" Text Banner
    font_guess = ImageFont.truetype('C:/Windows/Fonts/impact.ttf', 160)
    text_guess = "GUESS"
    bbox_g = draw.textbbox((0, 0), text_guess, font=font_guess)
    tw_g, th_g = bbox_g[2] - bbox_g[0], bbox_g[3] - bbox_g[1]
    tx_g = (size - tw_g) // 2 - bbox_g[0]
    ty_g = 550

    # GUESS Text Shadow
    draw.text((tx_g + 8, ty_g + 12), text_guess, font=font_guess, fill=(0, 0, 0, 230))
    # Cyan/Neon Glow
    draw.text((tx_g, ty_g), text_guess, font=font_guess, fill=(0, 229, 255, 255))
    # Inner Bright Text
    font_guess_inner = ImageFont.truetype('C:/Windows/Fonts/impact.ttf', 156)
    draw.text((tx_g + 2, ty_g + 2), text_guess, font=font_guess_inner, fill=(224, 255, 255, 255))

    # 6. Stylized Paint Brush (crossing in front)
    brush_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(brush_img)

    # Curved Paint Wave beneath GUESS
    arc_box = [160, 680, 864, 820]
    b_draw.arc(arc_box, start=10, end=170, fill=(255, 145, 0, 240), width=18)
    b_draw.arc([160, 684, 864, 824], start=10, end=170, fill=(255, 255, 255, 220), width=4)

    # Brush ferrule & bristles
    bx, by = 760, 640
    # Ferrule (Silver)
    b_draw.polygon([(bx - 12, by - 40), (bx + 12, by - 40), (bx + 8, by + 10), (bx - 8, by + 10)], fill=(203, 213, 225, 255))
    # Bristles (Golden Orange)
    b_draw.polygon([(bx - 8, by + 10), (bx + 8, by + 10), (bx, by + 45)], fill=(245, 158, 11, 255))
    # Paint drip tip
    b_draw.ellipse([bx - 6, by + 40, bx + 6, by + 52], fill=(0, 229, 255, 255))
    # Handle (Purple Gradient)
    b_draw.polygon([(bx - 10, by - 40), (bx + 10, by - 40), (bx + 6, by - 140), (bx - 6, by - 140)], fill=(168, 85, 247, 255))

    # Paste Brush with rotation
    brush_img = brush_img.rotate(-25, center=(bx, by), resample=Image.Resampling.BICUBIC)
    img.paste(brush_img, (0, 0), brush_img)

    # 7. Subtitle Pill: "SCORE 11"
    pill_w, pill_h = 420, 64
    pill_x = (size - pill_w) // 2
    pill_y = 780
    draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=32, fill=(13, 20, 36, 240), outline=(0, 229, 255, 200), width=3)

    font_sub = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 32)
    text_sub = "DRAW IT  •  SCORE 11"
    bbox_sub = draw.textbbox((0, 0), text_sub, font=font_sub)
    tw_sub, th_sub = bbox_sub[2] - bbox_sub[0], bbox_sub[3] - bbox_sub[1]
    tx_sub = pill_x + (pill_w - tw_sub) // 2 - bbox_sub[0]
    ty_sub = pill_y + (pill_h - th_sub) // 2 - bbox_sub[1]
    draw.text((tx_sub, ty_sub), text_sub, font=font_sub, fill=(0, 229, 255, 255))

    return img

def create_adaptive_foreground(full_icon):
    # Android Adaptive icon canvas is 108dp x 108dp, inner safe zone is 72dp (diameter 66-72%)
    # Foreground must have transparent background and artwork centered in safe zone.
    size = 1024
    fg = Image.new('RGBA', (size, size), (0, 0, 0, 0))

    # Scale full icon to 70% to fit perfectly within the circular/squircle mask
    scale_factor = 0.72
    new_w = int(size * scale_factor)
    new_h = int(size * scale_factor)
    scaled_icon = full_icon.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # Paste centered
    offset_x = (size - new_w) // 2
    offset_y = (size - new_h) // 2
    fg.paste(scaled_icon, (offset_x, offset_y), scaled_icon)
    return fg

def main():
    print("🎨 Generating GUESS 11 app icons...")
    full_icon = create_guess11_icon()

    # Save master 1024x1024 and 512x512
    os.makedirs('frontend/public/images', exist_ok=True)
    full_icon.resize((512, 512), Image.Resampling.LANCZOS).save('frontend/public/images/logo.png', 'PNG')
    full_icon.resize((512, 512), Image.Resampling.LANCZOS).save('frontend/public/icon-512.png', 'PNG')
    full_icon.resize((192, 192), Image.Resampling.LANCZOS).save('frontend/public/icon-192.png', 'PNG')

    # Generate Adaptive Icon Foreground
    fg_icon = create_adaptive_foreground(full_icon)

    # Densities for Android
    # 1. Launcher icons (legacy square and round)
    launcher_sizes = {
        'mdpi': 48,
        'hdpi': 72,
        'xhdpi': 96,
        'xxhdpi': 144,
        'xxxhdpi': 192,
    }

    # 2. Adaptive Foreground sizes (108dp)
    fg_sizes = {
        'mdpi': 108,
        'hdpi': 162,
        'xhdpi': 216,
        'xxhdpi': 324,
        'xxxhdpi': 432,
    }

    res_dir = 'frontend/android/app/src/main/res'

    for density, sz in launcher_sizes.items():
        folder = os.path.join(res_dir, f'mipmap-{density}')
        os.makedirs(folder, exist_ok=True)

        # ic_launcher.png (squircle)
        sq_icon = full_icon.resize((sz, sz), Image.Resampling.LANCZOS)
        sq_icon.save(os.path.join(folder, 'ic_launcher.png'), 'PNG')

        # ic_launcher_round.png (circle mask)
        circle_mask = Image.new('L', (sz, sz), 0)
        ImageDraw.Draw(circle_mask).ellipse([0, 0, sz, sz], fill=255)
        round_icon = Image.new('RGBA', (sz, sz), (0, 0, 0, 0))
        round_icon.paste(sq_icon, (0, 0), circle_mask)
        round_icon.save(os.path.join(folder, 'ic_launcher_round.png'), 'PNG')

    for density, sz in fg_sizes.items():
        folder = os.path.join(res_dir, f'mipmap-{density}')
        os.makedirs(folder, exist_ok=True)
        # ic_launcher_foreground.png
        fg_scaled = fg_icon.resize((sz, sz), Image.Resampling.LANCZOS)
        fg_scaled.save(os.path.join(folder, 'ic_launcher_foreground.png'), 'PNG')

    print("✅ All Android launcher and adaptive icons generated successfully!")

    # 3. Generate Android Splash Screens with Guess 11 branding
    splash_sizes = {
        'drawable-port-mdpi': (320, 480),
        'drawable-port-hdpi': (480, 800),
        'drawable-port-xhdpi': (720, 1280),
        'drawable-port-xxhdpi': (960, 1600),
        'drawable-port-xxxhdpi': (1280, 1920),
        'drawable-land-mdpi': (480, 320),
        'drawable-land-hdpi': (800, 480),
        'drawable-land-xhdpi': (1280, 720),
        'drawable-land-xxhdpi': (1600, 960),
        'drawable-land-xxxhdpi': (1920, 1280),
        'drawable': (480, 800),
    }

    bg_color = (9, 13, 22, 255) # Deep navy/black theme color

    for folder_name, (w, h) in splash_sizes.items():
        splash_dir = os.path.join(res_dir, folder_name)
        os.makedirs(splash_dir, exist_ok=True)
        splash_img = Image.new('RGBA', (w, h), bg_color)

        # Determine logo size (about 40% of the smaller dimension, at least 160px)
        min_dim = min(w, h)
        logo_sz = max(160, int(min_dim * 0.45))
        scaled_logo = full_icon.resize((logo_sz, logo_sz), Image.Resampling.LANCZOS)

        pos_x = (w - logo_sz) // 2
        pos_y = (h - logo_sz) // 2
        splash_img.paste(scaled_logo, (pos_x, pos_y), scaled_logo)
        splash_img.save(os.path.join(splash_dir, 'splash.png'), 'PNG')

    print("✅ All Android splash screens updated with Guess 11 branding!")

if __name__ == '__main__':
    main()
