import { Button } from "@/components/button/Button";
import { CenteredCard } from "@/components/card/CenteredCard";
import { Field } from "@/components/field/Field";
import { Input } from "@/components/input/Input";
import { Link } from "@/components/link/Link";
import { addToast } from "@/components/toast/Toast";
import { Toaster } from "@/components/toast/Toaster";
import { Text } from "@/components/typography/Text";
import type { JSX } from "solid-js";

/**
 * Full-page demonstration of CenteredCard, rendered as its own screen (the real full-viewport
 * design) at the "/centered-card" route. The body is composed only from solid-kit components.
 */
export const ShowcaseCenteredCardPage = (): JSX.Element => {
  return (
    <>
      <Toaster />
      <CenteredCard
        // Element `icon` (here an inline SVG wordmark) renders bare above the title — no badge — so a
        // wide logo keeps its aspect ratio. Pass a plain string (e.g. "lock") to use the icon badge.
        icon={
          <svg viewBox="0 0 160 32" role="img" aria-label="Acme" class="h-8 w-auto">
            <circle cx="16" cy="16" r="12" fill="#6366f1" />
            <text x="40" y="23" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="currentColor">
              Acme
            </text>
          </svg>
        }
        title="Welcome back"
        subtitle="Sign in to continue to your workspace"
        footer={
          <div class="space-y-2">
            <Text size="small" color="muted">
              New here?{" "}
              <Link href="/centered-card" weight="medium">
                Create an account
              </Link>
            </Text>
            <Link href="/" size="small" color="muted" icon="arrow_back">
              Back to showcase
            </Link>
          </div>
        }
      >
        <Field label="Email" for="centered-card-page-email">
          <Input id="centered-card-page-email" type="email" icon="mail" placeholder="you@example.com" onInput={() => {}} />
        </Field>
        <Field label="Password" for="centered-card-page-password">
          <Input id="centered-card-page-password" type="password" icon="lock" placeholder="••••••••" onInput={() => {}} />
        </Field>
        <Button class="w-full" onClick={() => addToast({ title: "Signed in", description: "Demo submit handled.", variant: "success" })}>
          Sign in
        </Button>
      </CenteredCard>
    </>
  );
};
