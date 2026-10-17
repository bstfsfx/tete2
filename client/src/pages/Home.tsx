import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Camera,
  Cat,
  Check,
  Clock3,
  Coffee,
  Crown,
  Heart,
  ImagePlus,
  Menu,
  Moon,
  PawPrint,
  Search,
  Smile,
  Sparkles,
  Star,
  Sun,
  Utensils,
  X,
} from "lucide-react";

type Photo = {
  src: string;
  alt: string;
  label: string;
  categories: string[];
  position?: string;
};

const photos: Photo[] = [
  {
    src: "/images/tete-portrait.webp",
    alt: "Tete looking up with curious green eyes",
    label: "Little sunshine",
    categories: ["Cute", "At Home", "With Me"],
    position: "center 44%",
  },
  {
    src: "/images/tete-sleeping.webp",
    alt: "Tete curled up for a cozy nap",
    label: "Sleepy Tete",
    categories: ["Sleeping", "Cute"],
    position: "center 54%",
  },
  {
    src: "/images/tete-playing.webp",
    alt: "Tete playing beside a little toy",
    label: "Play time",
    categories: ["Playing", "Cute", "Special"],
  },
  {
    src: "/images/tete-window.webp",
    alt: "Tete watching sunlight by the window",
    label: "Window watcher",
    categories: ["At Home", "Special"],
  },
  {
    src: "/images/tete-hero.webp",
    alt: "Tete resting on a soft cream blanket",
    label: "A soft afternoon",
    categories: ["Sleeping", "With Me"],
    position: "center 58%",
  },
  {
    src: "/images/tete-playing.webp",
    alt: "Tete getting ready for another game",
    label: "Tiny adventures",
    categories: ["Playing", "Special"],
    position: "left center",
  },
  {
    src: "/images/tete-window.webp",
    alt: "Tete keeping an eye on the garden",
    label: "Garden daydreams",
    categories: ["At Home", "Cute"],
    position: "right center",
  },
  {
    src: "/images/tete-eating.webp",
    alt: "Tete enjoying dinner from a little bowl",
    label: "Dinner with Tete",
    categories: ["Eating", "Cute"],
    position: "center",
  },
];

const filters = ["All", "Cute", "Sleeping", "Eating", "Playing", "At Home", "With Me", "Special"];
const navigation = [
  ["Home", "home"],
  ["Profile", "profile"],
  ["Story", "story"],
  ["Gallery", "gallery"],
  ["Personality", "personality"],
  ["Daily Life", "daily-life"],
  ["Favorites", "favorites"],
  ["Memory Wall", "memories"],
] as const;

const stories = [
  { date: "The Beginning", note: "我們第一次遇見 Tete。", color: "pink", image: "/images/tete-portrait.webp" },
  { date: "First Days Together", note: "Tete 開始熟悉新家。", color: "lavender", image: "/images/tete-sleeping.webp" },
  { date: "Becoming Family", note: "Tete 成為家裡的一份子。", color: "violet", image: "/images/tete-portrait.webp" },
  { date: "Every Day With Tete", note: "我們一起度過每天的小日子。", color: "gold", image: "/images/tete-window.webp" },
  { date: "More Memories To Come", note: "故事還在繼續。", color: "blue", image: "/images/tete-sleeping.webp" },
];

const dailyRoutine = [
  { time: "07:00", label: "Wake up", icon: Sun, tone: "sunny" },
  { time: "09:00", label: "Breakfast", icon: Coffee, tone: "peach" },
  { time: "11:00", label: "Nap", icon: Moon, tone: "blue" },
  { time: "14:00", label: "Play Time", icon: Sparkles, tone: "pink" },
  { time: "18:00", label: "Dinner", icon: Utensils, tone: "peach" },
  { time: "21:00", label: "Human Companion Time", icon: Heart, tone: "pink" },
  { time: "23:00", label: "Good Night", icon: Moon, tone: "blue" },
];

