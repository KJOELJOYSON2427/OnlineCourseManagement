import React, { useEffect, useMemo, useState } from 'react';

const courses = [
  {
    id: 'design-systems',
    title: 'Design systems from the ground up',
    category: 'Design',
    level: 'Intermediate',
    instructor: 'Maya Chen',
    role: 'Design lead at Figma',
    duration: '6 weeks',
    schedule: 'Tue & Thu · 10:00 AM',
    startDate: 'Oct 28',
    price: 89,
    rating: '4.9',
    students: 1240,
    seats: 8,
    description: 'Build a design system that actually scales. From tokens and components to documentation your team will love.',
    image: 'photo-1558655146-9f40138edfeb',
    color: 'lilac',
    icon: '✳',
    tags: ['Figma', 'Components', 'Design ops'],
  },
  {
    id: 'data-storytelling',
    title: 'Data storytelling with Python',
    category: 'Data & Tech',
    level: 'Beginner',
    instructor: 'Jordan Lee',
    role: 'Data journalist at The Pudding',
    duration: '4 weeks',
    schedule: 'Mon & Wed · 1:00 PM',
    startDate: 'Nov 3',
    price: 69,
    rating: '4.8',
    students: 986,
    seats: 5,
    description: 'Turn messy spreadsheets into clear, compelling stories with Python, thoughtful visuals, and a little curiosity.',
    image: 'photo-1551288049-bebda4e38f71',
    color: 'peach',
    icon: '↗',
    tags: ['Python', 'Visualization', 'Storytelling'],
  },
  {
    id: 'creative-writing',
    title: 'Write the story only you can tell',
    category: 'Writing',
    level: 'All levels',
    instructor: 'Avery Brooks',
    role: 'Author & writing coach',
    duration: '5 weeks',
    schedule: 'Wed · 6:00 PM',
    startDate: 'Nov 5',
    price: 55,
    rating: '5.0',
    students: 752,
    seats: 12,
    description: 'Find your voice, get unstuck, and make a writing practice that sticks in this welcoming, hands-on workshop.',
    image: 'photo-1455390582262-044cdead277a',
    color: 'sage',
    icon: '❝',
    tags: ['Creative practice', 'Feedback', 'Voice'],
  },
  {
    id: 'product-thinking',
    title: 'Product thinking for everyone',
    category: 'Business',
    level: 'Beginner',
    instructor: 'Sam Rivera',
    role: 'Product director at Linear',
    duration: '3 weeks',
    schedule: 'Tue · 12:00 PM',
    startDate: 'Nov 10',
    price: 0,
    rating: '4.9',
    students: 2100,
    seats: 20,
    description: 'A practical introduction to building things people need, with simple frameworks you can use on day one.',
    image: 'photo-1552664730-d307ca884978',
    color: 'blue',
    icon: '◉',
    tags: ['Product', 'Strategy', 'Free'],
  },
  {
    id: 'illustration',
    title: 'Illustration, every day',
    category: 'Design',
    level: 'All levels',
    instructor: 'Nina Park',
    role: 'Illustrator & educator',
    duration: '4 weeks',
    schedule: 'Sat · 11:00 AM',
    startDate: 'Nov 15',
    price: 49,
    rating: '4.9',
    students: 638,
    seats: 9,
    description: 'Make more art, worry less about the blank page, and develop a playful illustration habit in four weeks.',
    image: 'photo-1513364776144-60967b0f800f',
    color: 'yellow',
    icon: '✿',
    tags: ['Drawing', 'Creativity', 'Procreate'],
  },
  {
    id: 'mindful-leadership',
    title: 'Lead with a little more humanity',
    category: 'Personal growth',
    level: 'All levels',
    instructor: 'Alex Morgan',
    role: 'Leadership coach',
    duration: '5 weeks',
    schedule: 'Thu · 9:00 AM',
    startDate: 'Nov 18',
    price: 75,
    rating: '4.8',
    students: 541,
    seats: 6,
    description: 'Create more trust, have better conversations, and lead your team with clarity and care.',
    image: 'photo-1521737711867-e3b97375f902',
    color: 'rose',
    icon: '♡',
    tags: ['Leadership', 'Communication', 'Teams'],
  },
];

