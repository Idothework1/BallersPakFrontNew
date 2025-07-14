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
    | "birthday"
    | "played"
    | "experience"
    | "gender"
    | "disability"
    | "location"
    | "contact"
    | "goal"
    | "position"
    | "position-secondary"
    | "more"
    | "privacy"
    | "done";
  const [step, setStep] = useState<Step>("intro");
  const [showConfirm, setShowConfirm] = useState(false);

  // Collected data (could be sent to backend later)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [playedBefore, setPlayedBefore] = useState<boolean | null>(null);
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [playedClub, setPlayedClub] = useState<boolean | null>(null);
  const [clubName, setClubName] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "">("");
  const [hasDisability, setHasDisability] = useState<boolean | null>(null);
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [primaryPosition, setPrimaryPosition] = useState("");
  const [secondaryPosition, setSecondaryPosition] = useState("");
  const [customSecondaryPosition, setCustomSecondaryPosition] = useState("");
  const [position, setPosition] = useState(""); // Keep for backward compatibility
  const [goal, setGoal] = useState("");
  const [whyJoin, setWhyJoin] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const router = useRouter();

  const handleNoFirst = () => setShowConfirm(true);

  const handleConfirmNo = () => router.push("/");

  const handleConfirmYes = () => setShowConfirm(false);

  // Phone number validation for Pakistani numbers
  const validatePhoneNumber = (number: string) => {
    // Remove any spaces or dashes
    const cleanNumber = number.replace(/[\s-]/g, '');
    // Pakistani mobile numbers: 10 digits starting with 3
    const pakistaniMobilePattern = /^3\d{9}$/;
    return pakistaniMobilePattern.test(cleanNumber);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove non-digits
    const numbers = value.replace(/\D/g, '');
    // Limit to 10 digits for Pakistani numbers
    const limited = numbers.slice(0, 10);
    // Format as 3XX-XXXXXXX
    if (limited.length >= 4) {
      return limited.slice(0, 3) + '-' + limited.slice(3);
    }
    return limited;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  // Send data to backend and then redirect when user completes the flow
  useEffect(() => {
    if (step === "done") {
      // Get the final secondary position value
      const finalSecondaryPosition = secondaryPosition === "Other" ? customSecondaryPosition : secondaryPosition;
      
      // Combine primary and secondary positions for the legacy position field
      const combinedPosition = finalSecondaryPosition 
        ? `${primaryPosition} (Secondary: ${finalSecondaryPosition})`
        : primaryPosition;

      // Prepare payload in intuitive format
      const payload = {
        firstName,
        lastName,
        birthday,
        playedBefore,
        experienceLevel,
        playedClub,
        clubName,
        gender,
        hasDisability,
        location,
        email,
        phone: "+92" + phone.replace(/\D/g, ''), // Clean phone number with Pakistan country code
        position: combinedPosition,
        primaryPosition,
        secondaryPosition: finalSecondaryPosition,
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
  }, [step, router, firstName, lastName, birthday, playedBefore, experienceLevel, playedClub, clubName, gender, hasDisability, location, email, phone, primaryPosition, secondaryPosition, customSecondaryPosition, goal, whyJoin]);

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
              onClick={() => setStep("birthday")}
              disabled={!firstName || !lastName}
            >
              Continue
            </Button>
          </div>
        </div>
      ) : step === "birthday" ? (
        <div className="mx-auto flex w-full flex-col gap-6 sm:w-[400px]">
          <h2 className="text-xl font-semibold text-center">Your Birthday</h2>
          <p className="text-gray-400 text-center text-sm">
            This will be used as your profile password when you&apos;re approved as a member
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="birthday">
                Date of Birth
              </label>
              <input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="border bg-transparent px-3 py-2 rounded-md w-full"
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString().split('T')[0]}
                min={new Date(new Date().setFullYear(new Date().getFullYear() - 50)).toISOString().split('T')[0]}
              />
              {birthday && (
                <p className="text-xs text-gray-400 mt-1">
                  Remember this date - you&apos;ll use it to log in to your profile
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => setStep("played")}
              disabled={!birthday}
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
              <div className="flex gap-2">
                <div className="border border-gray-500 bg-gray-100 text-black px-3 py-2 rounded-md flex items-center text-sm font-medium">
                  🇵🇰 +92
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="3XX-XXXXXXX"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="border bg-transparent px-3 py-2 rounded-md flex-1"
                  maxLength={12} // 3XX-XXXXXXX format
                />
              </div>
              {phone && !validatePhoneNumber(phone.replace(/\D/g, '')) && (
                <p className="text-red-400 text-xs mt-1">
                  Please enter a valid Pakistani mobile number (10 digits starting with 3)
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={() => setStep("position")} 
              disabled={!email || !phone || !validatePhoneNumber(phone.replace(/\D/g, ''))}
            >
              Continue
            </Button>
          </div>
        </div>
      ) : step === "position" ? (
        <div className="mx-auto flex w-full flex-col gap-6 sm:w-[400px]">
          <h2 className="text-xl font-semibold text-center">Which position do you currently play or want to master?</h2>
          <div className="flex flex-col gap-3">
            {[
              "Goalkeeper",
              "Defender (Center Back / Full Back)",
              "Midfielder (Defensive / Central / Attacking)",
              "Forward (Winger / Striker)"
            ].map((pos) => (
              <Button
                key={pos}
                variant={primaryPosition === pos ? undefined : "secondary"}
                onClick={() => setPrimaryPosition(pos)}
                className="text-left justify-start h-auto py-3 px-4"
              >
                {pos}
              </Button>
            ))}
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={() => setStep("position-secondary")} 
              disabled={!primaryPosition}
            >
              Continue
            </Button>
          </div>
        </div>
      ) : step === "position-secondary" ? (
        <div className="mx-auto flex w-full flex-col gap-6 sm:w-[400px]">
          <h2 className="text-xl font-semibold text-center">Do you play any other position or have a specific play style?</h2>
          <p className="text-gray-400 text-center text-sm">This is optional</p>
          <div className="flex flex-col gap-3">
            {[
              "I'm a versatile player",
              "I'm still exploring my best position",
              "Other"
            ].map((option) => (
              <Button
                key={option}
                variant={secondaryPosition === option ? undefined : "secondary"}
                onClick={() => {
                  if (option === "Other") {
                    setSecondaryPosition("Other");
                    setCustomSecondaryPosition("");
                  } else {
                    setSecondaryPosition(option);
                    setCustomSecondaryPosition("");
                  }
                }}
                className="text-left justify-start h-auto py-3 px-4"
              >
                {option}
              </Button>
            ))}
          </div>
          {secondaryPosition === "Other" && (
            <input
              type="text"
              placeholder="Please specify..."
              value={customSecondaryPosition}
              onChange={(e) => setCustomSecondaryPosition(e.target.value)}
              className="border bg-transparent px-3 py-2 rounded-md w-full mt-2"
            />
          )}
          <div className="flex justify-end gap-4">
            <Button variant="secondary" onClick={() => setStep("more")}>
              Skip
            </Button>
            <Button onClick={() => setStep("more")}>
              Continue
            </Button>
          </div>
        </div>
      ) : step === "goal" ? (
        <div className="mx-auto flex w-full flex-col gap-6 sm:w-[400px]">
          <h2 className="text-xl font-semibold text-center">What&apos;s your biggest goal in football?</h2>
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
          <h2 className="text-xl font-semibold text-center">Almost done!</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="why">Why do you want to join this program?</label>
              <textarea
                id="why"
                placeholder="Optional - Tell us what motivates you..."
                value={whyJoin}
                onChange={(e) => setWhyJoin(e.target.value)}
                className="border bg-transparent px-3 py-2 rounded-md w-full h-20 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setStep("privacy")}>Continue</Button>
          </div>
        </div>
      ) : step === "privacy" ? (
        <div className="mx-auto flex w-full flex-col gap-6 sm:w-[400px]">
          <h2 className="text-xl font-semibold text-center">Legal Agreements</h2>
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 text-sm text-gray-300">
            <p className="mb-4">
              Before we can create your account, we need your agreement to our legal documents.
            </p>
            <p className="mb-4">
              These documents explain our service terms, how we protect children&apos;s privacy, and what rights parents and guardians have regarding their child&apos;s data.
            </p>
            <p className="font-medium text-white">
              Please read our{" "}
              <Link 
                href="/privacy-policy" 
                target="_blank"
                className="text-blue-300 hover:text-blue-200 underline font-semibold"
              >
                Parental Control & Privacy Policy
              </Link>{" "}
              and{" "}
              <Link 
                href="/terms" 
                target="_blank"
                className="text-blue-300 hover:text-blue-200 underline font-semibold"
              >
                Terms of Service
              </Link>{" "}
              carefully.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border border-gray-600 rounded-lg">
              <input
                type="checkbox"
                id="privacy-agreement"
                checked={privacyAgreed}
                onChange={(e) => setPrivacyAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="privacy-agreement" className="text-sm text-gray-300 leading-relaxed">
                <span className="text-white font-medium">I agree</span> to the Parental Control & Privacy Policy. 
                I understand how my data will be collected, used, and protected. If I am under 18, 
                my parent or guardian has provided consent for me to use this platform.
              </label>
            </div>
            
            <div className="flex items-start gap-3 p-4 border border-gray-600 rounded-lg">
              <input
                type="checkbox"
                id="terms-agreement"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="terms-agreement" className="text-sm text-gray-300 leading-relaxed">
                <span className="text-white font-medium">I agree</span> to the Terms of Service. 
                I understand the rules of conduct, refund policies, liability limitations, and other terms governing the use of this platform.
              </label>
            </div>
          </div>
          
          <div className="flex justify-between gap-4">
            <Button variant="secondary" onClick={() => setStep("more")}>
              Back
            </Button>
            <Button 
              onClick={() => setStep("done")} 
              disabled={!privacyAgreed || !termsAgreed}
              className={!privacyAgreed || !termsAgreed ? "opacity-50 cursor-not-allowed" : ""}
            >
              Complete Registration
            </Button>
          </div>
        </div>
      ) : (
        // DONE step
        <div className="mx-auto flex w-full h-full flex-col items-center justify-center gap-6 sm:w-[400px] text-center">
          <h1 className="text-3xl font-bold">You&apos;re all set!</h1>
          <p className="text-gray-400">Thank you for signing up. We&apos;re redirecting you to the homepage…</p>
          
          <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4 max-w-sm">
            <h3 className="text-blue-300 font-semibold mb-2">📅 Remember Your Login</h3>
            <p className="text-blue-200 text-sm">
              Your <strong>birthday</strong> will be your password when you&apos;re approved as a member. 
              Use your email + birthday to access your profile.
            </p>
          </div>
          
          <p className="text-gray-500 italic max-w-xs">&ldquo;We&apos;ll review your form and reply within 24–48 hours with next steps.&rdquo;</p>
        </div>
      )}
      {/* Auto redirect on done */}
      {step === "done" && (
        <></>
      )}
    </>
  );
} 