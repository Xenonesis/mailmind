import { create } from "zustand";
import { Email, EmailCategory, User } from "@/types/email";

interface EmailState {
  emails: Email[];
  filteredEmails: Email[];
  selectedCategory: EmailCategory;
  searchQuery: string;
  isLoading: boolean;
  user: User | null;
  
  // Actions
  setEmails: (emails: Email[]) => void;
  setSelectedCategory: (category: EmailCategory) => void;
  setSearchQuery: (query: string) => void;
  setIsLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  filterEmails: () => void;
  toggleEmailStar: (emailId: string) => void;
  markEmailAsRead: (emailId: string) => void;
}

export const useEmailStore = create<EmailState>((set, get) => ({
  emails: [],
  filteredEmails: [],
  selectedCategory: "inbox",
  searchQuery: "",
  isLoading: false,
  user: null,

  setEmails: (emails) => {
    set({ emails });
    get().filterEmails();
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    get().filterEmails();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().filterEmails();
  },

  setIsLoading: (loading) => set({ isLoading: loading }),

  setUser: (user) => set({ user }),

  filterEmails: () => {
    const { emails, selectedCategory, searchQuery } = get();
    
    let filtered = emails;

    // Filter by category
    if (selectedCategory === "starred") {
      filtered = filtered.filter(email => email.isStarred);
    } else {
      filtered = filtered.filter(email => email.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(email => 
        email.subject.toLowerCase().includes(query) ||
        email.sender.name.toLowerCase().includes(query) ||
        email.sender.email.toLowerCase().includes(query) ||
        email.body.toLowerCase().includes(query)
      );
    }

    set({ filteredEmails: filtered });
  },

  toggleEmailStar: (emailId) => {
    const { emails } = get();
    const updatedEmails = emails.map(email =>
      email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
    );
    set({ emails: updatedEmails });
    get().filterEmails();
  },

  markEmailAsRead: (emailId) => {
    const { emails } = get();
    const updatedEmails = emails.map(email =>
      email.id === emailId ? { ...email, isRead: true } : email
    );
    set({ emails: updatedEmails });
    get().filterEmails();
  },
}));