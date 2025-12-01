"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImagePlus, Send } from "lucide-react";
import { createRepliesAction } from "@/app/reply.action";
import { useRouter } from "next/navigation";

interface ReplyFormProps {
  threadId: string;
}

export function ReplyForm({ threadId }: ReplyFormProps) {
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ text: string; replyTo?: string }>;
      setContent((prev) => prev + custom.detail.text);
      if (custom.detail.replyTo) {
        setReplyTo(custom.detail.replyTo);
      }
    };

    window.addEventListener("prefill-reply", handler);
    return () => window.removeEventListener("prefill-reply", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("threadId", threadId);
    formData.append("content", content);
    if (replyTo) {
      formData.append("replyTo", replyTo);
    }
    if (image) {
      formData.append("image", image);
    }

    try {
      await createRepliesAction(formData);

      setContent("");
      setReplyTo(undefined);
      setImage(null);
      router.refresh();
    } catch (err) {
      console.error("Failed to post reply", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Post Reply</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="reply-textarea">Message</Label>
                <Textarea
                  id="reply-textarea"
                  placeholder="Write your reply..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="image" className="cursor-pointer">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span>
                        <ImagePlus className="w-4 h-4 mr-2" />
                        Add Image
                      </span>
                    </Button>
                  </Label>
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  {image && <span className="text-sm text-muted-foreground">{image.name}</span>}
                </div>

                <Button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Posting..." : "Post Reply"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
