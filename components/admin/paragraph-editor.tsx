"use client";

import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import {
  Controller,
  ControllerRenderProps,
  useFormContext,
} from "react-hook-form";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { insertArticleSchema } from "@/lib/validators";
import { z } from "zod";
import { useEffect } from "react";

type ParagraphEditorProps = {
  index: number;
  name: string;
};

export const ParagraphEditor = ({ index, name }: ParagraphEditorProps) => {
  const { control, setValue, watch } = useFormContext();
  const { toast } = useToast();

  const paragraphs = watch("paragraphs") || [];
  const images = watch("images") || [];
  const mediaType = watch(`mediaType.${index}`) || "none";

  useEffect(() => {
    console.log("====================================");
    console.log("paragrah: ", paragraphs);
    console.log("Media type : ", mediaType);
    console.log("Images : ", images);
    console.log("====================================");
  }, [paragraphs, mediaType, images]);

  return (
    <div key={index} className="space-y-4">
      {/* Zone de texte */}
      <Controller
        control={control}
        name={`paragraphs.${index}`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Paragraph {index + 1}</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter paragraph" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Choix du média */}
      <RadioGroup
        className="flex flex-grow"
        defaultValue={mediaType}
        onValueChange={(value) => setValue(`mediaType.${index}`, value)}
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
          name={`images.${index}`}
          render={() => (
            <FormItem className="w-full">
              <FormLabel>Image</FormLabel>

              <div className="flex-start space-x-2">
                {images[index] && (
                  <Image
                    key={images[index]}
                    src={images[index]}
                    alt={`Paragraph image ${index + 1}`}
                    className="w-20 h-20 object-cover object-center rounded-sm"
                    width={100}
                    height={100}
                  />
                )}
                <FormControl>
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: { url: string }[]) => {
                      const newImages = [...images];
                      newImages[index] = res[0].url;
                      setValue("images", newImages);
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
      {mediaType === "video" && (
        <Controller
          control={control}
          name="youTubeUrl"
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              z.infer<typeof insertArticleSchema>,
              "youTubeUrl"
            >;
          }) => (
            <FormItem className="w-full">
              <FormLabel>Video</FormLabel>

              <FormControl>
                <Input placeholder="Enter YouTube url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
