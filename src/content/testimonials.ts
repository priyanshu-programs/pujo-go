/**
 * Three testimonials, carried verbatim from real reader reactions.
 *
 * Two card variants: "highlight" renders as a dark photo-backed card with a
 * gradient scrim and white text; "normal" is a light card with an avatar.
 * We alternate them for visual rhythm.
 */

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  variant: "highlight" | "normal";
  /** Gradient angle driving the dark-to-red ramp that stands in for the photo/avatar. */
  angle: number;
};

export const testimonialsIntro = {
  title: "Hear it from our users",
};

export const testimonials: Testimonial[] = [
  {
    id: "sreshthaesthetic",
    quote:
      '"YESSS (not to brag but Covid e ami 75 pandals dekhechilam)"',
    name: "@sreshthaesthetic",
    variant: "highlight",
    angle: 130,
  },
  {
    id: "aluusidd",
    quote:
      '"this is soo cool and innovative and oh so bengali coded i love it!"',
    name: "@aluusidd",
    variant: "normal",
    angle: 170,
  },
  {
    id: "trisha",
    quote:
      '"THIS IS SO AMAZING because one year i will find an amazing pandal in a niche neighbourhood and then next year forget the location."',
    name: "@_._trisha_._._._",
    variant: "highlight",
    angle: 210,
  },
];
