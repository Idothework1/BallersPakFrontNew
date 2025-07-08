"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/user-auth-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { TextAnimate } from "@/components/magicui/text-animate";

export default function SignupFlow() {
  type Step =
    | "intro"
    | "name"
    | "played"
    | "experience"
    | "gender"
    | "disability"
    | "location"
    | "contact"
    | "goal"
    | "more"
    | "done";
  const [step, setStep] = useState<Step>("intro");
  const [showConfirm, setShowConfirm] = useState(false);

  // Collected data (could be sent to backend later)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [playedBefore, setPlayedBefore] = useState<boolean | null>(null);
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [playedClub, setPlayedClub] = useState<boolean | null>(null);
  const [clubName, setClubName] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "">("");
  const [hasDisability, setHasDisability] = useState<boolean | null>(null);
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [goal, setGoal] = useState("");
  const [whyJoin, setWhyJoin] = useState("");

  const router = useRouter();

  const handleNoFirst = () => setShowConfirm(true);

  const handleConfirmNo = () => router.push("/");

  const handleConfirmYes = () => setShowConfirm(false);

  // Send data to backend and then redirect when user completes the flow
  useEffect(() => {
    if (step === "done") {
      // Prepare payload in intuitive format
      const payload = {
        firstName,
        lastName,
        playedBefore,
        experienceLevel,
        playedClub,
        clubName,
        gender,
        hasDisability,
        location,
        email,
        phone,
        position,
        goal,
        whyJoin,
      } as const;

      // Fire and forget – we still redirect even if saving fails
      fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Failed to save signup data", err);
      });

      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [step, router]);

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
            <Button onClick={() => setStep("goal")}>Yes</Button>
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
                setStep("gender");
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
                className="border bg-white text-black dark:text-black px-3 py-2 rounded-md w-full"
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
              onClick={() => setStep("gender")}
              disabled={playedClub === null || (playedClub && !clubName)}
            >
              Continue
            </Button>
          </div>
        </div>
      ) : step === "gender" ? (
        <div className="mx-auto flex w-full flex-col items-center gap-6 sm:w-[400px] text-center">
          <h2 className="text-xl font-semibold">Select your gender</h2>
          <div className="flex gap-4 justify-center">
            <Button
              variant={gender === "Male" ? undefined : "secondary"}
              onClick={() => setGender("Male")}
            >
              Male
            </Button>
            <Button
              variant={gender === "Female" ? undefined : "secondary"}
              onClick={() => setGender("Female")}
            >
              Female
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setStep("disability")} disabled={!gender}>
              Continue
            </Button>
          </div>
        </div>
      ) : step === "disability" ? (
        <div className="mx-auto flex w-full flex-col items-center gap-6 sm:w-[400px] text-center">
          <h2 className="text-xl font-semibold">Do you have any disability?</h2>
          <div className="flex gap-4 justify-center">
            <Button
              variant={hasDisability === false ? undefined : "secondary"}
              onClick={() => setHasDisability(false)}
            >
              No
            </Button>
            <Button
              variant={hasDisability === true ? undefined : "secondary"}
              onClick={() => setHasDisability(true)}
            >
              Yes
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setStep("location")} disabled={hasDisability === null}>
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
          <h2 className="text-xl font-semibold text-center">Your Contact Details</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border bg-transparent px-3 py-2 rounded-md w-full"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="03XX-XXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border bg-transparent px-3 py-2 rounded-md w-full"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setStep("more")} disabled={!email || !phone}>Continue</Button>
          </div>
        </div>
      ) : step === "goal" ? (
        <div className="mx-auto flex w-full flex-col gap-6 sm:w-[400px]">
          <h2 className="text-xl font-semibold text-center">What’s your biggest goal in football?</h2>
          <input
            type="text"
            placeholder="Your goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="border bg-transparent px-3 py-2 rounded-md w-full"
          />
          <div className="flex justify-end">
            <Button onClick={() => setStep("name")}>Continue</Button>
          </div>
        </div>
      ) : step === "more" ? (
        <div className="mx-auto flex w-full flex-col gap-6 sm:w-[400px]">
          <h2 className="text-xl font-semibold text-center">Tell us a bit more (optional)</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="position">What position do you play?</label>
              <input
                id="position"
                type="text"
                placeholder="e.g. Striker"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="border bg-transparent px-3 py-2 rounded-md w-full"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="why">Why do you want to join this program?</label>
              <input
                id="why"
                type="text"
                placeholder="Optional"
                value={whyJoin}
                onChange={(e) => setWhyJoin(e.target.value)}
                className="border bg-transparent px-3 py-2 rounded-md w-full"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setStep("done")}>Finish</Button>
          </div>
        </div>
      ) : (
        // DONE step
        <div className="mx-auto flex w-full h-full flex-col items-center justify-center gap-6 sm:w-[400px] text-center">
          <h1 className="text-3xl font-bold">You&apos;re all set!</h1>
          <p className="text-gray-400">Thank you for signing up. We&apos;re redirecting you to the homepage…</p>
          <p className="text-gray-500 italic max-w-xs">“We’ll review your form and reply within 24–48 hours with next steps.”</p>
        </div>
      )}
      {/* Auto redirect on done */}
      {step === "done" && (
        <></>
      )}
    </>
  );
} 