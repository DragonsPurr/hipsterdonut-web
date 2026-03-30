'use client';

import { useRef } from 'react';
import Image from 'next/image';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import { socialMedia, siteInfo, envConfig, externalLinkAttributes } from "@/app/lib/constants";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: { preventDefault(): void; currentTarget: HTMLFormElement }) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!envConfig.emailjs.serviceId || !envConfig.emailjs.templateId
      || !envConfig.emailjs.userId) {
      Swal.fire({
        icon: 'error',
        title: 'Configuration error',
        text: 'Email service is not configured.',
      });
      return;
    }
    emailjs.sendForm(envConfig.emailjs.serviceId,
      envConfig.emailjs.templateId, form, {
        publicKey: envConfig.emailjs.userId,
      }).then(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent Successfully',
        });
        form.reset();
      },
      (error: { text?: string }) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops, something went wrong',
          text: error.text,
        });
      }
    );
  };

  return (
    <div className="container mx-auto">
      <div className="hd-page-header">
        <strong>Contact</strong>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="hd-body-text-bold text-shadow-lg">
          <p>
            If you have any questions, comments, or concerns, please feel free to reach out to us on social media.
            <br /><br />
            <a href={socialMedia.bluesky} {...externalLinkAttributes}>
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Bluesky_Logo.svg"
                alt={`${siteInfo.name} on Bluesky`}
                className="inline mr-5 grayscale drop-shadow-[2px_2px_0_rgb(0_0_0)] contrast-200 brightness-200"
                width={32}
                height={32}
              />
            </a>
            <a href={socialMedia.heycafe} {...externalLinkAttributes}>
              <Image
                src="https://assets.heycafecdn.com/logos/svg/logo_round_transparent_purple.svg?cache=wqn4mia5vlfugr4"
                alt={`${siteInfo.name} on Hey.Café`}
                className="inline mr-5 grayscale drop-shadow-[2px_2px_0_rgb(0_0_0)] contrast-200 invert"
                width={32}
                height={32}
              />
            </a>
            <a href={socialMedia.eh} {...externalLinkAttributes}>
              <Image
                src="https://dp-assets.tor1.digitaloceanspaces.com/socials/Eh-Logo.svg"
                alt={`${siteInfo.name} on Eh!`}
                className="inline mr-5 grayscale drop-shadow-[2px_2px_0_rgb(0_0_0)] contrast-200 invert"
                width={32}
                height={32}
              />
            </a>
            <br /><br />
            Additionally, feel free to contact us via email through the form on this page.
          </p>
        </div>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="from_name" className="hd-form-label">
              <strong>Your Name</strong>
            </label>
            <input
              id="from_name"
              type="text"
              name="from_name"
              placeholder="Your Name"
              className="hd-form-input"
            />
          </div>
          <div>
            <label htmlFor="from_email" className="hd-form-label">
              <strong>Email Address</strong>
            </label>
            <input
              id="from_email"
              type="email"
              name="from_email"
              placeholder="Enter email"
              className="hd-form-input"
            />
          </div>
          <div>
            <label htmlFor="subject" className="hd-form-label">
              <strong>Subject</strong>
            </label>
            <input
              id="subject"
              type="text"
              name="subject"
              placeholder="Enter Subject"
              className="hd-form-input"
            />
          </div>
          <div>
            <label htmlFor="message" className="hd-form-label">
              <strong>Message</strong>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="hd-form-input"
            />
          </div>
          <button type="submit" className="hd-form-button">Submit</button>
        </form>
      </div>
    </div>
  );
}
