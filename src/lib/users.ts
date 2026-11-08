import { supabase, isSupabaseConfigured } from "./supabase";

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "Biên tập viên" | "Hướng dẫn viên" | "Du khách";
  status: "Hoạt động" | "Bị khóa";
  joinedDate: string;
  avatar: string;
  source?: "online_signup" | "admin_created" | "social" | "system";
}

export const USERS_STORAGE_KEY = "huesmart-admin-users";
export const REGISTERED_USERS_KEY = "huesmart-registered-users";

export const DEFAULT_USERS: SystemUser[] = [
  {
    id: "u-1",
    name: "Nguyễn Văn Hùng",
    email: "nguyenvan123@gmail.com",
    phone: "0905 123 456",
    role: "Du khách",
    status: "Hoạt động",
    joinedDate: "15:30 hôm nay",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    source: "online_signup",
  },
  {
    id: "u-2",
    name: "Lê Thị Thảo",
    email: "thao.le@hueheritage.vn",
    phone: "0914 987 654",
    role: "Biên tập viên",
    status: "Hoạt động",
    joinedDate: "02/11/2026",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    source: "admin_created",
  },
  {
    id: "u-3",
    name: "Trần Minh Quang",
    email: "quang.tm@travelhue.com",
    phone: "0935 222 333",
    role: "Hướng dẫn viên",
    status: "Hoạt động",
    joinedDate: "28/10/2026",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    source: "admin_created",
  },
  {
    id: "u-4",
    name: "Ban Quản trị HueSmart",
    email: "admin@huesmart-travel.gov.vn",
    phone: "1900 8888",
    role: "Admin",
    status: "Hoạt động",
    joinedDate: "01/01/2026",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    source: "system",
  },
];

