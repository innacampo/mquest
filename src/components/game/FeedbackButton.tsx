import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const FeedbackButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    const trimmed = message.trim();
    if (!trimmed || trimmed.length > 2000) return;

    setSending(true);
    const { error } = await supabase.from('feedback').insert({
      message: trimmed,
      page: window.location.pathname,
    });
    setSending(false);

    if (error) {
      toast({ title: 'Oops', description: 'Could not send feedback.', variant: 'destructive', position: 'bottom-left' });
    } else {
      toast({ title: '💜 Thank you!', description: 'Your feedback has been saved.', position: 'bottom-left' });
      setMessage('');
      setOpen(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-2 w-72 bg-card/95 backdrop-blur-md border border-border rounded-xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-display text-foreground">Send Feedback</p>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
              placeholder="Bug, idea, or thought…"
              className="text-sm min-h-[80px] bg-background/50 border-border/50 resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] text-muted-foreground">{message.length}/2000</span>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!message.trim() || sending}
                className="gap-1"
              >
                <Send className="h-3 w-3" /> {sending ? 'Sending…' : 'Send'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        <MessageSquare className="h-5 w-5" />
      </motion.button>
    </div>
  );
};

export default FeedbackButton;
