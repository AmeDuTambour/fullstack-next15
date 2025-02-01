"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import { ControllerRenderProps, useForm } from "react-hook-form";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { insertArticleSectionSchema } from "@/lib/validators";
import { z } from "zod";
import { ArticleSection } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleSectionFormDefaultValues } from "@/lib/constants";

type SectionEditorProps = {
  index: number;
  data?: ArticleSection;
};

export const SectionEditor = ({ index, data }: SectionEditorProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof insertArticleSectionSchema>>({
    resolver: zodResolver(insertArticleSectionSchema),
    defaultValues: articleSectionFormDefaultValues,
  });
  const [mediaType, setMediaType] = useState<"image" | "video" | "none">(
    "none"
  );

  return (
    <Form {...form}>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name={"title"}
          defaultValue={data?.title}
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              z.infer<typeof insertArticleSectionSchema>,
              "title"
            >;
          }) => (
            <FormItem className="w-full">
              <FormLabel className="h2-bold">Section {index + 1}</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"body"}
          defaultValue={data?.body}
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              z.infer<typeof insertArticleSectionSchema>,
              "body"
            >;
          }) => (
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
          onValueChange={(value: "video" | "image" | "none") =>
            setMediaType(value)
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor={"none"}>None</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="image" />
            <Label htmlFor={"image"}>Image</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video" id="video" />
            <Label htmlFor={"video"}>YouTube video</Label>
          </div>
        </RadioGroup>

        {/* Upload d'images */}
        {mediaType === "image" && (
          <FormField
            control={form.control}
            name={"image"}
            defaultValue={data?.image ?? ""}
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertArticleSectionSchema>,
                "image"
              >;
            }) => (
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
                        form.setValue(`image`, res[0].url);
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
          <FormField
            control={form.control}
            name={"youTubeUrl"}
            defaultValue={data?.youTubeUrl ?? ""}
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertArticleSectionSchema>,
                "youTubeUrl"
              >;
            }) => (
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
      <FormField
        control={form.control}
        name="position"
        defaultValue={index + 1}
        render={({
          field,
        }: {
          field: ControllerRenderProps<
            z.infer<typeof insertArticleSectionSchema>,
            "position"
          >;
        }) => <input type="hidden" {...field} />}
      />
    </Form>
  );
};
