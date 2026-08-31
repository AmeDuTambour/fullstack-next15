"use client";

import { PendingButton } from "@/components/ui/pending-button";
import { common } from "@/lib/labels";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitHandler } from "react-hook-form";
import { contactFormSchema } from "@/lib/validators";
import { ContactFormData } from "@/types";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { SendIcon } from "lucide-react";
import { handleContactRequest } from "@/lib/actions/contact.actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const ContactForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    const res = await handleContactRequest(data);
    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message,
      });
    } else {
      toast({
        description: res.message,
      });
      router.replace("/contact/success");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto p-4 border rounded-2xl shadow w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom et prénom</FormLabel>
              <FormControl>
                <Input type="text" {...field} placeholder="Votre nom..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" {...field} placeholder="Votre e-mail..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sujet</FormLabel>
              <FormControl>
                <Input type="text" {...field} placeholder="Sujet (optionnel)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Votre message..." rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <PendingButton
          type="submit"
          pending={form.formState.isSubmitting}
          disabled={!form.formState.isValid}
          icon={<SendIcon className="h-4 w-4" />}
          className="w-full flex items-center justify-center gap-2"
        >
          {common.send}
        </PendingButton>
      </form>
    </Form>
  );
};

export default ContactForm;
