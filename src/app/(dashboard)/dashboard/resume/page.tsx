"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card, EmptyState } from "@/components/ui/Primitives";
import { useToast } from "@/providers/ToastProvider";

export default function ResumePage() {
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  if (!user) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Resume</h2>
      {user.resume ? (
        <Card>
          <p className="text-sm text-muted">Your resume is ready for applications.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={user.resume} target="_blank" rel="noreferrer">
              <Button>Preview / Download</Button>
            </a>
            <Button
              variant="danger"
              onClick={async () => {
                await api.delete("/api/users/me/resume");
                await refresh();
                toast({ type: "success", title: "Resume deleted" });
              }}
            >
              Delete resume
            </Button>
          </div>
        </Card>
      ) : (
        <EmptyState
          title="No resume uploaded"
          description="Upload a PDF, DOC, DOCX, or TXT file up to 10MB."
        />
      )}

      <Card>
        <label className="block text-sm font-medium">Upload resume</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="mt-3 block w-full text-sm"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const form = new FormData();
            form.append("file", file);
            setUploading(true);
            try {
              await api.post("/api/users/me/resume", form);
              await refresh();
              toast({ type: "success", title: "Resume uploaded" });
            } catch (error) {
              toast({
                type: "error",
                title: "Upload failed",
                description: error instanceof Error ? error.message : "Try again",
              });
            } finally {
              setUploading(false);
            }
          }}
        />
        {uploading ? <p className="mt-2 text-sm text-muted">Uploading…</p> : null}
      </Card>
    </div>
  );
}
