"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlignJustify, XIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const menuItem = [
  {
    id: 1,
    label: "About the Academy",
    href: "/about",
  },
  {
    id: 2,
    label: "Ambassador Program",
    href: "/ambassador",
  },
];

export function SiteHeader() {
  const mobilenavbarVariant = {
    initial: {
      opacity: 0,
      scale: 1,
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const mobileLinkVar = {
    initial: {
      y: "-20px",
      opacity: 0,
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const [hamburgerMenuIsOpen, setHamburgerMenuIsOpen] = useState(false);

  // Fade overlay for sign-up transition
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const handleSignUpClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsTransitioning(true);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("pageTransition"));
    }
    setTimeout(() => {
      router.push("/signup");
    }, 1000);
  };

  useEffect(() => {
    const html = document.querySelector("html");
    if (html) html.classList.toggle("overflow-hidden", hamburgerMenuIsOpen);
  }, [hamburgerMenuIsOpen]);

  useEffect(() => {
    const closeHamburgerNavigation = () => setHamburgerMenuIsOpen(false);
    window.addEventListener("orientationchange", closeHamburgerNavigation);
    window.addEventListener("resize", closeHamburgerNavigation);

    return () => {
      window.removeEventListener("orientationchange", closeHamburgerNavigation);
      window.removeEventListener("resize", closeHamburgerNavigation);
    };
  }, [setHamburgerMenuIsOpen]);

  return (
    <>
      {/* Black overlay for smooth transition */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black transition-opacity duration-1000 pointer-events-none",
          isTransitioning ? "opacity-100" : "opacity-0"
        )}
      />
      <header className="fixed left-0 top-0 z-40 w-full translate-y-[-1rem] animate-fade-in border-b opacity-0 backdrop-blur-[12px] [--animation-delay:600ms]">
        <div className="container flex h-[3.5rem] items-center justify-between">
          <Link className="text-md flex items-center" href="/">
            <Image
              src="/Logo.svg"
              alt="BallersPak logo"
              width={112}
              height={112}
              className="h-28 w-auto mt-14"
            />
          </Link>

          {/* Desktop navigation */}
          <ul className="absolute left-1/2 top-1/2 hidden md:flex -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            {menuItem.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex h-full items-center gap-3">
            <Link
              className={cn(
                buttonVariants({ variant: "outline" }),
                "text-sm"
              )}
              href="/login"
            >
              Log in
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "text-sm"
              )}
              href="/signup"
              onClick={handleSignUpClick}
            >
              Sign up
            </Link>
          </div>
          <button
            className="ml-6 md:hidden"
            onClick={() => setHamburgerMenuIsOpen((open) => !open)}
          >
            <span className="sr-only">Toggle menu</span>
            {hamburgerMenuIsOpen ? <XIcon /> : <AlignJustify />}
          </button>
        </div>
      </header>
      <AnimatePresence>
        <motion.nav
          initial="initial"
          exit="exit"
          variants={mobilenavbarVariant}
          animate={hamburgerMenuIsOpen ? "animate" : "exit"}
          className={cn(
            `fixed left-0 top-0 z-50 h-screen w-full overflow-auto bg-background/70 backdrop-blur-[12px] `,
            {
              "pointer-events-none": !hamburgerMenuIsOpen,
            }
          )}
        >
          <div className="container flex h-[3.5rem] items-center justify-between">
            <Link className="text-md flex items-center" href="/">
              <Image
                src="/Logo.svg"
                alt="BallersPak logo"
                width={112}
                height={112}
                className="h-28 w-auto mt-14"
              />
            </Link>

            <button
              className="ml-6 md:hidden"
              onClick={() => setHamburgerMenuIsOpen((open) => !open)}
            >
              <span className="sr-only">Toggle menu</span>
              {hamburgerMenuIsOpen ? <XIcon /> : <AlignJustify />}
            </button>
          </div>
          <motion.ul
            className={`flex flex-col md:flex-row md:items-center uppercase md:normal-case ease-in`}
            variants={containerVariants}
            initial="initial"
            animate={hamburgerMenuIsOpen ? "open" : "exit"}
          >
            {menuItem.map((item) => (
              <motion.li
                variants={mobileLinkVar}
                key={item.id}
                className="border-grey-dark pl-6 py-0.5 border-b md:border-none"
              >
                <Link
                  className={`hover:text-grey flex h-[var(--navigation-height)] w-full items-center text-xl transition-[color,transform] duration-300 md:translate-y-0 md:text-sm md:transition-colors ${
                    hamburgerMenuIsOpen ? "[&_a]:translate-y-0" : ""
                  }`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </motion.nav>
      </AnimatePresence>
    </>
  );
}
