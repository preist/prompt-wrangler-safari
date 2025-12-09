import GithubIcon from '@popup/layouts/AppLayout/assets/github.svg?react';
import cactusImage from '@popup/layouts/AppLayout/assets/cactus.png';

export function Footer() {
  return (
    <footer className="app__footer">
      <a
        href="https://github.com/preist/prompt-wrangler"
        target="_blank"
        rel="noopener noreferrer"
        className="app__footer-link"
      >
        <GithubIcon className="app__footer-icon" />
        View Source
      </a>
      <img src={cactusImage} alt="" className="app__footer-cactus" width={360} height={100} />
    </footer>
  );
}
