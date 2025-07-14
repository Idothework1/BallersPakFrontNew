"use client";

import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  // Auto-redirect to new login after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/profile");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
        <div className="flex flex-col gap-4 text-center">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
            <ArrowRight className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Login System Updated!
          </h1>
          <p className="text-gray-300">
            We&apos;ve moved to a new login system. Please use your <strong>email and birthday</strong> to access your profile.
          </p>
          <p className="text-sm text-gray-400">
            You&apos;ll be redirected automatically in 3 seconds...
          </p>
        </div>
        
        <Button
          onClick={() => router.push("/profile")}
          className="bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold"
        >
          Go to New Login
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <p className="px-8 text-center text-sm text-gray-400">
          <Link
            href="/signup"
            className="hover:text-blue-400 underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
