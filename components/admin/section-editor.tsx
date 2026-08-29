"use client";
import { PendingButton } from "@/components/ui/pending-button";
import { admin as t, common } from "@/lib/labels";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import ImageUpload from "@/components/shared/image-upload";
import { ControllerRenderProps, useForm } from "react-hook-form";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { insertArticleSectionSchema } from "@/lib/validators";
import { z } from "zod";
import { ArticleSection } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleSectionFormDefaultValues } from "@/lib/constants";
import {
  deleteArticleSection,
  updateArticleSection,
} from "@/lib/actions/article.actions";
import { Loader, TrashIcon } from "lucide-react";

type SectionEditorProps = {
  index: number;
  data: ArticleSection;
  isSaving: (value: boolean) => void;
};

export const SectionEditor = ({
  index,
  data,
  isSaving,
}: SectionEditorProps) => {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const [mediaType, setMediaType] = useState<"image" | "video" | "none">(() => {
    if (data.image) return "image";
    if (data.youTubeUrl) return "video";
    return "none";
  });

  const { toast } = useToast();
  const form = useForm<z.infer<typeof insertArticleSectionSchema>>({
    resolver: zodResolver(insertArticleSectionSchema),
    defaultValues: {
      ...articleSectionFormDefaultValues,
      ...data,
    },
  });

  const debouncedTitle = useDebounce(form.watch("title"), 500);
  const debouncedBody = useDebounce(form.watch("body"), 500);
  const debouncedImage = useDebounce(form.watch("image"), 500);
  const debouncedYouTubeUrl = useDebounce(form.watch("youTubeUrl"), 500);

  useEffect(() => {
    if (!form.formState.isDirty) return;

    const updateSection = async () => {
      startTransition(async () => {
        isSaving(true);
        const res = await updateArticleSection({
          sectionId: data.sectionId,
          title: debouncedTitle,
          body: debouncedBody,
          position: Number(form.getValues("position")),
          image: mediaType === "image" ? debouncedImage : "",
          youTubeUrl: mediaType === "video" ? debouncedYouTubeUrl : "",
        });
        if (!res.success) {
          toast({
            variant: "destructive",
            description: res.message,
          });
        }
        isSaving(false);
      });
    };
    if (data?.sectionId) {
      updateSection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedBody, debouncedImage, debouncedYouTubeUrl]);

  useEffect(() => {
    const initialMediaType = data.image
      ? "image"
      : data.youTubeUrl
        ? "video"
        : "none";
    setMediaType(initialMediaType);
  }, [data.image, data.youTubeUrl]);

  const handleDeleteSection = async () => {
    startDeleting(async () => {
      const res = await deleteArticleSection(data.sectionId);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      }
      toast({ description: res.message });
    });
  };

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
              <FormLabel className="h2-bold flex flex-row items-center gap-4">
                {t.section(index + 1)}
                {isPending ? (
                  <Loader className="w-5 h-5 animate-spin text-primary" />
                ) : null}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t.sectionTitle}
                  {...field}
                  value={field.value ?? ""}
                />
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
                <Textarea
                  placeholder={t.sectionBody}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-lg font-bold">{t.media}</div>
        <RadioGroup
          value={mediaType}
          onValueChange={(value: "video" | "image" | "none") =>
            setMediaType(value)
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none">{t.mediaNone}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="image" />
            <Label htmlFor="image">{t.mediaImage}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video" id="video" />
            <Label htmlFor="video">{t.mediaVideo}</Label>
          </div>
        </RadioGroup>

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
                <FormLabel>{t.mediaImage}</FormLabel>
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
                    <ImageUpload
  onUploaded={(url) => {
    form.setValue("image", url, {
                          shouldDirty: true,
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
                <FormLabel>{t.videoUrl}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.videoUrlPlaceholder}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      <div className="flex w-full justify-end">
        <PendingButton
          pending={isDeleting}
          pendingLabel=""
          type="button"
          variant="destructive"
          icon={<TrashIcon className="h-4 w-4" />}
          onClick={handleDeleteSection}
          className="mt-2"
          aria-label={common.delete}
        />
      </div>
    </Form>
  );
};
