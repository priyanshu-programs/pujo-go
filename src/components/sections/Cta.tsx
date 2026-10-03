import { Reveal } from "@/components/ui/Reveal";
import { STAGGER } from "@/lib/motion";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { GetStartedLeftScreen, GetStartedRightScreen, YoutubeShortScreen } from "@/components/mockups/Screens";
import { storeLinks } from "@/content/site";

function AppleBadge() {
  return (
    <svg viewBox="0 0 100 40" className="h-10 w-[100px] fill-white">
      <path d="M12.038 12.211c.811-.974 1.211-2.226 1.115-3.49-1.24.13-2.385.723-3.208 1.66-.807.926-1.218 2.133-1.143 3.36 1.255.006 2.444-.557 3.236-1.53ZM14.77 20.3c.03-1.694.917-3.257 2.357-4.151-.923-1.301-2.398-2.099-3.992-2.158-1.679-.176-3.307 1.005-4.163 1.005-.872 0-2.19-.987-3.608-.958a5.37 5.37 0 0 0-4.473 2.728C-1.043 20.114.4 25.036 2.252 27.742c.927 1.325 2.01 2.805 3.428 2.753 1.387-.058 1.905-.885 3.58-.885 1.658 0 2.144.885 3.59.852 1.489-.024 2.426-1.332 3.32-2.67a11.9 11.9 0 0 0 1.52-3.092c-1.761-.756-2.907-2.484-2.92-4.4Z" />
      <text
        x="25"
        y="17"
        className="fill-white"
        style={{ font: "500 8px system-ui" }}
      >
        Coming soon on the
      </text>
      <text
        x="25"
        y="31"
        className="fill-white"
        style={{ font: "700 15px system-ui" }}
      >
        App Store
      </text>
    </svg>
  );
}

function GoogleBadge() {
  return (
    <svg viewBox="0 0 116 40" className="h-10 w-[116px]">
      <path
        d="M4.6 5.2a2 2 0 0 0-.5 1.4v26.8c0 .6.2 1 .5 1.4l.1.1L19.8 20v-.4L4.7 5.1l-.1.1Z"
        fill="#fff"
        opacity="0.9"
      />
      <path
        d="m24.8 25.1-5-5v-.4l5-5 .1.1 6 3.4c1.7 1 1.7 2.5 0 3.5l-6 3.4Z"
        fill="#fff"
        opacity="0.7"
      />
      <path
        d="M24.9 25 19.8 20 4.6 35.2c.6.6 1.5.6 2.6.1l17.7-10"
        fill="#fff"
        opacity="0.8"
      />
      <path
        d="M24.9 15 7.2 5c-1.1-.6-2-.5-2.6.1L19.8 20l5.1-5Z"
        fill="#fff"
      />
      <text x="38" y="17" style={{ font: "500 8px system-ui", fill: "#fff" }}>
        GET IT ON
      </text>
      <text x="38" y="31" style={{ font: "700 14px system-ui", fill: "#fff" }}>
        Google Play
      </text>
    </svg>
  );
}

function CentralShortScreen() {
  return <YoutubeShortScreen id="OChieJOAgF8" />;
}

/**
 * Closing CTA — copy and store badges above three stacked phones
 * (centered overlapping pile, front phone on top).
 */
export function Cta() {
  const phones = [
    // Side phones show static screenshots; hidden below `md`, where only the central phone is shown.
    { x: "-190px", rotate: -8, Screen: GetStartedLeftScreen, z: 10, box: "hidden md:block", scale: "md:scale-[0.65] lg:scale-100" },
    { x: "190px", rotate: 8, Screen: GetStartedRightScreen, z: 10, box: "hidden md:block", scale: "md:scale-[0.65] lg:scale-100" },
    // Central phone plays the YouTube Short; enlarged below `md` since it is alone there.
    { x: "0px", rotate: 0, Screen: CentralShortScreen, z: 20, box: "", scale: "scale-[0.95] sm:scale-110 md:scale-[0.65] lg:scale-100" },
  ];

  return (
    <section
      id="cta"
      className="overflow-hidden rounded-b-section bg-paper pb-8 pt-16 md:pb-0"
    >
      <div className="shell flex flex-col items-center gap-8">
        <Reveal>
          <h2 className="text-display-2 text-center font-display text-ink">
            Get started for free
          </h2>
        </Reveal>
        <Reveal delay={STAGGER}>
          <p className="max-w-blurb text-center text-body-lg text-ink">
            Download PujoGo on Android and start your next pandal-hopping adventure.
          </p>
        </Reveal>

        <Reveal delay={STAGGER * 2}>
          <div className="relative z-30 flex flex-row items-center justify-center gap-2 sm:gap-3">
            <div
              className="flex h-control items-center justify-center rounded-full border border-soft bg-surface/60 px-4 opacity-60 sm:px-6"
              aria-label="App Store — coming soon"
            >
              <AppleBadge />
            </div>
            <a
              href={storeLinks.google}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-control items-center justify-center rounded-full bg-surface px-4 transition-transform sm:px-6 duration-200 hover:scale-[1.03]"
              aria-label="Get it on Google Play"
            >
              <GoogleBadge />
            </a>
          </div>
        </Reveal>
      </div>

      {/* Phone stack — centered overlapping pile, clipped by the section */}
      <div id="cta-phones" className="relative mt-16 scroll-mt-24 h-[580px] sm:h-[680px] md:mt-20 md:h-[580px] lg:h-[680px]">
        {phones.map((phone, i) => (
          <div
            key={i}
            className={`absolute left-1/2 top-1/2 ${phone.box}`}
            style={{
              transform: `translate(-50%, -50%) translateX(${phone.x}) rotate(${phone.rotate}deg)`,
              zIndex: phone.z,
            }}
          >
            <div className={`origin-center ${phone.scale}`}>
              <PhoneFrame width={320} underlay={<phone.Screen />} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
