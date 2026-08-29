"use client";

import { UploadButton } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { common } from "@/lib/labels";

/**
 * Bouton d'envoi d'image.
 *
 * Cinq formulaires répétaient le même bloc : bouton, gestion d'erreur en
 * notification, écriture de l'adresse renvoyée dans le formulaire parent.
 *
 * La migration vers `ufsUrl` d'UploadThing a dû être faite cinq fois pour cette
 * raison. La prochaine évolution n'en touchera qu'une.
 */
type ImageUploadProps = {
  /** Reçoit l'adresse de l'image envoyée. */
  onUploaded: (url: string) => void;
};

export const ImageUpload = ({ onUploaded }: ImageUploadProps) => {
  const { toast } = useToast();

  return (
    <UploadButton
      endpoint="imageUploader"
      /**
       * Le bouton d'UploadThing affiche « Choose File » et « Image (4MB) » en
       * anglais, en plein écran d'administration. Ces textes ne viennent pas du
       * balisage : ni la règle de lint ni le test des attributs ne pouvaient
       * les voir. C'est la limite annoncée de ces deux garde-fous — ils
       * relèvent le plancher, ils ne scellent pas la pièce.
       */
      content={{
        button: ({ ready, isUploading }) =>
          isUploading
            ? common.uploading
            : ready
              ? common.chooseImage
              : common.preparing,
        allowedContent: common.imageMaxSize,
      }}
      onClientUploadComplete={(res: { ufsUrl: string }[]) => {
        const url = res?.[0]?.ufsUrl;
        if (url) onUploaded(url);
      }}
      onUploadError={(error: Error) => {
        toast({
          variant: "destructive",
          description: `${common.uploadFailed} ${error.message}`,
        });
      }}
    />
  );
};

export default ImageUpload;
