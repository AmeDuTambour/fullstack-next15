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
  const { control, setValue, watch, formState } = useFormContext();
  const { toast } = useToast();

  const sections = watch("sections") || [];
  const title = sections[index]?.title || "";
  const paragraph = sections[index]?.paragraph || "";
  const mediaType = data?.image
    ? "image"
    : data?.youTubeUrl
      ? "video"
      : sections[index]?.media?.type || "none";

  const mediaUrl = sections[index]?.media?.url || "";

  const debouncedTitle = useDebounce(title, 400);
  const debouncedParagraph = useDebounce(paragraph, 800);
  const debouncedMediaUrl = useDebounce(mediaUrl, 400);
  const debouncedMediaType = useDebounce(mediaType, 400);

  useEffect(() => {
    console.log("==============DATA EDITOR======================");
    console.log(data);
    console.log("====================================");
    if (Object.keys(formState.dirtyFields).length > 0) {
      const section = {
        title: debouncedTitle,
        position: index + 1,
        body: debouncedParagraph,
        image: mediaType === "image" ? debouncedMediaUrl : null,
        youTubeUrl: mediaType === "video" ? debouncedMediaUrl : null,
        ...(data?.sectionId && { sectionId: data.sectionId }),
      };

      // This id was added by react-hook-form when using the  useFieldArray hook and we don't want it
      delete section.id;
      onSave(section);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedParagraph,
    debouncedMediaUrl,
    debouncedMediaType,
    debouncedTitle,
  ]);

  return (
    <div className="space-y-4">
      <Controller
        control={control}
        name={`sections.${index}.title`}
        defaultValue={data?.title}
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
        defaultValue={data?.body}
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
            setValue(`sections.${index}.media`, undefined);
          } else {
            setValue(`sections.${index}.media`, { type: value, url: "" });
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
          defaultValue={data?.image ?? ""}
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
          defaultValue={data?.youTubeUrl ?? ""}
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
