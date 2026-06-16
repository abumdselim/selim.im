import Image from "next/image";
import Link from "next/link";
import {
  FOOTER_TAGLINE,
  LOGO_URL,
} from "@/lib/constants";
import {
  FOOTER_COMPANY_LINKS,
  FOOTER_CONNECT_LINKS,
  FOOTER_INDUSTRIES_LINKS,
  SOCIAL_LINKS,
  footerWorkLinks,
} from "@/lib/constants-supplement";
import { FooterSocialButton } from "@/components/ui/SocialIcon";

function FooterColumn({
  title,
  links,
  className = "",
}: {
  title: string;
  links: readonly (readonly [string, string])[];
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">{title}</p>
      <ul className="space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-sm text-slate-300 hover:text-white transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const FOOTER_LINK_COLUMNS = [
  { title: "Company", links: FOOTER_COMPANY_LINKS, mobileCellClass: "border-r border-b border-slate-800/80" },
  { title: "Work", links: footerWorkLinks(), mobileCellClass: "border-b border-slate-800/80" },
  { title: "Industries", links: FOOTER_INDUSTRIES_LINKS, mobileCellClass: "border-r border-slate-800/80" },
  { title: "Connect", links: FOOTER_CONNECT_LINKS, mobileCellClass: "" },
] as const;

export function MegaFooter() {
  return (
    <footer className="w-full bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-10">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-xl lg:max-w-none mx-auto lg:mx-0">
          <Link href="/" className="inline-block">
            <Image
              src={LOGO_URL}
              alt="Inievo"
              width={140}
              height={36}
              className="h-9 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed mt-5 mb-0 max-w-sm mx-auto lg:mx-0">{FOOTER_TAGLINE}</p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mt-5 w-full">
            {SOCIAL_LINKS.map((s) => (
              <FooterSocialButton key={s.label} label={s.label} href={s.href} icon={s.icon} />
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-16 pt-2 border-t border-slate-800/80">
        <div className="grid grid-cols-2 sm:grid-cols-4 w-full sm:gap-6 lg:gap-10">
          {FOOTER_LINK_COLUMNS.map((column) => (
            <FooterColumn
              key={column.title}
              title={column.title}
              links={column.links}
              className={`px-4 py-5 sm:px-0 sm:py-0 text-left ${column.mobileCellClass} sm:border-0`}
            />
          ))}
        </div>
      </div>
      <div className="border-t border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center sm:text-left">
          <p className="text-slate-500 text-sm">
            © 2026 Inievo Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
