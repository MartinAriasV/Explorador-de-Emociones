"use client";

import React from 'react';
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { UserProfile, View } from '@/lib/types';
import { BookOpen, Smile, Sparkles, Heart, BarChart, Share2, UserCircle, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AppSidebarProps {
  view: View;
  setView: (view: View) => void;
  userProfile: UserProfile;
  refs: { [key: string]: React.RefObject<HTMLLIElement> };
}

const navItems = [
  { id: 'diary', icon: BookOpen, text: 'Mi Diario', refKey: 'diaryRef' },
  { id: 'emocionario', icon: Smile, text: 'Emocionario', refKey: 'emocionarioRef' },
  { id: 'discover', icon: Sparkles, text: 'Descubrir', refKey: 'discoverRef' },
  { id: 'calm', icon: Heart, text: 'Rincón de la Calma', refKey: 'calmRef' },
  { id: 'report', icon: BarChart, text: 'Reporte Visual', refKey: 'reportRef' },
  { id: 'share', icon: Share2, text: 'Compartir Diario', refKey: 'shareRef' },
  { id: 'profile', icon: UserCircle, text: 'Mi Perfil', refKey: 'profileRef' },
] as const;

export function AppSidebar({ view, setView, userProfile, refs }: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();

  const handleItemClick = (newView: View) => {
    setView(newView);
    setOpenMobile(false);
  };
  
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
