"use client";

import React from 'react';
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import type { UserProfile, View, DiaryEntry } from '@/lib/types';
import { BookOpen, Smile, Sparkles, Heart, BarChart, Share2, UserCircle, Menu, Flame } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFirebase } from '@/firebase';
import { calculateDailyStreak } from '@/lib/utils';
import { cn } from '@/lib/utils';


interface AppSidebarProps {
  view: View;
  setView: (view: View) => void;
  userProfile: UserProfile;
  diaryEntries: DiaryEntry[];
  refs: { [key: string]: React.RefObject<HTMLLIElement> };
}

const navItems = [
  { id: 'diary', icon: BookOpen, text: 'Mi Diario', refKey: 'diaryRef' },
  { id: 'emocionario', icon: Smile, text: 'Emocionario', refKey: 'emocionarioRef' },
  { id: 'discover', icon: Sparkles, text: 'Descubrir', refKey: 'discoverRef' },
  { id: 'streak', icon: Flame, text: 'Racha', refKey: 'streakRef' },
  { id: 'calm', icon: Heart, text: 'Rincón de la Calma', refKey: 'calmRef' },
  { id: 'report', icon: BarChart, text: 'Reporte Visual', refKey: 'reportRef' },
  { id: 'share', icon: Share2, text: 'Compartir Diario', refKey: 'shareRef' },
  { id: 'profile', icon: UserCircle, text: 'Mi Perfil', refKey: 'profileRef' },
] as const;

export function AppSidebar({ view, setView, userProfile, diaryEntries = [], refs }: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();
  const { auth } = useFirebase();
  const dailyStreak = calculateDailyStreak(diaryEntries);

  const handleItemClick = (newView: View) => {
    setView(newView);
    setOpenMobile(false);
  };
  
  if (!userProfile) {
    // Render a loading state or a default state if userProfile is not available yet.
    return (
        <Sidebar collapsible="icon" className="shadow-lg">
             <SidebarHeader className="p-4">
                 <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 bg-muted" />
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                         <span className="font-bold text-lg text-primary">Cargando...</span>
                    </div>
                 </div>
             </SidebarHeader>
        </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" className="shadow-lg">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
           <Avatar className="h-12 w-12">
            {userProfile.avatarType === 'generated' ? (
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
            ) : (
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">{userProfile.avatar}</AvatarFallback>
            )}
           </Avatar>
           <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-bold text-lg text-primary">{userProfile.name}</span>
                 <div className="flex items-center gap-1 text-sm text-amber-500">
                  <Flame className={cn("h-5 w-5", dailyStreak > 0 && "animate-flame")} />
                  <span className="font-bold">{dailyStreak}</span>
                  <span>días de racha</span>
                </div>
           </div>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1 p-4">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.id} ref={refs[item.refKey]}>
            <SidebarMenuButton
              onClick={() => handleItemClick(item.id)}
              isActive={view === item.id}
              className="text-base"
              tooltip={item.text}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.text}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarMenu className="p-4 mt-auto">
        <SidebarMenuItem>
            <SidebarMenuButton onClick={() => auth.signOut()} className="text-base">
                <span>Cerrar sesión</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </Sidebar>
  );
}

export function MobileMenuButton() {
    const { toggleSidebar } = useSidebar();
    return (
        <button onClick={toggleSidebar} className="md:hidden p-2 text-foreground">
            <Menu size={24} />
        </button>
    );
}
