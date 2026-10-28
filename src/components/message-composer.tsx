import { sendMessage } from "@/app/messages/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type MessageComposerProps = {
  conversationId: string;
  returnPath: string;
  placeholder?: string;
  showDraftAi?: boolean;
};

export function MessageComposer({
  conversationId,
  returnPath,
  placeholder = "Write a message",
  showDraftAi = false,
}: MessageComposerProps) {
  return (
    <form action={sendMessage} className="border-t border-zinc-200 p-4">
      <input type="hidden" name="conversationId" value={conversationId} />
      <input type="hidden" name="returnPath" value={returnPath} />
      <Textarea
        name="body"
        placeholder={placeholder}
        className="min-h-20 resize-none"
        required
      />
      <div className="mt-3 flex items-center justify-between">
        {showDraftAi ? (
          <span className="text-[12px] text-zinc-400">Draft with AI — coming soon</span>
        ) : (
          <p className="text-[12px] text-zinc-400">
            Messages are stored securely for you and your tutor.
          </p>
        )}
        <Button type="submit" size="sm">
          Send
        </Button>
      </div>
    </form>
  );
}
