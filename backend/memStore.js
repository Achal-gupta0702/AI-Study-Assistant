/**
 * In-memory data store - used when MongoDB is unavailable.
 * Provides a simple Map-based store that mimics Mongoose model behaviour
 * well enough for full demo use.
 */
const { v4: uuidv4 } = (() => {
  // Simple UUID v4 without external deps
  const fn = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return { v4: fn };
})();

const store = {
  users: new Map(),
  subjects: new Map(),
  notes: new Map(),
  quizzes: new Map(),
  flashcards: new Map(),
  studyPlans: new Map(),
  progress: new Map(),
};

// Helper: filter + sort + limit
function query(collection, filter = {}, opts = {}) {
  let results = [...collection.values()];
  for (const [k, v] of Object.entries(filter)) {
    results = results.filter(doc => {
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) return true; // skip complex
      return String(doc[k]) === String(v);
    });
  }
  if (opts.sort) {
    const [field, dir] = Object.entries(opts.sort)[0];
    results.sort((a, b) => dir === -1
      ? new Date(b[field]) - new Date(a[field])
      : new Date(a[field]) - new Date(b[field]));
  }
  if (opts.limit) results = results.slice(0, opts.limit);
  return results;
}

function makeDoc(data, id) {
  const _id = id || uuidv4();
  return { ...data, _id, createdAt: data.createdAt || new Date(), updatedAt: new Date(), id: _id };
}

const memStore = {
  isActive: false,
  store,

  // Users
  async findUser(filter) {
    for (const u of store.users.values()) {
      if (filter.email && u.email === filter.email) return u;
      if (filter._id && String(u._id) === String(filter._id)) return u;
    }
    return null;
  },
  async createUser(data) {
    const doc = makeDoc(data);
    doc.studyStreak = 0; doc.totalStudyHours = 0; doc.preferences = { difficulty: 'intermediate', notifications: true };
    store.users.set(doc._id, doc);
    return doc;
  },
  async updateUser(id, update) {
    const u = store.users.get(String(id));
    if (!u) return null;
    const updated = { ...u, ...update, updatedAt: new Date() };
    store.users.set(String(id), updated);
    return updated;
  },

  // Subjects
  async getSubjects(userId) { return query(store.subjects, {}, {sort:{createdAt:1}}).filter(s => String(s.user) === String(userId)); },
  async getSubject(id) { return store.subjects.get(String(id)) || null; },
  async createSubject(data) { const doc = makeDoc(data); store.subjects.set(doc._id, doc); return doc; },
  async updateSubject(id, data) {
    const s = store.subjects.get(String(id));
    if (!s) return null;
    const u = { ...s, ...data, updatedAt: new Date() };
    store.subjects.set(String(id), u);
    return u;
  },
  async deleteSubject(id) { store.subjects.delete(String(id)); },

  // Notes
  async getNotes(userId, filter = {}) {
    let notes = [...store.notes.values()].filter(n => String(n.user) === String(userId));
    if (filter.subject) notes = notes.filter(n => n.subject === filter.subject);
    if (filter.search) notes = notes.filter(n => (n.title+n.summary).toLowerCase().includes(filter.search.toLowerCase()));
    return notes.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  async getNote(id) { return store.notes.get(String(id)) || null; },
  async createNote(data) { const doc = makeDoc(data); store.notes.set(doc._id, doc); return doc; },
  async updateNote(id, data) {
    const n = store.notes.get(String(id)); if (!n) return null;
    const u = { ...n, ...data, updatedAt: new Date() }; store.notes.set(String(id), u); return u;
  },
  async deleteNote(id) { store.notes.delete(String(id)); },

  // Quizzes
  async getQuizzes(userId, filter={}) {
    let q = [...store.quizzes.values()].filter(q => String(q.user) === String(userId));
    if (filter.subject) q = q.filter(x => x.subject === filter.subject);
    if (filter.completed !== undefined) q = q.filter(x => x.completed === filter.completed);
    return q.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 50);
  },
  async getQuiz(id) { return store.quizzes.get(String(id)) || null; },
  async createQuiz(data) { const doc = makeDoc(data); store.quizzes.set(doc._id, doc); return doc; },
  async updateQuiz(id, data) {
    const q = store.quizzes.get(String(id)); if (!q) return null;
    const u = { ...q, ...data, updatedAt: new Date() }; store.quizzes.set(String(id), u); return u;
  },

  // Flashcards
  async getSets(userId) { return [...store.flashcards.values()].filter(f => String(f.user) === String(userId)).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)); },
  async getSet(id) { return store.flashcards.get(String(id)) || null; },
  async createSet(data) { const doc = makeDoc(data); store.flashcards.set(doc._id, doc); return doc; },
  async updateSet(id, data) {
    const s = store.flashcards.get(String(id)); if (!s) return null;
    const u = { ...s, ...data, updatedAt: new Date() }; store.flashcards.set(String(id), u); return u;
  },
  async deleteSet(id) { store.flashcards.delete(String(id)); },

  // Plans
  async getPlans(userId) { return [...store.studyPlans.values()].filter(p => String(p.user) === String(userId)).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,10); },
  async getPlan(id) { return store.studyPlans.get(String(id)) || null; },
  async createPlan(data) { const doc = makeDoc(data); store.studyPlans.set(doc._id, doc); return doc; },
  async updatePlan(id, data) {
    const p = store.studyPlans.get(String(id)); if (!p) return null;
    const u = { ...p, ...data, updatedAt: new Date() }; store.studyPlans.set(String(id), u); return u;
  },

  // Progress
  async getProgress(userId) {
    const p = [...store.progress.values()].find(p => String(p.user) === String(userId));
    if (!p) {
      const np = makeDoc({ user: userId, totalStudyHours: 0, totalQuizzesTaken: 0, avgQuizScore: 0, currentStreak: 0, longestStreak: 0, dailyLogs: [] });
      store.progress.set(np._id, np);
      return np;
    }
    return p;
  },
  async updateProgress(userId, data) {
    const p = await this.getProgress(userId);
    const u = { ...p, ...data, updatedAt: new Date() }; store.progress.set(p._id, u); return u;
  }
};

module.exports = memStore;
