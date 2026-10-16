'use client';

import React from 'react';
import Link from 'next/link';
import FilmGrain from '@/components/FilmGrain';
import HomeLink from '@/components/HomeLink';

export default function HelpPage() {
  return (
    <>
      <div id="night" aria-hidden="true" />
      <FilmGrain />

      <main className="bs-page-main">
        <section className="view active" aria-label="Help">
          <div className="plate">
            <h1>Help</h1>
          </div>

          <nav className="bs-nav" aria-label="Shop">
            <Link href="/#shop">shop</Link>
            <Link href="/cart">cart (0)</Link>
          </nav>

          <div className="frame">
            <div className="bs-help">
              <div className="bs-policies">
                <div className="bs-policy">
                  <h2>Refunds</h2>
                  <p>
                    we have a strict no-refund and no-chargeback policy. if there is a chargeback
                    placed on your order, it will not be sent out unless said chargeback is revoked
                    and proof is sent to us at bleood@goocorp.co. there are also no refunds under any
                    circumstances with our store.
                  </p>
                </div>

                <div className="bs-policy">
                  <h2>Delays</h2>
                  <p>
                    when you purchase an item from our store, you are accepting the fact that errors
                    or unexpected delays may arise in the timeframe of you purchasing the product, to
                    the time it takes to get to your door. we guarantee that we will get you the items
                    you ordered, no matter how many errors or delays come up. all we ask for is your
                    patience in times where things happen that are out of our hands.
                  </p>
                </div>

                <div className="bs-policy">
                  <h2>Shipping</h2>
                  <p>
                    please allow 1-2 weeks for us to prepare and ship your order. you will receive
                    shipping confirmation once your order has been sent.
                  </p>
                </div>

                <div className="bs-policy">
                  <h2>False delivery</h2>
                  <p>
                    if the address on your order is correct and the tracking number shows that your
                    package has been delivered, but you do not have it, we are not responsible for
                    what has happened to it. you will need to contact the courier to open an
                    investigation and find out what happened.
                  </p>
                </div>
              </div>

              <div className="bs-contact">
                <h2>Contact</h2>
                <form
                  className="bs-form"
                  id="BleoodContact-template--24387944185892__main"
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Intentionally inactive per specifications: no network request, no reload, no field clearing
                  }}
                >
                  <div className="bs-form-row">
                    <input
                      className="bs-input"
                      type="text"
                      name="contact[name]"
                      autoComplete="name"
                      placeholder="name"
                      aria-label="Name"
                    />
                    <input
                      className="bs-input"
                      type="email"
                      name="contact[email]"
                      autoComplete="email"
                      placeholder="email *"
                      aria-label="Email"
                      required
                      spellCheck={false}
                      autoCapitalize="off"
                    />
                  </div>
                  <input
                    className="bs-input"
                    type="text"
                    name="contact[order]"
                    placeholder="order # (if any)"
                    aria-label="Order number"
                  />
                  <textarea
                    className="bs-input"
                    name="contact[body]"
                    rows={6}
                    placeholder="message"
                    aria-label="Message"
                  />
                  <button type="submit" className="bs-btn">
                    send
                  </button>
                </form>
                <div className="bs-mail">
                  <a className="bs-link" href="mailto:bleood@goocorp.co">
                    bleood@goocorp.co
                  </a>
                </div>
              </div>
            </div>

            <HomeLink onNavigate={() => (window.location.href = '/#home')} />
          </div>
        </section>
      </main>
    </>
  );
}
