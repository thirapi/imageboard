
"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImagePlus, Send, Plus } from "lucide-react";
import { createThreadAction } from "@/app/thread.action";
import { useRouter } from "next/navigation";
import { Board } from "@/lib/types";
import { toast } from "sonner";

interface NewThreadModalProps {
  boards?: Board[];
  boardId?: string;
  trigger?: React.ReactNode;
}

export function NewThreadModal({
  boards,
  boardId,
  trigger,
}: NewThreadModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedBoard, setSelectedBoard] = useState(boardId || "");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !selectedBoard) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("boardId", selectedBoard);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", "Anonymous");

    if (image) {
      formData.append("image", image);
    }

    try {
      await createThreadAction(formData);

      setTitle("");
      setContent("");
      setImage(null);
      setOpen(false);
      toast.success("Thread created successfully!");
      router.refresh();
    } catch (err) {
      console.error("Failed to create thread", err);
      toast.error("Failed to create thread. Please try again.");
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

  const selectedBoardData = boards?.find((b) => b.id === selectedBoard);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Thread
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl h-[95vh] sm:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Thread</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!boardId && (
            <div className="space-y-2">
              <Label htmlFor="board">Board</Label>
              <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a board" />
                </SelectTrigger>
                <SelectContent>
                  {boards?.map((board) => (
                    <SelectItem key={board.id} value={board.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{board.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {board.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedBoardData && (
                <p className="text-sm text-muted-foreground">
                  Posting to {selectedBoardData.name}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Thread Title</Label>
            <Input
              id="title"
              placeholder="Enter thread title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/100 characters
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  placeholder="Write your message..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="resize-none"
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground">
                  {content.length}/2000 characters
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="image" className="cursor-pointer">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span>
                        <ImagePlus className="w-4 h-4 mr-2" />
                        Add Image
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {image && (
                    <span className="text-sm text-muted-foreground">
                      {image.name}
                    </span>
                  )}
                </div>

                {image && (
                  <div className="relative max-w-xs">
                    <img
                      src={URL.createObjectURL(image) || "/placeholder.svg"}
                      alt="Preview"
                      className="rounded-lg border max-h-32 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setImage(null)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground hidden sm:block">
              Posting as <span className="font-medium">Anonymous</span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="hidden sm:inline-flex"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !title.trim() ||
                  !content.trim() ||
                  !selectedBoard ||
                  isSubmitting
                }
                className="w-full sm:w-auto"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Creating..." : "Create Thread"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
