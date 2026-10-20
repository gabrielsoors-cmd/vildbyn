# Vildbyn – teasersidan

En enda sida som visar vilka vi är och att vi öppnar 2027. Vanlig HTML, CSS och JS på GitHub Pages, inget byggsteg. Gren `main` går live direkt.

Den riktiga hemsidan med webbshop, uthyrning och bokning byggs i Shopify inför öppningen. Den här sidan ersätts då.

## Struktur

| Sökväg | Vad |
| --- | --- |
| `index.html` | Hela sidan |
| `css/style.css` | All stil. Färger och typsnitt överst (`:root`) |
| `js/main.js` | Filmen i toppen: start, paus, ljud, suddig bakgrund på breda skärmar |
| `media/` | Filmen (`vildbyn-film-720.mp4`), suddig kopia till bakgrunden och stillbilder |
| `img/` | Logga, bilder (600 och 1200 px, webp), ikoner, delningsbild och stämpeltexturen |
| `fonts/` | Big Shoulders Display och Zilla Slab, självhostade (OFL-licens) |
| `404.html` | Sidan som visas vid fel adress |

## Ändra innehåll

- **Aktiviteterna** i listan: sök efter `VB-AVENTYR` i `index.html`. Klasserna `s1`–`s3` styr storleken.
- **Instagram och Facebook**: sök efter `VB-SOCIALA` i `index.html`, lägg in rätt adresser och ta bort kommentaren runt listan.
- **Bilderna**: byt filerna i `img/` med samma namn, eller ändra `src`, `srcset` och `alt` i `index.html`. Bilderna är 3:4 stående.

## Byta filmen

Filmen ska vara stående (9:16). Gör om den med ffmpeg:

```sh
ffmpeg -i ny-film.mov -vf "scale=720:1280:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 27 -maxrate 1400k -bufsize 2800k -profile:v high -g 50 -c:a aac -b:a 96k -movflags +faststart media/vildbyn-film-720.mp4
ffmpeg -i ny-film.mov -an -vf "scale=144:256,boxblur=6:2,scale=288:512,format=yuv420p" -c:v libx264 -preset slow -crf 30 -g 50 -movflags +faststart media/vildbyn-film-oskarp.mp4
ffmpeg -i ny-film.mov -frames:v 1 -vf "scale=720:1280" -q:v 4 media/vildbyn-film-poster.jpg
```

## Koppla vildbyn.se

1. Lägg en fil `CNAME` i roten med raden `vildbyn.se`.
2. Hos domänleverantören: A-poster för `vildbyn.se` till 185.199.108.153, 185.199.109.153, 185.199.110.153 och 185.199.111.153, och en CNAME-post för `www` till `gabrielsoors-cmd.github.io`.
3. I repots Settings → Pages: bocka i "Enforce HTTPS" när certifikatet är klart.

Gör det först när sidan är godkänd. Med `CNAME` på plats skickas github.io-adressen vidare till vildbyn.se.

## Övrigt

- Ingen spårning och inga cookies, så ingen cookie-ruta behövs.
- Filmen startar ljudlöst och pausar när den inte syns (om ljudet är av). Med "minska rörelse" eller "spara data" på står den still tills besökaren trycker Spela.
- EXIF och GPS är borttaget ur bilderna.