const categories = ['All courses', 'Design', 'Data & Tech', 'Writing', 'Business', 'Personal growth'];
const readStored = (key, fallback) => {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || 'null');
    if (Array.isArray(fallback)) return Array.isArray(stored) ? stored : fallback;
    if (fallback && typeof fallback === 'object') {
      return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : fallback;
    }
    return stored ?? fallback;
  } catch {
    return fallback;
  }
};
const courseLessons = (course) => course.lessons || [
  `Welcome to ${course.title}`,
  'Build your foundation',
  'Put your new skills into practice',
  'Share your work and keep going',
];
const seatsRemaining = (course, registrations) => Math.max(
  0,
  Number(course.seats || 0) - registrations.filter((registration) => registration.courseId === course.id).length,
);

function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [category, setCategory] = useState('All courses');
  const [level, setLevel] = useState('Any level');
  const [sort, setSort] = useState('Popular');
  const [search, setSearch] = useState('');
  const [courseList, setCourseList] = useState(() => readStored('commonplace-courses', courses));
  const [registrations, setRegistrations] = useState(() => readStored('commonplace-registrations', []));
  const [saved, setSaved] = useState(() => readStored('commonplace-saved', []));
  const [accounts, setAccounts] = useState(() => readStored('commonplace-accounts', []));
  const [currentUser, setCurrentUser] = useState(() => readStored('commonplace-session', null));
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [checkoutCourse, setCheckoutCourse] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pendingCourse, setPendingCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(undefined);
  const [learningRegistration, setLearningRegistration] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    localStorage.setItem('commonplace-registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('commonplace-saved', JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    localStorage.setItem('commonplace-courses', JSON.stringify(courseList));
  }, [courseList]);

  useEffect(() => {
    localStorage.setItem('commonplace-accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('commonplace-session', JSON.stringify(currentUser));
    else localStorage.removeItem('commonplace-session');
  }, [currentUser]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 3200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    if (!selectedCourse && !checkoutCourse && !authOpen && !learningRegistration) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedCourse(null);
        setCheckoutCourse(null);
        setAuthOpen(false);
        setPendingCourse(null);
        setLearningRegistration(null);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedCourse, checkoutCourse, authOpen, learningRegistration]);

  const filteredCourses = useMemo(() => {
    const myRegistrations = registrations.filter((registration) => registration.userId === currentUser?.id);
    let result = courseList.filter((course) => {
      const matchesCategory = category === 'All courses' || course.category === category;
      const matchesLevel = level === 'Any level' || course.level === level || course.level === 'All levels';
      const matchesSearch = `${course.title} ${course.instructor} ${course.category} ${course.tags.join(' ')}`
        .toLowerCase()
        .includes(search.toLowerCase().trim());
      const matchesSaved = activeTab !== 'saved' || saved.includes(course.id);
      const matchesTab = activeTab !== 'learning' || myRegistrations.some((registration) => registration.courseId === course.id);
      return matchesCategory && matchesLevel && matchesSearch && matchesSaved && matchesTab;
    });
    if (sort === 'Price: low to high') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'Starting soon') result = [...result].sort((a, b) => new Date(`2026 ${a.startDate}`) - new Date(`2026 ${b.startDate}`));
    if (sort === 'Popular') result = [...result].sort((a, b) => b.students - a.students);
    return result;
  }, [activeTab, category, courseList, currentUser, level, registrations, saved, search, sort]);

  const closeModals = () => {
    setSelectedCourse(null);
    setCheckoutCourse(null);
    setAuthOpen(false);
    setPendingCourse(null);
    setLearningRegistration(null);
  };

  const toggleSaved = (courseId) => {
    setSaved((current) => current.includes(courseId)
      ? current.filter((id) => id !== courseId)
      : [...current, courseId]);
  };

  const startRegistration = (course) => {
    setSelectedCourse(null);
    if (seatsRemaining(course, registrations) <= 0) {
      setNotice('This class is full. Please check back later.');
      return;
    }
    if (!currentUser) {
      setPendingCourse(course);
      setAuthOpen(true);
      return;
    }
    setCheckoutCourse(course);
  };

  const completeCheckout = () => {
    if (!checkoutCourse || !currentUser) return;
    if (registrations.some((registration) => registration.courseId === checkoutCourse.id && registration.userId === currentUser.id)) {
      setNotice('You are already enrolled in this class.');
      setCheckoutCourse(null);
      return;
    }
    if (seatsRemaining(checkoutCourse, registrations) <= 0) {
      setNotice('This class filled up before your enrollment could be completed.');
      setCheckoutCourse(null);
      return;
    }
    setRegistrations((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        courseId: checkoutCourse.id,
        userId: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        registeredAt: new Date().toISOString(),
        paymentStatus: checkoutCourse.price ? 'demo-paid' : 'free',
        completedLessons: [],
      },
    ]);
    setNotice(checkoutCourse.price
      ? `Demo checkout complete. No payment was collected for ${checkoutCourse.title}.`
      : `You're enrolled in ${checkoutCourse.title}.`);
    setCheckoutCourse(null);
    setActiveTab('learning');
  };

  const cancelRegistration = (course, registrationId) => {
    setRegistrations((current) => current.filter((registration) => registration.id !== registrationId));
    setNotice(`Your place in ${course.title} has been cancelled.`);
  };

  const finishAuthentication = (user) => {
    setCurrentUser(user);
    setAuthOpen(false);
    setProfileOpen(false);
    if (pendingCourse) {
      setCheckoutCourse(pendingCourse);
      setPendingCourse(null);
    } else if (user.role === 'admin') {
      setActiveTab('admin');
    }
    setNotice(`Welcome, ${user.name}.`);
  };

  const saveCourse = (course) => {
    setCourseList((current) => {
      const exists = current.some((item) => item.id === course.id);
      return exists ? current.map((item) => item.id === course.id ? course : item) : [...current, course];
    });
    setEditingCourse(undefined);
    setNotice('Course saved.');
  };

  const removeCourse = (course) => {
    if (registrations.some((registration) => registration.courseId === course.id)) {
      setNotice('This course has enrollments. Remove those enrollments before deleting it.');
      return;
    }
    setCourseList((current) => current.filter((item) => item.id !== course.id));
    setNotice('Course removed.');
  };

  const toggleLesson = (registrationId, lessonIndex) => {
    setRegistrations((current) => current.map((registration) => {
      if (registration.id !== registrationId) return registration;
      const completed = registration.completedLessons || [];
      return {
        ...registration,
        completedLessons: completed.includes(lessonIndex)
          ? completed.filter((index) => index !== lessonIndex)
          : [...completed, lessonIndex],
      };
    }));
    setLearningRegistration((current) => {
      if (!current || current.id !== registrationId) return current;
      const completed = current.completedLessons || [];
      return {
        ...current,
        completedLessons: completed.includes(lessonIndex)
          ? completed.filter((index) => index !== lessonIndex)
          : [...completed, lessonIndex],
      };
    });
  };

  const isLearning = activeTab === 'learning';
  const isAdmin = currentUser?.role === 'admin';
  const myRegistrations = registrations.filter((registration) => registration.userId === currentUser?.id);
  const enrolledCourseIds = myRegistrations.map((registration) => registration.courseId);
  const heading = activeTab === 'admin' ? 'Your course studio' : isLearning ? 'Your learning' : activeTab === 'saved' ? 'Saved for later' : 'Find your next thing';
  const subheading = isLearning
    ? currentUser ? `Welcome back, ${currentUser.name}. Keep up the good work.` : 'Sign in to see your enrolled classes and progress.'
    : activeTab === 'saved'
      ? 'A little inspiration for when you’re ready.'
      : activeTab === 'admin'
        ? 'Manage your classes and see who’s learning.'
      : 'Small classes. Big ideas. Very good use of your time.';

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setActiveTab('explore'); }}>
          <span className="brand-mark">c.</span>
          <span>commonplace</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={`nav-link ${activeTab === 'explore' ? 'active' : ''}`} onClick={() => setActiveTab('explore')}>Explore</button>
          <button className={`nav-link ${activeTab === 'learning' ? 'active' : ''}`} onClick={() => setActiveTab('learning')}>
            My learning{myRegistrations.length > 0 && <span className="nav-count">{myRegistrations.length}</span>}
          </button>
          <button className={`nav-link ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>Saved</button>
          {isAdmin && <button className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>Admin</button>}
        </nav>
        <div className="profile-wrap">
          <button className="profile-button" aria-label="Your profile" aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)}>
            <span>{currentUser?.name?.[0]?.toUpperCase() || 'J'}</span><span className="profile-caret">⌄</span>
          </button>
          {profileOpen && (
            <div className="profile-menu">
              {currentUser ? (
                <>
                  <div className="profile-summary"><strong>{currentUser.name}</strong><span>{currentUser.email}</span><small>{currentUser.role === 'admin' ? 'Demo administrator' : 'Student account'}</small></div>
                  <button onClick={() => { setCurrentUser(null); setActiveTab('explore'); setProfileOpen(false); setNotice('You have signed out.'); }}>Sign out</button>
                </>
              ) : (
                <button onClick={() => { setAuthOpen(true); setProfileOpen(false); }}>Sign in or create account</button>
              )}
            </div>
          )}
        </div>
      </header>

      <main>
        <section className={`welcome ${isLearning ? 'welcome-learning' : ''}`}>
          <div className="welcome-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> {activeTab === 'admin' ? 'YOUR CREATIVE SPACE' : 'A little room to grow'}</div>
            <h1>{heading}<span className="heading-period">.</span></h1>
            <p>{subheading}</p>
            {activeTab === 'explore' && (
              <div className="welcome-meta">
                <span className="avatar-stack"><i>m</i><i>j</i><i>a</i><i>+</i></span>
                <span><strong>2,400+</strong> curious people learning together</span>
              </div>
            )}
          </div>
          <div className="welcome-art" aria-hidden="true">
            <div className="art-sun" />
            <div className="art-ring ring-one" />
            <div className="art-ring ring-two" />
            <div className="art-spark">✳</div>
            <div className="art-label"><span>your next chapter</span><strong>starts here ↗</strong></div>
          </div>
          <div className="welcome-doodle" aria-hidden="true">✳</div>
        </section>

        {activeTab === 'admin' && isAdmin ? (
          <AdminDashboard
            courses={courseList}
            registrations={registrations}
            onAdd={() => setEditingCourse(null)}
            onEdit={setEditingCourse}
            onRemove={removeCourse}
            onCancelEnrollment={(registration) => {
              setRegistrations((current) => current.filter((item) => item.id !== registration.id));
              setNotice('Enrollment removed.');
            }}
          />
        ) : (
          <>
            <div className="section-heading">
              <div>
                <div className="section-kicker">{activeTab === 'explore' ? 'MADE FOR YOUR CURIOSITY' : isLearning ? 'KEEP YOUR MOMENTUM' : 'YOUR LITTLE SHORTLIST'}</div>
                <h2>{isLearning ? 'Picked out just for you' : activeTab === 'saved' ? 'Your saved courses' : 'Good things to learn'}</h2>
              </div>
              <div className="class-note"><span className="note-icon">✎</span><span>Small classes, <strong>real people.</strong></span></div>
            </div>
            {isLearning && currentUser && (
              <div className="student-summary">
                <div><strong>{myRegistrations.length}</strong><span>Enrolled classes</span></div>
                <div><strong>{myRegistrations.reduce((count, registration) => count + (registration.completedLessons?.length || 0), 0)}</strong><span>Lessons completed</span></div>
                <div><strong>{myRegistrations.length ? Math.round(myRegistrations.reduce((total, registration) => {
                  const course = courseList.find((item) => item.id === registration.courseId);
                  return total + ((registration.completedLessons?.length || 0) / courseLessons(course || { title: '' }).length);
                }, 0) / myRegistrations.length * 100) : 0}%</strong><span>Average progress</span></div>
              </div>
            )}
            {isLearning && !currentUser && (
              <div className="sign-in-prompt"><p>Sign in to view your enrollments and save your progress on this device.</p><button className="primary-button" onClick={() => setAuthOpen(true)}>Sign in or create account</button></div>
            )}
            <div className="catalog-layout">
          <aside className="filters" aria-label="Course filters">
            <div className="filter-title-row"><h3>Explore</h3><button className="reset-button" onClick={() => { setCategory('All courses'); setLevel('Any level'); setSearch(''); setSort('Popular'); }}>Reset</button></div>
            <label className="search-box">
              <span className="search-icon" aria-hidden="true">⌕</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search courses..." aria-label="Search courses" />
              {search && <button type="button" aria-label="Clear search" onClick={() => setSearch('')}>×</button>}
            </label>
            <div className="filter-group">
              <h4>Categories</h4>
              <div className="category-list">
                {categories.map((item, index) => (
                  <button key={item} className={`category-option ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)}>
                    <span className={`category-dot dot-${index}`} />
                    <span>{item}</span>
                    {category === item && <span className="category-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group level-group">
              <h4>Experience level</h4>
              {['Any level', 'Beginner', 'Intermediate', 'All levels'].map((item) => (
                <label key={item} className="radio-option">
                  <input type="radio" name="level" checked={level === item} onChange={() => setLevel(item)} />
                  <span className="radio-dot" />{item}
                </label>
              ))}
            </div>
            <div className="sidebar-note">
              <span className="note-spark">✳</span>
              <p>Learning looks good on you.</p>
              <span>Find a class to call your own.</span>
            </div>
          </aside>

          <section className="course-results" aria-label="Courses">
            <div className="results-toolbar">
              <span><strong>{filteredCourses.length}</strong> {filteredCourses.length === 1 ? 'class' : 'classes'} to explore</span>
              <label className="sort-select">Sort by
                <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort courses">
                  <option>Popular</option>
                  <option>Starting soon</option>
                  <option>Price: low to high</option>
                </select>
              </label>
            </div>
            {filteredCourses.length > 0 ? (
              <div className="course-grid">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    spotsLeft={seatsRemaining(course, registrations)}
                    saved={saved.includes(course.id)}
                    registered={enrolledCourseIds.includes(course.id)}
                    onSave={() => toggleSaved(course.id)}
                    onDetails={() => setSelectedCourse(course)}
                    onRegister={() => enrolledCourseIds.includes(course.id)
                      ? setLearningRegistration(myRegistrations.find((registration) => registration.courseId === course.id))
                      : startRegistration(course)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">{isLearning ? '✳' : activeTab === 'saved' ? '♡' : '⌕'}</span>
                <h3>{isLearning ? 'Your next chapter is unwritten.' : activeTab === 'saved' ? 'Nothing saved just yet.' : 'No classes found.'}</h3>
                <p>{isLearning ? 'Find a class that makes you curious and it’ll show up here.' : 'Try a different search or clear your filters to see what’s on.'}</p>
                <button className="text-button" onClick={() => { setActiveTab('explore'); setCategory('All courses'); setLevel('Any level'); setSearch(''); }}>Explore all courses <span>→</span></button>
              </div>
            )}
          </section>
        </div>
          </>
        )}
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#" onClick={(event) => event.preventDefault()}>commonplace<span>®</span></a>
        <span>Make room for what’s next.</span>
        <span className="footer-right">Made for curious people <span>✳</span></span>
      </footer>

      {selectedCourse && (
        <CourseDetails
          course={selectedCourse}
          registered={enrolledCourseIds.includes(selectedCourse.id)}
          spotsLeft={seatsRemaining(selectedCourse, registrations)}
          registration={myRegistrations.find((registration) => registration.courseId === selectedCourse.id)}
          saved={saved.includes(selectedCourse.id)}
          onClose={closeModals}
          onSave={() => toggleSaved(selectedCourse.id)}
          onRegister={() => startRegistration(selectedCourse)}
          onLearn={() => {
            setLearningRegistration(myRegistrations.find((registration) => registration.courseId === selectedCourse.id));
            setSelectedCourse(null);
          }}
          onCancel={() => {
            const enrollment = myRegistrations.find((registration) => registration.courseId === selectedCourse.id);
            if (enrollment) cancelRegistration(selectedCourse, enrollment.id);
            setSelectedCourse(null);
          }}
        />
      )}
      {checkoutCourse && (
        <CheckoutModal
          course={checkoutCourse}
          user={currentUser}
          onClose={closeModals}
          onConfirm={completeCheckout}
        />
      )}
      {authOpen && (
        <AuthModal
          accounts={accounts}
          onClose={closeModals}
          onAuthenticate={(user) => {
            if (user.id) finishAuthentication(user);
            else {
              const newUser = { ...user, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
              setAccounts((current) => [...current, newUser]);
              finishAuthentication(newUser);
            }
          }}
        />
      )}
      {editingCourse !== undefined && isAdmin && (
        <CourseEditorModal
          course={editingCourse}
          onClose={() => setEditingCourse(undefined)}
          onSave={saveCourse}
        />
      )}
      {learningRegistration && (
        <LearningModal
          course={courseList.find((item) => item.id === learningRegistration.courseId)}
          registration={learningRegistration}
          onToggleLesson={(index) => toggleLesson(learningRegistration.id, index)}
          onClose={() => setLearningRegistration(null)}
        />
      )}
      {notice && <div className="toast" role="status"><span>✓</span>{notice}</div>}
    </div>
  );
}

