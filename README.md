# Vildbyn – teasersidan

En enda sida som visar vilka vi är och att vi öppnar 2027. Vanlig HTML, CSS och JS på GitHub Pages, inget byggsteg. Gren `main` går live direkt.

Den riktiga hemsidan med webbshop, uthyrning och bokning byggs i Shopify inför öppningen. Den här sidan ersätts då.

## Struktur

| Sökväg | Vad |
| --- | --- |
| `index.html` | Hela sidan |
| `css/style.css` | All stil. Färger och typsnitt överst (`:root`) |
| `js/main.js` | Filmen i toppen: startar direkt, rullar hela tiden, suddig bakgrund på breda skärmar |
| `media/` | Filmen (`vildbyn-film-720.mp4`), suddig kopia till bakgrunden och stillbilder |
| `img/` | Logga, bilder (600 och 1200 px, webp), ikoner, delningsbild och stämpeltexturen |
| `fonts/` | Big Shoulders Display och Zilla Slab, självhostade (OFL-licens) |
| `404.html` | Sidan som visas vid fel adress |

## Ändra innehåll

- **Aktiviteterna** i listan: sök efter `VB-AVENTYR` i `index.html`. Klasserna `s1`–`s3` styr storleken.
- **Instagram och Facebook**: länkarna i foten, sök efter `VB-SOCIALA` i `index.html`.
- **Bilderna**: byt filerna i `img/` med samma namn, eller ändra `src`, `srcset` och `alt` i `index.html`. Bilderna är 3:4 stående.

## Byta filmen

Filmen ska vara stående (9:16) och visas utan ljud. På dator visas den lite inzoomad (2:3), så håll det viktiga i mitten av bilden. Gör om den med ffmpeg:

```sh
ffmpeg -i ny-film.mov -vf "scale=720:1280:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 27 -maxrate 1400k -bufsize 2800k -profile:v high -g 50 -an -movflags +faststart media/vildbyn-film-720.mp4
ffmpeg -i ny-film.mov -an -vf "scale=144:256,boxblur=6:2,scale=288:512,format=yuv420p" -c:v libx264 -preset slow -crf 30 -g 50 -movflags +faststart media/vildbyn-film-oskarp.mp4
ffmpeg -i ny-film.mov -frames:v 1 -vf "scale=720:1280" -q:v 4 media/vildbyn-film-poster.jpg
```

## Koppla vildbyn.se

1. Lägg en fil `CNAME` i roten med raden `vildbyn.se`, och byt `https://gabrielsoors-cmd.github.io/vildbyn/` mot `https://vildbyn.se/` i `index.html` (sök efter `VB-ADRESS`). Där står adressen till delningsbilden, som måste vara en fullständig adress.
2. Hos domänleverantören: A-poster för `vildbyn.se` till 185.199.108.153, 185.199.109.153, 185.199.110.153 och 185.199.111.153, och en CNAME-post för `www` till `gabrielsoors-cmd.github.io`.
3. I repots Settings → Pages: bocka i "Enforce HTTPS" när certifikatet är klart.

Gör det först när sidan är godkänd. Med `CNAME` på plats skickas github.io-adressen vidare till vildbyn.se.

## Övrigt

- Ingen spårning och inga cookies, så ingen cookie-ruta behövs.
- Filmen har inget ljud och inga knappar. Den vilar när den är utskrollad och drar igång igen när den syns. Med "minska rörelse" eller "spara data" påslaget visas stillbilden.
- EXIF och GPS är borttaget ur bilderna.
