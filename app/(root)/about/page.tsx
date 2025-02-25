import Image from "next/image";

const AboutPage = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="flex justify-center">
          <Image
            height={500}
            width={500}
            src="/images/julien.png"
            alt="julien-image"
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="md:col-span-2 relative bg-gray-100 p-6 rounded-lg shadow-md">
          <Image
            height={50}
            width={50}
            src="/images/quotes-opening.png"
            alt="quotes-opening"
            className="absolute top-[-30px] left-[-10px] opacity-20"
          />

          <blockquote className="text-xl italic text-gray-700 relative z-10">
            Le tambour chamanique a changé ma vie et je constate que ça fait
            évoluer la vie de certains [...] mon intention est de rendre cette
            pratique le plus accessible possible.
          </blockquote>

          <Image
            height={50}
            width={50}
            src="/images/quotes-closing.png"
            alt="quotes-closing"
            className="absolute bottom-[-30px] right-[-10px] opacity-20"
          />
        </div>
      </div>

      <div className="mt-12 text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
        <p>
          La musique a toujours été ma compagne de route. D&apos;abord à travers
          mon rôle de batteur, cette position unique où l&apos;on devient le
          cœur battant du groupe, celui qui mène la danse et guide les autres
          musiciens. Un batteur met en place les conditions nécessaires afin que
          chacun puisse s&apos;épanouir et trouver son espace de liberté.
        </p>

        <p className="mt-6">
          J&apos;ai ensuite exploré les musiques électroniques, mais
          progressivement, j&apos;ai ressenti que cette déconnexion avec
          l&apos;instrument physique ne me correspondait pas pleinement. Je me
          suis alors mis en quête d&apos;une reconnexion organique, d&apos;un
          retour à la matière vibrante sous les doigts, à la relation directe
          entre le geste et le son.
        </p>

        <p className="mt-6">
          C&apos;est au détour de ce cheminement intérieur que le chamanisme
          s&apos;est révélé à moi, et avec lui, le tambour. Comme si toutes les
          routes empruntées convergeaient vers cette rencontre, ma quête
          trouvait enfin son aboutissement — non pas une fin, mais une
          destination que mon âme reconnaissait sans l&apos;avoir jamais vue.
        </p>

        <p className="mt-6">
          En 2020, porté par cette compréhension, j&apos;ai donné naissance à{" "}
          <strong>L&apos;Âme Du Tambour</strong>, mon atelier niché dans les
          terres ariégeoises de Mirepoix, au pied des Pyrénées. Chaque tambour
          qui naît sous mes mains n&apos;est pas conçu pour plaire à l&apos;œil,
          mais pour révéler son chant unique, sa voix singulière.
        </p>

        <p className="mt-6 font-semibold text-gray-900">Tamboureusement.</p>
      </div>
    </div>
  );
};

export default AboutPage;
