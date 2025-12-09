import cowboyImage from '@popup/screens/OnboardingScreen/assets/cowboy-larger.png';
import { Footer } from '@popup/layouts/AppLayout/components/Footer';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen(props: OnboardingScreenProps) {
  const { onComplete } = props;

  return (
    <div className="app onboarding-screen">
      <div className="onboarding-screen__content">
        <div className="onboarding-screen__cowboy">
          <img
            src={cowboyImage}
            alt="Prompt Wrangler Cowboy"
            className="onboarding-screen__cowboy-image"
          />
        </div>

        <div className="onboarding-screen__card">
          <h1 className="onboarding-screen__title">Howdy, partner</h1>

          <p className="onboarding-screen__text">
            Welcome to <strong>Prompt Wrangler</strong>, my goal is to help keep personal info out
            of ChatGPT.
          </p>

          <p className="onboarding-screen__text">
            If I spot something sensitive, I'll redact it and let you know.
          </p>

          <p className="onboarding-screen__recommendation">
            For the best experience, pin me to your toolbar.
          </p>
        </div>

        <button type="button" className="onboarding-screen__button" onClick={onComplete}>
          Let's Go
        </button>
      </div>
      <Footer />
    </div>
  );
}
