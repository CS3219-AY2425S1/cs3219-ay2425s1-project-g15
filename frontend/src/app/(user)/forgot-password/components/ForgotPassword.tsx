"use client";

import { requestPasswordReset } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Navbar from "@/app/common/Navbar";

const formSchema = z.object({
  email: z.string(),
});

const Login = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await requestPasswordReset(data.email);
  };

  return (
    <>
      <Navbar/>
      <div className="max-w-xl mx-auto my-10 p-2">
        <h1 className="text-white font-extrabold text-h1">Forgot Your Password?</h1>
        <p className="text-primary-300 text-lg">
          Enter your email address and we will send you a link to reset your password.
        </p>
        <Form {...form}>
          <form className="my-10 grid gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-500 text-lg">EMAIL</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} className="focus:border-yellow-500 text-white"/>
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-300 px-4 py-2 my-2 rounded-md text-black">Send Password Reset Code</Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default Login;