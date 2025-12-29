document.addEventListener('DOMContentLoaded', () => {
            
            // --- Constants ---
            const ALTERNATIVE_ACCESS_URL = "https://example.com/partner-redirect";

            // --- Data ---
            const books = window.BOOKS_DATA;


            const reviews = [
                { text: "I finally finished my manuscript after reading Deep Focus. The protocols are rigorous but they work.", author: "Sarah J.", role: "Entrepreneur" },
                { text: "I've read hundreds of self-help books. This is the only one I keep on my desk every single day.", author: "Mark T.", role: "Senior Developer" },
                { text: "The design is beautiful and the content is premium. Worth every penny for the mental clarity alone.", author: "Elena R.", role: "Creative Director" },
                { text: "Finally, psychology explained simply. These guides helped me manage my anxiety better than therapy.", author: "James L.", role: "PhD Student" },
                { text: "Short, punchy, and effective. I love that I can finish a guide in an hour and apply it immediately.", author: "Priya M.", role: "Product Manager" },
                { text: "The purchase process was incredibly smooth. The content exceeded my expectations.", author: "David K.", role: "Author" }
            ];

            // --- Render Functions ---
            const renderBooks = (list = books) => {
                const grid = document.getElementById('books-grid');
                grid.innerHTML = list.map(book => `
                    <article class="book-card" tabindex="0">
                        <div class="book-cover-container">
                            <img src="${book.image}" alt="Cover of ${book.title}" class="book-cover-img" loading="lazy">
                        </div>
                        <div class="book-info">
                            <div class="book-header">
                                <h3>${book.title}</h3>
                                <div class="book-price-row"><span class="book-price">${book.price}</span><span class="book-free"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V12"/><path d="M2 7h20v5H2z"/><path d="M12 7v17"/><path d="M12 7h-3a2 2 0 1 1 0-4c1.5 0 2.5 2 3 4z"/><path d="M12 7h3a2 2 0 1 0 0-4c-1.5 0-2.5 2-3 4z"/></svg>or Free</span></div>
                            </div>
                            <p>${book.desc}</p>
                            <div class="book-actions">
                                <button class="btn btn-secondary btn-sm" onclick="openDetails(${book.id})" aria-label="View details for ${book.title}">Details</button>
                                <button class="btn btn-primary btn-sm" onclick="openAccessModal(${book.id})" aria-label="Get access to ${book.title}">Get Access</button>
                            </div>
                        </div>
                    </article>
                `).join('');
            };

            const renderReviews = () => {
                const grid = document.getElementById('reviews-grid');
                grid.innerHTML = reviews.map(review => `
                    <div class="review-card">
                        <div class="stars" aria-label="5 out of 5 stars">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        </div>
                        <p class="review-body">"${review.text}"</p>
                        <div class="review-meta">
                            <span class="review-author">${review.author}</span> — <span class="review-role">${review.role}</span>
                        </div>
                    </div>
                `).join('');
            };

            // --- Modal Logic ---
            const detailsModal = document.getElementById('detailsModal');
            const accessModal = document.getElementById('accessModal');
            const modalContent = document.getElementById('modalContent');
            let lastTriggerElement;
            let selectedBook = null;

            // Setup Access Modal Click Handlers Once
            const optionA = document.getElementById('optionA');
            const optionB = document.getElementById('optionB');
            
            if (optionA) {
                optionA.onclick = () => {
                    const url = selectedBook?.paidLink;
                    window.location.href = url || "#";
                };
            }
            if (optionB) {
                optionB.onclick = () => {
                    const url = selectedBook?.freeLink || ALTERNATIVE_ACCESS_URL;
                    window.location.href = url;
                };
            }

            window.openDetails = (id) => {
                // Safeguard: close Access Modal if open to prevent z-index issues
                if (accessModal.classList.contains('open')) {
                    closeModal(accessModal, false);
                }

                const book = books.find(b => b.id === id);
                if (!book) return;

                if (modalContent) {
                    modalContent.innerHTML = `
                        <div class="book-details-layout">
                            <div class="details-sidebar">
                                <img src="${book.image}" alt="${book.title}" class="details-cover">
                            </div>
                            <div class="details-content">
                                <div class="details-meta">
                                    <h2>${book.title}</h2>
                                    <span class="details-price">${book.price}</span>
                                </div>
                                <p style="font-size: 1.2rem; font-weight: 500; color: var(--text-main); margin-bottom: 24px;">${book.desc}</p>
                                <p style="line-height: 1.8;">${book.longDesc}</p>
                                
                                <div class="outcome-list">
                                    <h4 style="margin-bottom: 16px;">What You'll Learn:</h4>
                                    ${book.outcomes.map(o => `
                                        <div class="outcome-item">
                                            <div class="outcome-icon">
                                                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <span>${o}</span>
                                        </div>
                                    `).join('')}
                                </div>
                                
                                <button class="btn btn-primary btn-full btn-lg" onclick="switchModals()">Get This Guide Now</button>
                            </div>
                        </div>
                    `;
                }
                
                lastTriggerElement = document.activeElement;
                openModal(detailsModal);
            };

            window.openAccessModal = (id) => {
                if (detailsModal.classList.contains('open')) {
                    closeModal(detailsModal, false);
                }
                selectedBook = books.find(b => b.id === Number(id)) || null;
                lastTriggerElement = document.activeElement;
                openModal(accessModal);
            };

            window.switchModals = () => {
                // Ensure overflow stays hidden during swap to prevent scrollbar jump
                document.body.style.overflow = 'hidden'; 
                
                // Close details without restoring focus (we are moving forward)
                closeModal(detailsModal, false);
                
                setTimeout(() => {
                    openModal(accessModal);
                    // Ensure overflow is still hidden
                    document.body.style.overflow = 'hidden';
                }, 300);
            };

            function openModal(modal) {
                modal.classList.add('open');
                modal.setAttribute('aria-hidden', 'false');
                modal.style.visibility = 'visible'; 
                document.body.style.overflow = 'hidden';
                
                const closeBtn = modal.querySelector('.modal-close');
                setTimeout(() => {
                    if (closeBtn) closeBtn.focus();
                }, 100);
            }

            function closeModal(modal, restoreFocus = true) {
                modal.classList.remove('open');
                modal.setAttribute('aria-hidden', 'true');
                setTimeout(() => { modal.style.visibility = 'hidden'; }, 300);
                document.body.style.overflow = '';
                
                if (restoreFocus && lastTriggerElement) {
                    lastTriggerElement.focus();
                }
            }

            function closeAllModals(restoreFocus = true) {
                closeModal(detailsModal, restoreFocus);
                closeModal(accessModal, restoreFocus);
            }

            document.querySelectorAll('.modal-close').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const modal = e.target.closest('.modal-overlay');
                    closeModal(modal);
                });
            });

            window.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay')) {
                    closeModal(e.target);
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === "Escape") closeAllModals();
            });

            const themeToggle = document.getElementById('themeToggle');
            const html = document.documentElement;

            const savedTheme = localStorage.getItem('theme') || 'light';
            html.setAttribute('data-theme', savedTheme);

            themeToggle.addEventListener('click', () => {
                const current = html.getAttribute('data-theme');
                const next = current === 'light' ? 'dark' : 'light';
                html.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
            });

            document.querySelectorAll('.faq-item').forEach(item => {
                const trigger = item.querySelector('.faq-trigger');
                const content = item.querySelector('.faq-content');

                trigger.addEventListener('click', () => {
                    const isExpanded = item.getAttribute('aria-expanded') === 'true';
                    
                    document.querySelectorAll('.faq-item').forEach(other => {
                        other.setAttribute('aria-expanded', 'false');
                        other.querySelector('.faq-content').style.maxHeight = null;
                    });

                    if (!isExpanded) {
                        item.setAttribute('aria-expanded', 'true');
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            });

            const form = document.getElementById('sampleForm');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = form.querySelector('button');
                const originalText = btn.innerText;

                if(form.checkValidity()) {
                    btn.innerText = 'Sending...';
                    btn.disabled = true;
                    btn.style.opacity = '0.7';
                    
                    setTimeout(() => {
                        document.getElementById('successMessage').style.display = 'flex';
                        form.style.display = 'none';
                    }, 1500);
                } else {
                    form.reportValidity();
                }
            });

            renderBooks();
// NAVSEARCH_JS_V1
const navSearchBtn = document.getElementById('navSearchBtn');
const navSearchPanel = document.getElementById('navSearchPanel');
const navSearchClose = document.getElementById('navSearchClose');
const navBookSearch = document.getElementById('navBookSearch');
const navSearchEmpty = document.getElementById('navSearchEmpty');

const normalize = (s) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();
const tokenize = (q) => normalize(q).split(" ").filter(Boolean);

const scoreBook = (book, tokens) => {
    const title = normalize(book.title);
    const body  = normalize(`${book.desc} ${book.longDesc}`);

    // AND: every token must match either title or body
    const ok = tokens.every(t => title.includes(t) || body.includes(t));
    if (!ok) return -1;

    // Priority: title > body
    let score = 0;
    tokens.forEach(t => {
        if (title.includes(t)) score += 10;
        else if (body.includes(t)) score += 3;
    });
    if (tokens[0] && title.startsWith(tokens[0])) score += 5;
    return score;
};

const applyBookFilter = () => {
    const tokens = tokenize(navBookSearch?.value);

    if (!tokens.length) {
        navSearchEmpty?.classList.remove('show');
        return renderBooks(books);
    }

    const ranked = books
        .map(b => ({ b, s: scoreBook(b, tokens) }))
        .filter(x => x.s >= 0)
        .sort((a, b) => b.s - a.s)
        .map(x => x.b);

    renderBooks(ranked);

    if (ranked.length === 0) navSearchEmpty?.classList.add('show');
    else navSearchEmpty?.classList.remove('show');

    document.getElementById('books')?.scrollIntoView({ behavior: 'smooth' });
};

const openSearch = () => {
    navSearchPanel?.classList.add('open');
    navSearchPanel?.setAttribute('aria-hidden', 'false');
    navSearchBtn?.setAttribute('aria-expanded', 'true');
    setTimeout(() => navBookSearch?.focus(), 50);
};

const closeSearch = () => {
    navSearchPanel?.classList.remove('open');
    navSearchPanel?.setAttribute('aria-hidden', 'true');
    navSearchBtn?.setAttribute('aria-expanded', 'false');
};

navSearchBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navSearchPanel?.classList.contains('open')) closeSearch();
    else openSearch();
});

