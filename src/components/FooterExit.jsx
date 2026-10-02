import { useEffect, useRef, useState } from 'react'
import { scrollToTarget } from '../lib/motion.js'
import Icon from './Icon.jsx'
const email = 'vyommehta197@gmail.com'
export default function FooterExit() {
  const [copyStatus, setCopyStatus] = useState('')
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const copy = async () => {
    clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(email)
      setCopyStatus('Email copied')
    } catch {
      setCopyStatus('Copy unavailable. Select the email address to copy it.')
    }
    timer.current = setTimeout(() => setCopyStatus(''), 4000)
  }
  return (
    <footer
      id="contact"
      className="contact-section page-gutter"
      aria-labelledby="contact-heading"
    >
      <div className="contact-top">
        <span className="availability">
          <i className="status-dot" />
          Available for product design & design engineering roles
        </span>
        <span className="contact-location">
          Bengaluru · Remote · Relocation
        </span>
      </div>
      <h2 id="contact-heading">
        Let’s make
        <br />
        <em>it matter.</em>
      </h2>
      <div className="contact-main">
        <p>
          I bring strategic product thinking and hands-on engineering to
          ambitious teams. Have something worth building?
        </p>
        <div className="contact-actions">
          <a className="button button-dark" href={'mailto:' + email}>
            Email Vishwas <Icon name="external" />
          </a>
          <a
            className="button"
            href="./resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            View résumé <Icon name="external" />
          </a>
          <a
            className="text-link"
            href="./resume.pdf"
            download="Vishwas-Mehta-Resume.pdf"
          >
            Download PDF <Icon name="arrow" />
          </a>
        </div>
      </div>
      <div className="contact-address">
        <a href={'mailto:' + email}>{email}</a>
        <button
          className="icon-button"
          onClick={copy}
          aria-label="Copy email address"
        >
          <Icon name="copy" />
        </button>
        <span className="copy-status" role="status">
          {copyStatus}
        </span>
      </div>
      <div className="footer-bottom">
        <span>Built silently by Vishwas Mehta</span>
        <div>
          <a
            href="https://linkedin.com/in/vyshwasmehta"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn <Icon name="external" />
          </a>
          <a
            href="https://github.com/vyshwas"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub <Icon name="external" />
          </a>
          <button onClick={() => scrollToTarget(0)}>
            Back to top <Icon name="arrow" />
          </button>
        </div>
      </div>
    </footer>
  )
}
