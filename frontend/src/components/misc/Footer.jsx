import { Separator } from '@/components/ui/separator';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-background pt-16 pb-8">
      <div className="container mx-auto max-w-6xl px-4">
        <Separator className="mb-8 opacity-50" />

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand Part */}
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Sparkles className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              Service Based App
            </span>
          </div>

          {/* Copyright - Cleaned up */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Service Based App. All rights
            reserved.
          </p>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="/help" className="hover:text-primary transition-colors">
              Help
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
