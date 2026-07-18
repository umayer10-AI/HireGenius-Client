"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, Container, SectionTitle } from "@/components/ui/Primitives";
import { useToast } from "@/providers/ToastProvider";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

type FormValues = z.infer<typeof schema>;

export default function ContactPage() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <Container className="py-12">
      <SectionTitle
        eyebrow="Contact"
        title="Talk with the HireGenius team"
        description="Questions about partnerships, recruiting plans, or product support — we respond quickly."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => {
              try {
                await api.post("/api/contact", values);
                toast({ type: "success", title: "Message sent" });
                reset();
              } catch (error) {
                toast({
                  type: "error",
                  title: "Could not send message",
                  description: error instanceof Error ? error.message : "Try again",
                });
              }
            })}
          >
            <Input label="Name" error={errors.name?.message} {...register("name")} />
            <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
            <Input label="Subject" error={errors.subject?.message} {...register("subject")} />
            <Textarea label="Message" error={errors.message?.message} {...register("message")} />
            <Button type="submit" loading={isSubmitting}>
              Send message
            </Button>
          </form>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Reach us directly</h3>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p>Email: hello@hiregenius.ai</p>
            <p>Phone: +1 (415) 555-0198</p>
            <p>Address: 548 Market Street, San Francisco, CA</p>
          </div>
          <div className="mt-6 overflow-hidden rounded-[16px] border border-border">
            <iframe
              title="HireGenius office map"
              src="https://maps.google.com/maps?q=San%20Francisco&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="h-64 w-full"
              loading="lazy"
            />
          </div>
        </Card>
      </div>
    </Container>
  );
}
