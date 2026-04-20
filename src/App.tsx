import { useState } from 'react'
import './App.css'

type CartItem = {
  id: number
  name: string
  price: number
  qty: number
  emoji: string
}

const SAMPLE_ITEMS: CartItem[] = [
  { id: 1, name: 'Organic Apples', price: 3.49, qty: 2, emoji: '🍎' },
  { id: 2, name: 'Whole Milk (1L)', price: 1.89, qty: 1, emoji: '🥛' },
  { id: 3, name: 'Sourdough Bread', price: 4.25, qty: 1, emoji: '🍞' },
]

const NAV_ITEMS = [
  { icon: '🗺️', label: 'Navigation', desc: 'Find items in store' },
  { icon: '📋', label: 'Upload List', desc: 'Import your shopping list' },
  { icon: '📷', label: 'Scan Item', desc: 'Scan a barcode' },
  { icon: '🏷️', label: 'Weekly Deals', desc: 'Browse current offers' },
  { icon: '👤', label: 'My Account', desc: 'Profile & preferences' },
  { icon: '📊', label: 'Purchase History', desc: 'View past receipts' },
  { icon: '⚙️', label: 'Settings', desc: 'App preferences' },
  { icon: '❓', label: 'Help & Support', desc: 'Get assistance' },
]