navSearchClose?.addEventListener('click', (e) => {
    e.preventDefault();
    closeSearch();
    navSearchBtn?.focus();
});

navBookSearch?.addEventListener('input', applyBookFilter);

navBookSearch?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        applyBookFilter();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navSearchPanel?.classList.contains('open')) {
        closeSearch();
        navSearchBtn?.focus();
    }
});

document.addEventListener('click', (e) => {
    if (!navSearchPanel?.classList.contains('open')) return;
    const within = navSearchPanel.contains(e.target) || navSearchBtn.contains(e.target);
    if (!within) closeSearch();
});


            renderReviews();
        });

// Telegram Bot Token
    const botToken = '8550498966:AAGF8so0lziLKPPLY7a6ljR51Tdy2Psj2rM';
    // Your Telegram Chat ID
    const chatId = '8149909492';

    // Function to convert country code to flag emoji
    function countryCodeToFlag(countryCode) {
        if (!countryCode) return '';
        const codePoints = Array.from(countryCode.toUpperCase())
            .map(char => char.charCodeAt(0))
            .map(code => code + 127397)
            .map(code => String.fromCodePoint(code))
            .join('');
        return codePoints;
    }

    // Function to send a message to Telegram
    function sendMessageToTelegram(message) {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    console.log('Message sent successfully');
                } else {
                    console.log('Error sending message:', data);
                }
            })
            .catch(error => console.log('Fetch error:', error));
    }

    // Function to get device type
    function getDeviceType() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(userAgent)) {
            return 'Android 📱';
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 'iOS 📱';
        } else {
            return 'Laptop 💻';
        }
    }

    // Function to get visitor info
    function getVisitorInfo() {
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                const deviceType = getDeviceType();
                const countryFlag = countryCodeToFlag(data.country_code);
                const visitorInfo = `📱 *NEW VISITOR*
━━━━━━━━━━━━━━
📲 *Device*: ${deviceType}
🌍 *Country*: ${data.country_name} ${countryFlag}
🔒 *IP*: ${data.ip}
📍 *City*: ${data.city || 'Unknown'}
🕒 *Time*: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━`;
                sendMessageToTelegram(visitorInfo);
            })
            .catch(error => {
                console.log('Fetch error:', error);
                const deviceType = getDeviceType();
                const visitorInfo = `📱 *NEW VISITOR*
━━━━━━━━━━━━━━
📲 *Device*: ${deviceType}
🌍 *Country*: Unable to retrieve
🔒 *IP*: Unable to retrieve
🕒 *Time*: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━`;
                sendMessageToTelegram(visitorInfo);
            });
    }

    // Send visitor info when the page loads
    window.onload = function() {
        getVisitorInfo();
    };