const momentCards: (
  | { type: "note"; className: string; date: string; text: string }
  | { type: "photo"; className: string; photo: Photo }
)[] = [
  { type: "note", className: "memo-note one", date: "2025/06/12", text: "今天 Tete\n睡在我的身邊。" },
  { type: "note", className: "memo-note two", date: "2025/06/10", text: "今天一起曬太陽。" },
  { type: "photo", className: "memo-photo three", photo: photos[3] },
  { type: "photo", className: "memo-photo four", photo: photos[2] },
  { type: "note", className: "memo-note five", date: "2025/06/08", text: "今天又被 Tete 的\n眼神融化了。" },
];

function SectionTitle({ children, icon: Icon }: { children: React.ReactNode; icon: typeof Cat }) {
  return (
    <h2 className="section-title">
      <span className="section-title-icon"><Icon size={21} strokeWidth={1.8} /></span>
      <span>{children}</span>
      <PawPrint className="title-paw" size={14} strokeWidth={1.6} />
    </h2>
  );
}

function PawStamp({ className = "" }: { className?: string }) {
  return <PawPrint aria-hidden="true" className={`paw-stamp ${className}`} size={22} strokeWidth={1.6} />;
}

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [likedMoments, setLikedMoments] = useState<number[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [petCount, setPetCount] = useState(1284);
  const [didPet, setDidPet] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const visiblePhotos = useMemo(
    () => selectedFilter === "All" ? photos : photos.filter((photo) => photo.categories.includes(selectedFilter)),
    [selectedFilter],
  );
  const matchingSections = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return [];
    return navigation.filter(([label]) => label.toLowerCase().includes(query));
  }, [searchTerm]);

  useEffect(() => {
    if (!activePhoto) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setActivePhoto(null);
    window.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("modal-open");
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("modal-open");
    };
  }, [activePhoto]);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const toggleMoment = (index: number) => {
    setLikedMoments((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); goTo("home"); }} aria-label="Tete home">
            <span className="brand-mark"><Cat size={29} strokeWidth={1.7} /></span>
            <span className="brand-word">Tete</span>
            <PawPrint className="brand-paw" size={16} />
          </a>
          <nav className={`desktop-nav ${menuOpen ? "nav-open" : ""}`} aria-label="Main navigation">
            {navigation.map(([label, id], index) => (
              <button key={id} className={`nav-link ${index === 0 ? "is-current" : ""}`} onClick={() => goTo(id)}>{label}</button>
            ))}
          </nav>
          <div className="topbar-actions">
            <button className={`icon-button top-heart ${isSaved ? "is-liked" : ""}`} aria-label={isSaved ? "Remove Tete from favorites" : "Add Tete to favorites"} title="Love Tete" onClick={() => setIsSaved((value) => !value)}>
              <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button className="icon-button" aria-label="Search the page" title="Search" onClick={() => { setSearchOpen((value) => !value); setMenuOpen(false); }}>
              <Search size={18} />
            </button>
            <button className="icon-button mobile-menu-button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => { setMenuOpen((value) => !value); setSearchOpen(false); }}>
              {menuOpen ? <X size={19} /> : <Menu size={20} />}
            </button>
          </div>
          {searchOpen && (
            <div className="search-popover">
              <label className="search-label" htmlFor="site-search">Find a little Tete story</label>
              <div className="search-input-wrap"><Search size={16} /><input id="site-search" autoFocus placeholder="Try “gallery” or “favorites”…" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /></div>
              {searchTerm && <div className="search-results">{matchingSections.length ? matchingSections.map(([label, id]) => <button key={id} onClick={() => goTo(id)}>{label}<ArrowUpRight size={14} /></button>) : <span>No little stories found yet.</span>}</div>}
            </div>
          )}
        </div>
      </header>

      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <img className="hero-image" src="/images/tete-hero.webp" alt="Tete resting on a soft cream blanket" />
          <div className="hero-wash" />
          <PawStamp className="hero-paw-one" />
          <PawStamp className="hero-paw-two" />
          <Cat className="hero-doodle cat-doodle" aria-hidden="true" size={88} strokeWidth={1.2} />
          <div className="hero-copy">
            <h1 id="hero-title">Meet Tete <PawPrint className="hero-title-paw" size={27} fill="currentColor" /></h1>
            <p className="hero-subtitle">My Best Companion</p>
            <p className="hero-intro">Tete，最好的陪伴。<span className="hero-heart">♡</span></p>
            <p className="hero-description">有些家人不會說話，<br />卻總是在你身邊。</p>
            <div className="hero-buttons">
              <button className="button button-primary" onClick={() => goTo("profile")}>Meet Tete <PawPrint size={15} fill="currentColor" /></button>
              <button className="button button-outline" onClick={() => goTo("story")}><BookOpen size={16} /> Our Little Story</button>
            </div>
          </div>
          <div className="hero-note">Good<br />Days<br />with Tete <span>♡</span></div>
        </section>

        <div className="page-content">
          <div className="dashboard-grid top-grid">
            <section className="paper-card profile-card" id="profile">
              <SectionTitle icon={Cat}>Hello, I’m Tete</SectionTitle>
              <span className="tiny-heart">♥</span>
              <div className="profile-content">
                <div className="portrait-wrap">
                  <img src="/images/tete-portrait.webp" alt="Portrait of Tete" className="profile-portrait" />
                  <span className="portrait-crown"><Crown size={25} /></span>
                  <span className="portrait-dot dot-one" /><span className="portrait-dot dot-two" />
                </div>
                <dl className="profile-facts">
                  <div><dt>Name</dt><dd>Tete</dd></div>
                  <div><dt>Nickname</dt><dd>Tete</dd></div>
                  <div><dt>Personality</dt><dd>Cute / Curious / Sweet</dd></div>
                  <div><dt>Favorite Food</dt><dd><span className="soft-placeholder">[Add information]</span></dd></div>
                  <div><dt>Favorite Toy</dt><dd><span className="soft-placeholder">[Add information]</span></dd></div>
                  <div><dt>Favorite Place</dt><dd><span className="soft-placeholder">[Add information]</span></dd></div>
                  <div><dt>Favorite Human</dt><dd>Me <span className="red-heart">♥</span></dd></div>
                  <div><dt>Special Skill</dt><dd>Being Cute</dd></div>
                  <div><dt>Daily Mission</dt><dd>Make My Human Smile</dd></div>
                </dl>
              </div>
              <PawStamp className="profile-paw" />
              <span className="paper-sparkle">✦</span>
            </section>

            <section className="paper-card story-card" id="story">
              <SectionTitle icon={BookOpen}>Our Little Story</SectionTitle>
              <div className="story-list">
                {stories.map((story, index) => (
                  <article className="story-row" key={story.date}>
                    <span className={`story-step ${story.color}`}>{index + 1}</span>
                    <div className="story-copy"><h3>{story.date}</h3><p>{story.note}</p></div>
                    <img className="story-thumb" src={story.image} alt="" />
                  </article>
                ))}
              </div>
              <PawStamp className="story-paw" />
            </section>

            <section className="paper-card gallery-card" id="gallery">
              <SectionTitle icon={Camera}>Tete’s Little Gallery</SectionTitle>
              <div className="filter-list" role="tablist" aria-label="Filter Tete photos">
                {filters.map((filter) => <button key={filter} role="tab" aria-selected={selectedFilter === filter} className={`filter-pill ${selectedFilter === filter ? "active" : ""}`} onClick={() => setSelectedFilter(filter)}>{filter}</button>)}
              </div>
              <div className="gallery-grid">
                {visiblePhotos.slice(0, 6).map((photo, index) => (
                  <button className="gallery-tile" key={`${photo.label}-${index}`} onClick={() => setActivePhoto(photo)} aria-label={`Open photo: ${photo.label}`}>
                    <img src={photo.src} alt={photo.alt} style={{ objectPosition: photo.position }} loading="lazy" />
                    <span className="gallery-tile-overlay"><span>{photo.label}</span><ArrowUpRight size={15} /></span>
                  </button>
                ))}
                {visiblePhotos.length < 4 && <button className="gallery-add-tile" onClick={() => setSelectedFilter("All")}><ImagePlus size={20} /><span>Your Tete photo<br />goes here</span><PawPrint size={13} /></button>}
              </div>
              <button className="view-gallery-link" onClick={() => setSelectedFilter("All")}>A few favorite moments <ArrowUpRight size={13} /></button>
            </section>
          </div>

          <div className="dashboard-grid middle-grid">
            <section className="paper-card personality-card" id="personality">
              <SectionTitle icon={PawPrint}>Tete’s Personality</SectionTitle>
              <div className="trait-list">
                {[
                  { icon: "♡", name: "Cuteness", stars: 5, color: "trait-pink" },
                  { icon: "☁", name: "Sleeping Skill", stars: 5, color: "trait-blue" },
                  { icon: "♧", name: "Food Motivation", stars: 5, color: "trait-gold" },
                  { icon: "✿", name: "Playfulness", stars: 4, color: "trait-orange" },
                  { icon: "✧", name: "Companion Skill", stars: 0, color: "trait-violet" },
                ].map((trait) => <div className="trait-row" key={trait.name}><span className={`trait-icon ${trait.color}`}>{trait.icon}</span><span className="trait-name">{trait.name}</span><span className="trait-stars" aria-label={trait.stars ? `${trait.stars} out of 5 stars` : "Unlimited love"}>{trait.stars ? Array.from({ length: 5 }, (_, index) => <Star key={index} size={13} fill={index < trait.stars ? "currentColor" : "#e9e1d6"} strokeWidth={1} />) : <span className="infinite-love">∞</span>}</span></div>)}
              </div>
              <div className="rating-ribbon"><Crown size={29} /><div><span>Official Rating:</span><strong>100<small>/10</small></strong></div><span className="ribbon-heart">♥</span><Cat className="ribbon-cat" size={45} strokeWidth={1.3} /></div>
            </section>

            <section className="paper-card daily-card" id="daily-life">
              <SectionTitle icon={Clock3}>A Day With Tete</SectionTitle>
              <div className="daily-content">
                <div className="routine-list">
                  {dailyRoutine.map(({ time, label, icon: Icon, tone }) => <div className="routine-row" key={time}><span className={`routine-icon ${tone}`}><Icon size={17} strokeWidth={1.8} /></span><time>{time}</time><span className="routine-label">{label}</span></div>)}
                </div>
                <div className="daily-doodle" aria-hidden="true">
                  <div className="speech-bubble">Life is better<br />with Tete <Heart size={12} fill="currentColor" /></div>
                  <span className="doodle-star star-a">✦</span><span className="doodle-star star-b">✧</span>
                  <div className="doodle-cat"><Cat size={87} strokeWidth={1.25} /><span>♡</span></div>
                  <span className="doodle-caption">purr & repeat</span>
                </div>
              </div>
            </section>

            <section className="paper-card loves-card" id="favorites">
              <SectionTitle icon={Heart}>Things Tete Loves</SectionTitle>
              <div className="loves-grid">
                {[
                  { label: "Food", src: "/images/tete-eating.webp", position: "center" },
                  { label: "Toys", src: "/images/tete-playing.webp", position: "right center" },
                  { label: "Sunlight", src: "/images/tete-window.webp", position: "center" },
                  { label: "Sofa", src: "/images/tete-sleeping.webp", position: "left center" },
                  { label: "Boxes", src: "/images/tete-portrait.webp", position: "center 60%" },
                  { label: "Naps", src: "/images/tete-sleeping.webp", position: "center 60%" },
                ].map((item) => <button className="love-item" key={item.label} onClick={() => setActivePhoto({ src: item.src, alt: `Tete loves ${item.label.toLowerCase()}`, label: item.label, categories: ["Cute"], position: item.position })}><img src={item.src} alt="" style={{ objectPosition: item.position }} loading="lazy" /><span>{item.label}</span></button>)}
              </div>
              <button className="human-strip" onClick={() => goTo("pet-tete")}><Heart size={15} /><span>Human</span><img src="/images/tete-portrait.webp" alt="" /><span className="human-hint">Tete’s favorite, always</span></button>
            </section>
          </div>

          <div className="dashboard-grid bottom-grid">
            <section className="paper-card memories-card" id="memories">
              <SectionTitle icon={Camera}>Little Moments</SectionTitle>
              <div className="memory-wall">
                {momentCards.map((item, index) => item.type === "note" ? (
                  <article className={item.className} key={index}><span className="memo-tape" /><p>{item.text}</p><time>{item.date}</time><button className={`memo-like ${likedMoments.includes(index) ? "liked" : ""}`} aria-label={likedMoments.includes(index) ? "Unlike this moment" : "Like this moment"} aria-pressed={likedMoments.includes(index)} onClick={() => toggleMoment(index)}><Heart size={13} fill={likedMoments.includes(index) ? "currentColor" : "none"} /></button></article>
                ) : (
                  <button className={item.className} key={index} aria-label={`Open memory: ${item.photo.label}`} onClick={() => setActivePhoto(item.photo)}><span className="photo-frame"><img src={item.photo.src} alt={item.photo.alt} loading="lazy" /></span><span className="memo-photo-like"><Heart size={12} fill="currentColor" /></span></button>
                ))}
                <button className="memory-add" onClick={() => setActivePhoto(photos[0])}><Camera size={20} /><span>Write a memory<br />about Tete</span><PawPrint size={13} /></button>
                <span className="memory-flower">✿</span><span className="memory-spark">✦</span>
              </div>
            </section>

            <section className={`paper-card pet-card ${didPet ? "pet-card-loved" : ""}`} id="pet-tete">
              <SectionTitle icon={Clock3}>Pet Tete <span className="pink-paw">♥</span></SectionTitle>
              <div className="pet-stage">
                <div className="pet-hearts"><span>♥</span><span>♡</span><span>♥</span></div>
                <img className="pet-portrait" src="/images/tete-portrait.webp" alt="Tete is ready for a gentle pet" />
                <div className="pet-speech">Tete says:<br /><strong>{didPet ? "Prrrr! ♥" : "Meow! ♥"}</strong></div>
                <span className="pet-sparkle pet-sparkle-one">✦</span><span className="pet-sparkle pet-sparkle-two">✧</span>
              </div>
              <button className="pet-button" onClick={() => { setPetCount((count) => count + 1); setDidPet(true); }}><span>{didPet ? "One More Pet" : "Pet Tete"}</span><PawPrint size={16} fill="currentColor" /></button>
              <div className="pet-counter"><p>How many times did you say<br /><strong>“Tete is cute”</strong> today?</p><div className="counter-total"><PawPrint size={29} fill="currentColor" /><strong>{petCount.toLocaleString()}</strong></div><span>Cute Moments</span><span className="counter-heart">♥</span></div>
            </section>

            <section className="paper-card quote-card" id="quote">
              <SectionTitle icon={Cat}>Tete’s Favorite Quote</SectionTitle>
              <blockquote>“Some companions<br />don’t need words.<br />They just need to be there.”</blockquote>
              <PawPrint className="quote-paw" size={19} />
              <div className="quote-photo"><img src="/images/tete-window.webp" alt="Tete by a sunny window" /><span>Tete ♡</span></div>
              <span className="quote-flower">✿</span>
            </section>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <a className="footer-brand" href="#home" onClick={(event) => { event.preventDefault(); goTo("home"); }}><span className="footer-cat"><Cat size={28} strokeWidth={1.7} /></span><span><small>Made with <Heart size={12} fill="currentColor" /> for Tete.</small><strong>paws, love & little things</strong></span></a>
          <div className="footer-signoff">Tete &amp; Human — Together, Every Day.<span><PawPrint size={14} /></span></div>
          <PawStamp className="footer-paw" />
          <button className="back-to-top" onClick={() => goTo("home")} aria-label="Back to top"><ArrowUpRight size={15} /><span>TOP</span></button>
        </div>
      </footer>

      {activePhoto && (
        <div className="lightbox" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActivePhoto(null); }}>
          <div className="lightbox-panel" role="dialog" aria-modal="true" aria-label={activePhoto.label}>
            <button className="lightbox-close" onClick={() => setActivePhoto(null)} aria-label="Close photo"><X size={19} /></button>
            <img src={activePhoto.src} alt={activePhoto.alt} style={{ objectPosition: activePhoto.position }} />
            <div className="lightbox-caption"><span><PawPrint size={15} /> {activePhoto.label}</span><button onClick={() => setActivePhoto(null)}>Back to Tete’s day <Check size={14} /></button></div>
          </div>
        </div>
      )}
      <div className="sr-only" aria-live="polite">{didPet ? "Tete is purring. Thank you for the gentle pet." : ""}</div>
      <div className="page-flair page-flair-a" aria-hidden="true">✧</div>
      <div className="page-flair page-flair-b" aria-hidden="true"><Smile size={17} /></div>
    </div>
  );
}
