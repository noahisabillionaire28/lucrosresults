import { Card } from "./Card";
import { Chip } from "./Chip";
import { EmailCaptureForm } from "./EmailCaptureForm";
import { LogoMark } from "./Logo";
import { SectionHeading } from "./SectionHeading";
import { SectionWrapper } from "./SectionWrapper";

/** Centered "free stuff" card: logo tile straddles the top edge, then chip, 2-line headline, short copy, form. Used on the homepage and at the end of every blog post. */
export function TipsCard() {
  return (
    <SectionWrapper>
      <Card className="relative flex flex-col items-center px-6 pb-8 pt-14 text-center md:px-12 md:pb-10 md:pt-20">
        <LogoMark className="absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 -translate-y-1/2 md:h-20 md:w-20" />
        <Chip size="lg">Free stuff</Chip>
        <div className="mt-6">
          <SectionHeading className="text-center !text-[32px] md:!text-[60px] md:!leading-[1.08]">{"3 Tips to Get \n*Found First* on Google"}</SectionHeading>
        </div>
        <div className="mt-5 max-w-[390px] space-y-[18px] text-[16px] leading-[1.5] tracking-[-0.03em] text-body md:text-[18px] md:tracking-[-0.04em]">
          <p>A free short video showing the first three fixes we make for every client.</p>
          <p>Works for any local business.</p>
          <p>Enter your email for instant access.</p>
        </div>
        <EmailCaptureForm buttonLabel="Get My 3 FREE Tips" large className="mt-9 max-w-[560px] md:mt-11" />
      </Card>
    </SectionWrapper>
  );
}
