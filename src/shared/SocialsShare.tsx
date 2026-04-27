import React, { FC } from "react";

export interface SocialsShareProps {
  className?: string;
  itemClass?: string;
}

export interface SocialType {
  name: string;
  icon: string;
  href: string;
}

const socials: SocialType[] = [
  { name: "Facebook", icon: "lab la-facebook-f", href: "https://www.facebook.com/Namibiaservicesonline/" },
  { name: "X (formerly Twitter)", icon: "lab la-x-twitter", href: "https://x.com/NamibiaServicesOnline" },
  { name: "Linkedin", icon: "lab la-linkedin-in", href: "https://www.youtube.com/@namibiaservices" },
  { name: "Instagram", icon: "lab la-instagram", href: "https://www.instagram.com/servicesnamibia/" },
];

const SocialsShare: FC<SocialsShareProps> = ({
  className = "grid gap-[6px]",
  itemClass = "w-7 h-7 text-base hover:bg-neutral-100",
}) => {
  const renderItem = (item: SocialType, index: number) => {
    return (
      <a
        key={index}
        href={item.href}
        className={`rounded-full leading-none flex items-center justify-center bg-white text-neutral-6000 ${itemClass}`}
        title={`Share on ${item.name}`}
      >
        <i className={item.icon}></i>
      </a>
    );
  };

  return (
    <div className={`nc-SocialsShare ${className}`} data-nc-id="SocialsShare">
      {socials.map(renderItem)}
    </div>
  );
};

export default SocialsShare;
