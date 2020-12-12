import React from "react";
import Icon from "./Icon";

const email = "hello@wavefoundry.io";
const socialLinks = [
  {
    href: "https://facebook.com",
    title: "Follow us on Facebook",
    icon: "facebook",
    iconWidth: 24,
  },
  {
    href: "https://instagram.com",
    title: "Follow us on Instagram",
    icon: "instagram",
    iconWidth: 24,
  },
  {
    href: `mailto:${email}`,
    title: `Emai us at ${email}`,
    icon: "email",
    iconWidth: 24,
  },
];
const SocialButtons: React.FC<{ bgColor: string; bgHoverColor: string }> = ({
  bgColor,
  bgHoverColor,
}) => {
  return (
    <div className="flex -mx-2">
      {socialLinks.map(({ href, title, icon, iconWidth }) => {
        return (
          <div key={icon} className="px-2">
            <a
              className={`flex h-10 w-10 ${bgColor} hover:${bgHoverColor} text-white rounded-full justify-center items-center transition-colors transition-duration-150`}
              title={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name={icon} width={iconWidth} />
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default SocialButtons;
