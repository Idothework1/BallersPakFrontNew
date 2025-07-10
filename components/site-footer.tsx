import { DiscordLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Image from "next/image";

const footerNavs = [
  {
    label: "Academy",
    items: [
      {
        href: "/programs",
        name: "Training Programs",
      },
      {
        href: "/pricing",
        name: "Pricing",
      },
      {
        href: "/faq",
        name: "FAQ",
      },
    ],
  },

  {
    label: "Community",
    items: [
      {
        href: "https://www.instagram.com/ballerspak/",
        name: "Instagram",
      },
      {
        href: "https://facebook.com/ballerspak",
        name: "Facebook",
      },
      {
        href: "mailto:info@ballerspak.com",
        name: "Email",
      },
    ],
  },
  {
    label: "Legal",
    items: [
      {
        href: "/terms",
        name: "Terms",
      },

      {
        href: "/privacy",
        name: "Privacy",
      },
    ],
  },
];

const footerSocials = [
  {
    href: "https://www.instagram.com/ballerspak/",
    name: "Instagram",
    icon: <DiscordLogoIcon className="h-4 w-4" />,
  },
  {
    href: "https://facebook.com/ballerspak",
    name: "Facebook",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
];

export function SiteFooter() {
  return (
    <footer>
      <div className="mx-auto w-full max-w-screen-xl xl:pb-2">
        <div className="md:flex md:justify-between px-8 p-4 py-16 sm:pb-16 gap-4">
          <div className="mb-12 flex-col flex gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/Logo.svg" alt="BallersPak logo" width={40} height={40} className="h-10 w-10" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                BallersPak
              </span>
            </Link>
            <p className="max-w-xs">Pakistan&apos;s Leading Football Academy—Now Online</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:gap-10 sm:grid-cols-3">
            {footerNavs.map((nav) => (
              <div key={nav.label}>
                <h2 className="mb-6 text-sm tracking-tighter font-medium text-gray-900 uppercase dark:text-white">
                  {nav.label}
                </h2>
                <ul className="gap-2 grid">
                  {nav.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="cursor-pointer text-gray-400 hover:text-gray-200 duration-200 font-[450] text-sm"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex sm:items-center sm:justify-between rounded-md border-neutral-700/20 py-4 px-8 gap-2">
          <div className="flex space-x-5 sm:justify-center sm:mt-0">
            {footerSocials.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-600 fill-gray-500 hover:fill-gray-900 dark:hover:fill-gray-600"
              >
                {social.icon}
                <span className="sr-only">{social.name}</span>
              </Link>
            ))}
          </div>
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            Copyright © {new Date().getFullYear()}{" "}
            <Link href="/" className="cursor-pointer">
              BallersPak
            </Link>
            . All Rights Reserved.
          </span>
        </div>
      </div>
      {/*   <SiteBanner /> */}
    </footer>
  );
}
