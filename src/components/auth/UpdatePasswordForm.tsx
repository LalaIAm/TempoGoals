import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface UpdatePasswordFormProps {
  onSubmit?: (values: z.infer<typeof formSchema>) => Promise<void>;
  isLoading?: boolean;
}

const UpdatePasswordForm = ({
  onSubmit = async () => {},
  isLoading = false,
}: UpdatePasswordFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error("Password update error:", error);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const password = form.watch("password");
  const passwordStrength = calculatePasswordStrength(password);

  return (
    <Card className="w-[400px] bg-background">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Update Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <div className="space-y-2">
                    <Progress value={passwordStrength} className="h-2" />
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li
                        className={password.length >= 8 ? "text-green-500" : ""}
                      >
                        • At least 8 characters
                      </li>
                      <li
                        className={
                          password.match(/[A-Z]/) ? "text-green-500" : ""
                        }
                      >
                        • At least one uppercase letter
                      </li>
                      <li
                        className={
                          password.match(/[0-9]/) ? "text-green-500" : ""
                        }
                      >
                        • At least one number
                      </li>
                      <li
                        className={
                          password.match(/[^A-Za-z0-9]/) ? "text-green-500" : ""
                        }
                      >
                        • At least one special character
                      </li>
                    </ul>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UpdatePasswordForm;