const FEATURED = [
  { emoji: '🥦', name: 'Broccoli', price: 1.29, tag: 'Fresh' },
  { emoji: '🍗', name: 'Chicken Breast', price: 6.99, tag: 'Sale' },
  { emoji: '🧀', name: 'Cheddar Block', price: 3.79, tag: 'Popular' },
  { emoji: '🥚', name: 'Free-Range Eggs', price: 4.49, tag: 'Organic' },
  { emoji: '🫐', name: 'Blueberries', price: 2.99, tag: 'Fresh' },
  { emoji: '🥩', name: 'Ribeye Steak', price: 12.99, tag: 'Premium' },
]

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [listOpen, setListOpen] = useState(false)
  const [cartItems, _setCartItems] = useState<CartItem[]>(SAMPLE_ITEMS)
  const [myList, setMyList] = useState<CartItem[]>([])
  const [_addedId, setAddedId] = useState<number | null>(null)

  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0)
  const totalPrice = cartItems.reduce((s, i) => s + i.price * i.qty, 0)

  // function removeItem(id: number) {
  //   setCartItems(prev => prev.filter(i => i.id !== id))
  // }

  function removeFromList(id: number) {
    setMyList(prev => prev.filter(i => i.id !== id))
  }

  function addFeatured(item: typeof FEATURED[0]) {
    setMyList(prev => {
      const existing = prev.find(i => i.name === item.name)
      if (existing) return prev.map(i => i.name === item.name ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { id: Date.now(), name: item.name, price: item.price, qty: 1, emoji: item.emoji }]
    })
    setAddedId(Date.now())
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <div className="app-root">
      {/* Overlay */}
      {(sidebarOpen || cartOpen || listOpen) && (
        <div
          className="overlay"
          onClick={() => { setSidebarOpen(false); setCartOpen(false); setListOpen(false) }}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="brand-logo">🛒</span>
          <span className="brand-name">Carts & Co.</span>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button key={item.label} className="nav-item">
              <span className="nav-icon">{item.icon}</span>
              <div className="nav-text">
                <span className="nav-label">{item.label}</span>
                <span className="nav-desc">{item.desc}</span>
              </div>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="sidebar-tagline">Shop smarter. Shop faster.</p>
        </div>
      </aside>

      {/* Cart Panel */}
      <aside className={`cart-panel ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 className="cart-title">Your Cart</h2>
          <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <ul className="cart-items">
            {cartItems.map(item => (
              <li key={item.id} className="cart-item">
                <span className="cart-item-emoji">{item.emoji}</span>
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">${(item.price * item.qty).toFixed(2)} × {item.qty}</span>
                </div>
                {/* <button className="cart-remove" onClick={() => removeItem(item.id)}>✕</button> */}
              </li>
            ))}
          </ul>
        )}

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <span className="cart-total-price">${totalPrice.toFixed(2)}</span>
          </div>
          <button className="pay-btn" disabled={cartItems.length === 0}>
            Proceed to Pay →
          </button>
        </div>
      </aside>

      {/* My List Modal */}
      {listOpen && (
        <div className="modal-backdrop" onClick={() => setListOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">📋 My List</h2>
              <button className="close-btn" onClick={() => setListOpen(false)}>✕</button>
            </div>

            {myList.length === 0 ? (
              <div className="modal-empty">
                <span className="modal-empty-icon">📋</span>
                <p>Your list is empty</p>
                <p className="modal-empty-hint">Tap any featured item to add it here.</p>
              </div>
            ) : (
              <ul className="modal-list">
                {myList.map(item => (
                  <li key={item.id} className="modal-item">
                    <span className="modal-item-emoji">{item.emoji}</span>
                    <div className="modal-item-info">
                      <span className="modal-item-name">{item.name}</span>
                      <span className="modal-item-price">${item.price.toFixed(2)} each</span>
                    </div>
                    <span className="modal-item-qty">×{item.qty}</span>
                    <button className="cart-remove" onClick={() => removeFromList(item.id)}>✕</button>
                  </li>
                ))}
              </ul>
            )}

            <div className="modal-footer">
              <p className="modal-count">{myList.length} item{myList.length !== 1 ? 's' : ''} in list</p>
              <button className="modal-clear" onClick={() => setMyList([])}>Clear All</button>
            </div>
          </div>
        </div>
      )}

      {/* Top Nav Bar */}
      <header className="topbar">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          <span /><span /><span />
        </button>
        <div className="topbar-brand">
          <span className="topbar-logo">🛒</span>
          <span className="topbar-title">Carts & Co.</span>
        </div>
        <button className="cart-btn" onClick={() => setCartOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Banner */}
        <section className="hero-banner">
          <div className="hero-text">
            <h1 className="hero-headline">Smart Shopping,<br />Simplified.</h1>
            <p className="hero-sub">Scan, navigate & checkout without the wait.</p>
            <button className="hero-cta">Start Shopping</button>
          </div>
          <div className="hero-visual">
            <div className="hero-cart-icon">🛒</div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <button className="qa-card qa-green">
            <span className="qa-icon">📷</span>
            <span>Scan Item</span>
          </button>
          <button className="qa-card qa-yellow">
            <span className="qa-icon">🗺️</span>
            <span>Navigate</span>
          </button>
          <button className="qa-card qa-dark" onClick={() => setListOpen(true)}>
            <span className="qa-icon">📋</span>
            <span>My List</span>
            {myList.length > 0 && <span className="qa-badge">{myList.length}</span>}
          </button>
          <button className="qa-card qa-outline">
            <span className="qa-icon">🏷️</span>
            <span>Deals</span>
          </button>
        </section>

        {/* Featured Products */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Featured Today</h2>
            <button className="see-all">See all →</button>
          </div>
          <div className="products-grid">
            {FEATURED.map(item => {
              const inList = myList.find(i => i.name === item.name)
              return (
                <div
                  key={item.name}
                  className={`product-card ${inList ? 'product-card--listed' : ''}`}
                  onClick={() => addFeatured(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && addFeatured(item)}
                >
                  <span className="product-tag">{item.tag}</span>
                  {inList && <span className="product-check">✓</span>}
                  <span className="product-emoji">{item.emoji}</span>
                  <p className="product-name">{item.name}</p>
                  <div className="product-bottom">
                    <span className="product-price">${item.price.toFixed(2)}</span>
                    <span className={`add-btn ${inList ? 'add-btn--added' : ''}`}>
                      {inList ? '✓' : '+'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Store Info Banner */}
        <section className="info-banner">
          <div className="info-item">
            <span className="info-icon">📍</span>
            <div>
              <p className="info-label">Current Store</p>
              <p className="info-value">Al Wahda Mall Branch</p>
            </div>
          </div>
          <div className="info-divider" />
          <div className="info-item">
            <span className="info-icon">⏰</span>
            <div>
              <p className="info-label">Store Hours</p>
              <p className="info-value">8:00 AM – 11:00 PM</p>
            </div>
          </div>
          <div className="info-divider" />
          <div className="info-item">
            <span className="info-icon">🏎️</span>
            <div>
              <p className="info-label">Cart Status</p>
              <p className="info-value">Cart #A-07 Active</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
