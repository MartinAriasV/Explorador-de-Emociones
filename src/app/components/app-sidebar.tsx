"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import type { UserProfile, View, DiaryEntry } from '@/lib/types';
import { BookOpen, Smile, Sparkles, Heart, BarChart, Share2, UserCircle, Menu, Flame, LogOut, Moon, Sun, PawPrint, Gamepad2, MessageCircle, Star, Store } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFirebase } from '@/firebase';
import { calculateDailyStreak } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import useLocalStorage from '@/hooks/use-local-storage';
import { SHOP_ITEMS } from '@/lib/constants';

interface AppSidebarProps {
  view: View;
  setView: (view: View) => void;
  userProfile: UserProfile | null;
  diaryEntries: DiaryEntry[];
  refs: { [key: string]: React.RefObject<HTMLLIElement> };
}

const navItems = [
  { id: 'diary', icon: BookOpen, text: 'Mi Diario', refKey: 'diaryRef' },
  { id: 'emocionario', icon: Smile, text: 'Emocionario', refKey: 'emocionarioRef' },
  { id: 'discover', icon: Sparkles, text: 'Descubrir', refKey: 'discoverRef' },
  { id: 'games', icon: Gamepad2, text: 'Juegos', refKey: 'gamesRef' },
  { id: 'streak', icon: Flame, text: 'Racha', refKey: 'streakRef' },
  { id: 'sanctuary', icon: PawPrint, text: 'Mi Santuario', refKey: 'sanctuaryRef' },
  { id: 'pet-chat', icon: MessageCircle, text: 'Compañero IA', refKey: 'petChatRef' },
  { id: 'shop', icon: Store, text: 'Tienda', refKey: 'shopRef' },
  { id: 'calm', icon: Heart, text: 'Rincón de la Calma', refKey: 'calmRef' },
  { id: 'report', icon: BarChart, text: 'Reporte Visual', refKey: 'reportRef' },
  { id: 'share', icon: Share2, text: 'Compartir Diario', refKey: 'shareRef' },
  { id: 'profile', icon: UserCircle, text: 'Mi Perfil', refKey: 'profileRef' },
] as const;

export function AppSidebar({ view, setView, userProfile, diaryEntries = [], refs }: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();
  const { auth } = useFirebase();
  const dailyStreak = calculateDailyStreak(diaryEntries);
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'light');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleItemClick = (newView: View) => {
    setView(newView);
    setOpenMobile(false);
  };
  
  if (!userProfile) {
    // Render a loading state or a default state if userProfile is not available yet.
    return (
        <Sidebar collapsible="icon" className="shadow-lg animate-fade-in">
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

  const equippedFrameId = userProfile.equippedItems?.['avatar_frame'];
  const equippedFrame = SHOP_ITEMS.find(item => item.id === equippedFrameId);
  const frameStyle = equippedFrame ? equippedFrame.value : 'border-primary/20';

  return (
    <Sidebar collapsible="icon" className="shadow-lg animate-fade-in">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
           <div className={cn('p-1 rounded-full border-4 transition-colors', frameStyle)}>
             <Avatar className="h-12 w-12">
              {userProfile.avatarType === 'generated' ? (
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              ) : (
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">{userProfile.avatar}</AvatarFallback>
              )}
             </Avatar>
           </div>
           <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-bold text-lg text-primary">{userProfile.name}</span>
                 <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-sm text-amber-500">
                    <Flame className={cn("h-5 w-5", dailyStreak > 0 && "animate-flame")} />
                    <span className="font-bold">{dailyStreak}</span>
                    <span>días de racha</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <Star className="h-5 w-5" />
                    <span className="font-bold">{userProfile.points || 0}</span>
                    <span>puntos</span>
                  </div>
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
      <SidebarMenu className="p-4 mt-auto space-y-2">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center px-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
                <Moon className="h-5 w-5" />
                <span>Modo Oscuro</span>
            </div>
            <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                aria-label="Toggle dark mode"
            />
        </div>
        <SidebarMenuItem>
            <SidebarMenuButton onClick={() => auth.signOut()} className="text-base" tooltip="Cerrar Sesión">
                <LogOut className="h-5 w-5"/>
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