// Helper to create initials avatar SVG
export function generateInitialsAvatar(name: string): string {
  const clean = name.trim().toUpperCase();
  const parts = clean.split(/\s+/);
  const initials = parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : clean.slice(0, 2);
  
  // Return an SVG data URL with Hue royal violet theme
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#6d28d9"/>
        <stop offset="100%" stop-color="#a855f7"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="50" fill="url(#grad)"/>
    <text x="50" y="58" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="38" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Format current timestamp nicely in Vietnamese
export function formatCurrentTimeVietnamese(): string {
  const now = new Date();
  const time = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  return `${time} hôm nay (${date})`;
}

// Get all system users merged with all registered accounts
export function getStoredSystemUsers(): SystemUser[] {
  let list: SystemUser[] = [];

  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
  } catch (e) {
    console.error("Error reading huesmart-admin-users:", e);
  }

  // If list is empty, start with default seed
  if (list.length === 0) {
    list = [...DEFAULT_USERS];
  }

  // Check registered users list (persisted ledger)
  try {
    const regRaw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (regRaw) {
      const regList = JSON.parse(regRaw);
      if (Array.isArray(regList)) {
        regList.forEach((regUser: any) => {
          if (!regUser || !regUser.email) return;
          const exists = list.some(
            (u) => u.email.toLowerCase() === regUser.email.toLowerCase()
          );
          if (!exists) {
            list.unshift({
              id: regUser.id || `u-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              name: regUser.name || regUser.fullName || regUser.email.split("@")[0],
              email: regUser.email,
              phone: regUser.phone || "Chưa cập nhật",
              role: regUser.role || "Du khách",
              status: "Hoạt động",
              joinedDate: regUser.joinedDate || formatCurrentTimeVietnamese(),
              avatar: regUser.avatar || generateInitialsAvatar(regUser.name || regUser.email),
              source: regUser.source || "online_signup",
            });
          }
        });
      }
    }
  } catch (e) {
    console.error("Error reading huesmart-registered-users:", e);
  }

  // Check huesmart-user (current session user)
  try {
    const userRaw = localStorage.getItem("huesmart-user");
    if (userRaw) {
      const sessionUser = JSON.parse(userRaw);
      if (sessionUser && sessionUser.email) {
        const exists = list.some(
          (u) => u.email.toLowerCase() === sessionUser.email.toLowerCase()
        );
        if (!exists) {
          list.unshift({
            id: `u-${Date.now()}`,
            name: sessionUser.fullName || sessionUser.email.split("@")[0],
            email: sessionUser.email,
            phone: sessionUser.phone || "Chưa cập nhật",
            role: "Du khách",
            status: "Hoạt động",
            joinedDate: formatCurrentTimeVietnamese(),
            avatar: generateInitialsAvatar(sessionUser.fullName || sessionUser.email),
            source: "online_signup",
          });
        }
      }
    }
  } catch (e) {
    console.error("Error checking huesmart-user session:", e);
  }

  // Check huesmart-demo-user
  try {
    const demoEmail = localStorage.getItem("huesmart-demo-user");
    if (demoEmail && demoEmail.includes("@")) {
      const exists = list.some(
        (u) => u.email.toLowerCase() === demoEmail.toLowerCase()
      );
      if (!exists) {
        list.unshift({
          id: `u-demo-${Date.now()}`,
          name: demoEmail.split("@")[0].toUpperCase(),
          email: demoEmail,
          phone: "0905 xxx xxx",
          role: "Du khách",
          status: "Hoạt động",
          joinedDate: formatCurrentTimeVietnamese(),
          avatar: generateInitialsAvatar(demoEmail),
          source: "online_signup",
        });
      }
    }
  } catch (e) {
    console.error("Error checking huesmart-demo-user:", e);
  }

  // Save sanitized list back
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }

  return list;
}

// Record a new registration and immediately update Admin User Manager
export function recordUserRegistration({
  name,
  email,
  phone = "",
  role = "Du khách",
  source = "online_signup",
  avatar,
}: {
  name: string;
  email: string;
  phone?: string;
  role?: SystemUser["role"];
  source?: SystemUser["source"];
  avatar?: string;
}): SystemUser {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim() || "Chưa cập nhật";
  const userAvatar = avatar || generateInitialsAvatar(cleanName);
  const joinedDate = formatCurrentTimeVietnamese();

  const newUser: SystemUser = {
    id: `u-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    role,
    status: "Hoạt động",
    joinedDate,
    avatar: userAvatar,
    source,
  };

  // 1. Update registered users ledger
  try {
    const regRaw = localStorage.getItem(REGISTERED_USERS_KEY);
    let regList: SystemUser[] = regRaw ? JSON.parse(regRaw) : [];
    if (!Array.isArray(regList)) regList = [];

    const existingIndex = regList.findIndex(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (existingIndex >= 0) {
      regList[existingIndex] = { ...regList[existingIndex], ...newUser, id: regList[existingIndex].id };
    } else {
      regList = [newUser, ...regList];
    }
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(regList));
  } catch (e) {
    console.error("Failed to write REGISTERED_USERS_KEY:", e);
  }

  // 2. Update admin users storage
  try {
    let currentUsers = getStoredSystemUsers();
    const existingIndex = currentUsers.findIndex(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (existingIndex >= 0) {
      currentUsers[existingIndex] = {
        ...currentUsers[existingIndex],
        name: cleanName,
        phone: cleanPhone,
        avatar: userAvatar,
      };
    } else {
      currentUsers = [newUser, ...currentUsers];
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(currentUsers));
  } catch (e) {
    console.error("Failed to write USERS_STORAGE_KEY:", e);
  }

  // 3. Optional: Sync to Supabase profile if configured
  if (isSupabaseConfigured && supabase) {
    supabase
      .from("profiles")
      .upsert({
        full_name: cleanName,
        role: role === "Admin" ? "admin" : "user",
        avatar_url: userAvatar,
      })
      .then(({ error }) => {
        if (error) console.warn("Supabase profile sync:", error.message);
      });
  }

  // 4. Notify all open windows / components
  try {
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(
      new CustomEvent("huesmart-users-updated", { detail: newUser })
    );
  } catch {
    // ignore
  }

  return newUser;
}
