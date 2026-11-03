/**
 * Team page content. ALL PLACEHOLDER: replace names, roles, handles, photos
 * and stats with the real details. Set `image` to a path under /public
 * (e.g. "/Images/team/jane.webp") to swap the gradient for a photo.
 */

export type TeamMember = {
  name: string;
  /** Rendered as `#Role` pills along the bottom of the card. */
  roles: string[];
  /** Optional `@handle` speech-bubble badge. */
  handle?: string;
  image?: string;
  /** Full profile URLs. A button shows on the card only when its URL is set. */
  linkedin?: string;
  instagram?: string;
};

export const teamHeader = {
  title: "Meet the team",
  lede: "The people behind PujoGo. Placeholder copy, details coming soon.",
};

export const teamMembers: TeamMember[] = [
  { name: "Rudranil Bhattacharjee", roles: ["Co-Creator", "Product Lead"], handle: "@handle", image: "/Images/Team/rudranil.avif",
    instagram: "https://www.instagram.com/official_rudranil/",
    linkedin: "https://www.linkedin.com/in/rudranilbhattacharjee/",
  },
  { name: "Sashikant Prasad", roles: ["Co-Creator", "Lead App Developer"], handle: "@handle", image: "/Images/Team/sashikant.avif",
    instagram: "https://www.instagram.com/shashi_kpd/",
    linkedin: "https://www.linkedin.com/in/shashikpd/",
  },
  { name: "Sourik Ray", roles: ["Co-Creator", "Backend Developer"], handle: "@handle", image: "/Images/Team/sourik.avif",
    instagram: "https://www.instagram.com/ray_s.in/",
    linkedin: "https://www.linkedin.com/in/sourik-ray-0755561b1/",
  },
  { name: "Nirvik Ghosh", roles: ["Co-Creator", "Dev Ops Lead"], handle: "@handle", image: "/Images/Team/nirvik.avif",
    instagram: "https://www.instagram.com/nirvik.py/",
    linkedin: "https://www.linkedin.com/in/nirvikghosh/",
  },
  { name: "Rahul Sinha", roles: ["Graphic Designer"], handle: "@handle", image: "/Images/Team/rahul.avif",
    instagram: "https://www.instagram.com/____leviathan____09/",
    linkedin: "https://www.linkedin.com/in/rahul-sinha-a46781273/",
  },
  { name: "Priyanshu Roy", roles: ["Website Designer", "Developer"], handle: "@handle", image: "/Images/Team/priyanshu.avif",
    instagram: "https://www.instagram.com/priyanshu.stuff/",
    linkedin: "https://www.linkedin.com/in/priyanshuroy/",
  },
];
