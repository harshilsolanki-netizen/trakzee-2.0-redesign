import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sliders,
  Bell,
  Copy,
  Layers,
  Terminal,
  KeyRound,
  Shield,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { toast } from "sonner";

export const Route = createFileRoute("/components")({
  component: ComponentsShowcasePage,
});

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  role: z.string().min(1, "Please select a developer role"),
  marketingUpdates: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

function ComponentsShowcasePage() {
  const [sliderVal, setSliderVal] = React.useState([65]);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [otpCode, setOtpCode] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "frontend",
      marketingUpdates: true,
    },
  });

  const onFormSubmit = (data: FormValues) => {
    toast.success("Profile Updated Successfully!", {
      description: `Saved ${data.fullName} (${data.role}) with notifications ${data.marketingUpdates ? "enabled" : "disabled"}.`,
    });
    reset();
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto max-w-7xl px-4 sm:px-8 py-8 space-y-10 animate-in fade-in duration-500">
        {/* Header */}
        <div className="border-b pb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Component Suite
            </h1>
            <Badge variant="default" className="text-xs">
              Radix UI + Tailwind CSS v4
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Interactive playground demonstrating the full set of installed UI
            primitives, React Hook Form, and Zod validation.
          </p>
        </div>

        {/* Section 1: Buttons, Badges, Tooltips & Toast Triggers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Button & Badge Variants */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4 text-indigo-500" />
                Button & Badge Hierarchy
              </CardTitle>
              <CardDescription>
                All style variants and accessible focus states.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  onClick={() =>
                    toast.success("Default primary action triggered!")
                  }
                >
                  Primary
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => toast.info("Secondary button clicked")}
                >
                  Secondary
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast("Outline button clicked")}
                >
                  Outline
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => toast.error("Destructive action warning!")}
                >
                  Destructive
                </Button>
                <Button variant="ghost">Ghost</Button>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                <Badge variant="default">Default Badge</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  Gradient
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Toasts & Dialog Trigger */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-purple-500" />
                Sonner Toast Notifications & Modals
              </CardTitle>
              <CardDescription>
                Rich dynamic alerts, promises, and modal overlays.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.success("Event Completed", {
                      description: "Resource deployed to edge cluster.",
                    })
                  }
                >
                  Success Toast
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.error("Build Warning", {
                      description: "Asset bundle size exceeded 500kb.",
                    })
                  }
                >
                  Error Toast
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const promise = () =>
                      new Promise((resolve) => setTimeout(resolve, 1500));
                    toast.promise(promise, {
                      loading: "Deploying changes...",
                      success: "Production build deployed successfully!",
                      error: "Deployment failed.",
                    });
                  }}
                >
                  Promise Toast
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Open Dialog Modal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Workspace Migration</DialogTitle>
                      <DialogDescription>
                        This will synchronize your configuration across all
                        distributed clusters.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 bg-muted/40 rounded-lg text-xs space-y-1 font-mono">
                      <p className="text-muted-foreground">
                        $ agy sync --env=production
                      </p>
                      <p className="text-emerald-600 dark:text-emerald-400">
                        ✓ 14 edge services validated
                      </p>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          setIsDialogOpen(false);
                          toast.success("Workspace Synced", {
                            description:
                              "Production edge cluster is now up to date.",
                          });
                        }}
                      >
                        Confirm Sync
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Tooltip demo */}
              <div className="pt-2 border-t flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Hover to inspect tooltip:
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Radix Tooltip ℹ️
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Accessible tooltip styled via Radix UI & Tailwind</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 2: React Hook Form + Zod Validation & 2FA OTP Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* React Hook Form + Zod */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                Type-Safe Form (Hook Form + Zod)
              </CardTitle>
              <CardDescription>
                Strict validation with schema resolvers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="e.g. Elena Rostova"
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-destructive">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="elena@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Developer Role</Label>
                  <Select
                    defaultValue="frontend"
                    onValueChange={(val) => setValue("role", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">
                        Frontend Architect
                      </SelectItem>
                      <SelectItem value="fullstack">
                        Full-Stack Engineer
                      </SelectItem>
                      <SelectItem value="backend">
                        Backend & DevOps Specialist
                      </SelectItem>
                      <SelectItem value="ai">
                        AI / ML Systems Engineer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id="marketingUpdates"
                    checked={watch("marketingUpdates")}
                    onCheckedChange={(checked) =>
                      setValue("marketingUpdates", !!checked)
                    }
                  />
                  <Label
                    htmlFor="marketingUpdates"
                    className="text-xs font-normal cursor-pointer"
                  >
                    Receive weekly digest of platform updates and security
                    alerts
                  </Label>
                </div>

                <Button type="submit" size="sm" className="w-full gap-2 mt-2">
                  <Send className="h-3.5 w-3.5" />
                  Save Account Settings
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Controls, Sliders, Switches & Input OTP */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-amber-500" />
                Input OTP (2FA) & Controls
              </CardTitle>
              <CardDescription>
                Multi-factor authentication slot input and interactive controls.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* 2FA Input OTP */}
              <div className="space-y-2">
                <Label className="text-xs">
                  Security Verification Code (6 digits)
                </Label>
                <div className="flex justify-center py-2">
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={(val) => {
                      setOtpCode(val);
                      if (val.length === 6) {
                        toast.success("2FA Code Verified", {
                          description: `Code ${val} accepted.`,
                        });
                      }
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Slider demo */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">Rate Limit Bandwidth:</span>
                  <span className="font-mono text-primary font-semibold">
                    {sliderVal[0]} req/s
                  </span>
                </div>
                <Slider
                  value={sliderVal}
                  onValueChange={setSliderVal}
                  max={100}
                  step={1}
                />
              </div>

              {/* Switch demo */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">
                    Automatic Backups
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Snapshot database state every 6 hours
                  </p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={(checked) => {
                    setNotificationsEnabled(checked);
                    toast.info(
                      `Automatic backups ${checked ? "enabled" : "disabled"}`,
                    );
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Tabs & Accordion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-500" />
                Tabs Navigation
              </CardTitle>
              <CardDescription>
                Segmented views with smooth transition states.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Architecture</TabsTrigger>
                  <TabsTrigger value="routing">Router</TabsTrigger>
                  <TabsTrigger value="ssr">SSR & Nitro</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="overview"
                  className="p-3 bg-muted/30 rounded-lg text-xs space-y-2 mt-3"
                >
                  <p className="font-semibold text-foreground">
                    Next-Gen Full Stack Architecture
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Combines Vite 6/8 lightning bundling, React 19 concurrent
                    features, TanStack Router type safety, and Tailwind CSS v4.
                  </p>
                </TabsContent>
                <TabsContent
                  value="routing"
                  className="p-3 bg-muted/30 rounded-lg text-xs space-y-2 mt-3"
                >
                  <p className="font-semibold text-foreground">
                    File-Based Type-Safe Routing
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Automatic route tree generation with loader caches, context
                    injection, and type-checked search parameters.
                  </p>
                </TabsContent>
                <TabsContent
                  value="ssr"
                  className="p-3 bg-muted/30 rounded-lg text-xs space-y-2 mt-3"
                >
                  <p className="font-semibold text-foreground">
                    Nitro Server Engine
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Ultra-fast server rendering and API routes deploying
                    seamlessly to Cloudflare Workers, Vercel, Node, or Deno.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Accordion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Terminal className="h-4 w-4 text-teal-500" />
                Accordion Q&A
              </CardTitle>
              <CardDescription>
                Collapsible sections with animated height transitions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    How does TanStack Start compare to Next.js?
                  </AccordionTrigger>
                  <AccordionContent>
                    TanStack Start is built on Vite and TanStack Router,
                    offering 100% type safety across loaders and navigation
                    without proprietary vendor lock-in.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Is Tailwind CSS v4 supported?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes! Tailwind CSS v4 is integrated via{" "}
                    <code>@tailwindcss/vite</code> with CSS theme variables and
                    modern cascading layers.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How are Server Functions implemented?
                  </AccordionTrigger>
                  <AccordionContent>
                    Server functions are created using{" "}
                    <code>createServerFn()</code> with type-safe parameters,
                    responses, and automatic serialization.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
