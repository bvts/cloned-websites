'use client';

import React from 'react';
import Link from 'next/link';
import FilmGrain from '@/components/FilmGrain';
import HomeLink from '@/components/HomeLink';

export default function CartPage() {
  return (
    <>
      <div id="night" aria-hidden="true" />
      <FilmGrain />

      <main className="bs-page-main">
        <section className="view active" aria-label="Cart">
          <div className="plate">
            <h1>Cart</h1>
          </div>

          <nav className="bs-nav" aria-label="Shop">
            <Link href="/#shop">shop</Link>
            <Link href="/cart" aria-current="page">
              cart (0)
            </Link>
          </nav>

          <div className="frame">
            <div className="bs-cart">
              <div className="bs-cart-empty">
                <p className="bs-empty">your cart is empty</p>
                <Link className="bs-btn" style={{ maxWidth: '280px' }} href="/#shop">
                  continue shopping
                </Link>
              </div>
            </div>

            <HomeLink onNavigate={() => (window.location.href = '/#home')} />
          </div>
        </section>
      </main>
    </>
  );
}
