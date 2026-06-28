"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { createClient } from "@/lib/supabase/client";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        console.error("AppLayout auth check error:", err);
      } finally {
        setLoading(false);
      }
    }
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Determine classes / margins based on user status
  const showSidebar = !!user;
  const mainMarginLeft = !showSidebar 
    ? "0px" 
    : collapsed 
      ? "var(--sidebar-collapsed-width)" 
      : "var(--sidebar-width)";

  return (
    <div className="container-layout">
      {/* Sidebar Navigation - Visible only to logged in users */}
      {showSidebar && (
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      )}
      
      {/* Right Column Layout */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        {/* Header Bar */}
        <TopBar collapsed={collapsed} />
        
        {/* Main Workspace */}
        <main 
          className="main-content" 
          style={{ 
            marginLeft: mainMarginLeft,
            transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
