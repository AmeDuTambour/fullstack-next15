/**
 * Visuels réels de l'atelier, déjà présents sur le compte UploadThing.
 *
 * Les clés sont stables et les fichiers publics : rien de secret ici. L'`appId`
 * fait partie de l'URL publique de diffusion, pas du jeton d'API — celui-ci
 * reste dans `.env`, sous `UPLOADTHING_TOKEN`.
 *
 * Convention de nommage des photos de tambours, telle qu'elle existe sur le
 * compte : `<peau><dimensions>-n<numéro>-<face>` — par exemple
 * `ch45x7-n2-front` pour une chèvre de 45x7, tambour n°2, vue de face.
 */

const UFS = "https://vueei2jykg.ufs.sh/f";

const file = (key: string) => `${UFS}/${key}`;

/** Les cinq tambours réellement photographiés, face avant puis face arrière. */
export const DRUM_PHOTOS = {
  "bouc-45x7-n2": [
    file("psMoLzteTvB0VyycgkddTQPFGJrw4qjKiElU0cY5hy967Ngo"),
    file("psMoLzteTvB0PGhbP1KgXTZ5jSR2LvHwkQ7z4Bdb9WE3DI86"),
  ],
  "bouc-45x7-n3": [
    file("psMoLzteTvB0FQpl0ouaGnyZWtHzdEpUkoaXSi6wP97RDQe0"),
    file("psMoLzteTvB0fPgmgFe8EJ1xzaoMjvVgn3wfSe6Cp9PWsHkU"),
  ],
  "bouc-45x8-n1": [
    file("psMoLzteTvB0XiQ24hbbXLFRycVhKM9QTjAtigY8Hq65BZpI"),
    file("psMoLzteTvB0dPz8ZX6DFpLSgqe4Mu2lZyRXx7ONasb8IcEr"),
  ],
  "chevre-45x7-n1": [
    file("psMoLzteTvB0glPcbU3KQOtqyvBfXJwFSCdVpH4TLj1u5NAZ"),
    file("psMoLzteTvB00XJbrog18kPSZDvjaHr3YilRfbytXdGUAEJ5"),
  ],
  "chevre-45x7-n2": [
    file("psMoLzteTvB0JJMvSS5ETw53c1oJ8M76tvULufZ2jxaCIFdO"),
    file("psMoLzteTvB08F2lHGPnrE1kOHcmjWZ9uvdVTMI4bpqzsXeS"),
  ],
} as const;

/** Visuels des articles. Les doublons du compte ont été écartés. */
export const ARTICLE_MEDIA = {
  construction: {
    banner: file("psMoLzteTvB0e3z1biy0b5SYwGtluiBW8x7sNpjRmnLEdvqX"),
    thumbnail: file("psMoLzteTvB068ifkbJTZzmtjBvoCUb0KhRqOslQncrDxaHJ"),
  },
  yourte: {
    banner: file("psMoLzteTvB04eew4WGuh3RLp1o6D9VCmjnc7b2YT5OkNefU"),
    thumbnail: file("psMoLzteTvB0KIGgqJpdGJOxjI06mXR43M9fHvl1yYNCo8Ua"),
    section: file("psMoLzteTvB0XMWmFubbXLFRycVhKM9QTjAtigY8Hq65BZpI"),
  },
  sesame: {
    banner: file("psMoLzteTvB0wsvAM5nN5DGTYlUZAtMJV7KQ2b04OIn1WgFy"),
    thumbnail: file("psMoLzteTvB0YKpiBvt8urT2DPY5fOkXR6LvqZ7AGgSUe4Cz"),
  },
} as const;
