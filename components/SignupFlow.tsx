"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/user-auth-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { TextAnimate } from "@/components/magicui/text-animate";

export default function SignupFlow() {
  type Step = "intro" | "name" | "played" | "experience" | "location" | "contact" | "signup";
  const [step, setStep] = useState<Step>("intro");
  const [showConfirm, setShowConfirm] = useState(false);

  // Collected data (could be sent to backend later)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [playedBefore, setPlayedBefore] = useState<boolean | null>(null);
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [playedClub, setPlayedClub] = useState<boolean | null>(null);
  const [clubName, setClubName] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");

  const router = useRouter();

  const handleNoFirst = () => setShowConfirm(true);

  const handleConfirmNo = () => router.push("/");

  const handleConfirmYes = () => setShowConfirm(false);

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="rounded-lg bg-background p-8 text-center shadow-lg">
            <h3 className="mb-6 text-lg font-semibold">
              Are you sure you don&apos;t want to join?
            </h3>
            <div className="flex justify-center gap-4">
              <Button onClick={handleConfirmYes}>Yes</Button>
              <Button variant="secondary" onClick={handleConfirmNo}>
                No
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === "intro" ? (
        <div className="mx-auto flex w-full flex-col items-center gap-6 sm:w-[400px] text-center">
          <TextAnimate
            animation="blurInUp"
            once
            className="text-3xl font-bold"
          >
            Are you ready to join the most popular football innovation in
            Pakistan?
          </TextAnimate>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setStep("name")}>Yes</Button>
            <Button variant="secondary" onClick={handleNoFirst}>
              No
            </Button>
          </div>
        </div>
      ) : step === "name" ? (
        <div className="mx-auto flex w-full flex-col gap-6 sm:w-[400px]">
          <h2 className="text-xl font-semibold text-center">Tell us about you</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border bg-transparent px-3 py-2 rounded-md w-full"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border bg-transparent px-3 py-2 rounded-md w-full"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => setStep("played")}
              disabled={!firstName || !lastName}
            >
              Continue
            </Button>
          </div>
        </div>
      ) : step === "played" ? (
        <div className="mx-auto flex w-full flex-col items-center gap-6 sm:w-[400px] text-center">
          <h2 className="text-xl font-semibold">
            Have you played football before?
          </h2>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                setPlayedBefore(true);
                setStep("experience");
              }}
            >
              Yes
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setPlayedBefore(false);
                setStep("location");
              }}
            >
              No
            </Button>
          </div>
        </div>
      ) : step === "experience" ? (
        <div className="mx-auto flex w-full flex-col gap-6 sm:w-[400px]">
          <h2 className="text-xl font-semibold text-center">Your Football Background</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="experience">
                Experience Level
              </label>
              <select
                id="experience"
                className="border bg-transparent px-3 py-2 rounded-md w-full"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Professional</option>
              </select>
            </div>

            <div className="text-sm font-medium">Have you played in a club before or currently?</div>
            <div className="flex gap-4">
              <Button
                variant={playedClub === true ? undefined : "secondary"}
                onClick={() => setPlayedClub(true)}
              >
                Yes
              </Button>
              <Button
                variant={playedClub === false ? undefined : "secondary"}
                onClick={() => setPlayedClub(false)}
              >
                No
              </Button>
            </div>

            {playedClub && (
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="clubName">
                  Club Name
                </label>
                <input
                  id="clubName"
                  type="text"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className="border bg-transparent px-3 py-2 rounded-md w-full"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => setStep("location")}
              disabled={playedClub === null || (playedClub && !clubName)}
            >
              Continue
            </Button>
          </div>
        </div>
      ) : step === "location" ? (
        <div className="mx-auto flex w-full flex-col gap-6 sm:w-[400px]">
          <h2 className="text-xl font-semibold text-center">Where in Pakistan are you from?</h2>
          <input
            type="text"
            placeholder="City / Region"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border bg-transparent px-3 py-2 rounded-md w-full"
          />
          <div className="flex justify-end">
            <Button onClick={() => setStep("contact")} disabled={!location}>Continue</Button>
          </div>
        </div>
      ) : step === "contact" ? (
        <div className="mx-auto flex w-full flex-col gap-6 sm:w-[400px]">
          <h2 className="text-xl font-semibold text-center">What&apos;s your contact number or email?</h2>
          <input
            type="text"
            placeholder="Phone or Email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="border bg-transparent px-3 py-2 rounded-md w-full"
          />
          <div className="flex justify-end">
            <Button onClick={() => setStep("signup")} disabled={!contact}>Continue</Button>
          </div>
        </div>
      ) : (
        <>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute left-4 top-4 md:left-8 md:top-8"
            )}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Link>
          <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome to Magic UI</h1>
              <p className="text-sm text-muted-foreground">Sign up for an account</p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              <Link
                href="/signin"
                className="hover:text-brand underline underline-offset-4"
              >
                Already have an account? Sign In
              </Link>
            </p>
          </div>
        </>
      )}
    </>
  );
} 