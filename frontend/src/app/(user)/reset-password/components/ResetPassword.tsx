"use client";

import { checkPasswordResetCode, resetPasswordWithCode } from "@/api/user";
import LoadingPage from "@/app/common/LoadingPage";
import Navbar from "@/app/common/Navbar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  password: z.string().length(8),
});

const ResetPassword = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const searchParams = useSearchParams();
  const [isValidCode, setIsValidCode] = useState(false);
  const [isInvalidCode, setIsInvalidCode] = useState(false);
  const [username, setUsername] = useState("");
  const [changeIsSuccessful, setChangeIsSuccessful] = useState(false);

  useEffect(() => {
    if (!searchParams) return;
    const code = searchParams.get("code");
    if (!code) return;
    // check if the code is valid
    checkPasswordResetCode(code).then((data) => {
      if (!data) {
        setIsInvalidCode(true);
        return;
      }
      setIsValidCode(true);
      setUsername(data.username);
    })
  }, [searchParams])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!searchParams) return;
    const code = searchParams.get("code");
    if (!code) return;
    // reset the password
    resetPasswordWithCode(code, data.password).then((data) => {
      if (!data) return;
      setChangeIsSuccessful(true);
    })
  };

  return (
    <>
      <Navbar/>
      {!isValidCode && !isInvalidCode && <LoadingPage/>}
      {isValidCode && !changeIsSuccessful && <div className="max-w-xl mx-auto my-10 p-2">
        <h1 className="text-white font-extrabold text-h1">Reset Password</h1>
        <p className="text-primary-300 text-lg">
          Welcome, {username}! Please enter your new password.
        </p>
        <Form {...form}>
          <form className="my-10 grid gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-500 text-lg">PASSWORD</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} className="focus:border-yellow-500 text-white"/>
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-300 px-4 py-2 my-2 rounded-md text-black">Change Password</Button>
          </form>
        </Form>
      </div>}
      {isInvalidCode && <div className="max-w-xl mx-auto my-10 p-2">
        <h1 className="text-white font-extrabold text-h1">Invalid Code</h1>
        <p className="text-primary-300 text-lg">
          The code you entered is invalid. Please check your email for the correct code.
        </p>
      </div>}
      {changeIsSuccessful && <div className="max-w-xl mx-auto my-10 p-2">
        <h1 className="text-white font-extrabold text-h1">Password Changed</h1>
        <p className="text-primary-300 text-lg">
          Your password has been changed successfully. You can now <a href="/login" className="text-yellow-500 hover:underline">login</a> with your new password.
        </p>
      </div>}
    </>
  );
}

export default ResetPassword;