function CourseCard({ course, spotsLeft, saved, registered, onSave, onDetails, onRegister }) {
  return (
    <article className="course-card">
      <button className={`course-art ${course.color}`} onClick={onDetails} aria-label={`View ${course.title} details`}>
        <img src={`https://images.unsplash.com/${course.image}?auto=format&fit=crop&w=900&q=85`} alt="" loading="lazy" />
        <span className="art-overlay" />
        <span className="course-category">{course.category}</span>
        <span className="art-symbol" aria-hidden="true">{course.icon}</span>
        <span className="course-duration">{course.duration}</span>
      </button>
      <button className={`save-button ${saved ? 'is-saved' : ''}`} aria-label={saved ? 'Remove from saved courses' : 'Save course'} onClick={onSave}>
        {saved ? '♥' : '♡'}
      </button>
      <div className="card-content">
        <div className="card-rating"><span>★</span> {course.rating} <span className="rating-count">({course.students.toLocaleString()})</span></div>
        <button className="course-title" onClick={onDetails}>{course.title}</button>
        <div className="instructor-row"><span className="instructor-avatar">{course.instructor.split(' ').map((part) => part[0]).join('')}</span><span><strong>{course.instructor}</strong><small>{course.role}</small></span></div>
        <div className="card-divider" />
        <div className="card-bottom">
          <div className="course-price">{course.price === 0 ? 'Free' : `$${course.price}`}<small> / course</small></div>
          <button className={`card-cta ${registered ? 'registered' : ''}`} onClick={onRegister} disabled={!registered && spotsLeft === 0}>
            {registered ? 'Enrolled ✓' : spotsLeft === 0 ? 'Class full' : 'Join class'} <span aria-hidden="true">{registered || spotsLeft === 0 ? '' : '↗'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function CourseDetails({ course, registered, registration, spotsLeft, saved, onClose, onSave, onRegister, onLearn, onCancel }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal details-modal" role="dialog" aria-modal="true" aria-labelledby="details-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className={`details-art ${course.color}`}>
          <img src={`https://images.unsplash.com/${course.image}?auto=format&fit=crop&w=1200&q=85`} alt="" />
          <span className="details-category">{course.category}</span>
          <span className="details-symbol">{course.icon}</span>
        </div>
        <div className="details-body">
          <div className="details-rating"><span>★</span> {course.rating} · {course.students.toLocaleString()} learners</div>
          <h2 id="details-title">{course.title}</h2>
          <p className="details-description">{course.description}</p>
          <div className="details-instructor">
            <span className="instructor-avatar large">{course.instructor.split(' ').map((part) => part[0]).join('')}</span>
            <span><strong>{course.instructor}</strong><small>{course.role}</small></span>
          </div>
          <div className="details-facts">
            <span><small>STARTS</small><strong>{course.startDate}, 2026</strong></span>
            <span><small>SCHEDULE</small><strong>{course.schedule}</strong></span>
            <span><small>LEVEL</small><strong>{course.level}</strong></span>
            <span><small>SPOTS LEFT</small><strong>{spotsLeft} spots</strong></span>
          </div>
          <div className="tag-list">{course.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="details-actions">
            <button className={`secondary-button ${saved ? 'saved' : ''}`} onClick={onSave}>{saved ? '♥ Saved' : '♡ Save for later'}</button>
            {registered
              ? <>
                  <button className="primary-button" onClick={onLearn}>Continue learning <span>↗</span></button>
                  <button className="secondary-button cancel-button" onClick={onCancel}>Cancel</button>
                </>
              : <button className="primary-button" onClick={onRegister} disabled={spotsLeft === 0}>{spotsLeft === 0 ? 'Class is full' : course.price === 0 ? 'Save my free spot' : `Join class · $${course.price}`} {spotsLeft > 0 && <span>↗</span>}</button>}
          </div>
          {registered && registration && (
            <p className="details-footnote">Progress: {registration.completedLessons?.length || 0} of {courseLessons(course).length} lessons complete.</p>
          )}
          <p className="details-footnote">Small groups, thoughtful instructors, and a little room to grow.</p>
        </div>
      </section>
    </div>
  );
}

function AuthModal({ accounts, onClose, onAuthenticate }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    if (mode === 'signin') {
      const account = accounts.find((item) => item.email === normalizedEmail);
      if (!account) {
        setError('No browser-local account matches this email. Create one to continue.');
        return;
      }
      onAuthenticate(account);
      return;
    }
    if (accounts.some((item) => item.email === normalizedEmail)) {
      setError('An account already exists for this email. Switch to sign in.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    onAuthenticate({ name: name.trim(), email: normalizedEmail, role });
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal registration-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="registration-mark">c.</div>
        <div className="modal-eyebrow">YOUR ACCOUNT, ON THIS DEVICE</div>
        <h2 id="auth-title">{mode === 'signin' ? 'Welcome back.' : 'Come on in.'}</h2>
        <p className="registration-intro">This browser-only demo stores profile details on this device. It does not use passwords or provide secure production authentication.</p>
        <div className="auth-switch">
          <button className={mode === 'signin' ? 'selected' : ''} onClick={() => { setMode('signin'); setError(''); }}>Sign in</button>
          <button className={mode === 'signup' ? 'selected' : ''} onClick={() => { setMode('signup'); setError(''); }}>Create account</button>
        </div>
        <form className="registration-form" onSubmit={submit}>
          {mode === 'signup' && (
            <>
              <label>Your name<input autoFocus required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Jamie Rivera" /></label>
              <label>Choose demo access
                <select value={role} onChange={(event) => setRole(event.target.value)}>
                  <option value="student">Student</option>
                  <option value="admin">Administrator demo</option>
                </select>
              </label>
            </>
          )}
          <label>Email address<input autoFocus={mode === 'signin'} required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button submit-button" type="submit">{mode === 'signin' ? 'Sign in' : 'Create demo account'} <span>↗</span></button>
        </form>
        <p className="privacy-note">Profile data stays in this browser. Do not enter sensitive personal information.</p>
      </section>
    </div>
  );
}

function CheckoutModal({ course, user, onClose, onConfirm }) {
  if (!user) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal registration-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="registration-mark">c.</div>
        <div className="modal-eyebrow">ENROLLMENT SUMMARY</div>
        <h2 id="checkout-title">{course.price ? 'Demo checkout.' : 'Save your spot.'}</h2>
        <p className="registration-intro">Enrolling <strong>{user.name}</strong> in <strong>{course.title}</strong>.</p>
        <div className="registration-summary">
          <div><span className="summary-icon">✳</span><span><strong>{course.startDate}, 2026</strong><small>{course.schedule}</small></span></div>
          <strong className="summary-price">{course.price === 0 ? 'Free' : `$${course.price}`}</strong>
        </div>
        {course.price > 0 && <div className="demo-payment-note"><strong>Demo payment only</strong><span>No card details are requested and no money will be charged. Real payments require a secure payment provider and backend.</span></div>}
        <button className="primary-button submit-button" onClick={onConfirm}>{course.price ? 'Complete demo checkout — no charge' : 'Confirm free enrollment'} <span>↗</span></button>
        <p className="privacy-note">Your enrollment is saved in this browser only.</p>
      </section>
    </div>
  );
}

function LearningModal({ course, registration, onToggleLesson, onClose }) {
  if (!course) return null;
  const lessons = courseLessons(course);
  const completed = registration.completedLessons || [];
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal learning-modal" role="dialog" aria-modal="true" aria-labelledby="learning-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-eyebrow">YOUR CLASSROOM</div>
        <h2 id="learning-title">{course.title}</h2>
        <p className="registration-intro">Mark lessons complete as you go. Your progress is saved in this browser.</p>
        <div className="lesson-progress"><span style={{ width: `${Math.round(completed.length / lessons.length * 100)}%` }} /></div>
        <p className="lesson-count">{completed.length} of {lessons.length} lessons complete</p>
        <div className="lesson-list">
          {lessons.map((lesson, index) => (
            <label className={`lesson-row ${completed.includes(index) ? 'complete' : ''}`} key={lesson}>
              <input type="checkbox" checked={completed.includes(index)} onChange={() => onToggleLesson(index)} />
              <span className="lesson-number">{String(index + 1).padStart(2, '0')}</span>
              <span>{lesson}</span>
              <span className="lesson-check">{completed.includes(index) ? '✓' : '○'}</span>
            </label>
          ))}
        </div>
        <button className="secondary-button learning-close" onClick={onClose}>Back to my learning</button>
      </section>
    </div>
  );
}

function AdminDashboard({ courses, registrations, onAdd, onEdit, onRemove, onCancelEnrollment }) {
  const [tab, setTab] = useState('courses');
  return (
    <section className="admin-dashboard">
      <div className="admin-metrics">
        <div><span>COURSES</span><strong>{courses.length}</strong></div>
        <div><span>ENROLLMENTS</span><strong>{registrations.length}</strong></div>
        <div><span>PAID CHECKOUTS <i>(demo)</i></span><strong>{registrations.filter((item) => item.paymentStatus === 'demo-paid').length}</strong></div>
      </div>
      <div className="admin-toolbar">
        <div className="admin-tabs">
          <button className={tab === 'courses' ? 'selected' : ''} onClick={() => setTab('courses')}>Courses</button>
          <button className={tab === 'enrollments' ? 'selected' : ''} onClick={() => setTab('enrollments')}>Enrollments</button>
        </div>
        {tab === 'courses' && <button className="primary-button admin-add" onClick={onAdd}>＋ Add a course</button>}
      </div>
      {tab === 'courses' ? (
        <div className="admin-list">
          {courses.map((course) => {
            const count = registrations.filter((item) => item.courseId === course.id).length;
            return (
              <article className="admin-course-row" key={course.id}>
                <div className={`admin-course-icon ${course.color || 'sage'}`}>{course.icon || '✳'}</div>
                <div className="admin-course-name"><strong>{course.title}</strong><span>{course.category} · {course.instructor}</span></div>
                <div className="admin-course-capacity"><strong>{count} / {course.seats}</strong><span>enrolled</span></div>
                <div className="admin-course-actions"><button onClick={() => onEdit(course)}>Edit</button><button onClick={() => onRemove(course)}>Remove</button></div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="admin-list">
          {registrations.length ? registrations.map((registration) => {
            const course = courses.find((item) => item.id === registration.courseId);
            return (
              <article className="admin-course-row enrollment-row" key={registration.id}>
                <div className="instructor-avatar">{registration.name?.[0]?.toUpperCase() || '?'}</div>
                <div className="admin-course-name"><strong>{registration.name || 'Student'}</strong><span>{registration.email}</span></div>
                <div className="admin-course-name"><strong>{course?.title || 'Course removed'}</strong><span>{new Date(registration.registeredAt).toLocaleDateString()}</span></div>
                <span className={`payment-status ${registration.paymentStatus}`}>{registration.paymentStatus === 'demo-paid' ? 'Demo · no charge' : 'Free'}</span>
                <div className="admin-course-actions"><button onClick={() => onCancelEnrollment(registration)}>Remove</button></div>
              </article>
            );
          }) : <div className="admin-empty">No enrollments yet. New student registrations will appear here.</div>}
        </div>
      )}
      <p className="admin-notice">Admin tools and enrollment data are local to this browser. The admin role is for demonstration only and is not secure.</p>
    </section>
  );
}

function CourseEditorModal({ course, onClose, onSave }) {
  const [form, setForm] = useState(() => course || {
    id: crypto.randomUUID(),
    title: '',
    category: 'Design',
    level: 'Beginner',
    instructor: '',
    role: 'Course instructor',
    duration: '4 weeks',
    schedule: 'Tue · 10:00 AM',
    startDate: 'Dec 1',
    price: 0,
    rating: '5.0',
    students: 0,
    seats: 10,
    description: '',
    image: 'photo-1558655146-9f40138edfeb',
    color: 'sage',
    icon: '✳',
    tags: [],
  });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    onSave({ ...form, price: Number(form.price), seats: Number(form.seats), students: Number(form.students || 0) });
  };
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal editor-modal" role="dialog" aria-modal="true" aria-labelledby="editor-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-eyebrow">COURSE STUDIO</div>
        <h2 id="editor-title">{course ? 'Edit course.' : 'Create a course.'}</h2>
        <form className="editor-form" onSubmit={submit}>
          <label>Course title<input required value={form.title} onChange={(event) => update('title', event.target.value)} /></label>
          <div className="editor-fields">
            <label>Category<select value={form.category} onChange={(event) => update('category', event.target.value)}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Experience<select value={form.level} onChange={(event) => update('level', event.target.value)}>{['Beginner', 'Intermediate', 'All levels'].map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
          <label>Description<textarea required rows="3" value={form.description} onChange={(event) => update('description', event.target.value)} /></label>
          <div className="editor-fields">
            <label>Instructor<input required value={form.instructor} onChange={(event) => update('instructor', event.target.value)} /></label>
            <label>Instructor role<input value={form.role} onChange={(event) => update('role', event.target.value)} /></label>
          </div>
          <div className="editor-fields">
            <label>Price ($)<input type="number" min="0" step="1" value={form.price} onChange={(event) => update('price', event.target.value)} /></label>
            <label>Seats<input type="number" min="1" step="1" value={form.seats} onChange={(event) => update('seats', event.target.value)} /></label>
          </div>
          <div className="editor-fields">
            <label>Start date<input value={form.startDate} onChange={(event) => update('startDate', event.target.value)} /></label>
            <label>Schedule<input value={form.schedule} onChange={(event) => update('schedule', event.target.value)} /></label>
          </div>
          <div className="demo-payment-note"><strong>Browser-only changes</strong><span>Course edits are saved to this device and are not visible to other users.</span></div>
          <button className="primary-button submit-button" type="submit">Save course <span>↗</span></button>
        </form>
      </section>
    </div>
  );
}

export default App;
