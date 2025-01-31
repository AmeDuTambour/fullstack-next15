"use client";

import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import { Controller, useFormContext } from "react-hook-form";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { insertArticleSectionSchema } from "@/lib/validators";
import { z } from "zod";
import { ArticleSection } from "@/types";

type SectionEditorProps = {
  index: number;
  data?: ArticleSection;
  onSave: (
    section: Omit<z.infer<typeof insertArticleSectionSchema>, "articleId">
  ) => Omit<z.infer<typeof insertArticleSectionSchema>, "articleId">;
};

export const SectionEditor = ({ index, data, onSave }: SectionEditorProps) => {
  const { control, setValue, watch } = useFormContext();
  const { toast } = useToast();

  const sections = watch("sections") || [];
  const title = sections[index]?.title || "";
  const paragraph = sections[index]?.paragraph || "";
  const mediaType = sections[index]?.media?.type || "none";
  const mediaUrl = sections[index]?.media?.url || "";

  const debouncedTitle = useDebounce(title, 3000);
  const debouncedParagraph = useDebounce(paragraph, 3000);
  const debouncedMediaUrl = useDebounce(mediaUrl, 3000);
  const debouncedMediaType = useDebounce(mediaType, 3000);

  useEffect(() => {
    console.log(`Section ${index + 1} mise à jour:`, {
      paragraph: debouncedParagraph,
      media:
        mediaType !== "none"
          ? { type: mediaType, url: debouncedMediaUrl }
          : null,
    });
    const section = {
      title: debouncedTitle,
      position: index + 1,
      body: debouncedParagraph,
      image: mediaType === "image" ? debouncedMediaUrl : "",
      youTubeUrl: mediaType === "video" ? debouncedMediaUrl : "",
    };

    onSave(section);
  }, [
    debouncedParagraph,
    debouncedMediaUrl,
    debouncedMediaType,
    debouncedTitle,
  ]);

  return (
    <div key={index} className="space-y-4">
      {/* Champ de texte obligatoire */}
      <Controller
        control={control}
        name={`sections.${index}.title`}
        defaultValue=""
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="h2-bold">Section {index + 1}</FormLabel>
            <FormControl>
              <Input placeholder="Enter title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Controller
        control={control}
        name={`sections.${index}.paragraph`}
        defaultValue=""
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <Textarea placeholder="Enter paragraph" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Sélection du média (optionnel) */}
      <div className="text-lg font-bold">Add media (optional)</div>
      <RadioGroup
        defaultValue={mediaType}
        onValueChange={(value) => {
          if (value === "none") {
            setValue(`sections.${index}.media`, undefined); // Supprimer le média
          } else {
            setValue(`sections.${index}.media`, { type: value, url: "" }); // Initialiser
          }
        }}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="none" id={`none-${index}`} />
          <Label htmlFor={`none-${index}`}>None</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="image" id={`image-${index}`} />
          <Label htmlFor={`image-${index}`}>Image</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="video" id={`video-${index}`} />
          <Label htmlFor={`video-${index}`}>YouTube video</Label>
        </div>
      </RadioGroup>

      {/* Upload d'images */}
      {mediaType === "image" && (
        <Controller
          control={control}
          name={`sections.${index}.media.url`}
          defaultValue=""
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Image</FormLabel>
              <div className="flex items-center space-x-2">
                {field.value && (
                  <Image
                    src={field.value}
                    alt={`Image section ${index + 1}`}
                    className="w-20 h-20 object-cover object-center rounded-sm"
                    width={100}
                    height={100}
                  />
                )}
                <FormControl>
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: { url: string }[]) => {
                      setValue(`sections.${index}.media.url`, res[0].url);
                    }}
                    onUploadError={(error: Error) => {
                      toast({
                        variant: "destructive",
                        description: `Error: ${error.message}`,
                      });
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Input pour YouTube */}
      {mediaType === "video" && (
        <Controller
          control={control}
          name={`sections.${index}.media.url`}
          defaultValue=""
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Video URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter YouTube URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
